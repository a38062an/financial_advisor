# InsightAI - Intelligent Financial Advisory Meeting Agent

[![React](https://img.shields.io/badge/React-18.2.0-blue.svg)](https://reactjs.org/)
[![TypeScript](https://img.shields.io/badge/TypeScript-5.0-blue.svg)](https://www.typescriptlang.org/)
[![FastAPI](https://img.shields.io/badge/FastAPI-0.104-green.svg)](https://fastapi.tiangolo.com/)
[![Python](https://img.shields.io/badge/Python-3.9+-green.svg)](https://python.org/)

InsightAI is an intelligent meeting assistant that listens to financial discussions in real-time and automatically generates relevant charts and visualizations. It combines advanced natural language processing with dynamic data visualization to enhance financial advisory meetings.

## 🚀 Features

- **Real-time Meeting Transcription**: Live audio processing and transcription display
- **Automatic Chart Generation**: AI-powered visualization creation based on conversation context
- **WebSocket Integration**: Real-time communication between frontend and backend
- **Responsive Design**: Modern, professional interface optimized for meeting environments
- **Microservices Architecture**: Scalable backend with specialized services
- **Financial Entity Recognition**: Smart detection of financial topics and data points

## 🏗️ Architecture

### Frontend (React + TypeScript)

```
frontend/
├── src/
│   ├── components/          # Reusable UI components
│   │   └── ChartDisplay.tsx # Chart rendering component
│   ├── hooks/              # Custom React hooks
│   │   └── useWebSocket.ts # WebSocket connection management
│   ├── types/              # TypeScript definitions
│   │   └── index.ts        # Chart and message interfaces
│   ├── App.tsx            # Main application component
│   └── index.tsx          # React entry point
```

### Backend (Python + FastAPI)

```
backend/
├── ai-core/               # NLP and financial analysis
│   ├── app/
│   │   ├── main.py       # FastAPI application
│   │   └── models/
│   │       └── financial_analyzer.py
│   └── requirements.txt
├── visualization-engine/  # Chart generation service
│   ├── app/
│   │   └── main.py       # Chart API endpoints
│   └── requirements.txt
└── api-gateway/          # Request routing and management
    ├── app/
    │   └── main.py       # Gateway service
    └── requirements.txt
```

## 🛠️ Technology Stack

### Backend

- **Python**: Core programming language for backend services
- **FastAPI**: High-performance web framework for APIs
- **WebSockets**: Real-time bidirectional communication
- **Natural Language Processing**: Financial entity recognition
- **RESTful APIs**: Standard HTTP endpoints for data exchange

### Frontend

- **React 18.2.0**: Modern UI framework with hooks and functional components
- **TypeScript**: Type-safe JavaScript for better development experience
- **Tailwind CSS**: Utility-first CSS framework for rapid styling
- **Chart.js + react-chartjs-2**: Dynamic chart rendering
- **WebSockets**: Real-time bidirectional communication

### Development Tools

- **Create React App**: React application scaffolding
- **npm**: Package management for frontend dependencies
- **pip**: Python package management
- **Git**: Version control system

## 📦 Installation & Setup

### Prerequisites

- Node.js 16+ and npm
- Python 3.9+
- Git

### Quick Start

1. **Clone the repository**

```bash
git clone <repository-url>
cd financial_advisor
```

2. **Install dependencies and start services**

```bash
# Make setup script executable
chmod +x setup.sh

# Run automated setup
./setup.sh
```

### Manual Setup

#### Frontend Setup

```bash
cd frontend
npm install
npm start
# Frontend runs on http://localhost:3002
```

#### Backend Setup

**AI Core Service (Port 8000)**

```bash
cd backend/ai-core
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8000 --reload
```

**Visualization Engine (Port 8001)**

```bash
cd backend/visualization-engine
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8001 --reload
```

**API Gateway (Port 8002)**

```bash
cd backend/api-gateway
pip install -r requirements.txt
python -m uvicorn app.main:app --host 0.0.0.0 --port 8002 --reload
```

## 🧪 Testing the System

### 1. Start All Services

Ensure all services are running:

- Frontend: http://localhost:3002
- AI Core: http://localhost:8000
- Visualization Engine: http://localhost:8001
- API Gateway: http://localhost:8002

### 2. Test Chart Generation

1. Open the frontend in your browser
2. Click the "Generate Demo Chart" button
3. Verify that a chart appears in the main display area

### 3. Test WebSocket Connection

1. Check the connection status indicator in the header
2. Green dot = Connected, Red dot = Disconnected
3. The status should show "Connected" when services are running

### 4. API Health Checks

```bash
# Test each service endpoint
curl http://localhost:8000/health
curl http://localhost:8001/health
curl http://localhost:8002/health
```

### 5. Test Chart Generation API

```bash
curl -X POST http://localhost:8001/generate \
  -H "Content-Type: application/json" \
  -d '{
    "chart_type": "bar_chart",
    "intent": "stock_comparison",
    "entities": {"companies": ["apple", "microsoft", "google"]},
    "data_source": "mock"
  }'
```

## 🔄 How the System Works

### 1. Meeting Audio Processing

- Audio input is processed by the AI Core service
- Speech-to-text conversion creates live transcripts
- Transcripts are sent to frontend via WebSocket

### 2. Financial Analysis

- AI Core analyzes transcript content for financial entities
- Identifies mentions of stocks, companies, financial metrics
- Determines appropriate visualization types

### 3. Chart Generation

- Visualization Engine receives analysis results
- Generates appropriate charts (bar, line, pie, etc.)
- Returns chart data in JSON format

### 4. Real-time Display

- Frontend receives chart data via WebSocket
- ChartDisplay component renders visualizations
- Transcript panel shows live conversation

### 5. User Interaction

- "Generate Demo Chart" button for testing
- Real-time status indicators
- Responsive design for various screen sizes

## 📁 Key Files Explained

### Frontend Core Files

**`frontend/src/App.tsx`**

- Main application component
- Manages WebSocket connections
- Handles chart data state
- Renders header, chart area, and transcript panel

**`frontend/src/components/ChartDisplay.tsx`**

- Renders Chart.js visualizations
- Handles different chart types
- Responsive chart sizing

**`frontend/src/hooks/useWebSocket.ts`**

- Custom hook for WebSocket management
- Handles connection state
- Processes incoming messages

**`frontend/src/types/index.ts`**

- TypeScript interfaces for chart data
- Message types for WebSocket communication
- Type safety across the application

### Backend Core Files

**`backend/ai-core/app/main.py`**

- FastAPI application for NLP processing
- WebSocket endpoint for real-time communication
- Financial entity recognition logic

**`backend/visualization-engine/app/main.py`**

- Chart generation API endpoints
- Mock data generation for testing
- Chart configuration management

**`backend/api-gateway/app/main.py`**

- Request routing between services
- API aggregation and management
- Service coordination

## 🚀 Deployment

### Development

- Frontend: `npm start` (hot reload enabled)
- Backend: `uvicorn --reload` (auto-restart on changes)

### Production

- Frontend: `npm run build` (optimized static files)
- Backend: Standard FastAPI deployment (Gunicorn, Docker, etc.)
- Consider using Docker Compose for full stack deployment

## 🔧 Configuration

### Environment Variables

Copy `.env.example` to `.env` and configure:

```env
# API Endpoints
REACT_APP_AI_CORE_URL=http://localhost:8000
REACT_APP_VISUALIZATION_URL=http://localhost:8001
REACT_APP_GATEWAY_URL=http://localhost:8002

# WebSocket URLs
REACT_APP_WS_URL=ws://localhost:8000/ws/advisor
```

### Service Ports

- Frontend: 3002
- AI Core: 8000
- Visualization Engine: 8001
- API Gateway: 8002

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature-name`
3. Make your changes
4. Test thoroughly
5. Commit: `git commit -m "Description of changes"`
6. Push: `git push origin feature-name`
7. Create a Pull Request

## 📝 License

This project is licensed under the MIT License - see the LICENSE file for details.

## 🆘 Troubleshooting

### Common Issues

**Chart not displaying:**

- Verify visualization engine is running on port 8001
- Check browser console for JavaScript errors
- Ensure Chart.js dependencies are installed

**WebSocket connection failed:**

- Confirm AI Core service is running on port 8000
- Check firewall settings
- Verify WebSocket URL in configuration

**Frontend compilation errors:**

- Delete `node_modules` and run `npm install`
- Check TypeScript configuration
- Verify all imports are correct

### Service Health Checks

```bash
# Check if services are responding
curl http://localhost:3002  # Frontend
curl http://localhost:8000/health  # AI Core
curl http://localhost:8001/health  # Visualization
curl http://localhost:8002/health  # Gateway
```

## 📞 Support

For questions or issues, please:

1. Check the troubleshooting section above
2. Review the GitHub issues
3. Create a new issue with detailed information
4. Include error messages and steps to reproduce

---

**Built with ❤️ for intelligent financial advisory meetings**
