import asyncio
import json
from datetime import datetime
from typing import Dict, List, Optional
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, Form, HTTPException
from fastapi.staticfiles import StaticFiles
from fastapi.responses import HTMLResponse, FileResponse
import os
from dotenv import load_dotenv
from qiskit import QuantumCircuit
from qiskit.transpiler.preset_passmanagers import generate_preset_pass_manager
from qiskit_ibm_runtime import QiskitRuntimeService, SamplerV2 as Sampler
import uuid
import logging

# Load token from .env if available
load_dotenv()
IBM_TOKEN = os.getenv("IBM_QUANTUM_API_TOKEN")
service: Optional[QiskitRuntimeService] = None
api_token_saved = False
print(f"DEBUG: IBM_TOKEN from .env: {IBM_TOKEN}")
if IBM_TOKEN:
    try:
        service = QiskitRuntimeService(channel="ibm_quantum_platform", token=IBM_TOKEN)
        api_token_saved = True
        logging.info("IBM Quantum API token loaded from .env and service initialized.")
    except Exception as e:
        logging.error(f"Failed to initialize IBM service with token from .env: {e}")

import pandas as pd
import joblib
from pydantic import BaseModel

# Configure logging
logging.basicConfig(level=logging.INFO, format='%(asctime)s - %(levelname)s - %(message)s')
logging.info("main.py started: Initializing application.")

# ----------------------------
# 1️⃣ Load trained model and encoders
# ----------------------------
model = joblib.load("../ai_model/backend_recommender.pkl")
encoders = joblib.load("../ai_model/encoders.pkl")

# 2️⃣ Load backend CSV (full stats)
# ----------------------------
backend_df = pd.read_csv("../ai_model/backend_data_large1.csv")

app = FastAPI()

# ----------------------------
# 6️⃣ Define request model
# ----------------------------
class JobInput(BaseModel):
    circuit_depth: int
    gate_count: int
    error_tolerance: float
    job_type: str
    priority_level: str
    max_wait_time: int

# CORS configuration to allow local frontends
from fastapi.middleware.cors import CORSMiddleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=[
        "http://localhost:5173",
        "http://127.0.0.1:5173",
        "http://localhost:5174",
        "http://127.0.0.1:5174",
        "http://localhost:5175",
        "http://127.0.0.1:5175",
        "http://localhost:5176",
        "http://127.0.0.1:5176",
        "http://localhost:3000", # For local development
        "http://127.0.0.1:3000", # For local development
    ],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# In-memory job storage
JOBS_FILE = "jobs.json"
jobs: Dict[str, dict] = {}
active_connections: List[WebSocket] = []

# IBM Quantum Service instance
def load_jobs():
    global jobs
    if os.path.exists(JOBS_FILE):
        with open(JOBS_FILE, "r") as f:
            jobs = json.load(f)
            logging.info(f"Loaded {len(jobs)} jobs from {JOBS_FILE}")
    else:
        logging.info(f"No {JOBS_FILE} found. Starting with empty jobs.")

def save_jobs():
    with open(JOBS_FILE, "w") as f:
        json.dump(jobs, f, indent=4)
        logging.info(f"Saved {len(jobs)} jobs to {JOBS_FILE}")

# Load jobs on startup
load_jobs()

def get_predefined_circuit(circuit_type: str) -> QuantumCircuit:
    """Create predefined quantum circuits."""
    if circuit_type == "superposition":
        # 1 qubit superposition
        qc = QuantumCircuit(1, 1)
        qc.h(0)
        qc.measure(0, 0)
        return qc
    elif circuit_type == "bell_state":
        # 2 qubit Bell state
        qc = QuantumCircuit(2, 2)
        qc.h(0)
        qc.cx(0, 1)
        qc.measure([0, 1], [0, 1])
        return qc
    elif circuit_type == "quantum_random":
        # 1 qubit random number generator
        qc = QuantumCircuit(1, 1)
        qc.h(0)
        qc.measure(0, 0)
        return qc
    elif circuit_type == "quantum_fourier":
        # Simple Quantum Fourier Transform for 2 qubits
        qc = QuantumCircuit(2, 2)
        qc.h(0)
        qc.h(1)
        qc.swap(0, 1)
        qc.measure([0, 1], [0, 1])
        return qc
    elif circuit_type == "grover":
        # Simple Grover's algorithm for 2 qubits (example oracle for |11>)
        qc = QuantumCircuit(2, 2)
        qc.h([0, 1])
        qc.cz(0, 1) # Oracle for |11>
        qc.h([0, 1])
        qc.x([0, 1])
        qc.h(1)
        qc.cx(0, 1)
        qc.h(1)
        qc.x([0, 1])
        qc.h([0, 1])
        qc.measure([0, 1], [0, 1])
        return qc
    elif circuit_type == "vqe":
        # Simple VQE-like circuit (ansatz for H2 molecule, 2 qubits)
        qc = QuantumCircuit(2, 2)
        qc.ry(0.5, 0)
        qc.rx(0.5, 1)
        qc.cx(0, 1)
        qc.ry(0.5, 0)
        qc.rx(0.5, 1)
        qc.measure([0, 1], [0, 1])
        return qc
    else:
        raise ValueError(f"Unknown circuit type: {circuit_type}")

