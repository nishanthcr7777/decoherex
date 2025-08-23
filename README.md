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
