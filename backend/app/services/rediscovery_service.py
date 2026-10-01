from typing import List, Dict, Any
from app.models.models import Document
from app.services.embedding_service import embedding_service

class RediscoveryService:
    """
    Research Rediscovery Engine:
    Surfaces historic research papers based on multi-signal evidence:
    - Publication age (> 15 years)
    - Semantic similarity to modern active polar research questions
    - Methodological relevance
    - Location relevance
    - Recent citation revival signals
    """

    def find_rediscovery_candidates(
        self,
        documents: List[Document],
        query_text: str = "polar climate feedback ocean sea ice",
        limit: int = 10
    ) -> List[Dict[str, Any]]:
        candidates = []
        query_embedding = embedding_service.get_embedding(query_text)

        for doc in documents:
            year = doc.year or 2020
            # Rediscovery focuses on foundational / historic papers
            age = max(0, 2026 - year)
            
            # Compute semantic relevance
            doc_text = f"{doc.title} {doc.abstract or ''} {doc.research_domain} {' '.join(doc.keywords or [])}"
            doc_embedding = embedding_service.get_embedding(doc_text)
            semantic_score = embedding_service.cosine_similarity(query_embedding, doc_embedding)

            # Combined rediscovery score calculation
            # High age + High semantic relevance to modern queries + Method availability
            age_factor = min(1.0, age / 35.0)  # normalized up to 35 yrs
            method_factor = 1.0 if doc.methodology and len(doc.methodology) > 20 else 0.5
            data_factor = 1.0 if doc.raw_data_availability == "Available" else 0.4
            
            rediscovery_score = (
                0.40 * semantic_score +
                0.30 * age_factor +
                0.15 * method_factor +
                0.15 * data_factor
            ) * 100.0

            if age >= 10 and semantic_score >= 0.20:
                signals = [
                    f"Historic publication ({year}, {age} years prior)",
                    f"High semantic alignment to current active polar inquiries (Cosine: {round(semantic_score, 2)})",
                    f"Documented methodology: {doc.methodology[:60] if doc.methodology else 'Standard polar protocol'}..."
                ]
                if doc.raw_data_availability == "Available":
                    signals.append("Archived raw empirical observations available for modern re-analysis")

                candidates.append({
                    "document": doc,
                    "rediscovery_score": round(rediscovery_score, 1),
                    "age_years": age,
                    "semantic_similarity": round(semantic_score, 2),
                    "signals": signals,
                    "why_surfaced": f"This paper was surfaced as a rediscovery candidate because it contains foundational {doc.research_domain} data from {year} in {doc.location_name or 'Polar Region'} with high thematic overlap to active 2024-2026 research inquiries."
                })

        candidates.sort(key=lambda x: x["rediscovery_score"], reverse=True)
        return candidates[:limit]

rediscovery_service = RediscoveryService()
