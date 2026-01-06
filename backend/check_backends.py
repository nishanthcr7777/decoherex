
import os
from dotenv import load_dotenv
from qiskit_ibm_runtime import QiskitRuntimeService

load_dotenv()
token = os.getenv("IBM_QUANTUM_API_TOKEN")

if not token:
    print("ERROR: IBM_QUANTUM_API_TOKEN not found in .env")
    exit(1)

print(f"Token found: {token[:4]}...{token[-4:]}")

try:
    service = QiskitRuntimeService(channel="ibm_quantum", token=token)
    print("Service initialized successfully.")
    
    print("\nAvailable Backends:")
    backends = service.backends()
    for backend in backends:
        status = backend.status()
        print(f"- {backend.name} (qubits: {backend.num_qubits}, pending: {status.pending_jobs}, operational: {status.operational})")

except Exception as e:
    print(f"FAILED to initialize service or fetch backends: {e}")
