import React, { useState } from 'react';
import {
  Share2, Sparkles, Copy, Check, RefreshCw, BookOpen, Compass, Ship, Mountain,
  Layers, ArrowRight, Globe, FileText, Download, MessageSquare, AlertCircle, ShieldCheck
} from 'lucide-react';

const TwitterIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M18.244 2.25h3.308l-7.227 8.26 8.502 11.24H16.17l-5.214-6.817L4.99 21.75H1.68l7.73-8.835L1.254 2.25H8.08l4.713 6.231zm-1.161 17.52h1.833L7.084 4.126H5.117z"/>
  </svg>
);

const LinkedinIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M19 3a2 2 0 0 1 2 2v14a2 2 0 0 1-2 2H5a2 2 0 0 1-2-2V5a2 2 0 0 1 2-2h14m-.5 15.5v-5.3a3.26 3.26 0 0 0-3.26-3.26c-.85 0-1.84.52-2.28 1.3v-1.11h-2.79v8.37h2.79v-4.93c0-.77.62-1.4 1.39-1.4a1.4 1.4 0 0 1 1.4 1.4v4.93h2.75M6.46 10.9v8.37H9.2V10.9H6.46M7.83 6.45a1.64 1.64 0 1 0 0 3.27 1.64 1.64 0 0 0 0-3.27z"/>
  </svg>
);

const InstagramIcon: React.FC<{ className?: string }> = ({ className = "w-5 h-5" }) => (
  <svg className={className} viewBox="0 0 24 24" fill="currentColor">
    <path d="M12 2.163c3.204 0 3.584.012 4.85.07 3.252.148 4.771 1.691 4.919 4.919.058 1.265.069 1.645.069 4.849 0 3.205-.012 3.584-.069 4.849-.149 3.225-1.664 4.771-4.919 4.919-1.266.058-1.644.07-4.85.07-3.204 0-3.584-.012-4.849-.07-3.26-.149-4.771-1.699-4.919-4.92-.058-1.265-.07-1.644-.07-4.849 0-3.204.013-3.583.07-4.849.149-3.227 1.664-4.771 4.919-4.919 1.266-.057 1.645-.069 4.849-.069zm0-2.163c-3.259 0-3.667.014-4.947.072-4.358.2-6.78 2.618-6.98 6.98-.059 1.281-.073 1.689-.073 4.948 0 3.259.014 3.668.072 4.948.2 4.358 2.618 6.78 6.98 6.98 1.281.058 1.689.072 4.948.072 3.259 0 3.668-.014 4.948-.072 4.354-.2 6.782-2.618 6.979-6.98.059-1.28.073-1.689.073-4.948 0-3.259-.014-3.667-.072-4.947-.196-4.354-2.617-6.78-6.979-6.98-1.281-.059-1.69-.073-4.949-.073zm0 5.838a6.162 6.162 0 1 0 0 12.324 6.162 6.162 0 0 0 0-12.324zm0 10.162a3.999 3.999 0 1 1 0-7.998 3.999 3.999 0 0 1 0 7.998zm6.406-11.845a1.44 1.44 0 1 0 0 2.881 1.44 1.44 0 0 0 0-2.881z"/>
  </svg>
);

interface ContentTemplate {
  id: string;
  category: 'Website Article' | 'Research Highlight' | 'Educational Post' | 'Social Media' | 'Expedition Story';
  title: string;
  icon: React.ComponentType<any>;
  topic: string;
  content: string;
  sources: string[];
  reviewStatus: 'Approved for Publication' | 'Pending Verification';
}

