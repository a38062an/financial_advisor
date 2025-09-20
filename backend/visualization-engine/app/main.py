# Visualization Engine - Plotly Chart Generation Service
from fastapi import FastAPI, HTTPException
from fastapi.middleware.cors import CORSMiddleware
import plotly.graph_objects as go
import plotly.express as px
import json
import logging
from typing import Dict, List, Any, Optional
from pydantic import BaseModel
import pandas as pd
import random
from datetime import datetime, timedelta

logging.basicConfig(level=logging.INFO)
logger = logging.getLogger(__name__)

app = FastAPI(title="InsightAI - Visualization Engine", version="1.0.0")

# CORS configuration
app.add_middleware(
    CORSMiddleware,
    allow_origins=["*"],
    allow_credentials=True,
    allow_methods=["*"],
    allow_headers=["*"],
)

class ChartRequest(BaseModel):
    chart_type: str
    intent: str
    entities: Dict[str, Any]
    data_source: Optional[str] = "mock"

class ChartResponse(BaseModel):
    chart_config: Dict
    data: Dict
    chart_type: str
    title: str

# Mock data for demo purposes
MOCK_STOCK_DATA = {
    "apple": {"symbol": "AAPL", "price": 175.43, "change": 2.1},
    "microsoft": {"symbol": "MSFT", "price": 378.85, "change": -1.2},
    "google": {"symbol": "GOOGL", "price": 138.21, "change": 0.8},
    "amazon": {"symbol": "AMZN", "price": 145.86, "change": 1.5},
    "tesla": {"symbol": "TSLA", "price": 248.50, "change": -3.2},
    "meta": {"symbol": "META", "price": 325.18, "change": 2.8}
}

@app.get("/health")
async def health_check():
    return {"status": "healthy", "service": "visualization-engine"}

@app.post("/generate", response_model=ChartResponse)
async def generate_chart(request: ChartRequest):
    """Generate a chart based on the request parameters"""
    
    try:
        chart_config = None
        data = {}
        title = ""
        
        if request.chart_type == "bar_chart" and request.intent == "stock_comparison":
            chart_config, data, title = generate_stock_comparison_chart(request.entities)
            
        elif request.chart_type == "line_chart" and request.intent == "historical_performance":
            chart_config, data, title = generate_historical_performance_chart(request.entities)
            
        elif request.chart_type == "pie_chart" and request.intent == "portfolio_overview":
            chart_config, data, title = generate_portfolio_overview_chart(request.entities)
            
        else:
            # Default fallback chart
            chart_config, data, title = generate_default_chart()
            
        return ChartResponse(
            chart_config=chart_config,
            data=data,
            chart_type=request.chart_type,
            title=title
        )
        
    except Exception as e:
        logger.error(f"Error generating chart: {e}")
        raise HTTPException(status_code=500, detail=f"Chart generation failed: {str(e)}")

def generate_stock_comparison_chart(entities: Dict) -> tuple:
    """Generate a bar chart for stock comparison"""
    companies = entities.get("companies", ["apple", "microsoft", "google"])
    
    labels = []
    prices = []
    changes = []
    
    for company in companies:
        if company.lower() in MOCK_STOCK_DATA:
            stock_info = MOCK_STOCK_DATA[company.lower()]
            labels.append(stock_info["symbol"])
            prices.append(stock_info["price"])
            changes.append(stock_info["change"])
    
    # Chart.js configuration
    chart_config = {
        "type": "bar",
        "data": {
            "labels": labels,
            "datasets": [{
                "label": "Stock Price ($)",
                "data": prices,
                "backgroundColor": [
                    "rgba(59, 130, 246, 0.8)",
                    "rgba(16, 185, 129, 0.8)", 
                    "rgba(245, 158, 11, 0.8)",
                    "rgba(239, 68, 68, 0.8)",
                    "rgba(139, 92, 246, 0.8)"
                ],
                "borderColor": [
                    "rgb(59, 130, 246)",
                    "rgb(16, 185, 129)",
                    "rgb(245, 158, 11)",
                    "rgb(239, 68, 68)",
                    "rgb(139, 92, 246)"
                ],
                "borderWidth": 1
            }]
        },
        "options": {
            "responsive": True,
            "plugins": {
                "legend": {
                    "display": True,
                    "position": "top"
                }
            },
            "scales": {
                "y": {
                    "beginAtZero": False,
                    "title": {
                        "display": True,
                        "text": "Price ($)"
                    }
                }
            }
        }
    }
    
    data = {
        "prices": prices,
        "changes": changes,
        "symbols": labels
    }
    
    title = f"Stock Price Comparison: {', '.join(labels)}"
    
    return chart_config, data, title

