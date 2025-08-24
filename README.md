Backend to Frontend Integration in Decoherex

I've successfully set up and tested the integration between the frontend and backend components of the Decoherex application. Here's a summary of the key integration points and functionality:

Running Services

Frontend: Running on http://localhost:5173/ (React with TypeScript, Vite, and TailwindCSS)

Backend: Running on http://localhost:8000 (FastAPI with MongoDB)

API Integration Points

REST API Endpoints

Root endpoint (/) - Returns basic API information

Health check (/health) - Monitors backend health status

Jobs management (/jobs) - CRUD operations for quantum computing jobs

Backends information (/backends) - Information about quantum computing backends

Backend-specific endpoints:

Status (/backends/{id}/status) - Real-time status of quantum backends

Queue (/backends/{id}/queue) - Queue information for specific backends

Metrics (/backends/{id}/metrics) - Performance metrics for backends

WebSocket Connections

Job updates (ws://localhost:8000/ws/job-updates) - Real-time updates for job status, progress, and logs

Backend status (ws://localhost:8000/ws/backend-status) - Real-time updates for backend status changes

Key Features Tested

Job Management

Successfully created a new quantum job via API

Retrieved job details using job ID

Job tracking with real-time updates via WebSockets

Backend Monitoring

Retrieved backend status information

Accessed queue information for backends

Obtained performance metrics for backends

Real-time Communication

WebSocket connections for job updates

WebSocket connections for backend status changes

Ping/pong mechanism to keep connections alive

Frontend Implementation

The frontend implements these integrations through:

API Service - Handles REST API calls to the backend

WebSocket Service - Manages WebSocket connections for real-time updates

Component Integration - Components like JobTracking and Backends consume these services

Backend Implementation

The backend provides:

FastAPI Routes - REST API endpoints for CRUD operations

WebSocket Managers - Connection managers for real-time updates

CORS Configuration - Configured to allow requests from the frontend

The application demonstrates a well-structured integration between frontend and backend, with proper separation of concerns and real-time communication capabilities for quantum computing job management and backend monitoring.


# Decoherex FastAPI Backend

A modern, fast backend API built with FastAPI for the Decoherex application.

## Features

- **Authentication**: JWT-based user authentication with password hashing
- **User Management**: User registration, login, and profile management
- **Job Tracking**: CRUD operations for job management
- **Admin Panel**: Admin-only endpoints for user and analytics management
- **CORS Support**: Configured for frontend integration
- **Automatic API Documentation**: Interactive API docs with Swagger UI

## API Endpoints

### Authentication
- `POST /auth/register` - User registration
- `POST /auth/login` - User login
- `GET /users/me` - Get current user info

### Jobs
- `POST /jobs` - Create a new job
- `GET /jobs` - Get all jobs for current user
- `GET /jobs/{job_id}` - Get specific job
- `PUT /jobs/{job_id}` - Update job
- `DELETE /jobs/{job_id}` - Delete job

### Admin (Admin users only)
- `GET /admin/users` - Get all users
- `GET /admin/analytics` - Get system analytics

## Setup Instructions

### 1. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 2. Run the Server

```bash
# Development mode with auto-reload
uvicorn main:app --reload --host 0.0.0.0 --port 8000

# Or run directly
python main.py
```

### 3. Access the API

- **API Base URL**: http://localhost:8000
- **Interactive API Docs**: http://localhost:8000/docs
- **Alternative API Docs**: http://localhost:8000/redoc

## Environment Variables

Create a `.env` file in the Backend directory:

```env
SECRET_KEY=your-super-secret-key-here
ACCESS_TOKEN_EXPIRE_MINUTES=30
```

## Database

Currently using in-memory storage for development. For production, consider:

- **PostgreSQL** with SQLAlchemy
- **MongoDB** with motor
- **Redis** for caching

## Security Features

- JWT token authentication
- Password hashing with bcrypt
- CORS middleware configuration
- Input validation with Pydantic models
- Admin role-based access control

## Development

The server will automatically reload when you make changes to the code (when using `--reload` flag).

## Production Deployment

For production deployment:

1. Change the `SECRET_KEY` to a secure random string
2. Set up proper environment variables
3. Use a production ASGI server like Gunicorn
4. Set up a reverse proxy (nginx)
5. Configure SSL/TLS certificates
6. Set up proper database connections
7. Implement rate limiting and security headers

