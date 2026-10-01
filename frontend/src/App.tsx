import React, { useState, useEffect } from 'react';
import { BrowserRouter as Router, Routes, Route, Navigate } from 'react-router-dom';
import { Navbar } from './components/Navbar';
import { Footer } from './components/Footer';
import { SearchModal } from './components/SearchModal';
import { UploadModal } from './components/UploadModal';

import { Home } from './pages/Home';
import { Repository } from './pages/Repository';
import { DocumentDetail } from './pages/DocumentDetail';
import { Claims } from './pages/Claims';
import { Comparisons } from './pages/Comparisons';
import { StressTest } from './pages/StressTest';
import { Timeline } from './pages/Timeline';
import { ResearchQuestions } from './pages/ResearchQuestions';
import { Rediscovery } from './pages/Rediscovery';
import { ResearchConnections } from './pages/ResearchConnections';
import { Provenance } from './pages/Provenance';
import { MapExplorer } from './pages/MapExplorer';
import { LearningHub } from './pages/LearningHub';
import { AdminDashboard } from './pages/AdminDashboard';
import { ReviewQueue } from './pages/ReviewQueue';
import { Evaluations } from './pages/Evaluations';
import { Login } from './pages/Login';
import { Register } from './pages/Register';
import { MediaGallery } from './pages/MediaGallery';
import { SocialContent } from './pages/SocialContent';

import { api } from './lib/api';
import { User } from './types';

export const App: React.FC = () => {
  const [user, setUser] = useState<User | null>(null);
  const [isSearchOpen, setIsSearchOpen] = useState(false);
  const [isUploadOpen, setIsUploadOpen] = useState(false);
  const [theme, setTheme] = useState<'dark' | 'light'>(() => {
    return (localStorage.getItem('polaris_theme') as 'dark' | 'light') || 'light';
  });

  useEffect(() => {
    // Apply theme class to root document & body
    if (theme === 'light') {
      document.documentElement.classList.add('light-theme');
      document.body.classList.add('light-theme');
      document.documentElement.setAttribute('data-theme', 'light');
    } else {
      document.documentElement.classList.remove('light-theme');
      document.body.classList.remove('light-theme');
      document.documentElement.setAttribute('data-theme', 'dark');
    }
    localStorage.setItem('polaris_theme', theme);
  }, [theme]);

  const toggleTheme = () => {
    setTheme(prev => (prev === 'light' ? 'dark' : 'light'));
  };

  useEffect(() => {
    async function checkAuth() {
      const token = localStorage.getItem('polaris_token');
      if (token) {
        try {
          const profile = await api.getMe();
          setUser(profile);
        } catch {
          localStorage.removeItem('polaris_token');
          setUser(null);
        }
      }
    }
    checkAuth();

    // Global keyboard shortcut: Ctrl+K → search
    const handleKeydown = (e: KeyboardEvent) => {
      if ((e.ctrlKey || e.metaKey) && e.key === 'k') {
        e.preventDefault();
        setIsSearchOpen(true);
      }
    };
    window.addEventListener('keydown', handleKeydown);
    return () => window.removeEventListener('keydown', handleKeydown);
  }, []);

  const handleLogout = () => {
    localStorage.removeItem('polaris_token');
    setUser(null);
  };

  const handleAuthSuccess = (u: User) => {
    setUser(u);
  };

  return (
    <Router>
      <div className={`min-h-screen flex flex-col ${theme === 'light' ? 'bg-[#F8FAFC] text-slate-900' : 'bg-[#0F172A] text-gray-100'} selection:bg-amber-500/30 selection:text-amber-300 transition-colors duration-200`}>
        
        {/* Upgraded Global Navigation Header with Light/Dark Theme Toggle */}
        <Navbar
          onOpenSearch={() => setIsSearchOpen(true)}
          onOpenUpload={() => setIsUploadOpen(true)}
          user={user}
          onLogout={handleLogout}
          theme={theme}
          onToggleTheme={toggleTheme}
        />

        {/* Dynamic Route Pages */}
        <main className="flex-1">
          <Routes>
            <Route path="/" element={<Home />} />
            <Route path="/repository" element={<Repository />} />
            <Route path="/documents/:id" element={<DocumentDetail />} />
            <Route path="/claims" element={<Claims />} />
            <Route path="/comparisons" element={<Comparisons />} />
            <Route path="/stress-test" element={<StressTest />} />
            <Route path="/evidence-gaps" element={<StressTest />} />
            <Route path="/provenance" element={<Provenance />} />
            <Route path="/timeline" element={<Timeline />} />
            <Route path="/research-questions" element={<ResearchQuestions />} />
            <Route path="/rediscovery" element={<Rediscovery />} />
            <Route path="/connections" element={<ResearchConnections />} />
            <Route path="/map" element={<MapExplorer />} />
            <Route path="/learning" element={<LearningHub />} />
            <Route path="/media" element={<MediaGallery />} />
            <Route path="/outreach" element={<SocialContent />} />
            <Route path="/reviews" element={<ReviewQueue />} />
            <Route path="/admin" element={<AdminDashboard />} />
            <Route path="/evaluations" element={<Evaluations />} />
            <Route path="/login" element={<Login onLoginSuccess={handleAuthSuccess} />} />
            <Route path="/register" element={<Register onRegisterSuccess={handleAuthSuccess} />} />
            <Route path="*" element={<Navigate to="/" replace />} />
          </Routes>
        </main>

        {/* Global Modal Dialogs */}
        <SearchModal
          isOpen={isSearchOpen}
          onClose={() => setIsSearchOpen(false)}
        />
        <UploadModal
          isOpen={isUploadOpen}
          onClose={() => setIsUploadOpen(false)}
          onSuccess={() => setIsUploadOpen(false)}
        />

        {/* Standardized Scientific Footer */}
        <Footer />

      </div>
    </Router>
  );
};
