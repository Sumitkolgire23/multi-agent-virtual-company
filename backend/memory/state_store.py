from typing import Optional
from ..api.schemas import SimulationState

class StateStore:
    def __init__(self):
        self._state: Optional[SimulationState] = None

    def update_state(self, state: SimulationState):
        self._state = state

    def get_state(self) -> Optional[SimulationState]:
        return self._state

    def clear(self):
        self._state = None

state_store = StateStore()
