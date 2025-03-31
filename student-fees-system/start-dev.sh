#!/bin/bash

# Start backend server
echo "Starting backend server..."
cd backend && npm run dev &

# Start frontend server
echo "Starting frontend development server..."
cd frontend && npm start

# Cleanup on exit
trap "kill 0" EXIT