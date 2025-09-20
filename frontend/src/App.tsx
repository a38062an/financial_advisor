import React, { useState, useEffect } from 'react';
import { useWebSocket } from './hooks/useWebSocket';
import { TranscriptInput } from './components/TranscriptInput';
import { Dashboard } from './components/Dashboard';
import { AnalysisPanel } from './components/AnalysisPanel';
import { ChartData, AnalysisData, WebSocketMessage } from './types';

const WS_URL = process.env.REACT_APP_WS_URL || 'ws://localhost:8000/ws';
const CLIENT_ID = 'client_' + Math.random().toString(36).substr(2, 9);

function App() {
  const [chartData, setChartData] = useState<Record<string, ChartData>>({});
  const [analysisData, setAnalysisData] = useState<AnalysisData | null>(null);
  const [isLoading, setIsLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);

  const { connectionStatus, lastMessage, sendMessage } = useWebSocket(WS_URL, CLIENT_ID);

  // Handle incoming WebSocket messages
  useEffect(() => {
    if (lastMessage) {
      handleWebSocketMessage(lastMessage);
    }
  }, [lastMessage]);

  const handleWebSocketMessage = (message: WebSocketMessage) => {
    console.log('Received message:', message);
    
    switch (message.type) {
      case 'chart_update':
        setIsLoading(false);
        if (message.data) {
          setChartData(message.data);
        }
        if (message.analysis) {
          setAnalysisData(message.analysis);
        }
        setError(null);
        break;
        
      case 'meeting_started':
        console.log('Meeting session started');
        break;
        
      case 'error':
        setIsLoading(false);
        setError(message.message || 'An error occurred');
        break;
        
      default:
        console.log('Unknown message type:', message.type);
    }
  };

  const handleTranscriptSubmit = (transcript: string) => {
    setIsLoading(true);
    setError(null);
    
    const message: WebSocketMessage = {
      type: 'audio_transcript',
      transcript: transcript
    };
    
    sendMessage(message);
  };

  return (
    <div className="min-h-screen bg-gray-100">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-6">
            <div className="flex items-center">
              <div className="flex-shrink-0">
                <h1 className="text-3xl font-bold text-gray-900">Financial Advisor AI</h1>
              </div>
            </div>
            <div className="text-sm text-gray-500">
              Real-time Meeting Analysis & Visualization
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        {/* Error Message */}
        {error && (
          <div className="mb-6 bg-red-100 border border-red-400 text-red-700 px-4 py-3 rounded">
            <strong>Error:</strong> {error}
          </div>
        )}

        {/* Input Section */}
        <div className="mb-8">
          <TranscriptInput 
            onTranscriptSubmit={handleTranscriptSubmit}
            connectionStatus={connectionStatus}
          />
        </div>

        {/* Content Grid */}
        <div className="grid grid-cols-1 lg:grid-cols-3 gap-8">
          {/* Dashboard - Charts */}
          <div className="lg:col-span-2">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Real-time Visualizations</h2>
            <Dashboard chartData={chartData} isLoading={isLoading} />
          </div>

          {/* Analysis Panel */}
          <div className="lg:col-span-1">
            <h2 className="text-2xl font-bold text-gray-900 mb-6">Analysis Insights</h2>
            <AnalysisPanel analysis={analysisData} />
          </div>
        </div>

        {/* Loading Indicator */}
        {isLoading && (
          <div className="fixed inset-0 bg-gray-600 bg-opacity-50 flex items-center justify-center z-50">
            <div className="bg-white rounded-lg p-6 flex items-center space-x-4">
              <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
              <span className="text-gray-700">Analyzing transcript...</span>
            </div>
          </div>
        )}
      </main>

      {/* Footer */}
      <footer className="bg-white border-t mt-16">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-6">
          <div className="text-center text-gray-500 text-sm">
            Financial Advisor AI - Powered by FastAPI, React, and Chart.js
          </div>
        </div>
      </footer>
    </div>
  );
}

export default App;