def get_circuit_description(circuit_type: str) -> str:
    """Get human-readable description for circuit types."""
    descriptions = {
        "superposition": "Superposition (1 qubit)",
        "bell_state": "Bell State (2 qubits)",
        "quantum_random": "Quantum Random (1 qubit)",
        "quantum_fourier": "Quantum Fourier Transform (2 qubits)",
        "grover": "Grover's Algorithm (2 qubits)",
        "vqe": "Variational Quantum Eigensolver (2 qubits)"
    }
    return descriptions.get(circuit_type, "Custom Circuit")


# ----------------------------
# 7️⃣ Recommendation endpoint
# ----------------------------
import httpx

@app.post("/api/recommend_backends")
async def api_recommend_backends(job: JobInput):
    """Proxy endpoint that forwards requests to the AI model server."""
    try:
        async with httpx.AsyncClient() as client:
            response = await client.post(
                "http://127.0.0.1:7777/recommend_backends",
                json=job.dict(),
                timeout=30.0
            )
            return response.json()
    except Exception as e:
        logging.error(f"Error proxying to AI model server: {e}")
        raise HTTPException(status_code=500, detail="Failed to get recommendations from AI model server")

@app.post("/recommend_backends")
def recommend_backends(job: JobInput):
    recs = []

    for _, backend in backend_df.iterrows():
        # Prepare input row for the model
        input_row = {
            "circuit_depth": job.circuit_depth,
            "gate_count": job.gate_count,
            "error_tolerance": job.error_tolerance,
            "max_wait_time": job.max_wait_time,
            "queue": backend["queue"],
            "success_rate": backend["success_rate"],
            "wait_time": backend["wait_time"],
            "avg_error": backend["avg_error"],
            "avg_noise": backend["avg_noise"],
            "ai_confidence": backend["ai_confidence"]
        }

        # Encode categorical fields
        for col in ["job_type", "priority_level", "backend_name", "processor_desc"]:
            le = encoders[col]
            if col == "job_type":
                try:
                    input_row[col + "_enc"] = le.transform([job.job_type])[0]
                except ValueError:
                    print(f"Warning: Unseen job_type '{job.job_type}'. Assigning default encoded value.")
                    input_row[col + "_enc"] = 0
            elif col == "priority_level":
                input_row[col + "_enc"] = le.transform([job.priority_level])[0]
            else:
                input_row[col + "_enc"] = le.transform([backend[col]])[0]

        # Convert to DataFrame
        X_input = pd.DataFrame([input_row])
        # Predict suitability
        predicted_suitability = model.predict(X_input)[0]

        recs.append({
            "backend_name": backend["backend_name"],
            "processor_desc": backend["processor_desc"],
            "status": backend["status"],
            "queue": backend["queue"],
            "wait_time": backend["wait_time"],
            "success_rate": backend["success_rate"],
            "ai_confidence": backend["ai_confidence"],
            "predicted_suitability": round(predicted_suitability, 3)
        })

    # Sort by predicted suitability descending and pick top 3
    top_recs = sorted(recs, key=lambda x: x["predicted_suitability"], reverse=True)[:3]

    return {"recommendations": top_recs}

@app.get("/")
async def read_root():
    """Serve the frontend."""
    index_path = os.path.join(os.path.dirname(__file__), "static", "index.html")
    return FileResponse(index_path)



