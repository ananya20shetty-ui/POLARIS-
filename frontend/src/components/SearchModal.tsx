import React, { useState, useEffect } from 'react';
import { useNavigate } from 'react-router-dom';
import { Search, X, BookOpen, Compass, Database, Ship, HelpCircle, ArrowRight, Loader2 } from 'lucide-react';
import { api } from '../lib/api';

interface SearchModalProps {
  isOpen: boolean;
  onClose: () => void;
}

export const SearchModal: React.FC<SearchModalProps> = ({ isOpen, onClose }) => {
  const [query, setQuery] = useState('');
  const [results, setResults] = useState<any>(null);
  const [loading, setLoading] = useState(false);
  const navigate = useNavigate();

  useEffect(() => {
    const handleKeyDown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        if (isOpen) onClose();
        else setQuery('');
      }
      if (e.key === 'Escape' && isOpen) {
        onClose();
      }
    };
    window.addEventListener('keydown', handleKeyDown);
    return () => window.removeEventListener('keydown', handleKeyDown);
  }, [isOpen, onClose]);

  const handleSearch = async (val: string) => {
    setQuery(val);
    if (!val.trim()) {
      setResults(null);
      return;
    }
    setLoading(true);
    try {
      const data = await api.universalSearch(val);
      setResults(data.results);
    } catch (err) {
      console.error(err);
    } finally {
      setLoading(false);
    }
  };

  const handleSelect = (path: string) => {
    navigate(path);
    onClose();
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 z-50 flex items-start justify-center pt-20 px-4 bg-carbon-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-2xl bg-carbon-900 border border-carbon-700 rounded-2xl shadow-2xl overflow-hidden flex flex-col max-h-[80vh]">
        
        {/* Search Header Input */}
        <div className="p-4 border-b border-carbon-750 flex items-center gap-3 bg-carbon-850">
          <Search className="w-5 h-5 text-aurora-400" />
          <input
            type="text"
            placeholder="Search papers, claims, datasets, expeditions, stations..."
            value={query}
            onChange={(e) => handleSearch(e.target.value)}
            autoFocus
            className="flex-1 bg-transparent text-frost-100 placeholder-frost-500 text-sm focus:outline-none"
          />
          {loading && <Loader2 className="w-4 h-4 text-aurora-400 animate-spin" />}
          <button
            onClick={onClose}
            className="p-1 rounded-md text-frost-400 hover:text-frost-100 hover:bg-carbon-750"
          >
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Quick Search Suggestions */}
        {!query && (
          <div className="p-4 border-b border-carbon-800 bg-carbon-900/50">
            <div className="text-[11px] font-mono text-frost-400 uppercase tracking-wider mb-2">Suggested Polar Inquiries:</div>
            <div className="flex flex-wrap gap-2">
              {['Antarctic sea ice thickness', 'Maitri station mass balance', 'Kongsfjorden Atlantic water', 'CryoSat-2 SIRAL altimetry', 'Prydz Bay fast ice'].map((item) => (
                <button
                  key={item}
                  onClick={() => handleSearch(item)}
                  className="px-2.5 py-1 text-xs bg-carbon-800 hover:bg-carbon-750 border border-carbon-700 text-frost-300 rounded-lg transition-colors"
                >
                  {item}
                </button>
              ))}
            </div>
          </div>
        )}

        {/* Results Container */}
        <div className="flex-1 overflow-y-auto p-4 space-y-4">
          {results && (
            <>
              {/* Documents */}
              {results.documents?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-frost-400 mb-2 uppercase tracking-wider">
                    <BookOpen className="w-3.5 h-3.5 text-aurora-400" />
                    <span>Scientific Documents ({results.documents.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.documents.map((doc: any) => (
                      <div
                        key={doc.id}
                        onClick={() => handleSelect(`/documents/${doc.id}`)}
                        className="p-3 bg-carbon-850 hover:bg-carbon-800 border border-carbon-750/70 rounded-xl cursor-pointer transition-colors flex items-center justify-between group"
                      >
                        <div className="pr-4">
                          <div className="text-xs font-semibold text-frost-100 group-hover:text-aurora-300 transition-colors">
                            {doc.title}
                          </div>
                          <div className="text-[11px] text-frost-400 flex items-center gap-2 mt-0.5">
                            <span>{doc.domain}</span>
                            <span>•</span>
                            <span>{doc.year || '2023'}</span>
                            <span>•</span>
                            <span className="text-aurora-400">{doc.verification_status}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-frost-500 group-hover:text-aurora-400 group-hover:translate-x-0.5 transition-all flex-shrink-0" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Claims */}
              {results.claims?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-frost-400 mb-2 uppercase tracking-wider">
                    <Compass className="w-3.5 h-3.5 text-ochre-400" />
                    <span>Extracted Claims ({results.claims.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.claims.map((claim: any) => (
                      <div
                        key={claim.id}
                        onClick={() => handleSelect(`/claims`)}
                        className="p-3 bg-carbon-850 hover:bg-carbon-800 border border-carbon-750/70 rounded-xl cursor-pointer transition-colors flex items-center justify-between group"
                      >
                        <div>
                          <div className="text-xs font-medium text-frost-200">
                            <span className="font-semibold text-ochre-300">{claim.subject}:</span> {claim.observation}
                          </div>
                          <div className="text-[11px] text-frost-400 mt-0.5">
                            {claim.location} • Confidence: <span className="text-aurora-400">{claim.confidence}</span>
                          </div>
                        </div>
                        <ArrowRight className="w-4 h-4 text-frost-500 group-hover:text-ochre-400 transition-colors" />
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Datasets */}
              {results.datasets?.length > 0 && (
                <div>
                  <div className="flex items-center gap-2 text-xs font-mono text-frost-400 mb-2 uppercase tracking-wider">
                    <Database className="w-3.5 h-3.5 text-aurora-400" />
                    <span>Datasets ({results.datasets.length})</span>
                  </div>
                  <div className="space-y-1.5">
                    {results.datasets.map((ds: any) => (
                      <div
                        key={ds.id}
                        onClick={() => handleSelect(`/repository`)}
                        className="p-3 bg-carbon-850 hover:bg-carbon-800 border border-carbon-750/70 rounded-xl cursor-pointer transition-colors"
                      >
                        <div className="text-xs font-medium text-frost-200">{ds.title}</div>
                        <div className="text-[11px] font-mono text-frost-400 mt-0.5">{ds.code} • {ds.format}</div>
                      </div>
                    ))}
                  </div>
                </div>
              )}
            </>
          )}

          {results && Object.values(results).every((arr: any) => arr.length === 0) && (
            <div className="py-8 text-center text-frost-500 text-xs">
              No scientific objects found matching "{query}". Try a broader term such as "ice", "temperature", or "Maitri".
            </div>
          )}
        </div>

        {/* Footer */}
        <div className="p-3 bg-carbon-950 border-t border-carbon-800 text-[11px] font-mono text-frost-500 flex items-center justify-between">
          <span>POLARIS-Ω Hybrid Vector & Keyword Retrieval</span>
          <span>Press ESC to close</span>
        </div>
      </div>
    </div>
  );
};
