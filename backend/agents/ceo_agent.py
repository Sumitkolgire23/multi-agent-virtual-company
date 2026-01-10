import random
from .base_agent import BaseAgent
from ..api.schemas import Agent, AgentAction, SimulationState

class CEOAgent(BaseAgent):
    def process(self, state: SimulationState) -> AgentAction | None:
        # Higher chance to act if early in the project (Kickoff phase)
        # Check if this agent has completed any tasks or if the project is very new
        current_agent_state = next((a for a in state.agents if a.id == self.agent.id), self.agent)
        
        is_kickoff = current_agent_state.tasksCompleted == 0
        
        chance_to_act = 0.8 if is_kickoff else 0.1 # High chance to act if nothing done yet

        if random.random() < chance_to_act:
            if random.random() < 0.6: # Message Focus
                prompt = f"Generate a message to the team about the '{state.projectConfig.projectName}' project. The project description is: '{state.projectConfig.description}'. Focus on the domain of '{state.projectConfig.domain}'. Be the CEO. Keep it short and actionable."
                msg = self._generate_response(state, prompt)
                if not msg:
                    msg = f"Let's focus on delivering value for {state.projectConfig.projectName}!"
                return self._create_message(msg)
            else:
                # Create strategic task related to domain
                prompt = f"Generate a high-level strategic task title and description for a {state.projectConfig.domain} project named {state.projectConfig.projectName}. Return format: Title|Description"
                response = self._generate_response(state, prompt)
                
                title = "Review Strategy" 
                desc = "Align on goals."
                
                if response and "|" in response:
                    parts = response.split("|")
                    title = parts[0].strip()
                    desc = parts[1].strip()
                
                return self._create_task(
                    title=title,
                    description=desc,
                    priority="high",
                    task_type="planning"
                )
        return None
