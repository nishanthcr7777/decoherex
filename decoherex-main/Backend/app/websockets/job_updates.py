from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List, Dict, Any
import json
import asyncio
from datetime import datetime, timezone
import random
from app.database import get_database

router = APIRouter()

class JobConnectionManager:
    """Manages WebSocket connections for job updates"""
    
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.job_subscriptions: Dict[str, List[WebSocket]] = {}  # job_id -> [websockets]
        self.user_subscriptions: Dict[str, List[WebSocket]] = {}  # user_id -> [websockets]
    
    async def connect(self, websocket: WebSocket):
        """Accept a new WebSocket connection"""
        await websocket.accept()
        self.active_connections.append(websocket)
        print(f"New job WebSocket connection. Total connections: {len(self.active_connections)}")
    
    def disconnect(self, websocket: WebSocket):
        """Remove a WebSocket connection"""
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        
        # Remove from job subscriptions
        for job_id, connections in self.job_subscriptions.items():
            if websocket in connections:
                connections.remove(websocket)
                if not connections:
                    del self.job_subscriptions[job_id]
        
        # Remove from user subscriptions
        for user_id, connections in self.user_subscriptions.items():
            if websocket in connections:
                connections.remove(websocket)
                if not connections:
                    del self.user_subscriptions[user_id]
        
        print(f"Job WebSocket disconnected. Total connections: {len(self.active_connections)}")
    
    async def send_personal_message(self, message: str, websocket: WebSocket):
        """Send a message to a specific WebSocket connection"""
        try:
            await websocket.send_text(message)
        except:
            # Connection might be closed, remove it
            self.disconnect(websocket)
    
    async def broadcast_job_update(self, job_id: str, update_data: Dict[str, Any]):
        """Broadcast job update to all subscribers"""
        message = {
            "type": "job_update",
            "job_id": job_id,
            "data": update_data,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        # Send to job-specific subscribers
        if job_id in self.job_subscriptions:
            for connection in self.job_subscriptions[job_id].copy():
                try:
                    await connection.send_text(json.dumps(message))
                except:
                    self.disconnect(connection)
        
        # Send to all general job subscribers
        for connection in self.active_connections.copy():
            try:
                await connection.send_text(json.dumps(message))
            except:
                self.disconnect(connection)
    
    async def broadcast_job_progress(self, job_id: str, progress_data: Dict[str, Any]):
        """Broadcast job progress update"""
        message = {
            "type": "job_progress",
            "job_id": job_id,
            "data": progress_data,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        # Send to job-specific subscribers
        if job_id in self.job_subscriptions:
            for connection in self.job_subscriptions[job_id].copy():
                try:
                    await connection.send_text(json.dumps(message))
                except:
                    self.disconnect(connection)
    
    async def broadcast_job_log(self, job_id: str, log_data: Dict[str, Any]):
        """Broadcast new job log entry"""
        message = {
            "type": "job_log",
            "job_id": job_id,
            "data": log_data,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        # Send to job-specific subscribers
        if job_id in self.job_subscriptions:
            for connection in self.job_subscriptions[job_id].copy():
                try:
                    await connection.send_text(json.dumps(message))
                except:
                    self.disconnect(connection)
    
    async def subscribe_to_job(self, websocket: WebSocket, job_id: str):
        """Subscribe a WebSocket to specific job updates"""
        if job_id not in self.job_subscriptions:
            self.job_subscriptions[job_id] = []
        
        if websocket not in self.job_subscriptions[job_id]:
            self.job_subscriptions[job_id].append(websocket)
            print(f"WebSocket subscribed to job {job_id}. Total subscribers: {len(self.job_subscriptions[job_id])}")
    
    async def unsubscribe_from_job(self, websocket: WebSocket, job_id: str):
        """Unsubscribe a WebSocket from specific job updates"""
        if job_id in self.job_subscriptions and websocket in self.job_subscriptions[job_id]:
            self.job_subscriptions[job_id].remove(websocket)
            if not self.job_subscriptions[job_id]:
                del self.job_subscriptions[job_id]
            print(f"WebSocket unsubscribed from job {job_id}")

# Global job connection manager instance
job_manager = JobConnectionManager()

@router.websocket("/ws/job-updates")
async def websocket_job_updates(websocket: WebSocket):
    """WebSocket endpoint for general job updates"""
    await job_manager.connect(websocket)
    
    try:
        # Send initial system job overview
        db = get_database()
        collection = db.jobs
        
        # Get real job statistics
        total_jobs = await collection.count_documents({})
        pending_jobs = await collection.count_documents({"status": "pending"})
        running_jobs = await collection.count_documents({"status": "running"})
        completed_jobs = await collection.count_documents({"status": "completed"})
        failed_jobs = await collection.count_documents({"status": "failed"})
        
        initial_data = {
            "type": "job_system_overview",
            "data": {
                "total_jobs": total_jobs,
                "pending_jobs": pending_jobs,
                "running_jobs": running_jobs,
                "completed_jobs": completed_jobs,
                "failed_jobs": failed_jobs,
                "success_rate": round(completed_jobs / max(total_jobs, 1), 3)
            },
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        
        await job_manager.send_personal_message(json.dumps(initial_data), websocket)
        
        # Keep connection alive and handle incoming messages
        while True:
            try:
                # Wait for any message from client
                data = await websocket.receive_text()
                
                # Parse client message
                try:
                    message = json.loads(data)
                    msg_type = message.get("type", "unknown")
                    
                    if msg_type == "ping":
                        # Respond to ping with pong
                        await job_manager.send_personal_message(
                            json.dumps({"type": "pong", "timestamp": datetime.now(timezone.utc).isoformat()}),
                            websocket
                        )
                    
                    elif msg_type == "subscribe_job":
                        # Client wants to subscribe to specific job updates
                        job_id = message.get("job_id")
                        if job_id:
                            await job_manager.subscribe_to_job(websocket, job_id)
                            
                            # Send current job status
                            job = await collection.find_one({"job_id": job_id})
                            if job:
                                job_data = {
                                    "job_id": job["job_id"],
                                    "title": job["title"],
                                    "status": job["status"],
                                    "progress": job.get("progress", 0),
                                    "logs": job.get("logs", []),
                                    "results": job.get("results"),
                                    "error_message": job.get("error_message")
                                }
                                
                                await job_manager.send_personal_message(
                                    json.dumps({
                                        "type": "job_status",
                                        "job_id": job_id,
                                        "data": job_data,
                                        "timestamp": datetime.now(timezone.utc).isoformat()
                                    }),
                                    websocket
                                )
                    
                    elif msg_type == "unsubscribe_job":
                        # Client wants to unsubscribe from specific job updates
                        job_id = message.get("job_id")
                        if job_id:
                            await job_manager.unsubscribe_from_job(websocket, job_id)
                    
                    elif msg_type == "get_job_status":
                        # Client wants current status of a specific job
                        job_id = message.get("job_id")
                        if job_id:
                            job = await collection.find_one({"job_id": job_id})
                            if job:
                                job_data = {
                                    "job_id": job["job_id"],
                                    "title": job["title"],
                                    "status": job["status"],
                                    "progress": job.get("progress", 0),
                                    "logs": job.get("logs", []),
                                    "results": job.get("results"),
                                    "error_message": job.get("error_message")
                                }
                                
                                await job_manager.send_personal_message(
                                    json.dumps({
                                        "type": "job_status",
                                        "job_id": job_id,
                                        "data": job_data,
                                        "timestamp": datetime.now(timezone.utc).isoformat()
                                    }),
                                    websocket
                                )
                
                except json.JSONDecodeError:
                    # Invalid JSON, ignore
                    pass
                    
            except WebSocketDisconnect:
                break
                
    except WebSocketDisconnect:
        pass
    finally:
        job_manager.disconnect(websocket)

@router.websocket("/ws/job-updates/{job_id}")
async def websocket_specific_job_updates(websocket: WebSocket, job_id: str):
    """WebSocket endpoint for specific job updates"""
    await job_manager.connect(websocket)
    await job_manager.subscribe_to_job(websocket, job_id)
    
    try:
        # Send initial job status
        db = get_database()
        collection = db.jobs
        
        job = await collection.find_one({"job_id": job_id})
        if job:
            job_data = {
                "job_id": job["job_id"],
                "title": job["title"],
                "status": job["status"],
                "progress": job.get("progress", 0),
                "logs": job.get("logs", []),
                "results": job.get("results"),
                "error_message": job.get("error_message")
            }
            
            await job_manager.send_personal_message(
                json.dumps({
                    "type": "job_status",
                    "job_id": job_id,
                    "data": job_data,
                    "timestamp": datetime.now(timezone.utc).isoformat()
                }),
                websocket
            )
        
        # Keep connection alive
        while True:
            try:
                data = await websocket.receive_text()
                
                # Handle ping/pong
                try:
                    message = json.loads(data)
                    if message.get("type") == "ping":
                        await job_manager.send_personal_message(
                            json.dumps({"type": "pong", "timestamp": datetime.now(timezone.utc).isoformat()}),
                            websocket
                        )
                except json.JSONDecodeError:
                    pass
                    
            except WebSocketDisconnect:
                break
                
    except WebSocketDisconnect:
        pass
    finally:
        await job_manager.unsubscribe_from_job(websocket, job_id)
        job_manager.disconnect(websocket)

# Background task to simulate real-time job updates
async def simulate_job_updates():
    """Simulate real-time job updates for demonstration"""
    while True:
        try:
            # Get current jobs from database
            db = get_database()
            collection = db.jobs
            
            # Update running jobs progress
            running_jobs = await collection.find({"status": "running"}).to_list(length=10)
            
            for job in running_jobs:
                # Simulate progress updates
                current_progress = job.get("progress", 0)
                if current_progress < 100:
                    new_progress = min(current_progress + random.randint(5, 15), 100)
                    
                    # Update database
                    await collection.update_one(
                        {"job_id": job["job_id"]},
                        {"$set": {"progress": new_progress}}
                    )
                    
                    # Broadcast progress update
                    progress_data = {
                        "job_id": job["job_id"],
                        "progress": new_progress,
                        "status": "running"
                    }
                    await job_manager.broadcast_job_progress(job["job_id"], progress_data)
                    
                    # Add progress log
                    if new_progress == 100:
                        log_entry = f"Job completed successfully at {datetime.now(timezone.utc).isoformat()}"
                        await collection.update_one(
                            {"job_id": job["job_id"]},
                            {
                                "$set": {
                                    "status": "completed",
                                    "completed_at": datetime.now(timezone.utc)
                                },
                                "$push": {"logs": log_entry}
                            }
                        )
                        
                        # Broadcast completion
                        completion_data = {
                            "job_id": job["job_id"],
                            "status": "completed",
                            "progress": 100,
                            "completed_at": datetime.now(timezone.utc).isoformat()
                        }
                        await job_manager.broadcast_job_update(job["job_id"], completion_data)
                    
                    else:
                        log_entry = f"Progress update: {new_progress}% at {datetime.now(timezone.utc).isoformat()}"
                        await collection.update_one(
                            {"job_id": job["job_id"]},
                            {"$push": {"logs": log_entry}}
                        )
                        
                        # Broadcast log update
                        log_data = {
                            "job_id": job["job_id"],
                            "log_entry": log_entry,
                            "total_logs": len(job.get("logs", [])) + 1
                        }
                        await job_manager.broadcast_job_log(job["job_id"], log_data)
            
            # Wait before next update
            await asyncio.sleep(10)  # Update every 10 seconds
            
        except Exception as e:
            print(f"Error in job update simulation: {e}")
            await asyncio.sleep(30)  # Wait longer on error

# Start the background task when the module is imported
# In a real application, this would be started by the main application
# asyncio.create_task(simulate_job_updates())