const TEMPLATES: ContentTemplate[] = [
  {
    id: 'OUT-01',
    category: 'Website Article',
    title: "India's 43rd Antarctic Expedition Completes Summer Program",
    icon: Globe,
    topic: 'ISEA-43 Expedition',
    content: `NEW DELHI, 15 March 2024 — The National Centre for Polar and Ocean Research (NCPOR), under the Ministry of Earth Sciences, announces the successful completion of the 43rd Indian Scientific Expedition to Antarctica (ISEA-43).\n\nThe 44-member contingent operated from Maitri and Bharati research stations, extracting 14 deep ice cores and completing a 320 km GPR ice sheet traverse. All datasets are archived with SHA-256 integrity verification in the POLARIS-Ω repository.`,
    sources: ['DOC-001 (ISEA-43 Scientific Report)', 'DS-2024-ISEA43-GPR'],
    reviewStatus: 'Approved for Publication'
  },
  {
    id: 'OUT-02',
    category: 'Research Highlight',
    title: 'Atlantic Water Warming Signal in Kongsfjorden Arctic Fjord',
    icon: FileText,
    topic: 'IndARC Mooring CTD Series',
    content: `IndARC mooring telemetry (200m depth) reveals intermediate Atlantic Water temperature increase of +0.9°C over 2012-2022. This Atlantification signal modulates regional Arctic sea-ice seasonality.\n\nVerified against primary CTD hydrographic profiles in POLARIS-Ω repository.`,
    sources: ['DOC-002 (IndARC Mooring Time Series)', 'DS-2022-ARC'],
    reviewStatus: 'Approved for Publication'
  },
  {
    id: 'OUT-03',
    category: 'Social Media',
    title: 'Antarctic Sea Ice Extent — Prydz Bay Update',
    icon: TwitterIcon,
    topic: 'CryoSat-2 Altimetry',
    content: `📡 #PolarScience Update from @NCPOR_India\n\nISEA-42 expedition data reveals Antarctic sea-ice extent in Prydz Bay has decreased 2.1% decade⁻¹ (1981–2023) per CryoSat-2 altimetry calibration.\n\nKey finding: Location & season drive variance — not methodology. Evidence chain at POLARIS-Ω 🧊`,
    sources: ['DOC-001', 'DOC-003'],
    reviewStatus: 'Pending Verification'
  },
  {
    id: 'OUT-04',
    category: 'Educational Post',
    title: 'What Do Ice Cores Tell Us About Past Climate?',
    icon: InstagramIcon,
    topic: 'Ice Core Paleoclimatology',
    content: `🧊 Every layer in an ice core = one year of snowfall.\n\nAir bubbles trapped inside contain actual ancient atmosphere — allowing scientists to measure CO2 levels from 800,000 years ago!\n\nIndia's ice core programme operates from Maitri & Bharati stations in East Antarctica.`,
    sources: ['DOC-001 (ISEA-43 Report)', 'Learning Path #3'],
    reviewStatus: 'Approved for Publication'
  },
  {
    id: 'OUT-05',
    category: 'Expedition Story',
    title: 'Life at Bharati Station: East Antarctic Frontier',
    icon: Ship,
    topic: 'Bharati Station Operations',
    content: `Located on a bedrock promontory overlooking Prydz Bay, Bharati Station operates year-round with automated heating and zero-wastewater discharge.\n\nResearchers conduct daily radiosonde balloon launches and GPR ice sheet traverses across Larsemann Hills.`,
    sources: ['Station Manual #STN-BHARATI', 'Expedition Log ISEA-43'],
    reviewStatus: 'Approved for Publication'
  }
];

