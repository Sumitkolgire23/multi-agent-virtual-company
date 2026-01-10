import sys
import os

# Add current directory to path so imports work
sys.path.append(os.getcwd())

try:
    from backend.api.schemas import SimulationState, ProjectConfig, Agent
    from backend.agents.ceo_agent import CEOAgent
    from backend.llm.ollama_client import ollama_client
except ImportError as e:
    print(f"Import Error: {e}")
    sys.exit(1)

def verify_llm_integration():
    print("Verifying LLM Integration...")
    
    # 1. Mock State
    state = SimulationState(
        projectConfig=ProjectConfig(
            projectName="AI Startup",
            domain="artificial_intelligence",
            description="A startup building autonomous agents."
        ),
        agents=[
            Agent(id="ceo-1", name="Elon", role="CEO", status="active")
        ],
        currentDate="2025-01-01"
    )
    
    agent = CEOAgent(state.agents[0])
    
    # 2. Test Generation (Manual Call to _generate_response)
    print("Testing Direct Generation...")
    # Mocking ollama_client.generate to avoid needing actual server for this quick test script
    # effectively testing the plumbing, not the external server
    original_generate = ollama_client.generate
    ollama_client.generate = lambda prompt, system=None, format=None: "Mocked LLM Response: Keep pushing forward!"
    
    response = agent._generate_response(state, "Say something")
    print(f"Agent Generated: {response}")
    
    if "Mocked" in response:
        print("Integration Logic Verified (Mocked).")
    else:
        print("Integration Logic Failed.")

if __name__ == "__main__":
    verify_llm_integration()
