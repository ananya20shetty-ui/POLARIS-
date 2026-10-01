import os
from typing import List, Optional
from fastapi import APIRouter, Depends, HTTPException, UploadFile, File, Form, Query, status
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select, or_, func

from app.core.database import get_db
from app.core.config import settings
from app.core.security import calculate_sha256
from app.core.rbac import get_current_user, require_roles, RoleEnum, CurrentUserPayload
from app.models.models import Document, DocumentChunk, Claim, Evidence, AuditLog, ActivityEvent
from app.schemas.schemas import DocumentResponse
from app.services.document_processor import document_processor

router = APIRouter(prefix="/documents", tags=["Scientific Repository"])

@router.get("", response_model=List[DocumentResponse])
async def list_documents(
    domain: Optional[str] = Query(None, description="Filter by research domain"),
    location: Optional[str] = Query(None, description="Filter by location name"),
    year: Optional[int] = Query(None, description="Filter by publication year"),
    doc_type: Optional[str] = Query(None, description="Filter by document type"),
    source_type: Optional[str] = Query(None, description="Filter by source type"),
    verification_status: Optional[str] = Query(None, description="Filter by verification status"),
    search: Optional[str] = Query(None, description="Search query string"),
    skip: int = 0,
    limit: int = 50,
    db: AsyncSession = Depends(get_db)
):
    query = select(Document)

    if domain:
        query = query.filter(Document.research_domain.ilike(f"%{domain}%"))
    if location:
        query = query.filter(Document.location_name.ilike(f"%{location}%"))
    if year:
        query = query.filter(Document.year == year)
    if doc_type:
        query = query.filter(Document.document_type == doc_type)
    if source_type:
        query = query.filter(Document.source_type == source_type)
    if verification_status:
        query = query.filter(Document.verification_status == verification_status)
    if search:
        search_pattern = f"%{search}%"
        query = query.filter(
            or_(
                Document.title.ilike(search_pattern),
                Document.abstract.ilike(search_pattern),
                Document.methodology.ilike(search_pattern)
            )
        )

    query = query.order_by(Document.year.desc().nullslast()).offset(skip).limit(limit)
    result = await db.execute(query)
    docs = result.scalars().all()
    return docs

@router.get("/{document_id}", response_model=DocumentResponse)
async def get_document(document_id: str, db: AsyncSession = Depends(get_db)):
    result = await db.execute(select(Document).filter_by(id=document_id))
    doc = result.scalar_one_or_none()
    if not doc:
        raise HTTPException(status_code=404, detail="Scientific document not found")
    return doc

@router.post("", response_model=DocumentResponse)
async def upload_document(
    title: str = Form(...),
    research_domain: str = Form(...),
    document_type: str = Form("Research Paper"),
    authors: str = Form(""),  # Comma separated
    abstract: Optional[str] = Form(None),
    location_name: Optional[str] = Form(None),
    year: Optional[int] = Form(2024),
    source_type: str = Form("USER_UPLOADED"),
    methodology: Optional[str] = Form(None),
    doi: Optional[str] = Form(None),
    file: Optional[UploadFile] = File(None),
    current_user: CurrentUserPayload = Depends(require_roles([RoleEnum.RESEARCHER, RoleEnum.REVIEWER, RoleEnum.ADMIN])),
    db: AsyncSession = Depends(get_db)
):
    os.makedirs(settings.UPLOAD_DIR, exist_ok=True)
    
    file_bytes = b""
    sha256_hash = None
    saved_path = None
    file_size = 0

    if file:
        file_bytes = await file.read()
        file_size = len(file_bytes)
        sha256_hash = calculate_sha256(file_bytes)
        
        # Save file to upload directory
        clean_filename = f"{sha256_hash[:16]}_{file.filename}"
        saved_path = os.path.join(settings.UPLOAD_DIR, clean_filename)
        with open(saved_path, "wb") as f:
            f.write(file_bytes)

    author_list = [a.strip() for a in authors.split(",") if a.strip()] if authors else [current_user.full_name or "Researcher"]

    doc = Document(
        title=title,
        authors=author_list,
        institution=current_user.institution or "National Centre for Polar and Ocean Research",
        year=year,
        document_type=document_type,
        research_domain=research_domain,
        abstract=abstract,
        location_name=location_name,
        methodology=methodology,
        doi=doi,
        source_type=source_type,
        file_path=saved_path,
        file_size_bytes=file_size,
        file_hash_sha256=sha256_hash,
        processing_status="PROCESSING",
        verification_status="UNDER_REVIEW",
        uploader_id=current_user.user_id
    )
    db.add(doc)
    await db.commit()
    await db.refresh(doc)

    # Process Document Intelligence Asynchronously
    try:
        await document_processor.process_document_content(db, doc, file_bytes=file_bytes if file_bytes else None)
    except Exception as e:
        doc.processing_status = "FAILED"
        await db.commit()

    # Create Activity and Audit Records
    activity = ActivityEvent(
        event_type="DOCUMENT_UPLOADED",
        actor_name=current_user.full_name or current_user.email,
        target_type="DOCUMENT",
        target_id=doc.id,
        target_title=doc.title,
        details={"sha256": sha256_hash, "domain": research_domain}
    )
    db.add(activity)

    audit = AuditLog(
        user_id=current_user.user_id,
        action="UPLOAD_DOCUMENT",
        resource=f"DOCUMENT:{doc.id}",
        details=f"Uploaded document '{doc.title}' with SHA-256 {sha256_hash}"
    )
    db.add(audit)
    await db.commit()
    await db.refresh(doc)

    return doc

@router.post("/{document_id}/process")
async def trigger_document_processing(
    document_id: str,
    current_user: CurrentUserPayload = Depends(require_roles([RoleEnum.RESEARCHER, RoleEnum.REVIEWER, RoleEnum.ADMIN])),
    db: AsyncSession = Depends(get_db)
):
    result = await db.execute(select(Document).filter_by(id=document_id))
    doc = result.scalar_one_or_none()
    if not doc:
        raise HTTPException(status_code=404, detail="Document not found")

    file_bytes = None
    if doc.file_path and os.path.exists(doc.file_path):
        with open(doc.file_path, "rb") as f:
            file_bytes = f.read()

    res = await document_processor.process_document_content(db, doc, file_bytes=file_bytes)
    return res
