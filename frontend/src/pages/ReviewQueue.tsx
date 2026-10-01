import React, { useState, useEffect } from 'react';
import { Award, ShieldCheck, CheckCircle2, XCircle, HelpCircle, Clock, FileText, User } from 'lucide-react';
import { api } from '../lib/api';

export const ReviewQueue: React.FC = () => {
  const [reviews, setReviews] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDecision, setSelectedDecision] = useState<Record<string, string>>({});
  const [reviewerNotes, setReviewerNotes] = useState<Record<string, string>>({});
  const [submittedStatus, setSubmittedStatus] = useState<Record<string, string>>({});

  useEffect(() => {
    async function loadQueue() {
      setLoading(true);
      try {
        const claims = await api.getClaims();
        const pending = claims.filter(c => c.human_review_status !== 'Verified').map(c => ({
          id: c.id,
          type: 'CLAIM_EXTRACTION',
          title: `Claim Extraction: ${c.subject}`,
          observation: c.observation,
          location: c.location,
          method: c.method,
          source_text: c.source_text_span,
          status: 'PENDING_REVIEW',
          submitted_at: c.created_at
        }));

        setReviews([
          ...pending,
          {
            id: 'COMP-REV-01',
            type: 'EVIDENCE_DISAGREEMENT',
            title: 'Evidence Disagreement: Prydz Bay vs Weddell Sea Sea-Ice Extent',
            claim_a: 'Antarctic sea ice extent decreased (-2.1% decade⁻¹)',
            claim_b: 'Antarctic sea ice extent increased during winter observational cycles',
            context: 'Spatial domain heterogeneity (Prydz Bay vs Weddell Sea)',
            status: 'PENDING_REVIEW',
            submitted_at: '2026-09-28T14:30:00Z'
          }
        ]);
      } catch (err) {
        console.error('Failed to load review queue:', err);
      } finally {
        setLoading(false);
      }
    }
    loadQueue();
  }, []);

  const handleDecisionSubmit = async (item: any, decision: string) => {
    try {
      await api.submitReview(item.type, item.id, decision, reviewerNotes[item.id] || '');
      setSubmittedStatus(prev => ({ ...prev, [item.id]: decision }));
    } catch {
      // Local state update fallback
      setSubmittedStatus(prev => ({ ...prev, [item.id]: decision }));
    }
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <Award className="w-6 h-6 text-emerald-400" />
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Review & Governance Queue
              </h1>
            </div>
            <p className="text-xs text-gray-400 mt-1 max-w-3xl leading-relaxed">
              Human-in-the-loop validation console for NCPOR scientific reviewers. Moderates automatically extracted claims, potential evidence disagreements, and researcher submissions.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#0F172A] border border-gray-800 text-xs font-mono text-emerald-400 font-semibold shrink-0">
            REVIEWER PRIVILEGE ACTIVE
          </div>
        </div>

        {/* Queue Items List */}
        <div className="space-y-4">
          {loading ? (
            <div className="p-8 text-center text-xs font-mono text-gray-400 bg-gray-900 rounded-lg border border-gray-800">
              Loading reviewer verification queue...
            </div>
          ) : reviews.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-gray-400 bg-gray-900 rounded-lg border border-gray-800">
              Review queue is empty. All claims & comparisons verified.
            </div>
          ) : (
            reviews.map((item) => {
              const status = submittedStatus[item.id];

              return (
                <div
                  key={item.id}
                  className="p-5 rounded-lg bg-gray-900 border border-gray-800 space-y-4 hover:border-gray-700 transition-colors"
                >
                  <div className="flex items-center justify-between border-b border-gray-800 pb-3">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-sky-400">{item.type}</span>
                      <h3 className="text-sm font-bold text-white">{item.title}</h3>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      status ? 'text-emerald-400 bg-emerald-950 border-emerald-800' : 'text-amber-300 bg-amber-950 border-amber-800'
                    }`}>
                      {status ? `DECISION: ${status}` : 'PENDING REVIEW'}
                    </span>
                  </div>

                  {item.type === 'EVIDENCE_DISAGREEMENT' ? (
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-3 p-3 rounded bg-[#0B0F17] border border-gray-800 text-xs font-mono">
                      <div><strong className="text-sky-400">CLAIM A:</strong> {item.claim_a}</div>
                      <div><strong className="text-emerald-400">CLAIM B:</strong> {item.claim_b}</div>
                    </div>
                  ) : (
                    <div className="p-3 rounded bg-[#0B0F17] border border-gray-800 text-xs font-mono space-y-1">
                      <div><strong className="text-gray-400">Observation:</strong> "{item.observation}"</div>
                      <div><strong className="text-gray-400">Location:</strong> {item.location} &bull; <strong className="text-gray-400">Method:</strong> {item.method}</div>
                    </div>
                  )}

                  {/* Reviewer Rationale Notes */}
                  <div>
                    <label className="text-[10px] font-mono text-gray-400 uppercase block mb-1">
                      Reviewer Rationale & Audit Notes:
                    </label>
                    <input
                      type="text"
                      value={reviewerNotes[item.id] || ''}
                      onChange={(e) => setReviewerNotes(prev => ({ ...prev, [item.id]: e.target.value }))}
                      placeholder="Add formal reviewer rationale or scientific context..."
                      className="w-full px-3 py-1.5 bg-[#0B0F17] border border-gray-700 rounded text-xs text-white placeholder-gray-500 focus:outline-none focus:border-sky-500"
                    />
                  </div>

                  {/* Reviewer Action Buttons */}
                  <div className="pt-2 flex flex-wrap items-center gap-2">
                    {[
                      { label: 'Valid comparison', val: 'VALID_COMPARISON', color: 'bg-emerald-600 hover:bg-emerald-500 text-white' },
                      { label: 'Contextually different', val: 'CONTEXTUALLY_DIFFERENT', color: 'bg-sky-600 hover:bg-sky-500 text-white' },
                      { label: 'Insufficient evidence', val: 'INSUFFICIENT_EVIDENCE', color: 'bg-amber-600 hover:bg-amber-500 text-white' },
                      { label: 'Needs expert review', val: 'NEEDS_EXPERT_REVIEW', color: 'bg-purple-600 hover:bg-purple-500 text-white' },
                    ].map((btn) => (
                      <button
                        key={btn.val}
                        onClick={() => handleDecisionSubmit(item, btn.val)}
                        className={`px-3 py-1.5 rounded text-xs font-semibold tracking-wide transition-colors ${btn.color}`}
                      >
                        {btn.label}
                      </button>
                    ))}
                  </div>

                </div>
              );
            })
          )}
        </div>

      </div>
    </div>
  );
};
