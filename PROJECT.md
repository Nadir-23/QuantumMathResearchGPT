# QuantumMathResearchGPT - Project Overview

## 🎯 Mission

QuantumMathResearchGPT is a sophisticated multi-agent AI system combining Large Language Models with specialized computational tools for rigorous scientific research, mathematical derivations, and quantum simulations.

## 📊 Architecture

### System Components

```
┌─────────────────────────────────────────────────────────────┐
│                    User Interface                           │
│           Next.js 16 + React 19 + Tailwind CSS             │
│              (localhost:3000)                               │
└────────────────────────┬────────────────────────────────────┘
                         │ HTTP/API
┌────────────────────────▼────────────────────────────────────┐
│                    FastAPI Backend                          │
│         (localhost:8000)                                    │
│  ┌────────────────────────────────────────────────────┐    │
│  │         LangGraph Orchestrator                     │    │
│  │  (Multi-agent coordination & routing)              │    │
│  └────────────────────────────────────────────────────┘    │
└─────┬──────────┬──────────┬──────────┬──────────────────────┘
      │          │          │          │
      ▼          ▼          ▼          ▼
   ┌─────────────────────────────────────────────────────┐
   │              Specialized Tools                      │
   │                                                     │
   │  • Mathematical Engine (SymPy)                      │
   │  • Quantum Computing (Qiskit)                       │
   │  • Quantum Physics (Analytical)                     │
   │  • Research Tools (ArXiv)                           │
   └─────────────────────────────────────────────────────┘
```

### Technology Stack

**Backend**
- FastAPI 0.115.6 - High-performance web framework
- LangGraph 1.2.6 - Multi-agent orchestration
- Anthropic SDK - Claude integration
- Python 3.11+ - Core runtime

**Mathematical & Quantum**
- SymPy 1.14 - Symbolic mathematics
- NumPy 2.5 - Numerical computing
- SciPy 1.18 - Scientific computing
- Qiskit 2.4 - Quantum circuits & simulation

**Frontend**
- Next.js 16 - React framework
- React 19.2 - UI library
- Tailwind CSS 4.3 - Styling
- TypeScript 6.0 - Type safety
- Lucide React - Icons

**Utilities**
- Python-dotenv - Environment management
- Requests - HTTP client
- ArXiv - Research paper access

## 📁 Project Structure

```
QuantumMathResearchGPT/
│
├── app/                          # Backend (Python)
│   ├── main.py                   # FastAPI application entry point
│   ├── orchestrator.py           # LangGraph multi-agent orchestrator
│   ├── tools.py                  # Mathematical & quantum tools
│   └── __init__.py               # Package initialization
│
├── app/                          # Frontend (TypeScript/React)
│   ├── page.tsx                  # Main chat page
│   ├── layout.tsx                # Root layout with metadata
│   ├── globals.css               # Global styles & design tokens
│   ├── components/               # React components
│   │   ├── ChatContainer.tsx     # Chat message container
│   │   ├── ChatMessage.tsx       # Individual message component
│   │   └── ChatInput.tsx         # Message input form
│   └── lib/                      # Utilities
│       └── useChat.ts            # Custom hook for API calls
│
├── next.config.js                # Next.js configuration
├── tsconfig.json                 # TypeScript configuration
├── tailwind.config.js            # Tailwind CSS config
├── package.json                  # Node dependencies
├── requirements.txt              # Python dependencies
│
├── Dockerfile                    # Container configuration
├── .env.example                  # Environment template
├── .env.local                    # Frontend config
│
├── README.md                     # Feature documentation
├── SETUP.md                      # Detailed setup guide
├── QUICKSTART.md                 # 5-minute quick start
├── PROJECT.md                    # This file
└── LICENSE                       # MIT License
```

## 🔧 Key Features

### Mathematical Tools (SymPy)
- **Simplification** - Reduce complex expressions to simpler forms
- **Differentiation** - Compute derivatives with respect to any variable
- **Integration** - Solve definite and indefinite integrals
- **Equation Solving** - Find roots of polynomial and transcendental equations
- **Matrix Operations** - Determinant, eigenvalues, rank, inverse, transpose
- **Symbolic Computation** - Work with abstract variables and expressions

### Quantum Computing (Qiskit)
- **Circuit Creation** - Build quantum circuits with various gates
- **Bell States** - Generate entangled quantum states
- **Circuit Simulation** - Simulate quantum circuits classically
- **Measurement** - Collapse quantum states and get probabilities
- **Hadamard Transform** - Create superposition states

### Quantum Physics
- **Schrödinger Equation** - Information and insights
- **Particle in a Box** - Analyze quantum confined systems
- **Quantum Operators** - Describe observables and measurements
- **Wave Functions** - Probability amplitude analysis

