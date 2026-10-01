from typing import Dict, Any, Tuple
from app.models.models import Claim

class ComparisonService:
    """
    Evaluates multi-variable contextual compatibility between scientific claims.
    Computes inspectable POLARIS comparison heuristic without making ungrounded authority claims.
    """

    # Transparent weights for POLARIS comparison heuristic
    WEIGHTS = {
        "variable_alignment": 0.25,
        "spatial_proximity": 0.25,
        "temporal_overlap": 0.20,
        "methodological_alignment": 0.15,
        "seasonal_alignment": 0.15,
    }

    def compare_claims(self, claim_a: Claim, claim_b: Claim) -> Dict[str, Any]:
        # 1. Location match
        loc_score = 0.0
        loc_match = "DIFFERENT"
        if claim_a.location.lower() == claim_b.location.lower():
            loc_score = 1.0
            loc_match = "EXACT"
        elif claim_a.latitude and claim_b.latitude and claim_a.longitude and claim_b.longitude:
            dist = ((claim_a.latitude - claim_b.latitude)**2 + (claim_a.longitude - claim_b.longitude)**2)**0.5
            if dist < 3.0:
                loc_score = 0.8
                loc_match = "OVERLAPPING"
            elif dist < 8.0:
                loc_score = 0.4
                loc_match = "PROXIMAL"
            else:
                loc_score = 0.0
                loc_match = "DIFFERENT"

        # 2. Temporal Period match
        temp_score = 0.0
        period_match = "DISJOINT"
        if claim_a.time_start and claim_a.time_end and claim_b.time_start and claim_b.time_end:
            overlap_start = max(claim_a.time_start, claim_b.time_start)
            overlap_end = min(claim_a.time_end, claim_b.time_end)
            if overlap_start <= overlap_end:
                overlap_len = (overlap_end - overlap_start) + 1
                span_a = (claim_a.time_end - claim_a.time_start) + 1
                span_b = (claim_b.time_end - claim_b.time_start) + 1
                temp_score = min(1.0, overlap_len / max(span_a, span_b))
                if temp_score >= 0.8:
                    period_match = "EXACT"
                else:
                    period_match = "PARTIAL"
            else:
                gap = overlap_start - overlap_end
                temp_score = max(0.0, 1.0 - (gap / 10.0))
                period_match = "DISJOINT"
        else:
            temp_score = 0.5
            period_match = "UNKNOWN"

        # 3. Season match
        season_score = 0.5
        season_match = "UNKNOWN"
        if claim_a.season and claim_b.season:
            if claim_a.season.lower() == claim_b.season.lower():
                season_score = 1.0
                season_match = "EXACT"
            elif "annual" in claim_a.season.lower() or "annual" in claim_b.season.lower():
                season_score = 0.6
                season_match = "COMPARABLE"
            else:
                season_score = 0.1
                season_match = "DIFFERENT"

        # 4. Method & Instrument match
        method_score = 0.3
        method_match = "DIFFERENT"
        if claim_a.method and claim_b.method:
            if claim_a.method.lower() == claim_b.method.lower():
                method_score = 1.0
                method_match = "EXACT"
            elif any(w in claim_b.method.lower() for w in claim_a.method.lower().split()):
                method_score = 0.6
                method_match = "SIMILAR"

        inst_match = "SIMILAR" if method_score > 0.5 else "DIFFERENT"

        # 5. Direction & Disagreement Analysis
        direction_a = (claim_a.direction or "STABLE").upper()
        direction_b = (claim_b.direction or "STABLE").upper()
        
        has_directional_contrast = False
        if (direction_a == "DECREASE" and direction_b == "INCREASE") or (direction_a == "INCREASE" and direction_b == "DECREASE"):
            has_directional_contrast = True

        # Calculate POLARIS Comparison Heuristic (0 to 100)
        variable_score = 1.0 if claim_a.subject.lower() == claim_b.subject.lower() else 0.7
        
        raw_heuristic = (
            self.WEIGHTS["variable_alignment"] * variable_score +
            self.WEIGHTS["spatial_proximity"] * loc_score +
            self.WEIGHTS["temporal_overlap"] * temp_score +
            self.WEIGHTS["methodological_alignment"] * method_score +
            self.WEIGHTS["seasonal_alignment"] * season_score
        ) * 100.0

        polaris_heuristic_score = round(float(raw_heuristic), 1)

        # Potential Disagreement Level
        if has_directional_contrast:
            if loc_match == "EXACT" and period_match == "EXACT":
                potential_disagreement = "HIGH"
                explanation = "Direct contextual collision: Both claims investigate the identical location and time window with contrasting trend directions. Potential methodological calibration or sampling resolution variance."
            elif loc_match in ["OVERLAPPING", "PROXIMAL"] or period_match == "PARTIAL":
                potential_disagreement = "MEDIUM"
                explanation = f"Apparent disagreement likely moderated by contextual variation: {claim_a.location} vs {claim_b.location}, with {period_match.lower()} temporal overlap ({claim_a.time_start}-{claim_a.time_end} vs {claim_b.time_start}-{claim_b.time_end}) using {claim_a.method} vs {claim_b.method}."
            else:
                potential_disagreement = "LOW"
                explanation = f"Findings differ primarily due to disjoint geographic or temporal coverage ({claim_a.location} vs {claim_b.location}). Not in direct conflict."
        else:
            potential_disagreement = "COMPATIBLE"
            explanation = "Findings exhibit concordant trend directions across investigated polar sectors."

        title = f"Evidence Comparison: {claim_a.subject} ({claim_a.location} vs {claim_b.location})"

        score_breakdown = {
            "weights": self.WEIGHTS,
            "components": {
                "variable_alignment": round(variable_score * 100, 1),
                "spatial_proximity": round(loc_score * 100, 1),
                "temporal_overlap": round(temp_score * 100, 1),
                "methodological_alignment": round(method_score * 100, 1),
                "seasonal_alignment": round(season_score * 100, 1)
            },
            "formula": "sum(weight_i * component_score_i)",
            "disclaimer": "POLARIS Comparison Heuristic provides transparent multi-attribute compatibility metrics. It is an evidentiary assistance heuristic, not an absolute proof of causation."
        }

        return {
            "title": title,
            "topic": claim_a.subject,
            "variable": "Environmental Trend Direction",
            "potential_disagreement": potential_disagreement,
            "location_match": loc_match,
            "period_match": period_match,
            "season_match": season_match,
            "method_match": method_match,
            "instrument_match": inst_match,
            "contextual_explanation": explanation,
            "polaris_heuristic_score": polaris_heuristic_score,
            "score_breakdown": score_breakdown,
        }

comparison_service = ComparisonService()
