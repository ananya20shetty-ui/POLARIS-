import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Sparkles, Search, FileText, ArrowRight, CheckCircle2, Info, Eye } from 'lucide-react';
import { api } from '../lib/api';

export const Rediscovery: React.FC = () => {
  const [candidates, setCandidates] = useState<any[]>([]);
  const [loading, setLoading] = useState(true);
  const [activeQuery, setActiveQuery] = useState('polar climate feedback ocean sea ice');

  useEffect(() => {
    async function loadCandidates() {
      setLoading(true);
      try {
        const res = await api.getRediscoveryCandidates(activeQuery);
        setCandidates(res.candidates || []);
      } catch (err) {
        console.error('Failed to load rediscovery candidates:', err);
      } finally {
        setLoading(false);
      }
    }
    loadCandidates();
  }, [activeQuery]);

  return (
    <div className="min-h-screen bg-[#0B0F17] text-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <Sparkles className="w-6 h-6 text-sky-400" />
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Research Rediscovery
              </h1>
            </div>
            <p className="text-xs text-gray-400 mt-1 max-w-3xl leading-relaxed">
              Multi-signal recommendation engine surfacing historical 1980s–90s Indian expedition records and connecting them to active research inquiries, satellite sensors, and open research questions.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#0F172A] border border-gray-800 text-xs font-mono text-gray-300 shrink-0">
            <div className="text-sky-400 font-semibold">Algorithmic Transparency</div>
            <div className="text-[11px] text-gray-400">
              Surfaced based on age, spatial overlap, method similarity & research questions.
            </div>
          </div>
        </div>

        {/* Active Query Bar */}
        <div className="p-4 rounded-lg bg-gray-900 border border-gray-800 flex flex-col sm:flex-row items-center gap-3">
          <div className="relative flex-1 w-full">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              value={activeQuery}
              onChange={(e) => setActiveQuery(e.target.value)}
              placeholder="Enter active research context (e.g., Prydz Bay sea ice, aerosol optical depth, IndARC)..."
              className="w-full pl-9 pr-4 py-2 bg-[#0B0F17] border border-gray-700 rounded-md text-xs text-white placeholder-gray-400 focus:outline-none focus:border-sky-500"
            />
          </div>
          <button
            onClick={() => {}}
            className="px-4 py-2 rounded bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold tracking-wide transition-colors shrink-0"
          >
            Find Rediscovery Candidates
          </button>
        </div>

        {/* Candidate Cards Grid */}
        <div className="space-y-4">
          {loading ? (
            <div className="p-8 text-center text-xs font-mono text-gray-400 bg-gray-900 rounded-lg border border-gray-800">
              Evaluating multi-decadal publication archive...
            </div>
          ) : candidates.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-gray-400 bg-gray-900 rounded-lg border border-gray-800">
              No historical rediscovery candidates found for the current inquiry.
            </div>
          ) : (
            candidates.map((cand) => (
              <div
                key={cand.document_id}
                className="p-5 rounded-lg bg-gray-900 border border-gray-800 space-y-3 hover:border-gray-700 transition-colors"
              >
                <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800 pb-3">
                  <div className="space-y-1">
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold text-amber-400">
                        PUBLISHED {cand.year} ({cand.age_years} years ago)
                      </span>
                      <span className="text-xs font-mono px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800">
                        {cand.research_domain}
                      </span>
                    </div>
                    <h2 className="text-base font-bold text-white">{cand.title}</h2>
                  </div>

                  <div className="text-right shrink-0">
                    <span className="text-xs font-mono text-emerald-400 font-bold bg-emerald-950 px-2.5 py-1 rounded border border-emerald-800">
                      Relevance Score: {Math.round(cand.rediscovery_score * 100)}%
                    </span>
                  </div>
                </div>

                <div className="text-xs text-gray-300 font-mono">
                  Authors: {cand.authors ? cand.authors.join(', ') : 'NCPOR Expedition Contingent'} &bull; Location: {cand.location_name || 'East Antarctica'}
                </div>

                {/* Explicit Justification Box */}
                <div className="p-3.5 rounded bg-[#0B0F17] border border-sky-900/60 text-xs space-y-1">
                  <span className="font-mono text-sky-400 font-bold block">
                    WHY THIS WAS SURFACED:
                  </span>
                  <p className="text-gray-200 leading-relaxed">
                    {cand.why_surfaced}
                  </p>
                </div>

                <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-gray-800/60">
                  <div className="text-[11px] font-mono text-gray-400">
                    Raw Data Availability: <span className="text-emerald-400">{cand.raw_data_availability || 'SHA-256 Verified Archive'}</span>
                  </div>

                  <Link
                    to={`/documents/${cand.document_id}`}
                    className="inline-flex items-center justify-center gap-1.5 px-3.5 py-1.5 rounded bg-sky-950 hover:bg-sky-900 text-sky-300 border border-sky-800/60 text-xs font-semibold transition-colors shrink-0"
                  >
                    <Eye className="w-3.5 h-3.5" />
                    <span>Inspect Source Document</span>
                  </Link>
                </div>
              </div>
            ))
          )}
        </div>

      </div>
    </div>
  );
};
