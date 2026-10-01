import React, { useState } from 'react';
import { Link } from 'react-router-dom';
import {
  Clock, Calendar, Layers, BookOpen, Filter, ArrowRight,
  CheckCircle2, HelpCircle, AlertCircle, Compass, FileText, Mountain, Sparkles
} from 'lucide-react';

export const Timeline: React.FC = () => {
  const [selectedDecade, setSelectedDecade] = useState<string>('All');
  const [activeLandscapeTab, setActiveLandscapeTab] = useState<'Supporting' | 'Contrasting' | 'Uncertain' | 'Insufficient'>('Supporting');

  const decades = ['All', '1981-1990', '1991-2000', '2001-2010', '2011-2020', '2021-2026'];

  const timelineEvents = [
    {
      year: 1981,
      decade: '1981-1990',
      title: 'First Indian Scientific Expedition to Antarctica (ISEA-01)',
      category: 'Expedition',
      domain: 'General Polar Science',
      summary: 'Landed at Queen Maud Land under Dr. S.Z. Qasim. Established baseline meteorological observations and preliminary ice sampling.',
      landscape: 'Supporting'
    },
    {
      year: 1983,
      decade: '1981-1990',
      title: 'Dakshin Gangotri Station Commissioned',
      category: 'Station',
      domain: 'Glaciology',
      summary: 'India’s first permanent Antarctic base established (70°05’S, 12°00’E). Initiated continuous meteorological radiosonde profiling.',
      landscape: 'Supporting'
    },
    {
      year: 1989,
      decade: '1981-1990',
      title: 'Maitri Station Commissioned at Schirmacher Oasis',
      category: 'Station',
      domain: 'Geomagnetism / Atmospheric',
      summary: 'Replaced Dakshin Gangotri with permanent ice-free rock foundation base. Continuous geomagnetism and ozone hole monitoring initialized.',
      landscape: 'Supporting'
    },
    {
      year: 2008,
      decade: '2001-2010',
      title: 'Himadri Arctic Station Established in Svalbard',
      category: 'Station',
      domain: 'Arctic Climate',
      summary: 'India’s first Arctic research station opened in Ny-Ålesund (78°55’N). Focus on atmospheric aerosol transport and fjord hydrography.',
      landscape: 'Supporting'
    },
    {
      year: 2012,
      decade: '2011-2020',
      title: 'Bharati Station Commissioned in Larsemann Hills',
      category: 'Station',
      domain: 'Oceanography / Altimetry',
      summary: 'State-of-the-art third Antarctic base (69°24’S, 76°11’E). Direct access to Prydz Bay oceanographic processes and satellite calibration.',
      landscape: 'Supporting'
    },
    {
      year: 2014,
      decade: '2011-2020',
      title: 'IndARC Underwater Moored Observatory Deployed',
      category: 'Dataset',
      domain: 'Arctic Hydrography',
      summary: 'First multi-sensor underwater mooring at 200m depth in Kongsfjorden. Tracks Atlantic Water temperature pulse entries.',
      landscape: 'Contrasting'
    },
    {
      year: 2016,
      decade: '2011-2020',
      title: 'Himansh Observatory Operational in High Himalaya',
      category: 'Station',
      domain: 'Cryosphere Hydrology',
      summary: 'High-altitude research facility commissioned in Spiti (4,000m ASL). Monitoring Himalayan glacier mass balance and water security.',
      landscape: 'Supporting'
    },
    {
      year: 2024,
      decade: '2021-2026',
      title: 'ISEA-43 East Antarctic Ice Sheet GPR Traverse',
      category: 'Publication',
      domain: 'Glaciology',
      summary: '320 km ground-penetrating radar traverse and extraction of 14 deep ice cores. Calibrated co-located with CryoSat-2 passes.',
      landscape: 'Supporting'
    }
  ];

  const filteredEvents = timelineEvents.filter((ev) => {
    if (selectedDecade === 'All') return true;
    return ev.decade === selectedDecade;
  });

  return (
    <div className="min-h-screen py-8 px-4 sm:px-6 lg:px-8 font-sans transition-colors duration-200">
      <div className="max-w-6xl mx-auto space-y-6">
        
        {/* Header Title */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-slate-200 dark:border-slate-800 pb-5">
          <div>
            <div className="flex items-center gap-2.5">
              <Clock className="w-5 h-5 text-sky-600 dark:text-sky-400" />
              <h1 className="text-2xl font-bold text-slate-900 dark:text-white tracking-tight">
                Research Evolution
              </h1>
            </div>
            <p className="text-xs text-slate-500 dark:text-slate-400 mt-1 max-w-3xl leading-relaxed">
              Decadal timeline of Indian polar expeditions (1981–2026), methodological shifts, and evidence landscapes across Antarctica, the Arctic, and the Himalayas.
            </p>
          </div>

          {/* Decade Filter Tabs */}
          <div className="flex items-center gap-1 overflow-x-auto bg-slate-100 dark:bg-slate-900 p-1 rounded-xl border border-slate-200 dark:border-slate-800 shrink-0 shadow-sm">
            {decades.map((dec) => (
              <button
                key={dec}
                onClick={() => setSelectedDecade(dec)}
                className={`px-3 py-1.5 rounded-lg text-xs font-mono font-semibold transition-all ${
                  selectedDecade === dec
                    ? 'bg-white dark:bg-slate-800 text-sky-700 dark:text-sky-300 border border-slate-200 dark:border-slate-700 shadow-sm'
                    : 'text-slate-600 dark:text-slate-400 hover:text-slate-900 dark:hover:text-white'
                }`}
              >
                {dec}
              </button>
            ))}
          </div>
        </div>

        {/* Evidence Landscape Categorization */}
        <div className="p-4 sm:p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm space-y-3">
          <div className="flex flex-col sm:flex-row sm:items-center justify-between gap-1">
            <span className="text-xs font-mono font-bold text-slate-700 dark:text-slate-300 uppercase tracking-wider flex items-center gap-1.5">
              <Sparkles className="w-3.5 h-3.5 text-sky-600 dark:text-sky-400" />
              Evidence Landscape Classification
            </span>
            <span className="text-[11px] font-mono text-slate-400 dark:text-slate-500">
              Categories reflect observational status without claiming artificial consensus
            </span>
          </div>

          <div className="grid grid-cols-2 sm:grid-cols-4 gap-3">
            {[
              {
                key: 'Supporting',
                label: 'SUPPORTING EVIDENCE',
                count: 18,
                themeClass: 'bg-emerald-50 dark:bg-emerald-950/40 text-emerald-900 dark:text-emerald-300 border-emerald-200 dark:border-emerald-800/60',
                countColor: 'text-emerald-700 dark:text-emerald-400'
              },
              {
                key: 'Contrasting',
                label: 'CONTRASTING FINDINGS',
                count: 6,
                themeClass: 'bg-amber-50 dark:bg-amber-950/40 text-amber-900 dark:text-amber-300 border-amber-200 dark:border-amber-800/60',
                countColor: 'text-amber-700 dark:text-amber-400'
              },
              {
                key: 'Uncertain',
                label: 'UNCERTAIN / PRELIMINARY',
                count: 9,
                themeClass: 'bg-purple-50 dark:bg-purple-950/40 text-purple-900 dark:text-purple-300 border-purple-200 dark:border-purple-800/60',
                countColor: 'text-purple-700 dark:text-purple-400'
              },
              {
                key: 'Insufficient',
                label: 'INSUFFICIENT DATA',
                count: 4,
                themeClass: 'bg-slate-100 dark:bg-slate-800/60 text-slate-800 dark:text-slate-300 border-slate-200 dark:border-slate-700',
                countColor: 'text-slate-700 dark:text-slate-400'
              }
            ].map((tab) => (
              <button
                key={tab.key}
                onClick={() => setActiveLandscapeTab(tab.key as any)}
                className={`p-3 rounded-lg border text-left transition-all ${tab.themeClass} ${
                  activeLandscapeTab === tab.key ? 'ring-2 ring-sky-500 shadow-sm' : 'opacity-85 hover:opacity-100'
                }`}
              >
                <div className="text-[10px] font-mono font-bold tracking-wider opacity-90">{tab.label}</div>
                <div className={`text-lg font-mono font-bold mt-1 ${tab.countColor}`}>{tab.count} Artifacts</div>
              </button>
            ))}
          </div>
        </div>

        {/* Chronological Decadal Track */}
        <div className="relative border-l-2 border-slate-200 dark:border-slate-800 ml-4 pl-6 space-y-5">
          {filteredEvents.map((ev) => (
            <div key={ev.year + ev.title} className="relative group">
              {/* Timeline Marker Node */}
              <div className="absolute -left-[31px] top-3.5 w-3.5 h-3.5 rounded-full bg-white dark:bg-slate-900 border-2 border-sky-600 dark:border-sky-400 flex items-center justify-center shadow-sm">
                <div className="w-1.5 h-1.5 rounded-full bg-sky-600 dark:bg-sky-400"></div>
              </div>

              <div className="p-5 rounded-xl bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-slate-300 dark:hover:border-slate-700 space-y-2 transition-all">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2 font-mono">
                    <span className="text-sm font-bold text-sky-700 dark:text-sky-400">{ev.year}</span>
                    <span className="text-[11px] px-2 py-0.5 rounded bg-slate-100 dark:bg-slate-800 text-slate-700 dark:text-slate-300 border border-slate-200 dark:border-slate-700 font-medium">
                      {ev.category}
                    </span>
                    <span className="text-xs text-slate-400 dark:text-slate-500 font-sans">{ev.domain}</span>
                  </div>
                  <span className="text-[10px] font-mono px-2 py-0.5 rounded-full bg-emerald-50 dark:bg-emerald-950/60 text-emerald-800 dark:text-emerald-300 border border-emerald-200 dark:border-emerald-800 font-medium">
                    {ev.landscape} Evidence
                  </span>
                </div>

                <h3 className="text-sm sm:text-base font-bold text-slate-900 dark:text-white">{ev.title}</h3>
                <p className="text-xs text-slate-600 dark:text-slate-300 leading-relaxed">{ev.summary}</p>

                <div className="pt-2 flex justify-end border-t border-slate-100 dark:border-slate-800/80">
                  <Link
                    to={`/repository?search=${encodeURIComponent(ev.title)}`}
                    className="text-xs font-semibold text-sky-600 hover:text-sky-700 dark:text-sky-400 dark:hover:text-sky-300 flex items-center gap-1 transition-colors"
                  >
                    <span>Inspect Publications & Datasets</span>
                    <ArrowRight className="w-3.5 h-3.5" />
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
