from fastapi import APIRouter, HTTPException, status
from typing import List, Optional
from datetime import datetime, timezone, timedelta
from app.schemas.backend import (
    BackendResponse, BackendCreate, BackendUpdate, 
    BackendStatus, QueueInfo, BackendMetrics, BackendHealth
)
from app.database import get_database
import random

router = APIRouter()

# Mock data for demonstration - in production, this would come from real backend monitoring
MOCK_BACKENDS = {
    "ibm_osaka": {
        "name": "IBM Osaka",
        "provider": "IBM Quantum",
        "location": "Osaka, Japan",
        "qubits": 433,
        "max_shots": 8192,
        "max_depth": 1000,
        "cost_per_minute": 0.10
    },
    "google_sycamore": {
        "name": "Google Sycamore",
        "provider": "Google Quantum AI",
        "location": "Santa Barbara, CA",
        "qubits": 53,
        "max_shots": 10000,
        "max_depth": 500,
        "cost_per_minute": 0.15
    },
    "ionq_harmony": {
        "name": "IonQ Harmony",
        "provider": "IonQ",
        "location": "College Park, MD",
        "qubits": 11,
        "max_shots": 1000,
        "max_depth": 100,
        "cost_per_minute": 0.08
    }
}

def generate_mock_status(backend_id: str) -> BackendStatus:
    """Generate mock backend status data"""
    now = datetime.now(timezone.utc)
    status_options = ["online", "online", "online", "busy", "maintenance"]
    status = random.choice(status_options)
    
    return BackendStatus(
        backend_id=backend_id,
        status=status,
        last_heartbeat=now - timedelta(minutes=random.randint(1, 5)),
        uptime_seconds=random.randint(3600, 86400),  # 1 hour to 24 hours
        total_jobs_processed=random.randint(1000, 10000),
        current_queue_length=random.randint(0, 50),
        error_count=random.randint(0, 10),
        last_error=random.choice([None, "Calibration drift detected", "Network timeout", "Hardware error"]),
        hardware_info={
            "temperature": round(random.uniform(0.01, 0.1), 3),
            "coherence_time": random.randint(50, 200),
            "gate_fidelity": round(random.uniform(0.95, 0.99), 3)
        } if status == "online" else None
    )

