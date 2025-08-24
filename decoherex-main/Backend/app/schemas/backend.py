from pydantic import BaseModel
from typing import Optional, Dict, Any, List
from datetime import datetime

class BackendStatus(BaseModel):
    """Backend operational status"""
    backend_id: str
    status: str  # "online", "offline", "maintenance", "error"
    last_heartbeat: datetime
    uptime_seconds: int
    total_jobs_processed: int
    current_queue_length: int
    error_count: int
    last_error: Optional[str] = None
    hardware_info: Optional[Dict[str, Any]] = None

class QueueInfo(BaseModel):
    """Job queue information for a backend"""
    backend_id: str
    queue_length: int
    estimated_wait_time: str
    priority_distribution: Dict[str, int]  # low: 5, medium: 10, high: 2
    oldest_job_age: str
    average_processing_time: str
    queue_status: str  # "normal", "busy", "overloaded"

class BackendMetrics(BaseModel):
    """Performance metrics for a backend"""
    backend_id: str
    timestamp: datetime
    jobs_per_hour: float
    success_rate: float
    average_execution_time: float
    error_rate: float
    queue_efficiency: float
    resource_utilization: float
    cost_per_job: Optional[float] = None

class BackendHealth(BaseModel):
    """Overall backend health summary"""
    backend_id: str
    health_score: float  # 0.0 to 1.0
    status: str
    issues: List[str]
    recommendations: List[str]
    last_maintenance: Optional[datetime] = None
    next_maintenance: Optional[datetime] = None

class BackendResponse(BaseModel):
    """Complete backend information response"""
    backend_id: str
    name: str
    provider: str
    location: str
    qubits: int
    status: BackendStatus
    queue: QueueInfo
    metrics: BackendMetrics
    health: BackendHealth
    created_at: datetime
    updated_at: datetime

class BackendCreate(BaseModel):
    """Create a new backend"""
    backend_id: str
    name: str
    provider: str
    location: str
    qubits: int
    max_shots: int
    max_depth: int
    cost_per_minute: Optional[float] = None

class BackendUpdate(BaseModel):
    """Update backend information"""
    name: Optional[str] = None
    status: Optional[str] = None
    max_shots: Optional[int] = None
    max_depth: Optional[int] = None
    cost_per_minute: Optional[float] = None
