import asyncio
import json
import random
from datetime import datetime, timedelta
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
import io
import base64
import matplotlib.pyplot as plt
from qiskit_aer import AerSimulator
from qiskit import transpile
from qiskit.visualization import circuit_drawer
from groq import Groq

# Load token from .env if available
load_dotenv()
IBM_TOKEN = os.getenv("IBM_QUANTUM_API_TOKEN")
GROQ_API_KEY = os.getenv("GROQ_API_KEY")
service: Optional[QiskitRuntimeService] = None
api_token_saved = False
print(f"DEBUG: IBM_TOKEN from .env: {IBM_TOKEN}")

# Initialize Groq Client
groq_client = None
if GROQ_API_KEY:
    try:
        groq_client = Groq(api_key=GROQ_API_KEY)
        logging.info("Groq API client initialized.")
    except Exception as e:
        logging.error(f"Failed to initialize Groq client: {e}")
else:
    logging.warning("GROQ_API_KEY not found. AI generation will fallback to rule-based.")
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
    """
    Directly calculate backend recommendations using the loaded Random Forest model.
    Replaces the external microservice call for better performance and simplicity.
    """
    try:
        if model is None or encoders is None:
            # Fallback if model failed to load
            logging.warning("AI model not loaded. Returning empty recommendations.")
            return {"recommendations": []}

        # Create a DataFrame from the backend data
        df = backend_df.copy()

        # Add user job fields to every row (broadcasting)
        df["circuit_depth"] = job.circuit_depth
        df["gate_count"] = job.gate_count
        df["error_tolerance"] = job.error_tolerance
        df["max_wait_time"] = job.max_wait_time

        # Encode categorical fields using the loaded encoders
        # We handle single-value encoding by creating a list of the same value for the whole column
        try:
            df["job_type_enc"] = encoders["job_type"].transform([job.job_type] * len(df))
        except ValueError:
             # Handle unseen labels by defaulting to 0 or a known class
             df["job_type_enc"] = 0
             
        try:
            df["priority_level_enc"] = encoders["priority_level"].transform([job.priority_level] * len(df))
        except ValueError:
            df["priority_level_enc"] = 0

        # Encode backend-specific columns (already present in df, just need encoding)
        df["backend_name_enc"] = encoders["backend_name"].transform(df["backend_name"])
        df["processor_desc_enc"] = encoders["processor_desc"].transform(df["processor_desc"])

        # Select features exactly as the model expects
        feature_cols = [
            "circuit_depth", "gate_count", "error_tolerance", "max_wait_time",
            "queue", "success_rate", "wait_time", "avg_error", "avg_noise", "ai_confidence",
            "job_type_enc", "priority_level_enc", "backend_name_enc", "processor_desc_enc"
        ]

        # ✅ Vectorized Prediction
        df["suitability"] = model.predict(df[feature_cols])
        
        # Deduplicate by backend name (keep top-performing if duplicates exist)
        # Sort by suitability descending
        df = df.sort_values("suitability", ascending=False).drop_duplicates("backend_name")

        # Select Top 3 recommendations
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

    except Exception as e:
        logging.error(f"Error in AI recommendation: {e}")
        # Return empty list or basic fallback instead of 500 to keep UI alive
        return {"recommendations": []}

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
    circuit_type: Optional[str] = Form(None),
    custom_code: Optional[str] = Form(None),
    shots: int = Form(1024)
):
    """Submit a quantum job to IBM Quantum."""
    global service, jobs
    
    if not service:
        raise HTTPException(status_code=400, detail="API token not configured. Please save your token first.")
    
    try:
        # Create the circuit
        circuit = None
        
        if custom_code:
            # SANITIZE AND EXECUTE CUSTOM CODE
            sanitized_code = custom_code
            sanitized_code = sanitized_code.replace("from qiskit.providers.aer import Aer", "")
            sanitized_code = sanitized_code.replace("from qiskit import BasicAer", "")
            # Patch deprecated usage of RX, RY, RZ imports
            sanitized_code = sanitized_code.replace("from qiskit.circuit.library import RX", "from qiskit.circuit.library import RXGate as RX")
            sanitized_code = sanitized_code.replace("from qiskit.circuit.library import RY", "from qiskit.circuit.library import RYGate as RY")
            sanitized_code = sanitized_code.replace("from qiskit.circuit.library import RZ", "from qiskit.circuit.library import RZGate as RZ")
            sanitized_code = sanitized_code.replace("from qiskit.circuit.library import X", "from qiskit.circuit.library import XGate as X")
            sanitized_code = sanitized_code.replace("from qiskit.circuit.library import Y", "from qiskit.circuit.library import YGate as Y")
            sanitized_code = sanitized_code.replace("from qiskit.circuit.library import Z", "from qiskit.circuit.library import ZGate as Z")
            sanitized_code = sanitized_code.replace("from qiskit.circuit.library import H", "from qiskit.circuit.library import HGate as H")

            # Pre-populate scope with common imports to match user expectations
            local_scope = {
                "QuantumCircuit": QuantumCircuit,
                "np": __import__("numpy")
            }
            exec(sanitized_code, local_scope, local_scope)
            
            if "qc" not in local_scope:
                raise HTTPException(status_code=400, detail="Custom code must define a 'qc' variable.")
            
            circuit = local_scope["qc"]
            if not isinstance(circuit, QuantumCircuit):
                 raise HTTPException(status_code=400, detail="'qc' is not a valid QuantumCircuit object.")
                 
        elif circuit_type:
            circuit = get_predefined_circuit(circuit_type)
        else:
            raise HTTPException(status_code=400, detail="Either circuit_type or custom_code must be provided.")
        
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
            "circuit": "Custom Code" if custom_code else get_circuit_description(circuit_type),
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
                elif status_str in ["DONE", "COMPLETED"]:
                    jobs[job_id]["progress"] = 100
                    
                    # Fetch and store results only if not already stored
                    if "results" not in jobs[job_id]:
                        try:
                            result = job.result()
                            # Extract quasi-dists from the first PUB (since we send 1 circuit)
                            # Result structure depends on Sampler version, but typically result[0].data.meas or similar
                            # The user snippet suggests result[0].data.c (classical register) or .quasi_dists
                            
                            # Robust extraction logic for SamplerV2
                            pub_result = result[0]
                            data_dict = pub_result.data
                            
                            # Find the classical register holding measurements (usually 'c' or 'meas')
                            # We'll try to find a BitArray or similar, but SamplerV2 often separates it.
                            # Actually, for SamplerV2, get_counts() might not be direct.
                            # User snippet: quasi = pub_result.data.c
                            
                            output_data = {}
                            
                            # Iterate over data fields to find the measurement data
                            # It's usually a BitArray that we can get counts/quasi from if we knew how,
                            # BUT user explicitly said: quasi = pub_result.data.c
                            # Let's try to inspect the keys and grab the first one that looks like a register
                            
                            keys = list(data_dict.keys())
                            if keys:
                                # target the first register (e.g. 'c' or 'meas')
                                creg_name = keys[0]
                                meas_data = getattr(data_dict, creg_name)
                                
                                # If it has .get_counts(), use it. If it's a BitArray, it has .get_counts() or similar?
                                # NO, user said "quasi = pub_result.data.c" returns quasi-dists directly?
                                # actually user said: "quasi = pub_result.data.c ... print(quasi) -> {0: 0.51}"
                                # So let's trust the user snippet for data access:
                                
                                quasi_dists = meas_data # Assuming this is the dict-like object or we can iterate
                                
                                # If it's a BitArray (SamplerV2 default), we might need .get_counts() or .get_probabilities()
                                # But let's try to format whatever we get.
                                
                                # FALLBACK: standardized extraction
                                # If it's a dictionary of int -> float
                                if hasattr(meas_data, 'items'): 
                                    mapped_results = {}
                                    for k, v in meas_data.items():
                                        # distinct handling for bitstrings vs ints
                                        label = str(k)
                                        if isinstance(k, int):
                                             # Try to format as binary if we know num_qubits, or just hex/int
                                             # For simplicity, let's keep it as string
                                             label = str(k) 
                                        mapped_results[label] = v
                                    output_data = mapped_results
                                    
                                # If it's a BitArray (from qiskit 1.0+ runtime), call get_counts() logic?
                                elif hasattr(meas_data, 'get_counts'):
                                    # This is a BitArray object (Sampler V2) or similar
                                    # get_counts() returns a dictionary of bitstrings -> counts
                                    output_data = meas_data.get_counts()
                                else:
                                    # Maybe it's a BitArray, convert to list of bitstrings?
                                    # For a hackathon, just stringifying might be safest fallback
                                    output_data = str(meas_data)

                            
                            jobs[job_id]["results"] = output_data
                            # Also set a simple "output" field for the modal's current view
                            jobs[job_id]["output"] = str(output_data)

                        except Exception as res_e:
                            print(f"Error fetching results: {res_e}")
                            jobs[job_id]["error"] = str(res_e)

                    # Save and broadcast final state
                    save_jobs()
                    await broadcast_job_update(jobs[job_id])
                    break # Stop monitoring
                
                elif status_str in ["ERROR", "FAILED", "CANCELLED"]:
                    jobs[job_id]["status"] = "FAILED"
                     # Try to get error message
                    try:
                        jobs[job_id]["error"] = str(job.error_message())
                    except:
                        pass
                    save_jobs()
                    await broadcast_job_update(jobs[job_id])
                    break
                
                # Broadcast update if status changed or just heartbeat
                save_jobs()
                await broadcast_job_update(jobs[job_id])
                
                await asyncio.sleep(2)  # Poll every 2 seconds
                
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

