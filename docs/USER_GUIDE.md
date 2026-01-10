# User Guide

## Installation

1.  **Prerequisites**:
    *   Node.js v18+
    *   Python 3.10+
    *   [Ollama](https://ollama.com) installed and running.

2.  **Setup**:
    ```bash
    # Backend
    cd backend
    pip install -r requirements.txt
    
    # Frontend (Root)
    npm install
    ```

## Running the Simulation

1.  **Start Services**:
    *   Terminal 1: `ollama serve`
    *   Terminal 2: `uvicorn backend.main:app --reload`
    *   Terminal 3: `npm run dev`

2.  **Launch**: Open `http://localhost:5173`.

## Navigation

-   **Dashboard**: Main view showing active Agents and Company Metrics.
-   **Chat**: Live feed of agent communications.
-   **Kanban Board**: Drag-and-drop tasks managed by agents.
-   **Time Controls**: Use the top-right controls to Speed Up (>>), Pause (||), or Time Travel.

## Tips & Tricks

-   **Project Setup**: Be descriptive when creating a new project. The more details you provide in the "Description", the better the AI agents can roleplay.
-   **Time Travel**: Use the "Time Travel" tab to save interesting states. If your company goes bankrupt, you can restore a previous save!
-   **Intervention**: You can manually add tasks or messages to guide the agents if they get stuck.
