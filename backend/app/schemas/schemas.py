from pydantic import BaseModel, EmailStr, Field
from typing import List, Optional, Dict, Any
from datetime import datetime

# --- Auth Schemas ---
class UserRegister(BaseModel):
    email: EmailStr
    password: str = Field(..., min_length=6)
    full_name: str
    role: Optional[str] = "RESEARCHER"
    institution: Optional[str] = "National Centre for Polar and Ocean Research"

class UserLogin(BaseModel):
    email: EmailStr
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str = "bearer"
    role: str
    user_id: str
    full_name: str

class UserResponse(BaseModel):
    id: str
    email: str
    full_name: str
    role: str
    institution: Optional[str] = None
    created_at: datetime
    class Config:
        from_attributes = True

# --- Document Schemas ---
class DocumentCreate(BaseModel):
    title: str
    authors: List[str] = []
    institution: Optional[str] = "NCPOR"
    publication_date: Optional[str] = None
    year: Optional[int] = None
    document_type: Optional[str] = "Research Paper"
    research_domain: str
    keywords: List[str] = []
    abstract: Optional[str] = None
    doi: Optional[str] = None
    source_url: Optional[str] = None
    license: Optional[str] = "CC-BY-4.0"
    expedition_id: Optional[str] = None
    location_name: Optional[str] = None
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    temporal_coverage_start: Optional[str] = None
    temporal_coverage_end: Optional[str] = None
    methodology: Optional[str] = None
    instruments: List[str] = []
    code_availability: Optional[str] = "Unknown"
    raw_data_availability: Optional[str] = "Unknown"
    source_type: Optional[str] = "OFFICIAL"

class DocumentResponse(BaseModel):
    id: str
    title: str
    authors: List[str]
    institution: Optional[str]
    publication_date: Optional[str]
    year: Optional[int]
    document_type: str
    research_domain: str
    keywords: List[str]
    abstract: Optional[str]
    doi: Optional[str]
    source_url: Optional[str]
    license: Optional[str]
    expedition_id: Optional[str]
    location_name: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
    temporal_coverage_start: Optional[str]
    temporal_coverage_end: Optional[str]
    methodology: Optional[str]
    instruments: List[str]
    dataset_references: List[str]
    code_availability: str
    raw_data_availability: str
    version: str
    source_type: str
    file_path: Optional[str]
    file_size_bytes: int
    file_hash_sha256: Optional[str]
    processing_status: str
    verification_status: str
    citation_count: int
    citation_trajectory_json: List[Dict[str, Any]]
    created_at: datetime
    class Config:
        from_attributes = True

# --- Claim & Evidence Schemas ---
class ClaimCreate(BaseModel):
    document_id: str
    subject: str
    observation: str
    direction: Optional[str] = "DECREASE"
    time_start: Optional[int] = None
    time_end: Optional[int] = None
    season: Optional[str] = "Annual"
    location: str
    latitude: Optional[float] = None
    longitude: Optional[float] = None
    method: Optional[str] = None
    instrument: Optional[str] = None
    source_page: int = 1
    source_text_span: str
    confidence: Optional[str] = "HIGH"

class EvidenceResponse(BaseModel):
    id: str
    claim_id: str
    document_id: str
    dataset_id: Optional[str]
    measurement: str
    sample_size: Optional[str]
    uncertainty: Optional[str]
    statistical_test: Optional[str]
    source_page: int
    source_text: str
    verification_status: str
    created_at: datetime
    class Config:
        from_attributes = True

class ClaimResponse(BaseModel):
    id: str
    document_id: str
    research_question_id: Optional[str]
    subject: str
    observation: str
    direction: Optional[str]
    time_start: Optional[int]
    time_end: Optional[int]
    season: Optional[str]
    location: str
    latitude: Optional[float]
    longitude: Optional[float]
    method: Optional[str]
    instrument: Optional[str]
    source_page: int
    source_text_span: str
    confidence: str
    ai_confidence_score: float
    verification_status: str
    human_review_status: str
    created_at: datetime
    evidence_items: List[EvidenceResponse] = []
    class Config:
        from_attributes = True

