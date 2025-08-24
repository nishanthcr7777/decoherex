from sqlalchemy import Column, Integer, String, DateTime, ForeignKey, Text, Float, JSON
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class Job(Base):
    __tablename__ = "jobs"
    
    id = Column(Integer, primary_key=True, index=True)
    job_id = Column(String, unique=True, index=True, nullable=False)  # External job ID
    title = Column(String, nullable=False)
    description = Column(Text, nullable=True)
    status = Column(String, default="pending")  # pending, running, completed, failed, cancelled
    priority = Column(String, default="medium")  # low, medium, high, urgent
    
    # Quantum job details
    backend_id = Column(String, nullable=False)  # IBM Osaka, Google Sycamore, etc.
    shots = Column(Integer, default=1024)
    qubits = Column(Integer, nullable=True)
    depth = Column(Integer, nullable=True)
    circuit_data = Column(JSON, nullable=True)
    
    # Execution details
    submitted_at = Column(DateTime(timezone=True), server_default=func.now())
    started_at = Column(DateTime(timezone=True), nullable=True)
    completed_at = Column(DateTime(timezone=True), nullable=True)
    estimated_time = Column(String, nullable=True)
    progress = Column(Float, default=0.0)  # 0.0 to 100.0
    
    # Results and logs
    results = Column(JSON, nullable=True)
    logs = Column(JSON, nullable=True)  # Array of log messages
    error_message = Column(Text, nullable=True)
    
    # Foreign key to user
    user_id = Column(Integer, ForeignKey("users.id"), nullable=False)
    user = relationship("User", back_populates="jobs")
