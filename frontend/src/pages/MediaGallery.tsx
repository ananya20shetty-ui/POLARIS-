import React, { useState, useEffect } from 'react';
import {
  Camera, Film, Image, Play, Download, Tag, MapPin,
  Calendar, Search, Filter, ExternalLink, ChevronRight,
  Eye, Award, Ship, Layers
} from 'lucide-react';

// ─── Types ────────────────────────────────────────────────────────────────
interface MediaAsset {
  id: string;
  type: 'photo' | 'video' | 'reel';
  title: string;
  description: string;
  location: string;
  expedition: string;
  year: number;
  tags: string[];
  credit: string;
  resolution?: string;
  duration?: string;
  thumbnailColor: string;
  iconBg: string;
}

// ─── Rich Seeded Mock Media Data (NCPOR-accurate) ─────────────────────────
const MEDIA_ASSETS: MediaAsset[] = [
  {
    id: 'MA-001',
    type: 'photo',
    title: 'Maitri Research Station — Aerial Overview, Schirmacher Oasis',
    description: 'High-resolution aerial survey photograph of the Maitri station complex situated in the ice-free rocky region of the Schirmacher Oasis, Dronning Maud Land. Elevation 117 m ASL.',
    location: 'Schirmacher Oasis, Antarctica',
    expedition: 'ISEA-42',
    year: 2023,
    tags: ['station', 'Antarctica', 'Maitri', 'aerial', 'Schirmacher'],
    credit: 'NCPOR / Ministry of Earth Sciences',
    resolution: '8064 × 6048 px',
    thumbnailColor: 'from-cyan-900/40 to-carbon-900',
    iconBg: 'bg-cyan-950/60 border-cyan-700/50',
  },
  {
    id: 'MA-002',
    type: 'video',
    title: 'Sea Ice Core Extraction — Prydz Bay Transect 2022',
    description: 'Field video documentation of ice core drilling operations at 69°S aboard ORV Sagar Nidhi. Crew: NCPOR Cryosphere Division. Cores analyzed for δ18O isotopic paleoclimate signals.',
    location: 'Prydz Bay, Southern Ocean',
    expedition: 'ISEA-41',
    year: 2022,
    tags: ['sea ice', 'core drilling', 'Prydz Bay', 'field operation', 'paleoclimate'],
    credit: 'NCPOR / Dr. Parmanand Sharma',
    duration: '14 min 38 sec',
    thumbnailColor: 'from-blue-900/40 to-carbon-900',
    iconBg: 'bg-blue-950/60 border-blue-700/50',
  },
  {
    id: 'MA-003',
    type: 'photo',
    title: 'Bharati Station Panorama — Larsemann Hills, East Antarctica',
    description: 'Wide-angle winter panorama of Bharati station complex, India\'s third Antarctic base, established 2012. Located in the Larsemann Hills on a bedrock promontory overlooking Prydz Bay.',
    location: 'Larsemann Hills, Antarctica',
    expedition: 'ISEA-40',
    year: 2021,
    tags: ['station', 'Bharati', 'Larsemann Hills', 'winter', 'East Antarctica'],
    credit: 'NCPOR Expeditionary Documentation Unit',
    resolution: '12000 × 4000 px',
    thumbnailColor: 'from-indigo-900/40 to-carbon-900',
    iconBg: 'bg-indigo-950/60 border-indigo-700/50',
  },
  {
    id: 'MA-004',
    type: 'video',
    title: 'Himadri Arctic Station — Ny-Ålesund Daily Operations Reel',
    description: 'Monthly operations documentary showing oceanographic instrument deployment from Himadri station. Kongsfjorden fjord system visible in background. Spitsbergen, Svalbard.',
    location: 'Ny-Ålesund, Svalbard, Norway',
    expedition: 'INAE-2023',
    year: 2023,
    tags: ['Arctic', 'Himadri', 'Ny-Ålesund', 'Kongsfjorden', 'oceanography', 'fjord'],
    credit: 'NCPOR / Dr. Rahul Dey',
    duration: '22 min 05 sec',
    thumbnailColor: 'from-violet-900/40 to-carbon-900',
    iconBg: 'bg-violet-950/60 border-violet-700/50',
  },
  {
    id: 'MA-005',
    type: 'photo',
    title: 'Southern Ocean Wave Height Survey — ORV Sagar Nidhi Deck',
    description: 'Meteorological observation photograph showing 6–8 m swells during gale conditions at 55°S. Part of IndOBIS surface flux measurement campaign.',
    location: 'Southern Ocean, 55°S',
    expedition: 'ISEA-42',
    year: 2023,
    tags: ['Southern Ocean', 'Sagar Nidhi', 'waves', 'meteorology', 'surface flux'],
    credit: 'NCPOR Oceanographic Division',
    resolution: '6000 × 4000 px',
    thumbnailColor: 'from-teal-900/40 to-carbon-900',
    iconBg: 'bg-teal-950/60 border-teal-700/50',
  },
  {
    id: 'MA-006',
    type: 'reel',
    title: 'IndARC Mooring Retrieval — Kongsfjorden Deep Frame',
    description: 'Short scientific reel documenting the retrieval of IndARC mooring system instruments from 200 m depth. Temperature, salinity, and current profiler data archived.',
    location: 'Kongsfjorden, Arctic',
    expedition: 'INAE-2022',
    year: 2022,
    tags: ['IndARC', 'mooring', 'Kongsfjorden', 'CTD', 'instrument retrieval'],
    credit: 'NCPOR / IndARC Programme',
    duration: '3 min 47 sec',
    thumbnailColor: 'from-emerald-900/40 to-carbon-900',
    iconBg: 'bg-emerald-950/60 border-emerald-700/50',
  },
  {
    id: 'MA-007',
    type: 'photo',
    title: 'Emperor Penguin Colony — Lutzow-Holm Bay Survey 2021',
    description: 'Wildlife documentation photograph showing Emperor penguin (Aptenodytes forsteri) colony at 69°S. Count: approximately 1,400 individuals. Non-intrusive aerial survey protocol.',
    location: 'Lutzow-Holm Bay, Antarctica',
    expedition: 'ISEA-40',
    year: 2021,
    tags: ['wildlife', 'penguins', 'Emperor penguin', 'ecology', 'census'],
    credit: 'NCPOR Biological Oceanography Division',
    resolution: '24 MP RAW',
    thumbnailColor: 'from-amber-900/40 to-carbon-900',
    iconBg: 'bg-amber-950/60 border-amber-700/50',
  },
  {
    id: 'MA-008',
    type: 'video',
    title: 'Himalayan Glacier Retreat — Chandra Basin LiDAR Campaign',
    description: 'Time-lapse and ground-penetrating radar survey video of Bara Shigri glacier terminus retreat. Part of NCPOR-Himalayan cryosphere programme, Spiti Valley, HP.',
    location: 'Chandra Basin, Lahaul-Spiti, India',
    expedition: 'NCPOR-Himalayan 2023',
    year: 2023,
    tags: ['Himalayan', 'glacier', 'LiDAR', 'Bara Shigri', 'retreat', 'GPR'],
    credit: 'NCPOR Himalayan Research Group',
    duration: '8 min 12 sec',
    thumbnailColor: 'from-orange-900/40 to-carbon-900',
    iconBg: 'bg-orange-950/60 border-orange-700/50',
  },
  {
    id: 'MA-009',
    type: 'photo',
    title: 'Aurora Australis Over Maitri Station — July 2022',
    description: 'Long-exposure astrophotography documenting an intense Aurora Australis display (Kp 6+) over Maitri station. Geomagnetic storm associated with CME event on 14 July 2022.',
    location: 'Maitri Station, Antarctica',
    expedition: 'ISEA-41',
    year: 2022,
    tags: ['Aurora Australis', 'geomagnetism', 'astrophotography', 'night sky', 'CME'],
    credit: 'NCPOR Geomagnetism Division',
    resolution: '20 MP, ISO 6400, 25s',
    thumbnailColor: 'from-purple-900/40 to-carbon-900',
    iconBg: 'bg-purple-950/60 border-purple-700/50',
  },
  {
    id: 'MA-010',
    type: 'reel',
    title: 'Indian Antarctic Expedition 43 — Documentary Highlights',
    description: 'Official 5-minute highlight reel for ISEA-43 expedition. Covers traverse operations, snow meteorology measurements, and geophysical surveys across the East Antarctic Ice Sheet.',
    location: 'East Antarctic Ice Sheet',
    expedition: 'ISEA-43',
    year: 2024,
    tags: ['ISEA-43', 'expedition', 'documentary', 'traverse', 'geophysics', 'snow'],
    credit: 'NCPOR Media & Outreach Cell',
    duration: '5 min 00 sec',
    thumbnailColor: 'from-sky-900/40 to-carbon-900',
    iconBg: 'bg-sky-950/60 border-sky-700/50',
  },
  {
    id: 'MA-011',
    type: 'photo',
    title: 'Crevasse Field — East Antarctic Ice Sheet Traverse Route',
    description: 'Ground-level documentation of crevassed terrain encountered during snow traverse from coast to plateau. GPS waypoints recorded for safety corridor mapping.',
    location: 'East Antarctic Ice Sheet, 73°S',
    expedition: 'ISEA-42',
    year: 2023,
    tags: ['crevasse', 'ice sheet', 'traverse', 'safety', 'GPS mapping'],
    credit: 'NCPOR Glaciology Division',
    resolution: '6000 × 4000 px',
    thumbnailColor: 'from-slate-700/40 to-carbon-900',
    iconBg: 'bg-slate-800/60 border-slate-700/50',
  },
  {
    id: 'MA-012',
    type: 'video',
    title: 'CryoSat-2 Ground Validation — Altimetry Calibration Site',
    description: 'Field documentation of co-located in-situ measurement campaign supporting CryoSat-2 SIRAL radar altimetry calibration over the Roi Baudouin Ice Shelf.',
    location: 'Roi Baudouin Ice Shelf, Antarctica',
    expedition: 'ISEA-41',
    year: 2022,
    tags: ['CryoSat-2', 'altimetry', 'calibration', 'ice shelf', 'radar', 'satellite validation'],
    credit: 'NCPOR / ESA CryoSat Cal/Val',
    duration: '11 min 29 sec',
    thumbnailColor: 'from-green-900/40 to-carbon-900',
    iconBg: 'bg-green-950/60 border-green-700/50',
  },
];

