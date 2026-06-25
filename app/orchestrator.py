"""
LangGraph orchestrator for multi-agent coordination
"""

import json
import logging
from typing import Any, Dict, List
from anthropic import Anthropic
from langgraph.graph import StateGraph, END
from typing_extensions import TypedDict
import os

from .tools import TOOLS, execute_tool

logger = logging.getLogger(__name__)


class AgentState(TypedDict):
    """State structure for the agent workflow"""
    messages: List[Dict[str, str]]
    conversation_id: str
    answer: str
    debug: Dict[str, Any]
    tool_calls_made: int


def create_orchestrator():
    """Create and return the orchestrator chain"""
    
    # Initialize Anthropic client with API key
    api_key = os.getenv("ANTHROPIC_API_KEY") or os.getenv("AI_GATEWAY_API_KEY")
    if not api_key:
        logger.error("No API key found! Set ANTHROPIC_API_KEY or AI_GATEWAY_API_KEY environment variable")
        raise ValueError("API key not configured")
    
    client = Anthropic(api_key=api_key)
    model = os.getenv("ANTHROPIC_MODEL", "claude-3-5-sonnet-20241022")
    
    def agent_node(state: AgentState) -> AgentState:
        """Main agent node that processes messages and calls tools"""
        
        logger.info(f"Processing agent node for conversation {state['conversation_id']}")
        
        # System prompt for the multi-agent orchestrator
        system_prompt = """You are QuantumMathResearchGPT, a sophisticated multi-agent AI assistant specializing in:
        
1. **Mathematics**: Symbolic computation, calculus, linear algebra, differential equations
2. **Quantum Physics**: Schrödinger equation, quantum mechanics, quantum operators
3. **Quantum Computing**: Quantum circuits, gates, algorithms, simulations
4. **Scientific Research**: Literature review, paper analysis, research methodologies

Your capabilities include:
- Simplifying and solving mathematical expressions using SymPy
- Creating and simulating quantum circuits with Qiskit
- Analyzing quantum physics problems
- Searching and summarizing research papers from arXiv
- Providing step-by-step derivations and explanations

When a user asks a question:
1. Identify the domain (Math, Quantum Physics, Quantum Computing, or Research)
2. Use the appropriate tools to compute or retrieve information
3. Provide clear explanations with mathematical notation
4. Show step-by-step work when applicable
5. Include verification or validation of results

Always be rigorous, precise, and thorough in your responses."""

        messages = state["messages"]
        tool_calls_made = state.get("tool_calls_made", 0)
        
        # Make request to Claude with tools
        response = client.messages.create(
            model=model,
            max_tokens=4096,
            system=system_prompt,
            tools=TOOLS,
            messages=messages
        )
        
        # Process response and handle tool calls
        assistant_message = {
            "role": "assistant",
            "content": []
        }
        
        tool_results = []
        final_answer = ""
        
        for content_block in response.content:
            if content_block.type == "text":
                assistant_message["content"].append({
                    "type": "text",
                    "text": content_block.text
                })
                final_answer = content_block.text
                
            elif content_block.type == "tool_use":
                tool_name = content_block.name
                tool_input = content_block.input
                tool_use_id = content_block.id
                
                logger.info(f"Tool called: {tool_name} with input: {str(tool_input)[:100]}")
                
                # Execute the tool
                try:
                    tool_result = execute_tool(tool_name, tool_input)
                except Exception as e:
                    tool_result = {"error": str(e)}
                
                # Add tool use to message
                assistant_message["content"].append({
                    "type": "tool_use",
                    "id": tool_use_id,
                    "name": tool_name,
                    "input": tool_input
                })
                
                # Store tool result
                tool_results.append({
                    "type": "tool_result",
                    "tool_use_id": tool_use_id,
                    "content": json.dumps(tool_result)
                })
                
                tool_calls_made += 1
        
        # Add assistant message to conversation
        messages.append(assistant_message)
        
        # If tool calls were made, add results and get follow-up response
        if tool_results:
            messages.append({"role": "user", "content": tool_results})
            
            # Get follow-up response from Claude after tool execution
            follow_up_response = client.messages.create(
                model=model,
                max_tokens=4096,
                system=system_prompt,
                messages=messages
            )
            
            follow_up_text = ""
            follow_up_message = {"role": "assistant", "content": []}
            
            for content_block in follow_up_response.content:
                if content_block.type == "text":
                    follow_up_text = content_block.text
                    follow_up_message["content"].append({
                        "type": "text",
                        "text": follow_up_text
                    })
            
            if follow_up_text:
                final_answer = follow_up_text
                messages.append(follow_up_message)
        
        # Check if we should continue (recursively call tools if needed)
        if response.stop_reason == "tool_use" and tool_calls_made < 5:
            # Continue processing with tool results
            logger.info(f"Tool results added, continuing conversation")
            return agent_node({
                **state,
                "messages": messages,
                "tool_calls_made": tool_calls_made
            })
        
        return {
            **state,
            "messages": messages,
            "answer": final_answer,
            "tool_calls_made": tool_calls_made,
            "debug": {
                "model": model,
                "tool_calls": tool_calls_made,
                "stop_reason": response.stop_reason,
                "conversation_id": state["conversation_id"]
            }
        }
    
    def process_state(state: AgentState) -> AgentState:
        """Process and finalize state"""
        if not state.get("answer"):
            state["answer"] = "I was unable to generate a response to your question. Please try again."
        return state
    
    # Create the workflow graph
    workflow = StateGraph(AgentState)
    
    # Add nodes
    workflow.add_node("agent", agent_node)
    workflow.add_node("finalize", process_state)
    
    # Add edges
    workflow.add_edge("agent", "finalize")
    workflow.add_edge("finalize", END)
    
    # Set entry point
    workflow.set_entry_point("agent")
    
    # Compile the graph
    chain = workflow.compile()
    
    logger.info("Orchestrator chain created successfully")
    
    return chain
