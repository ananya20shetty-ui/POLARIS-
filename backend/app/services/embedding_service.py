import numpy as np
from typing import List
from sklearn.feature_extraction.text import TfidfVectorizer
import hashlib
import json

class EmbeddingService:
    def __init__(self, dimension: int = 128):
        self.dimension = dimension
        self.vectorizer = TfidfVectorizer(max_features=dimension, stop_words="english")
        self._fitted = False
        self._corpus_cache = [
            "antarctic sea ice thickness reduction weddell sea siral altimeter cryosat satellite",
            "glacier mass balance schirmacher oasis maitri station ground penetrating radar ice core",
            "southern ocean biogeochemistry chlorophyll nitrate phytoplankton upwelling amundsen sea",
            "arctic sea ice extent indarc himadri fjord kongsfjorden atmospheric warming aerosol",
            "himalayan cryosphere chhota shigri glacier ablation meltwater run off mass balance",
            "polar meteorology katabatic winds priyadarshini lake limnology bharati larsemann hills",
            "paleoclimate dml ice core isotopic composition delta o18 dust concentration holocene"
        ]
        self._fit_initial_corpus()

    def _fit_initial_corpus(self):
        self.vectorizer.fit(self._corpus_cache)
        self._fitted = True

    def get_embedding(self, text: str) -> List[float]:
        if not text or not text.strip():
            return [0.0] * self.dimension

        # Generate deterministic normalized vector using TF-IDF projection & hashing
        try:
            tfidf_vec = self.vectorizer.transform([text]).toarray()[0]
            if np.sum(tfidf_vec) > 0:
                norm = np.linalg.norm(tfidf_vec)
                vec = (tfidf_vec / norm).tolist()
                return [round(float(v), 6) for v in vec]
        except Exception:
            pass

        # Hash fallback for robust dimensionality preservation
        seed = int(hashlib.md5(text.encode("utf-8")).hexdigest()[:8], 16)
        rng = np.random.RandomState(seed)
        vec = rng.randn(self.dimension)
        vec = vec / np.linalg.norm(vec)
        return [round(float(v), 6) for v in vec.tolist()]

    @staticmethod
    def cosine_similarity(vec_a: List[float], vec_b: List[float]) -> float:
        if not vec_a or not vec_b or len(vec_a) != len(vec_b):
            return 0.0
        a = np.array(vec_a)
        b = np.array(vec_b)
        norm_a = np.linalg.norm(a)
        norm_b = np.linalg.norm(b)
        if norm_a == 0 or norm_b == 0:
            return 0.0
        sim = np.dot(a, b) / (norm_a * norm_b)
        return float(np.clip(sim, -1.0, 1.0))

embedding_service = EmbeddingService()
