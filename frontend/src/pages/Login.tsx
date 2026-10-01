import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, AlertTriangle, ArrowRight, UserCheck } from 'lucide-react';
import { api } from '../lib/api';

interface LoginProps {
  onLoginSuccess: (user: any) => void;
}

export const Login: React.FC<LoginProps> = ({ onLoginSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleLogin = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await api.login(email, password);
      localStorage.setItem('polaris_token', data.access_token);
      const user = await api.getMe();
      onLoginSuccess(user);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Login failed');
    } finally {
      setLoading(false);
    }
  };

  const handleQuickFill = (demoEmail: string, demoPass: string) => {
    setEmail(demoEmail);
    setPassword(demoPass);
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      
      <div className="text-center space-y-2">
        <div className="w-12 h-12 rounded-xl bg-gradient-to-br from-carbon-700 to-carbon-850 border border-aurora-500/40 flex items-center justify-center mx-auto shadow-lg">
          <span className="text-aurora-400 font-mono font-bold text-2xl">Ω</span>
        </div>
        <h1 className="text-2xl font-bold text-frost-50">Sign In to POLARIS-Ω</h1>
        <p className="text-xs text-frost-400">
          Enter your Ministry / Institutional credentials to access verified evidence layers.
        </p>
      </div>

      <div className="scientific-card p-6 sm:p-8 space-y-6">
        
        {error && (
          <div className="p-3 bg-red-950/40 border border-red-800 text-red-300 text-xs rounded-lg flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleLogin} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-frost-300 mb-1">Institutional Email</label>
            <div className="relative">
              <Mail className="w-4 h-4 text-frost-500 absolute left-3 top-3" />
              <input
                type="email"
                required
                value={email}
                onChange={(e) => setEmail(e.target.value)}
                placeholder="name@ncpor.res.in"
                className="w-full pl-9 pr-3 py-2 bg-carbon-800 border border-carbon-700 rounded-lg text-xs text-frost-100 placeholder-frost-500 focus:outline-none focus:border-aurora-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-frost-300 mb-1">Password</label>
            <div className="relative">
              <Lock className="w-4 h-4 text-frost-500 absolute left-3 top-3" />
              <input
                type="password"
                required
                value={password}
                onChange={(e) => setPassword(e.target.value)}
                placeholder="••••••••"
                className="w-full pl-9 pr-3 py-2 bg-carbon-800 border border-carbon-700 rounded-lg text-xs text-frost-100 placeholder-frost-500 focus:outline-none focus:border-aurora-500"
              />
            </div>
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-aurora-600 hover:bg-aurora-500 text-carbon-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Authenticating...' : 'Sign In'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        {/* Quick Role Sign-in for SIH Demo Evaluation */}
        <div className="pt-4 border-t border-carbon-800 space-y-2">
          <div className="text-[10px] font-mono text-frost-500 uppercase tracking-wider text-center">
            SIH Quick Role Demo Logins:
          </div>
          <div className="grid grid-cols-2 gap-2 text-[11px]">
            <button
              type="button"
              onClick={() => handleQuickFill('admin@polaris.moes.gov.in', 'admin123')}
              className="p-2 bg-carbon-800 hover:bg-carbon-750 rounded border border-carbon-700 text-aurora-400 font-mono text-left"
            >
              Director (Admin)
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('reviewer@ncpor.res.in', 'reviewer123')}
              className="p-2 bg-carbon-800 hover:bg-carbon-750 rounded border border-carbon-700 text-frost-200 font-mono text-left"
            >
              Reviewer (NCPOR)
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('researcher@ncpor.res.in', 'researcher123')}
              className="p-2 bg-carbon-800 hover:bg-carbon-750 rounded border border-carbon-700 text-frost-200 font-mono text-left"
            >
              Researcher
            </button>
            <button
              type="button"
              onClick={() => handleQuickFill('student@iit.ac.in', 'student123')}
              className="p-2 bg-carbon-800 hover:bg-carbon-750 rounded border border-carbon-700 text-frost-200 font-mono text-left"
            >
              Student / Fellow
            </button>
          </div>
        </div>

      </div>

    </div>
  );
};
