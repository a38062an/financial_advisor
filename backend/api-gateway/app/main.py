# API Gateway - Simple Proxy Service
from fastapi import FastAPI, HTTPException, Request
from fastapi.middleware.cors import CORSMiddleware
import httpx
import logging
from typing import Dict, Any
import os
from dotenv import load_dotenv

load_dotenv()

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="InsightAI - API Gateway", version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

# Service URLs
AI_CORE_URL = os.getenv("AI_CORE_URL", "http://localhost:8000")
VISUALIZATION_ENGINE_URL = os.getenv("VISUALIZATION_ENGINE_URL", "http://localhost:8001")

@app.get("/health")
async def health_check():
    """Health check endpoint"""
    return {"status": "healthy", "service": "api-gateway"}

@app.get("/")
async def root():
    """Root endpoint"""
    return {
        "message": "InsightAI API Gateway",
        "version": "1.0.0",
        "services": {
            "ai-core": AI_CORE_URL,
            "visualization-engine": VISUALIZATION_ENGINE_URL
        }
    }

# Proxy routes to AI Core
@app.api_route("/ai/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def proxy_ai_core(path: str, request: Request):
    """Proxy requests to AI Core service"""
    try:
        async with httpx.AsyncClient() as client:
            url = f"{AI_CORE_URL}/{path}"
            
            # Forward the request
            response = await client.request(
                method=request.method,
                url=url,
                headers=dict(request.headers),
                content=await request.body(),
                params=dict(request.query_params)
            )
            
            return response.json() if response.content else {}
            
    except Exception as e:
        logger.error(f"Error proxying to AI Core: {e}")
        raise HTTPException(status_code=500, detail=f"AI Core service error: {str(e)}")

# Proxy routes to Visualization Engine
@app.api_route("/viz/{path:path}", methods=["GET", "POST", "PUT", "DELETE", "PATCH"])
async def proxy_visualization_engine(path: str, request: Request):
    """Proxy requests to Visualization Engine service"""
    try:
        async with httpx.AsyncClient() as client:
            url = f"{VISUALIZATION_ENGINE_URL}/{path}"
            
            # Forward the request
            response = await client.request(
                method=request.method,
                url=url,
                headers=dict(request.headers),
                content=await request.body(),
                params=dict(request.query_params)
            )
            
            return response.json() if response.content else {}
            
    except Exception as e:
        logger.error(f"Error proxying to Visualization Engine: {e}")
        raise HTTPException(status_code=500, detail=f"Visualization Engine service error: {str(e)}")

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8002)