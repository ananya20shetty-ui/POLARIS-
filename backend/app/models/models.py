import uuid
from datetime import datetime, timezone
from sqlalchemy import (
    Column, String, Text, Integer, Float, Boolean, DateTime, ForeignKey, JSON
)
from sqlalchemy.orm import relationship
from app.core.database import Base

def gen_uuid():
    return str(uuid.uuid4())

def utc_now():
    return datetime.now(timezone.utc)

class User(Base):
    __tablename__ = "users"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    email = Column(String(255), unique=True, index=True, nullable=False)
    hashed_password = Column(String(255), nullable=False)
    full_name = Column(String(255), nullable=False)
    role = Column(String(50), default="PUBLIC", nullable=False)  # PUBLIC, STUDENT, RESEARCHER, REVIEWER, ADMIN
    institution = Column(String(255), nullable=True)
    is_active = Column(Boolean, default=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    documents = relationship("Document", back_populates="uploader")
    reviews = relationship("Review", back_populates="reviewer")
    user_progress = relationship("UserProgress", back_populates="user")
    bookmarks = relationship("Bookmark", back_populates="user")

class Institution(Base):
    __tablename__ = "institutions"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    name = Column(String(255), nullable=False, unique=True)
    code = Column(String(50), nullable=True)
    country = Column(String(100), default="India")
    website = Column(String(255), nullable=True)
    description = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)

class Researcher(Base):
    __tablename__ = "researchers"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    name = Column(String(255), nullable=False)
    orcid = Column(String(50), nullable=True, unique=True)
    institution_id = Column(String(36), ForeignKey("institutions.id"), nullable=True)
    domains = Column(JSON, default=list)  # ["Cryosphere", "Oceanography"]
    bio = Column(Text, nullable=True)
    source_attribution = Column(String(255), default="NCPOR / MoES Official Directory")
    created_at = Column(DateTime(timezone=True), default=utc_now)

