"""
FastAPI Model Server for Mental Health Prediction
Serves the fine-tuned DistilBERT model and Scikit-learn Baseline model,
with automated contraction normalization and ensemble capabilities.
"""

import os
import sys
import re
from typing import Dict, Any, List, Optional

# Ensure UTF-8 output on Windows consoles
if sys.platform == "win32":
    try:
        sys.stdout.reconfigure(encoding="utf-8")
        sys.stderr.reconfigure(encoding="utf-8")
    except Exception:
        pass

from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel, Field
import uvicorn

# Standard English contraction mappings to prevent tokenizer subtoken bias
CONTRACTIONS = {
    r"\bdon't\b": "do not",
    r"\bdoesn't\b": "does not",
    r"\bdidn't\b": "did not",
    r"\bcan't\b": "cannot",
    r"\bcouldn't\b": "could not",
    r"\bwon't\b": "will not",
    r"\bwouldn't\b": "would not",
    r"\bshouldn't\b": "should not",
    r"\bisn't\b": "is not",
    r"\baren't\b": "are not",
    r"\bwasn't\b": "was not",
    r"\bweren't\b": "were not",
    r"\bhasn't\b": "has not",
    r"\bhaven't\b": "have not",
    r"\bhadn't\b": "had not",
    r"\bi'm\b": "i am",
    r"\byou're\b": "you are",
    r"\bhe's\b": "he is",
    r"\bshe's\b": "she is",
    r"\bit's\b": "it is",
    r"\bwe're\b": "we are",
    r"\bthey're\b": "they are",
    r"\bi've\b": "i have",
    r"\byou've\b": "you have",
    r"\bwe've\b": "we have",
    r"\bthey've\b": "they have",
    r"\bi'll\b": "i will",
    r"\byou'll\b": "you will",
    r"\bhe'll\b": "he will",
    r"\bshe'll\b": "she will",
    r"\bwe'll\b": "we will",
    r"\bthey'll\b": "they will",
}

def clean_and_normalize_text(text: str) -> str:
    """Expands contractions and cleans excessive spaces for accurate BERT tokenization."""
    cleaned = text
    for pattern, repl in CONTRACTIONS.items():
        cleaned = re.sub(pattern, repl, cleaned, flags=re.IGNORECASE)
    cleaned = re.sub(r"\s+", " ", cleaned).strip()
    return cleaned

# Label definitions corresponding to training data
LABELS = [
    "Anxiety",
    "Bipolar",
    "Depression",
    "Normal",
    "Personality disorder",
    "Stress",
    "Suicidal",
]

# Recommendations and coping insights for each predicted emotional state
RECOMMENDATIONS: Dict[str, Dict[str, Any]] = {
    "Normal": {
        "severity": "low",
        "badge_color": "#10b981",  # emerald
        "summary": "Your thoughts reflect balanced and positive emotional health.",
        "tips": [
            "Maintain your regular sleep schedule and balanced nutrition.",
            "Continue daily mindfulness or light movement.",
            "Stay engaged with hobbies and people you enjoy."
        ],
        "is_crisis": False,
    },
    "Stress": {
        "severity": "moderate",
        "badge_color": "#f59e0b",  # amber/orange
        "summary": "Signs of emotional or mental strain detected.",
        "tips": [
            "Practice the 4-7-8 breathing technique to regulate nervous system tension.",
            "Take structured 10-minute breaks during study or work sessions.",
            "Consider engaging in light cardio, gentle yoga, or a nature walk."
        ],
        "is_crisis": False,
    },
    "Anxiety": {
        "severity": "moderate",
        "badge_color": "#f97316",  # orange
        "summary": "Indicators of anxious thinking, nervousness, or racing thoughts detected.",
        "tips": [
            "Try grounding exercises: identify 5 things you see, 4 you can touch, 3 you hear.",
            "Limit caffeine and screen time before sleeping.",
            "Write down worries in a journal to externalize repetitive thoughts."
        ],
        "is_crisis": False,
    },
    "Depression": {
        "severity": "high",
        "badge_color": "#8b5cf6",  # violet/purple
        "summary": "Patterns associated with feelings of hopelessness, sadness, or low motivation detected.",
        "tips": [
            "Focus on micro-goals: take small, manageable steps each day.",
            "Reach out to a trusted loved one or counselor to share what you are experiencing.",
            "Consider scheduling a one-on-one consultation with a licensed therapist."
        ],
        "is_crisis": False,
    },
    "Bipolar": {
        "severity": "high",
        "badge_color": "#ec4899",  # pink
        "summary": "Indicators of fluctuating energy, mood shifts, or heightened emotional intensity.",
        "tips": [
            "Keep a consistent daily mood and sleep log.",
            "Maintain steady meal and sleep routines to stabilize circadian rhythms.",
            "Discuss recurring shifts in mood and energy with a mental health professional."
        ],
        "is_crisis": False,
    },
    "Personality disorder": {
        "severity": "high",
        "badge_color": "#6366f1",  # indigo
        "summary": "Markers of complex emotional regulation patterns detected.",
        "tips": [
            "Dialectical Behavior Therapy (DBT) and mindfulness skills can provide strong support.",
            "Focus on distress tolerance techniques when strong emotions arise.",
            "Consult with a clinical psychologist specializing in personality and behavioral patterns."
        ],
        "is_crisis": False,
    },
    "Suicidal": {
        "severity": "critical",
        "badge_color": "#ef4444",  # red
        "summary": "CRITICAL: Severe emotional pain or crisis indicators detected.",
        "tips": [
            "You are not alone and immediate compassionate help is available 24/7.",
            "Please connect immediately with a trained crisis counselor using the hotlines below.",
            "Stay with someone you trust right now."
        ],
        "is_crisis": True,
        "helplines": [
            {"name": "Tele-MANAS (India)", "contact": "14416 / 1800-891-4416 (Toll Free)"},
            {"name": "KIRAN Mental Health Helpline", "contact": "1800-599-0019"},
            {"name": "National Suicide & Crisis Lifeline (US/Global)", "contact": "988 (Call/Text)"},
            {"name": "Vandrevala Foundation", "contact": "+91 9999 666 555"},
        ],
    },
}