# ----------------------------
# 8️⃣ Quantum Lab API (AI & Simulation)
# ----------------------------

class GenerateRequest(BaseModel):
    prompt: str

class SimulateRequest(BaseModel):
    code: str

@app.post("/api/ai/generate")
async def generate_circuit_code(request: GenerateRequest):
    """
    Generates Qiskit code from a natural language prompt using Groq API.
    Fallback to rule-based if API key is missing.
    """
    prompt = request.prompt.lower()
    code = ""
    
    # Check if Groq is available
    if groq_client:
        try:
            model_name = os.getenv("GROQ_MODEL", "llama-3.3-70b-versatile")
            logging.info(f"Using Groq model: {model_name}")
            
            completion = groq_client.chat.completions.create(
                messages=[
                    {
                        "role": "system",
                        "content":""" You are a quantum computing expert specializing in Qiskit.

Task:
Generate ONLY valid, correct Python code that constructs a QuantumCircuit.

STRICT RULES:
1. The code MUST define a variable named `qc` of type QuantumCircuit.
2. Return ONLY raw Python code. Do NOT use markdown, backticks, or explanations.
3. Include all required imports explicitly (e.g., `from qiskit import QuantumCircuit`).
4. **DO NOT import or use `execute`, `Aer`, or `BasicAer`. these are deprecated.**
5. **DO NOT use `qc.mct()`. Use `qc.mcx()` for multi-controlled X gates.**
6. **DO NOT use deprecated gates `u1`, `u2`, `u3`. Use `p`, `sx`, or `u` instead.**
7. **DO NOT import `RX`, `RY`, `RZ` directly from `qiskit.circuit.library`. Use `RXGate`, `RYGate`, `RZGate` or simply `qc.rx()`, `qc.ry()`, `qc.rz()` methods.**
8. **DO NOT run the circuit. Just build the circuit object `qc`.**
8. Do NOT simulate classical logic using loops over basis states.
9. All quantum operations must be unitary and reversible.
10. If implementing a known algorithm (Grover, QFT, etc.), follow the canonical structure exactly.
11. Grover-specific rules (if applicable):
   - Initialize with H gates.
   - Oracle must phase flip marked states.
   - Diffusion: H -> X -> mcx -> X -> H.
12. End with `qc.measure_all()` to ensure the circuit produces results, UNLESS the user explicitly asks for no measurements.
13. Keep the circuit minimal, correct, and executable in Qiskit 1.0+.

If you are uncertain, output the simplest correct circuit that satisfies the request.
"""
                    },
                    {
                        "role": "user",
                        "content": request.prompt
                    }
                ],
                model=model_name,
                temperature=0.1,
            )
            code = completion.choices[0].message.content.strip()
            
            # Cleanup markdown using regex to ensure only code is returned
            import re
            match = re.search(r"```(?:python)?\n?(.*?)```", code, re.DOTALL)
            if match:
                code = match.group(1).strip()
            else:
                # If no markdown blocks, assume the whole text is code but strip distinct markdown-like artifacts manually if any
                code = code.replace("```python", "").replace("```", "").strip()
            

            return {
                "code": code,
                "model_used": model_name
            }
            
        except Exception as e:
            logging.error(f"Groq API Error: {e}")
            # Fallback to rule-based if API fails
            pass

    # Fallback Rule-Based Logic
    fallback_model = "Rule-Based (Fallback)"
    if "bell" in prompt:
        code = """from qiskit import QuantumCircuit

# Bell State
qc = QuantumCircuit(2, 2)
qc.h(0)
qc.cx(0, 1)
qc.measure([0, 1], [0, 1])"""
    elif "ghz" in prompt:
        code = """from qiskit import QuantumCircuit

# GHZ State (3 qubits)
qc = QuantumCircuit(3, 3)
qc.h(0)
qc.cx(0, 1)
qc.cx(1, 2)
qc.measure([0, 1, 2], [0, 1, 2])"""
    elif "teleport" in prompt:
        code = """from qiskit import QuantumCircuit

# Quantum Teleportation
qc = QuantumCircuit(3, 3)
# Entanglement
qc.h(1)
qc.cx(1, 2)
# Prepare payload
qc.x(0) 
qc.h(0)
# Teleport
qc.cx(0, 1)
qc.h(0)
qc.measure([0, 1], [0, 1])
qc.cx(1, 2)
qc.cz(0, 2)
qc.measure(2, 2)"""
    elif "fourier" in prompt or "qft" in prompt:
        code = """from qiskit import QuantumCircuit
import numpy as np

# QFT (2 qubits)
qc = QuantumCircuit(2, 2)
qc.h(0)
qc.cp(np.pi/2, 1, 0)
qc.h(1)
qc.swap(0, 1)
qc.measure([0, 1], [0, 1])"""
    elif "grover" in prompt:
        code = """from qiskit import QuantumCircuit

# Grover's Algorithm (2 qubits)
qc = QuantumCircuit(2, 2)
qc.h([0, 1])
qc.cz(0, 1) # Oracle
qc.h([0, 1])
qc.x([0, 1])
qc.cz(0, 1)
qc.x([0, 1])
qc.h([0, 1])
qc.measure([0, 1], [0, 1])"""
    else:
        # Fallback / Template
        code = """from qiskit import QuantumCircuit

# Standard Superposition
qc = QuantumCircuit(1, 1)
qc.h(0)
qc.measure(0, 0)"""

    return {
        "code": code, 
        "model_used": fallback_model,
        "note": "AI generation failed or key missing. Returning template."
    }

