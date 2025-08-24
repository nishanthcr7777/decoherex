from pydantic import BaseModel
from typing import Optional, Dict, Any
from datetime import datetime

class JobBase(BaseModel):
    title: str
    description: Optional[str] = None
    status: str = "pending"
    priority: str = "medium"
    backend_id: str
    shots: int = 1024
    qubits: Optional[int] = None
    depth: Optional[int] = None
    circuit_data: Optional[Dict[str, Any]] = None

class JobCreate(JobBase):
    pass

class JobUpdate(BaseModel):
    title: Optional[str] = None
    description: Optional[str] = None
    status: Optional[str] = None
    priority: Optional[str] = None
    backend_id: Optional[str] = None
    shots: Optional[int] = None
    qubits: Optional[int] = None
    depth: Optional[int] = None
    circuit_data: Optional[Dict[str, Any]] = None

class JobResponse(JobBase):
    id: str  # Changed from int to str for MongoDB ObjectId
    job_id: str
    user_id: str  # Changed from int to str for MongoDB
    submitted_at: datetime
    started_at: Optional[datetime] = None
    completed_at: Optional[datetime] = None
    estimated_time: Optional[str] = None
    progress: float = 0.0
    results: Optional[Dict[str, Any]] = None
    logs: Optional[list] = None
    error_message: Optional[str] = None
    created_at: Optional[datetime] = None  # Added for MongoDB
    updated_at: Optional[datetime] = None  # Added for MongoDB
    
    class Config:
        from_attributes = True
