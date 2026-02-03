# Prediction & Analysis Implementation Plan

## Goal
Implement a "Pre-flight Check" or "Predictive Analysis" feature in the Job Submission Modal. Before submitting a custom job, the user can ask AI to analyze the code and predict its performance on real hardware.

## Features
1.  **Time Estimation**: Estimate how long the job will take based on depth and shots.
2.  **Error/Failure Prediction**: Estimate success rate based on gate fidelity and circuit complexity.
3.  **Code Validation**: Catch potential logic errors (warnings) that syntax checkers might miss.
4.  **Backend Recommendation**: Suggest the best backend (Torino, Fez, Marrakesh) for this specific circuit.

## Technical Implementation

### 1. Backend (`/api/ai/predict`)
- **Endpoint**: `POST /api/ai/predict`
- **Input**: `{ "code": "...", "backend_options": ["ibm_torino", "ibm_fez", "ibm_marrakesh"] }`
- **LLM Prompt**:
    > "Analyze this Qiskit code for execution on IBM Quantum hardware. Return JSON:
    > - `estimated_time`: string (e.g. '15s').
    > - `failure_risk`: 'Low' | 'Medium' | 'High'.
    > - `warnings`: List of potential issues (e.g. 'Too many CNOTs for this device').
    > - `recommended_backend`: One of the input options.
    > - `reasoning`: Why this backend is best."

### 2. Frontend (`JobSubmissionModal`)
- **UI Update**:
    - Add a button **"🔮 Predict Details"** next to the "Submit" button (only in Custom Mode).
    - **Popup/Modal**: A specialized "Analysis Report" modal that opens on click.
    - **Content**:
        - **Traffic Light System**: Green/Yellow/Red status for Risk.
        - **Stats Grid**: Time, Backend, Fidelity.
        - **Code Warnings**: Warning alert if issues found.

## User Flow
1.  User opens Job Submission Modal -> Custom Code.
2.  Pastes code.
3.  Clicks "Predict Details".
4.  AI analyzes and shows a Report Modal.
5.  User can then proceed to Submit or go back to fix code.
