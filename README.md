# Multi-Agent Virtual Company Simulator

![License](https://img.shields.io/badge/license-MIT-blue.svg)
![React](https://img.shields.io/badge/frontend-React_18-61DAFB?logo=react)
![TypeScript](https://img.shields.io/badge/language-TypeScript-3178C6?logo=typescript)
![Python](https://img.shields.io/badge/backend-FastAPI-009688?logo=fastapi)
![AI](https://img.shields.io/badge/AI-Ollama-000000?logo=ollama)
![Build Status](https://img.shields.io/badge/build-passing-brightgreen)

An immersive simulation where autonomous AI agents build a startup from scratch. Watch as a CEO, Developers, Testers, and other agents collaborate, write code, manage tasks, and navigate market challenges in real-time.

---

## 🚀 Features

-   **Autonomous Agents**: AI agents (CEO, Dev, QA, etc.) that "think" and act independently using Local LLMs (Ollama).
-   **Real-time Collaboration**: Agents communicate via messages, assign tasks, and review PRs.
-   **Visual Dashboard**: Monitor the company's health, tasks (Kanban), financial reports, and product timeline.
-   **Dynamic Market**: The simulation includes market events, competitors, and user feedback that agents must react to.
-   **Time Travel**: Save simulation snapshots and branch out to explore different "what-if" scenarios.
-   **Local & Secure**: Runs entirely locally using Ollama for privacy and zero cost.

---

## 🏗️ Architecture

The project follows a decoupled **Client-Server** architecture integrated with a Local LLM.

```mermaid
graph TD
    subgraph Frontend [React Frontend]
        UI[User Interface]
        Hooks[Custom Hooks]
        State[Local State]
    end

    subgraph Backend [Python FastAPI]
        API[API Layer]
        Orch[Orchestrator]
        Services[Simulation Services]
        
        subgraph Agents [Agent System]
            CEO[CEO Agent]
            Dev[Developer Agent]
            QA[Tester Agent]
            Others[...]
        end
        
        subgraph Memory [Memory Store]
            StateStore[State Store]
            Logs[Logs Store]
            Artifacts[Artifacts Store]
        end
    end

    subgraph AI [Local LLM]
        Ollama[Ollama (Llama3)]
    end

    UI -->|Use Simulation Hook| Hooks
    Hooks -->|Fetch Tick| API
    API -->|Process Tick| Services
    Services -->|Update| Memory
    Services -->|Coordinate| Orch
    Orch -->|Run Loop| Agents
    Agents -->|Generate Text| Ollama
    Agents -->|Read/Write| Memory
```

### Components

1.  **Frontend (`src/`)**: A modern React application using `shadcn/ui` and `Tailwind CSS`. It handles the visualization of the simulation state and renders the interactions.
2.  **Backend (`backend/`)**: A Python FastAPI server that serves as the "brain".
    *   **Orchestrator**: Manages the agent lifecycle and turns.
    *   **Agents**: Classes representing different roles with specific prompts and behaviors.
    *   **Memory**: In-memory stores for persistence processing.
3.  **LLM Integration (`backend/llm/`)**: A client wrapper for **Ollama** that agents use to generate dynamic content (messages, task descriptions, code).

---

## 🤖 Agent Roles

| Agent Role | Responsibilities |
| :--- | :--- |
| **CEO** | Sets strategic direction, defines OKRs, motivates the team. |
| **Product Manager** | Plans sprints, prioritizes backlog, defines requirements. |
| **Developer** | Writes code, opens Pull Requests, fixes bugs. |
| **QA Tester** | Runs regressions, reports bugs, verifies fixes. |
| **Tech Writer** | Maintains API docs and user guides. |
| **User Researcher** | Simulates user feedback and market sentiment. |

---

## 🛠️ Getting Started

### Prerequisites

*   **Node.js** (v18+)
*   **Python** (v3.10+)
*   **Ollama** (Running locally with `llama3` model)

### Installation

1.  **Clone the repository**:
    ```bash
    git clone https://github.com/yourusername/virtual-company-sim.git
    cd virtual-company-sim
    ```

2.  **Setup Backend**:
    ```bash
    cd backend
    pip install -r requirements.txt
    ```

3.  **Setup Frontend**:
    ```bash
    # In the root directory
    npm install
    ```

### Running the Simulation

1.  **Start Ollama** (in a separate terminal):
    ```bash
    ollama serve
    # Ensure you have the model: ollama pull llama3
    ```

2.  **Start the Backend Server**:
    ```bash
    # From the root directory
    uvicorn backend.main:app --reload
    ```

3.  **Start the Frontend**:
    ```bash
    # From the root directory
    npm run dev
    ```

4.  **Open Browser**: Navigate to `http://localhost:5173` to start building your startup!

---

## 🤝 Contributing

Contributions are welcome! Please feel free to submit a Pull Request.

## 📄 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.