class Expedition(Base):
    __tablename__ = "expeditions"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    name = Column(String(255), nullable=False)
    code = Column(String(100), unique=True, nullable=False)  # e.g., "ISEA-42", "ARCTIC-2023"
    region = Column(String(100), nullable=False)  # "Antarctic", "Arctic", "Southern Ocean", "Himalaya"
    year = Column(Integer, nullable=False)
    start_date = Column(String(50), nullable=True)
    end_date = Column(String(50), nullable=True)
    lead_agency = Column(String(255), default="National Centre for Polar and Ocean Research (NCPOR)")
    stations = Column(JSON, default=list)  # ["Maitri", "Bharati"]
    description = Column(Text, nullable=True)
    objectives = Column(JSON, default=list)
    vessel_or_base = Column(String(255), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    documents = relationship("Document", back_populates="expedition")
    datasets = relationship("Dataset", back_populates="expedition")

class Location(Base):
    __tablename__ = "locations"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    name = Column(String(255), nullable=False)
    region = Column(String(100), nullable=False)  # Antarctic, Arctic, Southern Ocean, Himalaya
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    description = Column(Text, nullable=True)

class Station(Base):
    __tablename__ = "stations"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    name = Column(String(255), nullable=False)
    code = Column(String(50), nullable=True)
    region = Column(String(100), nullable=False)
    operator_country = Column(String(100), default="India")
    established_year = Column(Integer, nullable=True)
    status = Column(String(50), default="OPERATIONAL")  # OPERATIONAL, SEASONAL, DECOMMISSIONED
    latitude = Column(Float, nullable=False)
    longitude = Column(Float, nullable=False)
    elevation_m = Column(Float, nullable=True)
    science_disciplines = Column(JSON, default=list)
    description = Column(Text, nullable=True)

class Document(Base):
    __tablename__ = "documents"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    title = Column(String(500), nullable=False, index=True)
    authors = Column(JSON, default=list)  # ["Dr. A. Sharma", "Dr. S. Nair"]
    institution = Column(String(255), default="National Centre for Polar and Ocean Research (NCPOR)")
    publication_date = Column(String(50), nullable=True)
    year = Column(Integer, nullable=True, index=True)
    document_type = Column(String(100), default="Research Paper")  # Expedition Report, Research Paper, Scientific Dataset...
    research_domain = Column(String(100), index=True)  # Cryosphere, Glaciology, Oceanography, Atmospheric Sciences...
    keywords = Column(JSON, default=list)
    abstract = Column(Text, nullable=True)
    doi = Column(String(150), nullable=True)
    source_url = Column(String(500), nullable=True)
    license = Column(String(100), default="CC-BY-4.0")
    
    expedition_id = Column(String(36), ForeignKey("expeditions.id"), nullable=True)
    location_name = Column(String(255), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    temporal_coverage_start = Column(String(50), nullable=True)
    temporal_coverage_end = Column(String(50), nullable=True)
    
    methodology = Column(Text, nullable=True)
    instruments = Column(JSON, default=list)
    dataset_references = Column(JSON, default=list)
    code_availability = Column(String(50), default="Unknown")  # Available, Not found, Unknown
    raw_data_availability = Column(String(50), default="Unknown")  # Available, Not found, Unknown
    
    version = Column(String(20), default="1.0")
    uploader_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    source_type = Column(String(50), default="OFFICIAL")  # OFFICIAL, OPEN_ACCESS, USER_UPLOADED, EXTERNAL_REFERENCE, SYNTHETIC_TEST
    
    file_path = Column(String(500), nullable=True)
    file_size_bytes = Column(Integer, default=0)
    file_hash_sha256 = Column(String(64), nullable=True)
    
    processing_status = Column(String(50), default="INDEXED")  # UPLOADED, PROCESSING, EXTRACTING, INDEXED, NEEDS_REVIEW, FAILED
    verification_status = Column(String(50), default="VERIFIED")  # VERIFIED, UNVERIFIED, PEER_REVIEWED, UNDER_REVIEW
    
    citation_count = Column(Integer, default=0)
    citation_trajectory_json = Column(JSON, default=list)  # [{"period": "2018-2021", "rate": 0.1}, ...]
    
    created_at = Column(DateTime(timezone=True), default=utc_now)
    updated_at = Column(DateTime(timezone=True), default=utc_now, onupdate=utc_now)

    uploader = relationship("User", back_populates="documents")
    expedition = relationship("Expedition", back_populates="documents")
    chunks = relationship("DocumentChunk", back_populates="document", cascade="all, delete-orphan")
    claims = relationship("Claim", back_populates="document", cascade="all, delete-orphan")

class DocumentChunk(Base):
    __tablename__ = "document_chunks"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    document_id = Column(String(36), ForeignKey("documents.id"), nullable=False)
    chunk_index = Column(Integer, nullable=False)
    page_number = Column(Integer, default=1)
    section_title = Column(String(255), nullable=True)
    content = Column(Text, nullable=False)
    embedding_json = Column(JSON, nullable=True)  # List of floats or vector
    created_at = Column(DateTime(timezone=True), default=utc_now)

    document = relationship("Document", back_populates="chunks")

class ResearchQuestion(Base):
    __tablename__ = "research_questions"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    title = Column(String(500), nullable=False)
    slug = Column(String(255), unique=True, nullable=False)
    domain = Column(String(100), nullable=False)
    description = Column(Text, nullable=True)
    historical_context = Column(Text, nullable=True)
    current_status = Column(String(100), default="Active Investigation")
    subquestions = Column(JSON, default=list)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    claims = relationship("Claim", back_populates="research_question")

class Claim(Base):
    __tablename__ = "claims"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    document_id = Column(String(36), ForeignKey("documents.id"), nullable=False)
    research_question_id = Column(String(36), ForeignKey("research_questions.id"), nullable=True)
    
    subject = Column(String(255), nullable=False)  # e.g., "Antarctic Sea Ice Extent", "Schirmacher Oasis Glacier Mass"
    observation = Column(String(255), nullable=False)  # e.g., "Declined by 1.8% per decade", "Stable mass balance observed"
    direction = Column(String(50), nullable=True)  # "DECREASE", "INCREASE", "STABLE", "FLUCTUATING", "CYCLIC"
    
    time_start = Column(Integer, nullable=True)  # Year start e.g. 2010
    time_end = Column(Integer, nullable=True)    # Year end e.g. 2020
    season = Column(String(50), default="Annual")  # Austral Summer, Austral Winter, Annual...
    
    location = Column(String(255), nullable=False)  # e.g., "Weddell Sea", "Prydz Bay", "Schirmacher Oasis"
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    
    method = Column(String(255), nullable=True)  # e.g., "CryoSat-2 SAR Interferometry", "Ground Penetrating Radar"
    instrument = Column(String(255), nullable=True)  # e.g., "SIRAL Altimeter", "MODIS Spectral Radiometer"
    
    source_page = Column(Integer, default=1)
    source_text_span = Column(Text, nullable=False)  # Grounding quote
    
    confidence = Column(String(50), default="HIGH")  # HIGH, MEDIUM, LOW
    ai_confidence_score = Column(Float, default=0.92)
    verification_status = Column(String(50), default="VERIFIED")  # VERIFIED, UNVERIFIED, FLAGGED
    human_review_status = Column(String(50), default="ACCEPTED")  # PENDING, ACCEPTED, EDITED, REJECTED
    
    created_at = Column(DateTime(timezone=True), default=utc_now)

    document = relationship("Document", back_populates="claims")
    research_question = relationship("ResearchQuestion", back_populates="claims")
    evidence_items = relationship("Evidence", back_populates="claim", cascade="all, delete-orphan")

class Dataset(Base):
    __tablename__ = "datasets"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    title = Column(String(500), nullable=False)
    code = Column(String(100), unique=True, nullable=False)  # e.g., "NCPOR-DS-2021-094"
    expedition_id = Column(String(36), ForeignKey("expeditions.id"), nullable=True)
    
    collection_start = Column(String(50), nullable=True)
    collection_end = Column(String(50), nullable=True)
    
    location_name = Column(String(255), nullable=True)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    
    instrument = Column(String(255), nullable=True)
    calibration_info = Column(Text, nullable=True)
    processing_steps = Column(Text, nullable=True)
    
    file_path = Column(String(500), nullable=True)
    file_size_bytes = Column(Integer, default=0)
    file_hash_sha256 = Column(String(64), nullable=True)
    
    version = Column(String(20), default="1.0")
    data_format = Column(String(50), default="CSV / NetCDF")
    license = Column(String(100), default="MoES Open Polar Data License")
    variables = Column(JSON, default=list)  # ["ice_thickness_m", "surface_temp_c", "salinity_psu"]
    
    created_at = Column(DateTime(timezone=True), default=utc_now)

    expedition = relationship("Expedition", back_populates="datasets")
    evidence_links = relationship("Evidence", back_populates="dataset")

class Evidence(Base):
    __tablename__ = "evidence"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    claim_id = Column(String(36), ForeignKey("claims.id"), nullable=False)
    document_id = Column(String(36), ForeignKey("documents.id"), nullable=False)
    dataset_id = Column(String(36), ForeignKey("datasets.id"), nullable=True)
    
    measurement = Column(String(255), nullable=False)  # e.g., "-1.42 ± 0.18 m reduction"
    sample_size = Column(String(100), nullable=True)   # e.g., "N = 1,480 satellite transects"
    uncertainty = Column(String(100), nullable=True)   # e.g., "95% CI [± 0.18 m]"
    statistical_test = Column(String(150), nullable=True)  # e.g., "Mann-Kendall Trend Analysis (p < 0.01)"
    
    raw_values = Column(JSON, default=list)
    source_page = Column(Integer, default=1)
    source_text = Column(Text, nullable=False)
    
    verification_status = Column(String(50), default="VERIFIED")
    created_at = Column(DateTime(timezone=True), default=utc_now)

    claim = relationship("Claim", back_populates="evidence_items")
    dataset = relationship("Dataset", back_populates="evidence_links")

class EvidenceComparison(Base):
    __tablename__ = "evidence_comparisons"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    title = Column(String(500), nullable=False)
    claim_a_id = Column(String(36), ForeignKey("claims.id"), nullable=False)
    claim_b_id = Column(String(36), ForeignKey("claims.id"), nullable=False)
    research_question_id = Column(String(36), ForeignKey("research_questions.id"), nullable=True)
    
    topic = Column(String(255), nullable=False)
    variable = Column(String(255), nullable=False)
    
    potential_disagreement = Column(String(50), default="MEDIUM")  # HIGH, MEDIUM, LOW, COMPATIBLE
    
    location_match = Column(String(50), default="DIFFERENT")   # EXACT, OVERLAPPING, DIFFERENT
    period_match = Column(String(50), default="PARTIAL")       # EXACT, PARTIAL, DISJOINT
    season_match = Column(String(50), default="DIFFERENT")     # EXACT, COMPARABLE, DIFFERENT, UNKNOWN
    method_match = Column(String(50), default="DIFFERENT")     # EXACT, SIMILAR, DIFFERENT
    instrument_match = Column(String(50), default="DIFFERENT") # EXACT, SIMILAR, DIFFERENT
    
    contextual_explanation = Column(Text, nullable=False)
    polaris_heuristic_score = Column(Float, default=62.5)  # 0 to 100 compatibility heuristic
    score_breakdown = Column(JSON, default=dict)
    
    created_at = Column(DateTime(timezone=True), default=utc_now)

    stress_tests = relationship("StressTest", back_populates="comparison", cascade="all, delete-orphan")

class StressTest(Base):
    __tablename__ = "stress_tests"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    comparison_id = Column(String(36), ForeignKey("evidence_comparisons.id"), nullable=False)
    title = Column(String(500), nullable=False)
    
    # Sensitivities for each contextual variable
    variable_sensitivities = Column(JSON, default=list)
    # e.g.: [
    #   {"variable": "LOCATION", "influence": "HIGH", "weight": 0.35, "description": "Studies observe Weddell Sea vs Amundsen Sea..."},
    #   {"variable": "TIME_PERIOD", "influence": "MEDIUM", "weight": 0.25, ...},
    #   {"variable": "METHOD", "influence": "MEDIUM", "weight": 0.20, ...},
    #   {"variable": "SEASON", "influence": "LOW", "weight": 0.20, ...}
    # ]
    
    dominant_influential_variable = Column(String(100), default="LOCATION")
    explanation = Column(Text, nullable=False)
    
    evidence_gap_description = Column(Text, nullable=False)
    recommended_dataset_code = Column(String(100), nullable=True)
    recommended_dataset_title = Column(String(500), nullable=True)
    
    created_at = Column(DateTime(timezone=True), default=utc_now)

    comparison = relationship("EvidenceComparison", back_populates="stress_tests")
    evidence_gaps = relationship("EvidenceGap", back_populates="stress_test", cascade="all, delete-orphan")

class EvidenceGap(Base):
    __tablename__ = "evidence_gaps"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    stress_test_id = Column(String(36), ForeignKey("stress_tests.id"), nullable=False)
    gap_type = Column(String(100), nullable=False)  # "SPATIAL_DISCONNECT", "TEMPORAL_OFFSET", "INSTRUMENT_CALIBRATION"
    missing_dimensions = Column(JSON, default=list)  # ["Same Austral Winter Season", "Prydz Bay high-resolution mooring"]
    description = Column(Text, nullable=False)
    suggested_queries = Column(JSON, default=list)
    matching_datasets = Column(JSON, default=list)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    stress_test = relationship("StressTest", back_populates="evidence_gaps")

class ProvenanceRecord(Base):
    __tablename__ = "provenance_records"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    entity_type = Column(String(100), nullable=False)  # "DOCUMENT", "DATASET", "CLAIM", "COMPARISON"
    entity_id = Column(String(36), nullable=False, index=True)
    activity_type = Column(String(100), nullable=False)  # "INGESTION", "EXTRACTION", "HUMAN_VERIFICATION", "COMPARISON_GENERATION"
    agent_id = Column(String(255), nullable=False)
    agent_role = Column(String(100), nullable=False)
    previous_hash = Column(String(64), nullable=True)
    current_hash = Column(String(64), nullable=False)
    prov_graph = Column(JSON, default=dict)  # W3C PROV structured JSON
    timestamp = Column(DateTime(timezone=True), default=utc_now)

class Review(Base):
    __tablename__ = "reviews"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    entity_type = Column(String(100), nullable=False)  # "CLAIM", "COMPARISON", "DOCUMENT_METADATA"
    entity_id = Column(String(36), nullable=False, index=True)
    reviewer_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    decision = Column(String(50), nullable=False)  # ACCEPT, REJECT, EDIT, NEEDS_EXPERT_REVIEW
    original_output = Column(JSON, nullable=True)
    edited_output = Column(JSON, nullable=True)
    review_reason = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    reviewer = relationship("User", back_populates="reviews")

class LearningPath(Base):
    __tablename__ = "learning_paths"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    title = Column(String(255), nullable=False)
    slug = Column(String(255), unique=True, nullable=False)
    level = Column(String(50), default="Undergraduate")  # Beginner, School, Undergraduate, Research
    domain = Column(String(100), nullable=False)
    description = Column(Text, nullable=False)
    estimated_hours = Column(Float, default=2.5)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    modules = relationship("LearningModule", back_populates="learning_path", cascade="all, delete-orphan")

class LearningModule(Base):
    __tablename__ = "learning_modules"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    learning_path_id = Column(String(36), ForeignKey("learning_paths.id"), nullable=False)
    order_index = Column(Integer, nullable=False)
    title = Column(String(255), nullable=False)
    content_markdown = Column(Text, nullable=False)
    linked_document_ids = Column(JSON, default=list)
    linked_claim_ids = Column(JSON, default=list)
    quiz_questions = Column(JSON, default=list)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    learning_path = relationship("LearningPath", back_populates="modules")

class UserProgress(Base):
    __tablename__ = "user_progress"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    learning_module_id = Column(String(36), ForeignKey("learning_modules.id"), nullable=False)
    completed = Column(Boolean, default=False)
    quiz_score = Column(Float, nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)

    user = relationship("User", back_populates="user_progress")

class Bookmark(Base):
    __tablename__ = "bookmarks"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    user_id = Column(String(36), ForeignKey("users.id"), nullable=False)
    entity_type = Column(String(100), nullable=False)  # DOCUMENT, CLAIM, COMPARISON, DATASET, EXPEDITION
    entity_id = Column(String(36), nullable=False)
    notes = Column(Text, nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)

    user = relationship("User", back_populates="bookmarks")

class ActivityEvent(Base):
    __tablename__ = "activity_events"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    event_type = Column(String(100), nullable=False)  # DOCUMENT_INDEXED, EVIDENCE_VERIFIED, COMPARISON_STRESSED, DATASET_LINKED
    actor_name = Column(String(255), default="System AI Pipeline")
    target_type = Column(String(100), nullable=False)
    target_id = Column(String(36), nullable=False)
    target_title = Column(String(500), nullable=False)
    details = Column(JSON, default=dict)
    created_at = Column(DateTime(timezone=True), default=utc_now)

class AuditLog(Base):
    __tablename__ = "audit_logs"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    user_id = Column(String(36), nullable=True)
    action = Column(String(100), nullable=False)
    resource = Column(String(255), nullable=False)
    ip_address = Column(String(50), default="127.0.0.1")
    status = Column(String(50), default="SUCCESS")
    details = Column(Text, nullable=True)
    timestamp = Column(DateTime(timezone=True), default=utc_now)

class MediaAsset(Base):
    __tablename__ = "media_assets"

    id = Column(String(36), primary_key=True, default=gen_uuid)
    title = Column(String(255), nullable=False)
    media_type = Column(String(50), default="IMAGE")  # IMAGE, VIDEO, AUDIO
    file_path = Column(String(500), nullable=False)
    file_hash_sha256 = Column(String(64), nullable=False)
    exif_metadata = Column(JSON, default=dict)
    latitude = Column(Float, nullable=True)
    longitude = Column(Float, nullable=True)
    captured_at = Column(String(50), nullable=True)
    cv_quality_score = Column(Float, nullable=True)
    cv_labels = Column(JSON, default=list)  # ["Sea Ice Shelf", "Field Camp Maitri"]
    verification_status = Column(String(50), default="METADATA_VERIFIED")
    uploader_id = Column(String(36), ForeignKey("users.id"), nullable=True)
    created_at = Column(DateTime(timezone=True), default=utc_now)
