import random
from .base_agent import BaseAgent
from ..api.schemas import AgentAction, SimulationState

class ManagementAgent(BaseAgent):
    def process(self, state: SimulationState) -> AgentAction | None:
        if random.random() < 0.15:
            action_type = random.choice(['coordinate', 'review'])
            if action_type == 'coordinate':
                 return self._create_message("Syncing with dev team on latest sprint usage.")
            else:
                return self._create_task(
                    title="Sprint Planning",
                    description="define tasks for next sprint",
                    priority="high",
                    task_type="planning"
                )
        return None
