from typing import List, Dict, Type
from ..api.schemas import SimulationState, AgentAction, Agent
from ..agents.base_agent import BaseAgent
from ..agents.ceo_agent import CEOAgent
from ..agents.management_agent import ManagementAgent
from ..agents.developer_agent import DeveloperAgent
from ..agents.tester_agent import TesterAgent
from ..agents.documentation_agent import DocumentationAgent
from ..agents.feedback_agent import FeedbackAgent

class Orchestrator:
    def __init__(self):
        self.agent_map: Dict[str, BaseAgent] = {}
        # Mapping role strings to Agent classes
        self.role_map: Dict[str, Type[BaseAgent]] = {
            "CEO": CEOAgent,
            "Product Manager": ManagementAgent, # Map generic roles to specific implementations
            "Project Manager": ManagementAgent,
            "Full Stack Developer": DeveloperAgent,
            "Backend Developer": DeveloperAgent,
            "Frontend Developer": DeveloperAgent,
            "DevOps Engineer": DeveloperAgent,
            "QA Engineer": TesterAgent,
            "Technical Writer": DocumentationAgent,
            "User Researcher": FeedbackAgent,
            # Fallback
            "default": DeveloperAgent 
        }

    def _get_agent_instance(self, agent_schema: Agent) -> BaseAgent:
        if agent_schema.id in self.agent_map:
            return self.agent_map[agent_schema.id]
        
        # Instantiate new agent based on role
        agent_class = self.role_map.get(agent_schema.role, self.role_map["default"])
        instance = agent_class(agent_schema)
        self.agent_map[agent_schema.id] = instance
        return instance

    def process_tick(self, state: SimulationState) -> List[AgentAction]:
        actions = []
        for agent_schema in state.agents:
            # Skip inactive agents if needed, but for now process all
            agent_instance = self._get_agent_instance(agent_schema)
            # Update internal agent state if needed (e.g. update agent.agent with latest schema)
            agent_instance.agent = agent_schema 
            
            action = agent_instance.process(state)
            if action:
                actions.append(action)
        return actions

orchestrator = Orchestrator()
