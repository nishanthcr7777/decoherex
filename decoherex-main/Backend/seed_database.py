import asyncio
from datetime import datetime, timezone
from app.database import connect_to_mongo, close_mongo_connection, get_database

async def seed_database():
    """Seed the database with sample quantum jobs"""
    await connect_to_mongo()
    db = get_database()
    collection = db.jobs
    
    # Sample quantum jobs
    sample_jobs = [
        {
            "job_id": "job_001",
            "title": "Quantum Fourier Transform",
            "description": "Implementing QFT on 4 qubits for quantum phase estimation",
            "status": "completed",
            "priority": "high",
            "backend_id": "ibm_osaka",
            "shots": 1024,
            "qubits": 4,
            "depth": 8,
            "user_id": "user_001",
            "submitted_at": datetime.now(timezone.utc),
            "started_at": datetime.now(timezone.utc),
            "completed_at": datetime.now(timezone.utc),
            "estimated_time": "15m",
            "progress": 100.0,
            "results": {
                "fidelity": 0.95,
                "counts": {"0000": 256, "0001": 128, "0010": 64, "0011": 32},
                "execution_time": "12m 34s"
            },
            "logs": [
                "Job submitted successfully",
                "Job queued on IBM Osaka backend",
                "Job started execution",
                "QFT circuit compiled successfully",
                "Job completed with 95% fidelity"
            ],
            "error_message": None,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        },
        {
            "job_id": "job_002",
            "title": "Grover's Algorithm",
            "description": "Quantum search algorithm implementation on 6 qubits",
            "status": "running",
            "priority": "medium",
            "backend_id": "google_sycamore",
            "shots": 2048,
            "qubits": 6,
            "depth": 12,
            "user_id": "user_001",
            "submitted_at": datetime.now(timezone.utc),
            "started_at": datetime.now(timezone.utc),
            "completed_at": None,
            "estimated_time": "45m",
            "progress": 65.0,
            "results": None,
            "logs": [
                "Job submitted successfully",
                "Job queued on Google Sycamore backend",
                "Job started execution",
                "Grover oracle constructed",
                "Amplitude amplification in progress...",
                "Current progress: 65%"
            ],
            "error_message": None,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        },
        {
            "job_id": "job_003",
            "title": "Quantum Teleportation",
            "description": "Bell state preparation and quantum teleportation protocol",
            "status": "pending",
            "priority": "low",
            "backend_id": "ibm_osaka",
            "shots": 512,
            "qubits": 3,
            "depth": 5,
            "user_id": "user_002",
            "submitted_at": datetime.now(timezone.utc),
            "started_at": None,
            "completed_at": None,
            "estimated_time": "20m",
            "progress": 0.0,
            "results": None,
            "logs": [
                "Job submitted successfully",
                "Waiting in queue...",
                "Estimated wait time: 15 minutes"
            ],
            "error_message": None,
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        },
        {
            "job_id": "job_004",
            "title": "VQE for H2 Molecule",
            "description": "Variational Quantum Eigensolver for hydrogen molecule ground state",
            "status": "failed",
            "priority": "high",
            "backend_id": "ibm_osaka",
            "shots": 4096,
            "qubits": 4,
            "depth": 20,
            "user_id": "user_003",
            "submitted_at": datetime.now(timezone.utc),
            "started_at": datetime.now(timezone.utc),
            "completed_at": datetime.now(timezone.utc),
            "estimated_time": "60m",
            "progress": 45.0,
            "results": None,
            "logs": [
                "Job submitted successfully",
                "Job started execution",
                "VQE optimization started",
                "Error: Backend calibration issue detected",
                "Job failed due to backend error"
            ],
            "error_message": "Backend calibration error during VQE optimization",
            "created_at": datetime.now(timezone.utc),
            "updated_at": datetime.now(timezone.utc)
        }
    ]
    
    # Clear existing data
    await collection.delete_many({})
    print("Cleared existing jobs collection")
    
    # Insert sample jobs
    result = await collection.insert_many(sample_jobs)
    print(f"Inserted {len(result.inserted_ids)} sample quantum jobs")
    
    # Create indexes for better performance
    await collection.create_index("job_id", unique=True)
    await collection.create_index("status")
    await collection.create_index("backend_id")
    await collection.create_index("user_id")
    await collection.create_index("submitted_at")
    print("Created database indexes")
    
    await close_mongo_connection()
    print("Database seeding completed!")

if __name__ == "__main__":
    asyncio.run(seed_database())
