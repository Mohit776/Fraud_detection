"""
FastAPI Backend for Fraud Detection ML Models

This API provides endpoints for:
1. Bid Rigging & Collusion Detection
2. Legal Document Scanning
3. Spending Anomaly Detection
4. Welfare Delivery Analysis
"""

import os
import pickle
from typing import Optional, List
from contextlib import asynccontextmanager

import httpx
from fastapi import FastAPI, HTTPException, Depends, Header
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
from dotenv import load_dotenv

# Load environment variables
load_dotenv()

# ============== Models Storage ==============
models = {}

@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load ML models on startup"""
    print("🔄 Loading ML models...")
    
    model_files = {
        "bid_rigging": "bid_rigging_graph.pkl",
        "legal_nlp": "legal_nlp_model.pkl",
        "spending_anomaly": "spending_anomaly_model.pkl",
        "text_vectorizer": "text_vectorizer.pkl",
        "vendor_names": "vendor_names.pkl",
    }
    
    base_path = os.path.dirname(os.path.abspath(__file__))
    
    for name, filename in model_files.items():
        filepath = os.path.join(base_path, filename)
        if os.path.exists(filepath):
            try:
                with open(filepath, 'rb') as f:
                    models[name] = pickle.load(f)
                print(f"  ✅ Loaded {name}")
            except Exception as e:
                print(f"  ⚠️ Failed to load {name}: {e}")
        else:
            print(f"  ⚠️ Model file not found: {filename}")
    
    print("✅ Models loaded successfully!")
    yield
    
    # Cleanup on shutdown
    models.clear()
    print("🛑 Models unloaded")

# ============== FastAPI App ==============
app = FastAPI(
    title="Fraud Detection API",
    description="ML-powered fraud detection for government procurement",
    version="1.0.0",
    lifespan=lifespan
)

# CORS Configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",  # Vite frontend
        "http://localhost:3000",  # Alternative frontend
        "http://localhost:5000",  # Node.js backend
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ============== Auth Dependency ==============
NODE_AUTH_URL = os.getenv("NODE_AUTH_URL", "http://localhost:5000/api")

async def verify_token(authorization: Optional[str] = Header(None)):
    """Verify JWT token with Node.js auth backend"""
    if not authorization:
        raise HTTPException(status_code=401, detail="Authorization header missing")
    
    if not authorization.startswith("Bearer "):
        raise HTTPException(status_code=401, detail="Invalid authorization format")
    
    token = authorization.split(" ")[1]
    
    try:
        async with httpx.AsyncClient() as client:
            response = await client.get(
                f"{NODE_AUTH_URL}/auth/me",
                headers={"Authorization": f"Bearer {token}"}
            )
            
            if response.status_code != 200:
                raise HTTPException(status_code=401, detail="Invalid or expired token")
            
            return response.json().get("data", {}).get("user")
    except httpx.RequestError:
        raise HTTPException(status_code=503, detail="Auth service unavailable")

# ============== Request/Response Models ==============
class BidData(BaseModel):
    vendor_id: str
    bid_amount: float
    project_id: str
    bid_date: Optional[str] = None

class BidRiggingRequest(BaseModel):
    bids: List[BidData]
    threshold: Optional[float] = 0.7

class LegalDocumentRequest(BaseModel):
    document_text: str
    check_compliance: Optional[bool] = True

class SpendingRequest(BaseModel):
    department: str
    amount: float
    category: str
    vendor_id: Optional[str] = None
    description: Optional[str] = None

class WelfareRequest(BaseModel):
    beneficiary_id: str
    scheme_id: str
    amount: float
    location: Optional[str] = None

class PredictionResponse(BaseModel):
    success: bool
    prediction: str
    confidence: float
    details: Optional[dict] = None
    risk_level: Optional[str] = None

# ============== Health Check ==============
@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {
        "status": "healthy",
        "models_loaded": list(models.keys()),
        "auth_backend": NODE_AUTH_URL
    }

# ============== Public Endpoints ==============
@app.get("/")
async def root():
    return {
        "message": "Fraud Detection API",
        "version": "1.0.0",
        "docs": "/docs",
        "endpoints": {
            "bid_rigging": "/api/analyze/bid-rigging",
            "legal_scan": "/api/analyze/legal-document",
            "spending": "/api/analyze/spending",
            "welfare": "/api/analyze/welfare"
        }
    }

# ============== Protected Analysis Endpoints ==============
@app.post("/api/analyze/bid-rigging", response_model=PredictionResponse)
async def analyze_bid_rigging(
    request: BidRiggingRequest,
    user: dict = Depends(verify_token)
):
    """
    Analyze bids for potential bid rigging or collusion patterns.
    Requires authentication.
    """
    if "bid_rigging" not in models:
        raise HTTPException(status_code=503, detail="Bid rigging model not loaded")
    
    try:
        # Process bids using the model
        # This is a placeholder - adapt to your actual model
        bid_data = [
            {
                "vendor": b.vendor_id,
                "amount": b.bid_amount,
                "project": b.project_id
            }
            for b in request.bids
        ]
        
        # Example analysis (replace with actual model inference)
        total_bids = len(request.bids)
        unique_vendors = len(set(b.vendor_id for b in request.bids))
        
        # Simple heuristic (replace with actual model)
        if unique_vendors < 3 and total_bids > 5:
            risk_level = "HIGH"
            confidence = 0.85
            prediction = "Potential collusion detected"
        elif unique_vendors < 5:
            risk_level = "MEDIUM"
            confidence = 0.65
            prediction = "Some concentration patterns found"
        else:
            risk_level = "LOW"
            confidence = 0.90
            prediction = "No significant collusion patterns"
        
        return PredictionResponse(
            success=True,
            prediction=prediction,
            confidence=confidence,
            risk_level=risk_level,
            details={
                "total_bids": total_bids,
                "unique_vendors": unique_vendors,
                "analyzed_by": user.get("email", "unknown")
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze/legal-document", response_model=PredictionResponse)
async def analyze_legal_document(
    request: LegalDocumentRequest,
    user: dict = Depends(verify_token)
):
    """
    Scan legal documents for compliance issues and red flags.
    Requires authentication.
    """
    if "legal_nlp" not in models or "text_vectorizer" not in models:
        raise HTTPException(status_code=503, detail="Legal NLP model not loaded")
    
    try:
        text = request.document_text
        
        # Vectorize the text
        vectorizer = models["text_vectorizer"]
        model = models["legal_nlp"]
        
        # Transform and predict
        text_vector = vectorizer.transform([text])
        prediction = model.predict(text_vector)[0]
        
        # Get probability if available
        if hasattr(model, 'predict_proba'):
            proba = model.predict_proba(text_vector)[0]
            confidence = float(max(proba))
        else:
            confidence = 0.75
        
        # Determine risk level
        risk_level = "HIGH" if prediction == 1 else "LOW"
        
        return PredictionResponse(
            success=True,
            prediction="Compliance issues detected" if prediction == 1 else "Document appears compliant",
            confidence=confidence,
            risk_level=risk_level,
            details={
                "document_length": len(text),
                "analyzed_by": user.get("email", "unknown")
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze/spending", response_model=PredictionResponse)
async def analyze_spending(
    request: SpendingRequest,
    user: dict = Depends(verify_token)
):
    """
    Detect anomalies in spending patterns.
    Requires authentication.
    """
    if "spending_anomaly" not in models:
        raise HTTPException(status_code=503, detail="Spending anomaly model not loaded")
    
    try:
        model = models["spending_anomaly"]
        
        # Prepare features (adapt to your model's expected format)
        # This is a simplified example
        import numpy as np
        features = np.array([[request.amount]])
        
        # Predict
        prediction = model.predict(features)[0]
        
        # -1 is anomaly for IsolationForest, 1 is normal
        is_anomaly = prediction == -1
        
        if hasattr(model, 'decision_function'):
            score = model.decision_function(features)[0]
            confidence = min(abs(score), 1.0)
        else:
            confidence = 0.75
        
        return PredictionResponse(
            success=True,
            prediction="Spending anomaly detected" if is_anomaly else "Spending appears normal",
            confidence=confidence,
            risk_level="HIGH" if is_anomaly else "LOW",
            details={
                "department": request.department,
                "amount": request.amount,
                "category": request.category,
                "analyzed_by": user.get("email", "unknown")
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

@app.post("/api/analyze/welfare", response_model=PredictionResponse)
async def analyze_welfare(
    request: WelfareRequest,
    user: dict = Depends(verify_token)
):
    """
    Analyze welfare delivery for fraud patterns.
    Requires authentication.
    """
    try:
        # Placeholder for welfare analysis
        # Adapt this to your actual welfare-delivery model
        
        return PredictionResponse(
            success=True,
            prediction="Welfare delivery analysis completed",
            confidence=0.85,
            risk_level="LOW",
            details={
                "beneficiary_id": request.beneficiary_id,
                "scheme_id": request.scheme_id,
                "amount": request.amount,
                "analyzed_by": user.get("email", "unknown")
            }
        )
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

# ============== Run Server ==============
if __name__ == "__main__":
    import uvicorn
    port = int(os.getenv("PORT", 8000))
    uvicorn.run("main:app", host="0.0.0.0", port=port, reload=True)
