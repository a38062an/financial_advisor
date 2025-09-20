# InsightAI: Proactive AI Meeting Agent

InsightAI is a real-time, AI-powered meeting agent designed to revolutionize financial advisory meetings. The system listens to meeting conversations and proactively generates dynamic, data-supported visualizations on the fly, allowing advisors to maintain a natural, uninterrupted flow.

## 🚀 Project Overview

The current process in financial advisory meetings is often manual and inefficient - advisors have to break the flow of conversation to look up data and present it. Our solution provides:

- **Real-time Listening**: Joins virtual meetings via MeetStream API with live audio transcription
- **Intelligent Analysis**: Uses custom NLP to recognize financial intents and extract key entities
- **Dynamic Visualizations**: Generates charts instantly based on conversation context
- **Seamless Integration**: Displays visualizations in real-time without interrupting the meeting flow

## 🏗 Architecture

```
insight-ai/
├── backend/                    # Python microservices
│   ├── ai-core/               # Main AI processing service
│   │   ├── app/
│   │   │   ├── main.py        # FastAPI application entry point
│   │   │   └── models/
│   │   │       └── financial_analyzer.py # Custom NLP logic
│   │   ├── requirements.txt
│   │   └── data/              # Client data files
│   ├── visualization-engine/   # Chart generation service
│   │   ├── app/
│   │   │   └── main.py        # Plotly-based chart generation
│   │   └── requirements.txt
│   └── api-gateway/           # Simple proxy service
│       ├── app/
│       │   └── main.py        # Route management
│       └── requirements.txt
├── frontend/                  # React/TypeScript frontend
│   ├── src/
│   │   ├── components/        # React components
│   │   ├── hooks/            # Custom React hooks
│   │   ├── types/            # TypeScript definitions
│   │   └── utils/            # Utility functions
│   ├── package.json
│   ├── tailwind.config.js
│   └── vite.config.ts
├── vercel.json               # Vercel deployment config
└── setup.sh                 # Development setup script
```

## 🛠 Technology Stack

### Backend
- **Python**: Primary language for all backend services
- **FastAPI**: Lightweight, asynchronous REST and WebSocket APIs
- **Plotly**: Interactive chart generation
- **Deepgram**: Real-time audio transcription
- **MeetStream**: Meeting integration API

### Frontend
- **React**: Component-based UI framework
- **TypeScript**: Static typing for enhanced development
- **Tailwind CSS**: Utility-first CSS framework
- **Chart.js**: Chart rendering library
- **Vite**: Fast build tool and development server

### Deployment
- **Vercel**: Frontend deployment platform
- **Docker**: Containerization for backend services (optional)

## ⚡ Quick Start

### Prerequisites
- Python 3.8+
- Node.js 16+
- npm or yarn

### Automated Setup
```bash
# Clone the repository
git clone <repository-url>
cd financial_advisor

# Run setup script
chmod +x setup.sh
./setup.sh
```

### Manual Setup

1. **Backend Setup**:
```bash
# Create Python virtual environment
python3 -m venv venv
source venv/bin/activate  # On Windows: venv\Scripts\activate

# Install dependencies for each service
pip install -r backend/ai-core/requirements.txt
pip install -r backend/visualization-engine/requirements.txt
pip install -r backend/api-gateway/requirements.txt
```

2. **Frontend Setup**:
```bash
cd frontend
npm install
```

3. **Environment Configuration**:
```bash
# Copy environment template
cp .env.example .env

# Update .env with your API keys:
# - DEEPGRAM_API_KEY
# - MEETSTREAM_API_KEY
# - OPENAI_API_KEY (optional)
```

## 🏃‍♂️ Running the Application

### Development Mode

1. **Start Backend Services** (in separate terminals):
```bash
# AI Core Service (Port 8000)
cd backend/ai-core
python app/main.py

# Visualization Engine (Port 8001)
cd backend/visualization-engine
python app/main.py

# API Gateway (Port 8002)
cd backend/api-gateway
python app/main.py
```

2. **Start Frontend**:
```bash
cd frontend
npm run dev
# Opens on http://localhost:3000
```

### Production Deployment

**Frontend (Vercel)**:
```bash
# Deploy to Vercel
cd frontend
vercel --prod
```

**Backend (Recommended: Railway, Heroku, or similar)**:
- Deploy each backend service separately
- Update environment variables with production URLs
- Configure CORS for your frontend domain

## 🔧 API Endpoints

### AI Core Service (Port 8000)
- `GET /health` - Health check
- `POST /analyze` - Analyze transcript text
- `WS /ws/transcript` - WebSocket for live transcription
- `WS /ws/advisor` - WebSocket for advisor interface

### Visualization Engine (Port 8001)
- `GET /health` - Health check
- `POST /generate` - Generate chart from analysis

### API Gateway (Port 8002)
- `GET /health` - Health check
- `/ai/*` - Proxy to AI Core
- `/viz/*` - Proxy to Visualization Engine

## 📊 Features

### Current Implementation
- ✅ Real-time WebSocket connections
- ✅ Custom NLP for financial intent recognition
- ✅ Dynamic chart generation (Bar, Line, Pie charts)
- ✅ Responsive React interface with Tailwind CSS
- ✅ Modular microservice architecture
- ✅ TypeScript support with full type safety

### Planned Enhancements
- 🔄 MeetStream API integration
- 🔄 Deepgram live transcription
- 🔄 Enhanced NLP with OpenAI integration
- 🔄 User authentication and session management
- 🔄 Historical data storage and retrieval
- 🔄 Advanced chart types and customization

## 🎯 Use Cases

1. **Stock Comparison**: "Compare Apple and Microsoft stock performance"
   - Generates bar chart with current prices and changes

2. **Portfolio Analysis**: "Show me the portfolio allocation"
   - Creates pie chart of sector distribution

3. **Historical Performance**: "How did Tesla perform in the last 6 months?"
   - Displays line chart with historical price data

4. **Market Trends**: "What's the trend in tech stocks?"
   - Visualizes sector performance comparisons

## 🔗 Integration Guide

### MeetStream Integration
```python
# Example: Connecting to MeetStream API
import meetstream

client = meetstream.Client(api_key=os.getenv('MEETSTREAM_API_KEY'))
meeting = client.join_meeting(meeting_id)
audio_stream = meeting.get_audio_stream()
```

### Deepgram Integration
```python
# Example: Real-time transcription
from deepgram import Deepgram

dg_client = Deepgram(os.getenv('DEEPGRAM_API_KEY'))
connection = dg_client.transcription.live({'punctuate': True})
```

## 🧪 Testing

```bash
# Backend tests
python -m pytest backend/tests/

# Frontend tests
cd frontend
npm test

# End-to-end tests
npm run test:e2e
```

## 🤝 Contributing

1. Fork the repository
2. Create a feature branch: `git checkout -b feature/amazing-feature`
3. Commit changes: `git commit -m 'Add amazing feature'`
4. Push to branch: `git push origin feature/amazing-feature`
5. Open a Pull Request

## 📝 License

This project is licensed under the MIT License - see the [LICENSE](LICENSE) file for details.

## 🆘 Support

For support and questions:
- Create an issue in the GitHub repository
- Contact the development team
- Check the [documentation](docs/) for detailed guides

---

Built with ❤️ for the financial advisory industry