# --- Comparison & Stress Test Schemas ---
class ComparisonCreateRequest(BaseModel):
    claim_a_id: str
    claim_b_id: str

class ComparisonResponse(BaseModel):
    id: str
    title: str
    claim_a_id: str
    claim_b_id: str
    research_question_id: Optional[str]
    topic: str
    variable: str
    potential_disagreement: str
    location_match: str
    period_match: str
    season_match: str
    method_match: str
    instrument_match: str
    contextual_explanation: str
    polaris_heuristic_score: float
    score_breakdown: Dict[str, Any]
    created_at: datetime
    class Config:
        from_attributes = True

class StressTestCreateRequest(BaseModel):
    comparison_id: str
    override_location: Optional[bool] = False
    override_period: Optional[bool] = False
    override_season: Optional[bool] = False
    override_method: Optional[bool] = False

class StressTestResponse(BaseModel):
    id: str
    comparison_id: str
    title: str
    variable_sensitivities: List[Dict[str, Any]]
    dominant_influential_variable: str
    explanation: str
    evidence_gap_description: str
    recommended_dataset_code: Optional[str]
    recommended_dataset_title: Optional[str]
    created_at: datetime
    class Config:
        from_attributes = True

# --- Research Question & Timeline Schemas ---
class ResearchQuestionResponse(BaseModel):
    id: str
    title: str
    slug: str
    domain: str
    description: Optional[str]
    historical_context: Optional[str]
    current_status: str
    subquestions: List[str]
    created_at: datetime
    class Config:
        from_attributes = True

# --- Expedition & Dataset Schemas ---
class ExpeditionResponse(BaseModel):
    id: str
    name: str
    code: str
    region: str
    year: int
    start_date: Optional[str]
    end_date: Optional[str]
    lead_agency: str
    stations: List[str]
    description: Optional[str]
    objectives: List[str]
    vessel_or_base: Optional[str]
    created_at: datetime
    class Config:
        from_attributes = True

class DatasetResponse(BaseModel):
    id: str
    title: str
    code: str
    expedition_id: Optional[str]
    collection_start: Optional[str]
    collection_end: Optional[str]
    location_name: Optional[str]
    latitude: Optional[float]
    longitude: Optional[float]
    instrument: Optional[str]
    calibration_info: Optional[str]
    processing_steps: Optional[str]
    file_path: Optional[str]
    file_size_bytes: int
    file_hash_sha256: Optional[str]
    version: str
    data_format: str
    license: str
    variables: List[str]
    created_at: datetime
    class Config:
        from_attributes = True

# --- Learning Hub Schemas ---
class LearningModuleResponse(BaseModel):
    id: str
    learning_path_id: str
    order_index: int
    title: str
    content_markdown: str
    linked_document_ids: List[str]
    linked_claim_ids: List[str]
    quiz_questions: List[Dict[str, Any]]
    class Config:
        from_attributes = True

class LearningPathResponse(BaseModel):
    id: str
    title: str
    slug: str
    level: str
    domain: str
    description: str
    estimated_hours: float
    modules: List[LearningModuleResponse] = []
    class Config:
        from_attributes = True

class UserProgressUpdate(BaseModel):
    learning_module_id: str
    completed: bool
    quiz_score: Optional[float] = None

# --- Admin & Analytics Schemas ---
class AnalyticsSummary(BaseModel):
    total_documents: int
    total_claims: int
    total_evidence_items: int
    total_datasets: int
    total_expeditions: int
    total_researchers: int
    pending_reviews: int
    unverified_claims: int
    disagreements_analyzed: int
    stress_tests_run: int
    system_health: str = "HEALTHY"
    db_status: str = "CONNECTED"
    vector_status: str = "READY"
    sha256_verified_rate: float = 100.0

class ReviewSubmission(BaseModel):
    entity_type: str
    entity_id: str
    decision: str  # ACCEPT, REJECT, EDIT, NEEDS_EXPERT_REVIEW
    edited_output: Optional[Dict[str, Any]] = None
    review_reason: Optional[str] = None