app = FastAPI(
    title="Serenium Mental Health AI API",
    description="Fine-tuned DistilBERT and Baseline classification microservice for mental health statement analysis.",
    version="1.1.0",
)

# Enable CORS for frontend Vite dev server
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://127.0.0.1:5173", "http://localhost:3000", "*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class PredictionRequest(BaseModel):
    text: str = Field(..., min_length=2, description="Text statement or reflection to classify")
    model_type: Optional[str] = Field("distilbert", description="'distilbert', 'baseline', or 'ensemble'")

class PredictionResponse(BaseModel):
    prediction: str
    confidence: float
    probabilities: Dict[str, float]
    ranked_classes: List[Dict[str, Any]]
    recommendation: Dict[str, Any]
    model_name: str
    normalized_input: str

# Model holder
model_bundle = {
    "distilbert_loaded": False,
    "baseline_loaded": False,
    "tokenizer": None,
    "distilbert": None,
    "baseline_model": None,
    "vectorizer": None,
}

def load_models():
    """Load DistilBERT and Scikit-learn baseline model."""
    distilbert_path = "C:/Users/RAJAT KUSHWAHA/MajorProject/distilbert_mental_health"

    if os.path.exists(distilbert_path):
        try:
            print(f"[INFO] Loading DistilBERT from: {distilbert_path}")
            import torch
            from transformers import AutoTokenizer, AutoModelForSequenceClassification

            tokenizer = AutoTokenizer.from_pretrained(distilbert_path)
            model = AutoModelForSequenceClassification.from_pretrained(distilbert_path)
            model.eval()
            model_bundle["distilbert_loaded"] = True
            model_bundle["tokenizer"] = tokenizer
            model_bundle["distilbert"] = model
            print("[SUCCESS] DistilBERT Mental Health model loaded successfully!")
        except Exception as e:
            print(f"[WARN] Failed to load DistilBERT ({e})")

    # Load Scikit-learn baseline
    baseline_path = "C:/Users/RAJAT KUSHWAHA/MajorProject/baseline_model.pkl"
    vectorizer_path = "C:/Users/RAJAT KUSHWAHA/MajorProject/vectorizer.pkl"
    if os.path.exists(baseline_path) and os.path.exists(vectorizer_path):
        try:
            print("[INFO] Loading Scikit-learn Baseline Model & TF-IDF Vectorizer...")
            import joblib

            model_bundle["baseline_model"] = joblib.load(baseline_path)
            model_bundle["vectorizer"] = joblib.load(vectorizer_path)
            model_bundle["baseline_loaded"] = True
            print("[SUCCESS] Baseline model loaded successfully!")
        except Exception as e:
            print(f"[ERROR] Failed to load baseline model: {e}")

