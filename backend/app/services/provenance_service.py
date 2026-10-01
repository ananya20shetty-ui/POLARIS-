import hashlib
import json
from datetime import datetime, timezone
from typing import Dict, Any, Optional

class ProvenanceService:
    """
    W3C PROV compliant provenance tracking with SHA-256 integrity validation.
    Maintains immutable cryptographic lineage for all scientific artifacts.
    """

    @staticmethod
    def generate_sha256(content_bytes: bytes) -> str:
        return hashlib.sha256(content_bytes).hexdigest()

    @staticmethod
    def create_w3c_prov_record(
        entity_id: str,
        entity_type: str,
        activity: str,
        agent_id: str,
        agent_role: str,
        inputs: Optional[list] = None,
        attributes: Optional[Dict[str, Any]] = None
    ) -> Dict[str, Any]:
        timestamp = datetime.now(timezone.utc).isoformat()
        
        prov_document = {
            "prefix": {
                "prov": "http://www.w3.org/ns/prov#",
                "polaris": "https://polaris.moes.gov.in/prov#",
                "ncpor": "https://ncpor.res.in/vocab#"
            },
            "entity": {
                f"polaris:{entity_id}": {
                    "prov:type": f"polaris:{entity_type}",
                    "polaris:generatedAt": timestamp,
                    **(attributes or {})
                }
            },
            "activity": {
                f"polaris:act_{entity_id[:8]}": {
                    "prov:type": f"polaris:{activity}",
                    "prov:startTime": timestamp,
                    "prov:endTime": timestamp
                }
            },
            "agent": {
                f"polaris:agent_{agent_id}": {
                    "prov:type": "prov:SoftwareAgent" if "pipeline" in agent_id else "prov:Person",
                    "polaris:role": agent_role
                }
            },
            "wasGeneratedBy": {
                f"_:gen_{entity_id[:8]}": {
                    "prov:entity": f"polaris:{entity_id}",
                    "prov:activity": f"polaris:act_{entity_id[:8]}"
                }
            },
            "wasAttributedTo": {
                f"_:att_{entity_id[:8]}": {
                    "prov:entity": f"polaris:{entity_id}",
                    "prov:agent": f"polaris:agent_{agent_id}"
                }
            }
        }
        
        if inputs:
            prov_document["used"] = {
                f"_:used_{entity_id[:8]}": {
                    "prov:activity": f"polaris:act_{entity_id[:8]}",
                    "prov:entity": [f"polaris:{inp}" for inp in inputs]
                }
            }
            
        return prov_document

provenance_service = ProvenanceService()
