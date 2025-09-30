#!/bin/bash

echo "🚀 Starting Project Management System..."
echo ""

# Function to kill background processes on exit
cleanup() {
    echo ""
    echo "🛑 Shutting down servers..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit
}

# Set up trap to cleanup on script exit
trap cleanup SIGINT SIGTERM EXIT

# Start backend server
echo "📡 Starting Backend Server (Port 3000)..."
cd backend
npm run dev &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 3

# Start frontend server
echo "🎨 Starting Frontend Server (Port 5173)..."
cd frontend
npm run dev &
FRONTEND_PID=$!
cd ..

echo ""
echo "✅ Servers started successfully!"
echo "📡 Backend API: http://localhost:3000"
echo "🎨 Frontend App: http://localhost:5173"
echo ""
echo "Press Ctrl+C to stop both servers"

# Wait for background processes
wait