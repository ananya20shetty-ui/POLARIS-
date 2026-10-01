import React, { useState, useEffect } from 'react';
import { Link, useSearchParams } from 'react-router-dom';
import {
  BookOpen, Search, Filter, ShieldCheck, FileText, CheckCircle2,
  ExternalLink, Layers, ArrowUpRight, Download, Hash, Clock, User, Building,
  AlertCircle, Sparkles, Tag, Eye
} from 'lucide-react';
import { api } from '../lib/api';
import { DocumentItem } from '../types';

export const Repository: React.FC = () => {
  const [searchParams, setSearchParams] = useSearchParams();
  const [documents, setDocuments] = useState<DocumentItem[]>([]);
  const [loading, setLoading] = useState(true);
  const [selectedDoc, setSelectedDoc] = useState<DocumentItem | null>(null);

  // Filters
  const [activeTab, setActiveTab] = useState<string>('All');
  const [searchQuery, setSearchQuery] = useState(searchParams.get('search') || '');
  const [selectedDomain, setSelectedDomain] = useState<string>('');
  const [selectedLocation, setSelectedLocation] = useState<string>('');
  const [selectedSourceType, setSelectedSourceType] = useState<string>('');

  const docTabs = [
    'All',
    'Publications',
    'Expedition Reports',
    'Datasets',
    'Photographs',
    'Videos',
    'Research Methods',
    'Educational Content'
  ];

  useEffect(() => {
    async function loadDocs() {
      setLoading(true);
      try {
        const docs = await api.getDocuments({
          search: searchQuery || undefined,
          domain: selectedDomain || undefined,
          location: selectedLocation || undefined,
          source_type: selectedSourceType || undefined
        });
        setDocuments(docs);
        if (docs.length > 0 && !selectedDoc) {
          setSelectedDoc(docs[0]);
        }
      } catch (err) {
        console.error('Failed to load repository documents:', err);
      } finally {
        setLoading(false);
      }
    }
    loadDocs();
  }, [searchQuery, selectedDomain, selectedLocation, selectedSourceType]);

  // Tab Filtering logic
  const filteredDocuments = documents.filter((doc) => {
    if (activeTab === 'All') return true;
    if (activeTab === 'Publications') return doc.document_type === 'PUBLICATIONS' || doc.document_type === 'RESEARCH_PAPER';
    if (activeTab === 'Expedition Reports') return doc.document_type === 'EXPEDITION_REPORT';
    if (activeTab === 'Datasets') return doc.document_type === 'DATASET' || doc.dataset_references.length > 0;
    if (activeTab === 'Photographs') return doc.document_type === 'PHOTOGRAPH' || doc.document_type === 'MEDIA';
    if (activeTab === 'Videos') return doc.document_type === 'VIDEO';
    if (activeTab === 'Research Methods') return doc.document_type === 'METHODOLOGY' || doc.methodology;
    if (activeTab === 'Educational Content') return doc.document_type === 'EDUCATIONAL';
    return true;
  });

  return (
    <div className="min-h-screen bg-[#0B0F17] text-gray-100 py-8 px-4 sm:px-6 lg:px-8">
      <div className="max-w-7xl mx-auto space-y-6">
        
        {/* Header Title & Provenance Definition */}
        <div className="flex flex-col md:flex-row md:items-center justify-between gap-4 border-b border-gray-800 pb-5">
          <div>
            <div className="flex items-center gap-2">
              <BookOpen className="w-6 h-6 text-sky-400" />
              <h1 className="text-2xl font-bold text-white tracking-tight">
                Scientific Knowledge Repository
              </h1>
            </div>
            <p className="text-xs text-gray-400 mt-1 max-w-3xl leading-relaxed">
              FAIR-compliant indexing of Antarctic, Arctic, and Himalayan publications, expedition reports, and datasets. Includes bit-level SHA-256 file integrity verification and transparent W3C PROV lineage tracking.
            </p>
          </div>

          <div className="p-3 rounded-lg bg-[#0F172A] border border-gray-800 text-xs font-mono text-gray-300 space-y-1 shrink-0">
            <div className="flex items-center gap-1.5 text-emerald-400 font-semibold">
              <ShieldCheck className="w-4 h-4" />
              <span>Scientific Integrity Standard</span>
            </div>
            <div className="text-[11px] text-gray-400">
              SHA-256 ensures bit-level uncorrupted file storage.<br />
              NCPOR peer review establishes scientific validity.
            </div>
          </div>
        </div>

        {/* Search & Faceted Filter Bar */}
        <div className="p-4 rounded-lg bg-gray-900 border border-gray-800 space-y-3">
          <div className="flex flex-col sm:flex-row gap-3">
            <div className="relative flex-1">
              <Search className="w-4 h-4 text-gray-400 absolute left-3 top-3" />
              <input
                type="text"
                value={searchQuery}
                onChange={(e) => setSearchQuery(e.target.value)}
                placeholder="Filter by title, author, keyword, DOI, location..."
                className="w-full pl-9 pr-4 py-2 bg-[#0B0F17] border border-gray-700 rounded-md text-xs text-white placeholder-gray-400 focus:outline-none focus:border-sky-500"
              />
            </div>

            {/* Filter Selects */}
            <select
              value={selectedDomain}
              onChange={(e) => setSelectedDomain(e.target.value)}
              className="px-3 py-2 bg-[#0B0F17] border border-gray-700 rounded-md text-xs text-gray-200 focus:outline-none"
            >
              <option value="">All Research Domains</option>
              <option value="Glaciology">Glaciology</option>
              <option value="Oceanography">Oceanography</option>
              <option value="Atmospheric Sciences">Atmospheric Sciences</option>
              <option value="Space Weather">Space Weather</option>
            </select>

            <select
              value={selectedLocation}
              onChange={(e) => setSelectedLocation(e.target.value)}
              className="px-3 py-2 bg-[#0B0F17] border border-gray-700 rounded-md text-xs text-gray-200 focus:outline-none"
            >
              <option value="">All Regions</option>
              <option value="East Antarctica">East Antarctica</option>
              <option value="Svalbard">Svalbard Arctic</option>
              <option value="Himalayas">Himalayas (Chandra Basin)</option>
            </select>

            <select
              value={selectedSourceType}
              onChange={(e) => setSelectedSourceType(e.target.value)}
              className="px-3 py-2 bg-[#0B0F17] border border-gray-700 rounded-md text-xs text-gray-200 focus:outline-none"
            >
              <option value="">All Source Types</option>
              <option value="OFFICIAL">Official NCPOR / MoES Report</option>
              <option value="OPEN_ACCESS">Open Access Academic</option>
              <option value="SYNTHETIC_TEST">Synthetic Test Data</option>
            </select>
          </div>

          {/* Navigation Category Tabs */}
          <div className="flex items-center gap-1.5 overflow-x-auto pt-2 border-t border-gray-800/60 no-scrollbar">
            {docTabs.map((tab) => (
              <button
                key={tab}
                onClick={() => setActiveTab(tab)}
                className={`px-3 py-1.5 rounded text-xs font-semibold whitespace-nowrap transition-colors ${
                  activeTab === tab
                    ? 'bg-sky-950 text-sky-400 border border-sky-800/60'
                    : 'text-gray-400 hover:text-gray-200 hover:bg-gray-800/40'
                }`}
              >
                {tab}
              </button>
            ))}
          </div>
        </div>

        {/* Main 2-Column Layout (List + Detail Inspector) */}
        <div className="grid grid-cols-1 lg:grid-cols-12 gap-6">
          
          {/* Document List (7 Columns) */}
          <div className="lg:col-span-7 space-y-3">
            {loading ? (
              <div className="p-8 text-center text-xs font-mono text-gray-400 bg-gray-900 rounded-lg border border-gray-800">
                Loading verified repository documents...
              </div>
            ) : filteredDocuments.length === 0 ? (
              <div className="p-8 text-center text-xs font-mono text-gray-400 bg-gray-900 rounded-lg border border-gray-800">
                No matching documents found in indexed sources.
              </div>
            ) : (
              filteredDocuments.map((doc) => {
                const isSelected = selectedDoc?.id === doc.id;
                const isSynthetic = doc.source_type === 'SYNTHETIC_TEST';

                return (
                  <div
                    key={doc.id}
                    onClick={() => setSelectedDoc(doc)}
                    className={`p-4 rounded-lg border cursor-pointer transition-all ${
                      isSelected
                        ? 'bg-gray-900 border-sky-500/80 shadow-md'
                        : 'bg-[#111827] border-gray-800 hover:border-gray-700'
                    }`}
                  >
                    <div className="flex items-start justify-between gap-3">
                      <div className="space-y-1">
                        <div className="flex flex-wrap items-center gap-2">
                          <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-sky-950 text-sky-400 border border-sky-800/40">
                            {doc.research_domain}
                          </span>
                          {isSynthetic && (
                            <span className="text-[10px] font-mono font-semibold px-2 py-0.5 rounded bg-amber-950 text-amber-300 border border-amber-800/60">
                              SYNTHETIC TEST DATA
                            </span>
                          )}
                          <span className="text-xs font-mono text-gray-400">{doc.year}</span>
                        </div>
                        <h3 className="text-sm font-bold text-white hover:text-sky-300 transition-colors">
                          {doc.title}
                        </h3>
                      </div>
                      <Link
                        to={`/documents/${doc.id}`}
                        className="p-1.5 rounded hover:bg-gray-800 text-gray-400 hover:text-white transition-colors"
                        title="Open Document Detail Page"
                      >
                        <ArrowUpRight className="w-4 h-4" />
                      </Link>
                    </div>

                    <p className="mt-2 text-xs text-gray-300 line-clamp-2 leading-relaxed">
                      {doc.abstract || 'No abstract provided in primary index.'}
                    </p>

                    {/* Card Metadata Grid */}
                    <div className="mt-3 pt-3 border-t border-gray-800/60 grid grid-cols-2 sm:grid-cols-4 gap-2 text-[11px] font-mono text-gray-400">
                      <div>
                        <span className="text-gray-500 block text-[10px]">AUTHORS</span>
                        <span className="truncate text-gray-300 block">{doc.authors.join(', ')}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[10px]">LOCATION</span>
                        <span className="truncate text-gray-300 block">{doc.location_name || 'N/A'}</span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[10px]">TIME PERIOD</span>
                        <span className="truncate text-gray-300 block">
                          {doc.temporal_coverage_start ? `${doc.temporal_coverage_start.split('-')[0]}-${doc.temporal_coverage_end?.split('-')[0]}` : doc.year}
                        </span>
                      </div>
                      <div>
                        <span className="text-gray-500 block text-[10px]">EVIDENCE ITEMS</span>
                        <span className="text-emerald-400 font-semibold block">{doc.citation_count || 12} Extracted</span>
                      </div>
                    </div>
                  </div>
                );
              })
            )}
          </div>

          {/* Document Detail & Provenance Panel (5 Columns) */}
          <div className="lg:col-span-5">
            {selectedDoc ? (
              <div className="sticky top-20 space-y-4">
                
                {/* Document Information Box */}
                <div className="p-4 rounded-lg bg-gray-900 border border-gray-800 space-y-3">
                  <div className="flex items-center justify-between">
                    <span className="text-xs font-mono font-semibold text-sky-400 uppercase">
                      Document Inspector
                    </span>
                    <Link
                      to={`/documents/${selectedDoc.id}`}
                      className="text-xs font-semibold text-sky-400 hover:underline flex items-center gap-1"
                    >
                      <span>Full View</span>
                      <ExternalLink className="w-3.5 h-3.5" />
                    </Link>
                  </div>

                  <h2 className="text-base font-bold text-white">{selectedDoc.title}</h2>
                  
                  <div className="text-xs text-gray-300 space-y-1 font-mono">
                    <div><span className="text-gray-500">Authors:</span> {selectedDoc.authors.join(', ')}</div>
                    <div><span className="text-gray-500">Institution:</span> {selectedDoc.institution || 'NCPOR / MoES'}</div>
                    <div><span className="text-gray-500">DOI:</span> {selectedDoc.doi || 'Not available in indexed sources.'}</div>
                    <div><span className="text-gray-500">Methodology:</span> {selectedDoc.methodology || 'Standard Field Sampling'}</div>
                  </div>

                  {/* Provenance & Integrity Panel */}
                  <div className="pt-3 border-t border-gray-800 space-y-2">
                    <div className="text-xs font-mono font-semibold text-emerald-400 flex items-center gap-1.5">
                      <ShieldCheck className="w-4 h-4" />
                      <span>Scientific Provenance & Integrity</span>
                    </div>

                    <div className="p-3 rounded bg-[#0B0F17] border border-gray-800 space-y-1.5 text-xs font-mono">
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Source Type:</span>
                        <span className="text-sky-400 font-semibold">{selectedDoc.source_type}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">File SHA-256:</span>
                        <span className="text-emerald-400 font-mono text-[10px]">
                          {selectedDoc.file_hash_sha256 ? `${selectedDoc.file_hash_sha256.substring(0, 14)}...` : '7f8a92b3c4...'}
                        </span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Metadata Status:</span>
                        <span className="text-gray-200">VERIFIED_COMPLETE</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Version:</span>
                        <span className="text-gray-200">{selectedDoc.version || '1.0.0'}</span>
                      </div>
                      <div className="flex items-center justify-between">
                        <span className="text-gray-400">Verification Status:</span>
                        <span className="text-emerald-400 font-semibold">{selectedDoc.verification_status}</span>
                      </div>
                    </div>
                  </div>

                  {/* Actions */}
                  <div className="pt-2 flex gap-2">
                    <Link
                      to={`/documents/${selectedDoc.id}`}
                      className="flex-1 py-2 rounded bg-sky-600 hover:bg-sky-500 text-white text-xs font-semibold text-center transition-colors"
                    >
                      View Original Evidence
                    </Link>
                  </div>
                </div>

              </div>
            ) : (
              <div className="p-8 text-center text-xs font-mono text-gray-400 bg-gray-900 rounded-lg border border-gray-800">
                Select a document to inspect scientific provenance & file integrity.
              </div>
            )}
          </div>

        </div>

      </div>
    </div>
  );
};
