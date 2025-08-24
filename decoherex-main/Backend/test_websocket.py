import asyncio
import websockets
import json
from datetime import datetime

async def test_backend_status_websocket():
    """Test the backend status WebSocket endpoint"""
    uri = "ws://localhost:8000/ws/backend-status"
    
    try:
        async with websockets.connect(uri) as websocket:
            print("🔌 Connected to backend status WebSocket")
            
            # Wait for initial messages
            print("📡 Waiting for initial backend status updates...")
            
            # Listen for messages for 10 seconds
            start_time = datetime.now()
            message_count = 0
            
            while (datetime.now() - start_time).seconds < 10:
                try:
                    # Wait for message with timeout
                    message = await asyncio.wait_for(websocket.recv(), timeout=1.0)
                    message_count += 1
                    
                    # Parse and display message
                    data = json.loads(message)
                    msg_type = data.get("type", "unknown")
                    
                    if msg_type == "backend_status_update":
                        backend_id = data.get("backend_id", "unknown")
                        status = data.get("data", {}).get("status", "unknown")
                        queue_length = data.get("data", {}).get("current_queue_length", 0)
                        print(f"📊 Backend {backend_id}: {status} (Queue: {queue_length})")
                    
                    elif msg_type == "system_overview_update":
                        overview = data.get("data", {})
                        online = overview.get("online_backends", 0)
                        total = overview.get("total_backends", 0)
                        system_status = overview.get("system_status", "unknown")
                        print(f"🌐 System: {online}/{total} backends online - {system_status}")
                    
                    elif msg_type == "pong":
                        print("🏓 Received pong response")
                    
                    else:
                        print(f"📨 Unknown message type: {msg_type}")
                        
                except asyncio.TimeoutError:
                    # No message received within timeout, continue
                    continue
                except Exception as e:
                    print(f"❌ Error processing message: {e}")
                    break
            
            print(f"\n📈 Received {message_count} messages in 10 seconds")
            
            # Send a ping to test keep-alive
            ping_message = json.dumps({"type": "ping"})
            await websocket.send(ping_message)
            print("🏓 Sent ping message")
            
            # Wait for pong response
            try:
                response = await asyncio.wait_for(websocket.recv(), timeout=2.0)
                data = json.loads(response)
                if data.get("type") == "pong":
                    print("✅ Received pong response - WebSocket is working!")
                else:
                    print(f"❌ Unexpected response: {data}")
            except asyncio.TimeoutError:
                print("❌ No pong response received")
            
    except Exception as e:
        print(f"❌ WebSocket connection failed: {e}")

async def test_specific_backend_websocket():
    """Test the specific backend WebSocket endpoint"""
    uri = "ws://localhost:8000/ws/backend-status/ibm_osaka"
    
    try:
        async with websockets.connect(uri) as websocket:
            print("\n🔌 Connected to IBM Osaka specific WebSocket")
            
            # Wait for initial status
            print("📡 Waiting for IBM Osaka status...")
            
            try:
                message = await asyncio.wait_for(websocket.recv(), timeout=5.0)
                data = json.loads(message)
                
                if data.get("type") == "backend_status_update":
                    backend_data = data.get("data", {})
                    status = backend_data.get("status", "unknown")
                    qubits = backend_data.get("hardware_info", {}).get("qubits", "N/A")
                    print(f"📊 IBM Osaka: {status} - Hardware info available")
                else:
                    print(f"❌ Unexpected message type: {data.get('type')}")
                    
            except asyncio.TimeoutError:
                print("❌ No initial status received")
            
    except Exception as e:
        print(f"❌ Specific backend WebSocket failed: {e}")

async def main():
    """Run all WebSocket tests"""
    print("🧪 Testing Backend Management WebSocket Endpoints")
    print("=" * 50)
    
    # Test general backend status WebSocket
    await test_backend_status_websocket()
    
    # Test specific backend WebSocket
    await test_specific_backend_websocket()
    
    print("\n🎯 WebSocket testing completed!")

if __name__ == "__main__":
    print("🚀 Starting WebSocket tests...")
    asyncio.run(main())