def generate_historical_performance_chart(entities: Dict) -> tuple:
    """Generate a line chart for historical performance"""
    companies = entities.get("companies", ["apple"])
    timeframe = entities.get("timeframe", {"value": 6, "unit": "month"})
    
    # Generate mock historical data
    end_date = datetime.now()
    start_date = end_date - timedelta(days=timeframe["value"] * 30)
    
    dates = []
    current_date = start_date
    while current_date <= end_date:
        dates.append(current_date.strftime("%Y-%m-%d"))
        current_date += timedelta(days=7)  # Weekly data points
    
    datasets = []
    colors = ["rgb(59, 130, 246)", "rgb(16, 185, 129)", "rgb(245, 158, 11)"]
    
    for i, company in enumerate(companies[:3]):  # Limit to 3 companies
        if company.lower() in MOCK_STOCK_DATA:
            base_price = MOCK_STOCK_DATA[company.lower()]["price"]
            # Generate realistic price movement
            prices = []
            current_price = base_price * 0.9  # Start 10% lower
            
            for _ in dates:
                # Add some realistic volatility
                change_percent = random.uniform(-0.05, 0.05)  # ±5% change
                current_price *= (1 + change_percent)
                prices.append(round(current_price, 2))
            
            datasets.append({
                "label": MOCK_STOCK_DATA[company.lower()]["symbol"],
                "data": prices,
                "borderColor": colors[i % len(colors)],
                "backgroundColor": colors[i % len(colors)] + "20",  # Add transparency
                "tension": 0.1
            })
    
    chart_config = {
        "type": "line",
        "data": {
            "labels": dates,
            "datasets": datasets
        },
        "options": {
            "responsive": True,
            "plugins": {
                "legend": {
                    "display": True,
                    "position": "top"
                }
            },
            "scales": {
                "x": {
                    "title": {
                        "display": True,
                        "text": "Date"
                    }
                },
                "y": {
                    "title": {
                        "display": True,
                        "text": "Price ($)"
                    }
                }
            }
        }
    }
    
    data = {"dates": dates, "datasets": datasets}
    title = f"Historical Performance - {timeframe['value']} {timeframe['unit']}(s)"
    
    return chart_config, data, title

def generate_portfolio_overview_chart(entities: Dict) -> tuple:
    """Generate a pie chart for portfolio overview"""
    # Mock portfolio allocation
    portfolio_data = {
        "Technology": 35,
        "Healthcare": 20,
        "Financial": 15,
        "Consumer Goods": 12,
        "Energy": 10,
        "Other": 8
    }
    
    chart_config = {
        "type": "pie",
        "data": {
            "labels": list(portfolio_data.keys()),
            "datasets": [{
                "data": list(portfolio_data.values()),
                "backgroundColor": [
                    "rgb(59, 130, 246)",
                    "rgb(16, 185, 129)",
                    "rgb(245, 158, 11)",
                    "rgb(239, 68, 68)",
                    "rgb(139, 92, 246)",
                    "rgb(107, 114, 128)"
                ]
            }]
        },
        "options": {
            "responsive": True,
            "plugins": {
                "legend": {
                    "display": True,
                    "position": "right"
                }
            }
        }
    }
    
    data = portfolio_data
    title = "Portfolio Allocation by Sector"
    
    return chart_config, data, title

def generate_default_chart() -> tuple:
    """Generate a default chart when no specific intent is matched"""
    chart_config = {
        "type": "bar",
        "data": {
            "labels": ["Q1", "Q2", "Q3", "Q4"],
            "datasets": [{
                "label": "Portfolio Performance",
                "data": [12, 19, 3, 5],
                "backgroundColor": "rgba(59, 130, 246, 0.8)"
            }]
        }
    }
    
    data = {"quarterly": [12, 19, 3, 5]}
    title = "Default Chart"
    
    return chart_config, data, title

if __name__ == "__main__":
    import uvicorn
    uvicorn.run(app, host="0.0.0.0", port=8001)