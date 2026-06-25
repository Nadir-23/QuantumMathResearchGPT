# QuantumMathResearchGPT - Architecture Diagram

## System Architecture

```
┌─────────────────────────────────────────────────────────────────────────┐
│                            User Browser                                 │
│                   http://localhost:3000                                 │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │ HTTP/WebSocket
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                        Next.js Frontend (Port 3000)                      │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                        app/page.tsx                               │  │
│  │  • Chat Interface                                                │  │
│  │  • Message Display                                              │  │
│  │  • Input Form                                                   │  │
│  │  • Auto-scroll & State Management                              │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                 ▼                                        │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                    React Components                              │  │
│  │  ┌──────────────┐  ┌──────────────┐  ┌──────────────┐           │  │
│  │  │ChatContainer │  │ChatMessage   │  │ChatInput     │           │  │
│  │  └──────────────┘  └──────────────┘  └──────────────┘           │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                 ▼                                        │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                      useChat Hook                                │  │
│  │  • Fetch API Calls                                              │  │
│  │  • Error Handling                                               │  │
│  │  • Response Processing                                          │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└─────────────────────────────────┬────────────────────────────────────────┘
                                 │ POST /chat
                                 ▼
┌─────────────────────────────────────────────────────────────────────────┐
│                    FastAPI Backend (Port 8000)                          │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │                      app/main.py                                 │  │
│  │  • FastAPI Application                                          │  │
│  │  • CORS Middleware                                              │  │
│  │  • Route Handlers                                               │  │
│  │  • Error Management                                             │  │
│  └───────────────────────────────────────────────────────────────────┘  │
│                                 ▼                                        │
│  ┌───────────────────────────────────────────────────────────────────┐  │
│  │               app/orchestrator.py                                │  │
│  │            LangGraph Multi-Agent Orchestrator                    │  │
│  │                                                                   │  │
│  │  ┌─────────────────────────────────────────────────────────┐    │  │
│  │  │                 Agent Node                              │    │  │
│  │  │  • Message Processing                                  │    │  │
│  │  │  • Tool Calling with Claude                            │    │  │
│  │  │  • Response Generation                                 │    │  │
│  │  │  • State Management                                    │    │  │
│  │  └─────────────────────────────────────────────────────────┘    │  │
│  │                           ▼                                      │  │
│  │  ┌─────────────────────────────────────────────────────────┐    │  │
│  │  │           Tool Execution Layer                          │    │  │
│  │  │  • execute_tool() function                              │    │  │
│  │  │  • Tool routing & dispatch                              │    │  │
│  │  │  • Result aggregation                                   │    │  │
│  │  └─────────────────────────────────────────────────────────┘    │  │
│  └───────────────────────────────────────────────────────────────────┘  │
└────────────────────────────────┬────────────────────────────────────────┘
                                 │ Tool Invocation
                 ┌───────────────┼───────────────┬───────────────┐
                 ▼               ▼               ▼               ▼
         ┌──────────────────┐ ┌──────────────┐ ┌─────────────────┐
         │  Mathematical    │ │  Quantum     │ │  Research       │
         │  Engine          │ │  Computing   │ │  Tools          │
         │  (SymPy)         │ │  (Qiskit)    │ │  (ArXiv)        │
         │                  │ │              │ │                 │
         │ • simplify       │ │ • circuits   │ │ • search        │
         │ • differentiate  │ │ • simulate   │ │ • summarize     │
         │ • integrate      │ │ • measure    │ │ • analyze       │
         │ • solve          │ │ • gates      │ │                 │
         │ • matrix ops     │ │ • states     │ │                 │
         │                  │ │              │ │                 │
         └────────┬─────────┘ └──────┬───────┘ └────────┬────────┘
                  │                  │                  │
                  │    Quantum Physics Analysis         │
                  │    • Schrödinger Equation           │
                  │    • Particle in Box                │
                  └──────────────────────────────────────┘

```

## Data Flow Diagram

```
User Message Input
       │
       ▼
┌─────────────────┐
│  Next.js Page   │
│  Captures Input │
└────────┬────────┘
         │
         ▼
┌──────────────────────┐
│  useChat Hook        │
│  POST /chat          │
└────────┬─────────────┘
         │ HTTP Request
         │ {
         │   "user_message": "...",
         │   "conversation_id": "..."
         │ }
         │
         ▼
┌─────────────────────────┐
│  FastAPI /chat Route    │
│  Request Handler        │
└────────┬────────────────┘
         │
         ▼
┌────────────────────────────────┐
│  Create AgentState             │
│  Initialize orchestrator       │
└────────┬─────────────────────────┘
         │
         ▼
┌────────────────────────────────┐
│  LangGraph Workflow            │
│  ┌──────────────────────────┐  │
│  │ Agent Node               │  │
│  │ - Call Claude with tools │  │
│  │ - Handle tool calls      │  │
│  │ - Generate response      │  │
│  └──────────────────────────┘  │
└────────┬─────────────────────────┘
         │
         ├─ Tool Needed?
         │  ├─ YES: Call Tool
         │  │       ▼
         │  │  ┌─────────────────┐
         │  │  │ execute_tool()  │
         │  │  │ Routes to:      │
         │  │  │ - SymPy         │
         │  │  │ - Qiskit        │
         │  │  │ - ArXiv         │
         │  │  └────────┬────────┘
         │  │           │
         │  │           ▼
         │  │  Tool Computation
         │  │           │
         │  │           ▼
         │  │  ┌──────────────┐
         │  │  │Tool Results  │
         │  │  └────────┬─────┘
         │  │           │
         │  │           ▼
         │  │  Back to Claude
         │  │  Continue Conversation
         │  │
         │  └─ NO: Final Response
         │
         ▼
┌────────────────────────┐
│  Finalize Node         │
│  Prepare Response      │
└────────┬───────────────┘
         │
         ▼
┌────────────────────────────────┐
│  HTTP Response                 │
│  {                             │
│    "conversation_id": "...",   │
│    "answer": "...",            │
│    "debug": {...}              │
│  }                             │
└────────┬───────────────────────┘
         │
         ▼
┌──────────────────────┐
│  useChat Hook        │
│  Updates State       │
└────────┬─────────────┘
         │
         ▼
┌──────────────────────┐
│  React Re-renders    │
│  Displays Message    │
└──────────────────────┘
```

