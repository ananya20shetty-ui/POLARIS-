import React, { useEffect, useRef, useState, useCallback, useMemo } from 'react';
import * as THREE from 'three';
import { useNavigate } from 'react-router-dom';
import {
  Globe, Compass, Layers, Calendar, Filter, BookOpen, Database,
  Activity, Info, ChevronRight, X, Play, Pause, RotateCcw,
  Maximize2, Minimize2, ZoomIn, ZoomOut, Navigation, Crosshair,
  Thermometer, Wind, Droplets, Mountain, Anchor, Radio,
  ChevronDown, ChevronUp, Satellite, Sparkles, Shield, Cpu, Flame,
  Waves, Search, ExternalLink, ArrowUpRight, CheckCircle2, AlertCircle,
  FileText, GitCompare, Zap, Share2, Award, Building2, Users,
  Network, MapPin, Eye, Sliders, Flag
} from 'lucide-react';
import { api } from '../lib/api';

// ═════════════════════════════════════════════════════════════════════════════
//  SCIENTIFIC POLAR & THIRD POLE GEOSPATIAL DATASET (NCPOR / MoES INDEXED)
// ═════════════════════════════════════════════════════════════════════════════

export type EntityType = 'STATION' | 'OBSERVATORY' | 'FIELD_SITE' | 'EXPEDITION_NODE' | 'DATASET_NODE' | 'INSTITUTION';

export interface GeoLocationItem {
  id: string;
  name: string;
  code: string;
  country: string;
  countryCode: string;
  type: EntityType;
  region: 'ANTARCTICA' | 'ARCTIC' | 'THIRD_POLE' | 'GLOBAL';
  subregion: string;
  lat: number;
  lon: number;
  elevationMeters: number;
  establishedYear: number;
  status: 'OPERATIONAL' | 'SEASONAL' | 'DECOMMISSIONED';
  primaryDomains: string[];
  description: string;
  associatedClaimsCount: number;
  associatedDatasetsCount: number;
  associatedDocsCount: number;
  leadInstitution: string;
  sampleClaims: { subject: string; observation: string; direction: string; confidence: string }[];
}

// Complete polar research station & institution inventory
const RESEARCH_LOCATIONS: GeoLocationItem[] = [
  // ── INDIA POLAR & THIRD POLE NETWORK ──
  {
    id: 'bharati',
    name: 'Bharati Station',
    code: 'BHT-IND',
    country: 'India',
    countryCode: 'IND',
    type: 'STATION',
    region: 'ANTARCTICA',
    subregion: 'Larsemann Hills, Prydz Bay',
    lat: -69.40,
    lon: 76.18,
    elevationMeters: 35,
    establishedYear: 2012,
    status: 'OPERATIONAL',
    leadInstitution: 'NCPOR (National Centre for Polar and Ocean Research)',
    primaryDomains: ['Satellite Oceanography', 'CryoSat-2 Altimetry', 'Polynya Dynamics', 'Continental Breakup Tectonics'],
    description: "India's modern permanent Antarctic base on Prydz Bay. Serves as prime calibration-validation node for SAR altimetry, sea-ice mass flux, and Southern Ocean biogeochemistry.",
    associatedClaimsCount: 14,
    associatedDatasetsCount: 18,
    associatedDocsCount: 32,
    sampleClaims: [
      { subject: 'Prydz Bay Sea Ice', observation: 'Fast ice thickness averaged 1.82m with seasonal breakup delayed by 11 days', direction: 'FLUCTUATING', confidence: 'HIGH' },
      { subject: 'Ice Sheet Velocity', observation: 'Ground-based GPS confirmed coastal ice velocity of 14.2 m/yr at Larsemann margin', direction: 'STABLE', confidence: 'HIGH' }
    ]
  },
  {
    id: 'maitri',
    name: 'Maitri Station',
    code: 'MTR-IND',
    country: 'India',
    countryCode: 'IND',
    type: 'STATION',
    region: 'ANTARCTICA',
    subregion: 'Schirmacher Oasis, Dronning Maud Land',
    lat: -70.76,
    lon: 11.73,
    elevationMeters: 117,
    establishedYear: 1989,
    status: 'OPERATIONAL',
    leadInstitution: 'NCPOR / MoES',
    primaryDomains: ['Geomagnetism', 'Ozone Profiling', 'Glacial Lake Dynamics', 'Microbial Extremophiles'],
    description: "India's longest continuous operational Antarctic research base. Built on an ice-free rocky oasis; maintains continuous geomagnetism, ozonesonde, and paleolake sediment records since 1989.",
    associatedClaimsCount: 22,
    associatedDatasetsCount: 26,
    associatedDocsCount: 48,
    sampleClaims: [
      { subject: 'Total Column Ozone', observation: 'Spring ozonesonde soundings revealed minimum 128 DU core depletion recovery trend', direction: 'INCREASE', confidence: 'HIGH' },
      { subject: 'Priyadarshini Lake', observation: 'Sub-ice water temperature remained at 4.1°C throughout polar night cycle', direction: 'STABLE', confidence: 'HIGH' }
    ]
  },
  {
    id: 'dakshin_gangotri',
    name: 'Dakshin Gangotri',
    code: 'DG-IND',
    country: 'India',
    countryCode: 'IND',
    type: 'STATION',
    region: 'ANTARCTICA',
    subregion: 'Queen Maud Land Ice Shelf',
    lat: -70.08,
    lon: 12.00,
    elevationMeters: 75,
    establishedYear: 1983,
    status: 'DECOMMISSIONED',
    leadInstitution: 'MoES / Indian Navy / GSI',
    primaryDomains: ['Historical Glaciology', 'Early Radiosonde', 'Ice Sheet Stratigraphy'],
    description: "India's historic first permanent Antarctic station (1983–1989), now submerged under ice shelf accumulation. Preserved as an essential historic scientific baseline node.",
    associatedClaimsCount: 8,
    associatedDatasetsCount: 11,
    associatedDocsCount: 19,
    sampleClaims: [
      { subject: 'Ice Accumulation Rate', observation: 'Firn compaction measured at 0.73 m/yr water equivalent during 1983–1988', direction: 'STABLE', confidence: 'MEDIUM' }
    ]
  },
  {
    id: 'himadri',
    name: 'Himadri Station',
    code: 'HMD-IND',
    country: 'India',
    countryCode: 'IND',
    type: 'STATION',
    region: 'ARCTIC',
    subregion: 'Ny-Ålesund, Svalbard (78°55\'N)',
    lat: 78.92,
    lon: 11.93,
    elevationMeters: 8,
    establishedYear: 2008,
    status: 'OPERATIONAL',
    leadInstitution: 'NCPOR / MoES',
    primaryDomains: ['Aerosol Optical Depth', 'Arctic Amplification', 'Kongsfjorden Biogeochemistry', 'Long-range Black Carbon'],
    description: "India's dedicated Arctic scientific base in the international science village of Ny-Ålesund. Monitors atmospheric teleconnections between Arctic warming and the Indian Monsoon.",
    associatedClaimsCount: 19,
    associatedDatasetsCount: 21,
    associatedDocsCount: 38,
    sampleClaims: [
      { subject: 'Black Carbon Aerosols', observation: 'Spring haze episodes showed peak equivalent black carbon of 82 ng/m³ from long-range transport', direction: 'FLUCTUATING', confidence: 'HIGH' },
      { subject: 'Kongsfjorden Glacier Front', observation: 'Kronebreen glacier retreat rate measured at 120 m/decade via optical satellite matching', direction: 'DECREASE', confidence: 'HIGH' }
    ]
  },
  {
    id: 'indarc',
    name: 'IndARC Subsea Observatory',
    code: 'INDA-IND',
    country: 'India',
    countryCode: 'IND',
    type: 'OBSERVATORY',
    region: 'ARCTIC',
    subregion: 'Kongsfjorden Mooring, Svalbard',
    lat: 79.00,
    lon: 12.00,
    elevationMeters: -192,
    establishedYear: 2014,
    status: 'OPERATIONAL',
    leadInstitution: 'NCPOR / NIOT (National Institute of Ocean Technology)',
    primaryDomains: ['Atlantic Water Intrusion', 'Salinity Flux', 'Acoustic Marine Profiling', 'Hydrography'],
    description: "India's first multi-sensor underwater moored observatory stationed at 192m depth in Kongsfjorden. Tracks seasonal pulses of warm North Atlantic water intrusion.",
    associatedClaimsCount: 11,
    associatedDatasetsCount: 15,
    associatedDocsCount: 24,
    sampleClaims: [
      { subject: 'Atlantic Water Layer', observation: 'Mid-depth temperature pulses exceeded 3.8°C during late-autumn advection event', direction: 'INCREASE', confidence: 'HIGH' }
    ]
  },
  {
    id: 'himansh',
    name: 'Himansh Observatory',
    code: 'HMS-IND',
    country: 'India',
    countryCode: 'IND',
    type: 'OBSERVATORY',
    region: 'THIRD_POLE',
    subregion: 'Chandra Basin, Spiti Valley, Western Himalaya',
    lat: 32.40,
    lon: 77.62,
    elevationMeters: 4050,
    establishedYear: 2016,
    status: 'OPERATIONAL',
    leadInstitution: 'NCPOR / MoES',
    primaryDomains: ['Glacier Mass Balance', 'Snow Water Equivalent', 'Permafrost Dynamics', 'Hydrological Runoff'],
    description: "India's premier high-altitude Third Pole cryosphere research observatory in Spiti at 4,050m. Coordinates field glaciology on Chhota Shigri, Samudra Tapu, and Batal glaciers.",
    associatedClaimsCount: 16,
    associatedDatasetsCount: 19,
    associatedDocsCount: 29,
    sampleClaims: [
      { subject: 'Chhota Shigri Mass Balance', observation: 'Geodetic mass balance confirmed negative rate of -0.52 m w.e. a⁻¹ for 2016–2024', direction: 'DECREASE', confidence: 'HIGH' },
      { subject: 'Permafrost Active Layer', observation: 'Summer thaw depth at 4,000m reached 1.28m, showing 6cm deepening over 5-year baseline', direction: 'INCREASE', confidence: 'MEDIUM' }
    ]
  },
  {
    id: 'ncpor_hq',
    name: 'NCPOR Headquarters',
    code: 'NCP-IND',
    country: 'India',
    countryCode: 'IND',
    type: 'INSTITUTION',
    region: 'GLOBAL',
    subregion: 'Headland Sada, Vasco da Gama, Goa',
    lat: 15.40,
    lon: 73.80,
    elevationMeters: 45,
    establishedYear: 1998,
    status: 'OPERATIONAL',
    leadInstitution: 'Ministry of Earth Sciences, Govt of India',
    primaryDomains: ['Polar Expedition Logistics', 'National Polar Data Repository', 'Ice Core Archive', 'Southern Ocean Cruises'],
    description: "Nodal agency for India's Antarctic, Arctic, Southern Ocean, and Himalayan research programs. Houses national ice core analytical laboratories and polar data centre.",
    associatedClaimsCount: 38,
    associatedDatasetsCount: 65,
    associatedDocsCount: 120,
    sampleClaims: [
      { subject: 'Indian Polar Program Coordination', observation: 'Executed 43 Antarctic expeditions and continuous Arctic winter monitoring campaigns', direction: 'STABLE', confidence: 'HIGH' }
    ]
  },
  {
    id: 'moes_delhi',
    name: 'Ministry of Earth Sciences (MoES)',
    code: 'MOES-IND',
    country: 'India',
    countryCode: 'IND',
    type: 'INSTITUTION',
    region: 'GLOBAL',
    subregion: 'Prithvi Bhavan, New Delhi',
    lat: 28.61,
    lon: 77.20,
    elevationMeters: 216,
    establishedYear: 2006,
    status: 'OPERATIONAL',
    leadInstitution: 'Government of India',
    primaryDomains: ['National Cryosphere Policy', 'Earth System Science', 'Treaty Compliance', 'Research Grants'],
    description: "Apex government ministry guiding national polar policy, Antarctic Treaty Consultative Meeting (ATCM) representation, and scientific funding.",
    associatedClaimsCount: 18,
    associatedDatasetsCount: 42,
    associatedDocsCount: 88,
    sampleClaims: [
      { subject: 'Indian Antarctic Act', observation: 'Statutory legal framework enacted for environmental protection and scientific governance', direction: 'STABLE', confidence: 'HIGH' }
    ]
  },
  {
    id: 'everest_node',
    name: 'Mt. Everest AWS Node',
    code: 'EVR-NPL',
    country: 'Nepal',
    countryCode: 'NPL',
    type: 'OBSERVATORY',
    region: 'THIRD_POLE',
    subregion: 'South Col, Mahalangur Himal',
    lat: 27.98,
    lon: 86.92,
    elevationMeters: 8430,
    establishedYear: 2019,
    status: 'OPERATIONAL',
    leadInstitution: 'National Geographic / ICIMOD Collaborative',
    primaryDomains: ['Upper-Troposphere Jet Stream', 'Solar Irradiance', 'Extreme High-Altitude Meteorology'],
    description: 'High-altitude automatic weather node capturing upper-troposphere subtropical jet interactions and extreme ablation dynamics on the roof of the world.',
    associatedClaimsCount: 9,
    associatedDatasetsCount: 8,
    associatedDocsCount: 15,
    sampleClaims: [
      { subject: 'South Col Solar Radiation', observation: 'Peak incoming shortwave flux exceeded 1,450 W/m² due to intense albedo scattering', direction: 'STABLE', confidence: 'HIGH' }
    ]
  },

  // ── INTERNATIONAL KEY POLAR NODES (FOR SCIENTIFIC CONTEXT & COMPARISONS) ──
  {
    id: 'troll_station',
    name: 'Troll Research Station',
    code: 'TRL-NOR',
    country: 'Norway',
    countryCode: 'NOR',
    type: 'STATION',
    region: 'ANTARCTICA',
    subregion: 'Jutulsessen, Queen Maud Land',
    lat: -72.01,
    lon: 2.53,
    elevationMeters: 1275,
    establishedYear: 1990,
    status: 'OPERATIONAL',
    leadInstitution: 'Norwegian Polar Institute',
    primaryDomains: ['Atmospheric Chemistry', 'Geodesy', 'Satellite Ground Station'],
    description: "Norway's permanent research station in Dronning Maud Land, collaborating with Indian teams at Maitri on regional atmospheric transport.",
    associatedClaimsCount: 12,
    associatedDatasetsCount: 14,
    associatedDocsCount: 22,
    sampleClaims: [
      { subject: 'Antarctic Ozone Layer', observation: 'UV index and total column ozone monitoring aligned with Maitri sonder records', direction: 'INCREASE', confidence: 'HIGH' }
    ]
  },
  {
    id: 'davis_station',
    name: 'Davis Station',
    code: 'DAV-AUS',
    country: 'Australia',
    countryCode: 'AUS',
    type: 'STATION',
    region: 'ANTARCTICA',
    subregion: 'Vestfold Hills, Princess Elizabeth Land',
    lat: -68.58,
    lon: 77.97,
    elevationMeters: 13,
    establishedYear: 1957,
    status: 'OPERATIONAL',
    leadInstitution: 'Australian Antarctic Division (AAD)',
    primaryDomains: ['Ice Core Paleoclimate', 'Upper Atmospheric Physics', 'Southern Ocean Ecology'],
    description: "Australian coastal base located in Prydz Bay adjacent to Bharati Station. Facilitates joint East Antarctic oceanographic monitoring.",
    associatedClaimsCount: 15,
    associatedDatasetsCount: 18,
    associatedDocsCount: 27,
    sampleClaims: [
      { subject: 'Prydz Bay Sea Ice Flux', observation: 'Polynya heat flux validated against collaborative Bharati coastal radiometers', direction: 'STABLE', confidence: 'HIGH' }
    ]
  },
  {
    id: 'mcmurdo_station',
    name: 'McMurdo Station',
    code: 'MCM-USA',
    country: 'USA',
    countryCode: 'USA',
    type: 'STATION',
    region: 'ANTARCTICA',
    subregion: 'Ross Island, McMurdo Sound',
    lat: -77.85,
    lon: 166.67,
    elevationMeters: 24,
    establishedYear: 1956,
    status: 'OPERATIONAL',
    leadInstitution: 'US National Science Foundation (NSF)',
    primaryDomains: ['Astrophysics', 'Glaciology', 'Deep Crustal Geophysics', 'Dry Valleys Ecology'],
    description: "Largest research community in Antarctica. Primary logistics hub for South Pole Station and West Antarctic Ice Sheet projects.",
    associatedClaimsCount: 28,
    associatedDatasetsCount: 45,
    associatedDocsCount: 92,
    sampleClaims: [
      { subject: 'Ross Ice Shelf Stability', observation: 'Basal melt rates quantified through airborne radar sounding transects', direction: 'FLUCTUATING', confidence: 'HIGH' }
    ]
  },
  {
    id: 'vostok_station',
    name: 'Vostok Station',
    code: 'VOS-RUS',
    country: 'Russia',
    countryCode: 'RUS',
    type: 'STATION',
    region: 'ANTARCTICA',
    subregion: 'Inland Ice Plateau, Lake Vostok',
    lat: -78.46,
    lon: 106.87,
    elevationMeters: 3488,
    establishedYear: 1957,
    status: 'OPERATIONAL',
    leadInstitution: 'Arctic and Antarctic Research Institute (AARI)',
    primaryDomains: ['Deep Ice Core Paleoclimatology', 'Subglacial Lake Vostok', 'Extreme Cold Meteorology'],
    description: "Iconic high-plateau inland station; site of the 3,700m deep ice core providing a 420,000-year continuous climate and CO2 record.",
    associatedClaimsCount: 31,
    associatedDatasetsCount: 38,
    associatedDocsCount: 76,
    sampleClaims: [
      { subject: 'Paleoclimate 400kyr Cycle', observation: 'Ice core isotopic deuterium confirmed 100kyr glacial-interglacial periodicity', direction: 'STABLE', confidence: 'HIGH' }
    ]
  },
  {
    id: 'ny_alesund_sverdrup',
    name: 'Sverdrup Research Station',
    code: 'SVR-NOR',
    country: 'Norway',
    countryCode: 'NOR',
    type: 'STATION',
    region: 'ARCTIC',
    subregion: 'Ny-Ålesund, Svalbard',
    lat: 78.92,
    lon: 11.92,
    elevationMeters: 10,
    establishedYear: 1968,
    status: 'OPERATIONAL',
    leadInstitution: 'Norwegian Polar Institute',
    primaryDomains: ['Long-term Arctic Climate', 'Atmospheric Monitoring', 'Terrestrial Cryosphere'],
    description: "Central Norwegian facility in Ny-Ålesund providing scientific infrastructure and atmospheric baseline data alongside India's Himadri.",
    associatedClaimsCount: 17,
    associatedDatasetsCount: 22,
    associatedDocsCount: 41,
    sampleClaims: [
      { subject: 'Ny-Ålesund Warming Trend', observation: 'Mean surface temperature anomaly exceeded +1.4°C per decade in Svalbard archipelago', direction: 'INCREASE', confidence: 'HIGH' }
    ]
  },
  {
    id: 'escudero_station',
    name: 'Prof. Julio Escudero Base',
    code: 'ESC-CHL',
    country: 'Chile',
    countryCode: 'CHL',
    type: 'STATION',
    region: 'ANTARCTICA',
    subregion: 'King George Island, South Shetland Islands',
    lat: -62.20,
    lon: -58.96,
    elevationMeters: 10,
    establishedYear: 1995,
    status: 'OPERATIONAL',
    leadInstitution: 'INACH (Instituto Antártico Chileno)',
    primaryDomains: ['Antarctic Peninsula Warming', 'Marine Ecology', 'Permafrost Active Layer'],
    description: "Chilean scientific station in the maritime Antarctic Peninsula, tracking rapid retreat of coastal ice caps and vegetation changes.",
    associatedClaimsCount: 14,
    associatedDatasetsCount: 16,
    associatedDocsCount: 28,
    sampleClaims: [
      { subject: 'King George Island Deglaciation', observation: 'Bellingshausen Dome margin retreated at 8.4 m/yr during summer thaw cycles', direction: 'DECREASE', confidence: 'HIGH' }
    ]
  }
];

