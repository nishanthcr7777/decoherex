from fastapi import FastAPI, HTTPException, Depends, status
from fastapi.middleware.cors import CORSMiddleware
from fastapi.security import HTTPBearer, HTTPAuthorizationCredentials
from pydantic import BaseModel
from typing import List, Optional
import uvicorn
from datetime import datetime, timedelta
import jwt
from passlib.context import CryptContext
import os

# Security
SECRET_KEY = "your-secret-key-here"  # Change this in production
ALGORITHM = "HS256"
ACCESS_TOKEN_EXPIRE_MINUTES = 30

# Password hashing
pwd_context = CryptContext(schemes=["bcrypt"], deprecated="auto")

# Token bearer
security = HTTPBearer()

app = FastAPI(
    title="Decoherex API",
    description="Backend API for Decoherex application",
    version="1.0.0"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],  # Frontend URLs
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Pydantic models
class UserBase(BaseModel):
    email: str
    username: str
    is_admin: bool = False

class UserCreate(UserBase):
    password: str

class User(UserBase):
    id: int
    created_at: datetime
    
    class Config:
        from_attributes = True

class UserLogin(BaseModel):
    email: str
    password: str

class Token(BaseModel):
    access_token: str
    token_type: str

class JobBase(BaseModel):
    title: str
    description: str
    status: str = "pending"
    priority: str = "medium"

class JobCreate(JobBase):
    pass

class Job(JobBase):
    id: int
    user_id: int
    created_at: datetime
    updated_at: datetime
    
    class Config:
        from_attributes = True

# In-memory storage (replace with database in production)
users_db = {}
jobs_db = {}
user_id_counter = 1
job_id_counter = 1

# Helper functions
def verify_password(plain_password, hashed_password):
    return pwd_context.verify(plain_password, hashed_password)

def get_password_hash(password):
    return pwd_context.hash(password)

def create_access_token(data: dict):
    to_encode = data.copy()
    expire = datetime.utcnow() + timedelta(minutes=ACCESS_TOKEN_EXPIRE_MINUTES)
    to_encode.update({"exp": expire})
    encoded_jwt = jwt.encode(to_encode, SECRET_KEY, algorithm=ALGORITHM)
    return encoded_jwt

def get_current_user(credentials: HTTPAuthorizationCredentials = Depends(security)):
    try:
        payload = jwt.decode(credentials.credentials, SECRET_KEY, algorithms=[ALGORITHM])
        user_id: int = payload.get("sub")
        if user_id is None:
            raise HTTPException(status_code=401, detail="Invalid token")
        user = users_db.get(user_id)
        if user is None:
            raise HTTPException(status_code=401, detail="User not found")
        return user
    except jwt.ExpiredSignatureError:
        raise HTTPException(status_code=401, detail="Token expired")
    except jwt.JWTError:
        raise HTTPException(status_code=401, detail="Invalid token")

# Routes
@app.get("/")
async def root():
    return {"message": "Decoherex API is running!"}

@app.post("/auth/register", response_model=User)
async def register(user: UserCreate):
    global user_id_counter
    
    # Check if user already exists
    for existing_user in users_db.values():
        if existing_user["email"] == user.email:
            raise HTTPException(status_code=400, detail="Email already registered")
    
    # Create new user
    user_id = user_id_counter
    user_id_counter += 1
    
    hashed_password = get_password_hash(user.password)
    user_data = {
        "id": user_id,
        "email": user.email,
        "username": user.username,
        "is_admin": user.is_admin,
        "password": hashed_password,
        "created_at": datetime.utcnow()
    }
    
    users_db[user_id] = user_data
    
    # Return user without password
    return {**user_data, "password": None}

@app.post("/auth/login", response_model=Token)
async def login(user_credentials: UserLogin):
    # Find user by email
    user = None
    for u in users_db.values():
        if u["email"] == user_credentials.email:
            user = u
            break
    
    if not user or not verify_password(user_credentials.password, user["password"]):
        raise HTTPException(
            status_code=status.HTTP_401_UNAUTHORIZED,
            detail="Incorrect email or password",
            headers={"WWW-Authenticate": "Bearer"},
        )
    
    access_token = create_access_token(data={"sub": str(user["id"])})
    return {"access_token": access_token, "token_type": "bearer"}

@app.get("/users/me", response_model=User)
async def get_current_user_info(current_user: dict = Depends(get_current_user)):
    return {**current_user, "password": None}

@app.post("/jobs", response_model=Job)
async def create_job(job: JobCreate, current_user: dict = Depends(get_current_user)):
    global job_id_counter
    
    job_id = job_id_counter
    job_id_counter += 1
    
    job_data = {
        "id": job_id,
        "user_id": current_user["id"],
        "title": job.title,
        "description": job.description,
        "status": job.status,
        "priority": job.priority,
        "created_at": datetime.utcnow(),
        "updated_at": datetime.utcnow()
    }
    
    jobs_db[job_id] = job_data
    return job_data

@app.get("/jobs", response_model=List[Job])
async def get_jobs(current_user: dict = Depends(get_current_user)):
    user_jobs = [job for job in jobs_db.values() if job["user_id"] == current_user["id"]]
    return user_jobs

@app.get("/jobs/{job_id}", response_model=Job)
async def get_job(job_id: int, current_user: dict = Depends(get_current_user)):
    job = jobs_db.get(job_id)
    if not job or job["user_id"] != current_user["id"]:
        raise HTTPException(status_code=404, detail="Job not found")
    return job

@app.put("/jobs/{job_id}", response_model=Job)
async def update_job(job_id: int, job_update: JobBase, current_user: dict = Depends(get_current_user)):
    job = jobs_db.get(job_id)
    if not job or job["user_id"] != current_user["id"]:
        raise HTTPException(status_code=404, detail="Job not found")
    
    # Update job
    job.update({
        "title": job_update.title,
        "description": job_update.description,
        "status": job_update.status,
        "priority": job_update.priority,
        "updated_at": datetime.utcnow()
    })
    
    return job

@app.delete("/jobs/{job_id}")
async def delete_job(job_id: int, current_user: dict = Depends(get_current_user)):
    job = jobs_db.get(job_id)
    if not job or job["user_id"] != current_user["id"]:
        raise HTTPException(status_code=404, detail="Job not found")
    
    del jobs_db[job_id]
    return {"message": "Job deleted successfully"}

@app.get("/admin/users", response_model=List[User])
async def get_all_users(current_user: dict = Depends(get_current_user)):
    if not current_user["is_admin"]:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    return [{**user, "password": None} for user in users_db.values()]

@app.get("/admin/analytics")
async def get_admin_analytics(current_user: dict = Depends(get_current_user)):
    if not current_user["is_admin"]:
        raise HTTPException(status_code=403, detail="Admin access required")
    
    total_users = len(users_db)
    total_jobs = len(jobs_db)
    
    # Job status distribution
    status_counts = {}
    for job in jobs_db.values():
        status_counts[job["status"]] = status_counts.get(job["status"], 0) + 1
    
    return {
        "total_users": total_users,
        "total_jobs": total_jobs,
        "job_status_distribution": status_counts
    }

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)
