# QuantumMathResearchGPT - Setup Guide

This guide will help you set up and run QuantumMathResearchGPT locally.

## Prerequisites

- Python 3.11+
- Node.js 18+
- npm or yarn
- Anthropic API key

## Backend Setup

### 1. Create Python Virtual Environment

```bash
python -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate
```

### 2. Install Python Dependencies

```bash
pip install -r requirements.txt
```

### 3. Configure Environment Variables

Create a `.env` file in the project root:

```env
ANTHROPIC_API_KEY=your_anthropic_api_key_here
ANTHROPIC_MODEL=claude-3-5-sonnet-20241022
```

Get your Anthropic API key from: https://console.anthropic.com

### 4. Run the Backend

```bash
uvicorn app.main:app --reload --port 8000
```

The backend will be available at: http://localhost:8000

API Documentation: http://localhost:8000/docs

## Frontend Setup

### 1. Install Node Dependencies

```bash
npm install
```

### 2. Configure Environment Variables

Create a `.env.local` file in the project root:

```env
NEXT_PUBLIC_API_URL=http://localhost:8000
```

### 3. Run the Frontend

In a new terminal:

```bash
npm run dev
```

The frontend will be available at: http://localhost:3000

## Running Both Simultaneously

### Option 1: Using the startup script (Linux/Mac)

```bash
chmod +x start-dev.sh
./start-dev.sh
```

### Option 2: Using different terminals

Terminal 1 - Backend:
```bash
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

Terminal 2 - Frontend:
```bash
npm run dev
```

## Architecture

### Backend Structure

```
app/
├── main.py              # FastAPI application
├── orchestrator.py      # LangGraph orchestrator
├── tools.py             # Mathematical and quantum tools
└── __init__.py
```

### Frontend Structure

```
app/
├── page.tsx             # Main chat page
├── layout.tsx           # Root layout
├── globals.css          # Global styles
├── components/
│   ├── ChatContainer.tsx
│   ├── ChatMessage.tsx
│   └── ChatInput.tsx
└── lib/
    └── useChat.ts       # Chat API hook
```

## Features

### Mathematical Tools
- **Simplify expressions** - Use SymPy for symbolic computation
- **Differentiation** - Compute derivatives of functions
- **Integration** - Solve integrals (definite and indefinite)
- **Equation solving** - Find solutions to polynomial and transcendental equations
- **Matrix operations** - Determinant, eigenvalues, inverse, etc.

### Quantum Computing
- **Bell State Creation** - Generate entangled quantum states
- **Circuit Simulation** - Simulate quantum circuits using Qiskit
- **Hadamard Transform** - Create superposition states

### Quantum Physics
- **Schrödinger Equation** - Information and analysis
- **Particle in a Box** - Quantum system analysis

### Research Tools
- **ArXiv Search** - Search for research papers
- **Paper Summaries** - Get summaries of latest papers in your field

## Example Queries

### Mathematics
```
Solve x³ - 6x² + 11x - 6 = 0
```

```
Simplify (x² - 1) / (x - 1)
```

```
Integrate e^(-x²) from -infinity to infinity
```

### Quantum Physics
```
Derive the time-independent Schrödinger equation
```

```
Analyze the particle in a box system
```

### Quantum Computing
```
Create and simulate a Bell state circuit
```

```
Explain quantum entanglement with a circuit
```

### Research
```
Summarize recent papers on variational quantum algorithms
```

## Troubleshooting

### Backend won't start
- Check if port 8000 is already in use
- Verify all dependencies are installed: `pip list`
- Check that ANTHROPIC_API_KEY is set: `echo $ANTHROPIC_API_KEY`

### Frontend won't connect to backend
- Ensure backend is running on port 8000
- Check NEXT_PUBLIC_API_URL in .env.local
- Check browser console for CORS errors
- Verify firewall settings allow localhost:8000

### Missing dependencies
- Reinstall: `pip install -r requirements.txt --force-reinstall`
- For frontend: `npm install --legacy-peer-deps`

### API key errors
- Verify your Anthropic API key is correct
- Check it's set as an environment variable: `.env` file
- Ensure it's not expired

## Building for Production

### Backend
```bash
# Build Docker image (optional)
docker build -t quantum-math-gpt .

# Run with gunicorn
pip install gunicorn
gunicorn -w 4 -k uvicorn.workers.UvicornWorker app.main:app
```

### Frontend
```bash
npm run build
npm run start
```

## API Endpoints

### POST /chat
Send a message and get a response.

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
  "conversation_id": "uuid",
  "answer": "The solutions are x = 2 and x = -2",
  "debug": {
    "model": "claude-3-5-sonnet-20241022",
    "tool_calls": 1,
    "stop_reason": "end_turn"
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

## Performance Tips

1. **Backend Optimization**
   - Use caching for frequently requested computations
   - Implement request rate limiting
   - Optimize symbolic computation with assumptions

2. **Frontend Optimization**
   - Enable production builds
   - Use code splitting
   - Cache API responses with SWR

## Additional Resources

- [Anthropic API Documentation](https://docs.anthropic.com)
- [SymPy Documentation](https://docs.sympy.org)
- [Qiskit Documentation](https://docs.quantum.ibm.com)
- [LangGraph Documentation](https://langchain-ai.github.io/langgraph/)
- [Next.js Documentation](https://nextjs.org/docs)

## Support

For issues or questions:
1. Check the troubleshooting section
2. Review error logs in the terminal
3. Check API response debug information
4. Open an issue on GitHub

## License

MIT License - See LICENSE file for details
