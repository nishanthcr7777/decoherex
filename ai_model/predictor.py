import logging
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from pydantic import BaseModel
import pandas as pd
import joblib
import time

# ----------------------------
# 1️⃣ Load trained model and encoders
# ----------------------------
start_time = time.time()
model = joblib.load("backend_recommender.pkl")
encoders = joblib.load("encoders.pkl")

# ----------------------------
# 2️⃣ Load backend CSV (full stats)
# ----------------------------
backend_df = pd.read_csv("backend_data_large1.csv")

load_time = time.time() - start_time
print(f"✅ Model and data loaded in {load_time:.2f} seconds")

# ----------------------------
# 3️⃣ FastAPI app
# ----------------------------
app = FastAPI(title="Quantum Backend Recommender")

# ----------------------------
# 4️⃣ CORS middleware
# ----------------------------
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:5174", "http://localhost:5175", "http://localhost:5176"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# ----------------------------
# 5️⃣ Root endpoint
# ----------------------------
@app.get("/")
def root():
    return {"message": "Quantum Backend Recommender backend is live!"}

# ----------------------------
# 6️⃣ Job input schema
# ----------------------------
class JobInput(BaseModel):
    circuit_depth: int
    gate_count: int
    error_tolerance: float
    job_type: str
    priority_level: str
    max_wait_time: int

# ----------------------------
# 7️⃣ Warm-up prediction (run once at startup)
# ----------------------------
@app.on_event("startup")
def warmup_model():
    print("🔥 Warming up model for first prediction...")
    try:
        df = backend_df.head(5).copy()
        df["circuit_depth"] = 10
        df["gate_count"] = 20
        df["error_tolerance"] = 0.01
        df["max_wait_time"] = 100
        df["job_type_enc"] = encoders["job_type"].transform(["BellState"] * len(df))
        df["priority_level_enc"] = encoders["priority_level"].transform(["Medium"] * len(df))
        df["backend_name_enc"] = encoders["backend_name"].transform(df["backend_name"])
        df["processor_desc_enc"] = encoders["processor_desc"].transform(df["processor_desc"])
        feature_cols = [
            "circuit_depth", "gate_count", "error_tolerance", "max_wait_time",
            "queue", "success_rate", "wait_time", "avg_error", "avg_noise", "ai_confidence",
            "job_type_enc", "priority_level_enc", "backend_name_enc", "processor_desc_enc"
        ]
        _ = model.predict(df[feature_cols])
        print("✅ Model warm-up complete!")
    except Exception as e:
        print(f"⚠️ Warm-up failed: {e}")

# ----------------------------
# 8️⃣ Recommendation endpoint
# ----------------------------
@app.post("/recommend_backends")
def recommend_backends(job: JobInput):
    df = backend_df.copy()

    # Add user job fields
    df["circuit_depth"] = job.circuit_depth
    df["gate_count"] = job.gate_count
    df["error_tolerance"] = job.error_tolerance
    df["max_wait_time"] = job.max_wait_time

    # Encode categorical fields
    df["job_type_enc"] = encoders["job_type"].transform([job.job_type] * len(df))
    df["priority_level_enc"] = encoders["priority_level"].transform([job.priority_level] * len(df))
    df["backend_name_enc"] = encoders["backend_name"].transform(df["backend_name"])
    df["processor_desc_enc"] = encoders["processor_desc"].transform(df["processor_desc"])

    # Select features
    feature_cols = [
        "circuit_depth", "gate_count", "error_tolerance", "max_wait_time",
        "queue", "success_rate", "wait_time", "avg_error", "avg_noise", "ai_confidence",
        "job_type_enc", "priority_level_enc", "backend_name_enc", "processor_desc_enc"
    ]

    # ✅ Single batched prediction
    df["suitability"] = model.predict(df[feature_cols])

    # Deduplicate by backend name (keep top-performing)
    df = df.sort_values("suitability", ascending=False).drop_duplicates("backend_name")

    # Top 3 recommendations
    top_recs = df.head(3)

    recs = []
    for _, backend in top_recs.iterrows():
        recs.append({
            "circuit_depth": job.circuit_depth,
            "gate_count": job.gate_count,
            "error_tolerance": job.error_tolerance,
            "job_type": job.job_type,
            "priority_level": job.priority_level,
            "max_wait_time": job.max_wait_time,
            "backend_name": backend["backend_name"],
            "queue": int(backend["queue"]), 
            "success_rate": float(backend["success_rate"]), 
            "wait_time": int(backend["wait_time"]), 
            "status": backend["status"],
            "avg_error": float(backend["avg_error"]), 
            "avg_noise": float(backend["avg_noise"]), 
            "ai_confidence": float(backend["ai_confidence"]), 
            "processor_desc": backend["processor_desc"],
            "suitability": round(float(backend["suitability"]), 3), 
            "prediction_score": round(float(backend["suitability"]), 3)
        })

    return {"recommendations": recs}

# ----------------------------
# 9️⃣ Run command
# uvicorn predictor:app --reload --port 7777
# ----------------------------
