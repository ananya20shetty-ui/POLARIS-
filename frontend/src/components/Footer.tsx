import React from 'react';
import { Link } from 'react-router-dom';
import { ShieldCheck, Database, Compass, Globe, ExternalLink } from 'lucide-react';

export const Footer: React.FC = () => {
  return (
    <footer className="border-t border-slate-200 dark:border-slate-800 bg-slate-50/80 dark:bg-[#0B1120] text-slate-600 dark:text-slate-400 text-xs py-10 mt-16 transition-colors duration-200 font-sans">
      <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
        <div className="grid grid-cols-1 md:grid-cols-4 gap-8 mb-8">
          
          {/* Brand Col */}
          <div className="space-y-3">
            <div className="flex items-center gap-2">
              <div className="w-6 h-6 rounded bg-sky-50 dark:bg-slate-800 border border-sky-300 dark:border-sky-500/40 flex items-center justify-center">
                <span className="text-sky-600 dark:text-sky-400 font-mono font-bold text-xs">Ω</span>
              </div>
              <span className="font-bold text-slate-900 dark:text-white font-mono text-sm">POLARIS-Ω</span>
            </div>
            <p className="text-slate-500 dark:text-slate-400 leading-relaxed text-[11px]">
              Polar Research Intelligence & Scientific Evidence Layer. Developed for the Ministry of Earth Sciences (MoES) and the National Centre for Polar and Ocean Research (NCPOR).
            </p>
            <div className="flex items-center gap-1.5 text-sky-700 dark:text-sky-400 text-[11px] font-medium">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SHA-256 Cryptographic Provenance Active</span>
            </div>
          </div>

          {/* Core Modules */}
          <div>
            <h4 className="font-mono font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider mb-3">Core Modules</h4>
            <ul className="space-y-2 text-[11px]">
              <li><Link to="/repository" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Scientific Repository</Link></li>
              <li><Link to="/claims" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Claim & Evidence Matrix</Link></li>
              <li><Link to="/comparisons" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Evidence Comparison Engine</Link></li>
              <li><Link to="/stress-test" className="text-sky-600 dark:text-sky-400 hover:underline font-semibold transition-colors">⭐ Evidence Stress-Testing</Link></li>
              <li><Link to="/timeline" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Temporal Research Evolution</Link></li>
              <li><Link to="/map" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">3D Geospatial Explorer</Link></li>
            </ul>
          </div>

          {/* Expeditions & Pedagogy */}
          <div>
            <h4 className="font-mono font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider mb-3">Field Stations</h4>
            <ul className="space-y-2 text-[11px]">
              <li><Link to="/map" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Maitri Station (Schirmacher Oasis)</Link></li>
              <li><Link to="/map" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Bharati Station (Larsemann Hills)</Link></li>
              <li><Link to="/map" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Himadri Station (Ny-Ålesund, Svalbard)</Link></li>
              <li><Link to="/map" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">IndARC Mooring Observatory</Link></li>
              <li><Link to="/map" className="hover:text-sky-600 dark:hover:text-sky-400 transition-colors">Himansh High-Altitude Observatory (Spiti)</Link></li>
            </ul>
          </div>

          {/* Institutional Compliance */}
          <div>
            <h4 className="font-mono font-bold text-slate-800 dark:text-slate-200 text-xs uppercase tracking-wider mb-3">Institutional Policy</h4>
            <p className="text-[11px] text-slate-500 dark:text-slate-400 mb-3 leading-relaxed">
              POLARIS-Ω operates as a scientific reasoning layer. It reflects empirical observations without claiming artificial consensus or simulating ungrounded data.
            </p>
            <div className="bg-white dark:bg-slate-900 border border-slate-200 dark:border-slate-800 p-2.5 rounded-lg text-[10px] space-y-1 font-mono text-slate-600 dark:text-slate-400 shadow-sm">
              <div>W3C PROV: <span className="text-emerald-600 dark:text-emerald-400 font-bold">ENABLED</span></div>
              <div>SHA-256 INTEGRITY: <span className="text-emerald-600 dark:text-emerald-400 font-bold">ENFORCED</span></div>
              <div>SECURITY POLICY: <span className="text-emerald-600 dark:text-emerald-400 font-bold">RBAC ACTIVE</span></div>
            </div>
          </div>

        </div>

        {/* Bottom Bar */}
        <div className="pt-6 border-t border-slate-200 dark:border-slate-800 flex flex-col sm:flex-row items-center justify-between gap-4 text-[11px] text-slate-500">
          <div>
            © 2026 Ministry of Earth Sciences (MoES) | National Centre for Polar and Ocean Research (NCPOR).
          </div>
          <div className="flex items-center gap-5">
            <a href="https://ncpor.res.in" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
              NCPOR Official <ExternalLink className="w-3 h-3" />
            </a>
            <a href="https://moes.gov.in" target="_blank" rel="noreferrer" className="flex items-center gap-1 hover:text-slate-800 dark:hover:text-slate-200 transition-colors">
              MoES Portal <ExternalLink className="w-3 h-3" />
            </a>
          </div>
        </div>
      </div>
    </footer>
  );
};