const TYPE_FILTERS = ['all', 'photo', 'video', 'reel'] as const;
const LOCATION_FILTERS = ['All Regions', 'Antarctica', 'Arctic', 'Himalayan', 'Southern Ocean'];

const getTypeIcon = (type: string) => {
  if (type === 'video') return Film;
  if (type === 'reel') return Play;
  return Image;
};

const getTypeLabel = (type: string) => {
  if (type === 'video') return 'VIDEO';
  if (type === 'reel') return 'SHORT REEL';
  return 'PHOTOGRAPH';
};

// ─── Component ────────────────────────────────────────────────────────────
export const MediaGallery: React.FC = () => {
  const [typeFilter, setTypeFilter] = useState<typeof TYPE_FILTERS[number]>('all');
  const [locationFilter, setLocationFilter] = useState('All Regions');
  const [search, setSearch] = useState('');
  const [selected, setSelected] = useState<MediaAsset | null>(null);
  const [showLightbox, setShowLightbox] = useState(false);

  const filtered = MEDIA_ASSETS.filter((m) => {
    const typeMatch = typeFilter === 'all' || m.type === typeFilter;
    const locMatch = locationFilter === 'All Regions' ||
      m.location.toLowerCase().includes(locationFilter.toLowerCase()) ||
      m.tags.some(t => t.toLowerCase().includes(locationFilter.toLowerCase()));
    const searchMatch = !search || 
      m.title.toLowerCase().includes(search.toLowerCase()) ||
      m.description.toLowerCase().includes(search.toLowerCase()) ||
      m.tags.some(t => t.toLowerCase().includes(search.toLowerCase()));
    return typeMatch && locMatch && searchMatch;
  });

  const openLightbox = (asset: MediaAsset) => {
    setSelected(asset);
    setShowLightbox(true);
  };

  const photos = filtered.filter(m => m.type === 'photo').length;
  const videos = filtered.filter(m => m.type === 'video').length;
  const reels = filtered.filter(m => m.type === 'reel').length;

  return (
    <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8 space-y-8">

      {/* Page Header */}
      <div className="pb-6 border-b border-carbon-800">
        <div className="section-label-aurora mb-1">
          <Camera className="w-4 h-4" />
          <span>NCPOR EXPEDITION MEDIA ARCHIVE</span>
        </div>
        <h1 className="text-2xl sm:text-3xl font-bold text-frost-50">
          Polar Media Gallery & Visual Archive
        </h1>
        <p className="text-xs text-frost-400 mt-1 max-w-2xl">
          Authenticated visual documentation from Indian polar expeditions — photographs, scientific field videos, and institutional reels from Antarctic, Arctic, and Himalayan campaigns.
        </p>

        {/* Stat Chips */}
        <div className="flex flex-wrap gap-3 mt-4">
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-carbon-800 border border-carbon-700 text-xs font-mono">
            <Image className="w-3.5 h-3.5 text-aurora-400" />
            <span className="text-frost-300">{photos} Photographs</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-carbon-800 border border-carbon-700 text-xs font-mono">
            <Film className="w-3.5 h-3.5 text-ochre-400" />
            <span className="text-frost-300">{videos} Field Videos</span>
          </div>
          <div className="flex items-center gap-1.5 px-3 py-1 rounded-lg bg-carbon-800 border border-carbon-700 text-xs font-mono">
            <Play className="w-3.5 h-3.5 text-violet-400" />
            <span className="text-frost-300">{reels} Expedition Reels</span>
          </div>
        </div>
      </div>

      {/* Filter Bar */}
      <div className="flex flex-col sm:flex-row gap-3 bg-carbon-900 p-4 rounded-xl border border-carbon-750">
        
        {/* Search */}
        <div className="relative flex-1">
          <Search className="w-4 h-4 text-frost-400 absolute left-3 top-2.5" />
          <input
            type="text"
            value={search}
            onChange={(e) => setSearch(e.target.value)}
            placeholder="Search by title, location, keywords, expedition..."
            className="w-full pl-9 pr-4 py-2 bg-carbon-800 border border-carbon-700 rounded-lg text-xs text-frost-100 placeholder-frost-500 focus:outline-none focus:border-aurora-500"
          />
        </div>

        {/* Type Filter Tabs */}
        <div className="flex items-center gap-1 bg-carbon-800 rounded-lg p-1 border border-carbon-700">
          {TYPE_FILTERS.map((t) => (
            <button
              key={t}
              onClick={() => setTypeFilter(t)}
              className={`px-3 py-1.5 rounded-md text-xs font-medium transition-all capitalize ${
                typeFilter === t
                  ? 'bg-aurora-600 text-carbon-950 font-bold shadow'
                  : 'text-frost-400 hover:text-frost-200'
              }`}
            >
              {t === 'all' ? 'All Media' : t === 'reel' ? 'Reels' : t + 's'}
            </button>
          ))}
        </div>

        {/* Location Filter */}
        <select
          value={locationFilter}
          onChange={(e) => setLocationFilter(e.target.value)}
          className="px-3 py-2 bg-carbon-800 border border-carbon-700 rounded-lg text-xs text-frost-200 focus:outline-none focus:border-aurora-500"
        >
          {LOCATION_FILTERS.map((l) => (
            <option key={l} value={l}>{l}</option>
          ))}
        </select>
      </div>

      {/* Results count */}
      <div className="flex items-center justify-between">
        <span className="text-xs text-frost-500 font-mono">
          {filtered.length} media assets found
        </span>
        {(search || typeFilter !== 'all' || locationFilter !== 'All Regions') && (
          <button
            onClick={() => { setSearch(''); setTypeFilter('all'); setLocationFilter('All Regions'); }}
            className="text-xs text-aurora-400 hover:text-aurora-300 font-medium"
          >
            Clear filters
          </button>
        )}
      </div>

      {/* Media Grid */}
      <div className="grid grid-cols-1 sm:grid-cols-2 lg:grid-cols-3 gap-5">
        {filtered.map((asset, idx) => {
          const Icon = getTypeIcon(asset.type);
          return (
            <div
              key={asset.id}
              className="scientific-card overflow-hidden group cursor-pointer animate-slide-up"
              style={{ animationDelay: `${idx * 0.05}s` }}
              onClick={() => openLightbox(asset)}
            >
              {/* Visual Thumbnail Area */}
              <div className={`relative h-44 bg-gradient-to-br ${asset.thumbnailColor} overflow-hidden`}>
                {/* Ambient pattern */}
                <div className="absolute inset-0 opacity-20"
                  style={{
                    backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                    backgroundSize: '20px 20px'
                  }}
                />
                
                {/* Center Icon */}
                <div className="absolute inset-0 flex items-center justify-center">
                  <div className={`w-16 h-16 rounded-2xl border ${asset.iconBg} flex items-center justify-center shadow-2xl group-hover:scale-110 transition-transform duration-300`}>
                    <Icon className="w-8 h-8 text-frost-200 opacity-80" />
                  </div>
                </div>

                {/* Type Badge */}
                <div className="absolute top-3 left-3">
                  <span className={`px-2 py-0.5 rounded-md text-[10px] font-mono font-bold border ${
                    asset.type === 'photo' ? 'bg-carbon-900/80 border-carbon-700 text-frost-300' :
                    asset.type === 'video' ? 'bg-ochre-950/80 border-ochre-700 text-ochre-400' :
                    'bg-violet-950/80 border-violet-700 text-violet-400'
                  }`}>
                    {getTypeLabel(asset.type)}
                  </span>
                </div>

                {/* Duration or Resolution badge */}
                <div className="absolute top-3 right-3">
                  {asset.duration && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-carbon-900/90 border border-carbon-700 text-frost-400">
                      {asset.duration}
                    </span>
                  )}
                  {asset.resolution && (
                    <span className="px-2 py-0.5 rounded-md text-[10px] font-mono bg-carbon-900/90 border border-carbon-700 text-frost-400">
                      {asset.resolution.split(' ')[0]}
                    </span>
                  )}
                </div>

                {/* Hover overlay */}
                <div className="absolute inset-0 bg-carbon-950/0 group-hover:bg-carbon-950/30 transition-all flex items-center justify-center opacity-0 group-hover:opacity-100">
                  <div className="flex items-center gap-1.5 px-3 py-1.5 rounded-xl bg-carbon-900/90 border border-carbon-700 text-xs font-medium text-frost-100">
                    <Eye className="w-3.5 h-3.5 text-aurora-400" />
                    <span>View Details</span>
                  </div>
                </div>
              </div>

              {/* Card Body */}
              <div className="p-4 space-y-3">
                <h3 className="text-sm font-bold text-frost-100 leading-snug line-clamp-2 group-hover:text-aurora-300 transition-colors">
                  {asset.title}
                </h3>

                <div className="flex flex-wrap items-center gap-2 text-[11px] font-mono">
                  <div className="flex items-center gap-1 text-frost-400">
                    <MapPin className="w-3 h-3 text-aurora-400" />
                    <span className="truncate max-w-[140px]">{asset.location.split(',')[0]}</span>
                  </div>
                  <div className="flex items-center gap-1 text-frost-400">
                    <Calendar className="w-3 h-3 text-ochre-400" />
                    <span>{asset.year}</span>
                  </div>
                  <span className="text-aurora-400 font-semibold">{asset.expedition}</span>
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1.5">
                  {asset.tags.slice(0, 3).map((tag) => (
                    <span key={tag} className="px-1.5 py-0.5 rounded bg-carbon-800 border border-carbon-700 text-[10px] text-frost-400 font-mono">
                      #{tag}
                    </span>
                  ))}
                  {asset.tags.length > 3 && (
                    <span className="px-1.5 py-0.5 rounded bg-carbon-800 border border-carbon-700 text-[10px] text-frost-500 font-mono">
                      +{asset.tags.length - 3}
                    </span>
                  )}
                </div>
              </div>
            </div>
          );
        })}
      </div>

      {filtered.length === 0 && (
        <div className="scientific-card p-12 text-center space-y-3">
          <Camera className="w-10 h-10 text-frost-600 mx-auto" />
          <h3 className="font-bold text-frost-300">No media assets found</h3>
          <p className="text-xs text-frost-500">Try adjusting your search or filters.</p>
        </div>
      )}

      {/* Lightbox / Detail Modal */}
      {showLightbox && selected && (
        <div
          className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-carbon-950/85 backdrop-blur-md"
          onClick={() => setShowLightbox(false)}
        >
          <div
            className="glass-card max-w-3xl w-full max-h-[90vh] overflow-y-auto animate-slide-up"
            onClick={(e) => e.stopPropagation()}
          >
            {/* Lightbox header visual */}
            <div className={`relative h-56 bg-gradient-to-br ${selected.thumbnailColor} rounded-t-2xl overflow-hidden`}>
              <div className="absolute inset-0 opacity-20"
                style={{
                  backgroundImage: 'linear-gradient(rgba(255,255,255,0.03) 1px, transparent 1px), linear-gradient(90deg, rgba(255,255,255,0.03) 1px, transparent 1px)',
                  backgroundSize: '20px 20px'
                }}
              />
              <div className="absolute inset-0 flex items-center justify-center">
                <div className={`w-20 h-20 rounded-2xl border ${selected.iconBg} flex items-center justify-center shadow-2xl`}>
                  {React.createElement(getTypeIcon(selected.type), { className: 'w-10 h-10 text-frost-200 opacity-80' })}
                </div>
              </div>
              <div className="absolute top-4 left-4 flex items-center gap-2">
                <span className={`px-2.5 py-1 rounded-md text-[11px] font-mono font-bold border ${
                  selected.type === 'photo' ? 'bg-carbon-900/90 border-carbon-700 text-frost-300' :
                  selected.type === 'video' ? 'bg-ochre-950/90 border-ochre-700 text-ochre-400' :
                  'bg-violet-950/90 border-violet-700 text-violet-400'
                }`}>
                  {getTypeLabel(selected.type)}
                </span>
                <span className="px-2.5 py-1 rounded-md text-[11px] font-mono bg-aurora-950/90 border border-aurora-700 text-aurora-400">
                  {selected.expedition}
                </span>
              </div>
              <button
                onClick={() => setShowLightbox(false)}
                className="absolute top-4 right-4 w-8 h-8 rounded-lg bg-carbon-900/90 border border-carbon-700 text-frost-300 hover:text-frost-100 flex items-center justify-center text-lg"
              >
                ×
              </button>
            </div>

            {/* Lightbox Content */}
            <div className="p-6 space-y-5">
              <div>
                <div className="flex items-center gap-2 text-[10px] font-mono text-frost-500 mb-1">
                  <span>{selected.id}</span>
                  <span>•</span>
                  <span>{selected.year}</span>
                </div>
                <h2 className="text-lg sm:text-xl font-bold text-frost-50 leading-snug">
                  {selected.title}
                </h2>
              </div>

              <p className="text-xs text-frost-300 leading-relaxed bg-carbon-950 p-4 rounded-xl border border-carbon-800">
                {selected.description}
              </p>

              {/* Metadata Grid */}
              <div className="grid grid-cols-2 gap-3 text-xs">
                <div className="terminal-box space-y-0.5">
                  <div className="text-[10px] text-frost-500 font-mono">LOCATION</div>
                  <div className="text-frost-200 font-medium flex items-center gap-1">
                    <MapPin className="w-3 h-3 text-aurora-400" />
                    {selected.location}
                  </div>
                </div>
                <div className="terminal-box space-y-0.5">
                  <div className="text-[10px] text-frost-500 font-mono">EXPEDITION</div>
                  <div className="text-aurora-400 font-bold flex items-center gap-1">
                    <Ship className="w-3 h-3" />
                    {selected.expedition}
                  </div>
                </div>
                <div className="terminal-box space-y-0.5">
                  <div className="text-[10px] text-frost-500 font-mono">CREDIT / ATTRIBUTION</div>
                  <div className="text-frost-200">{selected.credit}</div>
                </div>
                <div className="terminal-box space-y-0.5">
                  <div className="text-[10px] text-frost-500 font-mono">
                    {selected.type === 'photo' ? 'RESOLUTION' : 'DURATION'}
                  </div>
                  <div className="text-frost-200">
                    {selected.resolution || selected.duration || '—'}
                  </div>
                </div>
              </div>

              {/* Tags */}
              <div className="space-y-2">
                <div className="text-[10px] font-mono text-frost-500 uppercase tracking-wider">Scientific Keywords</div>
                <div className="flex flex-wrap gap-2">
                  {selected.tags.map((tag) => (
                    <span key={tag} className="px-2 py-0.5 rounded-full bg-carbon-800 border border-carbon-700 text-[11px] text-frost-300 font-mono">
                      #{tag}
                    </span>
                  ))}
                </div>
              </div>

              {/* Footer Actions */}
              <div className="flex flex-wrap items-center gap-3 pt-4 border-t border-carbon-800">
                <button className="btn-primary">
                  <Download className="w-3.5 h-3.5" />
                  <span>Download Full Resolution</span>
                </button>
                <button className="btn-secondary">
                  <Award className="w-3.5 h-3.5" />
                  <span>Request Usage License</span>
                </button>
                <span className="text-[11px] text-frost-500 font-mono ml-auto">
                  © MoES / NCPOR — All Rights Reserved
                </span>
              </div>
            </div>
          </div>
        </div>
      )}

    </div>
  );
};
