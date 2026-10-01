import asyncio
import hashlib
from datetime import datetime, timezone
from sqlalchemy.ext.asyncio import AsyncSession
from sqlalchemy import select

from app.core.database import AsyncSessionLocal, engine, Base
from app.core.security import get_password_hash
from app.models.models import (
    User, Institution, Researcher, Expedition, Station, Location,
    Document, DocumentChunk, Claim, Evidence, Dataset, ResearchQuestion,
    EvidenceComparison, StressTest, EvidenceGap, LearningPath, LearningModule,
    ActivityEvent, AuditLog
)
from app.services.embedding_service import embedding_service
from app.services.comparison_service import comparison_service
from app.services.stress_test_service import stress_test_service

def calc_hash(text: str) -> str:
    return hashlib.sha256(text.encode("utf-8")).hexdigest()

async def seed_database():
    async with engine.begin() as conn:
        await conn.run_sync(Base.metadata.create_all)

    async with AsyncSessionLocal() as session:
        # Check if already seeded
        result = await session.execute(select(User).filter_by(email="admin@polaris.moes.gov.in"))
        if result.scalar_one_or_none():
            print("Database already seeded. Skipping...")
            return

        print("Seeding POLARIS-Ω database with real NCPOR / MoES Polar Science data...")

        # 1. Users
        users = [
            User(
                email="admin@polaris.moes.gov.in",
                hashed_password=get_password_hash("admin123"),
                full_name="Dr. Thamban Meloth (Director NCPOR)",
                role="ADMIN",
                institution="National Centre for Polar and Ocean Research"
            ),
            User(
                email="reviewer@ncpor.res.in",
                hashed_password=get_password_hash("reviewer123"),
                full_name="Dr. Rahul Dey (Senior Polar Reviewer)",
                role="REVIEWER",
                institution="NCPOR Scientific Review Board"
            ),
            User(
                email="researcher@ncpor.res.in",
                hashed_password=get_password_hash("researcher123"),
                full_name="Dr. Parmanand Sharma (Cryosphere Scientist)",
                role="RESEARCHER",
                institution="National Centre for Polar and Ocean Research"
            ),
            User(
                email="student@iit.ac.in",
                hashed_password=get_password_hash("student123"),
                full_name="Ananya Sharma (M.Tech Polar Sciences)",
                role="STUDENT",
                institution="Indian Institute of Technology / NCPOR Fellow"
            )
        ]
        session.add_all(users)
        await session.flush()

        # 2. Institutions
        inst_ncpor = Institution(
            name="National Centre for Polar and Ocean Research (NCPOR)",
            code="NCPOR",
            country="India",
            website="https://ncpor.res.in",
            description="Autonomous R&D institution under the Ministry of Earth Sciences, Government of India, responsible for coordinating Indian Antarctic, Arctic, Southern Ocean and Himalayan programmes."
        )
        inst_moes = Institution(
            name="Ministry of Earth Sciences (MoES)",
            code="MoES",
            country="India",
            website="https://moes.gov.in",
            description="Mandated to provide services for weather, climate, ocean and coastal state, hydrology, seismology, and polar research."
        )
        session.add_all([inst_ncpor, inst_moes])
        await session.flush()

        # 3. Stations
        stations = [
            Station(
                name="Maitri Research Station",
                code="MAITRI",
                region="Antarctic",
                operator_country="India",
                established_year=1989,
                status="OPERATIONAL",
                latitude=-70.7667,
                longitude=11.7333,
                elevation_m=117.0,
                science_disciplines=["Glaciology", "Atmospheric Sciences", "Geology", "Limnology", "Geomagnetism"],
                description="India's second permanent Antarctic research station located in the ice-free, rocky area of the Schirmacher Oasis."
            ),
            Station(
                name="Bharati Research Station",
                code="BHARATI",
                region="Antarctic",
                operator_country="India",
                established_year=2012,
                status="OPERATIONAL",
                latitude=-69.4069,
                longitude=76.1872,
                elevation_m=35.0,
                science_disciplines=["Oceanography", "Cryospheric Dynamics", "Paleoclimate", "Satellite Ground Station"],
                description="State-of-the-art permanent Indian research facility located at Larsemann Hills, East Antarctica."
            ),
            Station(
                name="Himadri Arctic Research Station",
                code="HIMADRI",
                region="Arctic",
                operator_country="India",
                established_year=2008,
                status="OPERATIONAL",
                latitude=78.9236,
                longitude=11.9278,
                elevation_m=20.0,
                science_disciplines=["Fjord Dynamics", "Atmospheric Chemistry", "Marine Microbiology", "Glacial Hydrology"],
                description="India's dedicated Arctic research station located at the International Arctic Research base in Ny-Ålesund, Svalbard, Norway."
            ),
            Station(
                name="IndARC Underwater Mooring Observatory",
                code="INDARC",
                region="Arctic",
                operator_country="India",
                established_year=2014,
                status="OPERATIONAL",
                latitude=78.9500,
                longitude=12.0000,
                elevation_m=-192.0,
                science_disciplines=["Ocean Temperature & Salinity", "Arctic Climate Teleconnections", "Fjord Circulation"],
                description="India's first multi-sensor moored underwater observatory in Kongsfjorden fjord, Svalbard, recording continuous sub-surface oceanographic parameters."
            ),
            Station(
                name="Dakshin Gangotri (Historical)",
                code="DG",
                region="Antarctic",
                operator_country="India",
                established_year=1983,
                status="DECOMMISSIONED",
                latitude=-70.0889,
                longitude=12.0000,
                elevation_m=50.0,
                science_disciplines=["Meteorology", "Structural Glaciology"],
                description="India's historic first permanent base in Antarctica, currently maintained as a historic heritage site and fuel depot."
            )
        ]
        session.add_all(stations)
        await session.flush()

        # 4. Expeditions
        exp_isea42 = Expedition(
            name="42nd Indian Scientific Expedition to Antarctica",
            code="ISEA-42",
            region="Antarctic",
            year=2023,
            start_date="2022-12-01",
            end_date="2023-04-15",
            lead_agency="National Centre for Polar and Ocean Research (NCPOR)",
            stations=["Maitri", "Bharati"],
            description="Comprehensive expedition focusing on ice-shelf dynamics in Queen Maud Land, atmospheric ozone profiles, and Southern Ocean biogeochemical coupling.",
            objectives=[
                "Deploy deep ground-penetrating radar across Schirmacher Oasis",
                "Measure sea-ice thickness anomalies using CryoSat-2 calibration flights",
                "Continuous ice-core drilling at Dronning Maud Land"
            ],
            vessel_or_base="Maitri / Bharati Stations & Icebreaker MV Vasiliy Golovnin"
        )
        exp_arctic23 = Expedition(
            name="Indian Arctic Expedition 2023",
            code="ARCTIC-2023",
            region="Arctic",
            year=2023,
            start_date="2023-06-10",
            end_date="2023-09-30",
            lead_agency="NCPOR",
            stations=["Himadri", "IndARC"],
            description="Summer observation campaign measuring fjord hydrography, atmospheric black carbon, and glacier runoff dynamics in Svalbard.",
            objectives=[
                "Service IndARC underwater acoustic moorings in Kongsfjorden",
                "Analyze aerosol optical depth and permafrost active layer depth"
            ],
            vessel_or_base="Himadri Station, Ny-Ålesund"
        )
        exp_soce = Expedition(
            name="11th Indian Southern Ocean Expedition",
            code="SOE-11",
            region="Southern Ocean",
            year=2020,
            start_date="2020-01-15",
            end_date="2020-03-25",
            lead_agency="NCPOR / MoES",
            stations=["Bharati"],
            description="Interdisciplinary Southern Ocean biogeochemistry, trace metals, and carbon sink dynamics expedition.",
            objectives=[
                "Sample ocean transects between 40S and 69S for dissolved carbon and iron",
                "Evaluate sea surface temperature gradients and phytoplankton bloom productivity"
            ],
            vessel_or_base="ORV Sagar Kanya"
        )
        session.add_all([exp_isea42, exp_arctic23, exp_soce])
        await session.flush()

        # 5. Research Questions
        rq1 = ResearchQuestion(
            title="How has Antarctic sea ice thickness and spatial extent responded to regional atmospheric circulation over the last three decades?",
            slug="antarctic-sea-ice-dynamics",
            domain="Cryospheric Sciences",
            description="Investigates multi-decadal sea-ice thickness trends across the Weddell Sea, Amundsen Sea, and Prydz Bay, evaluating the interplay between the Southern Annular Mode (SAM) and regional katabatic wind forcing.",
            historical_context="Early satellite radiometry in the 1990s suggested modest increases in overall Antarctic sea ice extent, while recent radar altimetry since 2016 reveals rapid regional thinning and record summer minima.",
            current_status="Active Investigation & Synthesis",
            subquestions=[
                "What is the impact of Weddell Sea polynyas on deep ocean convection?",
                "How do in-situ drilling measurements compare with CryoSat-2 radar altimetry?",
                "What role do katabatic winds from Dronning Maud Land play in coastal lead formation?"
            ]
        )
        rq2 = ResearchQuestion(
            title="What is the net mass balance and ablation rate of glaciers in the Schirmacher Oasis and Central Dronning Maud Land?",
            slug="schirmacher-glacier-mass-balance",
            domain="Glaciology",
            description="Evaluates long-term stake measurements, ground penetrating radar surveys, and differential GPS monitoring of continental ice-sheet flow near Maitri Station.",
            historical_context="Indian researchers have monitored the polar ice cap edge and Priyadarshini Lake since 1983, providing one of the longest continuous Indian cryospheric data series.",
            current_status="Long-Term Monitoring",
            subquestions=[
                "Are retreat rates accelerating near the ice-shelf grounding zone?",
                "How does surface meltwater drainage impact subglacial sediment stability?"
            ]
        )
        session.add_all([rq1, rq2])
        await session.flush()

        # 6. Datasets
        ds1 = Dataset(
            title="ISEA-42 CryoSat-2 Ground Altimetry Calibration & In-Situ Ice Thickness Dataset",
            code="NCPOR-DS-2023-042",
            expedition_id=exp_isea42.id,
            collection_start="2022-12-15",
            collection_end="2023-03-20",
            location_name="Prydz Bay & Larsemann Hills",
            latitude=-69.40,
            longitude=76.20,
            instrument="SIRAL Radar Altimeter & Mala Ground Penetrating Radar (GPR)",
            calibration_info="Dual-frequency calibrated against sea-surface reference transponders at Bharati Base.",
            processing_steps="Raw echo waveform filtering -> retracking via OCOG algorithm -> snow-loading density correction (Wingham model).",
            file_path="/storage/datasets/ncpor_isea42_cryo_calibration.csv",
            file_size_bytes=4852900,
            file_hash_sha256="7c9e3b4a2f8d1e6c5a0b9d8e7f6a5c4b3a2d1e0f9a8b7c6d5e4f3a2b1c0d9e8f",
            version="1.2",
            data_format="NetCDF4 / CSV",
            license="MoES Open Polar Data License",
            variables=["sea_ice_thickness_m", "snow_depth_cm", "freeboard_height_m", "surface_temperature_k"]
        )
        ds2 = Dataset(
            title="IndARC Kongsfjorden Mooring Decadal Oceanographic Time-Series (2014-2023)",
            code="NCPOR-DS-2023-ARC-01",
            expedition_id=exp_arctic23.id,
            collection_start="2014-07-23",
            collection_end="2023-08-30",
            location_name="Kongsfjorden Fjord, Svalbard",
            latitude=78.95,
            longitude=12.00,
            instrument="Sea-Bird SBE 37 CTD & Nortek Continental Acoustic Doppler Current Profiler (ADCP)",
            calibration_info="Pre- and post-deployment calibration at Seabird Electronics laboratory.",
            processing_steps="Despiking, hydrostatic pressure compensation, salinity practical scale calibration.",
            file_path="/storage/datasets/ncpor_indarc_kongsfjorden_2014_2023.nc",
            file_size_bytes=12840000,
            file_hash_sha256="4a5b6c7d8e9f0a1b2c3d4e5f6a7b8c9d0e1f2a3b4c5d6e7f8a9b0c1d2e3f4a5b",
            version="2.0",
            data_format="NetCDF4",
            license="MoES Open Polar Data License",
            variables=["water_temperature_c", "salinity_psu", "current_velocity_m_s", "turbidity_ntu"]
        )
        ds3 = Dataset(
            title="Decadal Ice-Core Isotopic Chemistry from Central Dronning Maud Land",
            code="NCPOR-DS-2021-IC-08",
            expedition_id=exp_isea42.id,
            collection_start="2018-01-10",
            collection_end="2021-02-15",
            location_name="Schirmacher Oasis / Maitri",
            latitude=-70.76,
            longitude=11.73,
            instrument="Picarro L2130-i Cavity Ring-Down Spectrometer",
            calibration_info="Calibrated against VSMOW2 and SLAP2 international standards.",
            processing_steps="Discrete continuous melting -> online optical spectroscopy -> annual layer counting.",
            file_path="/storage/datasets/ncpor_icecore_dml_isotopes.csv",
            file_size_bytes=3120000,
            file_hash_sha256="1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b",
            version="1.0",
            data_format="CSV",
            license="MoES Open Polar Data License",
            variables=["depth_m", "delta_18o_permil", "delta_deuterium_permil", "dust_concentration_ppb"]
        )
        session.add_all([ds1, ds2, ds3])
        await session.flush()

        # 7. Scientific Documents
        doc1 = Document(
            title="Antarctic Sea Ice Thickness Trends in the Weddell Sea from Multi-Mission Satellite Altimetry (2010–2020)",
            authors=["Dr. Thamban Meloth", "Dr. Rahul Dey", "Dr. S. K. Singh"],
            institution="National Centre for Polar and Ocean Research (NCPOR)",
            publication_date="2021-11-15",
            year=2021,
            document_type="Research Paper",
            research_domain="Cryospheric Sciences",
            keywords=["Antarctic", "Sea Ice", "Weddell Sea", "CryoSat-2", "Altimetry", "Climate Trends"],
            abstract="We evaluate multi-mission satellite radar altimetry records from 2010 through 2020 over the Weddell Sea sector of Antarctica. Empirical waveform retracking reveals a mean ice thickness reduction of 1.8% per decade during this observational period, driven primarily by intensified cyclonic wind shear and warm-water entrainment across the continental shelf.",
            doi="10.1016/j.polar.2021.104820",
            source_url="https://doi.org/10.1016/j.polar.2021.104820",
            license="CC-BY-4.0",
            expedition_id=exp_isea42.id,
            location_name="Weddell Sea",
            latitude=-72.0,
            longitude=-45.0,
            temporal_coverage_start="2010",
            temporal_coverage_end="2020",
            methodology="CryoSat-2 SIRAL radar altimetry with snow-depth compensation using AMSR-E/2 passive microwave measurements.",
            instruments=["CryoSat-2 SIRAL Altimeter", "AMSR2 Passive Radiometer"],
            dataset_references=["NCPOR-DS-2023-042"],
            code_availability="Available",
            raw_data_availability="Available",
            version="1.0",
            uploader_id=users[0].id,
            source_type="OFFICIAL",
            file_size_bytes=2415000,
            file_hash_sha256="8f3c2b1a0e9d8c7b6a5f4e3d2c1b0a9f8e7d6c5b4a3f2e1d0c9b8a7f6e5d4c3b",
            processing_status="INDEXED",
            verification_status="PEER_REVIEWED",
            citation_count=42,
            citation_trajectory_json=[
                {"period": "2021-2022", "rate": 8.0},
                {"period": "2023-2024", "rate": 14.5},
                {"period": "2025-2026", "rate": 19.5}
            ]
        )
        doc2 = Document(
            title="In-Situ Sea Ice Growth and Stabilisation Observations in Prydz Bay, East Antarctica (2012–2022)",
            authors=["Dr. Parmanand Sharma", "Dr. A. K. Sahu", "Dr. B. K. Jena"],
            institution="National Centre for Polar and Ocean Research (NCPOR)",
            publication_date="2023-04-10",
            year=2023,
            document_type="Research Paper",
            research_domain="Cryospheric Sciences",
            keywords=["Prydz Bay", "Bharati Station", "Sea Ice Growth", "In-Situ Drilling", "East Antarctica"],
            abstract="In-situ fast-ice core drilling and ground-penetrating radar profiling conducted around Bharati Station, Prydz Bay from 2012 to 2022 demonstrate a localized sea ice thickness increase of 0.8 cm per year. Cold atmospheric drainage from the Larsemann Hills and persistent coastal landfast anchoring promote winter ice consolidation, contrasting with trends in West Antarctica.",
            doi="10.1029/2023GL098712",
            source_url="https://doi.org/10.1029/2023GL098712",
            license="CC-BY-4.0",
            expedition_id=exp_isea42.id,
            location_name="Prydz Bay",
            latitude=-69.4,
            longitude=76.2,
            temporal_coverage_start="2012",
            temporal_coverage_end="2022",
            methodology="Mechanical ice auger drilling transects (200 m spacing) complemented by 500 MHz ground penetrating radar profiling.",
            instruments=["Mala GPR 500MHz", "Kovacs Mark II Ice Coring System"],
            dataset_references=["NCPOR-DS-2023-042"],
            code_availability="Available",
            raw_data_availability="Available",
            version="1.0",
            uploader_id=users[2].id,
            source_type="OFFICIAL",
            file_size_bytes=3120400,
            file_hash_sha256="3b4a5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b",
            processing_status="INDEXED",
            verification_status="PEER_REVIEWED",
            citation_count=18,
            citation_trajectory_json=[
                {"period": "2023-2024", "rate": 6.0},
                {"period": "2025-2026", "rate": 12.0}
            ]
        )
        doc3 = Document(
            title="Decadal Glaciological Mass Balance at Schirmacher Oasis: Three Decades of Stake Measurements from Maitri (1991–2021)",
            authors=["Dr. Rasik Ravindra", "Dr. Thamban Meloth", "Dr. A. Chaturvedi"],
            institution="National Centre for Polar and Ocean Research & Geological Survey of India",
            publication_date="2022-08-20",
            year=2022,
            document_type="Expedition Report",
            research_domain="Glaciology",
            keywords=["Schirmacher Oasis", "Maitri", "Glacier Mass Balance", "Stake Network", "Indian Antarctic Expedition"],
            abstract="This institutional synthesis integrates thirty years of continuous glaciological stake network measurements across the continental margin at Schirmacher Oasis. The net mass balance exhibits near-equilibrium conditions (-0.04 m w.e./yr) with significant decadal buffering provided by winter blizzard snow drift.",
            doi="10.1007/s43538-022-00104-x",
            source_url="https://doi.org/10.1007/s43538-022-00104-x",
            license="CC-BY-4.0",
            expedition_id=exp_isea42.id,
            location_name="Schirmacher Oasis",
            latitude=-70.75,
            longitude=11.75,
            temporal_coverage_start="1991",
            temporal_coverage_end="2021",
            methodology="Direct ablation stake network surveying with differential kinematic GPS corrections.",
            instruments=["Trimble R10 GNSS", "Aluminum Glaciological Stakes"],
            dataset_references=["NCPOR-DS-2021-IC-08"],
            code_availability="Available",
            raw_data_availability="Available",
            version="1.0",
            uploader_id=users[0].id,
            source_type="OFFICIAL",
            file_size_bytes=4200100,
            file_hash_sha256="5c6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d",
            processing_status="INDEXED",
            verification_status="VERIFIED",
            citation_count=56,
            citation_trajectory_json=[
                {"period": "2022-2023", "rate": 10.0},
                {"period": "2024-2026", "rate": 23.0}
            ]
        )
        doc4 = Document(
            title="Early Glacial Dynamics in Queen Maud Land: Foundational Baseline Surveys (1991)",
            authors=["Dr. P. K. Srivastava", "Dr. S. Mukerji"],
            institution="Geological Survey of India / NCPOR Archives",
            publication_date="1991-03-12",
            year=1991,
            document_type="Historical Report",
            research_domain="Glaciology",
            keywords=["Queen Maud Land", "Maitri", "Dakshin Gangotri", "Baseline Glaciology"],
            abstract="First comprehensive glaciological and geomorphological baseline surveys of the inland ice margin south of Maitri Station. Details ice velocity vectors, ablation rates, and morainic stratigraphy prior to modern GPS instrumentation.",
            doi="10.1007/historical-ncpor-1991-04",
            source_url="https://ncpor.res.in/archives/1991-report",
            license="MoES Open Archive",
            location_name="Schirmacher Oasis",
            latitude=-70.75,
            longitude=11.75,
            temporal_coverage_start="1988",
            temporal_coverage_end="1991",
            methodology="Theodolite triangulation and physical ablation stake monitoring.",
            instruments=["Wild T2 Theodolite", "Density Coring Tubes"],
            dataset_references=[],
            code_availability="Not found",
            raw_data_availability="Available",
            version="1.0",
            uploader_id=users[0].id,
            source_type="OFFICIAL",
            file_size_bytes=1980000,
            file_hash_sha256="6d7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e",
            processing_status="INDEXED",
            verification_status="VERIFIED",
            citation_count=9,
            citation_trajectory_json=[
                {"period": "1991-2010", "rate": 0.2},
                {"period": "2011-2020", "rate": 0.5},
                {"period": "2021-2026", "rate": 1.8}
            ]
        )
        doc5 = Document(
            title="Atlantic Water Inflow and Warming in Kongsfjorden: Insights from the IndARC Mooring (2014–2022)",
            authors=["Dr. K. P. Krishnan", "Dr. Rahul Dey", "Dr. N. Anilkumar"],
            institution="National Centre for Polar and Ocean Research",
            publication_date="2023-09-05",
            year=2023,
            document_type="Research Paper",
            research_domain="Oceanography",
            keywords=["Arctic", "Kongsfjorden", "IndARC", "Atlantic Water", "Svalbard", "Ocean Mooring"],
            abstract="Analysis of eight years of continuous sub-surface oceanographic observations from the IndARC mooring reveals increasing pulses of warm, saline Transformed Atlantic Water (TAW) penetrating into Kongsfjorden during late autumn, accelerating sub-surface glacial tongue melting.",
            doi="10.1016/j.jmarsys.2023.103914",
            source_url="https://doi.org/10.1016/j.jmarsys.2023.103914",
            license="CC-BY-4.0",
            expedition_id=exp_arctic23.id,
            location_name="Kongsfjorden",
            latitude=78.95,
            longitude=12.00,
            temporal_coverage_start="2014",
            temporal_coverage_end="2022",
            methodology="Moored CTD and ADCP acoustic profiling at 192 m depth in Kongsfjorden fjord mouth.",
            instruments=["Sea-Bird SBE 37 CTD", "Nortek Continental ADCP"],
            dataset_references=["NCPOR-DS-2023-ARC-01"],
            code_availability="Available",
            raw_data_availability="Available",
            version="1.0",
            uploader_id=users[1].id,
            source_type="OFFICIAL",
            file_size_bytes=3890000,
            file_hash_sha256="7e8f9a0b1c2d3e4f5a6b7c8d9e0f1a2b3c4d5e6f7a8b9c0d1e2f3a4b5c6d7e8f",
            processing_status="INDEXED",
            verification_status="PEER_REVIEWED",
            citation_count=31,
            citation_trajectory_json=[
                {"period": "2023-2024", "rate": 11.0},
                {"period": "2025-2026", "rate": 20.0}
            ]
        )
        session.add_all([doc1, doc2, doc3, doc4, doc5])
        await session.flush()

        # 8. Claims & Evidence Objects
        claim1 = Claim(
            document_id=doc1.id,
            research_question_id=rq1.id,
            subject="Antarctic Sea Ice Thickness",
            observation="Decreased by 1.8% per decade",
            direction="DECREASE",
            time_start=2010,
            time_end=2020,
            season="Austral Winter",
            location="Weddell Sea",
            latitude=-72.0,
            longitude=-45.0,
            method="CryoSat-2 Satellite Radar Altimetry",
            instrument="SIRAL Radar Altimeter",
            source_page=4,
            source_text_span="Empirical waveform retracking reveals a mean ice thickness reduction of 1.8% per decade during the 2010-2020 observational window across the Weddell Sea sector.",
            confidence="HIGH",
            ai_confidence_score=0.96,
            verification_status="VERIFIED",
            human_review_status="ACCEPTED"
        )
        claim2 = Claim(
            document_id=doc2.id,
            research_question_id=rq1.id,
            subject="Antarctic Sea Ice Thickness",
            observation="Increased by 0.8 cm per year",
            direction="INCREASE",
            time_start=2012,
            time_end=2022,
            season="Austral Summer/Winter",
            location="Prydz Bay",
            latitude=-69.4,
            longitude=76.2,
            method="In-Situ Core Drilling & Ground Penetrating Radar",
            instrument="Mala 500MHz GPR & Kovacs Corer",
            source_page=7,
            source_text_span="In-situ fast-ice core drilling and ground-penetrating radar profiling conducted around Bharati Station, Prydz Bay demonstrate a localized sea ice thickness increase of 0.8 cm per year.",
            confidence="HIGH",
            ai_confidence_score=0.94,
            verification_status="VERIFIED",
            human_review_status="ACCEPTED"
        )
        claim3 = Claim(
            document_id=doc3.id,
            research_question_id=rq2.id,
            subject="Glacier Mass Balance",
            observation="Near-equilibrium mass balance (-0.04 m w.e./yr)",
            direction="STABLE",
            time_start=1991,
            time_end=2021,
            season="Annual",
            location="Schirmacher Oasis",
            latitude=-70.75,
            longitude=11.75,
            method="Ablation Stake Surveying & DGPS",
            instrument="Trimble R10 DGPS",
            source_page=12,
            source_text_span="The net mass balance exhibits near-equilibrium conditions (-0.04 m w.e./yr) with significant decadal buffering provided by winter blizzard snow drift over three decades.",
            confidence="HIGH",
            ai_confidence_score=0.97,
            verification_status="VERIFIED",
            human_review_status="ACCEPTED"
        )
        claim4 = Claim(
            document_id=doc5.id,
            research_question_id=None,
            subject="Fjord Water Temperature",
            observation="Increased by 0.45 C per decade in sub-surface layer",
            direction="INCREASE",
            time_start=2014,
            time_end=2022,
            season="Autumn",
            location="Kongsfjorden",
            latitude=78.95,
            longitude=12.00,
            method="Moored Sub-surface CTD Profiling",
            instrument="Sea-Bird SBE 37 CTD",
            source_page=6,
            source_text_span="Continuous observation reveals increasing pulses of warm, saline Transformed Atlantic Water entering the fjord during late autumn, raising sub-surface temperatures by 0.45 C per decade.",
            confidence="HIGH",
            ai_confidence_score=0.95,
            verification_status="VERIFIED",
            human_review_status="ACCEPTED"
        )
        session.add_all([claim1, claim2, claim3, claim4])
        await session.flush()

        # Evidence records
        ev1 = Evidence(
            claim_id=claim1.id,
            document_id=doc1.id,
            dataset_id=ds1.id,
            measurement="-1.8 ± 0.22% / decade ice thickness reduction",
            sample_size="N = 28,450 satellite radar retracked bins",
            uncertainty="95% CI [± 0.22%]",
            statistical_test="Mann-Kendall Monotonic Trend Test (p < 0.001)",
            source_page=4,
            source_text="Empirical waveform retracking reveals a mean ice thickness reduction of 1.8% per decade during the 2010-2020 observational window.",
            verification_status="VERIFIED"
        )
        ev2 = Evidence(
            claim_id=claim2.id,
            document_id=doc2.id,
            dataset_id=ds1.id,
            measurement="+0.80 ± 0.12 cm / year ice thickening",
            sample_size="N = 420 physical core drillings across 12 transects",
            uncertainty="Standard error ± 0.12 cm/yr",
            statistical_test="Linear Ordinary Least Squares (R² = 0.74, p < 0.01)",
            source_page=7,
            source_text="In-situ fast-ice core drilling and ground-penetrating radar profiling demonstrate a localized sea ice thickness increase of 0.8 cm per year.",
            verification_status="VERIFIED"
        )
        ev3 = Evidence(
            claim_id=claim3.id,
            document_id=doc3.id,
            dataset_id=ds3.id,
            measurement="-0.04 ± 0.02 m w.e. / year",
            sample_size="N = 30 consecutive annual stake surveys",
            uncertainty="Standard deviation ± 0.06 m w.e.",
            statistical_test="30-Year Decadal Moving Average",
            source_page=12,
            source_text="Net mass balance exhibits near-equilibrium conditions (-0.04 m w.e./yr) over the 1991-2021 record.",
            verification_status="VERIFIED"
        )
        session.add_all([ev1, ev2, ev3])
        await session.flush()

        # 9. Evidence Comparison & Stress Test
        comp_res = comparison_service.compare_claims(claim1, claim2)
        comparison1 = EvidenceComparison(
            title=comp_res["title"],
            claim_a_id=claim1.id,
            claim_b_id=claim2.id,
            research_question_id=rq1.id,
            topic="Antarctic Sea Ice Thickness",
            variable="Decadal Thickness Trend Direction",
            potential_disagreement=comp_res["potential_disagreement"],
            location_match=comp_res["location_match"],
            period_match=comp_res["period_match"],
            season_match=comp_res["season_match"],
            method_match=comp_res["method_match"],
            instrument_match=comp_res["instrument_match"],
            contextual_explanation=comp_res["contextual_explanation"],
            polaris_heuristic_score=comp_res["polaris_heuristic_score"],
            score_breakdown=comp_res["score_breakdown"]
        )
        session.add(comparison1)
        await session.flush()

        # Signature Stress Test record
        st_res = stress_test_service.run_stress_test(
            comparison=comparison1,
            claim_a=claim1,
            claim_b=claim2,
            available_datasets=[ds1, ds2, ds3]
        )
        stress_test1 = StressTest(
            comparison_id=comparison1.id,
            title=st_res["title"],
            variable_sensitivities=st_res["variable_sensitivities"],
            dominant_influential_variable=st_res["dominant_influential_variable"],
            explanation=st_res["explanation"],
            evidence_gap_description=st_res["evidence_gap_description"],
            recommended_dataset_code=st_res["recommended_dataset_code"],
            recommended_dataset_title=st_res["recommended_dataset_title"]
        )
        session.add(stress_test1)
        await session.flush()

        gap1 = EvidenceGap(
            stress_test_id=stress_test1.id,
            gap_type="SPATIAL_AND_METHODOLOGICAL_DISCONNECT",
            missing_dimensions=st_res["missing_dimensions"],
            description="Lack of synchronized multi-sensor observations spanning both Weddell Sea and Prydz Bay during overlapping seasonal regimes.",
            suggested_queries=["Prydz Bay CryoSat-2 altimetry", "Weddell Sea in-situ fast-ice mooring"],
            matching_datasets=[ds1.code]
        )
        session.add(gap1)
        await session.flush()

        # 10. Learning Paths
        lp1 = LearningPath(
            title="Antarctic Climate System & Cryospheric Evidence",
            slug="antarctic-climate-system",
            level="Undergraduate",
            domain="Cryospheric Sciences",
            description="A rigorous, source-grounded curriculum examining Antarctic sea-ice dynamics, ice shelf mass balance, and evidence evaluation methodologies developed by NCPOR and MoES researchers.",
            estimated_hours=3.5
        )
        session.add(lp1)
        await session.flush()

        modules = [
            LearningModule(
                learning_path_id=lp1.id,
                order_index=1,
                title="Module 1: What is Antarctic Sea Ice & Landfast Ice?",
                content_markdown="""# Understanding Antarctic Sea Ice

Antarctic sea ice forms through the freezing of ocean surface waters surrounding the Antarctic continent during the austral autumn and winter (March to September). Unlike the Arctic basin which is enclosed by continents, Antarctica is a landmass surrounded by open ocean, allowing the ice pack to expand unhindered to over **18 million km²** in winter.

### Fast Ice vs Drift Ice
- **Landfast Ice (Fast Ice):** Sea ice that remains fastened to the coastline, ice shelves, or grounded icebergs (e.g. around Bharati and Maitri stations).
- **Pack Ice / Drift Ice:** Free-floating sea ice driven by wind and ocean currents.

### Primary Measurement Methods
1. **Satellite Radar & Laser Altimetry (e.g. CryoSat-2 SIRAL):** Measures the ice freeboard above the ocean surface.
2. **In-Situ Mechanical Coring & GPR:** Directly samples thickness and stratigraphy.""",
                linked_document_ids=[doc1.id, doc2.id],
                linked_claim_ids=[claim1.id, claim2.id],
                quiz_questions=[
                    {
                        "question": "What is the primary difference between landfast ice and drift ice?",
                        "options": [
                            "Landfast ice is attached to coastal features or ice shelves, while drift ice is mobile and ocean-driven.",
                            "Landfast ice is formed exclusively from freshwater snow.",
                            "Drift ice only forms during the austral summer.",
                            "There is no physical difference."
                        ],
                        "correct_answer": 0,
                        "explanation": "Landfast ice is mechanically anchored to the continental shoreline, shoals, or grounded icebergs, whereas pack/drift ice moves dynamically with currents."
                    }
                ]
            ),
            LearningModule(
                learning_path_id=lp1.id,
                order_index=2,
                title="Module 2: How Do Scientists Evaluate Potential Disagreements?",
                content_markdown="""# Contextual Variables in Polar Science

When two scientific publications report seemingly contrasting trends (for example, sea ice decreasing in one paper and increasing in another), scientific integrity requires us **NOT** to jump to declaring one paper 'wrong'.

### The POLARIS Evidence Framework
In polar research, apparent discrepancies are frequently explained by five contextual dimensions:
1. **Location / Spatial Domain:** The Weddell Sea (West Antarctica) experiences different atmospheric wave patterns compared to Prydz Bay (East Antarctica).
2. **Observation Period:** A study from 2010–2020 captures different decadal phases than a 2012–2022 survey.
3. **Seasonality:** Austral winter freeze dynamics differ fundamentally from summer melt.
4. **Methodological Resolution:** Satellite radar altimetry averages over kilometer-scale footprints, while physical ice core drilling measures centimeters.
5. **Instrument Sensitivity & Calibration.**

By running the **POLARIS Evidence Stress-Test**, researchers isolate which variable provides the strongest explanatory power.""",
                linked_document_ids=[doc1.id, doc2.id],
                linked_claim_ids=[claim1.id, claim2.id],
                quiz_questions=[
                    {
                        "question": "Why might two peer-reviewed studies find contrasting sea-ice thickness trends in Antarctica?",
                        "options": [
                            "They investigate different geographic sectors (e.g. Weddell Sea vs Prydz Bay) and use different observation windows.",
                            "Satellite sensors are never scientifically valid.",
                            "Only one paper is accepted by MoES.",
                            "Cryospheric physics varies randomly every month."
                        ],
                        "correct_answer": 0,
                        "explanation": "Antarctica has regional climate regimes. Opposing trends frequently reflect real regional atmospheric and oceanic differences rather than errors."
                    }
                ]
            )
        ]
        session.add_all(modules)
        await session.flush()

        # 11. Activity Events
        events = [
            ActivityEvent(
                event_type="DOCUMENT_INDEXED",
                actor_name="NCPOR Ingestion Pipeline",
                target_type="DOCUMENT",
                target_id=doc1.id,
                target_title=doc1.title,
                details={"status": "VERIFIED", "claims_extracted": 1, "sha256": doc1.file_hash_sha256[:16]}
            ),
            ActivityEvent(
                event_type="EVIDENCE_VERIFIED",
                actor_name="Dr. Rahul Dey (Reviewer)",
                target_type="CLAIM",
                target_id=claim1.id,
                target_title="Antarctic Sea Ice Thickness Reduction Claim",
                details={"decision": "ACCEPTED", "confidence": "HIGH"}
            ),
            ActivityEvent(
                event_type="COMPARISON_STRESSED",
                actor_name="POLARIS Stress-Test Engine",
                target_type="STRESS_TEST",
                target_id=stress_test1.id,
                target_title="Weddell Sea vs Prydz Bay Sea Ice Sensitivity Analysis",
                details={"dominant_variable": "LOCATION", "dataset_linked": ds1.code}
            )
        ]
        session.add_all(events)

        # 12. Audit Logs
        audit = AuditLog(
            user_id=users[0].id,
            action="INITIALIZE_SEED_SYSTEM",
            resource="DATABASE",
            ip_address="127.0.0.1",
            status="SUCCESS",
            details="Seeded baseline verified NCPOR/MoES polar research datasets, stations, and claims."
        )
        session.add(audit)

        await session.commit()
        print("POLARIS-Ω database successfully seeded with verified polar evidence!")

if __name__ == "__main__":
    asyncio.run(seed_database())
