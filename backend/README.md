# 🔮 Quantum Job Dashboard

A full-stack real-time dashboard for submitting and monitoring quantum computing jobs on IBM Quantum's real quantum computers.

![Quantum Dashboard](https://img.shields.io/badge/quantum-computing-blue) ![FastAPI](https://img.shields.io/badge/fastapi-green) ![WebSocket](https://img.shields.io/badge/websocket-realtime-orange)

## Features

✨ **Live Job Monitoring** - Real-time status updates via WebSocket  
⚡ **Three Quantum Circuits** - Superposition, Bell State, and Quantum Random  
🖥️ **Two Real Backends** - IBM Torino and IBM Brisbane quantum computers  
📊 **Progress Tracking** - Visual progress bars and color-coded status  
🔄 **Auto-Reconnect** - Automatic WebSocket reconnection on disconnect  
💾 **Job History** - Tracks last 20 jobs for trial accounts  

## Architecture

```
┌─────────────┐     WebSocket      ┌──────────────┐
│   Browser   │ ◄────────────────► │   FastAPI    │
│  (Frontend) │                     │   Backend    │
└─────────────┘                     └──────┬───────┘
                                           │
                                           ▼
                                    ┌──────────────┐
                                    │ IBM Quantum  │
                                    │   Backends   │
                                    └──────────────┘
```

## Quick Start

### 1. Get Your IBM Quantum API Token

1. Visit [IBM Quantum Platform](https://quantum.ibm.com/)
2. Create a free account (if you don't have one)
3. Go to **Account Settings** → **API Token**
4. Copy your API token

### 2. Start the Application

The application is already running! Just:

1. Open the webview
2. Paste your API token in the setup form
3. Click "Save Token"

### 3. Submit Your First Quantum Job

1. **Job Name** (optional): Give your job a friendly name
2. **Backend**: Choose `ibm_torino` or `ibm_brisbane`
3. **Circuit**: Select from:
   - **Superposition (1 qubit)**: Creates quantum superposition
   - **Bell State (2 qubits)**: Creates entangled quantum state
   - **Quantum Random (1 qubit)**: Quantum random number generator
4. **Shots**: Number of measurements (default: 1024)
5. Click **Submit Job**

## Available Quantum Circuits

### 1. Superposition (1 qubit)
```python
qc = QuantumCircuit(1, 1)
qc.h(0)          # Hadamard gate
qc.measure(0, 0) # Measure
```
Creates equal superposition of |0⟩ and |1⟩ states.

### 2. Bell State (2 qubits)
```python
qc = QuantumCircuit(2, 2)
qc.h(0)              # Hadamard on qubit 0
qc.cx(0, 1)          # CNOT gate
qc.measure([0,1], [0,1])
```
Creates maximally entangled Bell state (|00⟩ + |11⟩)/√2.

### 3. Quantum Random (1 qubit)
```python
qc = QuantumCircuit(1, 1)
qc.h(0)          # Hadamard gate
qc.measure(0, 0) # Measure
```
True quantum random number generation using superposition.

## API Endpoints

### REST Endpoints

| Method | Endpoint | Description |
|--------|----------|-------------|
| `GET` | `/` | Serve frontend dashboard |
| `POST` | `/save-token` | Save IBM Quantum API token |
| `GET` | `/token-status` | Check if token is configured |
| `GET` | `/backends` | List available quantum backends |
| `POST` | `/submit-job` | Submit quantum job |
| `GET` | `/jobs` | Get all jobs (last 20) |

### WebSocket Endpoint

| Endpoint | Description |
|----------|-------------|
| `WebSocket /ws/jobs` | Real-time job status updates |

## Job Status Flow

```
QUEUED (0%) → RUNNING (50%) → DONE (100%)
   ↓
ERROR (if failed)
```

Jobs are monitored every 5 seconds and updates are broadcast to all connected clients.

## Technology Stack

- **Backend**: Python 3.11, FastAPI, Uvicorn
- **Quantum**: Qiskit, Qiskit IBM Runtime
- **Real-time**: WebSockets
- **Frontend**: HTML5, CSS3, Vanilla JavaScript

## Project Structure

```
.
├── main.py              # FastAPI backend
├── static/
│   ├── index.html       # Dashboard UI
│   ├── style.css        # Styling
│   └── app.js           # WebSocket client
├── README.md            # This file
├── replit.md            # Project documentation
└── .gitignore           # Git ignore rules
```

## Development

### Running Locally

The application runs on port 5000:
```bash
uvicorn main:app --host 0.0.0.0 --port 5000 --reload
```

### Key Backend Features

- Asynchronous job monitoring with `asyncio`
- WebSocket broadcasting to all connected clients
- In-memory job storage (last 20 jobs)
- Automatic circuit transpilation to ISA format
- Error handling and reconnection logic

### Frontend Features

- WebSocket client with auto-reconnect
- Real-time table updates without page refresh
- Progress bars with percentage display
- Color-coded status badges
- Connection status indicator

## How It Works

1. **Token Setup**: User enters IBM Quantum API token → Backend saves it using Qiskit Runtime Service
2. **Job Submission**: 
   - User selects circuit and backend
   - Backend transpiles circuit to ISA format
   - Job submitted to IBM Quantum
   - Job ID returned and stored in memory
3. **Job Monitoring**:
   - Async task polls job status every 5 seconds
   - Status updates broadcast via WebSocket
   - Frontend updates table in real-time
4. **Live Updates**:
   - All connected clients receive updates
   - Progress bars update based on status
   - Color-coded badges reflect current state

## Limitations

- **In-memory storage**: Jobs are lost on server restart
- **20 job limit**: Displays only last 20 jobs (trial-friendly)
- **Small circuits**: Designed for ≤2 qubits for fast execution
- **No persistence**: No database backend (future enhancement)
- **No job cancellation**: Cannot cancel running jobs (future enhancement)
- **No result visualization**: Results not displayed (future enhancement)

## Future Enhancements

- [ ] Add database for persistent job storage
- [ ] Implement job result visualization with histograms
- [ ] Add job cancellation functionality
- [ ] Create user authentication system
- [ ] Add filtering and search capabilities
- [ ] Export job results to JSON/CSV
- [ ] Display backend queue information
- [ ] Add custom circuit support

## Security

- API tokens stored securely via Qiskit Runtime Service
- Tokens saved to `qiskit-ibm.json` (gitignored)
- Password input field for token entry
- No token exposure in frontend or logs

## Troubleshooting

### Token Not Working
- Ensure you copied the entire token from IBM Quantum Platform
- Check that your account is active
- Verify you have access to quantum backends

### WebSocket Disconnected
- The dashboard will automatically attempt to reconnect every 5 seconds
- Check your internet connection
- Refresh the page if reconnection fails

### Jobs Not Updating
- Check the connection status indicator (green dot = connected)
- Verify the WebSocket connection in browser console
- IBM backends may have queue delays (normal behavior)

## License

This project is open source and available for educational purposes.

## Credits

Built with:
- [FastAPI](https://fastapi.tiangolo.com/) - Modern web framework
- [Qiskit](https://qiskit.org/) - Quantum computing SDK
- [IBM Quantum](https://quantum.ibm.com/) - Quantum computing platform

---

**Made with ❤️ for the quantum computing community**
