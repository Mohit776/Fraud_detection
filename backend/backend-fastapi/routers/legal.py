"""
Legal Document Scanner Router.
Uses TF-IDF + Logistic Regression to detect suspicious document language.
"""
import re
import string
from fastapi import APIRouter, HTTPException

from models.loader import get_model
from schemas import LegalDocumentRequest, LegalDocumentResponse

router = APIRouter(prefix="/legal", tags=["Legal Document Scanner"])


def clean_text(text: str) -> str:
    """Clean and preprocess text for analysis."""
    text = str(text).lower()
    text = re.sub(r'\[.*?\]', '', text)
    text = re.sub('[%s]' % re.escape(string.punctuation), '', text)
    text = re.sub(r'\w*\d\w*', '', text)
    return text


@router.post("/analyze", response_model=LegalDocumentResponse)
async def analyze_document(request: LegalDocumentRequest):
    """
    Analyze a document for suspicious or fabricated language.
    
    The model uses TF-IDF vectorization and Logistic Regression to detect
    sensationalist, urgent, or vague language common in fraudulent documents.
    """
    nlp_model = get_model("legal_nlp")
    vectorizer = get_model("text_vectorizer")
    
    if nlp_model is None or vectorizer is None:
        raise HTTPException(
            status_code=503, 
            detail="Legal NLP model or vectorizer not loaded"
        )
    
    # Clean and vectorize the text
    cleaned = clean_text(request.text)
    
    # Validate that cleaned text is not empty
    if not cleaned or len(cleaned.strip()) == 0:
        raise HTTPException(status_code=400, detail="Document text is empty or contains only special characters")
    
    vec_input = vectorizer.transform([cleaned])
    
    # Get prediction probability
    risk_score = nlp_model.predict_proba(vec_input)[0][1] * 100
    risk_score = round(risk_score, 2)
    
    # Determine status
    if risk_score > 70:
        status = "🔴 HIGH RISK (Likely Fabricated)"
        is_suspicious = True
    elif risk_score > 40:
        status = "🟡 SUSPICIOUS (Review Language)"
        is_suspicious = True
    else:
        status = "🟢 SAFE (Professional Tone)"
        is_suspicious = False
    
    # Get excerpt (first 100 chars)
    excerpt = request.text[:100] + "..." if len(request.text) > 100 else request.text
    
    return LegalDocumentResponse(
        excerpt=excerpt,
        risk_score=risk_score,
        status=status,
        is_suspicious=is_suspicious
    )


@router.post("/batch-analyze")
async def batch_analyze_documents(documents: list[LegalDocumentRequest]):
    """
    Analyze multiple documents at once.
    Returns risk assessment for each document.
    """
    results = []
    for doc in documents:
        result = await analyze_document(doc)
        results.append(result)
    
    return {
        "results": results,
        "total_analyzed": len(results),
        "suspicious_count": sum(1 for r in results if r.is_suspicious)
    }
