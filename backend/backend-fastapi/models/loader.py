"""
Model loader module for loading trained ML models from the llm folder.
"""
import os
import joblib
from pathlib import Path

# Path to the llm folder containing the trained models
# backend-fastapi -> backend -> Fraud_Detection -> llm
LLM_FOLDER = Path(__file__).parent.parent.parent.parent / "llm"

# Global model storage
_models = {}


def get_llm_folder() -> Path:
    """Get the path to the llm folder."""
    return LLM_FOLDER


def load_model(filename: str):
    """
    Load a single model from the llm folder.
    
    Args:
        filename: Name of the .pkl file to load
        
    Returns:
        The loaded model object
    """
    model_path = LLM_FOLDER / filename
    if not model_path.exists():
        raise FileNotFoundError(f"Model file not found: {model_path}")
    
    return joblib.load(model_path)


def load_all_models():
    """
    Load all required models at application startup.
    
    Returns:
        Dict containing all loaded models
    """
    global _models
    
    # Spending Anomaly Model (Isolation Forest)
    try:
        _models["spending_anomaly"] = load_model("spending_anomaly_model.pkl")
        print("✅ Loaded: spending_anomaly_model.pkl")
    except Exception as e:
        print(f"❌ Failed to load spending_anomaly_model.pkl: {e}")
    
    # Legal Document Scanner (NLP Model + Vectorizer)
    try:
        _models["legal_nlp"] = load_model("legal_nlp_model.pkl")
        _models["text_vectorizer"] = load_model("text_vectorizer.pkl")
        print("✅ Loaded: legal_nlp_model.pkl & text_vectorizer.pkl")
    except Exception as e:
        print(f"❌ Failed to load legal NLP models: {e}")
    
    # Bid Rigging Graph + Vendor Names
    try:
        _models["bid_rigging_graph"] = load_model("bid_rigging_graph.pkl")
        _models["vendor_names"] = load_model("vendor_names.pkl")
        print("✅ Loaded: bid_rigging_graph.pkl & vendor_names.pkl")
    except Exception as e:
        print(f"❌ Failed to load bid rigging models: {e}")
    
    # Note: welfare-delivery.ipynb saves as 'fraud_detection_model.pkl' but we don't have it
    # The notebook saves to 'Welfare Delivery.pkl' - let's try both
    try:
        try:
            _models["welfare_fraud"] = load_model("fraud_detection_model.pkl")
        except FileNotFoundError:
            _models["welfare_fraud"] = load_model("Welfare Delivery.pkl")
        print("✅ Loaded: welfare fraud detection model")
    except Exception as e:
        print(f"❌ Failed to load welfare fraud model: {e}")
    
    return _models


def get_model(name: str):
    """
    Get a loaded model by name.
    
    Args:
        name: Key name of the model
        
    Returns:
        The model object or None if not found
    """
    return _models.get(name)


def get_all_models():
    """Get all loaded models."""
    return _models
