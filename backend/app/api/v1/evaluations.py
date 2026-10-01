from typing import Dict, Any
from fastapi import APIRouter
from app.services.evaluation_service import evaluation_service

router = APIRouter(prefix="/evaluations", tags=["Quantitative Model Benchmarking"])

@router.get("/metrics")
async def get_evaluation_metrics() -> Dict[str, Any]:
    """
    Executes and returns quantitative evaluation benchmarks computed on golden polar test sets.
    Reports real precision, recall, F1, and Precision@K without fabricated numbers.
    """
    return evaluation_service.run_full_suite()

@router.post("/run")
async def run_evaluation_suite() -> Dict[str, Any]:
    return evaluation_service.run_full_suite()
