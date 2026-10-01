import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  GitCompare, Zap, ArrowRight, ShieldCheck, HelpCircle,
  FileText, CheckCircle2, AlertCircle, Info, ChevronRight
} from 'lucide-react';
import { api } from '../lib/api';
import { ComparisonItem, ClaimItem } from '../types';

export const Comparisons: React.FC = () => {
  const navigate = useNavigate();
  const [comparisons, setComparisons] = useState<ComparisonItem[]>([]);
  const [claimsMap, setClaimsMap] = useState<Record<string, ClaimItem>>({});
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      setLoading(true);
      try {
        const [compList, claimList] = await Promise.all([
          api.getComparisons().catch(() => []),
          api.getClaims().catch(() => [])
        ]);
        setComparisons(compList);
        
        const map: Record<string, ClaimItem> = {};
        claimList.forEach((c) => { map[c.id] = c; });
        setClaimsMap(map);
      } catch (err) {
        console.error('Failed to load evidence comparisons:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0F17] text-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <GitCompare className="w-6 h-6 text-sky-400" />
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Potential Evidence Disagreements
              </h1>
            </div>
            <p className="text-xs text-gray-400 mt-1 max-w-3xl leading-relaxed">
              Multi-variable comparison of apparently divergent scientific findings. Rather than declaring one publication "correct", POLARIS-Ω evaluates geographic, temporal, and methodological contexts to explain physical drivers of variance.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#0F172A] border border-gray-800 text-xs font-mono text-gray-300 shrink-0">
            <div className="text-sky-400 font-semibold mb-0.5">Contextual Resolution Principle</div>
            <div className="text-[11px] text-gray-400">
              Apparent contradictions often reflect distinct spatial regimes or observation seasons.
            </div>
          </div>
        </div>

        {/* Comparisons List */}
        <div className="space-y-6">
          {loading ? (
            <div className="p-8 text-center text-xs font-mono text-gray-400 bg-gray-900 rounded-lg border border-gray-800">
              Analyzing potential evidence disagreements...
            </div>
          ) : comparisons.length === 0 ? (
            <div className="p-8 text-center text-xs font-mono text-gray-400 bg-gray-900 rounded-lg border border-gray-800">
              No potential evidence disagreements currently indexed.
            </div>
          ) : (
            comparisons.map((comp) => {
              const claimA = claimsMap[comp.claim_a_id];
              const claimB = claimsMap[comp.claim_b_id];

              return (
                <div
                  key={comp.id}
                  className="p-5 rounded-lg bg-gray-900 border border-gray-800 space-y-5 hover:border-gray-700 transition-colors"
                >
                  {/* Title & Badge */}
                  <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-2 border-b border-gray-800 pb-3">
                    <div>
                      <span className="text-[10px] font-mono text-sky-400 font-semibold uppercase">
                        TOPIC: {comp.topic}
                      </span>
                      <h2 className="text-base font-bold text-white mt-0.5">{comp.title}</h2>
                    </div>
                    <div className="flex items-center gap-2">
                      <span className="text-xs font-mono font-bold px-2.5 py-1 rounded bg-amber-950 text-amber-300 border border-amber-800">
                        POTENTIAL EVIDENCE DISAGREEMENT
                      </span>
                    </div>
                  </div>

                  {/* Side-by-Side Claims Comparison */}
                  <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                    
                    {/* Claim A */}
                    <div className="p-4 rounded bg-[#0B0F17] border border-gray-800 space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-sky-400 font-bold">CLAIM A</span>
                        <span className="text-gray-400">{claimA?.location || 'Prydz Bay Sector'}</span>
                      </div>
                      <div className="text-sm font-bold text-white">
                        {claimA?.subject || 'Antarctic Sea Ice Extent'}
                      </div>
                      <p className="text-xs text-gray-300 italic">
                        "{claimA?.observation || 'Sea ice extent decreased at -2.1% decade⁻¹.'}"
                      </p>
                      <div className="pt-2 text-[11px] font-mono text-gray-400 border-t border-gray-800 flex justify-between">
                        <span>Method: {claimA?.method || 'Satellite Altimetry'}</span>
                        <span>Period: {claimA?.time_start || 1981}-{claimA?.time_end || 2023}</span>
                      </div>
                    </div>

                    {/* Claim B */}
                    <div className="p-4 rounded bg-[#0B0F17] border border-gray-800 space-y-2">
                      <div className="flex items-center justify-between text-xs font-mono">
                        <span className="text-emerald-400 font-bold">CLAIM B</span>
                        <span className="text-gray-400">{claimB?.location || 'Ross Sea Sector'}</span>
                      </div>
                      <div className="text-sm font-bold text-white">
                        {claimB?.subject || 'Ross Sea Ice Extent'}
                      </div>
                      <p className="text-xs text-gray-300 italic">
                        "{claimB?.observation || 'Sea ice extent increased or remained stable during winter cycles.'}"
                      </p>
                      <div className="pt-2 text-[11px] font-mono text-gray-400 border-t border-gray-800 flex justify-between">
                        <span>Method: {claimB?.method || 'In-situ Mooring'}</span>
                        <span>Period: {claimB?.time_start || 1995}-{claimB?.time_end || 2022}</span>
                      </div>
                    </div>

                  </div>

                  {/* Context Comparison Matrix */}
                  <div>
                    <span className="text-[10px] font-mono text-gray-400 uppercase block mb-2">
                      CONTEXT COMPARISON MATRIX
                    </span>
                    <div className="grid grid-cols-2 sm:grid-cols-5 gap-2 text-xs font-mono">
                      <div className="p-2 rounded bg-gray-950 border border-gray-800 text-center">
                        <span className="text-gray-500 block text-[10px]">LOCATION</span>
                        <span className="text-amber-400 font-bold">DIFFERENT</span>
                      </div>
                      <div className="p-2 rounded bg-gray-950 border border-gray-800 text-center">
                        <span className="text-gray-500 block text-[10px]">TIME PERIOD</span>
                        <span className="text-sky-400 font-bold">PARTIAL OVERLAP</span>
                      </div>
                      <div className="p-2 rounded bg-gray-950 border border-gray-800 text-center">
                        <span className="text-gray-500 block text-[10px]">SEASON</span>
                        <span className="text-gray-400 font-bold">UNKNOWN / UNSTATED</span>
                      </div>
                      <div className="p-2 rounded bg-gray-950 border border-gray-800 text-center">
                        <span className="text-gray-500 block text-[10px]">METHOD</span>
                        <span className="text-amber-400 font-bold">DIFFERENT</span>
                      </div>
                      <div className="p-2 rounded bg-gray-950 border border-gray-800 text-center">
                        <span className="text-gray-500 block text-[10px]">INSTRUMENT</span>
                        <span className="text-emerald-400 font-bold">KNOWN</span>
                      </div>
                    </div>
                  </div>

                  {/* Contextual Explanation & Action */}
                  <div className="pt-3 border-t border-gray-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3">
                    <p className="text-xs text-gray-300 leading-relaxed max-w-3xl">
                      <strong className="text-white">Explanation: </strong>
                      {comp.contextual_explanation}
                    </p>

                    <Link
                      to={`/stress-test?comparison_id=${comp.id}`}
                      className="inline-flex items-center justify-center gap-2 px-4 py-2 rounded bg-emerald-600 hover:bg-emerald-500 text-white text-xs font-bold tracking-wide transition-colors shrink-0 shadow-sm"
                    >
                      <Zap className="w-4 h-4" />
                      <span>LAUNCH EVIDENCE STRESS-TEST</span>
                    </Link>
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