## Component Hierarchy

```
App (page.tsx)
├── Header
│   ├── Title
│   ├── Description
│   └── Conversation ID
├── Main Chat Area
│   ├── Welcome Screen (initial state)
│   │   ├── Feature Cards
│   │   │   ├── Mathematics
│   │   │   ├── Quantum Physics
│   │   │   ├── Quantum Computing
│   │   │   └── Research
│   │   └── Example Prompts
│   │
│   └── ChatContainer
│       └── ChatMessage[] (messages)
│           ├── User Message
│           ├── Assistant Message
│           └── Debug Info (expandable)
│
└── Input Area
    └── ChatInput
        ├── Textarea
        ├── Auto-resize Logic
        ├── Send Button
        └── Keyboard Shortcuts
```

## State Management Flow

```
Browser State:
├── messages: Message[] ────────────────────┐
├── conversationId: string                  │
├── isLoading: boolean                      │
└── scrollRef: RefObject                    │
                                            ▼
                        useChat Hook
                        ├── sendMessage()
                        └── error handling
                                            ▼
                        API Call
                        POST /chat
                                            ▼
                        Backend Processing
                        ├── LangGraph
                        ├── Tool Calling
                        └── Response Gen
                                            ▼
                        HTTP Response
                                            ▼
                        Update Frontend
                        └── Add to messages[]
                                            ▼
                        Re-render UI
```

## Tool Registry

```
app/tools.py
├── TOOLS[] (JSON schema array)
│   ├── sympy_simplify
│   ├── sympy_differentiate
│   ├── sympy_integrate
│   ├── sympy_solve
│   ├── qiskit_create_bell_state
│   ├── qiskit_simulate_circuit
│   ├── quantum_schrodinger_equation
│   ├── particle_in_a_box
│   └── arxiv_research_summary
│
├── execute_tool(name, input)
│   └── Dispatch table mapping names to functions
│
└── Individual Tool Functions
    ├── Mathematical (SymPy-based)
    ├── Quantum Computing (Qiskit-based)
    ├── Physics Analysis (Analytical)
    └── Research (ArXiv API)
```

## Message Flow Sequence

```
1. User Types Message
   │
   ▼
2. ChatInput captures text
   │
   ▼
3. User clicks Send
   │
   ▼
4. useChat.sendMessage() called
   │
   ▼
5. POST /chat to FastAPI
   │
   ▼
6. FastAPI routes to LangGraph
   │
   ▼
7. LangGraph invokes Claude
   │
   ├─ Claude processes with tools enabled
   │  │
   │  ▼
   │ Claude decides if tool needed
   │ │
   │ ├─ YES: Returns tool_use block
   │ │  │
   │ │  ▼
   │ │ Execute tool_use
   │ │  │
   │ │  ▼
   │ │ Get tool results
   │ │  │
   │ │  ▼
   │ │ Send results back to Claude
   │ │  │
   │ │  ▼
   │ │ Claude generates response
   │ │
   │ └─ NO: Return final text response
   │
   ▼
8. Return ChatResponse
   {
     "conversation_id": "...",
     "answer": "...",
     "debug": {...}
   }
   │
   ▼
9. Frontend receives response
   │
   ▼
10. Add to messages array
    │
    ▼
11. React re-renders
    │
    ▼
12. Message appears in chat
    │
    ▼
13. User sees response
```

## Technology Stack Connections

```
Frontend                    Backend                    External
┌───────────┐          ┌──────────────┐            ┌──────────┐
│ Next.js   │          │ FastAPI      │            │Anthropic │
│ React 19  │ HTTP    │ LangGraph    │   Tools   │ Claude   │
│ Tailwind  │◄──────► │ Python      │◄───────────┤ API      │
└───────────┘          └──────────────┘            └──────────┘
                               │
                    ┌──────────┼──────────┐
                    ▼          ▼          ▼
                 ┌─────────┐ ┌──────────┐ ┌──────────┐
                 │ SymPy   │ │ Qiskit   │ │ ArXiv    │
                 │ NumPy   │ │ Qiskit-  │ │ Requests │
                 │ SciPy   │ │ Aer      │ │          │
                 └─────────┘ └──────────┘ └──────────┘
```

## Environment & Configuration

```
.env (Backend)
├── ANTHROPIC_API_KEY
├── ANTHROPIC_MODEL
└── AI_GATEWAY_API_KEY (optional)

.env.local (Frontend)
├── NEXT_PUBLIC_API_URL

Configuration Files
├── next.config.js (API rewrites)
├── tsconfig.json (TypeScript)
├── tailwind.config.js (Styling)
├── package.json (Node packages)
├── requirements.txt (Python packages)
└── Dockerfile (Container)
```

---

**Architecture designed for:**
- ✅ Scalability - Multi-agent system
- ✅ Maintainability - Clear separation of concerns
- ✅ Extensibility - Easy to add new tools
- ✅ Performance - Async operations, efficient APIs
- ✅ User Experience - Real-time chat interface