@app.post("/api/simulate")
async def simulate_circuit(request: SimulateRequest):
    """
    Executes Qiskit code on a local Aer simulator using a secure(r) scope approach.
    """
    try:
        # SANITIZE CODE: Remove legacy imports that might cause errors
        sanitized_code = request.code
        sanitized_code = sanitized_code.replace("from qiskit import execute", "")
        sanitized_code = sanitized_code.replace("from qiskit import Aer", "")
        sanitized_code = sanitized_code.replace("from qiskit.providers.aer import Aer", "")
        sanitized_code = sanitized_code.replace("from qiskit import BasicAer", "")
        
        # Patch deprecated usage of RX, RY, RZ imports
        sanitized_code = sanitized_code.replace("from qiskit.circuit.library import RX", "from qiskit.circuit.library import RXGate as RX")
        sanitized_code = sanitized_code.replace("from qiskit.circuit.library import RY", "from qiskit.circuit.library import RYGate as RY")
        sanitized_code = sanitized_code.replace("from qiskit.circuit.library import RZ", "from qiskit.circuit.library import RZGate as RZ")
        sanitized_code = sanitized_code.replace("from qiskit.circuit.library import X", "from qiskit.circuit.library import XGate as X")
        sanitized_code = sanitized_code.replace("from qiskit.circuit.library import Y", "from qiskit.circuit.library import YGate as Y")
        sanitized_code = sanitized_code.replace("from qiskit.circuit.library import Z", "from qiskit.circuit.library import ZGate as Z")
        sanitized_code = sanitized_code.replace("from qiskit.circuit.library import H", "from qiskit.circuit.library import HGate as H")
        
        # 1. EXECUTE IN ISOLATED SCOPE
        # Pre-populate scope with common imports to match user expectations
        local_scope = {
            "QuantumCircuit": QuantumCircuit,
            "np": __import__("numpy")
        }
        # Pass local_scope as both globals and locals to ensure imports are visible
        exec(sanitized_code, local_scope, local_scope)
        
        if "qc" not in local_scope:
            return {"error": "Code must define a variable named 'qc'."}
        
        qc = local_scope["qc"]
        
        if not isinstance(qc, QuantumCircuit):
            return {"error": "qc is not a valid QuantumCircuit object."}
        
        # 2. ENSURE MEASUREMENTS for Aer
        if qc.num_clbits == 0:
            qc.measure_all()
        
        # 3. SIMULATE SAFELY
        simulator = AerSimulator()
        # Restrict basis gates to avoid Aer choking on exotic instructions
        transpiled_qc = transpile(
            qc, 
            simulator, 
            optimization_level=1, 
            basis_gates=["cx", "sx", "x", "rz", "measure", "h", "z", "y", "id", "barrier", "reset"]
        )
        
        job = simulator.run(transpiled_qc, shots=1024)
        result = job.result()
        try:
            counts = result.get_counts()
        except Exception:
             counts = {"error": "No counts generated. Circuit might be empty."}
        
        # 4. GENERATE DIAGRAM ROBUSTLY
        img_buf = io.BytesIO()
        # qc.draw() returns a Figure in 'mpl' mode
        fig = qc.draw(output="mpl")
        fig.savefig(img_buf, format="png", bbox_inches="tight")
        # Critical: Close the figure to prevent memory leaks/context issues
        plt.close(fig)
        
        img_buf.seek(0)
        img_b64 = base64.b64encode(img_buf.read()).decode('utf-8')
        
        return {
            "counts": counts,
            "diagram": f"data:image/png;base64,{img_b64}"
        }
        
    except Exception as e:
        print(f"Simulation Error: {e}")
        return {"error": str(e)}

