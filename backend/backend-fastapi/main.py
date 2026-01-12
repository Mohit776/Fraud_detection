"""
FastAPI Backend for Fraud Detection Models

This server exposes the trained ML models from the llm folder as REST API endpoints.
Supports 4 fraud detection modules:
1. Spending Anomaly Detection (Isolation Forest)
2. Legal Document Scanner (NLP)
3. Welfare/Healthcare Fraud Detection (Random Forest)
4. Bid Rigging/Collusion Detection (Graph Analysis)
"""
from contextlib import asynccontextmanager
from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware

from models.loader import load_all_models, get_all_models
from routers import spending, legal, welfare, bidrigging
from schemas import HealthCheckResponse


@asynccontextmanager
async def lifespan(app: FastAPI):
    """Load ML models on startup, cleanup on shutdown."""
    print("🚀 Starting Fraud Detection API...")
    print("📦 Loading ML models from llm folder...")
    load_all_models()
    print("✅ Model loading complete!")
    yield
    print("👋 Shutting down Fraud Detection API...")


app = FastAPI(
    title="AI Public Integrity & Fraud Detection API",
    description="""
    API for detecting fraud, anomalies, and corruption in government public spending.
    
    ## Modules:
    
    - **Spending Anomaly**: Detect unusual patterns in transaction data using Isolation Forest
    - **Legal Document Scanner**: Analyze documents for suspicious language using NLP
    - **Welfare Fraud**: Detect ghost beneficiaries and overbilling in healthcare claims
    - **Bid Rigging**: Identify cartels and collusion using graph network analysis
    """,
    version="1.0.0",
    lifespan=lifespan
)

# Configure CORS for frontend access
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # In production, specify allowed origins
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Mount routers
app.include_router(spending.router)
app.include_router(legal.router)
app.include_router(welfare.router)
app.include_router(bidrigging.router)


@app.get("/", tags=["Root"])
async def root():
    """Root endpoint with API information."""
    return {
        "name": "AI Public Integrity & Fraud Detection API",
        "version": "1.0.0",
        "endpoints": {
            "spending": "/spending/analyze",
            "legal": "/legal/analyze",
            "welfare": "/welfare/analyze",
            "bidrigging": "/bidrigging/analyze",
            "health": "/health",
            "docs": "/docs"
        }
    }


@app.get("/health", response_model=HealthCheckResponse, tags=["Health"])
async def health_check():
    """Check API health and model loading status."""
    models = get_all_models()
    
    expected_models = [
        "spending_anomaly",
        "legal_nlp",
        "text_vectorizer",
        "bid_rigging_graph",
        "vendor_names",
        "welfare_fraud"
    ]
    
    models_loaded = [name for name in expected_models if name in models]
    models_failed = [name for name in expected_models if name not in models]
    
    status = "healthy" if len(models_loaded) > 0 else "degraded"
    if len(models_failed) == len(expected_models):
        status = "unhealthy"
    
    return HealthCheckResponse(
        status=status,
        models_loaded=models_loaded,
        models_failed=models_failed
    )


if __name__ == "__main__":
    import uvicorn
    uvicorn.run("main:app", host="0.0.0.0", port=8000, reload=True)
