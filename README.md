# Financial Advisor AI

A real-time AI system that joins financial meetings, transcribes audio, analyzes content, and generates dynamic visualizations on the fly.

## Features

- **Real-time Audio Processing**: Integrates with MeetStream and Deepgram API for live transcription
- **AI-Powered Analysis**: Extracts financial entities, metrics, sentiment, and key topics
- **Dynamic Visualizations**: Generates charts using Plotly and Chart.js for real-time insights
- **WebSocket Communication**: Real-time data push between backend and frontend
- **Modern Tech Stack**: Python/FastAPI backend with React/TypeScript/Tailwind frontend

## Architecture

### Backend (Python/FastAPI)
- FastAPI application with WebSocket support
- Deepgram integration for speech-to-text
- AI Core for transcript analysis and entity extraction
- Plotly for chart data generation
- Real-time WebSocket server

### Frontend (React/TypeScript)
- React application with TypeScript
- Tailwind CSS for modern styling
- Chart.js for data visualization
- WebSocket client for real-time updates

## Quick Start

1. **Start the application**:
   ```bash
   ./start.sh
   ```

2. **Manual setup**:
   
   **Backend**:
   ```bash
   cd backend
   pip install -r requirements.txt
   python main.py
   ```
   
   **Frontend**:
   ```bash
   cd frontend
   npm install
   npm start
   ```

3. **Access the application**:
   - Frontend: http://localhost:3000
   - Backend API: http://localhost:8000

## Configuration

### Environment Variables

**Backend (.env)**:
- `DEEPGRAM_API_KEY`: Your Deepgram API key for speech-to-text
- `CORS_ORIGINS`: Allowed CORS origins (default: http://localhost:3000)

**Frontend (.env)**:
- `REACT_APP_WS_URL`: WebSocket URL (default: ws://localhost:8000/ws)
- `REACT_APP_API_URL`: Backend API URL (default: http://localhost:8000)

## Usage

1. Open the application in your browser
2. Wait for the WebSocket connection to establish (green indicator)
3. Enter or paste a financial meeting transcript
4. Click "Analyze Transcript" or use the sample data
5. View real-time visualizations and analysis insights

## Sample Data

The application includes sample financial transcript data for testing:
- Revenue and expense metrics
- Growth and decline indicators
- Investment discussions
- Sentiment analysis

## API Endpoints

- `GET /`: Health check
- `GET /health`: Service health status
- `POST /analyze`: REST endpoint for text analysis
- `WebSocket /ws/{client_id}`: Real-time communication

## Technology Stack

- **Backend**: FastAPI, uvicorn, WebSockets, Plotly, pandas
- **Frontend**: React, TypeScript, Chart.js, Tailwind CSS
- **Integration**: Deepgram API for speech-to-text
- **Communication**: WebSockets for real-time updates

## Development

### Backend Development
```bash
cd backend
pip install -r requirements.txt
uvicorn main:app --reload --host 0.0.0.0 --port 8000
```

### Frontend Development
```bash
cd frontend
npm install
npm start
```

### Building for Production
```bash
cd frontend
npm run build
```

## Future Enhancements

- Integration with actual meeting platforms (Zoom, Teams, etc.)
- Real-time audio streaming and processing
- Advanced NLP models for better entity extraction
- Historical data storage and trends
- Multiple meeting room support
- Export capabilities for charts and reports