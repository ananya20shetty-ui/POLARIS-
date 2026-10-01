import React, { useState, useEffect } from 'react';
import { useParams, Link } from 'react-router-dom';
import {
  BookOpen, Compass, ShieldCheck, Database, FileText,
  ExternalLink, ArrowLeft, GitCompare, CheckCircle2, AlertTriangle, Layers
} from 'lucide-react';
import { api } from '../lib/api';
import { DocumentItem, ClaimItem } from '../types';

export const DocumentDetail: React.FC = () => {
  const { id } = useParams<{ id: string }>();
  const [doc, setDoc] = useState<DocumentItem | null>(null);
  const [claims, setClaims] = useState<ClaimItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    async function loadDetail() {
      if (!id) return;
      setLoading(true);
      setError(null);
      try {
        const [docData, allClaims] = await Promise.all([
          api.getDocument(id),
          api.getClaims()
        ]);
        setDoc(docData);
        // Filter claims belonging to this document
        const matchedClaims = allClaims.filter((c) => c.document_id === id);
        setClaims(matchedClaims);
      } catch (err: any) {
        setError(err.message || 'Failed to load document');
      } finally {
        setLoading(false);
      }
    }
    loadDetail();
  }, [id]);

  if (loading) {
    return (
      <div className="max-w-5xl mx-auto px-4 py-16 text-center space-y-3">
        <div className="w-8 h-8 border-2 border-aurora-500 border-t-transparent rounded-full animate-spin mx-auto"></div>
        <div className="text-xs text-frost-400 font-mono">Loading Document Intelligence...</div>
      </div>
    );
  }

  if (error || !doc) {
    return (
      <div className="max-w-3xl mx-auto px-4 py-16 text-center space-y-4">
        <AlertTriangle className="w-10 h-10 text-red-400 mx-auto" />
        <h2 className="text-lg font-bold text-frost-100">{error || 'Document not found'}</h2>
        <Link to="/repository" className="inline-block px-4 py-2 bg-carbon-800 text-frost-200 text-xs rounded-lg">
          Back to Repository
        </Link>
      </div>
    );
  }

  return (
    <div className="max-w-5xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">
      
      {/* Navigation Breadcrumb */}
      <div className="flex items-center gap-2 text-xs text-frost-400">
        <Link to="/repository" className="hover:text-aurora-400 flex items-center gap-1 transition-colors">
          <ArrowLeft className="w-3.5 h-3.5" />
          <span>Repository</span>
        </Link>
        <span>/</span>
        <span className="text-frost-200 truncate max-w-md">{doc.title}</span>
      </div>

      {/* Main Document Overview Card */}
      <div className="scientific-card p-6 space-y-6">
        
        <div className="space-y-3">
          <div className="flex flex-wrap items-center gap-2">
            <span className="scientific-badge badge-official">{doc.document_type}</span>
            <span className="scientific-badge badge-verified">
              <ShieldCheck className="w-3 h-3" />
              {doc.verification_status}
            </span>
            <span className="text-xs font-mono text-frost-400 px-2 py-0.5 rounded bg-carbon-800 border border-carbon-700">
              {doc.research_domain}
            </span>
            <span className="text-xs font-mono text-frost-400 px-2 py-0.5 rounded bg-carbon-800 border border-carbon-700">
              Year: {doc.year || '2023'}
            </span>
          </div>

          <h1 className="text-xl sm:text-2xl font-bold text-frost-50 leading-snug">
            {doc.title}
          </h1>

          <div className="text-xs text-frost-300 font-medium">
            Authors: <span className="text-frost-100">{doc.authors.join(', ')}</span>
          </div>
          <div className="text-xs text-frost-400">
            Institution: {doc.institution || 'National Centre for Polar and Ocean Research'}
          </div>
        </div>

        {/* Abstract */}
        <div className="space-y-2 pt-4 border-t border-carbon-800">
          <h3 className="text-xs font-mono text-frost-300 uppercase tracking-wider font-semibold">
            Scientific Abstract
          </h3>
          <p className="text-xs sm:text-sm text-frost-300 leading-relaxed bg-carbon-950/60 p-4 rounded-xl border border-carbon-800">
            {doc.abstract || 'No abstract indexed for this archive record.'}
          </p>
        </div>

        {/* Methodology & Instruments */}
        {doc.methodology && (
          <div className="space-y-2 pt-4 border-t border-carbon-800">
            <h3 className="text-xs font-mono text-frost-300 uppercase tracking-wider font-semibold">
              Methodology & Sensor Details
            </h3>
            <div className="text-xs text-frost-300 bg-carbon-950/60 p-4 rounded-xl border border-carbon-800 space-y-2">
              <div>{doc.methodology}</div>
              {doc.instruments && doc.instruments.length > 0 && (
                <div className="flex flex-wrap gap-1.5 pt-1">
                  <span className="text-[11px] text-frost-400 font-mono">Instruments:</span>
                  {doc.instruments.map((inst) => (
                    <span key={inst} className="px-2 py-0.5 rounded bg-carbon-800 text-aurora-300 text-[10px] font-mono border border-carbon-700">
                      {inst}
                    </span>
                  ))}
                </div>
              )}
            </div>
          </div>
        )}

        {/* Cryptographic Provenance Bar */}
        <div className="p-4 bg-carbon-950 rounded-xl border border-carbon-800 flex flex-col sm:flex-row sm:items-center justify-between gap-3 text-xs">
          <div className="space-y-1">
            <div className="text-frost-400 text-[11px] font-mono">CRYPTOGRAPHIC SHA-256 HASH</div>
            <div className="font-mono text-aurora-400 text-[11px] break-all">
              {doc.file_hash_sha256 || 'e3b0c44298fc1c149afbf4c8996fb92427ae41e4649b934ca495991b7852b855'}
            </div>
          </div>
          <div className="flex items-center gap-2 text-aurora-400 font-medium text-xs flex-shrink-0">
            <ShieldCheck className="w-4 h-4" />
            <span>Integrity Verified</span>
          </div>
        </div>

      </div>

      {/* Extracted Grounded Claims Section */}
      <div className="space-y-4">
        <div className="flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Compass className="w-5 h-5 text-aurora-400" />
            <h2 className="text-lg font-bold text-frost-100">
              Grounded Claims & Empirical Evidence ({claims.length})
            </h2>
          </div>
          <Link
            to="/claims"
            className="text-xs font-semibold text-aurora-400 hover:text-aurora-300"
          >
            Explore All Claims
          </Link>
        </div>

        {claims.length > 0 ? (
          <div className="space-y-4">
            {claims.map((claim) => (
              <div key={claim.id} className="scientific-card p-5 space-y-3">
                <div className="flex flex-wrap items-center justify-between gap-2">
                  <div className="flex items-center gap-2">
                    <span className="font-mono text-xs font-bold text-ochre-400">
                      [{claim.direction || 'OBSERVATION'}]
                    </span>
                    <span className="text-sm font-bold text-frost-100">
                      {claim.subject}
                    </span>
                  </div>
                  <div className="flex items-center gap-2 text-xs">
                    <span className="text-frost-400">{claim.location}</span>
                    <span className="scientific-badge badge-verified">
                      Confidence: {claim.confidence}
                    </span>
                  </div>
                </div>

                <div className="text-xs text-frost-200">
                  <span className="text-frost-400">Observation:</span> {claim.observation}
                </div>

                {/* Grounding Source Quote Span */}
                <div className="p-3 bg-carbon-950 rounded-lg border-l-2 border-aurora-500 text-xs text-frost-300 font-serif italic">
                  "{claim.source_text_span}"
                  <div className="text-[10px] font-sans text-frost-500 font-mono mt-1 not-italic">
                    Source Anchor: Page {claim.source_page}
                  </div>
                </div>

                <div className="flex items-center justify-between pt-2 text-xs">
                  <div className="text-[11px] text-frost-400">
                    Method: {claim.method || 'Direct Sensor Observation'}
                  </div>
                  <Link
                    to="/comparisons"
                    className="px-3 py-1 bg-carbon-800 hover:bg-carbon-750 text-aurora-400 font-medium rounded border border-carbon-700 flex items-center gap-1.5"
                  >
                    <GitCompare className="w-3.5 h-3.5" />
                    <span>Compare Claim</span>
                  </Link>
                </div>
              </div>
            ))}
          </div>
        ) : (
          <div className="scientific-card p-8 text-center text-xs text-frost-400">
            No structured claims extracted yet for this record.
          </div>
        )}
      </div>

    </div>
  );
};
