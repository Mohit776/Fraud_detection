"""
Welfare/Healthcare Fraud Detection Router.
Uses Random Forest Classifier to detect ghost beneficiaries and overbilling.
"""
import pandas as pd
from fastapi import APIRouter, HTTPException

from models.loader import get_model
from schemas import (
    WelfareFraudRequest,
    WelfareFraudResponse,
    WelfareFraudResult,
    WelfareClaim
)

router = APIRouter(prefix="/welfare", tags=["Welfare Fraud Detection"])

# Average values from training data for comparison
# These are approximate based on the training notebook
AVG_TOTAL_COST = 10000.0
AVG_DURATION_DAYS = 6.0


@router.post("/analyze", response_model=WelfareFraudResponse)
async def analyze_claims(request: WelfareFraudRequest):
    """
    Analyze welfare/healthcare claims for fraud.
    
    The model uses Random Forest to detect ghost beneficiaries, overbilling,
    and statistically impossible transactions.
    """
    model = get_model("welfare_fraud")
    if model is None:
        raise HTTPException(status_code=503, detail="Welfare fraud model not loaded")
    
    # Validate that claims list is not empty
    if not request.claims or len(request.claims) == 0:
        raise HTTPException(status_code=400, detail="At least one claim is required for analysis")
    
    # Build DataFrame from claims
    data = []
    for claim in request.claims:
        data.append({
            "Duration_Days": claim.duration_days,
            "Total_Cost": claim.total_cost,
            "InscClaimAmtReimbursed": claim.insc_claim_amt_reimbursed,
            "OPAnnualReimbursementAmt": claim.op_annual_reimbursement_amt,
            "IPAnnualReimbursementAmt": claim.ip_annual_reimbursement_amt
        })
    
    df = pd.DataFrame(data)
    
    # Get predictions and probabilities
    predictions = model.predict(df)
    probabilities = model.predict_proba(df)[:, 1]  # Probability of fraud
    
    # Build results
    results = []
    high_risk_count = 0
    
    for i, (pred, prob) in enumerate(zip(predictions, probabilities)):
        claim = request.claims[i]
        risk_score = round(prob * 100, 2)
        
        # Determine status
        if risk_score > 70:
            status = "🔴 HIGH RISK"
            high_risk_count += 1
        elif risk_score > 40:
            status = "🟡 REVIEW"
        else:
            status = "🟢 SAFE"
        
        # Build reason
        reasons = []
        if claim.total_cost > AVG_TOTAL_COST * 2:
            reasons.append(f"Cost (${claim.total_cost}) is >2x Average.")
        if claim.duration_days > AVG_DURATION_DAYS * 2:
            reasons.append(f"Stay ({claim.duration_days} days) is unusually long.")
        if claim.ip_annual_reimbursement_amt > 50000:
            reasons.append("High Annual Reimbursement History.")
        
        if status == "🔴 HIGH RISK" and not reasons:
            reasons.append("Complex anomaly pattern detected by AI.")
        elif not reasons:
            reasons.append("Normal Range")
        
        results.append(WelfareFraudResult(
            claim_id=claim.claim_id,
            risk_score=risk_score,
            status=status,
            is_fraud=pred == 1,
            reason=" | ".join(reasons)
        ))
    
    return WelfareFraudResponse(
        results=results,
        total_analyzed=len(results),
        high_risk_count=high_risk_count
    )


@router.post("/check-single")
async def check_single_claim(claim: WelfareClaim):
    """
    Quick check for a single welfare claim.
    Returns simplified fraud assessment.
    """
    request = WelfareFraudRequest(claims=[claim])
    response = await analyze_claims(request)
    return response.results[0] if response.results else None
