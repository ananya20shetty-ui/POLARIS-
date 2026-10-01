import React, { useState, useEffect } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import {
  Compass, BookOpen, GitCompare, Zap, Clock, HelpCircle,
  Sparkles, MapPin, GraduationCap, ShieldCheck, Search, ArrowRight,
  Database, Network, Layers, FileCheck, CheckCircle2, ChevronRight,
  Globe, Activity, Satellite, BarChart3, Lock, Shield
} from 'lucide-react';
import { api } from '../lib/api';
import { AnalyticsSummary, StationItem, ExpeditionItem } from '../types';

export const Home: React.FC = () => {
  const navigate = useNavigate();
  const [searchQuery, setSearchQuery] = useState('');
  const [analytics, setAnalytics] = useState<AnalyticsSummary | null>(null);
  const [stations, setStations] = useState<StationItem[]>([]);
  const [expeditions, setExpeditions] = useState<ExpeditionItem[]>([]);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    async function loadData() {
      try {
        const [statsData, stationsData, expData] = await Promise.all([
          api.getAnalytics().catch(() => null),
          api.getStations().catch(() => []),
          api.getExpeditions().catch(() => [])
        ]);
        if (statsData) setAnalytics(statsData);
        setStations(stationsData);
        setExpeditions(expData);
      } catch (err) {
        console.error('Failed to load home page telemetry:', err);
      } finally {
        setLoading(false);
      }
    }
    loadData();
  }, []);

  const handleSearchSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (searchQuery.trim()) {
      navigate(`/repository?search=${encodeURIComponent(searchQuery.trim())}`);
    }
  };

  return (
    <div className="min-h-screen flex flex-col font-sans transition-colors duration-200">
      
      {/* ── 1. Hero Section ────────────────────────────────────────────────────────── */}
      <section className="relative pt-14 pb-16 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 dark:border-slate-800 bg-gradient-to-b from-slate-50/80 via-white to-slate-50/40 dark:from-[#0F172A] dark:via-[#0B1120] dark:to-[#0B1120]">
        <div className="max-w-4xl mx-auto text-center relative z-10 space-y-4">
          
          {/* Institutional Badge */}
          <div className="inline-flex items-center gap-2 px-3.5 py-1 rounded-full bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800/80 text-sky-800 dark:text-sky-300 text-xs font-medium tracking-wide shadow-sm animate-fade-in-up">
            <span className="w-2 h-2 rounded-full bg-emerald-500 animate-pulse" />
            <span className="font-mono text-[11px]">Ministry of Earth Sciences • NCPOR Official Polar Evidence System</span>
          </div>

          {/* Main Title */}
          <h1 className="text-4xl sm:text-5xl lg:text-6xl font-extrabold text-slate-900 dark:text-white tracking-tight leading-tight animate-fade-in-up">
            POLARIS<span className="text-sky-600 dark:text-sky-400">-Ω</span>
          </h1>
          
          <p className="text-lg sm:text-xl text-slate-700 dark:text-slate-200 font-medium max-w-2xl mx-auto animate-fade-in-up">
            Empirical evidence infrastructure for Indian polar and cryosphere science.
          </p>

          <p className="text-xs sm:text-sm text-slate-500 dark:text-slate-400 max-w-2xl mx-auto leading-relaxed animate-fade-in-up">
            Connecting four decades of expeditions across Antarctica, the Arctic, and the Himalayas. Discover peer-reviewed claims, stress-test apparent disagreements, and trace findings to raw sensor observations.
          </p>

          {/* Search Box */}
          <form onSubmit={handleSearchSubmit} className="pt-2 max-w-2xl mx-auto animate-fade-in-up">
            <div className="relative flex items-center rounded-xl border border-slate-300 dark:border-slate-700 bg-white dark:bg-slate-900/90 shadow-sm focus-within:border-sky-600 focus-within:ring-2 focus-within:ring-sky-100 dark:focus-within:ring-sky-950 transition-all">
              <Search className="w-4 h-4 text-slate-400 ml-4 shrink-0" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Search publications, empirical claims, datasets, stations..."
                className="w-full px-3 py-3.5 bg-transparent text-sm text-slate-900 dark:text-slate-100 placeholder-slate-400 focus:outline-none"
              />
              <button
                type="submit"
                className="mr-2 px-4 py-2 rounded-lg bg-sky-600 hover:bg-sky-700 text-white text-xs font-semibold tracking-wide transition-all shrink-0 shadow-sm"
              >
                Search Evidence
              </button>
            </div>
          </form>

          {/* Quick Filter Badges */}
          <div className="pt-1 flex flex-wrap items-center justify-center gap-1.5 text-xs text-slate-500 dark:text-slate-400 animate-fade-in-up">
            <span className="text-[11px] font-mono mr-1">Suggested:</span>
            {[
              'Ice Sheet Mass Balance', 'Kongsfjorden Atlantic Water', 'Himansh Glacier Retreat',
              'Prydz Bay Polynya', 'Aerosol Optical Depth'
            ].map((topic) => (
              <button
                key={topic}
                onClick={() => navigate(`/repository?search=${encodeURIComponent(topic)}`)}
                className="px-2.5 py-1 rounded-md bg-slate-100 hover:bg-slate-200 dark:bg-slate-800 dark:hover:bg-slate-700 text-slate-700 dark:text-slate-300 text-[11px] border border-slate-200/80 dark:border-slate-700 transition-colors"
              >
                {topic}
              </button>
            ))}
          </div>

        </div>
      </section>

      {/* ── 2. Telemetry Bar ────────────────────────────────────────── */}
      <section className="py-6 px-4 sm:px-6 lg:px-8 border-b border-slate-200/80 dark:border-slate-800 bg-slate-50/50 dark:bg-slate-900/50">
        <div className="max-w-6xl mx-auto">
          <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
            
            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
                <BookOpen className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-bold font-mono text-slate-900 dark:text-white leading-none">
                  {analytics?.total_documents ?? 142}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">Verified Publications</div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
                <Compass className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-bold font-mono text-slate-900 dark:text-white leading-none">
                  {analytics?.total_claims ?? 486}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">Extracted Claims</div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
                <GitCompare className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-bold font-mono text-slate-900 dark:text-white leading-none">
                  {analytics?.disagreements_analyzed ?? 38}
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">Disagreement Analyses</div>
              </div>
            </div>

            <div className="bg-white dark:bg-slate-900 p-4 rounded-xl border border-slate-200 dark:border-slate-800 shadow-sm flex items-center gap-3.5">
              <div className="w-10 h-10 rounded-lg bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400 shrink-0">
                <Globe className="w-5 h-5" />
              </div>
              <div>
                <div className="text-xl font-bold font-mono text-slate-900 dark:text-white leading-none">
                  3 Poles
                </div>
                <div className="text-[11px] text-slate-500 dark:text-slate-400 mt-1 font-medium">Antarctic, Arctic, High Asia</div>
              </div>
            </div>

          </div>
        </div>
      </section>

      {/* ── 3. Core Modules ──────────────────────────────────────────────────── */}
      <section className="py-14 px-4 sm:px-6 lg:px-8 max-w-6xl mx-auto w-full space-y-8">
        <div className="text-center space-y-1.5">
          <div className="text-xs font-mono font-bold text-sky-600 dark:text-sky-400 uppercase tracking-wider">
            SCIENTIFIC REASONING INFRASTRUCTURE
          </div>
          <h2 className="text-2xl sm:text-3xl font-bold text-slate-900 dark:text-white tracking-tight">
            Explore Verified Evidence & Geospatial Telemetry
          </h2>
        </div>

        <div className="grid grid-cols-1 md:grid-cols-3 gap-6">
          
          {/* Module 1: 3D Geospatial Explorer */}
          <Link
            to="/map"
            className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-sky-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400">
                <Globe className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                Interactive 3D Research Globe
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Geospatial visualization of Bharati, Maitri, Himadri, IndARC, and Himansh stations with Antarctic polar projections, 3D Himalayan terrain, and field traverses.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center text-xs font-semibold text-sky-600 dark:text-sky-400 group-hover:translate-x-1 transition-transform">
              <span>Launch 3D Explorer</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </Link>

          {/* Module 2: Claims Matrix */}
          <Link
            to="/claims"
            className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-sky-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400">
                <Compass className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                Traceable Claims Matrix
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Empirical scientific claims indexed with directional changes, measurement uncertainties, line-level PDF quote verification, and SHA-256 integrity hashes.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center text-xs font-semibold text-sky-600 dark:text-sky-400 group-hover:translate-x-1 transition-transform">
              <span>Inspect Claims</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </Link>

          {/* Module 3: Stress-Testing */}
          <Link
            to="/stress-test"
            className="bg-white dark:bg-slate-900 p-6 rounded-2xl border border-slate-200 dark:border-slate-800 shadow-sm hover:shadow-md hover:border-sky-300 dark:hover:border-slate-700 transition-all flex flex-col justify-between group"
          >
            <div className="space-y-3">
              <div className="w-11 h-11 rounded-xl bg-sky-50 dark:bg-sky-950/60 border border-sky-200 dark:border-sky-800 flex items-center justify-center text-sky-600 dark:text-sky-400">
                <Zap className="w-5 h-5" />
              </div>
              <h3 className="text-base font-bold text-slate-900 dark:text-white group-hover:text-sky-600 dark:group-hover:text-sky-400 transition-colors">
                Evidence Stress-Testing
              </h3>
              <p className="text-xs text-slate-600 dark:text-slate-400 leading-relaxed">
                Methodological sensitivity analysis for scientific disagreements. Evaluate whether conflicting findings arise from differing sensor depths, seasons, or spatial windows.
              </p>
            </div>
            <div className="mt-5 pt-3 border-t border-slate-100 dark:border-slate-800 flex items-center text-xs font-semibold text-sky-600 dark:text-sky-400 group-hover:translate-x-1 transition-transform">
              <span>Run Stress-Test</span>
              <ArrowRight className="w-3.5 h-3.5 ml-1" />
            </div>
          </Link>

        </div>
      </section>

    </div>
  );
};
