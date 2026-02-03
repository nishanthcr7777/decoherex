import asyncio
import os
import sys
from datetime import datetime
from dotenv import load_dotenv

# Add current directory to path so we can import dependencies if needed
sys.path.append(os.path.dirname(os.path.abspath(__file__)))

# Load env vars
load_dotenv()

# Mocking the service for the debug script if we can't easily import the full heavyweight main.py
# However, to test effectively, we need the real Qiskit service and Supabase client.
# Let's try to set them up independently to avoid import side-effects from main.py

try:
    from supabase import create_client, Client
    from qiskit_ibm_runtime import QiskitRuntimeService
except ImportError as e:
    print(f"❌ Missing dependencies: {e}")
    sys.exit(1)

# Init Supabase
url = os.environ.get("SUPABASE_URL")
key = os.environ.get("SUPABASE_KEY")
if not url or not key:
    print("❌ SUPABASE_URL or SUPABASE_KEY missing in .env")
    sys.exit(1)

print(f"Connecting to Supabase at {url}...")
supabase: Client = create_client(url, key)

# Init IBM Quantum
token = os.environ.get("IBM_QUANTUM_API_TOKEN")
if not token:
    print("❌ IBM_QUANTUM_API_TOKEN missing in .env")
    sys.exit(1)

print("Connecting to IBM Quantum Service...")
try:
    service = QiskitRuntimeService(channel="ibm_quantum", token=token)
except Exception as e:
    print(f"❌ Failed to connect to IBM Quantum: {e}")
    sys.exit(1)

async def log_metrics_now():
    print("⏳ Fetching backend status...")
    try:
        backends = service.backends()
        metrics_batch = []
        timestamp = datetime.now().isoformat()

        for backend in backends:
            try:
                status = backend.status()
                props = backend.properties()
                conf = backend.configuration()
                
                # Safe property extraction
                gates = props.to_dict().get("gates", []) if props else []
                two_q_err = gates[0].get("parameters", [{}])[0].get("value") if gates else None
                
                clops = getattr(backend.target, "clops", None)
                if clops is None and conf:
                    clops = getattr(conf, "clops", None)

                metrics_batch.append({
                    "timestamp": timestamp,
                    "backend_name": backend.name,
                    "status": status.status_msg,
                    "queue_length": status.total_pending_jobs, 
                    "pending_jobs": status.pending_jobs,
                    "qubits": backend.num_qubits if hasattr(backend, 'num_qubits') else 0,
                    "error_rate": two_q_err,
                    "clops": float(clops) if clops else 0.0,
                    "operational": bool(status.operational)
                })
                print(f"   Prepared data for {backend.name}")
            except Exception as b_err:
                print(f"   ⚠️ Error processing backend {backend.name}: {b_err}")
                continue

        if metrics_batch:
            print(f"🚀 Inserting {len(metrics_batch)} rows into Supabase...")
            response = supabase.table("backend_metrics_history").insert(metrics_batch).execute()
            print("✅ Success! Data inserted.")
            print(response)
        else:
            print("⚠️ No backend data collected.")
        
    except Exception as e:
        print(f"❌ Global Error: {e}")

if __name__ == "__main__":
    asyncio.run(log_metrics_now())