def generate_mock_queue(backend_id: str) -> QueueInfo:
    """Generate mock queue information"""
    queue_length = random.randint(0, 50)
    
    return QueueInfo(
        backend_id=backend_id,
        queue_length=queue_length,
        estimated_wait_time=f"{random.randint(5, 120)}m",
        priority_distribution={
            "low": random.randint(0, queue_length // 3),
            "medium": random.randint(0, queue_length // 2),
            "high": random.randint(0, queue_length // 4)
        },
        oldest_job_age=f"{random.randint(1, 60)}m",
        average_processing_time=f"{random.randint(10, 45)}m",
        queue_status=random.choice(["normal", "busy", "overloaded"]) if queue_length > 0 else "normal"
    )

def generate_mock_metrics(backend_id: str) -> BackendMetrics:
    """Generate mock performance metrics"""
    now = datetime.now(timezone.utc)
    
    return BackendMetrics(
        backend_id=backend_id,
        timestamp=now,
        jobs_per_hour=round(random.uniform(5.0, 25.0), 1),
        success_rate=round(random.uniform(0.85, 0.98), 3),
        average_execution_time=round(random.uniform(15.0, 45.0), 1),
        error_rate=round(random.uniform(0.02, 0.15), 3),
        queue_efficiency=round(random.uniform(0.7, 0.95), 2),
        resource_utilization=round(random.uniform(0.3, 0.9), 2),
        cost_per_job=round(random.uniform(0.05, 0.25), 2)
    )

def generate_mock_health(backend_id: str) -> BackendHealth:
    """Generate mock health assessment"""
    now = datetime.now(timezone.utc)
    health_score = round(random.uniform(0.7, 1.0), 2)
    
    issues = []
    recommendations = []
    
    if health_score < 0.8:
        issues.append("High error rate detected")
        recommendations.append("Schedule calibration check")
    
    if health_score < 0.9:
        issues.append("Queue efficiency below optimal")
        recommendations.append("Review job prioritization")
    
    if not issues:
        issues.append("All systems operational")
        recommendations.append("Continue monitoring")
    
    return BackendHealth(
        backend_id=backend_id,
        health_score=health_score,
        status="healthy" if health_score > 0.9 else "warning" if health_score > 0.8 else "critical",
        issues=issues,
        recommendations=recommendations,
        last_maintenance=now - timedelta(days=random.randint(1, 30)),
        next_maintenance=now + timedelta(days=random.randint(1, 14))
    )

@router.get("/", response_model=List[BackendResponse])
async def get_backends():
    """Get all backends with comprehensive status information"""
    db = get_database()
    collection = db.jobs
    
    backends = []
    
    for backend_id, backend_info in MOCK_BACKENDS.items():
        # Get real job statistics from database
        total_jobs = await collection.count_documents({"backend_id": backend_id})
        pending_jobs = await collection.count_documents({"backend_id": backend_id, "status": "pending"})
        running_jobs = await collection.count_documents({"backend_id": backend_id, "status": "running"})
        
        # Generate mock data
        status = generate_mock_status(backend_id)
        queue = generate_mock_queue(backend_id)
        metrics = generate_mock_metrics(backend_id)
        health = generate_mock_health(backend_id)
        
        # Override mock data with real data where possible
        status.current_queue_length = pending_jobs + running_jobs
        queue.queue_length = pending_jobs + running_jobs
        
        backend_response = BackendResponse(
            backend_id=backend_id,
            name=backend_info["name"],
            provider=backend_info["provider"],
            location=backend_info["location"],
            qubits=backend_info["qubits"],
            status=status,
            queue=queue,
            metrics=metrics,
            health=health,
            created_at=datetime.now(timezone.utc) - timedelta(days=random.randint(30, 365)),
            updated_at=datetime.now(timezone.utc)
        )
        
        backends.append(backend_response)
    
    return backends

@router.get("/{backend_id}", response_model=BackendResponse)
async def get_backend(backend_id: str):
    """Get detailed information for a specific backend"""
    if backend_id not in MOCK_BACKENDS:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Backend {backend_id} not found"
        )
    
    backend_info = MOCK_BACKENDS[backend_id]
    
    # Generate comprehensive backend data
    status = generate_mock_status(backend_id)
    queue = generate_mock_queue(backend_id)
    metrics = generate_mock_metrics(backend_id)
    health = generate_mock_health(backend_id)
    
    return BackendResponse(
        backend_id=backend_id,
        name=backend_info["name"],
        provider=backend_info["provider"],
        location=backend_info["location"],
        qubits=backend_info["qubits"],
        status=status,
        queue=queue,
        metrics=metrics,
        health=health,
        created_at=datetime.now(timezone.utc) - timedelta(days=random.randint(30, 365)),
        updated_at=datetime.now(timezone.utc)
    )

@router.get("/{backend_id}/status", response_model=BackendStatus)
async def get_backend_status(backend_id: str):
    """Get operational status for a specific backend"""
    if backend_id not in MOCK_BACKENDS:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Backend {backend_id} not found"
        )
    
    return generate_mock_status(backend_id)

@router.get("/{backend_id}/queue", response_model=QueueInfo)
async def get_backend_queue(backend_id: str):
    """Get queue information for a specific backend"""
    if backend_id not in MOCK_BACKENDS:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Backend {backend_id} not found"
        )
    
    return generate_mock_queue(backend_id)

@router.get("/{backend_id}/metrics", response_model=BackendMetrics)
async def get_backend_metrics(backend_id: str):
    """Get performance metrics for a specific backend"""
    if backend_id not in MOCK_BACKENDS:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Backend {backend_id} not found"
        )
    
    return generate_mock_metrics(backend_id)

@router.get("/{backend_id}/health", response_model=BackendHealth)
async def get_backend_health(backend_id: str):
    """Get health assessment for a specific backend"""
    if backend_id not in MOCK_BACKENDS:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Backend {backend_id} not found"
        )
    
    return generate_mock_health(backend_id)

