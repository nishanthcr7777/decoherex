from fastapi import APIRouter, WebSocket, WebSocketDisconnect
from typing import List, Dict, Any
import json
import asyncio
from datetime import datetime, timezone
import random

router = APIRouter()

class ConnectionManager:
    """Manages WebSocket connections for backend status updates"""
    
    def __init__(self):
        self.active_connections: List[WebSocket] = []
        self.backend_status_cache: Dict[str, Dict[str, Any]] = {}
    
    async def connect(self, websocket: WebSocket):
        """Accept a new WebSocket connection"""
        await websocket.accept()
        self.active_connections.append(websocket)
        print(f"New WebSocket connection. Total connections: {len(self.active_connections)}")
    
    def disconnect(self, websocket: WebSocket):
        """Remove a WebSocket connection"""
        if websocket in self.active_connections:
            self.active_connections.remove(websocket)
        print(f"WebSocket disconnected. Total connections: {len(self.active_connections)}")
    
    async def send_personal_message(self, message: str, websocket: WebSocket):
        """Send a message to a specific WebSocket connection"""
        try:
            await websocket.send_text(message)
        except:
            # Connection might be closed, remove it
            self.disconnect(websocket)
    
    async def broadcast(self, message: str):
        """Send a message to all active WebSocket connections"""
        if not self.active_connections:
            return
        
        # Create a copy of the list to avoid modification during iteration
        connections = self.active_connections.copy()
        
        for connection in connections:
            try:
                await connection.send_text(message)
            except:
                # Connection is closed, remove it
                self.disconnect(connection)
    
    async def broadcast_backend_status(self, backend_id: str, status_data: Dict[str, Any]):
        """Broadcast backend status update to all connected clients"""
        message = {
            "type": "backend_status_update",
            "backend_id": backend_id,
            "data": status_data,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        await self.broadcast(json.dumps(message))
    
    async def broadcast_system_overview(self, overview_data: Dict[str, Any]):
        """Broadcast system overview update to all connected clients"""
        message = {
            "type": "system_overview_update",
            "data": overview_data,
            "timestamp": datetime.now(timezone.utc).isoformat()
        }
        await self.broadcast(json.dumps(message))

# Global connection manager instance
manager = ConnectionManager()

# Mock backend data for demonstration
MOCK_BACKENDS = {
    "ibm_osaka": {
        "name": "IBM Osaka",
        "provider": "IBM Quantum",
        "location": "Osaka, Japan",
        "qubits": 433
    },
    "google_sycamore": {
        "name": "Google Sycamore",
        "provider": "Google Quantum AI",
        "location": "Santa Barbara, CA",
        "qubits": 53
    },
    "ionq_harmony": {
        "name": "IonQ Harmony",
        "provider": "IonQ",
        "location": "College Park, MD",
        "qubits": 11
    }
}

def generate_mock_backend_status(backend_id: str) -> Dict[str, Any]:
    """Generate mock backend status for WebSocket updates"""
    now = datetime.now(timezone.utc)
    status_options = ["online", "online", "online", "busy", "maintenance"]
    status = random.choice(status_options)
    
    return {
        "backend_id": backend_id,
        "name": MOCK_BACKENDS[backend_id]["name"],
        "status": status,
        "last_heartbeat": (now - asyncio.get_event_loop().time() * 0.001).isoformat(),
        "uptime_seconds": random.randint(3600, 86400),
        "total_jobs_processed": random.randint(1000, 10000),
        "current_queue_length": random.randint(0, 50),
        "error_count": random.randint(0, 10),
        "last_error": random.choice([None, "Calibration drift detected", "Network timeout"]),
        "hardware_info": {
            "temperature": round(random.uniform(0.01, 0.1), 3),
            "coherence_time": random.randint(50, 200),
            "gate_fidelity": round(random.uniform(0.95, 0.99), 3)
        } if status == "online" else None
    }

def generate_mock_system_overview() -> Dict[str, Any]:
    """Generate mock system overview for WebSocket updates"""
    total_backends = len(MOCK_BACKENDS)
    online_backends = sum(1 for _ in range(total_backends) if random.choice([True, True, True, False]))
    
    return {
        "total_backends": total_backends,
        "online_backends": online_backends,
        "offline_backends": total_backends - online_backends,
        "system_status": "healthy" if online_backends > total_backends // 2 else "degraded",
        "last_updated": datetime.now(timezone.utc).isoformat()
    }

@router.websocket("/ws/backend-status")
async def websocket_backend_status(websocket: WebSocket):
    """WebSocket endpoint for backend status updates"""
    await manager.connect(websocket)
    
    try:
        # Send initial status for all backends
        for backend_id in MOCK_BACKENDS.keys():
            status_data = generate_mock_backend_status(backend_id)
            await manager.send_personal_message(
                json.dumps({
                    "type": "backend_status_update",
                    "backend_id": backend_id,
                    "data": status_data,
                    "timestamp": datetime.now(timezone.utc).isoformat()
                }),
                websocket
            )
        
        # Send initial system overview
        overview_data = generate_mock_system_overview()
        await manager.send_personal_message(
            json.dumps({
                "type": "system_overview_update",
                "data": overview_data,
                "timestamp": datetime.now(timezone.utc).isoformat()
            }),
            websocket
        )
        
        # Keep connection alive and handle incoming messages
        while True:
            try:
                # Wait for any message from client (ping/pong for keep-alive)
                data = await websocket.receive_text()
                
                # Parse client message
                try:
                    message = json.loads(data)
                    if message.get("type") == "ping":
                        # Respond to ping with pong
                        await manager.send_personal_message(
                            json.dumps({"type": "pong", "timestamp": datetime.now(timezone.utc).isoformat()}),
                            websocket
                        )
                    elif message.get("type") == "subscribe_backend":
                        # Client wants to subscribe to specific backend updates
                        backend_id = message.get("backend_id")
                        if backend_id:
                            # Send current status for requested backend
                            status_data = generate_mock_backend_status(backend_id)
                            await manager.send_personal_message(
                                json.dumps({
                                    "type": "backend_status_update",
                                    "backend_id": backend_id,
                                    "data": status_data,
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
        manager.disconnect(websocket)

@router.websocket("/ws/backend-status/{backend_id}")
async def websocket_specific_backend_status(websocket: WebSocket, backend_id: str):
    """WebSocket endpoint for specific backend status updates"""
    if backend_id not in MOCK_BACKENDS:
        await websocket.close(code=4004, reason="Backend not found")
        return
    
    await manager.connect(websocket)
    
    try:
        # Send initial status for the specific backend
        status_data = generate_mock_backend_status(backend_id)
        await manager.send_personal_message(
            json.dumps({
                "type": "backend_status_update",
                "backend_id": backend_id,
                "data": status_data,
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
                        await manager.send_personal_message(
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
        manager.disconnect(websocket)

# Background task to simulate real-time updates
async def simulate_backend_updates():
    """Simulate real-time backend status updates"""
    while True:
        try:
            # Update each backend status
            for backend_id in MOCK_BACKENDS.keys():
                status_data = generate_mock_backend_status(backend_id)
                await manager.broadcast_backend_status(backend_id, status_data)
            
            # Update system overview
            overview_data = generate_mock_system_overview()
            await manager.broadcast_system_overview(overview_data)
            
            # Wait before next update
            await asyncio.sleep(30)  # Update every 30 seconds
            
        except Exception as e:
            print(f"Error in backend update simulation: {e}")
            await asyncio.sleep(60)  # Wait longer on error

# Start the background task when the module is imported
# In a real application, this would be started by the main application
# asyncio.create_task(simulate_backend_updates())