load_models()

@app.get("/")
def read_root():
    return {
        "service": "Serenium Mental Health AI API",
        "distilbert_available": model_bundle["distilbert_loaded"],
        "baseline_available": model_bundle["baseline_loaded"],
        "endpoints": ["/health", "/predict"]
    }

@app.get("/health")
def health_check():
    return {
        "status": "online",
        "model_loaded": model_bundle["distilbert_loaded"] or model_bundle["baseline_loaded"],
        "distilbert_loaded": model_bundle["distilbert_loaded"],
        "baseline_loaded": model_bundle["baseline_loaded"],
        "supported_classes": LABELS,
    }

@app.post("/predict", response_model=PredictionResponse)
def predict_mental_health(req: PredictionRequest):
    raw_text = req.text.strip()
    if not raw_text:
        raise HTTPException(status_code=400, detail="Text input cannot be empty.")

    # Apply text normalization to remove contraction distortion
    norm_text = clean_and_normalize_text(raw_text)
    mode = (req.model_type or "distilbert").lower()

    if not model_bundle["distilbert_loaded"] and not model_bundle["baseline_loaded"]:
        raise HTTPException(status_code=503, detail="No classification model is currently loaded.")

    try:
        distilbert_probs = None
        baseline_probs = None

        # Compute DistilBERT probabilities
        if model_bundle["distilbert_loaded"] and mode in ["distilbert", "ensemble"]:
            import torch

            tokenizer = model_bundle["tokenizer"]
            model = model_bundle["distilbert"]

            inputs = tokenizer(
                norm_text,
                return_tensors="pt",
                truncation=True,
                max_length=256,
                padding=True,
            )

            with torch.no_grad():
                outputs = model(**inputs)
                logits = outputs.logits
                d_probs = torch.softmax(logits, dim=1)[0].tolist()

            distilbert_probs = {
                LABELS[i]: float(d_probs[i])
                for i in range(len(LABELS))
            }

        # Compute Baseline probabilities
        if model_bundle["baseline_loaded"] and (mode in ["baseline", "ensemble"] or not model_bundle["distilbert_loaded"]):
            b_model = model_bundle["baseline_model"]
            vectorizer = model_bundle["vectorizer"]

            X = vectorizer.transform([raw_text])
            b_p = b_model.predict_proba(X)[0]
            classes = list(b_model.classes_)

            baseline_probs = {
                cls_name: float(b_p[i])
                for i, cls_name in enumerate(classes)
            }

        # Final probabilities based on mode
        if mode == "ensemble" and distilbert_probs and baseline_probs:
            final_probs = {
                k: round((distilbert_probs[k] + baseline_probs.get(k, 0.0)) / 2.0, 4)
                for k in LABELS
            }
            model_name = "Ensemble (DistilBERT + Baseline)"
        elif mode == "baseline" and baseline_probs:
            final_probs = {k: round(v, 4) for k, v in baseline_probs.items()}
            model_name = "Baseline Logistic Regression (TF-IDF)"
        else:
            final_probs = {k: round(v, 4) for k, v in (distilbert_probs or baseline_probs).items()}
            model_name = "Fine-Tuned DistilBERT (Normalized)"

        # Determine top predicted label
        sorted_items = sorted(final_probs.items(), key=lambda x: x[1], reverse=True)
        predicted_label = sorted_items[0][0]
        confidence = sorted_items[0][1]

        ranked_classes = [
            {"label": k, "probability": v, "percentage": round(v * 100, 1)}
            for k, v in sorted_items
        ]

        recommendation = RECOMMENDATIONS.get(
            predicted_label,
            {
                "severity": "moderate",
                "badge_color": "#6366f1",
                "summary": "Assessment recorded.",
                "tips": ["Prioritize self-care and maintain balance."],
                "is_crisis": False,
            },
        )

        return {
            "prediction": predicted_label,
            "confidence": confidence,
            "probabilities": final_probs,
            "ranked_classes": ranked_classes,
            "recommendation": recommendation,
            "model_name": model_name,
            "normalized_input": norm_text,
        }

    except Exception as e:
        print(f"Prediction error: {e}")
        raise HTTPException(status_code=500, detail=f"Inference error: {str(e)}")

if __name__ == "__main__":
    uvicorn.run("model_server:app", host="0.0.0.0", port=8000, reload=False)
