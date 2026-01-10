import random
from .base_agent import BaseAgent
from ..api.schemas import AgentAction, SimulationState

class TesterAgent(BaseAgent):
    def process(self, state: SimulationState) -> AgentAction | None:
        if random.random() < 0.15:
            if random.random() < 0.6:
                return self._create_task(
                    title="Run Regression Suite",
                    description="Executing full regression test suite.",
                    priority="medium",
                    task_type="testing"
                )
            else:
                return self._create_message("Found a potential edge case in the login flow.")
        return None
