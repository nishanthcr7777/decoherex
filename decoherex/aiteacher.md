# AI Teacher Implementation Plan

## Goal
Implement an "AI Teacher" feature in the Quantum Lab that acts as a personal tutor. It explains the currently generated or written quantum circuit in simple, educational terms using the Grok LLM.

## Features
1.  **Code Explainer**: Breaks down the Python/Qiskit code into understandable chunks.
2.  **Gate Analysis**: Explains what each quantum gate (H, CNOT, etc.) is doing in this specific context.
3.  **Physics Context**: identifying the quantum phenomenon being demonstrated (e.g., "This creates Entanglement").
4.  **Outcome Prediction**: Explains what the user should expect to see in the results (e.g., "You will see 00 and 11 with 50% probability").

## Technical Implementation

### 1. Backend (`/api/ai/explain`)
- **Endpoint**: `POST /api/ai/explain`
- **Input**: `{ "code": "..." }`
- **LLM Prompt**:
    > "Analyze this Qiskit code. Return a JSON object with:
    > - `summary`: One sentence goal.
    > - `gates`: List of objects { `name`: 'H', `role`: 'Creates superposition' }.
    > - `concepts`: List of strings (e.g., 'Entanglement', 'Superposition').
    > - `expected_output`: Simple explanation of the measurement results."

### 2. Frontend (`QuantumLab`)
- **Component**: `TeacherPanel.jsx` (New)
    - **Trigger**: Button "🎓 Explain This Circuit" below the code editor.
    - **Display**:
        - **Concept Cards**: Badges for concepts (Superposition, etc.).
        - **Step-by-Step**: A list or timeline showing the circuit flow.
        - **Teacher's Note**: A conversational summary.

## User Flow
1.  User generates or writes code in Quantum Lab.
2.  User clicks "Explain".
3.  Panel expands below the result charts with the AI explanation.
