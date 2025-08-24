from sqlalchemy import Column, Integer, String, Boolean, DateTime, Text
from sqlalchemy.sql import func
from sqlalchemy.orm import relationship
from app.database import Base

class User(Base):
    __tablename__ = "users"
    
    id = Column(Integer, primary_key=True, index=True)
    email = Column(String, unique=True, index=True, nullable=False)
    username = Column(String, unique=True, index=True, nullable=False)
    hashed_password = Column(String, nullable=False)
    is_active = Column(Boolean, default=True)
    is_admin = Column(Boolean, default=False)
    api_key = Column(String, unique=True, nullable=True)
    created_at = Column(DateTime(timezone=True), server_default=func.now())
    updated_at = Column(DateTime(timezone=True), onupdate=func.now())
    
    # Profile fields
    full_name = Column(String, nullable=True)
    organization = Column(String, nullable=True)
    bio = Column(Text, nullable=True)
    
    # Notification preferences
    email_notifications = Column(Boolean, default=True)
    job_complete_notifications = Column(Boolean, default=True)
    job_failed_notifications = Column(Boolean, default=True)
    maintenance_alerts = Column(Boolean, default=True)
    
    # Relationships
    jobs = relationship("Job", back_populates="user")
    tokens = relationship("Token", back_populates="user")
