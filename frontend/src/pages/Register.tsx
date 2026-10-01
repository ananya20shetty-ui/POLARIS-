import React, { useState } from 'react';
import { Link, useNavigate } from 'react-router-dom';
import { ShieldCheck, Lock, Mail, User, Building, AlertTriangle, ArrowRight } from 'lucide-react';
import { api } from '../lib/api';

interface RegisterProps {
  onRegisterSuccess: (user: any) => void;
}

export const Register: React.FC<RegisterProps> = ({ onRegisterSuccess }) => {
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [fullName, setFullName] = useState('');
  const [institution, setInstitution] = useState('National Centre for Polar and Ocean Research');
  const [role, setRole] = useState('RESEARCHER');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const navigate = useNavigate();

  const handleRegister = async (e: React.FormEvent) => {
    e.preventDefault();
    setLoading(true);
    setError(null);
    try {
      const data = await api.register(email, password, fullName, role, institution);
      localStorage.setItem('polaris_token', data.access_token);
      const user = await api.getMe();
      onRegisterSuccess(user);
      navigate('/');
    } catch (err: any) {
      setError(err.message || 'Registration failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="max-w-md mx-auto px-4 py-16 space-y-6">
      
      <div className="text-center space-y-2">
        <h1 className="text-2xl font-bold text-frost-50">Create Researcher Account</h1>
        <p className="text-xs text-frost-400">
          Join the POLARIS-Ω scientific evidence intelligence platform.
        </p>
      </div>

      <div className="scientific-card p-6 sm:p-8 space-y-6">
        
        {error && (
          <div className="p-3 bg-red-950/40 border border-red-800 text-red-300 text-xs rounded-lg flex items-center gap-2">
            <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-400" />
            <span>{error}</span>
          </div>
        )}

        <form onSubmit={handleRegister} className="space-y-4">
          <div>
            <label className="block text-xs font-medium text-frost-300 mb-1">Full Name</label>
            <div className="relative">
              <User className="w-4 h-4 text-frost-500 absolute left-3 top-3" />
              <input
                type="text"
                required
                value={fullName}
                onChange={(e) => setFullName(e.target.value)}
                placeholder="Dr. Parmanand Sharma"
                className="w-full pl-9 pr-3 py-2 bg-carbon-800 border border-carbon-700 rounded-lg text-xs text-frost-100 placeholder-frost-500 focus:outline-none focus:border-aurora-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-frost-300 mb-1">Email Address</label>
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

          <div>
            <label className="block text-xs font-medium text-frost-300 mb-1">Role / Affiliation</label>
            <select
              value={role}
              onChange={(e) => setRole(e.target.value)}
              className="w-full px-3 py-2 bg-carbon-800 border border-carbon-700 rounded-lg text-xs text-frost-100 focus:outline-none focus:border-aurora-500"
            >
              <option value="RESEARCHER">Cryosphere / Polar Researcher</option>
              <option value="STUDENT">Student / Graduate Fellow</option>
            </select>
          </div>

          <div>
            <label className="block text-xs font-medium text-frost-300 mb-1">Institution</label>
            <input
              type="text"
              value={institution}
              onChange={(e) => setInstitution(e.target.value)}
              placeholder="National Centre for Polar and Ocean Research"
              className="w-full px-3 py-2 bg-carbon-800 border border-carbon-700 rounded-lg text-xs text-frost-100 placeholder-frost-500 focus:outline-none focus:border-aurora-500"
            />
          </div>

          <button
            type="submit"
            disabled={loading}
            className="w-full py-2.5 bg-aurora-600 hover:bg-aurora-500 text-carbon-950 font-bold text-xs rounded-xl transition-all shadow-md flex items-center justify-center gap-2"
          >
            <span>{loading ? 'Creating Account...' : 'Register Account'}</span>
            <ArrowRight className="w-4 h-4" />
          </button>
        </form>

        <div className="text-center text-xs text-frost-400">
          Already registered?{' '}
          <Link to="/login" className="text-aurora-400 hover:text-aurora-300 font-medium underline">
            Sign In
          </Link>
        </div>

      </div>

    </div>
  );
};