// Documented Indian and International Expedition Tracks
export interface ScientificExpedition {
  id: string;
  name: string;
  year: number;
  country: string;
  region: 'ANTARCTICA' | 'ARCTIC' | 'THIRD_POLE';
  vesselOrMode: string;
  leadAgency: string;
  waypoints: [number, number][]; // [lat, lon]
  description: string;
  milestones: string[];
}

const EXPEDITION_TRACKS: ScientificExpedition[] = [
  {
    id: 'isea_43',
    name: '43rd Indian Scientific Expedition to Antarctica (ISEA-43)',
    year: 2024,
    country: 'India',
    region: 'ANTARCTICA',
    vesselOrMode: 'MV Vasiliy Golovnin / PistonBully Polar Traverse',
    leadAgency: 'NCPOR / MoES',
    waypoints: [
      [15.40, 73.80],   // NCPOR Goa Base
      [-4.60, 55.40],   // Seychelles Stopover
      [-34.00, 18.40],  // Cape Town Polar Gateway
      [-69.40, 76.18],  // Bharati Station (Prydz Bay)
      [-70.76, 11.73]   // Maitri Station (Schirmacher Oasis)
    ],
    description: 'Comprehensive inter-station overland traverse, deep firn core recovery (14 cores), and CryoSat-2 underflight radar validation.',
    milestones: ['320 km GPR traverse completed', '14 deep firn cores recovered', 'Southern Ocean oceanographic profiling']
  },
  {
    id: 'isea_01',
    name: '1st Indian Antarctic Expedition (Operation Gangotri)',
    year: 1981,
    country: 'India',
    region: 'ANTARCTICA',
    vesselOrMode: 'MV Polar Circle (Chartered Icebreaker)',
    leadAgency: 'Department of Ocean Development (DOD)',
    waypoints: [
      [15.40, 73.80],   // Goa Port
      [-20.20, 57.50],  // Mauritius
      [-70.08, 12.00]   // Dakshin Gangotri Site
    ],
    description: "India's historic maiden polar expedition led by Dr. S.Z. Qasim, initiating permanent national research on the frozen continent.",
    milestones: ['First Indian landing on Antarctica (Jan 9, 1982)', 'Automatic weather station deployed', 'Unmanned shelter established']
  },
  {
    id: 'arctic_winter_2023',
    name: 'Indian Arctic Winter Expedition 2023–24',
    year: 2023,
    country: 'India',
    region: 'ARCTIC',
    vesselOrMode: 'Ny-Ålesund High-Arctic Marine Skiff & Fjord Mooring',
    leadAgency: 'NCPOR',
    waypoints: [
      [28.61, 77.20],  // MoES New Delhi
      [59.91, 10.75],  // Oslo Hub
      [78.22, 15.65],  // Longyearbyen Gateway
      [78.92, 11.93],  // Himadri Base
      [79.00, 12.00]   // IndARC Underwater Mooring
    ],
    description: 'First continuous Indian winter observation campaign in the European High Arctic polar night, capturing atmospheric flux and fjord salinity dynamics.',
    milestones: ['Continuous polar night acoustic capture', 'IndARC sensor mooring retrieved & recalibrated', 'Black carbon aerosol winter peak analyzed']
  },
  {
    id: 'himalaya_chandra_2022',
    name: 'Chandra Basin High-Altitude Cryosphere Traverse',
    year: 2022,
    country: 'India',
    region: 'THIRD_POLE',
    vesselOrMode: 'High-Altitude Mountaineering Traverse & UAV Mapping',
    leadAgency: 'NCPOR & Geological Survey of India',
    waypoints: [
      [28.61, 77.20],  // New Delhi HQ
      [32.24, 77.18],  // Manali Base
      [32.40, 77.62],  // Himansh Observatory
      [32.28, 77.52]   // Chhota Shigri Glacier Tongue
    ],
    description: 'Direct stake-network ablation measurement, drone photogrammetry, and seasonal snow water equivalent profiling.',
    milestones: ['12 ablation stakes measured', '10 cm resolution UAV elevation model', 'Sub-debris ice melt modeling']
  }
];

// Documented Research Corridors connecting countries to polar science nodes
interface ResearchCorridor {
  id: string;
  fromName: string;
  fromLat: number;
  fromLon: number;
  toName: string;
  toLat: number;
  toLon: number;
  country: string;
  label: string;
  type: 'EXPEDITION_ROUTE' | 'RESEARCH_TELECONNECTION' | 'LOGISTICS_GATEWAY';
}

