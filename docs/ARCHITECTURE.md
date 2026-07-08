# Architecture Details

## Tool-Calling Loop

1. User sends a message via `/chat` endpoint
2. Orchestrator sends message to Gemini API with tool schemas
3. If the model requests a tool call:
   - The tool function is executed locally (SymPy / Qiskit / QuTiP)
   - Result is fed back into the conversation
4. Loop repeats up to `max_rounds = 6`
5. When no tool call is made, the final text is returned

## Adding a New Tool

1. Implement the function in `app/tools/your_tool.py`
2. Add the JSON schema to `app/core/tool_specs.py`
3. Register it in `app/core/tools_registry.py`

## Adding a New Agent

1. Create `agents/your_agent/your_agent.py`
2. Add a prompt to `app/prompts/agent_prompts.py`
3. Update the orchestrator routing logic as needed
