from fastapi import FastAPI
from pydantic import BaseModel, Field
from typing import Optional, Dict, Any
import os
import json
import math

app = FastAPI(title="ResQMap Severity AI Service")

# ----------------------------
# Config
# ----------------------------
MODEL_DIR = os.path.join(os.path.dirname(__file__), "..", "model", "severity_model_export")
CONF_THRESHOLD = float(os.getenv("SEVERITY_CONF_THRESHOLD", "0.60"))

# ----------------------------
# Request Schema
# ----------------------------
class WeatherInfo(BaseModel):
    temp: Optional[float] = None
    humidity: Optional[float] = None
    windSpeed: Optional[float] = None
    condition: Optional[str] = None

class IncidentPayload(BaseModel):
    type: str = Field(..., description="Incident type e.g. Fire, Flood, Road Accident")
    description: Optional[str] = ""
    latitude: Optional[float] = None
    longitude: Optional[float] = None

    # Fire extra hints (your updated mobile UI)
    subType: Optional[str] = None
    peopleAtRisk: Optional[bool] = None

    # Image is allowed in payload but we will NOT use it for severity now
    imageBase64: Optional[str] = None
    imageUrl: Optional[str] = None

    # Optional metadata
    weather: Optional[WeatherInfo] = None
    meta: Optional[Dict[str, Any]] = None


# ----------------------------
# Model Loader (HuggingFace)
# ----------------------------
MODEL_READY = False
MODEL_ERR = None
tokenizer = None
model = None
id2label = None

def softmax(logits):
    # stable softmax for list
    m = max(logits)
    exps = [math.exp(x - m) for x in logits]
    s = sum(exps)
    return [e / s for e in exps]

def normalize_label(lbl: str) -> str:
    v = (lbl or "").lower().strip()
    if v == "moderate":
        return "medium"
    if v in ("low", "medium", "high"):
        return v
    return "low"

def try_load_model():
    global MODEL_READY, MODEL_ERR, tokenizer, model, id2label
    try:
        if not os.path.isdir(MODEL_DIR):
            raise FileNotFoundError(f"Model dir not found: {MODEL_DIR}")

        # required files
        required = ["config.json", "model.safetensors", "tokenizer.json"]
        for f in required:
            if not os.path.exists(os.path.join(MODEL_DIR, f)):
                raise FileNotFoundError(f"Missing {f} in {MODEL_DIR}")

        from transformers import AutoTokenizer, AutoModelForSequenceClassification
        import torch

        tokenizer = AutoTokenizer.from_pretrained(MODEL_DIR)
        model = AutoModelForSequenceClassification.from_pretrained(MODEL_DIR)
        model.eval()

        # label mapping
        cfg_path = os.path.join(MODEL_DIR, "config.json")
        with open(cfg_path, "r", encoding="utf-8") as f:
            cfg = json.load(f)

        # id2label might be in config
        raw_id2label = cfg.get("id2label", None)
        if raw_id2label:
            # keys may be str; normalize to int keys
            id2label = {int(k): v for k, v in raw_id2label.items()}
        else:
            # fallback
            id2label = {0: "low", 1: "moderate", 2: "high"}

        MODEL_READY = True
        MODEL_ERR = None
        print("✅ Severity model loaded from:", MODEL_DIR)

    except Exception as e:
        MODEL_READY = False
        MODEL_ERR = str(e)
        print("⚠️ Severity model NOT loaded:", MODEL_ERR)

try_load_model()


# ----------------------------
# Fallback Heuristic (NO image)
# ----------------------------
def fallback_severity(payload: IncidentPayload):
    text = (payload.description or "").lower()
    t = (payload.type or "").lower()

    score = 0

    # type priors
    if "fire" in t:
        score += 2
    if "accident" in t:
        score += 2
    if "flood" in t:
        score += 1

    # keywords
    high_words = ["trapped", "unconscious", "collapse", "collapsed", "explosion", "bleeding", "multiple injured", "dead"]
    med_words  = ["smoke", "injured", "spreading", "panic", "damage", "blocked", "ambulance", "fire brigade"]

    for w in high_words:
        if w in text:
            score += 3
    for w in med_words:
        if w in text:
            score += 1

    # fire structured hints
    if payload.type == "Fire":
        if payload.peopleAtRisk is True:
            score += 4
        if payload.subType in ["Gas/Cylinder", "Electrical"]:
            score += 2

    if score >= 7:
        return {"severity": "high", "score": score}
    if score >= 3:
        return {"severity": "medium", "score": score}
    return {"severity": "low", "score": score}


# ----------------------------
# Predict Endpoint
# ----------------------------
@app.get("/health")
def health():
    return {
        "ok": True,
        "modelReady": MODEL_READY,
        "modelDir": MODEL_DIR,
        "modelError": MODEL_ERR,
        "threshold": CONF_THRESHOLD
    }

@app.post("/predict")
def predict(payload: IncidentPayload):
    # minimal text gate
    desc = (payload.description or "").strip()
    if len(desc) < 8:
        fb = fallback_severity(payload)
        return {
            "label": fb["severity"],
            "confidence": 0.0,
            "source": "fallback",
            "meta": {"reason": "desc_too_short", **fb}
        }

    # ML-first
    if MODEL_READY:
        try:
            import torch

            inputs = tokenizer(
                desc,
                truncation=True,
                padding=True,
                max_length=256,
                return_tensors="pt"
            )

            with torch.no_grad():
                out = model(**inputs)
                logits = out.logits.squeeze(0).tolist()

            probs = softmax(logits)
            pred_id = int(max(range(len(probs)), key=lambda i: probs[i]))
            raw_label = id2label.get(pred_id, "low")
            conf = float(probs[pred_id])

            final_label = normalize_label(raw_label)

            # confidence gate
            if conf < CONF_THRESHOLD:
                fb = fallback_severity(payload)
                return {
                    "label": fb["severity"],
                    "confidence": conf,
                    "source": "fallback",
                    "meta": {"reason": "low_confidence", "ml_raw": raw_label, "ml_conf": conf, **fb}
                }

            return {
                "label": final_label,
                "confidence": conf,
                "source": "ml",
                "meta": {"ml_raw": raw_label}
            }

        except Exception as e:
            fb = fallback_severity(payload)
            return {
                "label": fb["severity"],
                "confidence": 0.0,
                "source": "fallback",
                "meta": {"reason": "ml_error", "error": str(e), **fb}
            }

    # No model available -> fallback
    fb = fallback_severity(payload)
    return {
        "label": fb["severity"],
        "confidence": 0.0,
        "source": "fallback",
        "meta": {"reason": "model_not_loaded", **fb}
    }
