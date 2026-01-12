"""
Pydantic schemas for request/response validation.
"""
from pydantic import BaseModel, Field
from typing import List, Optional


# ============== Spending Anomaly Schemas ==============

class SpendingTransaction(BaseModel):
    """Single transaction for spending anomaly detection."""
    amount: float = Field(..., description="Transaction amount")
    v1: float = Field(0.0, description="Anonymized feature V1")
    v2: float = Field(0.0, description="Anonymized feature V2")
    v3: float = Field(0.0, description="Anonymized feature V3")
    v4: float = Field(0.0, description="Anonymized feature V4")
    v5: float = Field(0.0, description="Anonymized feature V5")
    v6: float = Field(0.0, description="Anonymized feature V6")
    v7: float = Field(0.0, description="Anonymized feature V7")
    v8: float = Field(0.0, description="Anonymized feature V8")
    v9: float = Field(0.0, description="Anonymized feature V9")
    v10: float = Field(0.0, description="Anonymized feature V10")
    v11: float = Field(0.0, description="Anonymized feature V11")
    v12: float = Field(0.0, description="Anonymized feature V12")
    v13: float = Field(0.0, description="Anonymized feature V13")
    v14: float = Field(0.0, description="Anonymized feature V14")
    v15: float = Field(0.0, description="Anonymized feature V15")
    v16: float = Field(0.0, description="Anonymized feature V16")
    v17: float = Field(0.0, description="Anonymized feature V17")
    v18: float = Field(0.0, description="Anonymized feature V18")
    v19: float = Field(0.0, description="Anonymized feature V19")
    v20: float = Field(0.0, description="Anonymized feature V20")
    v21: float = Field(0.0, description="Anonymized feature V21")
    v22: float = Field(0.0, description="Anonymized feature V22")
    v23: float = Field(0.0, description="Anonymized feature V23")
    v24: float = Field(0.0, description="Anonymized feature V24")
    v25: float = Field(0.0, description="Anonymized feature V25")
    v26: float = Field(0.0, description="Anonymized feature V26")
    v27: float = Field(0.0, description="Anonymized feature V27")
    v28: float = Field(0.0, description="Anonymized feature V28")


class SpendingAnalysisRequest(BaseModel):
    """Request for spending anomaly analysis."""
    transactions: List[SpendingTransaction]


class SpendingResult(BaseModel):
    """Result for a single transaction."""
    index: int
    amount: float
    risk_score: float
    status: str
    reason: str


class SpendingAnalysisResponse(BaseModel):
    """Response for spending anomaly analysis."""
    results: List[SpendingResult]
    total_analyzed: int
    anomalies_found: int


# ============== Legal Document Schemas ==============

class LegalDocumentRequest(BaseModel):
    """Request for legal document analysis."""
    text: str = Field(..., min_length=10, description="Document text to analyze")


class LegalDocumentResponse(BaseModel):
    """Response for legal document analysis."""
    excerpt: str
    risk_score: float
    status: str
    is_suspicious: bool


# ============== Welfare Fraud Schemas ==============

class WelfareClaim(BaseModel):
    """Single welfare/healthcare claim for fraud detection."""
    claim_id: str = Field(..., description="Unique claim identifier")
    duration_days: int = Field(..., ge=0, description="Duration of claim in days")
    total_cost: float = Field(..., ge=0, description="Total cost of claim")
    insc_claim_amt_reimbursed: float = Field(..., ge=0, description="Insurance claim amount reimbursed")
    op_annual_reimbursement_amt: float = Field(0.0, ge=0, description="Outpatient annual reimbursement amount")
    ip_annual_reimbursement_amt: float = Field(0.0, ge=0, description="Inpatient annual reimbursement amount")


class WelfareFraudRequest(BaseModel):
    """Request for welfare fraud detection."""
    claims: List[WelfareClaim]


class WelfareFraudResult(BaseModel):
    """Result for a single claim."""
    claim_id: str
    risk_score: float
    status: str
    is_fraud: bool
    reason: str


class WelfareFraudResponse(BaseModel):
    """Response for welfare fraud detection."""
    results: List[WelfareFraudResult]
    total_analyzed: int
    high_risk_count: int


# ============== Bid Rigging Schemas ==============

class BidRiggingRequest(BaseModel):
    """Request for bid rigging analysis."""
    vendor_id: str = Field(..., description="Vendor/participant code to analyze")


class ConnectionInfo(BaseModel):
    """Information about a connected vendor."""
    vendor_id: str
    vendor_name: Optional[str]
    connection_weight: int


class BidRiggingResponse(BaseModel):
    """Response for bid rigging analysis."""
    vendor_id: str
    vendor_name: Optional[str]
    total_connections: int
    is_in_cartel: bool
    cartel_size: Optional[int]
    top_connections: List[ConnectionInfo]
    risk_level: str


# ============== Health Check Schema ==============

class HealthCheckResponse(BaseModel):
    """Health check response."""
    status: str
    models_loaded: List[str]
    models_failed: List[str]
