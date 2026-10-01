import {
  DocumentItem, ClaimItem, ComparisonItem, StressTestItem,
  ResearchQuestionItem, ExpeditionItem, StationItem, DatasetItem,
  LearningPath, AnalyticsSummary, User, EvidenceGapItem, ResearchConnectionItem
} from '../types';

const API_BASE = '/api/v1';

function getAuthHeaders(): HeadersInit {
  const token = localStorage.getItem('polaris_token');
  return {
    'Content-Type': 'application/json',
    ...(token ? { Authorization: `Bearer ${token}` } : {})
  };
}

export const api = {
  // Auth
  async login(email: string, password: string): Promise<{ access_token: string; role: string; user_id: string; full_name: string }> {
    const res = await fetch(`${API_BASE}/auth/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Login failed');
    }
    return res.json();
  },

  async register(email: string, password: string, fullName: string, role: string, institution: string) {
    const res = await fetch(`${API_BASE}/auth/register`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify({ email, password, full_name: fullName, role, institution })
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Registration failed');
    }
    return res.json();
  },

  async getMe(): Promise<User> {
    const res = await fetch(`${API_BASE}/auth/me`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch profile');
    return res.json();
  },

  // Documents
  async getDocuments(params?: { domain?: string; location?: string; year?: number; search?: string; source_type?: string; document_type?: string }): Promise<DocumentItem[]> {
    const searchParams = new URLSearchParams();
    if (params?.domain) searchParams.append('domain', params.domain);
    if (params?.location) searchParams.append('location', params.location);
    if (params?.year) searchParams.append('year', params.year.toString());
    if (params?.search) searchParams.append('search', params.search);
    if (params?.source_type) searchParams.append('source_type', params.source_type);
    if (params?.document_type) searchParams.append('document_type', params.document_type);

    const res = await fetch(`${API_BASE}/documents?${searchParams.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch documents');
    return res.json();
  },

  async getDocument(id: string): Promise<DocumentItem> {
    const res = await fetch(`${API_BASE}/documents/${id}`);
    if (!res.ok) throw new Error('Document not found');
    return res.json();
  },

  async uploadDocument(formData: FormData): Promise<DocumentItem> {
    const token = localStorage.getItem('polaris_token');
    const res = await fetch(`${API_BASE}/documents`, {
      method: 'POST',
      headers: {
        ...(token ? { Authorization: `Bearer ${token}` } : {})
      },
      body: formData
    });
    if (!res.ok) {
      const err = await res.json();
      throw new Error(err.detail || 'Upload failed');
    }
    return res.json();
  },

  // Claims & Evidence
  async getClaims(params?: { subject?: string; location?: string; direction?: string; document_id?: string }): Promise<ClaimItem[]> {
    const searchParams = new URLSearchParams();
    if (params?.subject) searchParams.append('subject', params.subject);
    if (params?.location) searchParams.append('location', params.location);
    if (params?.direction) searchParams.append('direction', params.direction);
    if (params?.document_id) searchParams.append('document_id', params.document_id);

    const res = await fetch(`${API_BASE}/claims?${searchParams.toString()}`);
    if (!res.ok) throw new Error('Failed to fetch claims');
    return res.json();
  },

  async getClaim(id: string): Promise<ClaimItem> {
    const res = await fetch(`${API_BASE}/claims/${id}`);
    if (!res.ok) throw new Error('Claim not found');
    return res.json();
  },

  async getEvidenceLineage(claimId: string) {
    const res = await fetch(`${API_BASE}/evidence/lineage/${claimId}`);
    if (!res.ok) throw new Error('Failed to fetch evidence lineage');
    return res.json();
  },

  // Comparisons & Stress-Test
  async getComparisons(): Promise<ComparisonItem[]> {
    const res = await fetch(`${API_BASE}/comparisons`);
    if (!res.ok) throw new Error('Failed to fetch comparisons');
    return res.json();
  },

  async getComparison(id: string): Promise<ComparisonItem> {
    const res = await fetch(`${API_BASE}/comparisons/${id}`);
    if (!res.ok) throw new Error('Comparison not found');
    return res.json();
  },

  async createComparison(claimAId: string, claimBId: string): Promise<ComparisonItem> {
    const res = await fetch(`${API_BASE}/comparisons`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ claim_a_id: claimAId, claim_b_id: claimBId })
    });
    if (!res.ok) throw new Error('Failed to create comparison');
    return res.json();
  },

  async getStressTests(): Promise<StressTestItem[]> {
    const res = await fetch(`${API_BASE}/stress-test`);
    if (!res.ok) throw new Error('Failed to fetch stress tests');
    return res.json();
  },

  async getStressTest(id: string): Promise<StressTestItem> {
    const res = await fetch(`${API_BASE}/stress-test/${id}`);
    if (!res.ok) throw new Error('Stress test not found');
    return res.json();
  },

  async runStressTest(comparisonId: string, overrides?: { override_location?: boolean; override_period?: boolean; override_season?: boolean; override_method?: boolean }): Promise<StressTestItem> {
    const res = await fetch(`${API_BASE}/stress-test`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({
        comparison_id: comparisonId,
        ...overrides
      })
    });
    if (!res.ok) throw new Error('Failed to run stress-test simulation');
    return res.json();
  },

  // Evidence Gaps & Cross-Disciplinary Connections
  async getEvidenceGaps(): Promise<EvidenceGapItem[]> {
    // Fallback or derived from stress tests / seed
    try {
      const tests = await this.getStressTests();
      return tests.map((t, idx) => ({
        id: `GAP-${idx + 1}`,
        stress_test_id: t.id,
        title: `Observational Resolution Gap: ${t.title.split(':')[1] || t.title}`,
        topic: t.title,
        missing_variable: t.dominant_influential_variable === 'LOCATION' ? 'Boundary Layer Salinity & Ocean Heat Flux' : 'Continuous Winter Baseline Profiles',
        spatial_region: 'Prydz Bay / Larsemann Hills',
        temporal_gap: '2015-2019 Winter Cycles',
        suggested_resolution: t.evidence_gap_description,
        matching_dataset_codes: t.recommended_dataset_code ? [t.recommended_dataset_code] : ['DS-2022-ARC', 'DS-2024-ISEA43-GPR'],
        status: idx === 0 ? 'PARTIALLY_ADDRESSED' : 'OPEN'
      }));
    } catch {
      return [];
    }
  },

  async getResearchConnections(): Promise<ResearchConnectionItem[]> {
    return [
      {
        id: 'CONN-01',
        title: 'Atmospheric Aerosol Optical Depth vs Kongsfjorden Phytoplankton Bloom Dynamics',
        domain_a: 'Atmospheric Physics',
        year_a: 2012,
        domain_b: 'Marine Biology / Oceanography',
        year_b: 2021,
        shared_location: 'Ny-Ålesund / Kongsfjorden (Svalbard Arctic)',
        shared_season: 'Arctic Spring (April-June)',
        connection_hypothesis: 'Early spring aerosol deposition accelerates sea ice albedo reduction, creating light penetration pulses that trigger phytoplankton blooms 14 days earlier than historical norms.',
        source_doc_a_id: 'DOC-002',
        source_doc_b_id: 'DOC-004',
        source_doc_a_title: 'Kongsfjorden Hydrography and IndARC Mooring Time Series',
        source_doc_b_title: 'Atmospheric Aerosol Optical Properties at Himadri Station'
      },
      {
        id: 'CONN-02',
        title: 'Schirmacher Oasis Geomagnetic Pulsations & Ice Sheet Sub-Surface Electrical Conductivity',
        domain_a: 'Space Weather & Geomagnetism',
        year_a: 2018,
        domain_b: 'Glaciology',
        year_b: 2023,
        shared_location: 'Schirmacher Oasis (Maitri Station)',
        shared_season: 'Austral Winter',
        connection_hypothesis: 'Geomagnetic storm telluric currents induce detectable electromagnetic anomalies along basal ice sheet meltwater channels, correlating with GPR sub-glacial lake reflectors.',
        source_doc_a_id: 'DOC-005',
        source_doc_b_id: 'DOC-001',
        source_doc_a_title: 'Geomagnetic Pulsations and Auroral Current Observations at Maitri',
        source_doc_b_title: '43rd Indian Scientific Expedition to Antarctica Scientific Report'
      }
    ];
  },

  // Temporal & Research Questions
  async getTimeline(topic: string = 'Antarctic sea ice') {
    const res = await fetch(`${API_BASE}/temporal/timeline?topic=${encodeURIComponent(topic)}`);
    if (!res.ok) throw new Error('Failed to fetch timeline');
    return res.json();
  },

  async getResearchQuestions(): Promise<ResearchQuestionItem[]> {
    const res = await fetch(`${API_BASE}/research-questions`);
    if (!res.ok) throw new Error('Failed to fetch research questions');
    return res.json();
  },

  async getResearchQuestion(slugOrId: string): Promise<ResearchQuestionItem> {
    const res = await fetch(`${API_BASE}/research-questions/${slugOrId}`);
    if (!res.ok) throw new Error('Research question not found');
    return res.json();
  },

  // Rediscovery
  async getRediscoveryCandidates(query: string = 'polar climate feedback ocean sea ice') {
    const res = await fetch(`${API_BASE}/rediscovery/candidates?query=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Failed to fetch rediscovery candidates');
    return res.json();
  },

  // Expeditions, Stations & Datasets
  async getExpeditions(): Promise<ExpeditionItem[]> {
    const res = await fetch(`${API_BASE}/expeditions`);
    if (!res.ok) throw new Error('Failed to fetch expeditions');
    return res.json();
  },

  async getStations(): Promise<StationItem[]> {
    const res = await fetch(`${API_BASE}/expeditions/stations`);
    if (!res.ok) throw new Error('Failed to fetch stations');
    return res.json();
  },

  async getDatasets(): Promise<DatasetItem[]> {
    const res = await fetch(`${API_BASE}/datasets`);
    if (!res.ok) throw new Error('Failed to fetch datasets');
    return res.json();
  },

  async getDataset(idOrCode: string): Promise<DatasetItem> {
    const res = await fetch(`${API_BASE}/datasets/${idOrCode}`);
    if (!res.ok) throw new Error('Dataset not found');
    return res.json();
  },

  // Learning Hub
  async getLearningPaths(): Promise<LearningPath[]> {
    const res = await fetch(`${API_BASE}/learning/paths`);
    if (!res.ok) throw new Error('Failed to fetch learning paths');
    return res.json();
  },

  async getLearningPath(slugOrId: string): Promise<LearningPath> {
    const res = await fetch(`${API_BASE}/learning/paths/${slugOrId}`);
    if (!res.ok) throw new Error('Learning path not found');
    return res.json();
  },

  async submitProgress(moduleId: string, completed: boolean, quizScore?: number) {
    const res = await fetch(`${API_BASE}/learning/progress`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ learning_module_id: moduleId, completed, quiz_score: quizScore })
    });
    return res.json();
  },

  // Search
  async universalSearch(query: string) {
    const res = await fetch(`${API_BASE}/search/universal?q=${encodeURIComponent(query)}`);
    if (!res.ok) throw new Error('Search failed');
    return res.json();
  },

  // Admin, Evaluations & Governance
  async getAnalytics(): Promise<AnalyticsSummary> {
    const res = await fetch(`${API_BASE}/admin/analytics`);
    if (!res.ok) throw new Error('Failed to fetch analytics');
    return res.json();
  },

  async getAuditLogs() {
    const res = await fetch(`${API_BASE}/admin/audit-logs`, {
      headers: getAuthHeaders()
    });
    if (!res.ok) throw new Error('Failed to fetch audit logs');
    return res.json();
  },

  async getActivityFeed() {
    const res = await fetch(`${API_BASE}/admin/activity-feed`);
    if (!res.ok) throw new Error('Failed to fetch activity feed');
    return res.json();
  },

  async getEvaluations() {
    const res = await fetch(`${API_BASE}/evaluations/metrics`);
    if (!res.ok) throw new Error('Failed to fetch evaluation benchmarks');
    return res.json();
  },

  async submitReview(entityType: string, entityId: string, decision: string, reason?: string) {
    const res = await fetch(`${API_BASE}/admin/reviews/submit`, {
      method: 'POST',
      headers: getAuthHeaders(),
      body: JSON.stringify({ entity_type: entityType, entity_id: entityId, decision, review_reason: reason })
    });
    if (!res.ok) throw new Error('Failed to submit review');
    return res.json();
  }
};
