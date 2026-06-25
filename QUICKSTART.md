# QuantumMathResearchGPT - Quick Start

Get up and running in 5 minutes!

## 1. Clone & Setup

```bash
# Navigate to project
cd QuantumMathResearchGPT

# Create Python virtual environment
python -m venv venv
source venv/bin/activate  # Windows: venv\Scripts\activate

# Install dependencies
pip install -r requirements.txt
npm install
```

## 2. Configure API Key

```bash
# Copy and edit the environment file
cp .env.example .env

# Edit .env and add your Anthropic API key:
# ANTHROPIC_API_KEY=sk-ant-...
```

Get your key: https://console.anthropic.com/keys

## 3. Start Backend

```bash
source venv/bin/activate
uvicorn app.main:app --reload --port 8000
```

API will be ready at: http://localhost:8000

## 4. Start Frontend (New Terminal)

```bash
npm run dev
```

App will be ready at: http://localhost:3000

## 5. Start Chatting!

Open http://localhost:3000 and ask:

- **Math**: "Solve x² - 4 = 0"
- **Quantum**: "Explain superposition"
- **Research**: "Summarize papers on quantum AI"
- **Circuits**: "Create a Bell state circuit"

---

## Features at a Glance

| Feature | Example |
|---------|---------|
| 🧮 Mathematics | Solve equations, simplify expressions, compute derivatives |
| ⚛️ Quantum Physics | Schrödinger equation, quantum mechanics, particle in a box |
| 🔌 Quantum Computing | Create circuits, simulate gates, Bell states |
| 📚 Research | Search arXiv, summarize papers |

---

## Troubleshooting

**Backend won't connect?**
- Check port 8000 is free: `lsof -i :8000`
- Verify API key: `echo $ANTHROPIC_API_KEY`

**Frontend shows errors?**
- Clear cache: `rm -rf .next`
- Reinstall: `npm install --legacy-peer-deps`

**Port already in use?**
- Backend: `uvicorn app.main:app --port 9000`
- Frontend: `PORT=3001 npm run dev`

---

## Next Steps

- Read [SETUP.md](./SETUP.md) for detailed configuration
- Check [README.md](./README.md) for full feature list
- Explore `app/tools.py` to add custom tools

Enjoy! 🚀
