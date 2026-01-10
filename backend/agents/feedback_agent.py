import random
from .base_agent import BaseAgent
from ..api.schemas import AgentAction, SimulationState

class FeedbackAgent(BaseAgent):
    def process(self, state: SimulationState) -> AgentAction | None:
        # Simulating external feedback
        if random.random() < 0.05:
            return self._create_message("User feedback: The dashboard load time is excellent!")
        return None
