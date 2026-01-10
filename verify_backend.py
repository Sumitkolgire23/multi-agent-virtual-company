import sys
import os

# Add current directory to path so imports work
sys.path.append(os.getcwd())

try:
    from backend.api.schemas import SimulationState, ProjectConfig, Agent
    from backend.services.simulation_service import simulation_service
except ImportError as e:
    print(f"Import Error: {e}")
    print("Ensure you are running from the project root.")
    sys.exit(1)

def verify_backend():
    print("Verifying Backend Logic...")
    
    # 1. Create a Mock State
    state = SimulationState(
        projectConfig=ProjectConfig(
            projectName="Test Project",
            domain="saas",
            description="A test project"
        ),
        agents=[
            Agent(id="ceo-1", name="CEO", role="CEO", status="active"),
            Agent(id="dev-1", name="Dev", role="Full Stack Developer", status="active")
        ],
        currentDate="2025-01-01"
    )
    
    print("Mock State Created.")
    
    # 2. Process Tick
    print("Processing Tick...")
    tick_response = simulation_service.process_tick(state)
    
    print("Tick Processed.")
    print(f"Actions Generated: {len(tick_response.actions)}")
    for action in tick_response.actions:
        print(f" - {action.type} from {action.agentId}: {action.content or action.title}")
        
    print("Backend Verified Successfully.")

if __name__ == "__main__":
    verify_backend()