# Mount static files
static_dir = os.path.join(os.path.dirname(__file__), "..", "frontend", "decoherex_analytics", "build")
app.mount("/static", StaticFiles(directory=static_dir), name="static")


# --------------------------------------------------------------------------------
# DASHBOARD REAL DATA ENDPOINT
# --------------------------------------------------------------------------------
@app.get("/api/dashboard-data")
async def get_dashboard_data():
    try:
        csv_path = os.path.join(os.path.dirname(__file__), "../ai_model/backend_data_large1.csv")
        if not os.path.exists(csv_path):
            return {"error": "CSV file not found"}

        df = pd.read_csv(csv_path)
        
        # 1. GENERATE SYNTHETIC DATES (Last 30 Days) as CSV has no timestamp
        # We assign a random date in the last 30 days to each row
        today = datetime.now()
        dates = [today - timedelta(days=random.randint(0, 29), hours=random.randint(0, 23)) for _ in range(len(df))]
        df['timestamp'] = dates
        df['date_str'] = df['timestamp'].dt.strftime('%Y-%m-%d')
        
        # ----------------------------------------------------------------
        # 2. AGGREGATES FOR CHARTS
        # ----------------------------------------------------------------
        
        # A. PERFORMANCE TRENDS (Daily Avg)
        trends_df = df.groupby('date_str').agg({
            'wait_time': 'mean',
            'success_rate': 'mean',
            'avg_error': 'mean'
        }).reset_index()
        trends_data = []
        for _, row in trends_df.iterrows():
            trends_data.append({
                "date": row['date_str'],
                "avgExecutionTime": round(row['wait_time'] * 10, 0), # Scale up for ms effect
                "successRate": round(row['success_rate'] * 100, 1),
                "errorRate": round(row['avg_error'] * 1000, 2)
            })
        trends_data.sort(key=lambda x: x['date'])

        # B. VOLUME ANALYSIS (Jobs per Type per Day)
        # Pivot table: Index=Date, Columns=JobType, Values=Count
        volume_df = df.pivot_table(index='date_str', columns='job_type', aggfunc='size', fill_value=0).reset_index()
        # Ensure standard columns exist even if 0
        volume_data = []
        for _, row in volume_df.iterrows():
            entry = {"date": row['date_str']}
            for job_type in ['BellState', 'Grover', 'QAOA', 'QuantumFourier', 'VQE']:
                entry[job_type] = int(row.get(job_type, 0))
            volume_data.append(entry)
        volume_data.sort(key=lambda x: x['date'])

        # C. CAPACITY UTILIZATION (Queue Length per Day)
        capacity_df = df.groupby('date_str')['queue'].mean().reset_index()
        capacity_data = []
        for _, row in capacity_df.iterrows():
            current_load = min(row['queue'] / 5.0, 100) # Normalize arbitrary queue size to %
            capacity_data.append({
                "date": row['date_str'],
                "current": round(current_load, 1),
                "forecast": round(current_load * (1 + random.uniform(-0.1, 0.1)), 1),
                "capacity": 100
            })
        capacity_data.sort(key=lambda x: x['date'])

        # D. ERROR PATTERNS (Error Types proxy)
        # We don't have error types in CSV, so we map 'avg_error' ranges to 'Warning/Critical'
        error_data = []
        for _, row in trends_df.iterrows():
            err_val = row['avg_error']
            # Synthetic distribution of error types based on volume
            count = int(err_val * 10000) # Arbitrary scale
            error_data.append({
                "date": row['date_str'],
                "errorCount": count,
                "warning": max(0, count - 5),
                "critical": min(5, count)
            })
        error_data.sort(key=lambda x: x['date'])

        # ----------------------------------------------------------------
        # 3. BACKEND RANKING (Global Aggregates)
        # ----------------------------------------------------------------
        ranking_df = df.groupby('backend_name').agg({
            'success_rate': 'mean',
            'wait_time': 'mean',
            'queue': 'mean',
            'processor_desc': 'first', # Assume constant
            'status': 'last' # Assume last status is current
        }).reset_index()
        
        ranking_data = []
        possible_status = ['online', 'maintenance', 'offline']
        
        for _, row in ranking_df.iterrows():
            # Calculate a synthetic 'Overall Score'
            # Score = (Success * 50) + (100 - ScaledQueue * 0.1) ... simple heuristic
            s_rate = row['success_rate']
            q_len = row['queue']
            score = (s_rate * 100 * 0.6) + (max(0, 100 - q_len/5) * 0.4)
            
            fullname = row['backend_name']
            # Clean name "ibm_brisbane" -> "IBM Brisbane"
            clean_name = fullname.replace("ibm_", "IBM ").title()
            
            ranking_data.append({
                "id": row['backend_name'],
                "name": clean_name,
                "description": row['processor_desc'],
                "status": row['status'].lower() if row['status'] else 'online',
                "overallScore": int(score),
                "avgExecutionTime": int(row['wait_time'] * 10),
                "successRate": round(row['success_rate'] * 100, 1),
                "utilization": int(min(q_len / 4, 100))
            })

        # ----------------------------------------------------------------
        # 4. RECENT JOBS LIST
        # ----------------------------------------------------------------
        # Get recent 100 sorted by timestamp
        recent_df = df.sort_values(by='timestamp', ascending=False).head(100)
        jobs_data = []
        for idx, row in recent_df.iterrows():
            jobs_data.append({
                "jobId": f"QJ-{10000+idx}",
                "backend": row['backend_name'].replace("ibm_", "IBM ").title(),
                "jobType": row['job_type'],
                "status": "completed" if row['success_rate'] > 0.5 else "failed", # Heuristic
                "executionTime": int(row['wait_time'] * 10), # ms
                "queueTime": int(row['queue'] * 100), # ms proxy
                "successRate": int(row['success_rate'] * 100),
                "timestamp": row['timestamp'].isoformat()
            })

        return {
            "trends": trends_data,
            "volume": volume_data,
            "capacity": capacity_data,
            "errors": error_data,
            "ranking": ranking_data,
            "jobs": jobs_data
        }

    except Exception as e:
        print(f"Error serving dashboard data: {e}")
        return {"error": str(e)}

