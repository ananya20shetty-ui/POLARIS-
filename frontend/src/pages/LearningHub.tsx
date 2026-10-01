import React, { useState, useEffect } from 'react';
import { Link } from 'react-router-dom';
import {
  GraduationCap, BookOpen, CheckCircle2, Award, ArrowRight,
  HelpCircle, ChevronRight, Layers, FileText, ExternalLink
} from 'lucide-react';
import { api } from '../lib/api';
import { LearningPath } from '../types';

export const LearningHub: React.FC = () => {
  const [paths, setPaths] = useState<LearningPath[]>([]);
  const [selectedPath, setSelectedPath] = useState<LearningPath | null>(null);
  const [activeModuleIndex, setActiveModuleIndex] = useState<number>(0);
  const [selectedQuizAnswers, setSelectedQuizAnswers] = useState<Record<number, number>>({});
  const [quizSubmitted, setQuizSubmitted] = useState<boolean>(false);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadPaths() {
      setLoading(true);
      try {
        const data = await api.getLearningPaths();
        setPaths(data);
        if (data.length > 0) setSelectedPath(data[0]);
      } catch (err) {
        console.error('Failed to load learning paths:', err);
      } finally {
        setLoading(false);
      }
    }
    loadPaths();
  }, []);

  const currentModule = selectedPath?.modules[activeModuleIndex];

  const handleQuizOptionSelect = (questionIdx: number, optionIdx: number) => {
    if (quizSubmitted) return;
    setSelectedQuizAnswers(prev => ({ ...prev, [questionIdx]: optionIdx }));
  };

  const calculateScore = () => {
    if (!currentModule) return 0;
    let correct = 0;
    currentModule.quiz_questions.forEach((q, idx) => {
      if (selectedQuizAnswers[idx] === q.correct_answer) correct++;
    });
    return Math.round((correct / currentModule.quiz_questions.length) * 100);
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <GraduationCap className="w-6 h-6 text-sky-400" />
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Polar Learning Hub
              </h1>
            </div>
            <p className="text-xs text-gray-400 mt-1 max-w-3xl leading-relaxed">
              Curated educational paths grounded in verified NCPOR research publications, primary sensor datasets, and interactive knowledge checks.
            </p>
          </div>

          <div className="flex items-center gap-3 text-xs font-mono">
            <span className="text-gray-400">Educational Status:</span>
            <span className="text-emerald-400 font-bold bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
              FAIR EVIDENCE LINKED
            </span>
          </div>
        </div>

        {/* 5 Learning Paths Selection Row */}
        <div className="grid grid-cols-2 sm:grid-cols-5 gap-3">
          {[
            { id: 'path-1', name: 'Antarctic Climate', desc: 'Glaciology & Ice Sheets' },
            { id: 'path-2', name: 'Polar Oceanography', desc: 'IndARC & Atlantification' },
            { id: 'path-3', name: 'Research Methods', desc: 'Altimetry & CTD Profiling' },
            { id: 'path-4', name: 'Expedition Science', desc: '320km GPR Traverses' },
            { id: 'path-5', name: 'Evidence Literacy', desc: 'Contradiction Stress-Testing' },
          ].map((item, idx) => {
            const isSelected = selectedPath?.title.includes(item.name.split(' ')[0]) || (idx === 0 && selectedPath);
            return (
              <button
                key={item.id}
                onClick={() => {
                  if (paths[idx % paths.length]) {
                    setSelectedPath(paths[idx % paths.length]);
                    setActiveModuleIndex(0);
                    setQuizSubmitted(false);
                    setSelectedQuizAnswers({});
                  }
                }}
                className={`p-3 rounded-lg border text-left transition-all ${
                  isSelected
                    ? 'bg-sky-950 border-sky-500 text-white shadow-md'
                    : 'bg-gray-900 border-gray-800 text-gray-400 hover:border-gray-700 hover:text-gray-200'
                }`}
              >
                <div className="text-[10px] font-mono text-sky-400 font-bold">PATH 0{idx + 1}</div>
                <div className="text-xs font-bold mt-1 text-white">{item.name}</div>
                <div className="text-[10px] text-gray-400 mt-0.5 leading-tight">{item.desc}</div>
              </button>
            );
          })}
        </div>

        {/* Main Curriculum Reader Workspace */}
        {selectedPath && (
          <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
            
            {/* Left Module Sidebar (4 Columns) */}
            <div className="lg:col-span-4 space-y-3">
              <div className="p-4 rounded-lg bg-gray-900 border border-gray-800 space-y-3">
                <div className="text-xs font-mono text-sky-400 font-bold uppercase">
                  MODULE CURRICULUM
                </div>
                <h3 className="text-sm font-bold text-white">{selectedPath.title}</h3>
                <p className="text-xs text-gray-400">{selectedPath.description}</p>

                <div className="space-y-1.5 pt-2 border-t border-gray-800">
                  {selectedPath.modules.map((mod, idx) => (
                    <button
                      key={mod.id}
                      onClick={() => {
                        setActiveModuleIndex(idx);
                        setQuizSubmitted(false);
                        setSelectedQuizAnswers({});
                      }}
                      className={`w-full p-2.5 rounded text-left text-xs font-medium flex items-center justify-between transition-colors ${
                        activeModuleIndex === idx
                          ? 'bg-sky-950 text-sky-300 font-bold border border-sky-800/60'
                          : 'bg-gray-950 text-gray-300 hover:bg-gray-850'
                      }`}
                    >
                      <div className="flex items-center gap-2 truncate">
                        <span className="font-mono text-[10px] text-sky-400">M{idx + 1}</span>
                        <span className="truncate">{mod.title}</span>
                      </div>
                      <ChevronRight className="w-3.5 h-3.5 text-gray-500 shrink-0" />
                    </button>
                  ))}
                </div>
              </div>
            </div>

            {/* Right Module Content & Quiz (8 Columns) */}
            <div className="lg:col-span-8 space-y-6">
              {currentModule && (
                <div className="p-6 rounded-lg bg-gray-900 border border-gray-800 space-y-6">
                  
                  {/* Module Title */}
                  <div className="border-b border-gray-800 pb-4">
                    <span className="text-xs font-mono text-sky-400 font-bold">
                      MODULE {activeModuleIndex + 1} OF {selectedPath.modules.length}
                    </span>
                    <h2 className="text-xl font-bold text-white mt-1">{currentModule.title}</h2>
                  </div>

                  {/* Markdown Content Reader */}
                  <div className="prose prose-invert prose-xs max-w-none text-gray-200 leading-relaxed font-sans space-y-3">
                    <p>{currentModule.content_markdown}</p>
                  </div>

                  {/* Linked Evidence Section */}
                  <div className="p-3.5 rounded bg-[#0B0F17] border border-gray-800 space-y-2 text-xs font-mono">
                    <div className="text-emerald-400 font-bold flex items-center gap-1.5">
                      <BookOpen className="w-4 h-4" />
                      <span>LINKED PRIMARY EVIDENCE & RESEARCH</span>
                    </div>
                    <div className="text-gray-300">
                      Linked Publication: <Link to="/repository" className="text-sky-400 underline">DOC-001 (ISEA-43 Scientific Report)</Link>
                    </div>
                    <div className="text-gray-300">
                      Linked Primary Dataset: <Link to="/repository" className="text-emerald-400 underline font-semibold">DS-2024-ISEA43-GPR (SHA-256 Validated)</Link>
                    </div>
                  </div>

                  {/* Interactive Quiz Section */}
                  {currentModule.quiz_questions && currentModule.quiz_questions.length > 0 && (
                    <div className="pt-4 border-t border-gray-800 space-y-4">
                      <div className="flex items-center justify-between">
                        <h3 className="text-sm font-bold text-white uppercase font-mono flex items-center gap-1.5">
                          <HelpCircle className="w-4 h-4 text-purple-400" />
                          <span>MODULE KNOWLEDGE CHECK</span>
                        </h3>
                        {quizSubmitted && (
                          <span className="text-xs font-mono font-bold text-emerald-400 bg-emerald-950 px-2 py-0.5 rounded border border-emerald-800">
                            SCORE: {calculateScore()}%
                          </span>
                        )}
                      </div>

                      <div className="space-y-4">
                        {currentModule.quiz_questions.map((q, qIdx) => (
                          <div key={qIdx} className="p-4 rounded bg-[#0B0F17] border border-gray-800 space-y-2.5">
                            <div className="text-xs font-bold text-white">
                              {qIdx + 1}. {q.question}
                            </div>

                            <div className="space-y-1.5">
                              {q.options.map((opt, optIdx) => {
                                const isSelected = selectedQuizAnswers[qIdx] === optIdx;
                                const isCorrect = q.correct_answer === optIdx;

                                let optStyle = 'bg-gray-900 border-gray-800 text-gray-300 hover:border-gray-700';
                                if (quizSubmitted) {
                                  if (isCorrect) optStyle = 'bg-emerald-950 border-emerald-500 text-emerald-200 font-bold';
                                  else if (isSelected) optStyle = 'bg-red-950 border-red-500 text-red-200';
                                } else if (isSelected) {
                                  optStyle = 'bg-sky-950 border-sky-500 text-white font-semibold';
                                }

                                return (
                                  <button
                                    key={optIdx}
                                    onClick={() => handleQuizOptionSelect(qIdx, optIdx)}
                                    className={`w-full p-2.5 rounded text-left text-xs border transition-all ${optStyle}`}
                                  >
                                    {opt}
                                  </button>
                                );
                              })}
                            </div>

                            {quizSubmitted && (
                              <div className="p-2 rounded bg-gray-900 text-[11px] text-gray-300 font-mono italic">
                                <strong className="text-sky-400 not-italic">Explanation: </strong>
                                {q.explanation}
                              </div>
                            )}
                          </div>
                        ))}
                      </div>

                      <div className="pt-2 flex justify-end">
                        {!quizSubmitted ? (
                          <button
                            onClick={() => setQuizSubmitted(true)}
                            className="px-4 py-2 rounded bg-purple-600 hover:bg-purple-500 text-white text-xs font-bold tracking-wide transition-colors"
                          >
                            Submit Quiz Answers
                          </button>
                        ) : (
                          <button
                            onClick={() => {
                              setQuizSubmitted(false);
                              setSelectedQuizAnswers({});
                            }}
                            className="px-4 py-2 rounded bg-gray-800 hover:bg-gray-700 text-gray-200 text-xs font-semibold transition-colors"
                          >
                            Retake Quiz
                          </button>
                        )}
                      </div>
                    </div>
                  )}

                </div>
              )}
            </div>

          </div>
        )}

      </div>
    </div>
  );
};