@router.post("/", response_model=BackendResponse, status_code=status.HTTP_201_CREATED)
async def create_backend(backend_data: BackendCreate):
    """Create a new backend (admin only)"""
    # TODO: Add admin authentication
    if backend_data.backend_id in MOCK_BACKENDS:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Backend {backend_data.backend_id} already exists"
        )
    
    # Add to mock backends
    MOCK_BACKENDS[backend_data.backend_id] = {
        "name": backend_data.name,
        "provider": backend_data.provider,
        "location": backend_data.location,
        "qubits": backend_data.qubits,
        "max_shots": backend_data.max_shots,
        "max_depth": backend_data.max_depth,
        "cost_per_minute": backend_data.cost_per_minute
    }
    
    # Generate response
    status = generate_mock_status(backend_data.backend_id)
    queue = generate_mock_queue(backend_data.backend_id)
    metrics = generate_mock_metrics(backend_data.backend_id)
    health = generate_mock_health(backend_data.backend_id)
    
    return BackendResponse(
        backend_id=backend_data.backend_id,
        name=backend_data.name,
        provider=backend_data.provider,
        location=backend_data.location,
        qubits=backend_data.qubits,
        status=status,
        queue=queue,
        metrics=metrics,
        health=health,
        created_at=datetime.now(timezone.utc),
        updated_at=datetime.now(timezone.utc)
    )

@router.put("/{backend_id}", response_model=BackendResponse)
async def update_backend(backend_id: str, backend_update: BackendUpdate):
    """Update backend information (admin only)"""
    # TODO: Add admin authentication
    if backend_id not in MOCK_BACKENDS:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Backend {backend_id} not found"
        )
    
    # Update mock backend
    current = MOCK_BACKENDS[backend_id]
    if backend_update.name:
        current["name"] = backend_update.name
    if backend_update.max_shots:
        current["max_shots"] = backend_update.max_shots
    if backend_update.max_depth:
        current["max_depth"] = backend_update.max_depth
    if backend_update.cost_per_minute is not None:
        current["cost_per_minute"] = backend_update.cost_per_minute
    
    # Generate updated response
    status = generate_mock_status(backend_id)
    queue = generate_mock_queue(backend_id)
    metrics = generate_mock_metrics(backend_id)
    health = generate_mock_health(backend_id)
    
    return BackendResponse(
        backend_id=backend_id,
        name=current["name"],
        provider=current["provider"],
        location=current["location"],
        qubits=current["qubits"],
        status=status,
        queue=queue,
        metrics=metrics,
        health=health,
        created_at=datetime.now(timezone.utc) - timedelta(days=random.randint(30, 365)),
        updated_at=datetime.now(timezone.utc)
    )

@router.delete("/{backend_id}")
async def delete_backend(backend_id: str):
    """Delete a backend (admin only)"""
    # TODO: Add admin authentication
    if backend_id not in MOCK_BACKENDS:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Backend {backend_id} not found"
        )
    
    # Check if backend has active jobs
    db = get_database()
    collection = db.jobs
    active_jobs = await collection.count_documents({
        "backend_id": backend_id,
        "status": {"$in": ["pending", "running"]}
    })
    
    if active_jobs > 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot delete backend with {active_jobs} active jobs"
        )
    
    del MOCK_BACKENDS[backend_id]
    return {"message": f"Backend {backend_id} deleted successfully"}

@router.get("/system/overview")
async def get_system_overview():
    """Get system-wide backend overview and health summary"""
    db = get_database()
    collection = db.jobs
    
    # Get real system statistics
    total_jobs = await collection.count_documents({})
    pending_jobs = await collection.count_documents({"status": "pending"})
    running_jobs = await collection.count_documents({"status": "running"})
    completed_jobs = await collection.count_documents({"status": "completed"})
    failed_jobs = await collection.count_documents({"status": "failed"})
    
    # Calculate system health
    total_backends = len(MOCK_BACKENDS)
    online_backends = sum(1 for _ in range(total_backends) if random.choice([True, True, True, False]))
    
    system_health = {
        "total_backends": total_backends,
        "online_backends": online_backends,
        "offline_backends": total_backends - online_backends,
        "total_jobs": total_jobs,
        "pending_jobs": pending_jobs,
        "running_jobs": running_jobs,
        "completed_jobs": completed_jobs,
        "failed_jobs": failed_jobs,
        "success_rate": round(completed_jobs / max(total_jobs, 1), 3),
        "system_status": "healthy" if online_backends > total_backends // 2 else "degraded",
        "last_updated": datetime.now(timezone.utc).isoformat()
    }
    
    return system_health
