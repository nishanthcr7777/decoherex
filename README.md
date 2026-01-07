# Decoherex

## Overview

Decoherex is a full-stack quantum job dashboard designed to provide AI-powered backend optimization recommendations. It leverages a FastAPI backend for core functionalities and AI model serving, a separate backend for job data and streaming, and a React frontend with Tailwind CSS for a modern and responsive user interface. This project aims to streamline the management and optimization of quantum computing jobs by providing intelligent recommendations.

Done by Team Decoherex for Amaravathi Quantum Valley Hackathon 2025.

## Features

*   **AI-Powered Backend Optimization:** Receive intelligent recommendations for optimizing quantum computing jobs.
*   **Quantum Job Management:** Manage and monitor various quantum job types, including Quantum Fourier Transform, Bell State, Grover's Algorithm, VQE, and QAOA.
*   **Real-time Data Streaming:** (Inferred) Potentially supports real-time streaming of job data for up-to-date insights.
*   **Modern User Interface:** A responsive and intuitive dashboard built with React and Tailwind CSS.
*   **Scalable Backend:** Utilizes FastAPI for high-performance and scalable API services.

## Architecture

The Decoherex project follows a microservices-oriented architecture, comprising two distinct backend services and a single frontend application.

```
+-------------------+       +-------------------+       +-------------------+
|                   |       |                   |       |                   |
|    Frontend       |       |    Backend 1      |       |    Backend 2      |
| (React, Vite,     |------>| (FastAPI Core,    |------>| (FastAPI AI Model)|
|  Tailwind CSS)    |       |  Job Data API)    |       |  (predictor.py)   |
|                   |       |                   |       |                   |
+-------------------+       +-------------------+       +-------------------+
         ^                           |
         |                           |
         +---------------------------+
         (Serves static assets,
          communicates with Backend 1)
```

*   **Frontend (React, Vite, Tailwind CSS):** The user interface for the dashboard, responsible for displaying job information, recommendations, and user interactions. It communicates with Backend 1 for data and potentially Backend 2 for AI-powered recommendations.
*   **Backend 1 (FastAPI Core, Job Data API):** The primary backend service, handling core application logic, managing quantum job data, and serving as an API gateway.
*   **Backend 2 (FastAPI AI Model):** A dedicated backend service for serving the AI model. It processes requests for backend optimization recommendations using `predictor.py`.

## Project Structure

```
d:\downloadds\QuantumFlowDash - backend version/
├── .gitignore
├── ai_model/
│   ├── backend_data_large1.csv
│   ├── backend_recommender.pkl
│   ├── createdb.py
│   ├── encoders.pkl
│   ├── predictor.py
│   ├── quantum_env/
│   └── train.py
├── backend/
│   ├── .env
│   ├── .gitignore
│   ├── .local/
│   ├── .replit
│   ├── .venv/
│   ├── README.md
│   ├── jobs.json
│   ├── main.py
│   ├── pyproject.toml
│   ├── replit.md
│   └── static/
│       ├── app.js
│       ├── index.html
│       └── style.css
├── frontend/
│   ├── decoherex_analytics/
│   │   ├── .env
│   │   ├── .gitignore
│   │   ├── .qodo/
│   │   ├── README.md
│   │   ├── dist/
│   │   ├── favicon.ico
│   │   ├── index.html
│   │   ├── jsconfig.json
│   │   ├── package.json
│   │   ├── postcss.config.js
│   │   ├── public/
│   │   ├── src/
│   │   ├── tailwind.config.js
│   │   └── vite.config.mjs
│   └── package-lock.json
└── requirements.txt
```

## Environment Setup

### Python Virtual Environment

It is highly recommended to use a Python virtual environment to manage dependencies for the backend services.

1.  **Create a virtual environment:**
    ```bash
    python -m venv .venv
    ```
2.  **Activate the virtual environment:**
    *   **Windows:**
        ```bash
        .venv\Scripts\activate
        ```
    *   **macOS/Linux:**
        ```bash
        source .venv/bin/activate
        ```

### Environment Variables

Both the backend and frontend services utilize `.env` files for configuration.

*   **Backend:** Create a `.env` file in the `backend/` directory.
*   **Frontend:** Create a `.env` file in the `frontend/decoherex_analytics/` directory.

Refer to the respective application's documentation or code for required environment variables.

## Installation

### Backend Dependencies

1.  **Activate your Python virtual environment** (as described above).
2.  **Install Python dependencies:**
    ```bash
    pip install -r requirements.txt
    ```

### Frontend Dependencies

1.  Navigate to the frontend directory:
    ```bash
    cd frontend/decoherex_analytics
    ```
2.  Install Node.js dependencies:
    ```bash
    npm install
    ```

## Running the Backend Services

Ensure your Python virtual environment is activated before running the backend services.

### Backend Server 1 (FastAPI Core)

This server handles the core API functionalities and job data.

```bash
uvicorn main:app --host 0.0.0.0 --port 5001 --reload
```

This will start the FastAPI server on `http://0.0.0.0:5001`. The `--reload` flag enables automatic reloading on code changes.

### Backend Server 2 (AI Model)

This server is dedicated to serving the AI model for backend optimization recommendations.

```bash
uvicorn predictor:app --host 0.0.0.0 --port 7777 --reload
```
& '.\.venv\Scripts\Activate.ps1'; uvicorn main:app --host 0.0.0.0 --port 5001 --reload
This will start the AI model server on `http://0.0.0.0:7777`.

## Running the Frontend

1.  Navigate to the frontend directory:
    ```bash
    cd frontend/decoherex_analytics
    ```
2.  Start the development server:
    ```bash
    npm start
    ```

The frontend application will typically be available at `http://localhost:5173/` (or another port specified by Vite).

## Model Files Notice

The AI model relies on two crucial files: `backend_recommender.pkl` and `encoders.pkl`, located in the `ai_model/` directory.

*   **`backend_recommender.pkl`:** This file contains the trained AI model and is approximately **122.34 MB** in size.
*   **`encoders.pkl`:** This file contains the label encoders used by the model.

**Due to GitHub's file size limits, these model files are NOT included in the repository.**

To ensure the AI model functions correctly, you must manually obtain these files and place them in the `ai_model/` directory. Please contact the project maintainers or refer to internal documentation for instructions on how to acquire these files.

## API Endpoints

The following API endpoints are available from the main FastAPI backend (`main.py`):

*   **`/` (GET):** Root endpoint, typically returns a welcome message or basic API status.
*   **`/recommend_backends` (POST):** Accepts quantum job parameters and returns AI-powered backend optimization recommendations.

## Troubleshooting

*   **`net::ERR_FAILED` or `TypeError: Failed to fetch`:**
    *   Ensure both backend servers (port 5001 and 7777) are running.
    *   Verify that the frontend is configured to connect to the correct backend URLs (check `.env` files and frontend code).
    *   Check browser console for more specific error messages.
*   **`ValueError: y contains previously unseen labels`:**
    *   This indicates that the AI model received an input (e.g., `job_type`, `priority_level`) that it was not trained on.
    *   Ensure that the frontend is sending valid and correctly cased values to the backend (e.g., `BellState` instead of `bell-state`, `Medium` instead of `medium`).
    *   Review `JobConstraintPanel.jsx` for valid options and `index.jsx` for how values are being sent.
*   **Model files not found:**
    *   Ensure `backend_recommender.pkl` and `encoders.pkl` are present in the `ai_model/` directory. Refer to the "Model Files Notice" section.

## License

This project is licensed under the MIT License. See the `LICENSE` file for details.