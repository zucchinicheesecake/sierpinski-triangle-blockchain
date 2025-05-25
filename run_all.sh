#!/bin/bash

# Exit on error
set -e

# Function to check command availability
check_command() {
    if ! command -v $1 &> /dev/null; then
        echo "Error: $1 is not installed. Please install $1 first."
        exit 1
    fi
}

echo "Checking prerequisites..."
# Check for required commands
check_command python3
check_command npm

echo "Setting up Sierpinski Triangle Blockchain with Wrocłaium Token Mining..."

# Backend setup
echo "Setting up Python backend..."
cd backend
python3 -m venv venv
source venv/bin/activate
pip install -r requirements.txt

# Initialize Wrocłaium token contract
echo "Initializing Wrocłaium token contract..."
python src/wladyslaium_token.py --init
cd ..

# Frontend setup
echo "Setting up Next.js frontend..."
cd frontend
npm install
cd ..

echo "Setup complete!"

echo "Starting backend API server..."
cd backend
source venv/bin/activate
nohup python src/api_server.py > ../backend.log 2>&1 &
cd ..

echo "Starting frontend development server..."
cd frontend
nohup npm run dev > ../frontend.log 2>&1 &
cd ..

echo ""
echo "Backend API server is running in background (logs: backend.log)"
echo "Frontend development server is running in background (logs: frontend.log)"
echo ""
echo "Access the mining dashboard at http://localhost:3000"
echo ""
echo "To stop the servers, find and kill the processes manually or restart your terminal session."
echo ""
echo "Documentation available in docs/"
