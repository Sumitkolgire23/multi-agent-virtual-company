# Virtual Company Simulation - Project Report

## 1. Executive Summary

The **Virtual Company Simulation** is an autonomous multi-agent system designed to simulate the lifecycle of a software startup. By leveraging Local Large Language Models (LLMs) via Ollama, the system creates a dynamic environment where AI agents acting as CEOs, Developers, and Product Managers collaborate to build products, manage tasks, and react to market events.

This project demonstrates the potential of **Agentic AI** in complex, interactive environments, providing users with a "God-mode" view of a self-evolving digital organization.

## 2. Methodology

### 2.1 Autonomous Agent Framework
The core of the simulation relies on a decentralized agent framework. Each agent is an independent entity with:
-   **Role-based Identity**: Specific prompts defining their behavior (e.g., "You are a pragmatic Developer").
-   **Context Awareness**: Access to the current simulation state (Project goals, date, active tasks).
-   **LLM reasoning**: Utilizing Llama3 to generate non-deterministic, human-like responses and decisions.

### 2.2 Orchestration
While agents are autonomous, an **Orchestrator** manages the simulation clock ("ticks"). In each tick, the orchestrator:
1.  Updates the global state.
2.  Polls active agents for actions.
3.  Simulates environmental factors (Market events, user feedback).
4.  Persists the resulting state.

### 2.3 Technology Stack
-   **Frontend**: React, TypeScript, TailwindCSS, Shadcn/UI (for a premium, responsive dashboard).
-   **Backend**: Python, FastAPI (for robust logic handling).
-   **AI Inference**: Ollama (running locally for privacy and cost-efficiency).

## 3. Key Findings

-   **Emergent Behavior**: Agents demonstrated unexpected collaboration patterns, such as the CEO explicitly motivating developers after a bug report.
-   **Scalability**: The modular architecture allows for easy addition of new agent roles (e.g., Sales, HR) without refactoring the core loop.
-   **User Engagement**: The gamified elements (time travel, speed controls) significantly enhanced the "watcher" experience.

## 4. Future Roadmap

-   **Inter-Agent Dialogue**: Enabling direct agent-to-agent negotiation threads.
-   **Code Generation**: Connecting agents to a real file system to actually write and execute code.
-   **Multi-Modal Inputs**: allowing agents to "see" UI mockups.

## 5. Conclusion

The Virtual Company Simulation successfully proves the concept of a self-driving organization. It serves as both an educational tool for understanding startup dynamics and a research platform for multi-agent coordination.
