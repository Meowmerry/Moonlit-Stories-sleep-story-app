#!/bin/bash

# AI Sleep Story Generator - Startup Script

echo "🚀 Starting AI Sleep Story Generator..."
echo ""

# Start backend in background
echo "📦 Starting backend server..."
cd backend
source venv/bin/activate
python main.py &
BACKEND_PID=$!
cd ..

# Wait for backend to start
sleep 3

# Start frontend in background
echo "⚛️  Starting frontend server..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Both servers are starting!"
echo ""
echo "Backend:  http://localhost:8000"
echo "Frontend: http://localhost:5173 (or 5174)"
echo ""
echo "Press Ctrl+C to stop both servers"
echo ""

# Wait for Ctrl+C
trap "kill $BACKEND_PID $FRONTEND_PID; exit" INT
wait
