#!/bin/bash

echo "Starting andy-os MVP Development Environment..."

# Function to cleanup background processes
cleanup() {
    echo "Shutting down services..."
    kill $BACKEND_PID $FRONTEND_PID 2>/dev/null
    exit 0
}

# Set up signal handlers
trap cleanup SIGINT SIGTERM

# Start backend
echo "Starting Go backend on :3001..."
cd backend
go mod tidy
go run main.go &
BACKEND_PID=$!
cd ..

# Wait a moment for backend to start
sleep 2

# Start frontend
echo "Starting React frontend on :3002..."
cd frontend
npm install
npm start &
FRONTEND_PID=$!
cd ..

echo "Development environment started!"
echo "Backend: http://localhost:3001"
echo "Frontend: http://localhost:3002"
echo "Press Ctrl+C to stop all services"

# Wait for background processes
wait
