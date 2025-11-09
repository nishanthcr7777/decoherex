import pandas as pd
import numpy as np
import random

np.random.seed(42)
random.seed(42)

# Backend definitions
backends = [
    {"name": "ibm_pittsburgh", "processor": "Heron r3", "error": 7.8e-4, "noise": 4.6e-3, "qubits": 156},
    {"name": "ibm_kingston", "processor": "Heron r2", "error": 9.8e-4, "noise": 3.7e-3, "qubits": 156},
    {"name": "ibm_fez", "processor": "Heron r2", "error": 1.3e-3, "noise": 4.6e-3, "qubits": 156},
    {"name": "ibm_marrakesh", "processor": "Heron r2", "error": 9.5e-4, "noise": 3.2e-3, "qubits": 156},
    {"name": "ibm_torino", "processor": "Heron r1", "error": 1.2e-3, "noise": 2.0e-2, "qubits": 133},
    {"name": "ibm_brisbane", "processor": "Eagle r3", "error": 7.0e-4, "noise": 3.0e-3, "qubits": 127}
]

job_types = ["BellState", "Grover", "QAOA", "VQE", "QuantumFourier"]
priorities = ["Low", "Medium", "High"]

rows = []
rows_per_backend = 10000 // len(backends)

for backend in backends:
    for _ in range(rows_per_backend):
        circuit_depth = np.random.randint(10, 200)
        gate_count = np.random.randint(100, 2000)
        error_tolerance = round(np.random.uniform(0.001, 0.05), 4)
        job_type = random.choice(job_types)
        priority = random.choice(priorities)
        max_wait_time = np.random.randint(30, 600)

        queue = np.random.randint(0, 400)
        wait_time = round(queue * np.random.uniform(0.5, 2.0), 2)
        success_rate = round(np.random.uniform(0.75, 0.98), 3)
        ai_confidence = round(np.random.uniform(0.7, 0.99), 3)
        status = "Online"

        # Optional small variation in backend hardware metrics
        avg_error = backend["error"] * np.random.uniform(0.95, 1.05)
        avg_noise = backend["noise"] * np.random.uniform(0.95, 1.05)

        # Corrected suitability formula
        suitability = (
            0.7 * (1 - abs(avg_error - error_tolerance) / 0.05) +  # normalized difference
            0.2 * success_rate +                                   # success bonus
            0.1 * (1 - queue / 400)                                # queue penalty
        )
        suitability = max(0.0, min(1.0, suitability))  # clamp 0-1

        rows.append({
            "circuit_depth": circuit_depth,
            "gate_count": gate_count,
            "error_tolerance": error_tolerance,
            "job_type": job_type,
            "priority_level": priority,
            "max_wait_time": max_wait_time,
            "backend_name": backend["name"],
            "queue": queue,
            "success_rate": success_rate,
            "wait_time": wait_time,
            "status": status,
            "avg_error": round(avg_error, 6),
            "avg_noise": round(avg_noise, 6),
            "ai_confidence": ai_confidence,
            "processor_desc": backend["processor"],
            "suitability": round(suitability, 3)
        })

df = pd.DataFrame(rows)
df = df.sample(frac=1).reset_index(drop=True)  # shuffle

df.to_csv("backend_data_large1.csv", index=False)
print("✅ Generated backend_data_large1.csv with", len(df), "rows")
