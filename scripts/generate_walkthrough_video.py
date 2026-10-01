import os
import cv2
import numpy as np
from PIL import Image, ImageDraw, ImageFont

# Set up output parameters
OUTPUT_FILE = "polaris_walkthrough_demo.mp4"
WIDTH = 1280
HEIGHT = 720
FPS = 30

# Colors (Hex to RGB/BGR)
BG_COLOR = (11, 14, 18)          # #0B0E12 Slate Dark
CARD_BG = (22, 27, 34)          # #161B22 Card Background
CARD_BORDER = (48, 54, 61)      # #30363D Border
AURORA_EMERALD = (16, 185, 129) # #10B981 Emerald
AURORA_CYAN = (56, 189, 248)    # #38BDF8 Cyan
POLAR_OCHRE = (217, 119, 6)     # #D97706 Ochre
TEXT_WHITE = (240, 246, 252)    # #F0F6FC
TEXT_MUTED = (139, 148, 158)    # #8B949E
TEXT_SUBTLE = (90, 100, 115)
ACCENT_BLUE = (30, 58, 138)
ACCENT_GREEN = (6, 78, 59)

def get_font(size=20, bold=False):
    # Try Windows system fonts
    font_paths = [
        "C:/Windows/Fonts/segoeui.ttf" if not bold else "C:/Windows/Fonts/segoeuib.ttf",
        "C:/Windows/Fonts/arial.ttf" if not bold else "C:/Windows/Fonts/arialbd.ttf",
        "C:/Windows/Fonts/calibri.ttf" if not bold else "C:/Windows/Fonts/calibrib.ttf"
    ]
    for path in font_paths:
        if os.path.exists(path):
            try:
                return ImageFont.truetype(path, size)
            except Exception:
                pass
    return ImageFont.load_default()

font_title = get_font(34, bold=True)
font_subtitle = get_font(22, bold=True)
font_body = get_font(16, bold=False)
font_body_bold = get_font(16, bold=True)
font_small = get_font(13, bold=False)
font_tag = get_font(12, bold=True)

def create_base_canvas():
    img = Image.new('RGB', (WIDTH, HEIGHT), BG_COLOR)
    draw = ImageDraw.Draw(img)
    
    # Top navigation bar
    draw.rectangle([(0, 0), (WIDTH, 56)], fill=(18, 22, 27))
    draw.line([(0, 56), (WIDTH, 56)], fill=(35, 42, 50), width=1)
    
    # Logo & Title
    draw.rectangle([(24, 14), (52, 42)], fill=(16, 185, 129), outline=(52, 211, 153))
    draw.text((31, 17), "Ω", fill=(255, 255, 255), font=get_font(20, bold=True))
    draw.text((64, 18), "POLARIS-Ω", fill=TEXT_WHITE, font=get_font(18, bold=True))
    draw.text((180, 20), "|  National Centre for Polar and Ocean Research (NCPOR / MoES)", fill=TEXT_MUTED, font=get_font(13))
    
    # Top right status badges
    draw.rounded_rectangle([(WIDTH - 380, 14), (WIDTH - 240, 42)], radius=4, fill=(10, 40, 30), outline=AURORA_EMERALD)
    draw.ellipse([(WIDTH - 368, 24), (WIDTH - 360, 32)], fill=AURORA_EMERALD)
    draw.text((WIDTH - 350, 20), "TELEMETRY: LIVE", fill=AURORA_EMERALD, font=font_tag)
    
    draw.rounded_rectangle([(WIDTH - 225, 14), (WIDTH - 24, 42)], radius=4, fill=(26, 32, 40), outline=CARD_BORDER)
    draw.text((WIDTH - 210, 20), "SIH2026: SIH26063", fill=AURORA_CYAN, font=font_tag)
    
    # Bottom footer bar
    draw.rectangle([(0, HEIGHT - 32), (WIDTH, HEIGHT)], fill=(14, 18, 23))
    draw.line([(0, HEIGHT - 32), (WIDTH, HEIGHT - 32)], fill=(30, 36, 44), width=1)
    draw.text((24, HEIGHT - 24), "POLARIS-Ω Scientific Evidence Intelligence  •  Ministry of Earth Sciences  •  FAIR Data Compliant", fill=TEXT_MUTED, font=font_small)
    draw.text((WIDTH - 260, HEIGHT - 24), "SHA-256 Provenance & Cryptographic Lineage", fill=AURORA_EMERALD, font=font_small)
    
    return img, draw

