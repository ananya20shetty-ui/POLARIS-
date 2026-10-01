import React, { useState } from 'react';
import { Upload, X, FileText, CheckCircle, AlertTriangle, ShieldCheck, Loader2 } from 'lucide-react';
import { api } from '../lib/api';

interface UploadModalProps {
  isOpen: boolean;
  onClose: () => void;
  onSuccess: () => void;
}

export const UploadModal: React.FC<UploadModalProps> = ({ isOpen, onClose, onSuccess }) => {
  const [title, setTitle] = useState('');
  const [researchDomain, setResearchDomain] = useState('Cryospheric Sciences');
  const [documentType, setDocumentType] = useState('Research Paper');
  const [authors, setAuthors] = useState('');
  const [abstract, setAbstract] = useState('');
  const [locationName, setLocationName] = useState('Maitri Station, Antarctica');
  const [year, setYear] = useState(2024);
  const [methodology, setMethodology] = useState('');
  const [file, setFile] = useState<File | null>(null);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [success, setSuccess] = useState(false);

  if (!isOpen) return null;

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();
    if (!title.trim()) {
      setError('Document title is required');
      return;
    }

    setLoading(true);
    setError(null);

    const formData = new FormData();
    formData.append('title', title);
    formData.append('research_domain', researchDomain);
    formData.append('document_type', documentType);
    formData.append('authors', authors);
    formData.append('abstract', abstract);
    formData.append('location_name', locationName);
    formData.append('year', year.toString());
    formData.append('methodology', methodology);
    formData.append('source_type', 'USER_UPLOADED');

    if (file) {
      formData.append('file', file);
    }

    try {
      await api.uploadDocument(formData);
      setSuccess(true);
      setTimeout(() => {
        setSuccess(false);
        onSuccess();
        onClose();
      }, 1500);
    } catch (err: any) {
      setError(err.message || 'Upload failed');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-carbon-950/80 backdrop-blur-sm animate-fadeIn">
      <div className="w-full max-w-xl bg-carbon-900 border border-carbon-700 rounded-2xl shadow-2xl overflow-hidden">
        
        {/* Header */}
        <div className="p-4 border-b border-carbon-750 bg-carbon-850 flex items-center justify-between">
          <div className="flex items-center gap-2">
            <Upload className="w-5 h-5 text-aurora-400" />
            <h3 className="font-semibold text-frost-100 text-sm">Upload Scientific Research / Expedition Data</h3>
          </div>
          <button onClick={onClose} className="p-1 rounded-md text-frost-400 hover:text-frost-100 hover:bg-carbon-750">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Content Form */}
        <form onSubmit={handleSubmit} className="p-6 space-y-4 max-h-[75vh] overflow-y-auto">
          {error && (
            <div className="p-3 bg-red-950/40 border border-red-800 text-red-300 text-xs rounded-lg flex items-center gap-2">
              <AlertTriangle className="w-4 h-4 flex-shrink-0 text-red-400" />
              <span>{error}</span>
            </div>
          )}

          {success && (
            <div className="p-3 bg-aurora-950/40 border border-aurora-700 text-aurora-300 text-xs rounded-lg flex items-center gap-2">
              <CheckCircle className="w-4 h-4 flex-shrink-0 text-aurora-400" />
              <span>Document uploaded & SHA-256 cryptographic provenance logged successfully!</span>
            </div>
          )}

          <div>
            <label className="block text-xs font-medium text-frost-300 mb-1">Document Title *</label>
            <input
              type="text"
              required
              value={title}
              onChange={(e) => setTitle(e.target.value)}
              placeholder="e.g. Mass Balance Variability of Continental Ice Sheet Margin at Schirmacher Oasis"
              className="w-full px-3 py-2 bg-carbon-800 border border-carbon-700 rounded-lg text-xs text-frost-100 placeholder-frost-500 focus:outline-none focus:border-aurora-500"
            />
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-frost-300 mb-1">Research Domain</label>
              <select
                value={researchDomain}
                onChange={(e) => setResearchDomain(e.target.value)}
                className="w-full px-3 py-2 bg-carbon-800 border border-carbon-700 rounded-lg text-xs text-frost-100 focus:outline-none focus:border-aurora-500"
              >
                <option value="Cryospheric Sciences">Cryospheric Sciences</option>
                <option value="Glaciology">Glaciology</option>
                <option value="Oceanography">Oceanography</option>
                <option value="Atmospheric Sciences">Atmospheric Sciences</option>
                <option value="Paleoclimate">Paleoclimate</option>
                <option value="Marine Biology">Marine Biology</option>
              </select>
            </div>

            <div>
              <label className="block text-xs font-medium text-frost-300 mb-1">Document Type</label>
              <select
                value={documentType}
                onChange={(e) => setDocumentType(e.target.value)}
                className="w-full px-3 py-2 bg-carbon-800 border border-carbon-700 rounded-lg text-xs text-frost-100 focus:outline-none focus:border-aurora-500"
              >
                <option value="Research Paper">Research Paper</option>
                <option value="Expedition Report">Expedition Report</option>
                <option value="Scientific Dataset">Scientific Dataset</option>
                <option value="Institutional Review">Institutional Review</option>
              </select>
            </div>
          </div>

          <div className="grid grid-cols-2 gap-4">
            <div>
              <label className="block text-xs font-medium text-frost-300 mb-1">Authors (comma-separated)</label>
              <input
                type="text"
                value={authors}
                onChange={(e) => setAuthors(e.target.value)}
                placeholder="Dr. P. Sharma, Dr. R. Dey"
                className="w-full px-3 py-2 bg-carbon-800 border border-carbon-700 rounded-lg text-xs text-frost-100 placeholder-frost-500 focus:outline-none focus:border-aurora-500"
              />
            </div>

            <div>
              <label className="block text-xs font-medium text-frost-300 mb-1">Year of Observation / Publication</label>
              <input
                type="number"
                value={year}
                onChange={(e) => setYear(parseInt(e.target.value) || 2024)}
                className="w-full px-3 py-2 bg-carbon-800 border border-carbon-700 rounded-lg text-xs text-frost-100 focus:outline-none focus:border-aurora-500"
              />
            </div>
          </div>

          <div>
            <label className="block text-xs font-medium text-frost-300 mb-1">Field Location / Sector</label>
            <input
              type="text"
              value={locationName}
              onChange={(e) => setLocationName(e.target.value)}
              placeholder="e.g. Prydz Bay, Bharati Station / Kongsfjorden, Himadri"
              className="w-full px-3 py-2 bg-carbon-800 border border-carbon-700 rounded-lg text-xs text-frost-100 placeholder-frost-500 focus:outline-none focus:border-aurora-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-frost-300 mb-1">Scientific Abstract / Summary</label>
            <textarea
              rows={3}
              value={abstract}
              onChange={(e) => setAbstract(e.target.value)}
              placeholder="Summary of quantitative findings, observations, and key conclusions..."
              className="w-full px-3 py-2 bg-carbon-800 border border-carbon-700 rounded-lg text-xs text-frost-100 placeholder-frost-500 focus:outline-none focus:border-aurora-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-frost-300 mb-1">Methodology & Instruments</label>
            <input
              type="text"
              value={methodology}
              onChange={(e) => setMethodology(e.target.value)}
              placeholder="e.g. Ground Penetrating Radar (500MHz), CryoSat-2 SIRAL Altimeter"
              className="w-full px-3 py-2 bg-carbon-800 border border-carbon-700 rounded-lg text-xs text-frost-100 placeholder-frost-500 focus:outline-none focus:border-aurora-500"
            />
          </div>

          <div>
            <label className="block text-xs font-medium text-frost-300 mb-1">Upload Document / Report File (PDF, CSV, TXT)</label>
            <div className="border-2 border-dashed border-carbon-700 hover:border-aurora-500/50 rounded-xl p-4 text-center cursor-pointer transition-colors bg-carbon-850/50">
              <input
                type="file"
                accept=".pdf,.csv,.txt,.xlsx,.json"
                onChange={(e) => setFile(e.target.files?.[0] || null)}
                className="hidden"
                id="file-upload-input"
              />
              <label htmlFor="file-upload-input" className="cursor-pointer block">
                <FileText className="w-8 h-8 text-frost-400 mx-auto mb-2" />
                <span className="text-xs text-frost-200 font-medium block">
                  {file ? file.name : 'Click to select PDF or dataset file'}
                </span>
                <span className="text-[11px] text-frost-500 block mt-1">
                  {file ? `${(file.size / 1024 / 1024).toFixed(2)} MB` : 'Automatic SHA-256 hash & claim extraction'}
                </span>
              </label>
            </div>
          </div>

          <div className="flex items-center justify-between pt-2 border-t border-carbon-750">
            <div className="flex items-center gap-1.5 text-[10px] text-aurora-400 font-mono">
              <ShieldCheck className="w-3.5 h-3.5" />
              <span>SHA-256 Provenance Guaranteed</span>
            </div>
            <div className="flex gap-2">
              <button
                type="button"
                onClick={onClose}
                className="px-3 py-1.5 rounded-lg bg-carbon-800 text-frost-300 text-xs font-medium hover:bg-carbon-750"
              >
                Cancel
              </button>
              <button
                type="submit"
                disabled={loading}
                className="px-4 py-1.5 rounded-lg bg-aurora-600 hover:bg-aurora-500 text-carbon-950 font-semibold text-xs transition-colors flex items-center gap-1.5"
              >
                {loading ? <Loader2 className="w-3.5 h-3.5 animate-spin" /> : <Upload className="w-3.5 h-3.5" />}
                <span>{loading ? 'Processing Document...' : 'Submit to Repository'}</span>
              </button>
            </div>
          </div>
        </form>
      </div>
    </div>
  );
};