const RESEARCH_CORRIDORS: ResearchCorridor[] = [
  // India → Antarctica
  { id: 'ind-ant-1', fromName: 'NCPOR Goa (India)', fromLat: 15.40, fromLon: 73.80, toName: 'Bharati Station', toLat: -69.40, toLon: 76.18, country: 'India', label: 'India → Bharati Research Corridor (Prydz Bay)', type: 'EXPEDITION_ROUTE' },
  { id: 'ind-ant-2', fromName: 'NCPOR Goa (India)', fromLat: 15.40, fromLon: 73.80, toName: 'Maitri Station', toLat: -70.76, toLon: 11.73, country: 'India', label: 'India → Maitri Research Corridor (Schirmacher Oasis)', type: 'EXPEDITION_ROUTE' },
  // India → Arctic
  { id: 'ind-arc-1', fromName: 'MoES Delhi (India)', fromLat: 28.61, fromLon: 77.20, toName: 'Himadri Station (Svalbard)', toLat: 78.92, toLon: 11.93, country: 'India', label: 'India → Arctic Svalbard Teleconnection Corridor', type: 'RESEARCH_TELECONNECTION' },
  { id: 'ind-arc-2', fromName: 'Himadri Base', fromLat: 78.92, fromLon: 11.93, toName: 'IndARC Subsea Mooring', toLat: 79.00, toLon: 12.00, country: 'India', label: 'Kongsfjorden Fjord Hydrographic Transect', type: 'EXPEDITION_ROUTE' },
  // India → Third Pole
  { id: 'ind-tp-1', fromName: 'MoES Delhi (India)', fromLat: 28.61, fromLon: 77.20, toName: 'Himansh Observatory (Spiti)', toLat: 32.40, toLon: 77.62, country: 'India', label: 'India → Himalayan Cryosphere Monitoring Corridor', type: 'RESEARCH_TELECONNECTION' },
  // International Polar Gateways
  { id: 'sa-ant', fromName: 'Cape Town (South Africa)', fromLat: -33.92, fromLon: 18.42, toName: 'Maitri / Troll Stations', toLat: -70.76, toLon: 11.73, country: 'South Africa', label: 'DROMLAN Air & Sea Logistics Corridor', type: 'LOGISTICS_GATEWAY' },
  { id: 'aus-ant', fromName: 'Hobart (Australia)', fromLat: -42.88, fromLon: 147.32, toName: 'Davis / Bharati Area', toLat: -68.58, toLon: 77.97, country: 'Australia', label: 'East Antarctic Southern Ocean Corridor', type: 'LOGISTICS_GATEWAY' },
  { id: 'nor-arc', fromName: 'Tromsø (Norway)', fromLat: 69.65, fromLon: 18.96, toName: 'Ny-Ålesund (Svalbard)', toLat: 78.92, toLon: 11.93, country: 'Norway', label: 'High Arctic Science Flight Corridor', type: 'LOGISTICS_GATEWAY' },
  { id: 'chl-ant', fromName: 'Punta Arenas (Chile)', fromLat: -53.16, fromLon: -70.91, toName: 'King George Island', toLat: -62.20, toLon: -58.96, country: 'Chile', label: 'Antarctic Peninsula Air Bridge', type: 'LOGISTICS_GATEWAY' }
];

// Major Countries with Indexed Polar Activity Metadata
interface CountryProfile {
  name: string;
  code: string;
  lat: number;
  lon: number;
  stationsCount: number;
  expeditionsCount: number;
  activityLevel: 'HIGH' | 'MODERATE' | 'GATEWAY';
  antarcticPrograms: string;
  arcticPrograms: string;
  thirdPolePrograms: string;
}

const COUNTRY_PROFILES: Record<string, CountryProfile> = {
  'India': {
    name: 'India',
    code: 'IND',
    lat: 22.50,
    lon: 78.90,
    stationsCount: 6,
    expeditionsCount: 43,
    activityLevel: 'HIGH',
    antarcticPrograms: 'Permanent Bases: Bharati, Maitri, Historic Dakshin Gangotri. 43 Annual Expeditions.',
    arcticPrograms: 'Himadri Station (Ny-Ålesund) & IndARC Underwater Moored Observatory.',
    thirdPolePrograms: 'Himansh Observatory (Spiti Valley, 4050m) & Chandra/Sutlej glaciological network.'
  },
  'Norway': {
    name: 'Norway',
    code: 'NOR',
    lat: 60.47,
    lon: 8.46,
    stationsCount: 3,
    expeditionsCount: 60,
    activityLevel: 'HIGH',
    antarcticPrograms: 'Troll Station (Dronning Maud Land) & Tor seasonal base.',
    arcticPrograms: 'Svalbard host nation, Ny-Ålesund research village, Sverdrup Station.',
    thirdPolePrograms: 'Collaborative glaciology through ICIMOD partnership.'
  },
  'USA': {
    name: 'USA',
    code: 'USA',
    lat: 37.09,
    lon: -95.71,
    stationsCount: 4,
    expeditionsCount: 75,
    activityLevel: 'HIGH',
    antarcticPrograms: 'McMurdo Station, Amundsen-Scott South Pole, Palmer Station.',
    arcticPrograms: 'Summit Camp (Greenland Ice Sheet) & Toolik Field Station (Alaska).',
    thirdPolePrograms: 'USGS / NASA satellite calibration with Himalayan nodes.'
  },
  'Australia': {
    name: 'Australia',
    code: 'AUS',
    lat: -25.27,
    lon: 133.77,
    stationsCount: 4,
    expeditionsCount: 70,
    activityLevel: 'HIGH',
    antarcticPrograms: 'Davis Station (Prydz Bay neighbor to Bharati), Casey, Mawson.',
    arcticPrograms: 'Collaborative Arctic marine science through IASC.',
    thirdPolePrograms: 'Southern Hemisphere cryosphere comparisons.'
  },
  'Russia': {
    name: 'Russia',
    code: 'RUS',
    lat: 61.52,
    lon: 105.31,
    stationsCount: 5,
    expeditionsCount: 68,
    activityLevel: 'HIGH',
    antarcticPrograms: 'Vostok Deep Core Station, Mirny, Novolazarevskaya, Progress.',
    arcticPrograms: 'Extensive Siberian Arctic station network and drifting ice camps.',
    thirdPolePrograms: 'Altai / Tien Shan glaciological monitoring.'
  },
  'Chile': {
    name: 'Chile',
    code: 'CHL',
    lat: -35.67,
    lon: -71.54,
    stationsCount: 3,
    expeditionsCount: 58,
    activityLevel: 'HIGH',
    antarcticPrograms: 'Prof. Julio Escudero Base, O\'Higgins Base, Frei Montalva.',
    arcticPrograms: 'Observer status and collaborative glaciology.',
    thirdPolePrograms: 'Patagonian Icefields Southern Third Pole studies.'
  },
  'Argentina': {
    name: 'Argentina',
    code: 'ARG',
    lat: -38.41,
    lon: -63.61,
    stationsCount: 6,
    expeditionsCount: 120,
    activityLevel: 'HIGH',
    antarcticPrograms: 'Marambio, Esperanza, San Martín, Belgrano II permanent bases.',
    arcticPrograms: 'Collaborative polar science programs.',
    thirdPolePrograms: 'Andean cryosphere and rock glacier monitoring.'
  },
  'South Africa': {
    name: 'South Africa',
    code: 'ZAF',
    lat: -30.55,
    lon: 22.93,
    stationsCount: 2,
    expeditionsCount: 62,
    activityLevel: 'GATEWAY',
    antarcticPrograms: 'SANAE IV Station (Vesleskarvet) & Marion Island sub-Antarctic base.',
    arcticPrograms: 'Collaborative oceanographic modeling.',
    thirdPolePrograms: 'Data not available in indexed sources.'
  },
  'New Zealand': {
    name: 'New Zealand',
    code: 'NZL',
    lat: -40.90,
    lon: 174.88,
    stationsCount: 1,
    expeditionsCount: 65,
    activityLevel: 'GATEWAY',
    antarcticPrograms: 'Scott Base (Ross Island), operating near McMurdo.',
    arcticPrograms: 'Collaborative climate modeling.',
    thirdPolePrograms: 'Southern Alps alpine glacier mass balance.'
  }
};

// Region camera focus targets
const REGION_CAMERA_TARGETS: Record<string, { lat: number; lon: number; zoom: number; label: string }> = {
  antarctica: { lat: -74, lon: 45, zoom: 11.2, label: 'ANTARCTICA' },
  arctic: { lat: 80, lon: 15, zoom: 11.2, label: 'ARCTIC' },
  third_pole: { lat: 31, lon: 82, zoom: 10.2, label: 'THIRD POLE' },
  global: { lat: 20, lon: 75, zoom: 17.5, label: 'GLOBAL' }
};

