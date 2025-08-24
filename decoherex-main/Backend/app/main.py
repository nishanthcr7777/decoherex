from fastapi import FastAPI
from fastapi.middleware.cors import CORSMiddleware
from app.database import connect_to_mongo, close_mongo_connection
from app.routes import jobs, backends
from app.websockets import backend_status, job_updates

app = FastAPI(
    title="Decoherex API",
    description="Quantum Jobs Tracker Backend API",
    version="1.0.0",
    docs_url="/docs",
    redoc_url="/redoc"
)

# CORS middleware
app.add_middleware(
    CORSMiddleware,
    allow_origins=["http://localhost:5173", "http://localhost:3000"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Include routers
app.include_router(jobs.router, prefix="/jobs", tags=["Jobs"])
app.include_router(backends.router, prefix="/backends", tags=["Backends"])

# Include WebSocket routes
app.include_router(backend_status.router, tags=["WebSockets"])
app.include_router(job_updates.router, tags=["WebSockets"])

@app.on_event("startup")
async def startup_event():
    """Initialize MongoDB connection on startup"""
    await connect_to_mongo()

@app.on_event("shutdown")
async def shutdown_event():
    """Close MongoDB connection on shutdown"""
    await close_mongo_connection()

@app.get("/")
async def root():
    return {
        "message": "Decoherex Quantum Jobs Tracker API",
        "version": "1.0.0",
        "docs": "/docs",
        "status": "running"
    }

@app.get("/health")
async def health_check():
    return {"status": "healthy", "timestamp": "2024-01-15T10:00:00Z"}

@app.get("/test")
async def test_endpoint():
    return {"message": "Backend is working with MongoDB!"}