### Research Tools
- **ArXiv Search** - Query scientific papers by topic
- **Paper Summaries** - Get summaries of recent research
- **Citation Analysis** - Track influential papers
- **Literature Review** - Assist with research methodology

## 🚀 API Endpoints

### POST /chat
Main endpoint for interacting with the AI assistant.

**Request:**
```json
{
  "user_message": "Solve x² - 4 = 0",
  "conversation_id": "optional-uuid"
}
```

**Response:**
```json
{
  "conversation_id": "550e8400-e29b-41d4-a716-446655440000",
  "answer": "The solutions to x² - 4 = 0 are x = 2 and x = -2, obtained by factoring (x-2)(x+2) = 0.",
  "debug": {
    "model": "claude-3-5-sonnet-20241022",
    "tool_calls": 1,
    "stop_reason": "end_turn",
    "conversation_id": "550e8400-e29b-41d4-a716-446655440000"
  }
}
```

### GET /
Health check endpoint.

**Response:**
```json
{
  "status": "healthy",
  "app": "QuantumMathResearchGPT",
  "version": "1.0.0"
}
```

## 💡 How It Works

### Request Flow

1. **User Input** → Frontend captures message
2. **API Call** → Sends to `/chat` endpoint
3. **LangGraph Orchestrator** → Routes to appropriate agents
4. **Tool Invocation** → Claude calls specialized tools
5. **Computation** → SymPy/Qiskit process the request
6. **Tool Results** → Returned to Claude
7. **Response Generation** → Claude formulates answer
8. **Frontend Display** → Message rendered with formatting
9. **Conversation Stored** → For context in follow-ups

### Multi-Agent Coordination

The LangGraph orchestrator:
- Routes requests to specialized agents
- Manages tool calling with Anthropic SDK
- Handles state transitions
- Manages conversation history
- Aggregates results from multiple tools

## 🎓 Example Interactions

### Mathematics
```
User: Solve the differential equation dy/dx = 2x
Agent: Uses SymPy's diff solving to provide analytical solution
Output: y = x² + C
```

### Quantum Physics
```
User: What's the ground state energy of a particle in a 1D box?
Agent: Applies particle_in_a_box tool
Output: E₁ = π²ℏ²/(2mL²)
```

### Quantum Computing
```
User: Show me a Bell state circuit
Agent: Uses Qiskit to create circuit and simulate
Output: Circuit diagram + measurement results
```

### Research
```
User: Find papers on variational quantum algorithms
Agent: Searches ArXiv
Output: Recent papers with summaries
```

## 🔐 Security Considerations

- API key stored in environment variables
- Never expose keys in frontend
- Rate limiting recommended for production
- Input validation on all endpoints
- Error handling prevents information leakage

## 📈 Performance Optimization

**Backend**
- Use caching for symbolic computation results
- Implement async operations for I/O
- Connection pooling for databases
- Request rate limiting

**Frontend**
- Code splitting for faster initial load
- SWR for efficient data fetching
- Debouncing for search queries
- Lazy loading of components

## 🧪 Testing Queries

```bash
# Math
"Simplify (x² - 1)/(x - 1)"
"Integrate e^(-x²)"
"Find eigenvalues of [[1,2],[2,1]]"

# Quantum
"Create a GHZ state"
"Explain quantum tunneling"
"What is the Pauli X gate?"

# Research
"Summarize recent papers on quantum machine learning"
"What's new in quantum error correction?"
```

## 🚢 Deployment

### Local Development
```bash
# Backend
uvicorn app.main:app --reload --port 8000

# Frontend
npm run dev
```

### Production Build
```bash
# Backend
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app

# Frontend
npm run build && npm run start
```

### Docker Deployment
```bash
docker build -t quantum-math-gpt .
docker run -p 8000:8000 -e ANTHROPIC_API_KEY=... quantum-math-gpt
```

## 📚 Resources

- [Anthropic Docs](https://docs.anthropic.com)
- [SymPy Docs](https://docs.sympy.org)
- [Qiskit Docs](https://docs.quantum.ibm.com)
- [LangGraph Docs](https://langchain-ai.github.io/langgraph/)
- [Next.js Docs](https://nextjs.org/docs)

## 🤝 Contributing

To add new tools:
1. Implement function in `app/tools.py`
2. Add to `TOOLS` registry
3. Add to `execute_tool` mapping
4. Document usage in README

## 📝 License

MIT License - See LICENSE file

## 👤 Author

Boukrioui Nadir - AI Engineer & Quantum Enthusiast

---

**Start using QuantumMathResearchGPT:**
1. Follow [QUICKSTART.md](./QUICKSTART.md) for 5-minute setup
2. Check [SETUP.md](./SETUP.md) for detailed configuration
3. See [README.md](./README.md) for feature overview