export const MapExplorer: React.FC = () => {
  const navigate = useNavigate();
  const mountRef = useRef<HTMLDivElement>(null);
  const animationFrameRef = useRef<number | null>(null);

  // ── CORE STATE ──
  const [selectedRegion, setSelectedRegion] = useState<'antarctica' | 'arctic' | 'third_pole' | 'global'>('antarctica');
  const [selectedLocationId, setSelectedLocationId] = useState<string>('bharati');
  const [hoveredLocationId, setHoveredLocationId] = useState<string | null>(null);
  const [activeTab, setActiveTab] = useState<'overview' | 'evidence' | 'expeditions' | 'datasets' | 'institutions'>('overview');
  
  // Country Filter & India Hub
  const [selectedCountry, setSelectedCountry] = useState<string>('All');
  const [indiaHubOpen, setIndiaHubOpen] = useState<boolean>(false);
  const [hoveredCountryName, setHoveredCountryName] = useState<string | null>(null);

  // Layer Toggles
  const [showStations, setShowStations] = useState(true);
  const [showExpeditions, setShowExpeditions] = useState(true);
  const [showCorridors, setShowCorridors] = useState(true);
  const [showHimalaya3D, setShowHimalaya3D] = useState(true);
  const [showIceExtent, setShowIceExtent] = useState(true);
  const [showCountryBorders, setShowCountryBorders] = useState(true);
  const [showCountryLabels, setShowCountryLabels] = useState(true);
  const [showDensityHeatmap, setShowDensityHeatmap] = useState(false);
  const [showGrid, setShowGrid] = useState(false);
  const [showAtmosphere, setShowAtmosphere] = useState(true);
  const [showIndiaHighlight, setShowIndiaHighlight] = useState(true);

  // Elevation Exaggeration (Himalayas)
  const [elevationExaggeration, setElevationExaggeration] = useState<number>(1.5);

  // Temporal Timeline (1981 - 2026)
  const [timelineYear, setTimelineYear] = useState<number>(2026);
  const [isPlayingTimeline, setIsPlayingTimeline] = useState<boolean>(false);

  // Expedition Playback
  const [activeExpeditionId, setActiveExpeditionId] = useState<string | null>(null);
  const [expeditionProgress, setExpeditionProgress] = useState<number>(0);
  const [isPlayingExpedition, setIsPlayingExpedition] = useState<boolean>(false);

  // UI Panels
  const [leftLayersOpen, setLeftLayersOpen] = useState(true);
  const [rightInspectorOpen, setRightInspectorOpen] = useState(true);
  const [searchQuery, setSearchQuery] = useState('');
  const [searchSuggestionsOpen, setSearchSuggestionsOpen] = useState(false);

  // Cursor coordinates HUD
  const [cursorCoords, setCursorCoords] = useState<{ lat: number; lon: number } | null>(null);
  const [projectedLabels, setProjectedLabels] = useState<{ name: string; code: string; x: number; y: number; visible: boolean; isIndia: boolean }[]>([]);

  // Three.js References
  const sceneRef = useRef<{
    scene: THREE.Scene;
    camera: THREE.PerspectiveCamera;
    renderer: THREE.WebGLRenderer;
    globe: THREE.Mesh;
    atmosphereMesh: THREE.Mesh;
    gridMesh: THREE.Mesh;
    iceExtentGroup: THREE.Group;
    himalayaGroup: THREE.Group;
    auroraGroup: THREE.Group;
    stationGroup: THREE.Group;
    expeditionGroup: THREE.Group;
    corridorGroup: THREE.Group;
    bordersGroup: THREE.Group;
    indiaHighlightGroup: THREE.Group;
    densityGroup: THREE.Group;
    shipMarkerMesh: THREE.Mesh;
    raycaster: THREE.Raycaster;
    mouse: THREE.Vector2;
    markerObjects: { mesh: THREE.Object3D; id: string }[];
  } | null>(null);

  // Filtered active location
  const activeLocation = useMemo(() => {
    return RESEARCH_LOCATIONS.find(loc => loc.id === selectedLocationId) || RESEARCH_LOCATIONS[0];
  }, [selectedLocationId]);

  // Locations filtered by Timeline Year AND selected Country
  const filteredLocations = useMemo(() => {
    return RESEARCH_LOCATIONS.filter(loc => {
      const yearOk = loc.establishedYear <= timelineYear;
      const countryOk = selectedCountry === 'All' || loc.country.toLowerCase() === selectedCountry.toLowerCase();
      return yearOk && countryOk;
    });
  }, [timelineYear, selectedCountry]);

  // Convert Lat/Lon to Three.js Sphere Vector3
  const latLonToVector3 = useCallback((lat: number, lon: number, radius: number): THREE.Vector3 => {
    const phi = (90 - lat) * (Math.PI / 180);
    const theta = (lon + 180) * (Math.PI / 180);
    const x = -(radius * Math.sin(phi) * Math.cos(theta));
    const z = radius * Math.sin(phi) * Math.sin(theta);
    const y = radius * Math.cos(phi);
    return new THREE.Vector3(x, y, z);
  }, []);

  // ═══════════════════════════════════════════════════════════════════════════
  //  THREE.JS SCIENTIFIC 3D ENGINE INITIALIZATION
  // ═══════════════════════════════════════════════════════════════════════════
  useEffect(() => {
    if (!mountRef.current) return;
    const container = mountRef.current;
    const width = container.clientWidth;
    const height = container.clientHeight;

    // 1. Scene & Dark Scientific Canvas
    const scene = new THREE.Scene();
    scene.background = new THREE.Color('#070B14');

    const camera = new THREE.PerspectiveCamera(40, width / height, 0.1, 1000);
    // Polar-first default camera positioning (Antarctica focused)
    camera.position.set(0, -9, 14);
    camera.lookAt(0, 0, 0);

    const renderer = new THREE.WebGLRenderer({ antialias: true, alpha: true, powerPreference: 'high-performance' });
    renderer.setSize(width, height);
    renderer.setPixelRatio(Math.min(window.devicePixelRatio, 2));
    renderer.toneMapping = THREE.ACESFilmicToneMapping;
    renderer.toneMappingExposure = 1.15;
    container.appendChild(renderer.domElement);

    // 2. Physical Lighting System
    const ambientLight = new THREE.AmbientLight(0x4A6B82, 0.75);
    scene.add(ambientLight);

    const sunLight = new THREE.DirectionalLight(0xE2F1FF, 1.6);
    sunLight.position.set(30, 25, 25);
    scene.add(sunLight);

    const polarRimLight = new THREE.DirectionalLight(0x0284C7, 0.5);
    polarRimLight.position.set(-25, -20, -20);
    scene.add(polarRimLight);

    // 3. Globe Mesh (Oceanic Base)
    const globeRadius = 6.2;
    const globeGeometry = new THREE.SphereGeometry(globeRadius, 96, 96);
    const globeMaterial = new THREE.MeshPhysicalMaterial({
      color: 0x0A1322,
      emissive: 0x040812,
      metalness: 0.12,
      roughness: 0.65,
      clearcoat: 0.2,
      clearcoatRoughness: 0.4
    });
    const globe = new THREE.Mesh(globeGeometry, globeMaterial);
    scene.add(globe);

    // 4. Geographic Country Borders & Coastlines Layer (Accurate Geo-Polygons)
    const bordersGroup = new THREE.Group();
    const drawBorder = (coords: [number, number][], color = 0x38BDF8, opacity = 0.45, lineWidth = 1) => {
      const vecs = coords.map(([lat, lon]) => latLonToVector3(lat, lon, globeRadius + 0.025));
      const geo = new THREE.BufferGeometry().setFromPoints(vecs);
      const mat = new THREE.LineBasicMaterial({ color, transparent: true, opacity });
      bordersGroup.add(new THREE.Line(geo, mat));
    };

    // ── ANTARCTICA CONTINENTAL COASTLINE & ICE SHELVES ──
    drawBorder([
      [-63.5, -57.0], [-65.0, -64.0], [-68.0, -67.0], [-70.0, -75.0], [-73.0, -100.0],
      [-75.0, -130.0], [-78.0, -160.0], [-80.0, -175.0], [-77.0, 170.0], [-74.0, 165.0],
      [-72.0, 160.0], [-68.0, 150.0], [-66.0, 140.0], [-65.0, 110.0], [-69.4, 76.18],
      [-68.0, 60.0], [-70.0, 30.0], [-70.76, 11.73], [-70.0, 0.0], [-72.0, -30.0],
      [-75.0, -45.0], [-63.5, -57.0]
    ], 0x38BDF8, 0.6);

    // Ronne-Filchner & Ross Ice Shelf Boundaries
    drawBorder([[-75, -60], [-82, -50], [-82, -35], [-75, -30]], 0x0284C7, 0.35);
    drawBorder([[-78, 165], [-84, -175], [-84, -155], [-78, -160]], 0x0284C7, 0.35);

    // ── INDIA NATIONAL BOUNDARY (HIGH PRECISION OUTLINE) ──
    const indiaCoordinates: [number, number][] = [
      [8.08, 77.55], [10.50, 79.85], [13.08, 80.27], [17.68, 83.21], [20.27, 85.84],
      [22.50, 89.00], [25.00, 92.00], [27.00, 88.50], [27.50, 96.00], [29.00, 95.00],
      [28.00, 90.00], [27.00, 85.00], [30.50, 80.50], [32.40, 77.62], [35.50, 77.00],
      [37.05, 74.50], [34.50, 74.00], [32.00, 74.50], [28.50, 70.00], [24.00, 68.50],
      [23.00, 70.00], [21.00, 72.50], [18.90, 72.80], [15.40, 73.80], [12.90, 74.80],
      [8.08, 77.55]
    ];
    drawBorder(indiaCoordinates, 0xF59E0B, 0.85);

    // ── ARCTIC & SVALBARD ARCHIPELAGO ──
    drawBorder([[76.5, 16.0], [78.5, 11.0], [80.0, 15.0], [80.8, 25.0], [77.5, 24.0], [76.5, 16.0]], 0x38BDF8, 0.65);
    // Greenland Coastline
    drawBorder([[60.0, -44.0], [65.0, -38.0], [72.0, -22.0], [80.0, -18.0], [83.0, -35.0], [78.0, -70.0], [68.0, -53.0], [60.0, -44.0]], 0x38BDF8, 0.4);
    // Norway / Scandinavia
    drawBorder([[58.0, 7.0], [62.0, 5.0], [68.0, 14.0], [71.0, 26.0], [70.0, 30.0], [64.0, 21.0], [58.0, 7.0]], 0x38BDF8, 0.4);
    // North America & Alaska
    drawBorder([[55.0, -130.0], [60.0, -145.0], [65.0, -165.0], [71.0, -156.0], [70.0, -130.0], [60.0, -90.0], [50.0, -65.0]], 0x38BDF8, 0.35);
    // Australia Coastline
    drawBorder([[-12.0, 131.0], [-20.0, 148.0], [-33.0, 151.0], [-39.0, 146.0], [-35.0, 117.0], [-22.0, 114.0], [-12.0, 131.0]], 0x38BDF8, 0.4);
    // South Africa Coastline
    drawBorder([[-28.0, 16.0], [-34.0, 18.5], [-34.0, 26.0], [-26.0, 33.0]], 0x38BDF8, 0.4);
    // South America (Chile / Argentina / Ushuaia Gateway)
    drawBorder([[-18.0, -70.0], [-33.0, -71.5], [-45.0, -74.0], [-55.0, -68.0], [-40.0, -62.0], [-23.0, -43.0]], 0x38BDF8, 0.4);

    globe.add(bordersGroup);

    // 5. Special India Visual Treatment (Amber Highlight Ribbon)
    const indiaHighlightGroup = new THREE.Group();
    const indiaVecs = indiaCoordinates.map(([lat, lon]) => latLonToVector3(lat, lon, globeRadius + 0.032));
    const indiaHighlightGeo = new THREE.BufferGeometry().setFromPoints(indiaVecs);
    const indiaHighlightMat = new THREE.LineBasicMaterial({ color: 0xFBBF24, transparent: true, opacity: 0.9, linewidth: 2 });
    const indiaHighlightLine = new THREE.Line(indiaHighlightGeo, indiaHighlightMat);
    indiaHighlightGroup.add(indiaHighlightLine);
    globe.add(indiaHighlightGroup);

    // 6. Subtle Atmosphere Rim (Realistic Non-Neon Scattering)
    const atmosphereGeometry = new THREE.SphereGeometry(globeRadius + 0.22, 64, 64);
    const atmosphereMaterial = new THREE.ShaderMaterial({
      vertexShader: `
        varying vec3 vNormal;
        void main() {
          vNormal = normalize(normalMatrix * normal);
          gl_Position = projectionMatrix * modelViewMatrix * vec4(position, 1.0);
        }
      `,
      fragmentShader: `
        varying vec3 vNormal;
        void main() {
          float intensity = pow(0.65 - dot(vNormal, vec3(0.0, 0.0, 1.0)), 2.8);
          vec3 atmosphereColor = vec3(0.12, 0.52, 0.85);
          gl_FragColor = vec4(atmosphereColor, intensity * 0.35);
        }
      `,
      side: THREE.BackSide,
      blending: THREE.AdditiveBlending,
      transparent: true,
      depthWrite: false
    });
    const atmosphereMesh = new THREE.Mesh(atmosphereGeometry, atmosphereMaterial);
    scene.add(atmosphereMesh);

    // 7. Latitude/Longitude Grid
    const gridGeometry = new THREE.SphereGeometry(globeRadius + 0.015, 36, 18);
    const gridMaterial = new THREE.MeshBasicMaterial({ color: 0x1E3A5F, wireframe: true, transparent: true, opacity: 0.12 });
    const gridMesh = new THREE.Mesh(gridGeometry, gridMaterial);
    scene.add(gridMesh);

    // 8. Cryosphere & Sea-Ice Extent (Scientific Translucent Surface)
    const iceExtentGroup = new THREE.Group();
    const southIceGeo = new THREE.SphereGeometry(globeRadius + 0.035, 48, 24, 0, Math.PI * 2, Math.PI * 0.72, Math.PI * 0.28);
    const iceMat = new THREE.MeshPhysicalMaterial({
      color: 0xE0F2FE,
      roughness: 0.35,
      metalness: 0.05,
      transmission: 0.5,
      transparent: true,
      opacity: 0.65
    });
    const southIceMesh = new THREE.Mesh(southIceGeo, iceMat);
    iceExtentGroup.add(southIceMesh);

    const northIceGeo = new THREE.SphereGeometry(globeRadius + 0.035, 48, 24, 0, Math.PI * 2, 0, Math.PI * 0.16);
    const northIceMesh = new THREE.Mesh(northIceGeo, iceMat);
    iceExtentGroup.add(northIceMesh);
    globe.add(iceExtentGroup);

    // 9. 3D Himalayan Third Pole Terrain Elevation Group
    const himalayaGroup = new THREE.Group();
    const HIMALAYA_PEAKS = [
      { name: 'Everest', lat: 27.98, lon: 86.92, h: 0.28, r: 0.14 },
      { name: 'K2', lat: 35.88, lon: 76.51, h: 0.26, r: 0.13 },
      { name: 'Kangchenjunga', lat: 27.70, lon: 88.15, h: 0.25, r: 0.12 },
      { name: 'Nanda Devi', lat: 30.37, lon: 79.97, h: 0.24, r: 0.11 },
      { name: 'Annapurna', lat: 28.59, lon: 83.82, h: 0.24, r: 0.11 },
      { name: 'Himansh Spiti', lat: 32.40, lon: 77.62, h: 0.22, r: 0.11 }
    ];

    HIMALAYA_PEAKS.forEach(p => {
      const pos = latLonToVector3(p.lat, p.lon, globeRadius + 0.02);
      const normal = pos.clone().normalize();
      const coneGeo = new THREE.ConeGeometry(p.r, p.h * elevationExaggeration, 5);
      const coneMat = new THREE.MeshStandardMaterial({ color: 0xE2E8F0, roughness: 0.5 });
      const peakMesh = new THREE.Mesh(coneGeo, coneMat);
      peakMesh.position.copy(pos.clone().add(normal.clone().multiplyScalar((p.h * elevationExaggeration) / 2)));
      peakMesh.quaternion.setFromUnitVectors(new THREE.Vector3(0, 1, 0), normal);
      himalayaGroup.add(peakMesh);
    });
    globe.add(himalayaGroup);

    // 10. Research Location Markers (Taxonomy Symbols)
    const stationGroup = new THREE.Group();
    const markerObjects: { mesh: THREE.Object3D; id: string }[] = [];

    RESEARCH_LOCATIONS.forEach(loc => {
      const pos = latLonToVector3(loc.lat, loc.lon, globeRadius + 0.06);

      // Symbol geometry based on entity type taxonomy
      let markerGeo: THREE.BufferGeometry;
      if (loc.type === 'STATION') {
        markerGeo = new THREE.SphereGeometry(0.09, 16, 16); // ● Station
      } else if (loc.type === 'OBSERVATORY') {
        markerGeo = new THREE.OctahedronGeometry(0.09, 0); // ◇ Observatory
      } else if (loc.type === 'INSTITUTION') {
        markerGeo = new THREE.BoxGeometry(0.12, 0.12, 0.12); // ■ Institution
      } else {
        markerGeo = new THREE.TetrahedronGeometry(0.09, 0); // ▲ Field site
      }

      // Distinct color for India vs International nodes
      const isIndia = loc.country === 'India';
      const markerColor = isIndia
        ? (loc.region === 'ANTARCTICA' ? 0xF59E0B : loc.region === 'ARCTIC' ? 0xFBBF24 : 0x10B981)
        : (loc.region === 'ANTARCTICA' ? 0x38BDF8 : loc.region === 'ARCTIC' ? 0x60A5FA : 0x94A3B8);

      const markerMat = new THREE.MeshBasicMaterial({ color: markerColor });
      const markerMesh = new THREE.Mesh(markerGeo, markerMat);
      markerMesh.position.copy(pos);
      stationGroup.add(markerMesh);
      markerObjects.push({ mesh: markerMesh, id: loc.id });

      // Halo ring around marker
      const ringGeo = new THREE.RingGeometry(0.12, 0.16, 24);
      const ringMat = new THREE.MeshBasicMaterial({ color: markerColor, side: THREE.DoubleSide, transparent: true, opacity: 0.65 });
      const ringMesh = new THREE.Mesh(ringGeo, ringMat);
      ringMesh.position.copy(pos.clone().multiplyScalar(1.008));
      ringMesh.lookAt(0, 0, 0);
      stationGroup.add(ringMesh);
    });
    globe.add(stationGroup);

    // 11. Documented Research Corridors & Connection Arcs
    const corridorGroup = new THREE.Group();
    RESEARCH_CORRIDORS.forEach(corridor => {
      const p1 = latLonToVector3(corridor.fromLat, corridor.fromLon, globeRadius + 0.05);
      const p2 = latLonToVector3(corridor.toLat, corridor.toLon, globeRadius + 0.05);
      
      // Calculate elevated midpoint for curved arc
      const mid = p1.clone().add(p2).multiplyScalar(0.5);
      const dist = p1.distanceTo(p2);
      const arcElevation = globeRadius + Math.min(2.5, dist * 0.22);
      mid.normalize().multiplyScalar(arcElevation);

      const curve = new THREE.QuadraticBezierCurve3(p1, mid, p2);
      const curvePoints = curve.getPoints(50);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
      
      const isIndia = corridor.country === 'India';
      const lineMat = new THREE.LineDashedMaterial({
        color: isIndia ? 0xF59E0B : 0x38BDF8,
        dashSize: 0.25,
        gapSize: 0.12,
        transparent: true,
        opacity: isIndia ? 0.75 : 0.45
      });
      const lineMesh = new THREE.Line(lineGeo, lineMat);
      lineMesh.computeLineDistances();
      corridorGroup.add(lineMesh);
    });
    globe.add(corridorGroup);

    // 12. Expedition Tracks & Playback Traverses
    const expeditionGroup = new THREE.Group();
    EXPEDITION_TRACKS.forEach(exp => {
      const points = exp.waypoints.map(([lat, lon]) => latLonToVector3(lat, lon, globeRadius + 0.05));
      const curve = new THREE.CatmullRomCurve3(points);
      const curvePoints = curve.getPoints(80);
      const lineGeo = new THREE.BufferGeometry().setFromPoints(curvePoints);
      const lineMat = new THREE.LineDashedMaterial({
        color: exp.country === 'India' ? 0xF59E0B : 0x38BDF8,
        dashSize: 0.3,
        gapSize: 0.15,
        transparent: true,
        opacity: 0.7
      });
      const lineMesh = new THREE.Line(lineGeo, lineMat);
      lineMesh.computeLineDistances();
      expeditionGroup.add(lineMesh);
    });
    globe.add(expeditionGroup);

    // Ship tracker mesh for expedition playback
    const shipGeo = new THREE.ConeGeometry(0.08, 0.2, 4);
    const shipMat = new THREE.MeshBasicMaterial({ color: 0xFBBF24 });
    const shipMarkerMesh = new THREE.Mesh(shipGeo, shipMat);
    shipMarkerMesh.visible = false;
    globe.add(shipMarkerMesh);

    // 13. Research Density Clusters
    const densityGroup = new THREE.Group();
    RESEARCH_LOCATIONS.forEach(loc => {
      const pos = latLonToVector3(loc.lat, loc.lon, globeRadius + 0.03);
      const densityRadius = 0.25 + (loc.associatedClaimsCount / 35) * 0.35;
      const densityGeo = new THREE.RingGeometry(0.05, densityRadius, 32);
      const densityMat = new THREE.MeshBasicMaterial({
        color: loc.country === 'India' ? 0xF59E0B : 0x0284C7,
        side: THREE.DoubleSide,
        transparent: true,
        opacity: 0.22,
        blending: THREE.AdditiveBlending
      });
      const densityMesh = new THREE.Mesh(densityGeo, densityMat);
      densityMesh.position.copy(pos.clone().multiplyScalar(1.004));
      densityMesh.lookAt(0, 0, 0);
      densityGroup.add(densityMesh);
    });
    globe.add(densityGroup);

    // 14. Auroral Curtains
    const auroraGroup = new THREE.Group();
    const auroraGeo = new THREE.TorusGeometry(globeRadius * 0.8, 0.4, 16, 64);
    const auroraMat = new THREE.MeshBasicMaterial({
      color: 0x10B981,
      transparent: true,
      opacity: 0.15,
      blending: THREE.AdditiveBlending,
      side: THREE.DoubleSide
    });
    
    const northAurora = new THREE.Mesh(auroraGeo, auroraMat);
    northAurora.rotation.x = Math.PI / 2;
    northAurora.position.y = globeRadius * 0.8;
    auroraGroup.add(northAurora);

    const southAurora = new THREE.Mesh(auroraGeo, auroraMat);
    southAurora.rotation.x = Math.PI / 2;
    southAurora.position.y = -globeRadius * 0.8;
    auroraGroup.add(southAurora);
    globe.add(auroraGroup);

    // Raycaster & Mouse Interaction
    const raycaster = new THREE.Raycaster();
    const mouse = new THREE.Vector2();

    sceneRef.current = {
      scene, camera, renderer, globe, atmosphereMesh, gridMesh,
      iceExtentGroup, himalayaGroup, auroraGroup, stationGroup, expeditionGroup,
      corridorGroup, bordersGroup, indiaHighlightGroup, densityGroup, shipMarkerMesh,
      raycaster, mouse, markerObjects
    };

    // Pointer Interaction (Orbit & Drag)
    let isDragging = false;
    let hoveredMarkerId: string | null = null;
    let prevMouse = { x: 0, y: 0 };

    const onPointerDown = (e: PointerEvent) => {
      isDragging = true;
      prevMouse = { x: e.clientX, y: e.clientY };
    };

    const onPointerMove = (e: PointerEvent) => {
      const rect = container.getBoundingClientRect();
      mouse.x = ((e.clientX - rect.left) / container.clientWidth) * 2 - 1;
      mouse.y = -((e.clientY - rect.top) / container.clientHeight) * 2 + 1;

      // Raycast test for location markers & cursor coordinates
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(markerObjects.map(o => o.mesh));
      if (intersects.length > 0) {
        const found = markerObjects.find(o => o.mesh === intersects[0].object);
        if (found) {
          hoveredMarkerId = found.id;
          setHoveredLocationId(found.id);
          container.style.cursor = 'pointer';
        }
      } else {
        hoveredMarkerId = null;
        setHoveredLocationId(null);
        container.style.cursor = isDragging ? 'grabbing' : 'grab';
      }

      // Compute geographic coordinates under cursor
      const globeHits = raycaster.intersectObject(globe);
      if (globeHits.length > 0) {
        const hitPoint = globeHits[0].point.clone().normalize();
        const lat = 90 - Math.acos(hitPoint.y) * (180 / Math.PI);
        const lon = ((Math.atan2(hitPoint.z, -hitPoint.x) * 180) / Math.PI) - 180;
        setCursorCoords({ lat: parseFloat(lat.toFixed(2)), lon: parseFloat(lon.toFixed(2)) });

        // Check if cursor is over India region
        if (lat >= 8 && lat <= 37 && lon >= 68 && lon <= 97) {
          setHoveredCountryName('India');
        } else {
          setHoveredCountryName(null);
        }
      }

      if (isDragging) {
        const dx = e.clientX - prevMouse.x;
        const dy = e.clientY - prevMouse.y;
        globe.rotation.y += dx * 0.005;
        globe.rotation.x += dy * 0.005;
        prevMouse = { x: e.clientX, y: e.clientY };
      }
    };

    const onPointerUp = () => {
      isDragging = false;
    };

    const onClick = () => {
      raycaster.setFromCamera(mouse, camera);
      const intersects = raycaster.intersectObjects(markerObjects.map(o => o.mesh));
      if (intersects.length > 0) {
        const found = markerObjects.find(o => o.mesh === intersects[0].object);
        if (found) {
          setSelectedLocationId(found.id);
          setRightInspectorOpen(true);
        }
      } else if (hoveredCountryName === 'India') {
        setIndiaHubOpen(true);
      }
    };

    const onWheel = (e: WheelEvent) => {
      e.preventDefault();
      camera.position.z = Math.max(8.5, Math.min(26, camera.position.z + e.deltaY * 0.012));
    };

    container.addEventListener('pointerdown', onPointerDown);
    container.addEventListener('pointermove', onPointerMove);
    container.addEventListener('pointerup', onPointerUp);
    container.addEventListener('click', onClick);
    container.addEventListener('wheel', onWheel, { passive: false });

    // Animation Loop
    let clock = new THREE.Clock();
    const animate = () => {
      animationFrameRef.current = requestAnimationFrame(animate);
      const elapsed = clock.getElapsedTime();

      // Pulsing effect for density nodes
      densityGroup.children.forEach((mesh, i) => {
        const scale = 1.0 + Math.sin(elapsed * 2.0 + i) * 0.12;
        mesh.scale.set(scale, scale, scale);
      });

      // Auroral curtain drift
      northAurora.scale.set(1.0 + Math.sin(elapsed) * 0.05, 1.0 + Math.cos(elapsed * 0.8) * 0.05, 1);
      southAurora.scale.set(1.0 + Math.cos(elapsed) * 0.05, 1.0 + Math.sin(elapsed * 0.8) * 0.05, 1);
      auroraGroup.rotation.y += 0.001;

      // Interactive Marker Scale Animation
      markerObjects.forEach(({ mesh, id }) => {
        const isSelectedOrHovered = (id === hoveredMarkerId || id === selectedLocationId);
        const targetScale = isSelectedOrHovered ? 1.6 : 1.0;
        mesh.scale.lerp(new THREE.Vector3(targetScale, targetScale, targetScale), 0.15);
      });

      // Dynamic 2D Screen Projection for Country Labels
      if (showCountryLabels) {
        const labels: { name: string; code: string; x: number; y: number; visible: boolean; isIndia: boolean }[] = [];
        Object.values(COUNTRY_PROFILES).forEach(profile => {
          const worldPos = latLonToVector3(profile.lat, profile.lon, globeRadius + 0.1);
          worldPos.applyMatrix4(globe.matrixWorld);

          // Dot product with camera direction to hide back-facing labels
          const cameraDir = camera.position.clone().normalize();
          const labelDir = worldPos.clone().normalize();
          const dot = cameraDir.dot(labelDir);

          if (dot > 0.25) {
            const screenPos = worldPos.clone().project(camera);
            const x = (screenPos.x * 0.5 + 0.5) * container.clientWidth;
            const y = (-(screenPos.y * 0.5) + 0.5) * container.clientHeight;
            labels.push({
              name: profile.name,
              code: profile.code,
              x,
              y,
              visible: true,
              isIndia: profile.name === 'India'
            });
          }
        });
        setProjectedLabels(labels);
      }

      renderer.render(scene, camera);
    };
    animate();

    const handleResize = () => {
      if (!container) return;
      const w = container.clientWidth;
      const h = container.clientHeight;
      camera.aspect = w / h;
      camera.updateProjectionMatrix();
      renderer.setSize(w, h);
    };
    window.addEventListener('resize', handleResize);

    return () => {
      if (animationFrameRef.current) cancelAnimationFrame(animationFrameRef.current);
      container.removeEventListener('pointerdown', onPointerDown);
      container.removeEventListener('pointermove', onPointerMove);
      container.removeEventListener('pointerup', onPointerUp);
      container.removeEventListener('click', onClick);
      container.removeEventListener('wheel', onWheel);
      window.removeEventListener('resize', handleResize);
      if (container.contains(renderer.domElement)) {
        container.removeChild(renderer.domElement);
      }
      renderer.dispose();
    };
  }, [latLonToVector3, elevationExaggeration, showCountryLabels, selectedLocationId]);

  // ═══════════════════════════════════════════════════════════════════════════
  //  SMOOTH REGION CAMERA FLY-TO CONTROLLER
  // ═══════════════════════════════════════════════════════════════════════════
  const flyToRegion = useCallback((regionKey: 'antarctica' | 'arctic' | 'third_pole' | 'global') => {
    setSelectedRegion(regionKey);
    const target = REGION_CAMERA_TARGETS[regionKey];
    if (!target || !sceneRef.current) return;

    const { globe, camera } = sceneRef.current;
    const targetRotY = -target.lon * (Math.PI / 180);
    const targetRotX = target.lat * (Math.PI / 180) * 0.45;

    const startRotY = globe.rotation.y;
    const startRotX = globe.rotation.x;
    const startCamZ = camera.position.z;
    const targetCamZ = target.zoom;

    let progress = 0;
    const animateFly = () => {
      progress += 0.045;
      if (progress <= 1) {
        globe.rotation.y = THREE.MathUtils.lerp(startRotY, targetRotY, progress);
        globe.rotation.x = THREE.MathUtils.lerp(startRotX, targetRotX, progress);
        camera.position.z = THREE.MathUtils.lerp(startCamZ, targetCamZ, progress);
        requestAnimationFrame(animateFly);
      }
    };
    animateFly();
  }, []);

  // Update Layer Visibility
  useEffect(() => {
    if (!sceneRef.current) return;
    const {
      stationGroup, himalayaGroup, expeditionGroup, corridorGroup,
      bordersGroup, indiaHighlightGroup, iceExtentGroup, densityGroup,
      gridMesh, atmosphereMesh
    } = sceneRef.current;

    stationGroup.visible = showStations;
    himalayaGroup.visible = showHimalaya3D;
    expeditionGroup.visible = showExpeditions;
    corridorGroup.visible = showCorridors;
    bordersGroup.visible = showCountryBorders;
    indiaHighlightGroup.visible = showIndiaHighlight;
    iceExtentGroup.visible = showIceExtent;
    densityGroup.visible = showDensityHeatmap;
    gridMesh.visible = showGrid;
    atmosphereMesh.visible = showAtmosphere;
  }, [
    showStations, showHimalaya3D, showExpeditions, showCorridors,
    showCountryBorders, showIndiaHighlight, showIceExtent,
    showDensityHeatmap, showGrid, showAtmosphere
  ]);

  // Handle Expedition Playback Simulation
  const handlePlayExpedition = (exp: ScientificExpedition) => {
    setActiveExpeditionId(exp.id);
    setIsPlayingExpedition(true);
    setExpeditionProgress(0);

    if (!sceneRef.current) return;
    const { globe, shipMarkerMesh } = sceneRef.current;
    shipMarkerMesh.visible = true;

    const points = exp.waypoints.map(([lat, lon]) => latLonToVector3(lat, lon, 6.2 + 0.1));
    const curve = new THREE.CatmullRomCurve3(points);

    let t = 0;
    const step = () => {
      t += 0.004;
      if (t <= 1) {
        setExpeditionProgress(Math.round(t * 100));
        const pos = curve.getPointAt(t);
        shipMarkerMesh.position.copy(pos);
        shipMarkerMesh.lookAt(0, 0, 0);
        requestAnimationFrame(step);
      } else {
        setIsPlayingExpedition(false);
      }
    };
    step();
  };

  // Timeline Auto-play Loop
  useEffect(() => {
    let interval: any;
    if (isPlayingTimeline) {
      interval = setInterval(() => {
        setTimelineYear(prev => (prev >= 2026 ? 1981 : prev + 1));
      }, 700);
    }
    return () => clearInterval(interval);
  }, [isPlayingTimeline]);

  return (
    <div className="relative w-full h-[calc(100vh-4rem)] bg-[#070B14] overflow-hidden text-slate-100 font-sans select-none">
      
      {/* ── 3D CANVAS VIEWPORT (70% Central Hero Area) ── */}
      <div ref={mountRef} className="w-full h-full cursor-grab active:cursor-grabbing" />

      {/* ── DYNAMIC PROJECTED COUNTRY LABELS OVERLAY (LOD & DECLUTTERED) ── */}
      {showCountryLabels && projectedLabels.map((lbl, idx) => (
        <div
          key={idx}
          style={{
            position: 'absolute',
            left: `${lbl.x}px`,
            top: `${lbl.y}px`,
            transform: 'translate(-50%, -50%)',
            pointerEvents: 'none'
          }}
          className={`transition-opacity duration-300 ${
            lbl.isIndia
              ? 'px-2 py-0.5 rounded-md bg-amber-500/20 border border-amber-500/50 text-amber-300 font-mono text-[11px] font-bold tracking-widest backdrop-blur-sm shadow-lg shadow-amber-500/10'
              : 'text-slate-400/80 font-mono text-[10px] tracking-wider'
          }`}
        >
          {lbl.name.toUpperCase()}
        </div>
      ))}

      {/* ── TOP SCIENTIFIC NAVIGATION & REGION CONTROLS ── */}
      <div className="absolute top-4 left-4 right-4 z-20 flex flex-wrap items-center justify-between gap-3 pointer-events-none">
        
        {/* Institutional Geospatial Header */}
        <div className="pointer-events-auto bg-[#0B1220]/90 backdrop-blur-md border border-slate-700/60 rounded-xl px-4 py-2 shadow-xl flex items-center gap-3">
          <div className="p-1.5 bg-slate-800/80 rounded-lg border border-slate-700 text-cyan-400">
            <Globe className="w-4 h-4" />
          </div>
          <div>
            <div className="text-xs font-bold text-white tracking-wider flex items-center gap-2">
              POLARIS-Ω GEOSPATIAL SPHERE
              <span className="px-1.5 py-0.5 text-[9px] font-mono font-bold bg-cyan-950 text-cyan-300 border border-cyan-800 rounded">
                NCPOR / MoES
              </span>
            </div>
            <div className="text-[10px] text-slate-400 font-mono">
              Scientific Evidence, Polar Stations & Research Corridors
            </div>
          </div>
        </div>

        {/* Primary Region Switcher: [ GLOBAL ] [ ANTARCTICA ] [ ARCTIC ] [ THIRD POLE ] */}
        <div className="pointer-events-auto bg-[#0B1220]/90 backdrop-blur-md border border-slate-700/60 rounded-xl p-1 shadow-xl flex items-center gap-1 font-mono text-xs">
          {(['antarctica', 'arctic', 'third_pole', 'global'] as const).map(reg => (
            <button
              key={reg}
              onClick={() => flyToRegion(reg)}
              className={`px-3 py-1.5 rounded-lg transition-all font-semibold uppercase tracking-wider ${
                selectedRegion === reg
                  ? 'bg-slate-800 text-cyan-300 border-b-2 border-cyan-400 shadow-sm'
                  : 'text-slate-400 hover:text-white hover:bg-slate-800/50'
              }`}
            >
              {reg === 'third_pole' ? 'Third Pole' : reg}
            </button>
          ))}
        </div>

        {/* Country Selector & India Network Hub Quick-Launch */}
        <div className="pointer-events-auto flex items-center gap-2">
          {/* India Polar Network Button */}
          <button
            onClick={() => setIndiaHubOpen(true)}
            className="px-3 py-2 rounded-xl bg-gradient-to-r from-amber-600/30 to-amber-500/20 hover:from-amber-600/40 hover:to-amber-500/30 border border-amber-500/40 text-amber-300 font-mono text-xs font-bold flex items-center gap-1.5 shadow-lg shadow-amber-500/10 transition-all"
          >
            <Flag className="w-3.5 h-3.5 text-amber-400" />
            <span>INDIA RESEARCH HUB</span>
          </button>

          {/* Compact Country Selector */}
          <div className="bg-[#0B1220]/90 backdrop-blur-md border border-slate-700/60 rounded-xl px-2.5 py-1.5 shadow-xl flex items-center gap-2 text-xs font-mono">
            <span className="text-slate-400 text-[10px] uppercase">Country:</span>
            <select
              value={selectedCountry}
              onChange={e => setSelectedCountry(e.target.value)}
              className="bg-slate-900 text-cyan-300 border border-slate-700 rounded-lg px-2 py-1 text-xs font-semibold focus:outline-none focus:border-cyan-500"
            >
              <option value="All">All Nations</option>
              <option value="India">🇮🇳 India (NCPOR / MoES)</option>
              <option value="Norway">🇳🇴 Norway</option>
              <option value="USA">🇺🇸 United States</option>
              <option value="Australia">🇦🇺 Australia</option>
              <option value="Russia">🇷🇺 Russia</option>
              <option value="Chile">🇨🇱 Chile</option>
              <option value="Argentina">🇦🇷 Argentina</option>
              <option value="South Africa">🇿🇦 South Africa</option>
              <option value="New Zealand">🇳🇿 New Zealand</option>
            </select>
          </div>
        </div>

        {/* Fast Unified Search Input */}
        <div className="pointer-events-auto relative w-72">
          <div className="flex items-center bg-[#0B1220]/90 backdrop-blur-md border border-slate-700/60 rounded-xl px-3 py-2 text-xs shadow-xl focus-within:border-cyan-500/50">
            <Search className="w-3.5 h-3.5 text-slate-400 mr-2 shrink-0" />
            <input
              type="text"
              value={searchQuery}
              onChange={e => {
                setSearchQuery(e.target.value);
                setSearchSuggestionsOpen(true);
              }}
              placeholder="Search station, country, claim, dataset..."
              className="w-full bg-transparent text-slate-200 placeholder-slate-500 focus:outline-none text-xs"
            />
          </div>

          {/* Search suggestions dropdown */}
          {searchSuggestionsOpen && searchQuery.trim() && (
            <div className="absolute top-11 left-0 right-0 bg-[#0B1220]/95 backdrop-blur-xl border border-slate-700 rounded-xl shadow-2xl overflow-hidden py-1 z-50 text-xs font-mono max-h-60 overflow-y-auto">
              {RESEARCH_LOCATIONS.filter(l =>
                l.name.toLowerCase().includes(searchQuery.toLowerCase()) ||
                l.country.toLowerCase().includes(searchQuery.toLowerCase()) ||
                l.subregion.toLowerCase().includes(searchQuery.toLowerCase()) ||
                l.primaryDomains.some(d => d.toLowerCase().includes(searchQuery.toLowerCase()))
              ).map(l => (
                <button
                  key={l.id}
                  onClick={() => {
                    setSelectedLocationId(l.id);
                    setSearchQuery('');
                    setSearchSuggestionsOpen(false);
                    setRightInspectorOpen(true);
                  }}
                  className="w-full text-left px-3 py-2 hover:bg-slate-800 flex items-center justify-between text-slate-200 border-b border-slate-800/40"
                >
                  <div>
                    <div className="font-semibold text-white">{l.name}</div>
                    <div className="text-[10px] text-slate-400">{l.country} • {l.subregion}</div>
                  </div>
                  <span className={`text-[10px] px-1.5 py-0.5 rounded font-bold ${l.country === 'India' ? 'bg-amber-950 text-amber-300 border border-amber-800' : 'bg-cyan-950 text-cyan-300'}`}>
                    {l.region}
                  </span>
                </button>
              ))}
            </div>
          )}
        </div>

      </div>

      {/* ── LEFT FLOATING GIS MAP LAYERS PANEL ── */}
      <div className={`absolute top-20 left-4 z-20 w-68 bg-[#0B1220]/90 backdrop-blur-xl border border-slate-700/60 rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ${leftLayersOpen ? 'translate-x-0' : '-translate-x-[calc(100%+1.5rem)]'}`}>
        
        <div className="p-3.5 border-b border-slate-800 flex items-center justify-between">
          <div className="flex items-center gap-2 text-xs font-bold text-white font-mono uppercase tracking-wider">
            <Layers className="w-3.5 h-3.5 text-cyan-400" />
            GIS Layer Matrix
          </div>
          <button onClick={() => setLeftLayersOpen(false)} className="text-slate-400 hover:text-white">
            <X className="w-4 h-4" />
          </button>
        </div>

        <div className="p-3.5 space-y-2 text-xs overflow-y-auto max-h-[calc(100vh-16rem)] font-mono">
          <LayerCheckbox label="Research Stations & Nodes" checked={showStations} onChange={setShowStations} count={filteredLocations.length} color="#38BDF8" symbol="●" />
          <LayerCheckbox label="Documented Expeditions" checked={showExpeditions} onChange={setShowExpeditions} count={EXPEDITION_TRACKS.length} color="#F59E0B" symbol="▲" />
          <LayerCheckbox label="Research Corridors (India)" checked={showCorridors} onChange={setShowCorridors} count={RESEARCH_CORRIDORS.length} color="#FBBF24" symbol="⌒" />
          <LayerCheckbox label="Country Boundaries & Borders" checked={showCountryBorders} onChange={setShowCountryBorders} color="#38BDF8" symbol="⎔" />
          <LayerCheckbox label="India Special Highlight" checked={showIndiaHighlight} onChange={setShowIndiaHighlight} color="#F59E0B" symbol="🇮🇳" />
          <LayerCheckbox label="Country Geographic Labels" checked={showCountryLabels} onChange={setShowCountryLabels} color="#94A3B8" symbol="🏷" />
          <LayerCheckbox label="Third Pole 3D Elevation" checked={showHimalaya3D} onChange={setShowHimalaya3D} color="#10B981" symbol="▲" />
          <LayerCheckbox label="Cryosphere Sea-Ice Extent" checked={showIceExtent} onChange={setShowIceExtent} color="#CFFAFE" symbol="🧊" />
          <LayerCheckbox label="Indexed Activity Density" checked={showDensityHeatmap} onChange={setShowDensityHeatmap} color="#0284C7" symbol="◎" />
          <LayerCheckbox label="Lat/Lon Geographic Grid" checked={showGrid} onChange={setShowGrid} color="#334155" symbol="⌗" />
          <LayerCheckbox label="Atmospheric Scattering" checked={showAtmosphere} onChange={setShowAtmosphere} color="#38BDF8" symbol="○" />

          {/* Elevation Exaggeration Slider */}
          {showHimalaya3D && (
            <div className="pt-3 border-t border-slate-800 space-y-1.5">
              <div className="flex justify-between text-[11px] text-slate-400 font-mono">
                <span>Terrain Exaggeration:</span>
                <span className="text-cyan-400">{elevationExaggeration.toFixed(1)}x</span>
              </div>
              <div className="flex items-center gap-2">
                {[1.0, 1.5, 2.0, 3.0].map(val => (
                  <button
                    key={val}
                    onClick={() => setElevationExaggeration(val)}
                    className={`flex-1 py-1 rounded text-[10px] font-bold ${
                      elevationExaggeration === val ? 'bg-cyan-600 text-white' : 'bg-slate-800 text-slate-400 hover:text-white'
                    }`}
                  >
                    {val}x
                  </button>
                ))}
              </div>
            </div>
          )}
        </div>
      </div>

      {!leftLayersOpen && (
        <button
          onClick={() => setLeftLayersOpen(true)}
          className="absolute top-20 left-4 z-20 bg-[#0B1220]/90 border border-slate-700/60 p-2.5 rounded-xl shadow-xl text-slate-300 hover:text-white text-xs font-mono flex items-center gap-2"
        >
          <Layers className="w-4 h-4 text-cyan-400" /> Layers Matrix
        </button>
      )}

      {/* ── RIGHT RESEARCH LOCATION & EVIDENCE INSPECTOR ── */}
      <div className={`absolute top-20 right-4 z-20 w-84 md:w-96 max-h-[calc(100vh-13rem)] bg-[#0B1220]/95 backdrop-blur-xl border border-slate-700/60 rounded-2xl shadow-2xl flex flex-col transition-all duration-300 ${rightInspectorOpen ? 'translate-x-0' : 'translate-x-[calc(100%+1.5rem)]'}`}>
        
        {/* Header */}
        <div className="p-4 border-b border-slate-800 flex items-start justify-between">
          <div>
            <div className="flex items-center gap-2">
              <h2 className="text-base font-bold text-white tracking-wide">{activeLocation.name}</h2>
              <span className={`px-1.5 py-0.5 rounded text-[10px] font-mono font-bold ${
                activeLocation.country === 'India'
                  ? 'bg-amber-950 text-amber-300 border border-amber-800'
                  : 'bg-slate-800 text-cyan-300 border border-slate-700'
              }`}>
                {activeLocation.code}
              </span>
            </div>
            <div className="flex items-center gap-2 mt-1 text-xs text-slate-400 font-mono">
              <span className="text-white font-semibold flex items-center gap-1">
                <Flag className="w-3 h-3 text-amber-400" /> {activeLocation.country}
              </span>
              <span>•</span>
              <span>{activeLocation.subregion}</span>
            </div>
          </div>
          <button onClick={() => setRightInspectorOpen(false)} className="text-slate-400 hover:text-white p-1">
            <X className="w-4 h-4" />
          </button>
        </div>

        {/* Tab Navigation */}
        <div className="px-3 pt-2 border-b border-slate-800/80 flex items-center gap-1 font-mono text-xs overflow-x-auto">
          {(['overview', 'evidence', 'expeditions', 'datasets', 'institutions'] as const).map(tab => (
            <button
              key={tab}
              onClick={() => setActiveTab(tab)}
              className={`px-3 py-1.5 rounded-t-lg font-medium capitalize transition-all ${
                activeTab === tab
                  ? 'bg-slate-800 text-cyan-300 border-b-2 border-cyan-400 font-bold'
                  : 'text-slate-400 hover:text-white'
              }`}
            >
              {tab}
            </button>
          ))}
        </div>

        {/* Tab Content */}
        <div className="p-4 overflow-y-auto space-y-4 text-xs font-sans flex-1 custom-scrollbar">
          
          {/* 1. OVERVIEW TAB */}
          {activeTab === 'overview' && (
            <div className="space-y-4">
              <p className="text-xs text-slate-300 leading-relaxed bg-slate-900/60 p-3 rounded-xl border border-slate-800">
                {activeLocation.description}
              </p>

              {/* Geographic Coordinates & Parameters */}
              <div className="grid grid-cols-2 gap-2 text-xs font-mono">
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Coordinates</span>
                  <span className="text-white font-semibold">
                    {activeLocation.lat.toFixed(2)}°, {activeLocation.lon.toFixed(2)}°
                  </span>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Elevation</span>
                  <span className="text-white font-semibold">{activeLocation.elevationMeters}m ASL</span>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Established</span>
                  <span className="text-white font-semibold">{activeLocation.establishedYear}</span>
                </div>
                <div className="bg-slate-900/80 p-2.5 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">Lead Agency</span>
                  <span className="text-cyan-400 font-semibold truncate block" title={activeLocation.leadInstitution}>
                    {activeLocation.leadInstitution.split('(')[0]}
                  </span>
                </div>
              </div>

              {/* Primary Research Domains */}
              <div className="space-y-1.5">
                <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block">
                  Indexed Science Disciplines:
                </span>
                <div className="flex flex-wrap gap-1.5">
                  {activeLocation.primaryDomains.map(d => (
                    <span key={d} className="px-2 py-0.5 rounded-md bg-slate-800/90 text-slate-300 text-[11px] border border-slate-700/60">
                      {d}
                    </span>
                  ))}
                </div>
              </div>
            </div>
          )}

          {/* 2. EVIDENCE & CLAIMS TAB (Core POLARIS-Ω Workflow) */}
          {activeTab === 'evidence' && (
            <div className="space-y-3">
              <div className="flex items-center justify-between font-mono text-[11px] text-slate-400">
                <span>EMPIRICAL CLAIMS ({activeLocation.associatedClaimsCount})</span>
                <span className="text-cyan-400">SHA-256 Verified</span>
              </div>

              <div className="space-y-2.5">
                {activeLocation.sampleClaims.map((cl, idx) => (
                  <div key={idx} className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-1.5">
                    <div className="flex items-center justify-between font-mono text-[10px]">
                      <span className="font-bold text-white">{cl.subject}</span>
                      <span className="text-emerald-400">{cl.direction}</span>
                    </div>
                    <p className="text-[11px] text-slate-300 leading-relaxed font-sans">{cl.observation}</p>
                    <div className="text-[10px] font-mono text-slate-500 flex justify-between pt-1 border-t border-slate-800/60">
                      <span>Confidence: {cl.confidence}</span>
                      <span className="text-cyan-400">Quote Linked</span>
                    </div>
                  </div>
                ))}
              </div>

              {/* Direct Deep-Dive Action Button */}
              <button
                onClick={() => navigate(`/claims?location=${encodeURIComponent(activeLocation.name)}`)}
                className="w-full py-2.5 px-3 rounded-xl bg-gradient-to-r from-cyan-600 to-blue-600 hover:from-cyan-500 hover:to-blue-500 text-white font-bold text-xs flex items-center justify-center gap-2 shadow-lg shadow-cyan-600/20 transition-all font-mono"
              >
                <span>EXPLORE ALL {activeLocation.associatedClaimsCount} CLAIMS IN EVIDENCE MATRIX</span>
                <ArrowUpRight className="w-4 h-4" />
              </button>
            </div>
          )}

          {/* 3. EXPEDITIONS TAB */}
          {activeTab === 'expeditions' && (
            <div className="space-y-3">
              <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block">
                Associated Field Expeditions:
              </span>

              {EXPEDITION_TRACKS.filter(e => e.region === activeLocation.region || e.country === activeLocation.country).map(exp => (
                <div key={exp.id} className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
                  <div className="flex items-center justify-between">
                    <span className="font-bold text-white text-xs">{exp.name}</span>
                    <span className="text-xs font-mono text-amber-400">{exp.year}</span>
                  </div>
                  <p className="text-[11px] text-slate-400 leading-relaxed">{exp.description}</p>
                  
                  <button
                    onClick={() => handlePlayExpedition(exp)}
                    disabled={isPlayingExpedition}
                    className="w-full py-1.5 px-2.5 rounded-lg bg-slate-800 hover:bg-slate-700 text-amber-300 text-xs font-mono flex items-center justify-center gap-1.5 border border-amber-500/30 transition-all"
                  >
                    <Play className="w-3.5 h-3.5" />
                    <span>{isPlayingExpedition && activeExpeditionId === exp.id ? `Simulating Route (${expeditionProgress}%)` : 'PLAY EXPEDITION TRAVERSE'}</span>
                  </button>
                </div>
              ))}
            </div>
          )}

          {/* 4. DATASETS TAB */}
          {activeTab === 'datasets' && (
            <div className="space-y-3">
              <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block">
                Indexed Datasets & Repositories ({activeLocation.associatedDatasetsCount}):
              </span>

              <div className="space-y-2 font-mono text-xs">
                <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-white text-[11px]">AWS-10MIN-MET-2024.nc</div>
                    <div className="text-[10px] text-slate-400">NetCDF-4 • 14.2 MB • Level-2</div>
                  </div>
                  <button onClick={() => navigate('/repository')} className="text-cyan-400 hover:underline text-[10px]">
                    Inspect
                  </button>
                </div>
                <div className="p-2.5 bg-slate-900/80 rounded-lg border border-slate-800 flex justify-between items-center">
                  <div>
                    <div className="font-bold text-white text-[11px]">SAR-ICE-VELOCITY-L3.tif</div>
                    <div className="text-[10px] text-slate-400">GeoTIFF • 88.6 MB • Level-3</div>
                  </div>
                  <button onClick={() => navigate('/repository')} className="text-cyan-400 hover:underline text-[10px]">
                    Inspect
                  </button>
                </div>
              </div>
            </div>
          )}

          {/* 5. INSTITUTIONS TAB */}
          {activeTab === 'institutions' && (
            <div className="space-y-3">
              <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block">
                Lead Research Organization:
              </span>
              <div className="p-3 bg-slate-900/80 rounded-xl border border-slate-800 space-y-2">
                <div className="flex items-center gap-2 text-white font-bold">
                  <Building2 className="w-4 h-4 text-cyan-400" />
                  <span>{activeLocation.leadInstitution}</span>
                </div>
                <div className="text-slate-400 text-xs">
                  Coordinates long-term polar science, telemetry archives, and international scientific committee reporting.
                </div>
                <div className="pt-2 border-t border-slate-800 flex justify-between text-[11px] font-mono">
                  <span className="text-slate-500">Indexed Docs: {activeLocation.associatedDocsCount}</span>
                  <span className="text-amber-400">Verified Partner</span>
                </div>
              </div>
            </div>
          )}

        </div>

        {/* Global Action Footer */}
        <div className="p-3 border-t border-slate-800/80 bg-slate-950/60 flex items-center justify-between text-xs font-mono">
          <button
            onClick={() => navigate(`/repository?location=${encodeURIComponent(activeLocation.name)}`)}
            className="text-slate-300 hover:text-white flex items-center gap-1"
          >
            <span>Repository ({activeLocation.associatedDocsCount})</span>
            <ExternalLink className="w-3 h-3" />
          </button>
          <button
            onClick={() => navigate('/stress-test')}
            className="text-amber-400 hover:text-amber-300 flex items-center gap-1"
          >
            <Zap className="w-3 h-3" />
            <span>Stress-Test</span>
          </button>
        </div>
      </div>

      {!rightInspectorOpen && (
        <button
          onClick={() => setRightInspectorOpen(true)}
          className="absolute top-20 right-4 z-20 bg-[#0B1220]/90 border border-slate-700/60 p-2.5 rounded-xl shadow-xl text-slate-300 hover:text-white text-xs font-mono flex items-center gap-2"
        >
          <Info className="w-4 h-4 text-cyan-400" /> Inspect Location
        </button>
      )}

      {/* ── INDIA POLAR RESEARCH NETWORK FLOATING MODAL ── */}
      {indiaHubOpen && (
        <div className="fixed inset-0 z-50 bg-black/70 backdrop-blur-md flex items-center justify-center p-4">
          <div className="bg-[#0B1220] border border-amber-500/40 rounded-3xl w-full max-w-4xl max-h-[90vh] overflow-hidden shadow-2xl flex flex-col font-sans">
            
            {/* Modal Header */}
            <div className="p-5 border-b border-slate-800 flex items-center justify-between bg-gradient-to-r from-amber-950/40 via-slate-900 to-slate-900">
              <div className="flex items-center gap-3">
                <div className="p-2.5 bg-amber-500/20 border border-amber-500/40 rounded-xl text-amber-300">
                  <Flag className="w-6 h-6" />
                </div>
                <div>
                  <h1 className="text-lg font-bold text-white flex items-center gap-2">
                    INDIA — POLAR & THIRD POLE RESEARCH NETWORK
                    <span className="px-2 py-0.5 text-xs font-mono bg-amber-950 text-amber-300 border border-amber-700 rounded-full font-bold">
                      MoES / NCPOR
                    </span>
                  </h1>
                  <p className="text-xs text-slate-400 font-mono mt-0.5">
                    Official Institutional Map of Indian Polar Operations, Expeditions & Scientific Nodes
                  </p>
                </div>
              </div>
              <button onClick={() => setIndiaHubOpen(false)} className="text-slate-400 hover:text-white p-2 rounded-xl bg-slate-800/80">
                <X className="w-5 h-5" />
              </button>
            </div>

            {/* Modal Body */}
            <div className="p-6 overflow-y-auto space-y-6 flex-1 custom-scrollbar text-xs">
              
              {/* Statistical KPI Grid */}
              <div className="grid grid-cols-2 sm:grid-cols-4 gap-3 font-mono">
                <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">ANNUAL EXPEDITIONS</span>
                  <span className="text-xl font-black text-amber-400">43+ ISEA</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Since 1981</span>
                </div>
                <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">ACTIVE POLAR STATIONS</span>
                  <span className="text-xl font-black text-cyan-400">4 Bases</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Bharati, Maitri, Himadri, Himansh</span>
                </div>
                <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">UNDERWATER OBSERVATORIES</span>
                  <span className="text-xl font-black text-emerald-400">IndARC</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">Kongsfjorden 192m depth</span>
                </div>
                <div className="p-3 bg-slate-900/90 rounded-xl border border-slate-800">
                  <span className="text-slate-500 text-[10px] block">INDEXED CLAIMS</span>
                  <span className="text-xl font-black text-white">56+ Claims</span>
                  <span className="text-[10px] text-slate-400 block mt-0.5">SHA-256 Provenance</span>
                </div>
              </div>

              {/* Three Pole Structural Breakdown */}
              <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                
                {/* 1. Antarctica */}
                <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-cyan-400 font-bold font-mono">
                    <Compass className="w-4 h-4" />
                    <span>ANTARCTICA PROGRAM</span>
                  </div>
                  <ul className="space-y-2 text-slate-300">
                    <li className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                      <div className="font-bold text-white">Bharati Station (2012)</div>
                      <div className="text-[10px] text-slate-400">Prydz Bay • Ocean color & SAR calibration</div>
                    </li>
                    <li className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                      <div className="font-bold text-white">Maitri Station (1989)</div>
                      <div className="text-[10px] text-slate-400">Schirmacher Oasis • Ozone & geomagnetism</div>
                    </li>
                    <li className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                      <div className="font-bold text-white">Dakshin Gangotri (1983)</div>
                      <div className="text-[10px] text-slate-400">Historic baseline node (Submerged)</div>
                    </li>
                  </ul>
                </div>

                {/* 2. Arctic */}
                <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-amber-400 font-bold font-mono">
                    <Thermometer className="w-4 h-4" />
                    <span>ARCTIC PROGRAM</span>
                  </div>
                  <ul className="space-y-2 text-slate-300">
                    <li className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                      <div className="font-bold text-white">Himadri Station (2008)</div>
                      <div className="text-[10px] text-slate-400">Ny-Ålesund, Svalbard (78°55'N)</div>
                    </li>
                    <li className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                      <div className="font-bold text-white">IndARC Subsea Mooring (2014)</div>
                      <div className="text-[10px] text-slate-400">Atlantic water advection & acoustic tracking</div>
                    </li>
                    <li className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                      <div className="font-bold text-white">Arctic Winter Campaigns</div>
                      <div className="text-[10px] text-slate-400">Continuous polar night capture since 2023</div>
                    </li>
                  </ul>
                </div>

                {/* 3. Third Pole / Himalayas */}
                <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-2xl space-y-3">
                  <div className="flex items-center gap-2 text-emerald-400 font-bold font-mono">
                    <Mountain className="w-4 h-4" />
                    <span>THIRD POLE CRYOSPHERE</span>
                  </div>
                  <ul className="space-y-2 text-slate-300">
                    <li className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                      <div className="font-bold text-white">Himansh Observatory (2016)</div>
                      <div className="text-[10px] text-slate-400">Spiti Valley (4,050m ASL)</div>
                    </li>
                    <li className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                      <div className="font-bold text-white">Chandra Basin Network</div>
                      <div className="text-[10px] text-slate-400">Chhota Shigri mass balance & drone altimetry</div>
                    </li>
                    <li className="p-2 bg-slate-950/60 rounded-lg border border-slate-800/80">
                      <div className="font-bold text-white">Monsoon Teleconnections</div>
                      <div className="text-[10px] text-slate-400">Black carbon radiative forcing on snowpack</div>
                    </li>
                  </ul>
                </div>

              </div>

              {/* Research Institutions */}
              <div className="p-4 bg-slate-900/70 border border-slate-800 rounded-2xl space-y-2">
                <span className="text-[11px] font-mono uppercase text-slate-400 font-bold block">
                  Lead Scientific Institutions in Indian Polar Consortium:
                </span>
                <div className="grid grid-cols-2 sm:grid-cols-3 gap-2 font-mono text-slate-300 text-[11px]">
                  <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800">NCPOR (Goa) - Lead Agency</div>
                  <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800">MoES (New Delhi) - Apex Ministry</div>
                  <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800">GSI (Geological Survey of India)</div>
                  <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800">SAC / ISRO (Satellite Applications)</div>
                  <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800">WIHG (Wadia Inst. of Himalayan Geology)</div>
                  <div className="p-2 bg-slate-950/60 rounded-lg border border-slate-800">NIOT (National Inst. of Ocean Technology)</div>
                </div>
              </div>

            </div>

            {/* Modal Actions */}
            <div className="p-4 border-t border-slate-800 bg-slate-950 flex items-center justify-between font-mono">
              <span className="text-slate-400 text-xs">
                NCPOR Official Data Repository Indexed
              </span>
              <div className="flex items-center gap-3">
                <button
                  onClick={() => {
                    setIndiaHubOpen(false);
                    navigate('/claims?country=India');
                  }}
                  className="px-4 py-2 rounded-xl bg-gradient-to-r from-amber-600 to-amber-500 hover:from-amber-500 hover:to-amber-400 text-white font-bold text-xs shadow-lg shadow-amber-600/20"
                >
                  EXPLORE INDIA'S RESEARCH EVIDENCE MATRIX
                </button>
              </div>
            </div>

          </div>
        </div>
      )}

      {/* ── BOTTOM TEMPORAL TIMELINE BAR (1981 - 2026) ── */}
      <div className="absolute bottom-4 left-4 right-4 z-20 bg-[#0B1220]/90 backdrop-blur-xl border border-slate-700/60 rounded-2xl p-3 shadow-2xl flex flex-col md:flex-row items-center justify-between gap-4 font-mono text-xs">
        
        {/* Playback Controls & Active Year Counter */}
        <div className="flex items-center gap-3 shrink-0">
          <button
            onClick={() => setIsPlayingTimeline(!isPlayingTimeline)}
            className="p-2 rounded-xl bg-slate-800 hover:bg-slate-700 text-cyan-400 border border-slate-700 transition-all"
            title={isPlayingTimeline ? 'Pause timeline' : 'Auto-play temporal simulation'}
          >
            {isPlayingTimeline ? <Pause className="w-4 h-4" /> : <Play className="w-4 h-4" />}
          </button>

          <div>
            <div className="text-base font-extrabold text-white tracking-wider flex items-center gap-2">
              YEAR: <span className="text-cyan-400">{timelineYear}</span>
            </div>
            <div className="text-[10px] text-slate-400">
              Active Stations: {filteredLocations.length} of {RESEARCH_LOCATIONS.length} (Filtered by: {selectedCountry})
            </div>
          </div>
        </div>

        {/* Timeline Slider with Decadal Milestones */}
        <div className="flex-1 w-full max-w-2xl px-2 space-y-1">
          <input
            type="range"
            min={1981}
            max={2026}
            step={1}
            value={timelineYear}
            onChange={e => setTimelineYear(parseInt(e.target.value))}
            className="w-full h-1.5 bg-slate-800 rounded-lg appearance-none cursor-pointer"
          />
          <div className="flex justify-between text-[10px] text-slate-500 font-mono">
            <span>1981 (Operation Gangotri)</span>
            <span>1989 (Maitri Base)</span>
            <span>2008 (Himadri Arctic)</span>
            <span>2012 (Bharati)</span>
            <span>2016 (Himansh)</span>
            <span className="text-cyan-400 font-bold">2026 (Modern Matrix)</span>
          </div>
        </div>

        {/* Real-time Cursor & Projection Telemetry HUD */}
        <div className="hidden lg:flex items-center gap-4 text-[11px] text-slate-400 border-l border-slate-800 pl-4 shrink-0">
          <div>
            <span className="text-slate-500 block text-[9px]">CURSOR POSITION</span>
            <span className="text-slate-200 font-bold">
              {cursorCoords ? `${cursorCoords.lat}°N, ${cursorCoords.lon}°E` : 'Hover on Globe'}
            </span>
          </div>
          <div>
            <span className="text-slate-500 block text-[9px]">PROJECTION</span>
            <span className="text-cyan-300 font-bold">Polar Stereographic</span>
          </div>
        </div>

      </div>

      {/* ── BOTTOM-RIGHT COMPACT SCIENTIFIC MAP LEGEND ── */}
      <div className="absolute bottom-24 right-4 z-20 hidden sm:block bg-[#0B1220]/80 backdrop-blur-md border border-slate-800 rounded-xl px-3 py-2 text-[11px] font-mono text-slate-300 space-y-1 shadow-xl pointer-events-none">
        <div className="text-[10px] text-slate-500 uppercase tracking-wider font-bold">Taxonomy & Symbols</div>
        <div className="flex items-center gap-3">
          <span className="flex items-center gap-1"><span className="text-amber-400 font-bold">●</span> India Base</span>
          <span className="flex items-center gap-1"><span className="text-cyan-400 font-bold">●</span> Int'l Station</span>
          <span className="flex items-center gap-1"><span className="text-amber-400 font-bold">▲</span> Traverse</span>
          <span className="flex items-center gap-1"><span className="text-amber-400 font-bold">⌒</span> Corridor</span>
          <span className="flex items-center gap-1"><span className="text-emerald-400 font-bold">▲</span> Third Pole</span>
        </div>
      </div>

    </div>
  );
};

// Subcomponent for Layer Matrix Checkbox Item
interface LayerCheckboxProps {
  label: string;
  checked: boolean;
  onChange: (val: boolean) => void;
  count?: number;
  color: string;
  symbol: string;
}

const LayerCheckbox: React.FC<LayerCheckboxProps> = ({ label, checked, onChange, count, color, symbol }) => (
  <label className="flex items-center justify-between p-1.5 rounded-lg hover:bg-slate-800/50 cursor-pointer transition-colors">
    <div className="flex items-center gap-2 truncate">
      <input
        type="checkbox"
        checked={checked}
        onChange={e => onChange(e.target.checked)}
        className="rounded border-slate-700 bg-slate-900 text-cyan-500 focus:ring-0 focus:ring-offset-0 cursor-pointer"
      />
      <span className="text-[11px] truncate text-slate-300 flex items-center gap-1.5">
        <span style={{ color }}>{symbol}</span> {label}
      </span>
    </div>
    {count !== undefined && (
      <span className="text-[10px] font-mono text-slate-500 bg-slate-900 px-1.5 py-0.2 rounded border border-slate-800">
        {count}
      </span>
    )}
  </label>
);

