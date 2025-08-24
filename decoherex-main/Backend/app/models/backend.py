from sqlalchemy import Column, Integer, String, DateTime, Boolean, Float, JSON
from sqlalchemy.sql import func
from app.database import Base

class Backend(Base):
    __tablename__ = "backends"
    
    id = Column(Integer, primary_key=True, index=True)
    backend_id = Column(String, unique=True, index=True, nullable=False)  # ibm_osaka, google_sycamore
    name = Column(String, nullable=False)  # IBM Osaka, Google Sycamore
    provider = Column(String, nullable=False)  # IBM Quantum, Google Quantum AI
    type = Column(String, nullable=False)  # quantum, simulator
    status = Column(String, default="online")  # online, offline, maintenance
    
    # Hardware specifications
    qubits = Column(Integer, nullable=True)
    location = Column(String, nullable=True)
    description = Column(String, nullable=True)
    
    # Performance metrics
    error_rate = Column(Float, nullable=True)
    avg_wait_time = Column(String, nullable=True)  # "2h 15m"
    queue_length = Column(Integer, default=0)
    uptime = Column(Float, default=99.9)  # Percentage
    
    # Status tracking
    last_update = Column(DateTime(timezone=True), server_default=func.now())
    last_maintenance = Column(DateTime(timezone=True), nullable=True)
    maintenance_scheduled = Column(DateTime(timezone=True), nullable=True)
    
    # Configuration
    max_shots = Column(Integer, nullable=True)
    max_qubits = Column(Integer, nullable=True)
    max_depth = Column(Integer, nullable=True)
    supported_gates = Column(JSON, nullable=True)
    
    # Monitoring data
    current_load = Column(Float, default=0.0)  # 0.0 to 100.0
    temperature = Column(Float, nullable=True)
    calibration_data = Column(JSON, nullable=True)
