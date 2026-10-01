import React, { useState, useEffect } from 'react';
import { HelpCircle, Compass, ArrowRight, ShieldCheck, ChevronRight } from 'lucide-react';
import { api } from '../lib/api';
import { ResearchQuestionItem } from '../types';

export const ResearchQuestions: React.FC = () => {
  const [questions, setQuestions] = useState<ResearchQuestionItem[]>([]);
  const [selectedQuestion, setSelectedQuestion] = useState<ResearchQuestionItem | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const data = await api.getResearchQuestions();
        setQuestions(data);
        if (data.length > 0) {
          const detail = await api.getResearchQuestion(data[0].slug);
          setSelectedQuestion(detail);
        }
      } catch (err) {
        console.error(err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSelectQuestion = async (slug: string) => {
    try {
      const detail = await api.getResearchQuestion(slug);
      setSelectedQuestion(detail);
    } catch (err) {
      console.error(err);
    }
  };

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Header */}
      <div className="pb-6 border-b border-carbon-800">
        <div className="flex items-center gap-2 text-xs font-mono text-aurora-400 mb-1">
          <HelpCircle className="w-4 h-4" />
          <span>LIVING SCIENTIFIC INQUIRIES</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-frost-50">
          Research Question Tracker
        </h1>
        <p className="text-xs text-frost-400 mt-1">
          Organizes polar scientific progress around active questions rather than static document silos.
        </p>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
        
        {/* Questions List */}
        <div className="space-y-3">
          <h3 className="text-xs font-mono uppercase tracking-wider text-frost-400 font-semibold mb-2">
            Active Polar Inquiries ({questions.length})
          </h3>
          {questions.map((rq) => (
            <div
              key={rq.id}
              onClick={() => handleSelectQuestion(rq.slug)}
              className={`scientific-card p-4 cursor-pointer transition-all ${
                selectedQuestion?.id === rq.id ? 'border-aurora-500 bg-carbon-850' : 'hover:bg-carbon-850'
              }`}
            >
              <div className="flex items-center justify-between text-[11px] font-mono text-frost-400 mb-1">
                <span>{rq.domain}</span>
                <span className="text-aurora-400">{rq.current_status}</span>
              </div>
              <h4 className="text-xs font-bold text-frost-100 line-clamp-2">
                {rq.title}
              </h4>
            </div>
          ))}
        </div>

        {/* Question Details & Grounded Claims Timeline */}
        <div className="lg:col-span-2 space-y-6">
          {selectedQuestion ? (
            <div className="space-y-6">
              
              <div className="scientific-card p-6 space-y-4">
                <div className="flex items-center gap-2">
                  <span className="scientific-badge badge-verified">
                    {selectedQuestion.domain}
                  </span>
                  <span className="text-xs font-mono text-frost-400">
                    Status: <span className="text-aurora-400 font-semibold">{selectedQuestion.current_status}</span>
                  </span>
                </div>

                <h2 className="text-lg font-bold text-frost-50">
                  {selectedQuestion.title}
                </h2>

                <p className="text-xs text-frost-300 leading-relaxed bg-carbon-950 p-4 rounded-xl border border-carbon-800">
                  {selectedQuestion.description}
                </p>

                {selectedQuestion.historical_context && (
                  <div className="text-xs text-frost-400 space-y-1">
                    <span className="font-mono text-frost-300 font-semibold block">Historical Context:</span>
                    <p className="italic font-serif">{selectedQuestion.historical_context}</p>
                  </div>
                )}
              </div>

              {/* Sub-Questions */}
              {selectedQuestion.subquestions && selectedQuestion.subquestions.length > 0 && (
                <div className="scientific-card p-6 space-y-3">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-frost-300 font-semibold">
                    Open Sub-Questions & Hypotheses
                  </h3>
                  <div className="space-y-2">
                    {selectedQuestion.subquestions.map((sub, idx) => (
                      <div key={idx} className="p-3 bg-carbon-950 rounded-lg border border-carbon-800 text-xs text-frost-200 flex items-start gap-2">
                        <span className="text-aurora-400 font-mono font-bold">{idx + 1}.</span>
                        <span>{sub}</span>
                      </div>
                    ))}
                  </div>
                </div>
              )}

              {/* Attached Grounded Claims */}
              {selectedQuestion.claims && selectedQuestion.claims.length > 0 && (
                <div className="space-y-3">
                  <h3 className="text-xs font-mono uppercase tracking-wider text-frost-300 font-semibold">
                    Attached Grounded Claims ({selectedQuestion.claims.length})
                  </h3>
                  <div className="space-y-3">
                    {selectedQuestion.claims.map((claim) => (
                      <div key={claim.id} className="scientific-card p-4 space-y-2">
                        <div className="flex items-center justify-between text-xs">
                          <span className="font-bold text-frost-100">{claim.subject}</span>
                          <span className="font-mono text-aurora-400">{claim.location}</span>
                        </div>
                        <div className="text-xs text-frost-300">
                          {claim.observation}
                        </div>
                        <div className="p-2.5 bg-carbon-950 rounded border-l-2 border-aurora-500 text-[11px] text-frost-400 italic">
                          "{claim.source_text_span}"
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )}

            </div>
          ) : (
            <div className="scientific-card p-12 text-center text-xs text-frost-500">
              Select a research inquiry to inspect grounded claims and sub-hypotheses.
            </div>
          )}
        </div>

      </div>

    </div>
  );
};
