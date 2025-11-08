# Quantum Job Dashboard

## Overview
A full-stack quantum computing dashboard that enables users to submit and monitor real quantum jobs on IBM Quantum computers (Torino and Brisbane). Built with FastAPI backend, vanilla JavaScript frontend, and WebSocket for real-time updates.

## Project Purpose
- Submit quantum circuits to IBM Quantum backends
- Monitor job status in real-time
- Track job queue and progress
- Provide live updates without page refresh

## Technology Stack
- **Backend**: Python FastAPI
- **Quantum Computing**: Qiskit, Qiskit IBM Runtime
- **Real-time Communication**: WebSockets
- **Frontend**: HTML5, CSS3, Vanilla JavaScript
- **Server**: Uvicorn ASGI server

## Recent Changes (October 9, 2025)
- Initial project setup with complete quantum job dashboard
- Implemented FastAPI backend with 5 endpoints
- Created three predefined quantum circuits (Superposition, Bell State, Quantum Random)
- Added WebSocket support for live job updates
- Built responsive frontend with gradient UI
- Integrated IBM Quantum authentication and job submission
- Added asynchronous job monitoring with progress tracking

## Architecture

### Backend Structure (`main.py`)
- **Endpoints**:
  - `POST /save-token`: Save IBM Quantum API token
  - `GET /token-status`: Check if token is configured
  - `GET /backends`: List available quantum backends
  - `POST /submit-job`: Submit quantum job to IBM
  - `GET /jobs`: Get all jobs sorted by time
  - `WebSocket /ws/jobs`: Real-time job updates

### Frontend Structure (`static/`)
- `index.html`: Dashboard UI with forms and tables
- `style.css`: Gradient styling and responsive design
- `app.js`: WebSocket client and DOM manipulation

### Predefined Circuits
1. **Superposition (1 qubit)**: H gate + measurement
2. **Bell State (2 qubits)**: H gate + CNOT + measurement
3. **Quantum Random (1 qubit)**: H gate + measurement for RNG

### Job Status Flow
1. User submits job → Backend receives request
2. Circuit transpiled to ISA format
3. Job submitted to IBM Quantum backend
4. Job stored in memory with QUEUED status
5. Async monitor polls job every 5 seconds
6. WebSocket broadcasts updates to all clients
7. Frontend updates table and progress bars

## Configuration

### IBM Quantum Setup
1. Visit https://quantum.ibm.com/
2. Create free account
3. Get API token from account settings
4. Enter token in dashboard UI

### Environment
- Python 3.11
- Port 5000 (required for Replit)
- No database (in-memory storage)
- Keeps last 20 jobs for trial accounts

## Features
- Real-time job status updates (QUEUED → RUNNING → DONE)
- Progress bars with percentage
- Color-coded status badges (yellow=queued, blue=running, green=done, red=error)
- Automatic reconnection on WebSocket disconnect
- Connection status indicator
- Responsive table layout
- Job history tracking

## Security
- API token stored securely via Qiskit Runtime Service
- Token never exposed in frontend
- Password input field for token entry
- Credentials saved to `qiskit-ibm.json` (gitignored)

## Development
- Workflow: `Server` runs uvicorn on port 5000
- Auto-reload enabled for development
- WebSocket protocol auto-detects (ws:// or wss://)

## Limitations
- In-memory storage (jobs lost on restart)
- Maximum 20 jobs displayed (trial account friendly)
- Small circuits only (≤2 qubits for fast execution)
- No job cancellation feature (future enhancement)
- No result visualization (future enhancement)

## User Preferences
None specified yet.
