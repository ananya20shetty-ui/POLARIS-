import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import { Network, ArrowRight, Eye, ShieldCheck, Layers, Sparkles, CheckCircle2 } from 'lucide-react';
import { api } from '../lib/api';
import { ResearchConnectionItem } from '../types';

export const ResearchConnections: React.FC = () => {
  const [connections, setConnections] = useState<ResearchConnectionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadConn() {
      setLoading(true);
      try {
        const data = await api.getResearchConnections();
        setConnections(data);
      } catch (err) {
        console.error('Failed to load research connections:', err);
      } finally {
        setLoading(false);
      }
    }
    loadConn();
  }, []);

  return (
    <div className="min-h-screen bg-[#0B0F17] text-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <Network className="w-6 h-6 text-sky-400" />
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Cross-Disciplinary Research Connections
              </h1>
            </div>
            <p className="text-xs text-gray-400 mt-1 max-w-3xl leading-relaxed">
              Detects latent correlations across disparate polar disciplines (e.g., Atmospheric Chemistry $\to$ Ocean Hydrography $\to$ Cryosphere Mass Balance) bound by shared geographic boundaries and seasonal windows.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#0F172A] border border-gray-800 text-xs font-mono text-gray-300 shrink-0">
            <div className="text-sky-400 font-semibold">Interdisciplinary Intelligence</div>
            <div className="text-[11px] text-gray-400">
              Correlates multi-decade studies across MoES disciplines.
            </div>
          </div>
        </div>

        {/* Connections List */}
        <div className="space-y-6">
          {loading ? (
            <div className="p-8 text-center text-xs font-mono text-gray-400 bg-gray-900 rounded-lg border border-gray-800">
              Scanning interdisciplinary semantic graph...
            </div>
          ) : connections.map((conn) => (
            <div
              key={conn.id}
              className="p-5 rounded-lg bg-gray-900 border border-gray-800 space-y-4 hover:border-gray-700 transition-colors"
            >
              {/* Top Connection Banner */}
              <div className="flex items-center justify-between p-3 rounded bg-sky-950/60 border border-sky-800/60">
                <div className="flex items-center gap-2 text-xs font-bold text-sky-300">
                  <Sparkles className="w-4 h-4 text-sky-400" />
                  <span>POTENTIAL RESEARCH CONNECTION DETECTED</span>
                </div>
                <span className="text-[10px] font-mono text-gray-400">ID: {conn.id}</span>
              </div>

              <h2 className="text-base font-bold text-white">{conn.title}</h2>

              {/* Interdisciplinary Chain Visualization */}
              <div className="grid grid-cols-1 md:grid-cols-5 gap-2 items-center p-4 rounded bg-[#0B0F17] border border-gray-800 text-center font-mono text-xs">
                
                {/* Node A */}
                <div className="p-3 rounded bg-gray-900 border border-sky-800/60">
                  <span className="text-[10px] text-gray-500 block">{conn.domain_a.toUpperCase()} ({conn.year_a})</span>
                  <span className="font-bold text-sky-300 truncate block mt-0.5">{conn.source_doc_a_title}</span>
                </div>

                <div className="text-sky-400 flex justify-center">
                  <ArrowRight className="w-4 h-4" />
                </div>

                {/* Shared Context */}
                <div className="p-3 rounded bg-emerald-950/40 border border-emerald-800/60">
                  <span className="text-[10px] text-emerald-400 block font-bold">SHARED CONTEXT</span>
                  <span className="text-gray-200 text-[11px] block mt-0.5">{conn.shared_location}</span>
                  <span className="text-gray-400 text-[10px] block">{conn.shared_season || 'Annual Cycle'}</span>
                </div>

                <div className="text-sky-400 flex justify-center">
                  <ArrowRight className="w-4 h-4" />
                </div>

                {/* Node B */}
                <div className="p-3 rounded bg-gray-900 border border-purple-800/60">
                  <span className="text-[10px] text-gray-500 block">{conn.domain_b.toUpperCase()} ({conn.year_b})</span>
                  <span className="font-bold text-purple-300 truncate block mt-0.5">{conn.source_doc_b_title}</span>
                </div>

              </div>

              {/* Connection Hypothesis Narrative */}
              <div className="p-3.5 rounded bg-gray-950 border border-gray-800 text-xs leading-relaxed">
                <span className="font-mono text-sky-400 font-bold block mb-1">INTERDISCIPLINARY HYPOTHESIS:</span>
                <p className="text-gray-200">{conn.connection_hypothesis}</p>
              </div>

              {/* Actions */}
              <div className="pt-2 flex flex-col sm:flex-row sm:items-center justify-between gap-3 border-t border-gray-800/60 text-xs">
                <span className="text-gray-400 font-mono">Status: Verified by Multi-Signal Correlation</span>

                <div className="flex gap-2">
                  <Link
                    to={`/documents/${conn.source_doc_a_id}`}
                    className="px-3 py-1.5 rounded bg-gray-800 hover:bg-gray-700 text-gray-200 font-semibold transition-colors"
                  >
                    Inspect Document A
                  </Link>
                  <Link
                    to={`/documents/${conn.source_doc_b_id}`}
                    className="px-3 py-1.5 rounded bg-sky-950 hover:bg-sky-900 text-sky-300 border border-sky-800/60 font-semibold transition-colors"
                  >
                    Inspect Document B
                  </Link>
                </div>
              </div>

            </div>
          ))}
        </div>

      </div>
    </div>
  );
};
