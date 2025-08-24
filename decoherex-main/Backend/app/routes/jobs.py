from fastapi import APIRouter, HTTPException, status
from typing import List, Optional
from datetime import datetime, timezone
from app.schemas.job import JobCreate, JobUpdate, JobResponse
from app.database import get_database
import uuid

router = APIRouter()

@router.get("/", response_model=List[JobResponse])
async def get_jobs(
    status: Optional[str] = None,
    backend_id: Optional[str] = None,
    limit: int = 50,
    skip: int = 0
):
    """
    Get all jobs with optional filtering
    """
    db = get_database()
    collection = db.jobs
    
    # Build filter
    filter_query = {}
    if status:
        filter_query["status"] = status
    if backend_id:
        filter_query["backend_id"] = backend_id
    
    # Query MongoDB
    cursor = collection.find(filter_query).skip(skip).limit(limit)
    jobs = await cursor.to_list(length=limit)
    
    # Convert ObjectId to string for JSON serialization
    for job in jobs:
        job["id"] = str(job["_id"])
        del job["_id"]
    
    return jobs

@router.post("/", response_model=JobResponse, status_code=status.HTTP_201_CREATED)
async def create_job(job_data: JobCreate):
    """
    Create a new quantum job
    """
    db = get_database()
    collection = db.jobs
    
    # Create new job document
    new_job = {
        "job_id": f"job_{str(uuid.uuid4())[:8]}",
        "title": job_data.title,
        "description": job_data.description,
        "status": "pending",
        "priority": job_data.priority,
        "backend_id": job_data.backend_id,
        "shots": job_data.shots,
        "qubits": job_data.qubits,
        "depth": job_data.depth,
        "user_id": "user_001",  # TODO: Get from auth token
        "submitted_at": datetime.now(timezone.utc),
        "started_at": None,
        "completed_at": None,
        "estimated_time": "30m",  # TODO: Calculate based on backend
        "progress": 0.0,
        "results": None,
        "logs": ["Job submitted successfully"],
        "error_message": None,
        "created_at": datetime.now(timezone.utc),
        "updated_at": datetime.now(timezone.utc)
    }
    
    # Insert into MongoDB
    result = await collection.insert_one(new_job)
    new_job["id"] = str(result.inserted_id)
    
    return new_job

@router.get("/{job_id}", response_model=JobResponse)
async def get_job(job_id: str):
    """
    Get specific job details
    """
    db = get_database()
    collection = db.jobs
    
    # Query MongoDB
    job = await collection.find_one({"job_id": job_id})
    
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Job {job_id} not found"
        )
    
    # Convert ObjectId to string
    job["id"] = str(job["_id"])
    del job["_id"]
    
    return job

@router.put("/{job_id}", response_model=JobResponse)
async def update_job(job_id: str, job_update: JobUpdate):
    """
    Update job details
    """
    db = get_database()
    collection = db.jobs
    
    # Check if job exists
    existing_job = await collection.find_one({"job_id": job_id})
    if not existing_job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Job {job_id} not found"
        )
    
    # Prepare update data
    update_data = job_update.dict(exclude_unset=True)
    update_data["updated_at"] = datetime.now(timezone.utc)
    
    # Update in MongoDB
    result = await collection.update_one(
        {"job_id": job_id},
        {"$set": update_data}
    )
    
    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="No changes made to job"
        )
    
    # Return updated job
    updated_job = await collection.find_one({"job_id": job_id})
    updated_job["id"] = str(updated_job["_id"])
    del updated_job["_id"]
    
    return updated_job

@router.delete("/{job_id}")
async def delete_job(job_id: str):
    """
    Delete a job
    """
    db = get_database()
    collection = db.jobs
    
    # Check if job exists
    existing_job = await collection.find_one({"job_id": job_id})
    if not existing_job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Job {job_id} not found"
        )
    
    # Delete from MongoDB
    result = await collection.delete_one({"job_id": job_id})
    
    if result.deleted_count == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to delete job"
        )
    
    return {"message": f"Job {job_id} deleted successfully"}

@router.get("/{job_id}/logs")
async def get_job_logs(job_id: str):
    """
    Get job execution logs
    """
    db = get_database()
    collection = db.jobs
    
    job = await collection.find_one({"job_id": job_id})
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Job {job_id} not found"
        )
    
    return {
        "job_id": job_id,
        "logs": job.get("logs", []),
        "total_logs": len(job.get("logs", []))
    }

@router.get("/{job_id}/results")
async def get_job_results(job_id: str):
    """
    Get job results
    """
    db = get_database()
    collection = db.jobs
    
    job = await collection.find_one({"job_id": job_id})
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Job {job_id} not found"
        )
    
    if job["status"] != "completed":
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Job {job_id} is not completed yet. Current status: {job['status']}"
        )
    
    return {
        "job_id": job_id,
        "results": job.get("results", {}),
        "completed_at": job.get("completed_at"),
        "execution_time": "15m"  # TODO: Calculate actual execution time
    }

@router.post("/{job_id}/cancel")
async def cancel_job(job_id: str):
    """
    Cancel a running job
    """
    db = get_database()
    collection = db.jobs
    
    # Check if job exists
    job = await collection.find_one({"job_id": job_id})
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Job {job_id} not found"
        )
    
    if job["status"] not in ["pending", "running"]:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail=f"Cannot cancel job with status: {job['status']}"
        )
    
    # Update job status and add log
    new_log = f"Job cancelled by user at {datetime.now(timezone.utc).isoformat()}"
    
    result = await collection.update_one(
        {"job_id": job_id},
        {
            "$set": {
                "status": "cancelled",
                "updated_at": datetime.now(timezone.utc)
            },
            "$push": {"logs": new_log}
        }
    )
    
    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to cancel job"
        )
    
    return {"message": f"Job {job_id} cancelled successfully"}

@router.post("/{job_id}/logs")
async def add_job_log(job_id: str, log_message: str):
    """
    Add a log entry to a job
    """
    db = get_database()
    collection = db.jobs
    
    # Check if job exists
    job = await collection.find_one({"job_id": job_id})
    if not job:
        raise HTTPException(
            status_code=status.HTTP_404_NOT_FOUND,
            detail=f"Job {job_id} not found"
        )
    
    # Add log entry
    timestamp = datetime.now(timezone.utc).isoformat()
    new_log = f"[{timestamp}] {log_message}"
    
    result = await collection.update_one(
        {"job_id": job_id},
        {
            "$push": {"logs": new_log},
            "$set": {"updated_at": datetime.now(timezone.utc)}
        }
    )
    
    if result.modified_count == 0:
        raise HTTPException(
            status_code=status.HTTP_400_BAD_REQUEST,
            detail="Failed to add log entry"
        )
    
    return {"message": "Log entry added successfully", "log": new_log}
