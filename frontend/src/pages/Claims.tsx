import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  Compass, Search, Filter, FileText, CheckCircle2, ArrowRight,
  ExternalLink, Layers, Eye, ShieldCheck, AlertCircle, HelpCircle
} from 'lucide-react';
import { api } from '../lib/api';
import { ClaimItem } from '../types';

export const Claims: React.FC = () => {
  const [searchParams] = useSearchParams();
  const [claims, setClaims] = useState<ClaimItem[]>([]);
  const [loading, setLoading] = useState(true);
  
  const [searchSubject, setSearchSubject] = useState(searchParams.get('subject') || '');
  const [directionFilter, setDirectionFilter] = useState<string>('');
  const [reviewFilter, setReviewFilter] = useState<string>('');

  useEffect(() => {
    async function loadClaims() {
      setLoading(true);
      try {
        const data = await api.getClaims({
          subject: searchSubject || undefined,
          direction: directionFilter || undefined
        });
        setClaims(data);
      } catch (err) {
        console.error('Failed to load scientific claims:', err);
      } finally {
        setLoading(false);
      }
    }
    loadClaims();
  }, [searchSubject, directionFilter]);

  const filteredClaims = claims.filter((claim) => {
    if (!reviewFilter) return true;
    return claim.human_review_status === reviewFilter;
  });

  return (
    <div className="min-h-screen bg-[#0B0F17] text-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <Compass className="w-6 h-6 text-sky-400" />
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Traceable Scientific Claims
              </h1>
            </div>
            <p className="text-xs text-gray-400 mt-1 max-w-3xl leading-relaxed">
              Granular scientific findings parsed into subject, observation, directional trends, and contextual constraints. Every claim is linked to its exact source page, section, and original text span.
            </p>
          </div>

          <div className="flex items-center gap-2 text-xs font-mono">
            <span className="text-gray-400">Total Claims:</span>
            <span className="text-sky-400 font-bold bg-sky-950 px-2 py-0.5 rounded border border-sky-800">
              {claims.length}
            </span>
          </div>
        </div>

        {/* Filter Bar */}
        <div className="p-4 rounded-lg bg-gray-900 border border-gray-800 flex flex-col sm:flex-row gap-3">
          <div className="relative flex-1">
            <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
            <input
              type="text"
              value={searchSubject}
              onChange={(e) => setSearchSubject(e.target.value)}
              placeholder="Search claims by variable (e.g., Sea ice, IndARC, Atlantic water, Glacier retreat)..."
              className="w-full pl-9 pr-4 py-2 bg-[#0B0F17] border border-gray-700 rounded-md text-xs text-white placeholder-gray-400 focus:outline-none focus:border-sky-500"
            />
          </div>

          <select
            value={directionFilter}
            onChange={(e) => setDirectionFilter(e.target.value)}
            className="px-3 py-2 bg-[#0B0F17] border border-gray-700 rounded-md text-xs text-gray-200 focus:outline-none"
          >
            <option value="">All Directionalities</option>
            <option value="DECREASE">DECREASING Trend</option>
            <option value="INCREASE">INCREASING Trend</option>
            <option value="STABLE">STABLE / NEUTRAL</option>
            <option value="FLUCTUATING">FLUCTUATING / COMPLEX</option>
          </select>

          <select
            value={reviewFilter}
            onChange={(e) => setReviewFilter(e.target.value)}
            className="px-3 py-2 bg-[#0B0F17] border border-gray-700 rounded-md text-xs text-gray-200 focus:outline-none"
          >
            <option value="">All Review Statuses</option>
            <option value="Verified">Verified by Scientist</option>
            <option value="Human Review Pending">Human Review Pending</option>
            <option value="Automatic">Automatic Extraction</option>
          </select>
        </div>

        {/* Claims Card Grid */}
        <div className="space-y-4">
          {loading ? (
            <div className="p-8 text-center text-xs font-mono text-gray-400 bg-gray-900 rounded-lg border border-gray-800">
              Extracting claims from indexed publications...
            </div>
          ) : filteredClaims.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-gray-400 bg-gray-900 rounded-lg border border-gray-800">
              No scientific claims match the specified filters.
            </div>
          ) : (
            filteredClaims.map((claim) => {
              const directionColor =
                claim.direction === 'DECREASE' ? 'text-amber-400 bg-amber-950/60 border-amber-800/60' :
                claim.direction === 'INCREASE' ? 'text-sky-400 bg-sky-950/60 border-sky-800/60' :
                'text-emerald-400 bg-emerald-950/60 border-emerald-800/60';

              const reviewBadge =
                claim.human_review_status === 'Verified'
                  ? { text: 'Verified', color: 'text-emerald-400 bg-emerald-950 border-emerald-800' }
                  : { text: 'Human Review Pending', color: 'text-amber-300 bg-amber-950 border-amber-800' };

              return (
                <div
                  key={claim.id}
                  className="p-5 rounded-lg bg-gray-900 border border-gray-800 space-y-4 hover:border-gray-700 transition-colors"
                >
                  {/* Top Claim Header */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800 pb-3">
                    <div className="space-y-1">
                      <span className="text-[10px] font-mono text-gray-400 uppercase">SUBJECT VARIABLE</span>
                      <h3 className="text-base font-bold text-white">{claim.subject}</h3>
                    </div>
                    <div className="flex items-center gap-2 shrink-0">
                      <span className={`text-xs font-mono font-bold px-2.5 py-1 rounded border ${directionColor}`}>
                        {claim.direction || 'OBSERVED'}
                      </span>
                      <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${reviewBadge.color}`}>
                        {reviewBadge.text}
                      </span>
                    </div>
                  </div>

                  {/* Empirical Observation */}
                  <div>
                    <span className="text-[10px] font-mono text-gray-500 uppercase block">EMPIRICAL OBSERVATION</span>
                    <p className="text-xs text-gray-200 mt-0.5 leading-relaxed font-medium">
                      "{claim.observation}"
                    </p>
                  </div>

                  {/* Contextual Metadata Matrix */}
                  <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 p-3 rounded bg-[#0B0F17] border border-gray-800/80 text-xs font-mono">
                    <div>
                      <span className="text-gray-500 block text-[10px]">LOCATION</span>
                      <span className="text-gray-200 block truncate">{claim.location}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px]">TIME PERIOD</span>
                      <span className="text-gray-200 block truncate">
                        {claim.time_start && claim.time_end ? `${claim.time_start} - ${claim.time_end}` : 'Indexed period'}
                      </span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px]">SEASON</span>
                      <span className="text-gray-200 block truncate">{claim.season || 'Annual Average'}</span>
                    </div>
                    <div>
                      <span className="text-gray-500 block text-[10px]">METHOD / INSTRUMENT</span>
                      <span className="text-sky-400 block truncate">{claim.method || 'Satellite Altimetry'}</span>
                    </div>
                  </div>

                  {/* Original Text Span Citation & Evidence Action */}
                  <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-gray-800/60">
                    <div className="text-xs font-mono text-gray-400">
                      <span>Source Location: </span>
                      <span className="text-gray-200 font-semibold">Page {claim.source_page}</span>
                      <span className="text-gray-500 ml-2">({claim.confidence || 'High Precision Extract'})</span>
                    </div>

                    <Link
                      to={`/documents/${claim.document_id}`}
                      className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-sky-950 hover:bg-sky-900 text-sky-300 border border-sky-800/60 text-xs font-semibold transition-colors shrink-0"
                    >
                      <Eye className="w-3.5 h-3.5" />
                      <span>VIEW ORIGINAL EVIDENCE</span>
                    </Link>
                  </div>

                  {/* Original Text Span Box */}
                  <div className="p-3 rounded bg-[#080B11] border border-gray-800/60 text-xs text-gray-400 italic">
                    <span className="text-[10px] font-mono text-gray-500 not-italic block mb-1">ORIGINAL TEXT SPAN:</span>
                    "{claim.source_text_span}"
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
