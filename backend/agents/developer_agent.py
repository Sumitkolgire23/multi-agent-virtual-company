import random
from .base_agent import BaseAgent
from ..api.schemas import AgentAction, SimulationState

class DeveloperAgent(BaseAgent):
    def process(self, state: SimulationState) -> AgentAction | None:
        if random.random() < 0.2: # Developers are active
            if random.random() < 0.7:
                 # Work on code
                 return self._create_task(
                     title=f"Implement feature logic for {state.projectConfig.domain}",
                     description="Writing core business logic functions.",
                     priority="medium",
                     task_type="feature"
                 )
            else:
                return self._create_message("Changes pushed to feature branch.")
        return None
