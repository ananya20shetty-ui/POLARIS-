export interface User {
  id: string;
  email: string;
  full_name: string;
  role: 'PUBLIC' | 'STUDENT' | 'RESEARCHER' | 'REVIEWER' | 'ADMIN';
  institution?: string;
  created_at: string;
}

export interface AuthState {
  user: User | null;
  token: string | null;
  isAuthenticated: boolean;
}

export interface DocumentItem {
  id: string;
  title: string;
  authors: string[];
  institution?: string;
  publication_date?: string;
  year?: number;
  document_type: string;
  research_domain: string;
  keywords: string[];
  abstract?: string;
  doi?: string;
  source_url?: string;
  license?: string;
  expedition_id?: string;
  location_name?: string;
  latitude?: number;
  longitude?: number;
  temporal_coverage_start?: string;
  temporal_coverage_end?: string;
  methodology?: string;
  instruments: string[];
  dataset_references: string[];
  code_availability: string;
  raw_data_availability: string;
  version: string;
  source_type: 'OFFICIAL' | 'OPEN_ACCESS' | 'USER_UPLOADED' | 'EXTERNAL_REFERENCE' | 'SYNTHETIC_TEST';
  file_path?: string;
  file_size_bytes: number;
  file_hash_sha256?: string;
  processing_status: string;
  verification_status: string;
  citation_count: number;
  citation_trajectory_json: { period: string; rate: number }[];
  created_at: string;
}

export interface EvidenceItem {
  id: string;
  claim_id: string;
  document_id: string;
  dataset_id?: string;
  measurement: string;
  sample_size?: string;
  uncertainty?: string;
  statistical_test?: string;
  source_page: number;
  source_text: string;
  verification_status: string;
  created_at: string;
}

export interface ClaimItem {
  id: string;
  document_id: string;
  research_question_id?: string;
  subject: string;
  observation: string;
  direction?: 'DECREASE' | 'INCREASE' | 'STABLE' | 'FLUCTUATING' | 'CYCLIC';
  time_start?: number;
  time_end?: number;
  season?: string;
  location: string;
  latitude?: number;
  longitude?: number;
  method?: string;
  instrument?: string;
  source_page: number;
  source_text_span: string;
  confidence: string;
  ai_confidence_score: number;
  verification_status: string;
  human_review_status: string;
  created_at: string;
  evidence_items: EvidenceItem[];
}

export interface ComparisonItem {
  id: string;
  title: string;
  claim_a_id: string;
  claim_b_id: string;
  research_question_id?: string;
  topic: string;
  variable: string;
  potential_disagreement: 'HIGH' | 'MEDIUM' | 'LOW' | 'COMPATIBLE';
  location_match: string;
  period_match: string;
  season_match: string;
  method_match: string;
  instrument_match: string;
  contextual_explanation: string;
  polaris_heuristic_score: number;
  score_breakdown: {
    weights: Record<string, number>;
    components: Record<string, number>;
    disclaimer: string;
  };
  created_at: string;
}

export interface VariableSensitivity {
  variable: 'LOCATION' | 'TIME_PERIOD' | 'METHOD' | 'SEASON' | 'INSTRUMENT';
  influence: 'HIGH' | 'MEDIUM' | 'LOW';
  weight: number;
  is_toggled: boolean;
  description: string;
}

export interface StressTestItem {
  id: string;
  comparison_id: string;
  title: string;
  variable_sensitivities: VariableSensitivity[];
  dominant_influential_variable: string;
  explanation: string;
  evidence_gap_description: string;
  recommended_dataset_code?: string;
  recommended_dataset_title?: string;
  created_at: string;
}

export interface EvidenceGapItem {
  id: string;
  stress_test_id?: string;
  title: string;
  topic: string;
  missing_variable: string;
  spatial_region: string;
  temporal_gap: string;
  suggested_resolution: string;
  matching_dataset_codes: string[];
  status: 'OPEN' | 'PARTIALLY_ADDRESSED' | 'RESOLVED';
}

export interface ResearchConnectionItem {
  id: string;
  title: string;
  domain_a: string;
  year_a: number;
  domain_b: string;
  year_b: number;
  shared_location: string;
  shared_season?: string;
  connection_hypothesis: string;
  source_doc_a_id: string;
  source_doc_b_id: string;
  source_doc_a_title: string;
  source_doc_b_title: string;
}

export interface ResearchQuestionItem {
  id: string;
  title: string;
  slug: string;
  domain: string;
  description?: string;
  historical_context?: string;
  current_status: string;
  subquestions: string[];
  created_at: string;
  claims?: ClaimItem[];
}

export interface ExpeditionItem {
  id: string;
  name: string;
  code: string;
  region: string;
  year: number;
  start_date?: string;
  end_date?: string;
  lead_agency: string;
  stations: string[];
  description?: string;
  objectives: string[];
  vessel_or_base?: string;
  created_at: string;
}

export interface StationItem {
  id: string;
  name: string;
  code: string;
  region: string;
  operator_country: string;
  established_year: number;
  status: string;
  latitude: number;
  longitude: number;
  elevation_m?: number;
  science_disciplines: string[];
  description: string;
}

export interface DatasetItem {
  id: string;
  title: string;
  code: string;
  expedition_id?: string;
  collection_start?: string;
  collection_end?: string;
  location_name?: string;
  latitude?: number;
  longitude?: number;
  instrument?: string;
  calibration_info?: string;
  processing_steps?: string;
  file_path?: string;
  file_size_bytes: number;
  file_hash_sha256?: string;
  version: string;
  data_format: string;
  license: string;
  variables: string[];
  created_at: string;
}

export interface LearningModule {
  id: string;
  learning_path_id: string;
  order_index: number;
  title: string;
  content_markdown: string;
  linked_document_ids: string[];
  linked_claim_ids: string[];
  quiz_questions: {
    question: string;
    options: string[];
    correct_answer: number;
    explanation: string;
  }[];
}

export interface LearningPath {
  id: string;
  title: string;
  slug: string;
  level: string;
  domain: string;
  description: string;
  estimated_hours: number;
  modules: LearningModule[];
}

export interface AnalyticsSummary {
  total_documents: number;
  total_claims: number;
  total_evidence_items: number;
  total_datasets: number;
  total_expeditions: number;
  total_researchers: number;
  pending_reviews: number;
  unverified_claims: number;
  disagreements_analyzed: number;
  stress_tests_run: number;
  system_health: string;
  db_status: string;
  vector_status: string;
  sha256_verified_rate: number;
}

export interface EvaluationBenchmark {
  task: string;
  metric: string;
  value: number;
  baseline: number;
  sample_count: number;
  notes: string;
}
