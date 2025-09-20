import asyncio
import json
import logging
from typing import Dict, List, Any
from fastapi import FastAPI, WebSocket, WebSocketDisconnect, HTTPException
from fastapi.middleware.cors import CORSMiddleware
from fastapi.staticfiles import StaticFiles
import uvicorn
from pathlib import Path

from ai_core import AICore
from websocket_handler import ConnectionManager

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="Financial Advisor AI", description="Real-time financial meeting analysis and visualization")

# CORS middleware for frontend communication
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Initialize components
ai_core = AICore()
connection_manager = ConnectionManager()

@app.get("/")
async def read_root():
    return {"message": "Financial Advisor AI Backend", "status": "running"}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "financial_advisor_ai"}

@app.websocket("/ws/{client_id}")
async def websocket_endpoint(websocket: WebSocket, client_id: str):
    """WebSocket endpoint for real-time communication with frontend"""
    await connection_manager.connect(websocket, client_id)
    try:
        while True:
            # Receive data from client
            data = await websocket.receive_text()
            message = json.loads(data)
            
            if message.get("type") == "audio_transcript":
                # Process transcript and generate visualizations
                transcript = message.get("transcript", "")
                await process_transcript(client_id, transcript)
            elif message.get("type") == "meeting_start":
                # Initialize meeting session
                await connection_manager.send_personal_message(
                    {"type": "meeting_started", "status": "ready"}, client_id
                )
            
    except WebSocketDisconnect:
        connection_manager.disconnect(client_id)
        logger.info(f"Client {client_id} disconnected")

async def process_transcript(client_id: str, transcript: str):
    """Process transcript and send visualization data to client"""
    try:
        # Analyze transcript with AI
        analysis = await ai_core.analyze_transcript(transcript)
        
        # Generate chart data
        chart_data = await ai_core.generate_chart_data(analysis)
        
        # Send data to client
        await connection_manager.send_personal_message({
            "type": "chart_update",
            "data": chart_data,
            "analysis": analysis
        }, client_id)
        
    except Exception as e:
        logger.error(f"Error processing transcript: {e}")
        await connection_manager.send_personal_message({
            "type": "error",
            "message": "Failed to process transcript"
        }, client_id)

@app.post("/analyze")
async def analyze_text(text_data: Dict[str, Any]):
    """REST endpoint for text analysis"""
    try:
        text = text_data.get("text", "")
        analysis = await ai_core.analyze_transcript(text)
        chart_data = await ai_core.generate_chart_data(analysis)
        
        return {
            "analysis": analysis,
            "chart_data": chart_data
        }
    except Exception as e:
        raise HTTPException(status_code=500, detail=str(e))

if __name__ == "__main__":
    uvicorn.run(app, host="0.0.0.0", port=8000)