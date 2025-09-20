# AI Core Service - Main FastAPI Application
from fastapi import FastAPI, WebSocket, WebSocketDisconnect
from fastapi.middleware.cors import CORSMiddleware
import asyncio
import json
import logging
from typing import Dict, List, Optional
from pydantic import BaseModel
import os
from dotenv import load_dotenv

from .models.financial_analyzer import FinancialAnalyzer

load_dotenv()

# Configure logging
logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="InsightAI - AI Core Service", version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],  # Configure appropriately for production
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Global state management
active_connections: List[WebSocket] = []
financial_analyzer = FinancialAnalyzer()

class TranscriptMessage(BaseModel):
    text: str
    timestamp: float
    speaker: Optional[str] = None

class VisualizationRequest(BaseModel):
    intent: str
    entities: Dict
    data_requirements: Dict

@app.on_event("startup")
async def startup_event():
    """Initialize the AI Core service"""
    logger.info("AI Core service starting up...")
    await financial_analyzer.initialize()

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "ai-core"}

@app.websocket("/ws/transcript")
async def websocket_transcript_endpoint(websocket: WebSocket):
    """WebSocket endpoint for receiving live transcripts from Deepgram"""
    await websocket.accept()
    active_connections.append(websocket)
    
    try:
        while True:
            # Receive transcript data
            data = await websocket.receive_text()
            transcript_msg = TranscriptMessage.parse_raw(data)
            
            logger.info(f"Received transcript: {transcript_msg.text}")
            
            # Analyze the transcript for financial intents
            analysis_result = await financial_analyzer.analyze_text(transcript_msg.text)
            
            if analysis_result and analysis_result.get("requires_visualization"):
                # Send visualization request to frontend
                await broadcast_visualization_request(analysis_result)
                
    except WebSocketDisconnect:
        active_connections.remove(websocket)
        logger.info("Transcript WebSocket disconnected")

@app.websocket("/ws/advisor")
async def websocket_advisor_endpoint(websocket: WebSocket):
    """WebSocket endpoint for the advisor's frontend interface"""
    await websocket.accept()
    active_connections.append(websocket)
    
    try:
        while True:
            # Keep connection alive and handle any advisor requests
            data = await websocket.receive_text()
            logger.info(f"Received message from advisor: {data}")
            
    except WebSocketDisconnect:
        active_connections.remove(websocket)
        logger.info("Advisor WebSocket disconnected")

async def broadcast_visualization_request(analysis_result: Dict):
    """Broadcast visualization request to all connected clients"""
    if active_connections:
        message = json.dumps({
            "type": "visualization_request",
            "data": analysis_result
        })
        
        # Send to all active connections
        for connection in active_connections[:]:  # Create a copy to avoid modification during iteration
            try:
                await connection.send_text(message)
            except Exception as e:
                logger.error(f"Error sending message to connection: {e}")
                # Remove failed connections
                if connection in active_connections:
                    active_connections.remove(connection)

@app.post("/analyze")
async def analyze_text(message: TranscriptMessage):
    """REST endpoint for analyzing text (alternative to WebSocket)"""
    analysis_result = await financial_analyzer.analyze_text(message.text)
    return analysis_result

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8000)