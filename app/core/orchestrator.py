from __future__ import annotations

import os
from typing import Any, Dict, Iterator, List, Tuple

from dotenv import load_dotenv
from google import genai
from google.genai import types

load_dotenv()

from app.core.tool_specs import TOOL_SPECS
from app.core.tools_registry import TOOL_REGISTRY
from app.prompts.system_prompt import SYSTEM_PROMPT

GEMINI_API_KEY = os.getenv("GEMINI_API_KEY", "")
GEMINI_MODEL = os.getenv("GEMINI_MODEL", "gemini-2.5-flash")

client = genai.Client(api_key=GEMINI_API_KEY)


def _convert_tool_specs_to_gemini(specs: list[dict]) -> list[types.Tool]:
    """Convert tool specs to Gemini FunctionDeclaration format."""
    declarations = []
    for spec in specs:
        declarations.append(
            types.FunctionDeclaration(
                name=spec["name"],
                description=spec.get("description", ""),
                parameters=spec.get("input_schema", {}),
            )
        )
    return [types.Tool(function_declarations=declarations)]


def _has_function_calls(content: types.Content) -> bool:
    """Check if content contains function calls."""
    if not content.parts:
        return False
    return any(p.function_call for p in content.parts)


def _extract_text(content: types.Content) -> str:
    """Extract text from content."""
    if not content.parts:
        return ""
    return "".join(p.text for p in content.parts if p.text).strip()


def _extract_function_calls(content: types.Content) -> list[dict]:
    """Extract function calls from content."""
    calls = []
    if not content.parts:
        return calls
    for part in content.parts:
        if part.function_call:
            fc = part.function_call
            args = dict(fc.args) if fc.args else {}
            calls.append({"name": fc.name, "args": args})
    return calls


def run_orchestrator(
    conversation_id: str,
    user_message: str,
) -> Tuple[str, Dict[str, Any]]:
    debug: Dict[str, Any] = {
        "conversation_id": conversation_id,
        "tool_calls": [],
    }

    gemini_tools = _convert_tool_specs_to_gemini(TOOL_SPECS)

    history: List[types.Content] = []

    # First turn: send user message
    user_content = types.Content(
        role="user",
        parts=[types.Part(text=user_message)],
    )
    history.append(user_content)

    try:
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=history,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                tools=gemini_tools,
            ),
        )
    except Exception as e:
        debug["error"] = str(e)
        return (f"Error calling Gemini API: {e}", debug)

    max_rounds = 6
    for _ in range(max_rounds):
        model_content = response.candidates[0].content
        history.append(model_content)

        if not _has_function_calls(model_content):
            final_text = _extract_text(model_content)
            return (final_text or "(empty response)", debug)

        function_calls = _extract_function_calls(model_content)
        tool_response_parts = []

        for fc in function_calls:
            name = fc["name"]
            args = fc["args"]

            fn = TOOL_REGISTRY.get(name)
            if fn is None:
                result = {"error": f"Unknown tool: {name}"}
            else:
                try:
                    result = fn(**args)
                except Exception as e:
                    result = {"error": str(e)}

            debug["tool_calls"].append(
                {
                    "name": name,
                    "input": args,
                    "result": result,
                }
            )

            tool_response_parts.append(
                types.Part(
                    function_response=types.FunctionResponse(
                        name=name,
                        response=result,
                    )
                )
            )

        # Append tool results as a user message (Gemini convention)
        tool_content = types.Content(
            role="user",
            parts=tool_response_parts,
        )
        history.append(tool_content)

        try:
            response = client.models.generate_content(
                model=GEMINI_MODEL,
                contents=history,
                config=types.GenerateContentConfig(
                    system_instruction=SYSTEM_PROMPT,
                    tools=gemini_tools,
                ),
            )
        except Exception as e:
            debug["error"] = str(e)
            return (f"Error sending tool results: {e}", debug)

    return ("Tool-calling loop limit reached without a final answer.", debug)


def run_orchestrator_stream(
    conversation_id: str,
    user_message: str,
) -> Iterator[str]:
    """Streaming version of the orchestrator that yields text chunks."""
    gemini_tools = _convert_tool_specs_to_gemini(TOOL_SPECS)

    history: List[types.Content] = []

    user_content = types.Content(
        role="user",
        parts=[types.Part(text=user_message)],
    )
    history.append(user_content)

    try:
        response = client.models.generate_content(
            model=GEMINI_MODEL,
            contents=history,
            config=types.GenerateContentConfig(
                system_instruction=SYSTEM_PROMPT,
                tools=gemini_tools,
            ),
        )
    except Exception as e:
        yield f"Error calling Gemini API: {e}"
        return

    max_rounds = 6
    for _ in range(max_rounds):
        model_content = response.candidates[0].content
        history.append(model_content)

        if not _has_function_calls(model_content):
            final_text = _extract_text(model_content)
            if final_text:
                yield final_text
            return

        function_calls = _extract_function_calls(model_content)
        tool_response_parts = []

        for fc in function_calls:
            name = fc["name"]
            args = fc["args"]

            fn = TOOL_REGISTRY.get(name)
            if fn is None:
                result = {"error": f"Unknown tool: {name}"}
            else:
                try:
                    result = fn(**args)
                except Exception as e:
                    result = {"error": str(e)}

            tool_response_parts.append(
                types.Part(
                    function_response=types.FunctionResponse(
                        name=name,
                        response=result,
                    )
                )
            )

        tool_content = types.Content(
            role="user",
            parts=tool_response_parts,
        )
        history.append(tool_content)

        try:
            response = client.models.generate_content(
                model=GEMINI_MODEL,
                contents=history,
                config=types.GenerateContentConfig(
                    system_instruction=SYSTEM_PROMPT,
                    tools=gemini_tools,
                ),
            )
        except Exception as e:
            yield f"Error sending tool results: {e}"
            return

    yield "Tool-calling loop limit reached without a final answer."