@app.get("/token-status")
async def token_status():
    """Check if API token is configured."""
    global service, api_token_saved
    if not api_token_saved:
        return {"configured": False}
    return {"configured": api_token_saved}


@app.get("/backends")
async def get_backends():
    """Retrieve available IBM Quantum backends and their status."""
    logging.info("GET /backends endpoint hit.")
    if not service:
        logging.info("IBM Quantum service not initialized for /backends endpoint. Returning empty list.")
        return [] # Return empty list if service not initialized
    
    try:
        logging.info("Attempting to retrieve backends from IBM Quantum service.")
        backends = service.backends()
        logging.info(f"Successfully retrieved backends: {backends}")
        backend_data = []
        for backend in backends:
            status = backend.status()
            clops = getattr(backend.target, "clops", None)

            processor_type_display = "N/A"
            if backend.configuration() and hasattr(backend.configuration(), 'processor_type'):
                pt = backend.configuration().processor_type
                if isinstance(pt, dict):
                    family = pt.get('family', 'N/A')
                    revision = pt.get('revision', 'N/A')
                    processor_type_display = f"{family} {revision}"
                elif hasattr(pt, 'family') and hasattr(pt, 'revision'):
                    processor_type_display = f"{pt.family} {pt.revision}"
                elif isinstance(pt, str):
                    processor_type_display = pt

            backend_data.append({
                "name": backend.name,
                "qubits": backend.num_qubits if hasattr(backend, 'num_qubits') else "N/A",
                "status": status.status_msg,
                "operational": status.operational,
                "total_pending_jobs": status.pending_jobs,
                "version": backend.version if hasattr(backend, 'version') else "N/A",
                "processor_type": processor_type_display,
                "two_q_error_best": backend.properties().to_dict().get("gates", [{}])[0].get("parameters", [{}])[0].get("value") if backend.properties() else "N/A",
                "two_q_error_layered": backend.properties().to_dict().get("gates", [{}])[1].get("parameters", [{}])[0].get("value") if backend.properties() else "N/A",
                "clops": clops if clops is not None else (backend.configuration().clops if backend.configuration() and hasattr(backend.configuration(), 'clops') else "N/A"),
                "version": "N/A"
            })
        logging.info(f"Returning backend data: {backend_data}")
        return backend_data
    except Exception as e:
        logging.error(f"Error retrieving backends: {e}")
        # Return empty list on error to prevent frontend issues
        return []

@app.get("/kpis")
async def get_kpis():
    """Retrieve key performance indicators like total pending jobs."""
    logging.info("GET /kpis endpoint hit.")
    if not service:
        logging.info("IBM Quantum service not initialized for /kpis endpoint. Returning empty KPI data.")
        return {"total_pending_jobs": 0}
    
    try:
        total_pending_jobs = 0
        backends = service.backends()
        for backend in backends:
            status = backend.status()
            total_pending_jobs += status.pending_jobs
        
        return {"total_pending_jobs": total_pending_jobs}
    except Exception as e:
        logging.error(f"Error retrieving KPIs: {e}")
        return {"total_pending_jobs": 0}

@app.get("/jobs/recent")
async def get_recent_jobs():
    """Retrieve the 20 most recent jobs from the in-memory storage."""
    logging.info(f"Attempting to retrieve recent jobs. Current jobs store: {jobs}")
    print(f"DEBUG: Attempting to retrieve recent jobs. Current jobs store: {jobs}")
    # Sort jobs by creation_date in descending order and take the top 20
    recent_jobs = sorted(jobs.values(), key=lambda x: x["submitted_at"], reverse=True)[:20]
    logging.info(f"Returning recent jobs: {recent_jobs}")
    print(f"DEBUG: Returning recent jobs: {recent_jobs}")
    return recent_jobs

