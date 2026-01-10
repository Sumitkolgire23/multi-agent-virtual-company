from abc import ABC, abstractmethod
from typing import Optional, List
from ..api.schemas import Agent, AgentAction, SimulationState
from ..llm.ollama_client import ollama_client

class BaseAgent(ABC):
    def __init__(self, agent: Agent):
        self.agent = agent

    @abstractmethod
    def process(self, state: SimulationState) -> Optional[AgentAction]:
        """
        Process the current state and return an action if the agent decides to act.
        """
        pass

    def _generate_response(self, state: SimulationState, prompt: str) -> str:
        """
        Generate a text response using the LLM.
        """
        system_prompt = f"""You are {self.agent.name}, a {self.agent.role} at a {state.projectConfig.domain} startup.
        Your goal is to help the company succeed by performing tasks relevant to your role.
        Project Description: {state.projectConfig.description}
        Current Date: {state.currentDate}
        """
        return ollama_client.generate(prompt=prompt, system=system_prompt)

    def _create_message(self, content: str) -> AgentAction:
        return AgentAction(
            agentId=self.agent.id,
            type='message',
            content=content
        )

    def _create_task(self, title: str, description: str, priority: str = 'medium', task_type: str = 'feature') -> AgentAction:
        return AgentAction(
            agentId=self.agent.id,
            type='task',
            title=title,
            description=description,
            priority=priority,
            taskType=task_type
        )
