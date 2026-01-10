# API Reference

Base URL: `http://localhost:8000`

## Endpoints

### `POST /simulation/tick`
Process a single simulation step.

**Request Body** (`SimulationState`):
```json
{
  "agents": [
    { "id": "ceo-1", "name": "Elon", "role": "CEO", "status": "active", "tasksCompleted": 5 }
  ],
  "projectConfig": {
    "projectName": "My SaaS",
    "domain": "finance",
    "description": "An accounting app."
  },
  "currentDate": "2025-01-15T12:00:00Z"
}
```

**Response** (`TickResponse`):
```json
{
  "actions": [
    {
      "agentId": "ceo-1",
      "type": "message",
      "content": "Let's focus on Q1 sales!"
    }
  ],
  "events": [],
  "metrics_update": { "revenue": 1200 }
}
```

### `GET /`
Health check. Returns `{"message": "Virtual Startup Backend is running"}`.

## Data Models

### AgentAction
-   `type`: 'message', 'task', 'pr', 'bug'.
-   `content`: Text content (for messages).
-   `title`/`description`: For tasks.
