#!/bin/bash

# InsightAI Development Setup Script

echo "🚀 Setting up InsightAI development environment..."

# Check if Python is installed
if ! command -v python3 &> /dev/null; then
    echo "❌ Python 3 is required but not installed."
    exit 1
fi

# Check if Node.js is installed
if ! command -v node &> /dev/null; then
    echo "❌ Node.js is required but not installed."
    exit 1
fi

# Create virtual environment for Python backend
echo "📦 Creating Python virtual environment..."
python3 -m venv venv
source venv/bin/activate

# Install backend dependencies
echo "📥 Installing Python dependencies..."
pip install -r backend/ai-core/requirements.txt
pip install -r backend/visualization-engine/requirements.txt
pip install -r backend/api-gateway/requirements.txt

# Install frontend dependencies
echo "📥 Installing Node.js dependencies..."
cd frontend
npm install
cd ..

# Copy environment file
if [ ! -f .env ]; then
    echo "📝 Creating environment file..."
    cp .env.example .env
    echo "⚠️  Please update .env with your API keys"
fi

echo "✅ Setup complete!"
echo ""
echo "To start the application:"
echo "1. Start backend services:"
echo "   cd backend/ai-core && python app/main.py &"
echo "   cd backend/visualization-engine && python app/main.py &"
echo "   cd backend/api-gateway && python app/main.py &"
echo ""
echo "2. Start frontend:"
echo "   cd frontend && npm run dev"
echo ""
echo "3. Open http://localhost:3000 in your browser"