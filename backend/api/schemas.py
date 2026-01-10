from pydantic import BaseModel
from typing import List, Optional, Dict, Any
from datetime import datetime

class Agent(BaseModel):
    id: str
    name: str
    role: str
    status: str
    tasksCompleted: int = 0

class ProjectConfig(BaseModel):
    projectName: str
    domain: str
    description: str = ""

class SimulationState(BaseModel):
    agents: List[Agent]
    projectConfig: ProjectConfig
    currentDate: str  # ISO Format

class AgentAction(BaseModel):
    agentId: str
    type: str  # 'message', 'task', etc.
    content: Optional[str] = None
    title: Optional[str] = None
    description: Optional[str] = None
    priority: Optional[str] = None
    taskType: Optional[str] = None
    docType: Optional[str] = None

class TickResponse(BaseModel):
    actions: List[AgentAction]
    events: List[str]  # Random events
    metrics_update: Dict[str, Any]

class LogEntry(BaseModel):
    id: str
    timestamp: datetime
    level: str  # 'info', 'warning', 'error', 'success'
    message: str
    source: str  # Agent ID or System

class Artifact(BaseModel):
    id: str
    name: str
    type: str  # 'code', 'document', 'image'
    content: str
    createdAt: datetime
    createdBy: str  # Agent ID