export const SocialContent: React.FC = () => {
  const [activeTab, setActiveTab] = useState<string>('All');
  const [copiedId, setCopiedId] = useState<string | null>(null);

  const categories = ['All', 'Website Article', 'Research Highlight', 'Educational Post', 'Social Media', 'Expedition Story'];

  const filtered = TEMPLATES.filter(t => activeTab === 'All' || t.category === activeTab);

  const handleCopy = (id: string, text: string) => {
    navigator.clipboard.writeText(text);
    setCopiedId(id);
    setTimeout(() => setCopiedId(null), 2000);
  };

  return (
    <div className="min-h-screen bg-[#0B0F17] text-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <Share2 className="w-6 h-6 text-sky-400" />
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Outreach Studio
              </h1>
            </div>
            <p className="text-xs text-gray-400 mt-1 max-w-3xl leading-relaxed">
              AI-assisted scientific dissemination generator. Converts verified research publications into outreach articles, educational summaries, and social highlights with explicit source citation and reviewer validation status.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#0F172A] border border-gray-800 text-xs font-mono text-amber-300 shrink-0">
            <div className="font-semibold flex items-center gap-1">
              <AlertCircle className="w-3.5 h-3.5 text-amber-400" />
              <span>Human-in-the-Loop Safeguard</span>
            </div>
            <div className="text-[11px] text-gray-400">
              Never automatically publishes without NCPOR reviewer sign-off.
            </div>
          </div>
        </div>

        {/* Category Tabs */}
        <div className="flex items-center gap-2 border-b border-gray-800 pb-3 overflow-x-auto">
          {categories.map((cat) => (
            <button
              key={cat}
              onClick={() => setActiveTab(cat)}
              className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-colors ${
                activeTab === cat
                  ? 'bg-sky-950 text-sky-400 border border-sky-800/60'
                  : 'text-gray-400 hover:text-white hover:bg-gray-800/40'
              }`}
            >
              {cat}
            </button>
          ))}
        </div>

        {/* Content Cards */}
        <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
          {filtered.map((item) => {
            const Icon = item.icon;
            const isApproved = item.reviewStatus === 'Approved for Publication';

            return (
              <div
                key={item.id}
                className="p-5 rounded-lg bg-gray-900 border border-gray-800 space-y-4 hover:border-gray-700 transition-colors flex flex-col justify-between"
              >
                <div className="space-y-3">
                  {/* Top Badge Row */}
                  <div className="flex items-center justify-between">
                    <div className="flex items-center gap-2">
                      <Icon className="w-4 h-4 text-sky-400" />
                      <span className="text-xs font-mono font-bold text-sky-300">{item.category}</span>
                    </div>
                    <span className={`text-[10px] font-mono px-2 py-0.5 rounded border ${
                      isApproved ? 'text-emerald-400 bg-emerald-950 border-emerald-800' : 'text-amber-300 bg-amber-950 border-amber-800'
                    }`}>
                      {item.reviewStatus}
                    </span>
                  </div>

                  <h3 className="text-sm font-bold text-white">{item.title}</h3>

                  {/* AI Disclaimer Box */}
                  <div className="p-2.5 rounded bg-[#0B0F17] border border-gray-800 text-[11px] font-mono text-gray-400 space-y-1">
                    <div className="text-sky-400 font-semibold flex items-center gap-1">
                      <Sparkles className="w-3 h-3" />
                      <span>AI-ASSISTED INSIGHT</span>
                    </div>
                    <div>Source Documents: <span className="text-gray-200">{item.sources.join(', ')}</span></div>
                  </div>

                  {/* Generated Text */}
                  <div className="p-3 rounded bg-gray-950 border border-gray-800/80 text-xs text-gray-200 leading-relaxed whitespace-pre-wrap font-sans">
                    {item.content}
                  </div>
                </div>

                {/* Actions */}
                <div className="pt-3 border-t border-gray-800 flex items-center justify-between text-xs">
                  <span className="text-[11px] font-mono text-gray-500">ID: {item.id}</span>
                  <button
                    onClick={() => handleCopy(item.id, item.content)}
                    className="inline-flex items-center gap-1.5 px-3 py-1.5 rounded bg-sky-950 hover:bg-sky-900 text-sky-300 border border-sky-800/60 font-semibold transition-colors"
                  >
                    {copiedId === item.id ? <Check className="w-3.5 h-3.5 text-emerald-400" /> : <Copy className="w-3.5 h-3.5" />}
                    <span>{copiedId === item.id ? 'Copied' : 'Copy Text'}</span>
                  </button>
                </div>
              </div>
            );
          })}
        </div>

      </div>
    </div>
  );
};
