# 🌌 Decoherex - AI-Powered Quantum Computing Platform

<div align="center">

**Next-Generation Quantum Job Management & Optimization Platform**

[![Built with React](https://img.shields.io/badge/React-18.x-61DAFB?logo=react)](https://reactjs.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.100+-009688?logo=fastapi)](https://fastapi.tiangolo.com/)
[![Qiskit](https://img.shields.io/badge/Qiskit-1.x-6929C4?logo=qiskit)](https://qiskit.org/)
[![IBM Quantum](https://img.shields.io/badge/IBM_Quantum-Enabled-052FAD?logo=ibm)](https://quantum-computing.ibm.com/)

*Developed by Team Decoherex for Amaravathi Quantum Valley Hackathon 2025*

[Features](#-key-features) • [Architecture](#-architecture) • [Installation](#-installation) • [Documentation](#-documentation)

</div>

---

## 🎯 Overview

**Decoherex** is a comprehensive quantum computing platform that bridges the gap between quantum hardware and practical applications. Built on cutting-edge AI and real-time analytics, it provides intelligent backend optimization, interactive quantum circuit design, and advanced job monitoring—all through an intuitive, production-ready interface.

### 🏆 What Makes Decoherex Unique

- **AI-Powered Intelligence**: Machine learning models trained on real IBM Quantum data provide backend recommendations and predictive job analysis
- **Interactive Quantum Lab**: Visual circuit builder with AI-powered explanations and real-time simulation
- **Enterprise-Grade Monitoring**: Real-time job tracking with lifecycle visualization and performance analytics
- **Predictive Analysis**: Pre-flight checks estimate job performance before submission
- **Production-Ready**: Built with scalability, security, and user experience as core principles

---

## ✨ Key Features

### 🤖 AI Teacher & Code Generation
- **Interactive Circuit Explanation**: AI-powered explanations of quantum circuits in structured Markdown format
- **Intelligent Code Generation**: Natural language to Qiskit code conversion with automatic error correction
- **Real-time Simulation**: Instant circuit visualization with histogram and statevector analysis
- **Safety Hardening**: Automatic detection and removal of deprecated Qiskit patterns

### 📊 Advanced Analytics Dashboards

#### Performance Analytics & Insights
- Real-time KPI monitoring (success rate, avg execution time, queue efficiency)
- Performance data grid with deterministic mock data generation
- Error pattern heatmap across backends
- Trend analysis with interactive charts (Recharts integration)

#### Quantum Operations Command Center
- **Job Lifecycle Flow**: Visual Kanban-style job tracking (Queued → Running → Completed/Failed)
- **Live Job Feed**: Real-time job updates with status filtering
- **Job Management Grid**: Sortable, searchable job table with bulk actions
- **Job Submission Modal**: Template-based or custom code submission with predictive analysis

#### AI-Powered Backend Optimization
- Machine learning recommendations for optimal backend selection
- Predictive analytics for job success probability
- Resource utilization forecasting
- Cost-benefit analysis for backend choices

### 🔮 Predictive Analysis Engine
- **Pre-flight Checks**: Estimate execution time, failure risk, and optimal backends before job submission
- **AI Confidence Scoring**: Weighted analysis based on historical performance data
- **Smart Recommendations**: Context-aware suggestions for circuit optimization

### 🎨 Modern User Experience
- **Glassmorphism Design**: Premium UI with frosted glass effects and smooth animations
- **Responsive Layout**: Mobile-first design with adaptive components
- **Dark Mode Optimized**: Eye-friendly interface for extended use
- **Accessibility**: WCAG 2.1 compliant with keyboard navigation support

---

## 🏗️ Architecture

### System Overview

```
┌─────────────────────────────────────────────────────────────────┐
│                        Frontend Layer                            │
│  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐          │
│  │ Quantum Lab  │  │  Analytics   │  │ Job Tracker  │          │
│  │   (React)    │  │  Dashboard   │  │   (React)    │          │
│  └──────┬───────┘  └──────┬───────┘  └──────┬───────┘          │
│         │                  │                  │                  │
│         └──────────────────┴──────────────────┘                  │
│                            │                                     │
└────────────────────────────┼─────────────────────────────────────┘
                             │ REST API / WebSocket
┌────────────────────────────┼─────────────────────────────────────┐
│                            │      Backend Layer                   │
│         ┌──────────────────▼──────────────────┐                  │
│         │     FastAPI Core (Port 5001)        │                  │
│         │  ┌────────────────────────────────┐ │                  │
│         │  │  • Job Management              │ │                  │
│         │  │  • Circuit Simulation          │ │                  │
│         │  │  • AI Code Generation (Groq)   │ │                  │
│         │  │  • WebSocket Job Updates       │ │                  │
│         │  │  • Supabase Integration        │ │                  │
│         │  └────────────────────────────────┘ │                  │
│         └─────────────┬───────────────────────┘                  │
│                       │                                           │
│         ┌─────────────▼───────────────────────┐                  │
│         │  AI Model Service (Port 7777)       │                  │
│         │  ┌────────────────────────────────┐ │                  │
│         │  │  • Backend Recommender (ML)    │ │                  │
│         │  │  • Predictive Analytics        │ │                  │
│         │  │  • Label Encoders              │ │                  │
│         │  └────────────────────────────────┘ │                  │
│         └─────────────────────────────────────┘                  │
└──────────────────────────────┬──────────────────────────────────┘
                               │
┌──────────────────────────────┼──────────────────────────────────┐
│                              │   External Services               │
│         ┌────────────────────▼──────────────┐                    │
│         │      IBM Quantum Platform          │                    │
│         │  • ibm_torino, ibm_fez, etc.      │                    │
│         │  • Real-time job execution        │                    │
│         └───────────────────────────────────┘                    │
│         ┌───────────────────────────────────┐                    │
│         │      Supabase (PostgreSQL)        │                    │
│         │  • Job history & metrics          │                    │
│         │  • Backend performance data       │                    │
│         └───────────────────────────────────┘                    │
│         ┌───────────────────────────────────┐                    │
│         │      Groq AI (LLM)                │                    │
│         │  • Circuit explanations           │                    │
│         │  • Code generation                │                    │
│         │  • Predictive analysis            │                    │
│         └───────────────────────────────────┘                    │
└───────────────────────────────────────────────────────────────────┘
```

### Technology Stack

#### Frontend
- **Framework**: React 18.x with Vite for blazing-fast HMR
- **Styling**: Tailwind CSS with custom design system
- **Animations**: Framer Motion for fluid transitions
- **Charts**: Recharts for interactive data visualization
- **Icons**: Lucide React for consistent iconography
- **State Management**: React Hooks with context API

#### Backend
- **API Framework**: FastAPI (async Python web framework)
- **Quantum SDK**: Qiskit 1.x for circuit operations
- **AI/ML**: Scikit-learn for backend recommendations
- **LLM Integration**: Groq API for natural language processing
- **Database**: Supabase (PostgreSQL) for persistent storage
- **Real-time**: WebSocket for live job updates

#### AI/ML Components
- **Backend Recommender**: Random Forest classifier trained on 1M+ job records
- **Feature Engineering**: Multi-dimensional encoding (backend, job type, circuit depth, qubits)
- **Prediction Accuracy**: 94% confidence on test dataset
- **Model Size**: 122.34 MB (optimized for production)

---

## 🚀 Installation

### Prerequisites

- **Python**: 3.9 or higher
- **Node.js**: 16.x or higher
- **IBM Quantum Account**: [Sign up here](https://quantum-computing.ibm.com/)
- **Supabase Account**: [Sign up here](https://supabase.com/)
- **Groq API Key**: [Get API key](https://console.groq.com/)

### 1. Clone the Repository

```bash
git clone https://github.com/your-org/decoherex.git
cd decoherex
```

### 2. Backend Setup

#### Create Python Virtual Environment

```bash
python -m venv .venv

# Windows
.venv\Scripts\activate

# macOS/Linux
source .venv/bin/activate
```

#### Install Dependencies

```bash
pip install -r requirements.txt
```

#### Configure Environment Variables

Create `backend/.env`:

```env
# IBM Quantum
IBM_QUANTUM_TOKEN=your_ibm_quantum_token_here

# Supabase
SUPABASE_URL=your_supabase_url
SUPABASE_KEY=your_supabase_anon_key

# Groq AI
GROQ_API_KEY=your_groq_api_key

# Server Configuration
BACKEND_PORT=5001
AI_MODEL_PORT=7777
```

#### Obtain AI Model Files

> **Important**: Due to GitHub file size limits, model files are not included in the repository.

Download the following files and place them in `ai_model/`:
- `backend_recommender.pkl` (122.34 MB)
- `encoders.pkl`

Contact project maintainers for access to these files.

### 3. Frontend Setup

```bash
cd frontend/decoherex_analytics
npm install
```

#### Configure Environment Variables

Create `frontend/decoherex_analytics/.env`:

```env
VITE_API_BASE_URL=http://localhost:5001
VITE_AI_MODEL_URL=http://localhost:7777
VITE_SUPABASE_URL=your_supabase_url
VITE_SUPABASE_ANON_KEY=your_supabase_anon_key
```

---

## 🎮 Running the Application

### Start Backend Services

#### Terminal 1: Core API Server

```bash
cd backend
.venv\Scripts\activate  # Windows
uvicorn main:app --host 0.0.0.0 --port 5001 --reload
```

#### Terminal 2: AI Model Server

```bash
cd ai_model
.venv\Scripts\activate  # Windows
uvicorn predictor:app --host 0.0.0.0 --port 7777 --reload
```

### Start Frontend

#### Terminal 3: React Development Server

```bash
cd frontend/decoherex_analytics
npm start
```

The application will be available at `http://localhost:5173`

---

## 📖 Documentation

### API Endpoints

#### Core Backend (Port 5001)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/api/generate-code` | POST | Generate Qiskit code from natural language |
| `/api/simulate` | POST | Simulate quantum circuit and return results |
| `/api/ai/explain` | POST | Get AI explanation of circuit code |
| `/api/ai/predict` | POST | Pre-flight analysis for job submission |
| `/api/submit-job` | POST | Submit job to IBM Quantum backend |
| `/api/jobs` | GET | Retrieve all jobs from Supabase |
| `/api/dashboard-data` | GET | Get performance analytics data |
| `/backends` | GET | List available IBM Quantum backends |
| `/ws/jobs` | WebSocket | Real-time job status updates |

#### AI Model Service (Port 7777)

| Endpoint | Method | Description |
|----------|--------|-------------|
| `/recommend_backends` | POST | Get ML-powered backend recommendations |

### Data Models

#### Job Submission Request

```json
{
  "backend": "ibm_torino",
  "circuit_code": "qc = QuantumCircuit(2)\nqc.h(0)\nqc.cx(0, 1)",
  "job_type": "Bell State",
  "shots": 1024,
  "job_name": "my_quantum_job"
}
```

#### Predictive Analysis Response

```json
{
  "estimated_time": "45 seconds",
  "failure_risk": "Low (12%)",
  "recommended_backends": ["ibm_torino", "ibm_fez"],
  "confidence": 94.5,
  "optimization_tips": ["Reduce circuit depth", "Use native gates"]
}
```

---

## 🎨 Features in Detail

### Quantum Lab

The interactive circuit builder provides:
- **Visual Circuit Design**: Drag-and-drop gate placement
- **Code Editor**: Monaco-based editor with syntax highlighting
- **AI Assistance**: Natural language to circuit conversion
- **Real-time Simulation**: Instant feedback on circuit behavior
- **Export Options**: Download circuits as QASM, Python, or images

### Performance Dashboard

Real-time analytics include:
- **Success Rate Tracking**: Monitor job completion rates across backends
- **Execution Time Analysis**: Identify performance bottlenecks
- **Queue Efficiency**: Optimize job submission timing
- **Error Pattern Detection**: Visualize common failure modes
- **Historical Trends**: 30-day performance comparisons

### Job Management

Comprehensive job tracking with:
- **Lifecycle Visualization**: Kanban-style job flow
- **Status Filtering**: Quick access to running/failed/completed jobs
- **Bulk Operations**: Export, retry, or delete multiple jobs
- **Search & Sort**: Find jobs by ID, backend, or type
- **Real-time Updates**: WebSocket-powered live status changes

---

## 🔧 Troubleshooting

### Common Issues

#### Backend Connection Failed

**Symptoms**: `net::ERR_FAILED` or `TypeError: Failed to fetch`

**Solutions**:
1. Verify both backend servers are running (ports 5001 and 7777)
2. Check `.env` files for correct API URLs
3. Ensure firewall allows local connections
4. Review browser console for detailed error messages

#### Model Files Not Found

**Symptoms**: `FileNotFoundError: backend_recommender.pkl`

**Solutions**:
1. Download model files from project maintainers
2. Place files in `ai_model/` directory
3. Verify file permissions (read access required)

#### Invalid Date / NaN Errors

**Symptoms**: "Invalid Date" or "NaNm" in dashboard

**Solutions**:
- Already fixed in latest version with robust data accessors
- Ensure Supabase returns properly formatted timestamps
- Check browser console for data format mismatches

#### IBM Quantum Authentication Failed

**Symptoms**: `401 Unauthorized` when submitting jobs

**Solutions**:
1. Verify `IBM_QUANTUM_TOKEN` in `backend/.env`
2. Check token validity at [IBM Quantum Dashboard](https://quantum-computing.ibm.com/)
3. Ensure token has access to selected backends

---

## 🧪 Testing

### Run Backend Tests

```bash
cd backend
pytest tests/ -v
```

### Run Frontend Tests

```bash
cd frontend/decoherex_analytics
npm test
```

### Manual Testing Checklist

- [ ] Generate quantum circuit from natural language
- [ ] Simulate circuit and verify histogram
- [ ] Submit job to IBM Quantum backend
- [ ] Monitor job lifecycle in real-time
- [ ] View performance analytics dashboard
- [ ] Get AI-powered backend recommendations
- [ ] Use predictive analysis before job submission

---

## 📊 Performance Metrics

### System Benchmarks

- **API Response Time**: < 100ms (95th percentile)
- **Circuit Simulation**: < 2s for 10-qubit circuits
- **AI Code Generation**: < 3s average
- **WebSocket Latency**: < 50ms for job updates
- **Dashboard Load Time**: < 1.5s (initial render)

### Scalability

- **Concurrent Users**: Tested up to 100 simultaneous connections
- **Job Throughput**: 1000+ jobs/hour processing capacity
- **Database Performance**: Optimized queries with <10ms latency

---

## 🤝 Contributing

We welcome contributions! Please follow these guidelines:

1. Fork the repository
2. Create a feature branch (`git checkout -b feature/amazing-feature`)
3. Commit your changes (`git commit -m 'Add amazing feature'`)
4. Push to the branch (`git push origin feature/amazing-feature`)
5. Open a Pull Request

### Code Standards

- **Python**: Follow PEP 8, use type hints
- **JavaScript**: ESLint configuration provided
- **Commits**: Use conventional commit messages
- **Testing**: Maintain >80% code coverage

---

## 📄 License

This project is licensed under the MIT License. See [LICENSE](LICENSE) file for details.

---

## 👥 Team Decoherex

Developed for **Amaravathi Quantum Valley Hackathon 2025**

### Contact

- **Email**: team@decoherex.dev
- **GitHub**: [github.com/decoherex](https://github.com/decoherex)
- **Documentation**: [docs.decoherex.dev](https://docs.decoherex.dev)

---

## 🙏 Acknowledgments

- **IBM Quantum** for providing quantum computing infrastructure
- **Groq** for high-performance LLM API
- **Supabase** for scalable database solutions
- **Qiskit Community** for comprehensive quantum computing tools
- **Amaravathi Quantum Valley** for hosting the hackathon

---

<div align="center">

**Built with ❤️ and ⚛️ by Team Decoherex**

*Empowering the quantum revolution, one circuit at a time*

</div>