@app.post("/submit-job")
async def submit_job(
    job_name: str = Form(""),
    backend_name: str = Form(...),
    circuit_type: str = Form(...),
    shots: int = Form(1024)
):
    """Submit a quantum job to IBM Quantum."""
    global service, jobs
    
    if not service:
        raise HTTPException(status_code=400, detail="API token not configured. Please save your token first.")
    
    try:
        # Create the circuit
        circuit = get_predefined_circuit(circuit_type)
        
        # Get the backend
        backend = service.backend(backend_name)
        
        # Transpile the circuit to ISA format
        pm = generate_preset_pass_manager(backend=backend, optimization_level=1)
        isa_circuit = pm.run(circuit)
        
        # Submit job using SamplerV2
        sampler = Sampler(mode=backend)
        job = sampler.run([isa_circuit], shots=shots)
        job_id = job.job_id()
        
        # Store job info
        job_info = {
            "job_id": job_id,
            "job_name": job_name if job_name else f"Job-{job_id[:8]}",
            "backend": backend_name,
            "circuit": get_circuit_description(circuit_type),
            "status": "QUEUED",
            "submitted_at": datetime.now().isoformat(),
            "progress": 0,
            "shots": shots
        }
        jobs[job_id] = job_info
        save_jobs() # Save jobs after a new job is submitted
        
        # Broadcast to all connected clients
        await broadcast_job_update(job_info)
        
        # Start monitoring this job
        asyncio.create_task(monitor_job(job_id))
        
        return {"job_id": job_id, "message": "Job submitted successfully"}
    
    except Exception as e:
        raise HTTPException(status_code=500, detail=f"Failed to submit job: {str(e)}")

@app.get("/jobs")
async def get_jobs():
    """Get all jobs sorted by submission time."""
    sorted_jobs = sorted(
        jobs.values(),
        key=lambda x: x["submitted_at"],
        reverse=True
    )
    # Return only last 20 jobs
    return {"jobs": sorted_jobs[:20]}

async def monitor_job(job_id: str):
    """Monitor a job's status and update it."""
    global service, jobs
    
    if job_id not in jobs or service is None:
        return
    
    try:
        job = service.job(job_id)
        
        while True:
            try:
                status = job.status()
                status_str = str(status) if status else "UNKNOWN"
                
                # Update job info
                jobs[job_id]["status"] = status_str
                
                # Update progress based on status
                if status_str == "QUEUED":
                    jobs[job_id]["progress"] = 0
                elif status_str == "RUNNING":
                    jobs[job_id]["progress"] = 50
                elif status_str == "DONE":
                    jobs[job_id]["progress"] = 100
                elif "ERROR" in status_str or "CANCELLED" in status_str:
                    jobs[job_id]["status"] = "ERROR"
                    jobs[job_id]["progress"] = 0
                
                # Broadcast update
                await broadcast_job_update(jobs[job_id])
                
                # Stop monitoring if job is done
                if status_str in ["DONE", "CANCELLED", "ERROR"] or "ERROR" in status_str:
                    break
                
                await asyncio.sleep(5)  # Poll every 5 seconds
                
            except Exception as e:
                print(f"Error monitoring job {job_id}: {e}")
                jobs[job_id]["status"] = "ERROR"
                jobs[job_id]["progress"] = 0
                await broadcast_job_update(jobs[job_id])
                break
    
    except Exception as e:
        print(f"Failed to get job {job_id}: {e}")
        if job_id in jobs:
            jobs[job_id]["status"] = "ERROR"
            await broadcast_job_update(jobs[job_id])

async def broadcast_job_update(job_info: dict):
    """Broadcast job update to all connected WebSocket clients."""
    message = json.dumps({"type": "job_update", "data": job_info})
    
    disconnected = []
    for connection in active_connections:
        try:
            await connection.send_text(message)
        except Exception:
            disconnected.append(connection)
    
    # Remove disconnected clients
    for conn in disconnected:
        if conn in active_connections:
            active_connections.remove(conn)

@app.websocket("/ws/jobs")
async def websocket_endpoint(websocket: WebSocket):
    """WebSocket endpoint for real-time job updates."""
    await websocket.accept()
    active_connections.append(websocket)
    
    try:
        # Send current jobs on connection
        initial_data = {
            "type": "initial_jobs",
            "data": list(jobs.values())
        }
        await websocket.send_text(json.dumps(initial_data))
        
        # Keep connection alive
        while True:
            try:
                await websocket.receive_text()
            except WebSocketDisconnect:
                break
    except Exception as e:
        print(f"WebSocket error: {e}")
    finally:
        if websocket in active_connections:
            active_connections.remove(websocket)

# Mount static files
static_dir = os.path.join(os.path.dirname(__file__), "..", "frontend", "decoherex_analytics", "build")
app.mount("/static", StaticFiles(directory=static_dir), name="static")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5001)
