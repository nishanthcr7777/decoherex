import asyncio
import aiohttp
import json
from datetime import datetime

async def test_job_endpoints():
    """Test all job management endpoints"""
    base_url = "http://localhost:8000"
    
    async with aiohttp.ClientSession() as session:
        print("🧪 Testing Job Management API Endpoints...")
        print("=" * 50)
        
        # Test 1: Get all jobs
        print("\n1️⃣ Testing GET /jobs")
        try:
            async with session.get(f"{base_url}/jobs") as response:
                if response.status == 200:
                    jobs = await response.json()
                    print(f"✅ Success! Found {len(jobs)} jobs")
                    for job in jobs[:2]:  # Show first 2 jobs
                        print(f"   - {job['title']} ({job['status']})")
                else:
                    print(f"❌ Failed with status {response.status}")
        except Exception as e:
            print(f"❌ Error: {e}")
        
        # Test 2: Get specific job
        print("\n2️⃣ Testing GET /jobs/job_001")
        try:
            async with session.get(f"{base_url}/jobs/job_001") as response:
                if response.status == 200:
                    job = await response.json()
                    print(f"✅ Success! Job: {job['title']}")
                    print(f"   Status: {job['status']}, Progress: {job['progress']}%")
                else:
                    print(f"❌ Failed with status {response.status}")
        except Exception as e:
            print(f"❌ Error: {e}")
        
        # Test 3: Create new job
        print("\n3️⃣ Testing POST /jobs")
        new_job = {
            "title": "Test Quantum Circuit",
            "description": "Testing the API with a new quantum job",
            "backend_id": "ibm_osaka",
            "shots": 1000,
            "qubits": 5,
            "depth": 10,
            "priority": "medium"
        }
        
        try:
            async with session.post(f"{base_url}/jobs", json=new_job) as response:
                if response.status == 201:
                    created_job = await response.json()
                    print(f"✅ Success! Created job: {created_job['job_id']}")
                    print(f"   Title: {created_job['title']}, Status: {created_job['status']}")
                else:
                    print(f"❌ Failed with status {response.status}")
                    error_text = await response.text()
                    print(f"   Error: {error_text}")
        except Exception as e:
            print(f"❌ Error: {e}")
        
        # Test 4: Get job logs
        print("\n4️⃣ Testing GET /jobs/job_001/logs")
        try:
            async with session.get(f"{base_url}/jobs/job_001/logs") as response:
                if response.status == 200:
                    logs = await response.json()
                    print(f"✅ Success! Found {logs['total_logs']} log entries")
                    for log in logs['logs'][:3]:  # Show first 3 logs
                        print(f"   - {log}")
                else:
                    print(f"❌ Failed with status {response.status}")
        except Exception as e:
            print(f"❌ Error: {e}")
        
        # Test 5: Get job results
        print("\n5️⃣ Testing GET /jobs/job_001/results")
        try:
            async with session.get(f"{base_url}/jobs/job_001/results") as response:
                if response.status == 200:
                    results = await response.json()
                    print(f"✅ Success! Job completed at: {results['completed_at']}")
                    if results['results']:
                        print(f"   Fidelity: {results['results'].get('fidelity', 'N/A')}")
                else:
                    print(f"❌ Failed with status {response.status}")
                    error_text = await response.text()
                    print(f"   Error: {error_text}")
        except Exception as e:
            print(f"❌ Error: {e}")
        
        print("\n" + "=" * 50)
        print("🎯 API Testing Complete!")

if __name__ == "__main__":
    print("🚀 Starting Job Management API Tests...")
    asyncio.run(test_job_endpoints())
