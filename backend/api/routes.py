from fastapi import APIRouter
from .schemas import SimulationState, TickResponse
from ..services.simulation_service import simulation_service

router = APIRouter()

@router.post("/simulation/tick", response_model=TickResponse)
async def tick(state: SimulationState):
    """
    Process one simulation tick.
    Receives current state, returns new actions and events.
    """
    return simulation_service.process_tick(state)
