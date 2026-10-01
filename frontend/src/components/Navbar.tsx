import React, { useState, useRef, useEffect } from 'react';
import { Link, useLocation, useNavigate } from 'react-router-dom';
import {
  Compass, BookOpen, GitCompare, Zap, Clock, HelpCircle,
  Sparkles, MapPin, GraduationCap, ShieldCheck, Search, Upload,
  User as UserIcon, LogOut, Menu, X, Layers, Network, Database,
  FileCheck2, ChevronDown, Award, Globe, LineChart, Bookmark,
  Workflow, FolderGit2, Sun, Moon
} from 'lucide-react';
import { User } from '../types';

interface NavbarProps {
  onOpenSearch: () => void;
  onOpenUpload: () => void;
  user: User | null;
  onLogout: () => void;
  theme?: 'dark' | 'light';
  onToggleTheme?: () => void;
}

export const Navbar: React.FC<NavbarProps> = ({ onOpenSearch, onOpenUpload, user, onLogout, theme = 'light', onToggleTheme }) => {
  const location = useLocation();
  const navigate = useNavigate();
  const [mobileMenuOpen, setMobileMenuOpen] = useState(false);
  const [activeDropdown, setActiveDropdown] = useState<string | null>(null);
  const navRef = useRef<HTMLDivElement>(null);

  useEffect(() => {
    const handleClickOutside = (event: MouseEvent) => {
      if (navRef.current && !navRef.current.contains(event.target as Node)) {
        setActiveDropdown(null);
      }
    };
    document.addEventListener('mousedown', handleClickOutside);
    return () => document.removeEventListener('mousedown', handleClickOutside);
  }, []);

  // Close menus on route change
  useEffect(() => {
    setActiveDropdown(null);
    setMobileMenuOpen(false);
  }, [location.pathname]);

  const navGroups = [
    {
      label: 'EXPLORE',
      items: [
        { name: 'Research Map (3D)', path: '/map', icon: Globe, desc: 'Interactive 3D polar stations, expeditions & terrain' },
        { name: 'Research Evolution', path: '/timeline', icon: Clock, desc: 'Decadal discovery trends & evidence landscape' },
        { name: 'Research Questions', path: '/research-questions', icon: HelpCircle, desc: 'Open scientific inquiries & unresolved gaps' },
        { name: 'Research Rediscovery', path: '/rediscovery', icon: Sparkles, desc: 'Historical 1980s-90s data connected to modern sensors' },
      ]
    },
    {
      label: 'EVIDENCE',
      items: [
        { name: 'Scientific Claims', path: '/claims', icon: Compass, desc: 'Traceable claims with directionality & context' },
        { name: 'Evidence Comparison', path: '/comparisons', icon: GitCompare, desc: 'Multi-variable disagreement analysis' },
        { name: 'Evidence Stress-Test', path: '/stress-test', icon: Zap, desc: 'Signature counterfactual sensitivity simulation', highlight: true },
        { name: 'Evidence Gaps', path: '/evidence-gaps', icon: Layers, desc: 'Identified missing observational variables' },
        { name: 'Evidence Provenance', path: '/provenance', icon: Workflow, desc: '2D W3C PROV lineage graph' },
      ]
    },
    {
      label: 'RESEARCH',
      items: [
        { name: 'Knowledge Repository', path: '/repository', icon: BookOpen, desc: 'Publications, reports & datasets with SHA-256 integrity' },
        { name: 'Expeditions & Routes', path: '/expeditions', icon: FolderGit2, desc: 'Antarctic, Arctic & Himalayan field campaigns' },
        { name: 'Cross-Disciplinary Links', path: '/connections', icon: Network, desc: 'Atmospheric-Ocean-Cryosphere correlations' },
        { name: 'Media Archive', path: '/media', icon: Database, desc: 'High-resolution field imagery & telemetry' },
      ]
    },
    {
      label: 'LEARN',
      items: [
        { name: 'Polar Learning Hub', path: '/learning', icon: GraduationCap, desc: 'Cryosphere curriculum, verified lessons & quizzes' },
        { name: 'Outreach Studio', path: '/outreach', icon: FileCheck2, desc: 'AI-assisted scientific dissemination with review status' },
      ]
    },
    {
      label: 'WORKSPACE',
      items: [
        { name: 'My Research', path: '/workspace', icon: UserIcon, desc: 'Personal queries, saved comparisons & drafts' },
        { name: 'Review Queue', path: '/reviews', icon: Award, desc: 'Human-in-the-loop claim & comparison moderation' },
      ]
    },
    {
      label: 'GOVERNANCE',
      items: [
        { name: 'Admin Dashboard', path: '/admin', icon: ShieldCheck, desc: 'System telemetry, RBAC roles & security' },
        { name: 'Evaluation Benchmarks', path: '/evaluations', icon: LineChart, desc: 'Quantitative model precision, recall & F1' },
      ]
    }
  ];

  const isActiveGroup = (items: { path: string }[]) => {
    return items.some(item => location.pathname.startsWith(item.path));
  };

  return (
    <header ref={navRef} className="sticky top-0 z-50 w-full font-sans">
      {/* Top Institutional Strip */}
      <div className={`px-4 py-1.5 text-[10px] font-medium flex items-center justify-between border-b ${theme === 'light' ? 'bg-[#F1F5F9] text-slate-600 border-slate-200' : 'bg-[#0B0F19] text-slate-400 border-amber-500/10'}`}>
        <div className="flex items-center gap-2">
          <span className="inline-block w-1.5 h-1.5 rounded-full bg-amber-500 animate-pulse" />
          <span className="font-mono">Ministry of Earth Sciences (MoES) • National Centre for Polar and Ocean Research (NCPOR)</span>
        </div>
        <div className="flex items-center gap-4">
          <span className="hidden sm:inline font-mono opacity-75">SIH26063</span>
          <span className={`font-mono text-[9px] px-2 py-0.5 rounded-full border font-semibold ${theme === 'light' ? 'bg-amber-100 text-amber-800 border-amber-300' : 'bg-amber-500/10 text-amber-400 border-amber-500/30'}`}>
            SHA-256 PROVENANCE: ACTIVE
          </span>
        </div>
      </div>

      {/* Main Navigation Bar */}
      <div className={`${theme === 'light' ? 'bg-white/95 border-b border-slate-200 shadow-sm' : 'bg-[#0F172A]/90 border-b border-amber-500/15 shadow-2xl'} backdrop-blur-xl`}>
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex items-center justify-between h-14">
            
            {/* Logo */}
            <Link to="/" className="flex items-center gap-2.5 group">
              <div className={`w-8 h-8 rounded-xl border flex items-center justify-center shadow-md transition-all duration-300 ${theme === 'light' ? 'bg-amber-50 border-amber-300 group-hover:border-amber-500 shadow-amber-500/5' : 'bg-gradient-to-br from-amber-500/20 to-amber-600/10 border-amber-500/40 shadow-amber-500/10 group-hover:border-amber-400/60'}`}>
                <span className={`font-mono font-bold text-lg leading-none ${theme === 'light' ? 'text-amber-600' : 'bg-gradient-to-br from-amber-400 to-amber-200 bg-clip-text text-transparent'}`}>Ω</span>
              </div>
              <div className="flex flex-col">
                <span className={`font-bold text-[15px] tracking-tight leading-none transition-colors ${theme === 'light' ? 'text-slate-900 group-hover:text-amber-600' : 'text-white group-hover:text-amber-300'}`}>
                  POLARIS<span className="text-amber-500">-Ω</span>
                </span>
                <span className={`text-[9px] tracking-[0.15em] uppercase font-mono font-medium ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>Polar Scientific Evidence Layer</span>
              </div>
            </Link>

            {/* Desktop Navigation */}
            <nav className="hidden lg:flex items-center gap-1">
              {navGroups.map((group) => {
                const active = isActiveGroup(group.items);
                const isOpen = activeDropdown === group.label;

                return (
                  <div key={group.label} className="relative">
                    <button
                      onClick={() => setActiveDropdown(isOpen ? null : group.label)}
                      className={`px-3 py-1.5 rounded-lg text-[11px] font-semibold tracking-wider flex items-center gap-1 transition-all duration-200 ${
                        active
                          ? theme === 'light' ? 'text-amber-700 bg-amber-50 border border-amber-200 font-bold' : 'text-amber-300 bg-amber-500/15 border border-amber-500/30'
                          : theme === 'light' ? 'text-slate-600 hover:text-slate-900 hover:bg-slate-100 border border-transparent' : 'text-slate-300 hover:text-white hover:bg-slate-800/60 border border-transparent'
                      }`}
                    >
                      {group.label}
                      <ChevronDown className={`w-3 h-3 transition-transform duration-200 ${isOpen ? 'rotate-180' : ''}`} />
                    </button>

                    {/* Dropdown */}
                    {isOpen && (
                      <div className={`absolute left-0 mt-2 w-[310px] rounded-xl shadow-2xl py-2 z-50 animate-fade-in border ${theme === 'light' ? 'bg-white border-slate-200 shadow-slate-300/50' : 'bg-[#0F172A]/95 backdrop-blur-2xl border-amber-500/20 shadow-black/60'}`}>
                        <div className={`px-3 py-1.5 text-[9px] font-mono uppercase tracking-[0.15em] border-b mb-1 ${theme === 'light' ? 'text-slate-500 border-slate-100' : 'text-amber-400/80 border-slate-800'}`}>
                          {group.label} SECTION
                        </div>
                        {group.items.map((item) => {
                          const Icon = item.icon;
                          const isCurrent = location.pathname === item.path;

                          return (
                            <Link
                              key={item.path}
                              to={item.path}
                              className={`flex items-start gap-2.5 px-3 py-2.5 text-xs rounded-lg transition-all duration-150 mx-1 ${
                                isCurrent
                                  ? theme === 'light' ? 'bg-amber-50 text-amber-800 font-medium border border-amber-200' : 'bg-amber-500/15 text-amber-300 font-medium border border-amber-500/25'
                                  : theme === 'light' ? 'text-slate-700 hover:text-slate-900 hover:bg-slate-50' : 'text-slate-300 hover:text-white hover:bg-slate-800/80'
                              }`}
                            >
                              <div className={`w-7 h-7 rounded-lg flex items-center justify-center shrink-0 mt-0.5 ${
                                item.highlight
                                  ? theme === 'light' ? 'bg-amber-100 border border-amber-300 text-amber-700' : 'bg-amber-500/15 border border-amber-500/30 text-amber-400'
                                  : theme === 'light' ? 'bg-slate-100 border border-slate-200 text-slate-600' : 'bg-slate-800/60 border border-slate-700/60 text-slate-400'
                              }`}>
                                <Icon className="w-3.5 h-3.5" />
                              </div>
                              <div>
                                <div className={`font-semibold flex items-center gap-1.5 ${theme === 'light' ? 'text-slate-900' : 'text-white'}`}>
                                  {item.name}
                                  {item.highlight && (
                                    <span className="text-[8px] bg-amber-500/20 text-amber-700 px-1.5 py-0.5 rounded-full border border-amber-400/40 font-bold">
                                      CORE
                                    </span>
                                  )}
                                </div>
                                <div className={`text-[10px] font-normal leading-tight mt-0.5 ${theme === 'light' ? 'text-slate-500' : 'text-slate-400'}`}>
                                  {item.desc}
                                </div>
                              </div>
                            </Link>
                          );
                        })}
                      </div>
                    )}
                  </div>
                );
              })}
            </nav>

            {/* Quick Actions & Theme Switcher */}
            <div className="flex items-center gap-2">
              
              {/* Light / Dark Mode Toggle Button */}
              {onToggleTheme && (
                <button
                  onClick={onToggleTheme}
                  className={`p-2 rounded-lg border transition-all ${
                    theme === 'light'
                      ? 'bg-slate-100 hover:bg-slate-200 text-amber-600 border-slate-300 shadow-sm'
                      : 'bg-slate-800/80 hover:bg-slate-800 text-amber-400 border-amber-500/30'
                  }`}
                  title={theme === 'light' ? 'Switch to Dark Theme' : 'Switch to Light Theme'}
                >
                  {theme === 'light' ? <Moon className="w-4 h-4" /> : <Sun className="w-4 h-4" />}
                </button>
              )}

              {/* Search */}
              <button
                onClick={onOpenSearch}
                className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-200 ${
                  theme === 'light'
                    ? 'bg-slate-100 hover:bg-slate-200 text-slate-700 border-slate-300'
                    : 'bg-slate-800/60 hover:bg-slate-800 text-slate-300 hover:text-white border-slate-700/60'
                }`}
                title="Global Search (Ctrl+K)"
              >
                <Search className="w-3.5 h-3.5 text-amber-500" />
                <span className="hidden md:inline">Search...</span>
                <kbd className={`hidden md:inline text-[9px] font-mono px-1.5 py-0.5 rounded border ${theme === 'light' ? 'bg-white text-slate-500 border-slate-300' : 'bg-slate-900 text-amber-400 border-slate-700'}`}>
                  ⌘K
                </kbd>
              </button>

              {/* Upload */}
              <button
                onClick={onOpenUpload}
                className={`hidden sm:flex items-center gap-1.5 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all duration-200 ${
                  theme === 'light'
                    ? 'bg-amber-50 hover:bg-amber-100 text-amber-800 border-amber-300'
                    : 'bg-slate-800/80 hover:bg-slate-800 text-amber-300 border-amber-500/30'
                }`}
              >
                <Upload className="w-3.5 h-3.5 text-amber-500" />
                <span>Upload</span>
              </button>

              {/* User Profile / Auth */}
              {user ? (
                <div className="flex items-center gap-2">
                  <Link
                    to="/workspace"
                    className={`flex items-center gap-2 px-3 py-1.5 rounded-lg border text-xs font-medium transition-all ${
                      theme === 'light'
                        ? 'bg-slate-100 border-slate-300 text-slate-800'
                        : 'bg-slate-800/80 border-slate-700 text-slate-200 hover:text-white'
                    }`}
                  >
                    <UserIcon className="w-3.5 h-3.5 text-amber-500" />
                    <span className="hidden md:inline">{user.full_name || user.email}</span>
                  </Link>
                  <button
                    onClick={onLogout}
                    className="p-1.5 text-slate-400 hover:text-rose-500 rounded-lg transition-all"
                    title="Sign Out"
                  >
                    <LogOut className="w-4 h-4" />
                  </button>
                </div>
              ) : (
                <Link
                  to="/login"
                  className="flex items-center gap-1.5 px-3.5 py-1.5 rounded-lg bg-gradient-to-r from-amber-500 to-amber-600 hover:from-amber-400 hover:to-amber-500 text-slate-950 font-bold text-xs shadow-md shadow-amber-500/20 transition-all duration-200"
                >
                  <UserIcon className="w-3.5 h-3.5" />
                  <span>Sign In</span>
                </Link>
              )}

              {/* Mobile Menu Button */}
              <button
                onClick={() => setMobileMenuOpen(!mobileMenuOpen)}
                className="lg:hidden p-2 rounded-lg text-slate-500 hover:text-slate-800"
              >
                {mobileMenuOpen ? <X className="w-5 h-5" /> : <Menu className="w-5 h-5" />}
              </button>
            </div>
          </div>
        </div>
      </div>

      {/* Mobile Menu Overlay */}
      {mobileMenuOpen && (
        <div className={`lg:hidden border-b px-4 py-4 space-y-4 animate-fade-in max-h-[80vh] overflow-y-auto ${theme === 'light' ? 'bg-white border-slate-200 shadow-xl' : 'bg-[#0F172A] border-amber-500/20'}`}>
          {navGroups.map((group) => (
            <div key={group.label} className="space-y-2">
              <div className="text-[10px] font-mono text-amber-600 uppercase tracking-wider font-bold">
                {group.label}
              </div>
              <div className="grid grid-cols-1 gap-1">
                {group.items.map((item) => {
                  const Icon = item.icon;
                  return (
                    <Link
                      key={item.path}
                      to={item.path}
                      className={`flex items-center gap-3 p-2 rounded-lg text-xs border ${theme === 'light' ? 'bg-slate-50 text-slate-800 border-slate-200' : 'bg-slate-900/60 text-slate-200 border-slate-800'}`}
                    >
                      <Icon className="w-4 h-4 text-amber-500" />
                      <span>{item.name}</span>
                    </Link>
                  );
                })}
              </div>
            </div>
          ))}
        </div>
      )}
    </header>
  );
};
