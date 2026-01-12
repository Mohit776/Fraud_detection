"""
Spending Anomaly Detection Router.
Uses Isolation Forest model to detect anomalies in spending transactions.
"""
import pandas as pd
from fastapi import APIRouter, HTTPException

from models.loader import get_model
from schemas import (
    SpendingAnalysisRequest,
    SpendingAnalysisResponse,
    SpendingResult,
    SpendingTransaction
)

router = APIRouter(prefix="/spending", tags=["Spending Anomaly Detection"])


def transaction_to_features(tx: SpendingTransaction) -> dict:
    """Convert a SpendingTransaction to feature dictionary."""
    return {
        "Amount": tx.amount,
        "V1": tx.v1, "V2": tx.v2, "V3": tx.v3, "V4": tx.v4,
        "V5": tx.v5, "V6": tx.v6, "V7": tx.v7, "V8": tx.v8,
        "V9": tx.v9, "V10": tx.v10, "V11": tx.v11, "V12": tx.v12,
        "V13": tx.v13, "V14": tx.v14, "V15": tx.v15, "V16": tx.v16,
        "V17": tx.v17, "V18": tx.v18, "V19": tx.v19, "V20": tx.v20,
        "V21": tx.v21, "V22": tx.v22, "V23": tx.v23, "V24": tx.v24,
        "V25": tx.v25, "V26": tx.v26, "V27": tx.v27, "V28": tx.v28
    }


@router.post("/analyze", response_model=SpendingAnalysisResponse)
async def analyze_spending(request: SpendingAnalysisRequest):
    """
    Analyze spending transactions for anomalies.
    
    The model uses Isolation Forest to detect unusual patterns in transaction data.
    Returns a risk score and status for each transaction.
    """
    model = get_model("spending_anomaly")
    if model is None:
        raise HTTPException(status_code=503, detail="Spending anomaly model not loaded")
    
    # Build DataFrame from transactions
    features_list = [transaction_to_features(tx) for tx in request.transactions]
    df = pd.DataFrame(features_list)
    
    # Get feature columns in correct order
    feature_cols = ["Amount"] + [f"V{i}" for i in range(1, 29)]
    X = df[feature_cols].fillna(0)
    
    # Get predictions
    predictions = model.predict(X)  # -1 = anomaly, 1 = normal
    raw_scores = model.decision_function(X)
    
    # Build results
    results = []
    anomalies_found = 0
    avg_amount = X["Amount"].mean() if len(X) > 0 else 0
    
    for i, (pred, raw_score) in enumerate(zip(predictions, raw_scores)):
        tx = request.transactions[i]
        
        # Convert raw score to risk percentage (0-100)
        if raw_score > 0:
            risk_score = 100 - (raw_score * 300)
            risk_score = max(0, risk_score)
        else:
            risk_score = 50 + (abs(raw_score) * 200)
            risk_score = min(100, risk_score)
        
        risk_score = round(risk_score, 2)
        
        # Determine status
        if risk_score > 70:
            status = "🔴 RED (Anomaly Detected)"
            anomalies_found += 1
        elif risk_score > 50:
            status = "🟡 YELLOW (Unusual Pattern)"
        else:
            status = "🟢 GREEN (Normal)"
        
        # Build reason
        reasons = []
        if tx.amount > avg_amount * 5:
            reasons.append(f"Amount (${tx.amount}) is huge (5x Average).")
        
        if status != "🟢 GREEN (Normal)" and not reasons:
            reasons.append("Complex statistical anomaly in transaction metadata.")
        elif status == "🟢 GREEN (Normal)":
            reasons.append("Transaction fits normal spending profile.")
        
        results.append(SpendingResult(
            index=i,
            amount=tx.amount,
            risk_score=risk_score,
            status=status,
            reason=" ".join(reasons)
        ))
    
    return SpendingAnalysisResponse(
        results=results,
        total_analyzed=len(results),
        anomalies_found=anomalies_found
    )


@router.post("/check-single")
async def check_single_transaction(transaction: SpendingTransaction):
    """
    Quick check for a single transaction.
    Returns simplified risk assessment.
    """
    request = SpendingAnalysisRequest(transactions=[transaction])
    response = await analyze_spending(request)
    return response.results[0] if response.results else None