# ----------------------------
# 8️⃣ Chatbot / AI Assistant
# ----------------------------
class ChatRequest(BaseModel):
    message: str

@app.post("/api/chat")
async def chat_endpoint(request: ChatRequest):
    """
    Answer user questions about the system state using Groq AI.
    """
    if not groq_client:
        return {"response": "I'm sorry, my AI brain (Groq) is not connected. Please check the API key."}

    try:
        user_message = request.message
        
        # 1. Summarize Job History
        job_summary = []
        for j_id, j_data in jobs.items():
            job_summary.append({
                "id": j_id[:8], 
                "name": j_data.get("job_name", "Unnamed"),
                "status": j_data.get("status"),
                "backend": j_data.get("backend"),
                "result": j_data.get("results"),
                "error": j_data.get("error")
            })
        job_summary = job_summary[-10:] # Last 10 jobs

        # 2. Summarize Backend Health (NEW)
        # Select key columns for the AI to understand system status
        backend_context = []
        if 'backend_df' in globals():
            # Get latest status for each unique backend
            # Sort by priority or success_rate to help AI recommend best ones
            for _, row in backend_df.drop_duplicates('backend_name').iterrows():
                backend_context.append({
                    "name": row['backend_name'],
                    "status": row['status'],
                    "queue": int(row['queue']),
                    "success_rate": f"{round(row['success_rate'] * 100, 1)}%",
                    "pending_jobs": int(row['queue']), # Alias for clarity
                    "avg_wait": f"{int(row['wait_time'])} sec"
                })

        system_context = f"""
        You are 'Quo', the AI Assistant for the Decoherex Quantum Dashboard.
        Your goal is to help users understand their quantum jobs and the system status.
        
        Current System Time: {datetime.now().isoformat()}
        
        [LIVE SYSTEM STATUS]
        {json.dumps(backend_context, indent=2)}

        [USER JOB HISTORY]
        {json.dumps(job_summary, indent=2)}
        
        Rules:
        1. Be concise and helpful.
        2. If asked for recommendations (e.g., "fastest backend", "most reliable"), use the [LIVE SYSTEM STATUS] data.
           - Example: "IBM Torino is the best choice with 98% success rate."
        3. If a job failed, verify if that backend has high error rates in status.
        4. If the user asks for code, provide python/qiskit code blocks.
        5. Do not hallucinate.
        """

        completion = groq_client.chat.completions.create(
            messages=[
                {"role": "system", "content": system_context},
                {"role": "user", "content": user_message}
            ],
            # Use a supported model
            model="llama-3.3-70b-versatile", 
            temperature=0.5,
            max_tokens=400
        )
        
        ai_reply = completion.choices[0].message.content
        return {"response": ai_reply}

    except Exception as e:
        logging.error(f"Chat Error: {e}")
        return {"response": "I encountered a quantum fluctuation while thinking. Please try again."}

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=5001)
