import random
from typing import List
from ..api.schemas import SimulationState, AgentAction, TickResponse
from ..orchestrator.orchestrator import orchestrator
from ..memory.state_store import state_store
# from ..memory.logs_store import logs_store # Optional: log actions

class SimulationService:
    def process_tick(self, state: SimulationState) -> TickResponse:
        # 1. Update State Store
        state_store.update_state(state)

        # 2. Get Actions from Orchestrator
        actions: List[AgentAction] = orchestrator.process_tick(state)
        
        # 3. Generate Random Events (Simulation of environment)
        events: List[str] = []
        if random.random() < 0.05:
            events.append("Competitor launched a new feature!")

        # 4. Simulate Metrics Update (In a real app, actions would drive this)
        metrics_update = {}
        if random.random() < 0.2:
            metrics_update = {
                "users": random.randint(1, 5),
                "revenue": random.randint(5, 50) if state.projectConfig.domain != "open_source" else 0
            }

        return TickResponse(
            actions=actions,
            events=events,
            metrics_update=metrics_update
        )

    def _generate_random_action(self, agent, domain) -> AgentAction:
        # Legacy method, kept if needed or can be removed. 
        # Using orchestrator now.
        pass

simulation_service = SimulationService()
