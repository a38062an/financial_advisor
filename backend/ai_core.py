import json
import re
import asyncio
from typing import Dict, List, Any, Optional
import plotly.graph_objects as go
import plotly.utils
import pandas as pd
import logging

logger = logging.getLogger(__name__)

class AICore:
    """AI Core for analyzing financial meeting transcripts and generating visualizations"""
    
    def __init__(self):
        # Financial keywords and patterns
        self.financial_keywords = {
            'revenue': ['revenue', 'sales', 'income', 'earnings'],
            'expenses': ['expenses', 'costs', 'spending', 'expenditure'],
            'profit': ['profit', 'margin', 'net income'],
            'growth': ['growth', 'increase', 'rise', 'uptick'],
            'decline': ['decline', 'decrease', 'drop', 'fall'],
            'budget': ['budget', 'allocation', 'funding'],
            'investment': ['investment', 'invest', 'capital', 'funding'],
            'forecast': ['forecast', 'projection', 'predict', 'estimate']
        }
        
        # Number pattern for extracting financial figures
        self.number_pattern = re.compile(r'[\$]?([0-9,]+(?:\.[0-9]{2})?)\s*(?:million|billion|thousand|k|m|b)?', re.IGNORECASE)
        
    async def analyze_transcript(self, transcript: str) -> Dict[str, Any]:
        """Analyze transcript and extract financial entities and metrics"""
        try:
            analysis = {
                'entities': self._extract_entities(transcript),
                'financial_metrics': self._extract_financial_metrics(transcript),
                'sentiment': self._analyze_sentiment(transcript),
                'key_topics': self._extract_key_topics(transcript),
                'action_items': self._extract_action_items(transcript)
            }
            
            logger.info(f"Analysis completed: {len(analysis['entities'])} entities found")
            return analysis
            
        except Exception as e:
            logger.error(f"Error in transcript analysis: {e}")
            return {"error": str(e)}
    
    def _extract_entities(self, transcript: str) -> List[Dict[str, Any]]:
        """Extract financial entities from transcript"""
        entities = []
        text_lower = transcript.lower()
        
        for category, keywords in self.financial_keywords.items():
            for keyword in keywords:
                if keyword in text_lower:
                    # Find context around the keyword
                    sentences = transcript.split('.')
                    for sentence in sentences:
                        if keyword in sentence.lower():
                            entities.append({
                                'category': category,
                                'keyword': keyword,
                                'context': sentence.strip(),
                                'confidence': 0.8  # Simple confidence score
                            })
        
        return entities
    
    def _extract_financial_metrics(self, transcript: str) -> List[Dict[str, Any]]:
        """Extract numerical financial metrics"""
        metrics = []
        
        # Find all numbers with potential financial context
        matches = self.number_pattern.finditer(transcript)
        
        for match in matches:
            number_str = match.group(1).replace(',', '')
            try:
                value = float(number_str)
                
                # Get context around the number
                start = max(0, match.start() - 50)
                end = min(len(transcript), match.end() + 50)
                context = transcript[start:end]
                
                metrics.append({
                    'value': value,
                    'raw_text': match.group(0),
                    'context': context.strip(),
                    'position': match.start()
                })
            except ValueError:
                continue
                
        return metrics
    
    def _analyze_sentiment(self, transcript: str) -> str:
        """Simple sentiment analysis"""
        positive_words = ['growth', 'profit', 'success', 'increase', 'positive', 'good', 'excellent', 'strong']
        negative_words = ['decline', 'loss', 'decrease', 'negative', 'poor', 'weak', 'concern', 'problem']
        
        text_lower = transcript.lower()
        
        positive_count = sum(1 for word in positive_words if word in text_lower)
        negative_count = sum(1 for word in negative_words if word in text_lower)
        
        if positive_count > negative_count:
            return 'positive'
        elif negative_count > positive_count:
            return 'negative'
        else:
            return 'neutral'
    
    def _extract_key_topics(self, transcript: str) -> List[str]:
        """Extract key financial topics discussed"""
        topics = []
        text_lower = transcript.lower()
        
        topic_keywords = {
            'quarterly_results': ['quarterly', 'q1', 'q2', 'q3', 'q4', 'quarter'],
            'annual_performance': ['annual', 'yearly', 'year-over-year'],
            'budget_planning': ['budget', 'planning', 'allocation'],
            'market_analysis': ['market', 'competition', 'industry'],
            'investment_strategy': ['investment', 'strategy', 'portfolio'],
            'risk_management': ['risk', 'hedge', 'mitigation']
        }
        
        for topic, keywords in topic_keywords.items():
            if any(keyword in text_lower for keyword in keywords):
                topics.append(topic.replace('_', ' ').title())
        
        return topics
    
    def _extract_action_items(self, transcript: str) -> List[str]:
        """Extract potential action items from transcript"""
        action_patterns = [
            r'need to\s+([^.]+)',
            r'should\s+([^.]+)',
            r'will\s+([^.]+)',
            r'action.*?:\s*([^.]+)',
            r'follow.up.*?:\s*([^.]+)'
        ]
        
        action_items = []
        for pattern in action_patterns:
            matches = re.finditer(pattern, transcript, re.IGNORECASE)
            for match in matches:
                action_items.append(match.group(1).strip())
        
        return action_items[:5]  # Limit to top 5 action items
    
    async def generate_chart_data(self, analysis: Dict[str, Any]) -> Dict[str, Any]:
        """Generate chart data from analysis results"""
        try:
            chart_data = {}
            
            # Generate entity distribution chart
            if analysis.get('entities'):
                chart_data['entity_distribution'] = self._create_entity_distribution_chart(analysis['entities'])
            
            # Generate financial metrics chart
            if analysis.get('financial_metrics'):
                chart_data['financial_metrics'] = self._create_financial_metrics_chart(analysis['financial_metrics'])
            
            # Generate sentiment chart
            if analysis.get('sentiment'):
                chart_data['sentiment'] = self._create_sentiment_chart(analysis['sentiment'])
            
            # Generate topics chart
            if analysis.get('key_topics'):
                chart_data['topics'] = self._create_topics_chart(analysis['key_topics'])
            
            return chart_data
            
        except Exception as e:
            logger.error(f"Error generating chart data: {e}")
            return {"error": str(e)}
    
    def _create_entity_distribution_chart(self, entities: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Create pie chart for entity distribution"""
        categories = {}
        for entity in entities:
            category = entity['category']
            categories[category] = categories.get(category, 0) + 1
        
        return {
            'type': 'pie',
            'data': {
                'labels': list(categories.keys()),
                'datasets': [{
                    'data': list(categories.values()),
                    'backgroundColor': [
                        '#FF6384', '#36A2EB', '#FFCE56', '#4BC0C0', 
                        '#9966FF', '#FF9F40', '#FF6384', '#C9CBCF'
                    ]
                }]
            },
            'options': {
                'responsive': True,
                'plugins': {
                    'title': {
                        'display': True,
                        'text': 'Financial Entity Distribution'
                    }
                }
            }
        }
    
    def _create_financial_metrics_chart(self, metrics: List[Dict[str, Any]]) -> Dict[str, Any]:
        """Create bar chart for financial metrics"""
        if not metrics:
            return {}
        
        # Sort metrics by value
        sorted_metrics = sorted(metrics, key=lambda x: x['value'], reverse=True)[:10]
        
        return {
            'type': 'bar',
            'data': {
                'labels': [f"Metric {i+1}" for i in range(len(sorted_metrics))],
                'datasets': [{
                    'label': 'Financial Values',
                    'data': [metric['value'] for metric in sorted_metrics],
                    'backgroundColor': '#36A2EB',
                    'borderColor': '#36A2EB',
                    'borderWidth': 1
                }]
            },
            'options': {
                'responsive': True,
                'plugins': {
                    'title': {
                        'display': True,
                        'text': 'Key Financial Metrics'
                    }
                },
                'scales': {
                    'y': {
                        'beginAtZero': True
                    }
                }
            }
        }
    
    def _create_sentiment_chart(self, sentiment: str) -> Dict[str, Any]:
        """Create sentiment indicator"""
        sentiment_values = {'positive': 1, 'neutral': 0, 'negative': -1}
        value = sentiment_values.get(sentiment, 0)
        
        return {
            'type': 'doughnut',
            'data': {
                'labels': ['Positive', 'Neutral', 'Negative'],
                'datasets': [{
                    'data': [
                        100 if sentiment == 'positive' else 0,
                        100 if sentiment == 'neutral' else 0,
                        100 if sentiment == 'negative' else 0
                    ],
                    'backgroundColor': ['#4BC0C0', '#FFCE56', '#FF6384']
                }]
            },
            'options': {
                'responsive': True,
                'plugins': {
                    'title': {
                        'display': True,
                        'text': f'Meeting Sentiment: {sentiment.title()}'
                    }
                }
            }
        }
    
    def _create_topics_chart(self, topics: List[str]) -> Dict[str, Any]:
        """Create horizontal bar chart for topics"""
        return {
            'type': 'horizontalBar',
            'data': {
                'labels': topics,
                'datasets': [{
                    'label': 'Topic Mentions',
                    'data': [1] * len(topics),  # Simple count for now
                    'backgroundColor': '#9966FF'
                }]
            },
            'options': {
                'responsive': True,
                'plugins': {
                    'title': {
                        'display': True,
                        'text': 'Key Discussion Topics'
                    }
                },
                'scales': {
                    'x': {
                        'beginAtZero': True
                    }
                }
            }
        }