def render_scene_title():
    img, draw = create_base_canvas()
    
    # Hero Title Box
    draw.rounded_rectangle([(160, 110), (WIDTH - 160, HEIGHT - 100)], radius=12, fill=CARD_BG, outline=(50, 60, 75), width=2)
    
    # Header badge
    draw.rounded_rectangle([(WIDTH//2 - 190, 135), (WIDTH//2 + 190, 165)], radius=6, fill=(15, 35, 45), outline=AURORA_CYAN)
    draw.text((WIDTH//2 - 170, 142), "SMART INDIA HACKATHON 2026  •  SIH26063", fill=AURORA_CYAN, font=font_tag)
    
    draw.text((WIDTH//2 - 270, 185), "POLARIS-Ω PORTAL WALKTHROUGH", fill=TEXT_WHITE, font=font_title)
    draw.text((WIDTH//2 - 340, 230), "Integrated Polar Science Outreach, Knowledge Repository & Evidence Dissemination", fill=AURORA_EMERALD, font=font_subtitle)
    
    # Highlights 3-column cards
    cards = [
        ("KNOWLEDGE REPOSITORY", "Cryptographically verifiable expedition reports, ice core logs, CTD profiles with SHA-256 integrity checks.", AURORA_CYAN),
        ("STRESS-TEST ENGINE", "First-of-its-kind counterfactual simulator for resolving scientific disagreements across polar climate models.", AURORA_EMERALD),
        ("OUTREACH & EDUCATION", "Multi-channel automated social dissemination (X, LinkedIn, Press) + interactive Polar Learning Hub.", POLAR_OCHRE)
    ]
    
    for i, (title, desc, color) in enumerate(cards):
        cx = 200 + i * 295
        cy = 285
        cw = 275
        ch = 200
        draw.rounded_rectangle([(cx, cy), (cx + cw, cy + ch)], radius=8, fill=(16, 20, 26), outline=color, width=1)
        draw.rounded_rectangle([(cx + 12, cy + 12), (cx + cw - 12, cy + 42)], radius=4, fill=(24, 30, 38))
        draw.text((cx + 20, cy + 18), title, fill=color, font=font_body_bold)
        
        # Word wrap desc
        words = desc.split()
        lines = []
        cur = ""
        for w in words:
            if len(cur + " " + w) < 30:
                cur += " " + w
            else:
                lines.append(cur)
                cur = w
        if cur:
            lines.append(cur)
            
        for li, line in enumerate(lines[:5]):
            draw.text((cx + 16, cy + 55 + li * 22), line, fill=TEXT_WHITE, font=font_body)
            
    draw.rounded_rectangle([(WIDTH//2 - 220, 520), (WIDTH//2 + 220, 555)], radius=6, fill=(12, 36, 28), outline=AURORA_EMERALD)
    draw.text((WIDTH//2 - 200, 528), "Organizations: MoES  •  NCPOR  •  Antarctic, Arctic & Himalayas", fill=AURORA_EMERALD, font=font_body_bold)
    
    return img

def render_scene_hero():
    img, draw = create_base_canvas()
    
    draw.text((40, 75), "1. LIVE POLAR COMMAND DASHBOARD", fill=TEXT_WHITE, font=font_title)
    draw.text((40, 115), "Real-time observational telemetry from India's permanent polar stations & cryospheric observation arrays", fill=TEXT_MUTED, font=font_body)
    
    # 4 Station Cards
    stations = [
        ("BHARATI STATION", "East Antarctica (69°24'S, 76°11'E)", "-14.2°C", "Wind: 28 kt SW", "Active Expedition: ISEA-43", AURORA_CYAN),
        ("MAITRI STATION", "Schirmacher Oasis (70°46'S, 11°44'E)", "-18.6°C", "Wind: 19 kt S", "Continuous presence since 1989", AURORA_EMERALD),
        ("HIMADRI STATION", "Ny-Ålesund, Svalbard (78°55'N, 11°56'E)", "-4.1°C", "Wind: 12 kt NNE", "Atmospheric & Marine Physics", POLAR_OCHRE),
        ("IndARC OBSERVATORY", "Kongsfjorden Mooring (Depth: 200m)", "-1.8°C", "Salinity: 34.8 PSU", "India's 1st Underwater Moored Obs", (168, 85, 247))
    ]
    
    for i, (name, loc, temp, metric, note, color) in enumerate(stations):
        x = 40 + i * 295
        y = 155
        w = 280
        h = 240
        draw.rounded_rectangle([(x, y), (x + w, y + h)], radius=8, fill=CARD_BG, outline=CARD_BORDER, width=1)
        draw.rectangle([(x, y), (x + w, y + 6)], fill=color)
        
        draw.text((x + 16, y + 20), name, fill=color, font=font_subtitle)
        draw.text((x + 16, y + 48), loc, fill=TEXT_MUTED, font=font_small)
        
        # Temp big
        draw.text((x + 16, y + 78), temp, fill=TEXT_WHITE, font=get_font(28, bold=True))
        draw.text((x + 16, y + 125), metric, fill=AURORA_CYAN, font=font_body_bold)
        
        draw.rounded_rectangle([(x + 12, y + 165), (x + w - 12, y + 225)], radius=4, fill=(16, 20, 26))
        draw.text((x + 20, y + 182), note, fill=TEXT_MUTED, font=font_small)

    # Bottom metrics summary
    draw.rounded_rectangle([(40, 420), (WIDTH - 40, HEIGHT - 50)], radius=8, fill=(16, 20, 26), outline=CARD_BORDER)
    draw.text((60, 435), "REPOSITORY TELEMETRY & SYSTEM HEALTH", fill=AURORA_EMERALD, font=font_subtitle)
    
    metrics = [
        ("43+", "Indian Antarctic Expeditions"),
        ("17+", "Arctic Expeditions"),
        ("100%", "SHA-256 Verified Rate"),
        ("1,450+", "Processed Scientific Claims"),
        ("0.91", "Evidence Disagreement F1 Score")
    ]
    for mi, (val, lbl) in enumerate(metrics):
        mx = 60 + mi * 235
        draw.text((mx, 475), val, fill=TEXT_WHITE, font=get_font(26, bold=True))
        draw.text((mx, 515), lbl, fill=TEXT_MUTED, font=font_small)
        
    return img

def render_scene_repository():
    img, draw = create_base_canvas()
    
    draw.text((40, 75), "2. DIGITAL KNOWLEDGE REPOSITORY & CRYPTOGRAPHIC LEDGER", fill=TEXT_WHITE, font=font_title)
    draw.text((40, 115), "FAIR-compliant indexing of polar reports, ice core borehole logs, and satellite altimetry datasets", fill=TEXT_MUTED, font=font_body)
    
    # Left Filter Sidebar Mockup
    draw.rounded_rectangle([(40, 150), (300, HEIGHT - 50)], radius=8, fill=CARD_BG, outline=CARD_BORDER)
    draw.text((56, 168), "FACETED SEARCH FILTERS", fill=AURORA_CYAN, font=font_body_bold)
    
    filters = [
        ("DOMAIN", ["Glaciology", "Oceanography", "Atmospheric", "Space Weather"]),
        ("REGION", ["East Antarctica", "Svalbard", "Himalayas", "Southern Ocean"]),
        ("TIME PERIOD", ["1981 - 1990", "1991 - 2005", "2006 - 2020", "2021 - Present"]),
        ("INTEGRITY", ["SHA-256 Validated (100%)", "W3C PROV Linked"])
    ]
    fy = 200
    for category, items in filters:
        draw.text((56, fy), category, fill=TEXT_WHITE, font=font_body_bold)
        fy += 22
        for item in items:
            draw.rectangle([(56, fy + 4), (66, fy + 14)], fill=(30, 40, 50), outline=AURORA_EMERALD)
            draw.text((74, fy), item, fill=TEXT_MUTED, font=font_small)
            fy += 20
        fy += 10

    # Right Documents Table Mockup
    draw.rounded_rectangle([(320, 150), (WIDTH - 40, HEIGHT - 50)], radius=8, fill=CARD_BG, outline=CARD_BORDER)
    draw.text((340, 168), "VERIFIED POLAR SCIENCE DOCUMENTS", fill=TEXT_WHITE, font=font_subtitle)
    
    docs = [
        ("ISEA-43 Scientific Report: Glaciological & Altimetry Campaign", "East Antarctica", "2024", "SHA-256: 7f8a92...b3c4", "14 Claims Extracted", AURORA_EMERALD),
        ("IndARC Mooring CTD Time Series: Kongsfjorden Hydrography", "Svalbard Arctic", "2023", "SHA-256: 3a1c89...e5f2", "22 Claims Extracted", AURORA_CYAN),
        ("Bara Shigri Glacier Mass Balance & Terminus Retreat", "Himalaya (Chandra)", "2022", "SHA-256: d4e671...99a1", "9 Claims Extracted", POLAR_OCHRE),
        ("Prydz Bay Sea Ice Dynamics & CryoSat-2 Altimetry Calibration", "Antarctica (Larsemann)", "2023", "SHA-256: 88b1f0...2c7d", "18 Claims Extracted", AURORA_EMERALD),
        ("Geomagnetic Pulsation Observations at Maitri Station", "Schirmacher Oasis", "2021", "SHA-256: 55ca33...00b8", "12 Claims Extracted", AURORA_CYAN)
    ]
    
    dy = 205
    for title, loc, yr, sha, claims, col in docs:
        draw.rounded_rectangle([(340, dy), (WIDTH - 55, dy + 70)], radius=6, fill=(14, 18, 24), outline=(35, 42, 50))
        draw.text((355, dy + 10), title, fill=TEXT_WHITE, font=font_body_bold)
        draw.text((355, dy + 38), f"Location: {loc}  |  Year: {yr}", fill=TEXT_MUTED, font=font_small)
        
        # SHA badge
        draw.rounded_rectangle([(WIDTH - 380, dy + 35), (WIDTH - 200, dy + 58)], radius=4, fill=(10, 30, 20), outline=col)
        draw.text((WIDTH - 370, dy + 40), sha, fill=col, font=font_tag)
        
        # Claims badge
        draw.rounded_rectangle([(WIDTH - 190, dy + 35), (WIDTH - 70, dy + 58)], radius=4, fill=(20, 30, 45), outline=AURORA_CYAN)
        draw.text((WIDTH - 180, dy + 40), claims, fill=AURORA_CYAN, font=font_tag)
        
        dy += 80

    return img

def render_scene_claims():
    img, draw = create_base_canvas()
    
    draw.text((40, 75), "3. SCIENTIFIC CLAIM EXTRACTION & PROVENANCE GRAPH", fill=TEXT_WHITE, font=font_title)
    draw.text((40, 115), "Automatic entity extraction of variables, directionality, temporal bounds, and primary methodology", fill=TEXT_MUTED, font=font_body)
    
    claims = [
        ("Antarctic Sea Ice Extent Decreasing in Prydz Bay", "DECREASING (-2.1% / decade)", "Prydz Bay / Larsemann Hills", "1981 - 2023", "Satellite Altimetry + Mooring", 0.94, AURORA_EMERALD),
        ("Intermediate Atlantic Water Warming in Kongsfjorden", "INCREASING (+0.9°C)", "Kongsfjorden (Svalbard)", "2012 - 2022", "IndARC CTD Mooring", 0.96, AURORA_CYAN),
        ("Bara Shigri Glacier Terminus Retreat Rate", "DECREASING (-18 m / year)", "Chandra Basin (Himalaya)", "2002 - 2023", "dGPS + Differential InSAR", 0.91, POLAR_OCHRE)
    ]
    
    cy = 150
    for title, direction, loc, timeb, method, conf, col in claims:
        draw.rounded_rectangle([(40, cy), (WIDTH - 40, cy + 155)], radius=8, fill=CARD_BG, outline=CARD_BORDER)
        draw.rectangle([(40, cy), (48, cy + 155)], fill=col)
        
        draw.text((65, cy + 15), title, fill=TEXT_WHITE, font=font_subtitle)
        
        # Direction badge
        draw.rounded_rectangle([(WIDTH - 280, cy + 15), (WIDTH - 60, cy + 45)], radius=4, fill=(15, 30, 25), outline=col)
        draw.text((WIDTH - 265, cy + 22), direction, fill=col, font=font_body_bold)
        
        # Attributes grid
        draw.text((65, cy + 55), "LOCATION:", fill=TEXT_MUTED, font=font_body_bold)
        draw.text((160, cy + 55), loc, fill=TEXT_WHITE, font=font_body)
        
        draw.text((65, cy + 82), "TIME BOUND:", fill=TEXT_MUTED, font=font_body_bold)
        draw.text((160, cy + 82), timeb, fill=TEXT_WHITE, font=font_body)
        
        draw.text((65, cy + 110), "METHODOLOGY:", fill=TEXT_MUTED, font=font_body_bold)
        draw.text((180, cy + 110), method, fill=AURORA_CYAN, font=font_body)
        
        draw.text((WIDTH - 280, cy + 75), f"AI Confidence: {int(conf*100)}%", fill=TEXT_MUTED, font=font_small)
        draw.rounded_rectangle([(WIDTH - 280, cy + 95), (WIDTH - 60, cy + 110)], radius=3, fill=(30, 36, 45))
        draw.rounded_rectangle([(WIDTH - 280, cy + 95), (WIDTH - 280 + int(220 * conf), cy + 110)], radius=3, fill=col)
        
        cy += 175

    return img

def render_scene_stress_test():
    img, draw = create_base_canvas()
    
    draw.text((40, 75), "4. ⭐ SIGNATURE: EVIDENCE STRESS-TEST & SENSITIVITY ENGINE", fill=AURORA_EMERALD, font=font_title)
    draw.text((40, 115), "Counterfactual simulation answering: 'Under what contextual conditions do polar findings diverge?'", fill=TEXT_WHITE, font=font_body)
    
    # Comparison header
    draw.rounded_rectangle([(40, 150), (WIDTH - 40, 225)], radius=8, fill=(18, 24, 32), outline=AURORA_CYAN)
    draw.text((60, 162), "COMPARING CLAIM A (ISEA-42 Altimetry) vs CLAIM B (Mooring Hydrography)", fill=AURORA_CYAN, font=font_subtitle)
    draw.text((60, 192), "Finding: 87% Disagreement Explained by Spatial Heterogeneity & Seasonality (Not Methodology)", fill=TEXT_WHITE, font=font_body)
    
    # 4 Sensitivity Bars
    draw.rounded_rectangle([(40, 240), (WIDTH - 40, 480)], radius=8, fill=CARD_BG, outline=CARD_BORDER)
    draw.text((60, 255), "CONTEXTUAL SENSITIVITY ATTRIBUTION RANKING", fill=TEXT_WHITE, font=font_subtitle)
    
    sensitivities = [
        ("LOCATION / SPATIAL DOMAIN (Prydz Bay vs Weddell Sea)", 0.92, "Dominant Factor: Strong regional wind-driven circulation variance", AURORA_EMERALD),
        ("OBSERVATION SEASON (Austral Summer vs Winter)", 0.78, "Secondary Factor: Rapid melt cycles during December-February", AURORA_CYAN),
        ("TIME PERIOD BASELINE (1981-2000 vs 2001-2023)", 0.45, "Moderate Shift: Long-term multi-decadal oscillation trend", POLAR_OCHRE),
        ("MEASUREMENT METHOD (Satellite Altimetry vs In-situ CTD)", 0.12, "Low Impact: Methodological bias is negligible across instruments", (148, 163, 184))
    ]
    
    sy = 295
    for label, score, explanation, col in sensitivities:
        draw.text((60, sy), label, fill=TEXT_WHITE, font=font_body_bold)
        draw.text((WIDTH - 160, sy), f"Impact: {int(score*100)}%", fill=col, font=font_body_bold)
        
        # Progress bar
        draw.rounded_rectangle([(60, sy + 22), (WIDTH - 60, sy + 34)], radius=4, fill=(25, 30, 40))
        draw.rounded_rectangle([(60, sy + 22), (60 + int((WIDTH - 120) * score), sy + 34)], radius=4, fill=col)
        
        draw.text((60, sy + 38), explanation, fill=TEXT_MUTED, font=font_small)
        sy += 65

    # Evidence Gap Box
    draw.rounded_rectangle([(40, 495), (WIDTH - 40, HEIGHT - 45)], radius=8, fill=(15, 30, 25), outline=AURORA_EMERALD)
    draw.text((60, 508), "RESOLVING EVIDENCE GAPS WITH EXISTING NCPOR DATASETS", fill=AURORA_EMERALD, font=font_body_bold)
    draw.text((60, 532), "Identified Missing Variable: Winter Sub-Surface Salinity Gradient in Prydz Bay (Missing 2018-2021).", fill=TEXT_WHITE, font=font_small)
    draw.text((60, 552), "Resolution: NCPOR IndARC Mooring dataset #DS-2022-ARC contains continuous year-round profiles that resolve 91% of the model uncertainty.", fill=AURORA_CYAN, font=font_small)

    return img

def render_scene_map():
    img, draw = create_base_canvas()
    
    draw.text((40, 75), "5. GEOSPATIAL MAP EXPLORER & POLAR RESEARCH STATIONS", fill=TEXT_WHITE, font=font_title)
    draw.text((40, 115), "Interactive 3D coordinates & historical station coverage across Arctic, Antarctic & Third Pole", fill=TEXT_MUTED, font=font_body)
    
    # Map area mockup with styled grid lines
    draw.rounded_rectangle([(40, 150), (WIDTH - 40, HEIGHT - 50)], radius=8, fill=(10, 14, 20), outline=CARD_BORDER)
    
    # Grid lines
    for gy in range(180, HEIGHT - 60, 60):
        draw.line([(60, gy), (WIDTH - 60, gy)], fill=(20, 28, 38), width=1)
    for gx in range(100, WIDTH - 60, 120):
        draw.line([(gx, 160), (gx, HEIGHT - 60)], fill=(20, 28, 38), width=1)
        
    # Antarctica Continent stylized contour & Stations
    stations = [
        ("MAITRI (1989)", 400, 480, AURORA_EMERALD, "Schirmacher Oasis\n70°46'S, 11°44'E"),
        ("BHARATI (2012)", 780, 510, AURORA_CYAN, "Larsemann Hills\n69°24'S, 76°11'E"),
        ("DAKSHIN GANGOTRI (1983)", 350, 440, (148, 163, 184), "Historical Base\n70°05'S, 12°00'E"),
        ("HIMADRI (2008)", 580, 230, POLAR_OCHRE, "Ny-Ålesund, Svalbard\n78°55'N, 11°56'E"),
        ("HIMANSH (2016)", 680, 310, (168, 85, 247), "Chandra Basin, Himalaya\n32°24'N, 77°37'E")
    ]
    
    for name, sx, sy, col, details in stations:
        draw.ellipse([(sx - 8, sy - 8), (sx + 8, sy + 8)], fill=col, outline=(255, 255, 255))
        draw.ellipse([(sx - 16, sy - 16), (sx + 16, sy + 16)], outline=col, width=1)
        
        # Info box
        draw.rounded_rectangle([(sx + 15, sy - 25), (sx + 240, sy + 40)], radius=6, fill=(18, 24, 32), outline=col)
        draw.text((sx + 25, sy - 20), name, fill=col, font=font_body_bold)
        
        for li, ltext in enumerate(details.split('\n')):
            draw.text((sx + 25, sy + 2 + li * 16), ltext, fill=TEXT_MUTED, font=font_small)

    return img

def render_scene_timeline_rediscovery():
    img, draw = create_base_canvas()
    
    draw.text((40, 75), "6. TEMPORAL TIMELINE & HISTORICAL REDISCOVERY MATRIX", fill=TEXT_WHITE, font=font_title)
    draw.text((40, 115), "Unlocking forgotten 1980s-90s Indian expedition data by connecting them to modern satellite sensors", fill=TEXT_MUTED, font=font_body)
    
    # Left: Timeline
    draw.rounded_rectangle([(40, 150), (600, HEIGHT - 50)], radius=8, fill=CARD_BG, outline=CARD_BORDER)
    draw.text((60, 168), "POLAR EXPEDITION TIMELINE (1981 - 2026)", fill=AURORA_CYAN, font=font_subtitle)
    
    events = [
        ("1981", "1st Indian Antarctic Expedition (Dr. S.Z. Qasim)"),
        ("1983", "Dakshin Gangotri Station Established"),
        ("1989", "Maitri Research Station Commissioned"),
        ("2008", "Himadri Station Established in Arctic (Svalbard)"),
        ("2012", "Bharati Station Commissioned (Larsemann Hills)"),
        ("2014", "IndARC Underwater Moored Observatory Deployed"),
        ("2024", "43rd Indian Scientific Expedition (ISEA-43)"),
        ("2026", "POLARIS-Ω Living Scientific Evidence Platform")
    ]
    
    ty = 205
    for yr, text in events:
        draw.rounded_rectangle([(60, ty), (110, ty + 24)], radius=4, fill=(15, 35, 45), outline=AURORA_CYAN)
        draw.text((66, ty + 4), yr, fill=AURORA_CYAN, font=font_body_bold)
        draw.text((125, ty + 4), text, fill=TEXT_WHITE, font=font_small)
        ty += 38

    # Right: Rediscovery Matrix
    draw.rounded_rectangle([(630, 150), (WIDTH - 40, HEIGHT - 50)], radius=8, fill=CARD_BG, outline=CARD_BORDER)
    draw.text((650, 168), "HISTORICAL REDISCOVERY CANDIDATES", fill=AURORA_EMERALD, font=font_subtitle)
    
    candidates = [
        ("1984 Ice Shelf Thickness Logs vs ICESat-2 Altimetry", "Match Score: 94%", "Unlocks 40-year ice thinning trend previously thought lost in paper logs.", AURORA_EMERALD),
        ("1992 Schirmacher Oasis Lichen Survey vs Drone Multispectral", "Match Score: 89%", "Validates 30-year polar vegetation expansion under warming conditions.", AURORA_CYAN),
        ("2009 Himadri Aerosol Baseline vs Sentinel-5P Troposphere", "Match Score: 91%", "Bridges ground optical depth measurements to European satellite passes.", POLAR_OCHRE)
    ]
    
    cy = 210
    for title, score, desc, col in candidates:
        draw.rounded_rectangle([(650, cy), (WIDTH - 60, cy + 105)], radius=6, fill=(14, 18, 24), outline=(35, 45, 55))
        draw.text((665, cy + 10), title, fill=TEXT_WHITE, font=font_body_bold)
        
        draw.rounded_rectangle([(WIDTH - 210, cy + 10), (WIDTH - 80, cy + 32)], radius=4, fill=(10, 30, 20), outline=col)
        draw.text((WIDTH - 200, cy + 14), score, fill=col, font=font_tag)
        
        draw.text((665, cy + 45), desc, fill=TEXT_MUTED, font=font_small)
        cy += 120

    return img

def render_scene_outreach():
    img, draw = create_base_canvas()
    
    draw.text((40, 75), "7. AUTOMATED MEDIA & SOCIAL CONTENT DISSEMINATION", fill=TEXT_WHITE, font=font_title)
    draw.text((40, 115), "AI-powered dissemination generating validated content for X/Twitter, LinkedIn, Instagram, & Press", fill=TEXT_MUTED, font=font_body)
    
    # 3 Social Mockups
    posts = [
        ("X / TWITTER POST", "📡 #PolarScience Update from @NCPOR_India\n\nISEA-42 expedition data reveals Antarctic sea-ice extent in Prydz Bay has decreased 2.1% decade⁻¹ (1981–2023) per CryoSat-2 altimetry calibration.\n\nFull evidence chain at POLARIS-Ω 🧊\n#Antarctica #SeaIce #NCPOR #MoES", AURORA_CYAN),
        ("LINKEDIN EXPEDITION HIGHLIGHT", "🏔️ India's 43rd Scientific Expedition to Antarctica (ISEA-43) Concludes Summer Research:\n\n• 14 ice cores extracted from East Antarctic Ice Sheet\n• GPR traverse across 320 km route\n• Co-located CryoSat-2 validation campaign\n\nAll datasets archived with SHA-256 integrity.\n#India #Antarctica #PolarScience #NCPOR", AURORA_EMERALD),
        ("INSTAGRAM VISUAL STORY", "🌌 Aurora Australis over Maitri Research Station, Antarctica\n\nCaptured during a Kp-6 geomagnetic storm by our geomagnetism scientific team at Schirmacher Oasis.\n\nIndia has maintained continuous Antarctic scientific presence since 1981. 🇮🇳\n#Aurora #Maitri #NCPOR #IndianScience", (236, 72, 153))
    ]
    
    for i, (platform, content, col) in enumerate(posts):
        x = 40 + i * 395
        y = 150
        w = 380
        h = HEIGHT - 210
        draw.rounded_rectangle([(x, y), (x + w, y + h)], radius=8, fill=CARD_BG, outline=col, width=1)
        draw.rectangle([(x, y), (x + w, y + 36)], fill=(20, 26, 34))
        draw.text((x + 16, y + 10), platform, fill=col, font=font_body_bold)
        
        lines = content.split('\n')
        cy = y + 50
        for line in lines:
            if line.strip() == "":
                cy += 12
                continue
            draw.text((x + 16, cy), line, fill=TEXT_WHITE if not line.startswith('#') else col, font=font_small)
            cy += 20

    return img

def render_scene_learning_admin():
    img, draw = create_base_canvas()
    
    draw.text((40, 75), "8. SMART EDUCATION LEARNING HUB & ADMIN COMMAND CENTER", fill=TEXT_WHITE, font=font_title)
    draw.text((40, 115), "Interactive curriculum, quiz certification engine, and full RBAC audit trail for scientific reviewers", fill=TEXT_MUTED, font=font_body)
    
    # Left: Learning Hub
    draw.rounded_rectangle([(40, 150), (600, HEIGHT - 50)], radius=8, fill=CARD_BG, outline=CARD_BORDER)
    draw.text((60, 168), "INTERACTIVE POLAR SCIENCE LEARNING PATHS", fill=AURORA_CYAN, font=font_subtitle)
    
    modules = [
        ("Module 1: Fundamentals of Antarctic Glaciology", "Ice sheets vs Ice shelves, Accumulation & Mass balance", "Quiz Score: 100%", AURORA_EMERALD),
        ("Module 2: Arctic Oceanography & IndARC Mooring", "Atlantification, Thermohaline circulation & Salinity", "Quiz Score: 92%", AURORA_CYAN),
        ("Module 3: Paleoclimatology & Ice Core Analysis", "δ18O isotopes, Ancient CO2 trapped air bubbles", "In Progress", POLAR_OCHRE),
        ("Module 4: Himalayan Cryosphere & Water Security", "Glacial lake outburst floods (GLOF) & Monitoring", "Enrolled", (148, 163, 184))
    ]
    
    my = 210
    for title, desc, status, col in modules:
        draw.rounded_rectangle([(60, my), (580, my + 80)], radius=6, fill=(14, 18, 24), outline=(35, 45, 55))
        draw.text((75, my + 10), title, fill=TEXT_WHITE, font=font_body_bold)
        draw.text((75, my + 34), desc, fill=TEXT_MUTED, font=font_small)
        
        draw.rounded_rectangle([(440, my + 45), (565, my + 70)], radius=4, fill=(15, 30, 25), outline=col)
        draw.text((450, my + 50), status, fill=col, font=font_tag)
        my += 95

    # Right: Admin Dashboard
    draw.rounded_rectangle([(630, 150), (WIDTH - 40, HEIGHT - 50)], radius=8, fill=CARD_BG, outline=CARD_BORDER)
    draw.text((650, 168), "RBAC AUDIT TRAIL & REVIEWER CONSOLE", fill=AURORA_EMERALD, font=font_subtitle)
    
    logs = [
        ("Dr. Thamban Meloth (Director)", "Approved Dataset #DS-2024-ISEA43", "10:14 UTC", AURORA_EMERALD),
        ("Dr. Rahul Dey (Reviewer)", "Verified Claim #CLM-001 (Prydz Bay)", "09:42 UTC", AURORA_CYAN),
        ("System Automated Daemon", "SHA-256 Checksum Passed: 100% Valid", "09:00 UTC", AURORA_EMERALD),
        ("Dr. Parmanand Sharma", "Uploaded Chandra Basin LiDAR Survey", "08:15 UTC", POLAR_OCHRE)
    ]
    
    ly = 210
    for user, action, time, col in logs:
        draw.rounded_rectangle([(650, ly), (WIDTH - 60, ly + 65)], radius=6, fill=(14, 18, 24), outline=(35, 45, 55))
        draw.text((665, ly + 10), user, fill=col, font=font_body_bold)
        draw.text((665, ly + 35), action, fill=TEXT_WHITE, font=font_small)
        draw.text((WIDTH - 150, ly + 10), time, fill=TEXT_MUTED, font=font_small)
        ly += 80

    return img

def render_scene_conclusion():
    img, draw = create_base_canvas()
    
    draw.rounded_rectangle([(160, 100), (WIDTH - 160, HEIGHT - 80)], radius=12, fill=CARD_BG, outline=(50, 60, 75), width=2)
    
    draw.rounded_rectangle([(WIDTH//2 - 160, 130), (WIDTH//2 + 160, 160)], radius=6, fill=(15, 35, 45), outline=AURORA_CYAN)
    draw.text((WIDTH//2 - 140, 137), "SMART INDIA HACKATHON 2026", fill=AURORA_CYAN, font=font_tag)
    
    draw.text((WIDTH//2 - 180, 185), "POLARIS-Ω READY FOR DEPLOYMENT", fill=TEXT_WHITE, font=font_title)
    draw.text((WIDTH//2 - 270, 235), "Empowering India's Polar Research & Public Scientific Literacy", fill=AURORA_EMERALD, font=font_subtitle)
    
    summary_points = [
        "✓ 100% Cryptographic Traceability: SHA-256 integrity validation on all expedition datasets",
        "✓ First-in-Class Stress-Test Engine: Identifies source of scientific model disagreements",
        "✓ Complete Historical Integration: 1981 to 2026 expedition records searchable & connected",
        "✓ Multi-Channel Automated Dissemination: Ready for MoES / NCPOR public outreach",
        "✓ Interactive Smart Education Hub: Gamified quizzes & certified cryosphere curriculum"
    ]
    
    sy = 290
    for point in summary_points:
        draw.rounded_rectangle([(200, sy), (WIDTH - 200, sy + 40)], radius=6, fill=(14, 18, 24), outline=(35, 45, 55))
        draw.text((220, sy + 10), point, fill=TEXT_WHITE, font=font_body_bold)
        sy += 52

    draw.rounded_rectangle([(WIDTH//2 - 200, 560), (WIDTH//2 + 200, 600)], radius=6, fill=(10, 40, 30), outline=AURORA_EMERALD)
    draw.text((WIDTH//2 - 180, 570), "NCPOR  •  MoES  •  Govt. of India  •  SIH26063", fill=AURORA_EMERALD, font=font_body_bold)

    return img

def main():
    print(f"Generating walkthrough video: {OUTPUT_FILE} ({WIDTH}x{HEIGHT} @ {FPS}fps)...")

    scenes = [
        (render_scene_title, 3.5),
        (render_scene_hero, 4.0),
        (render_scene_repository, 4.0),
        (render_scene_claims, 4.0),
        (render_scene_stress_test, 4.5),
        (render_scene_map, 4.0),
        (render_scene_timeline_rediscovery, 4.0),
        (render_scene_outreach, 4.0),
        (render_scene_learning_admin, 4.0),
        (render_scene_conclusion, 3.5)
    ]

    fourcc = cv2.VideoWriter_fourcc(*'mp4v')
    out = cv2.VideoWriter(OUTPUT_FILE, fourcc, FPS, (WIDTH, HEIGHT))

    TRANSITION_FRAMES = 12

    prev_cv = None
    total = len(scenes)

    for idx, (render_func, duration) in enumerate(scenes):
        print(f"  Rendering scene {idx+1}/{total}: {render_func.__name__} ...")

        # Render PIL -> numpy BGR (only ONE frame in memory at a time)
        pil_img = render_func()
        curr_cv = cv2.cvtColor(np.array(pil_img), cv2.COLOR_RGB2BGR)

        # Cross-dissolve from previous scene
        if prev_cv is not None:
            for tf in range(TRANSITION_FRAMES):
                alpha = tf / float(TRANSITION_FRAMES)
                blended = cv2.addWeighted(prev_cv, 1.0 - alpha, curr_cv, alpha, 0)
                out.write(blended)
                del blended

        # Stable hold frames
        hold_frames = max(1, int(duration * FPS) - TRANSITION_FRAMES)
        for _ in range(hold_frames):
            out.write(curr_cv)

        # Keep current for next transition; release previous
        prev_cv = curr_cv

    out.release()
    size = os.path.getsize(OUTPUT_FILE)
    print(f"Done! {OUTPUT_FILE} ({size:,} bytes)")

if __name__ == "__main__":
    main()
