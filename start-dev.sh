#!/bin/bash

# QuantumMathResearchGPT Development Server Startup Script

echo "Starting QuantumMathResearchGPT..."
echo ""

# Activate Python virtual environment
echo "🐍 Activating Python environment..."
source venv/bin/activate

# Start FastAPI backend in background
echo "🚀 Starting FastAPI backend on port 8000..."
cd /vercel/share/v0-project
python -m uvicorn app.main:app --reload --port 8000 &
BACKEND_PID=$!
echo "Backend PID: $BACKEND_PID"

# Wait a moment for backend to start
sleep 3

# Start Next.js frontend
echo "⚛️  Starting Next.js frontend on port 3000..."
npm run dev

# Cleanup on exit
trap "kill $BACKEND_PID" EXIT
