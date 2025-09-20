# Financial Analyzer - Custom NLP Logic for Processing Meeting Transcripts
import asyncio
import re
import json
import logging
from typing import Dict, List, Optional, Any
from dataclasses import dataclass

logger = logging.getLogger(__name__)

@dataclass
class Intent:
    name: str
    confidence: float
    entities: Dict[str, Any]

class FinancialAnalyzer:
    """
    Custom NLP analyzer for identifying financial intents and entities
    in meeting transcripts.
    """
    
    def __init__(self):
        self.financial_keywords = {
            "portfolio": ["portfolio", "investments", "holdings", "allocation"],
            "performance": ["returns", "performance", "gains", "losses", "profit"],
            "comparison": ["compare", "versus", "vs", "against", "difference"],
            "stocks": ["stock", "stocks", "shares", "equity", "equities"],
            "timeframe": ["month", "months", "year", "years", "quarter", "quarterly"],
            "companies": ["apple", "microsoft", "google", "amazon", "tesla", "meta"]
        }
        
        self.intent_patterns = {
            "portfolio_overview": [
                r"show.*portfolio",
                r"portfolio.*performance",
                r"current.*holdings",
                r"investment.*overview"
            ],
            "stock_comparison": [
                r"compare.*stocks?",
                r"(.*) vs (.*)",
                r"(.*) versus (.*)",
                r"performance.*between"
            ],
            "historical_performance": [
                r"historical.*performance",
                r"past.*returns",
                r"performance.*over",
                r"(\d+).*month.*performance",
                r"yearly.*returns"
            ],
            "sector_analysis": [
                r"sector.*performance",
                r"industry.*analysis",
                r"tech.*stocks",
                r"financial.*sector"
            ]
        }
        
    async def initialize(self):
        """Initialize the analyzer (load models, etc.)"""
        logger.info("Financial Analyzer initialized")
        
    async def analyze_text(self, text: str) -> Optional[Dict[str, Any]]:
        """
        Analyze text for financial intents and entities
        """
        text_lower = text.lower().strip()
        
        if not text_lower or len(text_lower) < 5:
            return None
            
        # Extract intent
        intent = self._extract_intent(text_lower)
        if not intent:
            return None
            
        # Extract entities
        entities = self._extract_entities(text_lower)
        
        # Determine if visualization is needed
        requires_viz = self._requires_visualization(intent, entities)
        
        if requires_viz:
            return {
                "intent": intent.name,
                "confidence": intent.confidence,
                "entities": entities,
                "requires_visualization": True,
                "original_text": text,
                "visualization_type": self._determine_chart_type(intent, entities)
            }
            
        return None
        
    def _extract_intent(self, text: str) -> Optional[Intent]:
        """Extract the primary intent from the text"""
        best_intent = None
        best_confidence = 0.0
        
        for intent_name, patterns in self.intent_patterns.items():
            for pattern in patterns:
                match = re.search(pattern, text)
                if match:
                    # Simple confidence scoring based on pattern specificity
                    confidence = min(0.9, 0.6 + (len(match.group(0)) / len(text)))
                    
                    if confidence > best_confidence:
                        best_confidence = confidence
                        entities = {}
                        
                        # Extract specific entities based on intent
                        if intent_name == "stock_comparison" and match.groups():
                            entities["companies"] = [g.strip() for g in match.groups() if g]
                            
                        best_intent = Intent(
                            name=intent_name,
                            confidence=confidence,
                            entities=entities
                        )
                        
        return best_intent
        
    def _extract_entities(self, text: str) -> Dict[str, Any]:
        """Extract financial entities from the text"""
        entities = {}
        
        # Extract companies
        companies = []
        for category, keywords in self.financial_keywords.items():
            if category == "companies":
                for keyword in keywords:
                    if keyword in text:
                        companies.append(keyword)
        
        if companies:
            entities["companies"] = companies
            
        # Extract time frames
        time_matches = re.findall(r'(\d+)\s*(month|year|quarter)s?', text)
        if time_matches:
            entities["timeframe"] = {
                "value": int(time_matches[0][0]),
                "unit": time_matches[0][1]
            }
            
        # Extract specific financial metrics
        if any(word in text for word in self.financial_keywords["performance"]):
            entities["metrics"] = ["performance", "returns"]
            
        return entities
        
    def _requires_visualization(self, intent: Intent, entities: Dict) -> bool:
        """Determine if the intent requires a visualization"""
        visualization_intents = [
            "portfolio_overview",
            "stock_comparison", 
            "historical_performance",
            "sector_analysis"
        ]
        
        return (intent.name in visualization_intents and 
                intent.confidence > 0.5 and
                (entities.get("companies") or entities.get("metrics")))
        
    def _determine_chart_type(self, intent: Intent, entities: Dict) -> str:
        """Determine the appropriate chart type for the intent"""
        if intent.name == "stock_comparison":
            return "bar_chart"
        elif intent.name == "historical_performance":
            return "line_chart"
        elif intent.name == "portfolio_overview":
            return "pie_chart"
        elif intent.name == "sector_analysis":
            return "bar_chart"
        else:
            return "line_chart"