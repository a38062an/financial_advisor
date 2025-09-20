import React, { useState } from 'react';
import { ChartData, TranscriptMessage } from './types';
import { useWebSocket } from './hooks/useWebSocket';
import ChartDisplay from './components/ChartDisplay';

function App() {
  const [chartData, setChartData] = useState<ChartData | null>(null);
  const [transcriptMessages, setTranscriptMessages] = useState<TranscriptMessage[]>([]);
  
  const { isConnected } = useWebSocket({
    url: 'ws://localhost:8000/ws/advisor',
    onMessage: (data: any) => {
      if (data.type === 'visualization_request') {
        fetchVisualization(data.data);
      } else if (data.type === 'transcript') {
        setTranscriptMessages(prev => [...prev, data.data]);
      }
    }
  });

  const fetchVisualization = async (analysisResult: any) => {
    try {
      const response = await fetch('http://localhost:8001/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chart_type: analysisResult.visualization_type,
          intent: analysisResult.intent,
          entities: analysisResult.entities,
          data_source: 'mock'
        })
      });
      
      if (response.ok) {
        const chartData = await response.json();
        setChartData(chartData);
      }
    } catch (error) {
      console.error('Error fetching visualization:', error);
    }
  };

  const generateDemoChart = async () => {
    try {
      const response = await fetch('http://localhost:8001/generate', {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          chart_type: 'bar_chart',
          intent: 'stock_comparison',
          entities: { companies: ['apple', 'microsoft', 'google'] },
          data_source: 'mock'
        })
      });
      
      if (response.ok) {
        const chartData = await response.json();
        setChartData(chartData);
      }
    } catch (error) {
      console.error('Error generating demo chart:', error);
    }
  };

  return (
    <div className="min-h-screen bg-gray-50">
      {/* Header */}
      <header className="bg-white shadow-sm border-b">
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8">
          <div className="flex justify-between items-center py-4">
            <div className="flex items-center">
              <h1 className="text-2xl font-bold text-gray-900">InsightAI</h1>
              <span className="ml-3 px-3 py-1 bg-blue-100 text-blue-800 text-sm font-medium rounded-full">
                Meeting Agent
              </span>
            </div>
            <div className="flex items-center space-x-2">
              <div className={`w-3 h-3 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
              <span className={`text-sm font-medium ${isConnected ? 'text-green-600' : 'text-red-600'}`}>
                {isConnected ? 'Connected' : 'Disconnected'}
              </span>
            </div>
          </div>
        </div>
      </header>

      {/* Main Content */}
      <main className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-8">
        <div className="grid grid-cols-1 xl:grid-cols-3 gap-6 lg:gap-8">
          
          {/* Chart Display - Takes up 2/3 of the space */}
          <div className="xl:col-span-2">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-6">
                <h2 className="text-lg font-semibold text-gray-900">Live Insights</h2>
                <div className="flex items-center space-x-4">
                  <button
                    onClick={generateDemoChart}
                    className="px-4 py-2 bg-blue-600 text-white text-sm font-medium rounded-md hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-blue-500 focus:ring-offset-2 transition-colors"
                  >
                    Generate Demo Chart
                  </button>
                  <div className="flex items-center space-x-2">
                    <div className="w-2 h-2 bg-green-400 rounded-full animate-pulse"></div>
                    <span className="text-sm text-gray-500">Live</span>
                  </div>
                </div>
              </div>
              
              {chartData ? (
                <div className="w-full">
                  <ChartDisplay chartData={chartData} />
                </div>
              ) : (
                <div className="h-96 bg-gray-50 rounded-lg">
                  <div className="text-center py-8">
                    <div className="mb-4 flex justify-center">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-sm">Waiting for insights...</p>
                  </div>
                </div>
              )}
            </div>
          </div>

          {/* Live Transcript Panel - Takes up 1/3 of the space */}
          <div className="xl:col-span-1">
            <div className="bg-white rounded-lg shadow-sm border p-6">
              <div className="flex items-center justify-between mb-4">
                <h2 className="text-lg font-semibold text-gray-900">Live Transcript</h2>
                <div className="flex items-center space-x-2">
                  <div className={`w-2 h-2 rounded-full ${isConnected ? 'bg-green-400 animate-pulse' : 'bg-red-400'}`}></div>
                  <span className="text-sm text-gray-500">{isConnected ? 'Connected' : 'Disconnected'}</span>
                </div>
              </div>

              <div className="space-y-3 max-h-96 overflow-y-auto">
                {transcriptMessages.length === 0 ? (
                  <div className="text-center py-8">
                    <div className="mb-4 flex justify-center">
                      <svg className="w-6 h-6 text-gray-400" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                        <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M19 11a7 7 0 01-7 7m0 0a7 7 0 01-7-7m7 7v4m0 0H8m4 0h4m-4-8a3 3 0 01-3-3V5a3 3 0 116 0v6a3 3 0 01-3 3z" />
                      </svg>
                    </div>
                    <p className="text-gray-500 text-sm">Waiting for meeting audio...</p>
                  </div>
                ) : (
                  transcriptMessages.map((message, index) => (
                    <div key={index} className="p-3 bg-gray-50 rounded-lg">
                      <div className="flex items-start space-x-3">
                        <div className="flex-shrink-0">
                          <div className="w-8 h-8 bg-blue-100 rounded-full flex items-center justify-center">
                            <span className="text-xs font-medium text-blue-600">
                              {message.speaker ? message.speaker.substring(0, 2).toUpperCase() : 'SP'}
                            </span>
                          </div>
                        </div>
                        <div className="flex-1 min-w-0">
                          <p className="text-sm text-gray-900">{message.text}</p>
                          <p className="text-xs text-gray-500 mt-1">
                            {new Date(message.timestamp).toLocaleTimeString()}
                          </p>
                        </div>
                      </div>
                    </div>
                  ))
                )}
              </div>
            </div>
          </div>
        </div>

        {/* Feature Cards Section */}
        <div className="mt-12 grid grid-cols-1 md:grid-cols-3 gap-6 lg:gap-8">
          <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-blue-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-blue-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M13 10V3L4 14h7v7l9-11h-7z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">Active Listening</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              InsightAI listens to your meeting in real-time and automatically generates relevant charts and insights based on the conversation.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-green-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-green-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">Real-time Visualizations</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Data visualizations appear instantly based on conversation context without interrupting the natural flow of your meeting.
            </p>
          </div>
          
          <div className="bg-white rounded-lg shadow-sm border p-6 hover:shadow-md transition-shadow">
            <div className="flex items-center mb-4">
              <div className="w-8 h-8 bg-purple-100 rounded-lg flex items-center justify-center mr-3">
                <svg className="w-5 h-5 text-purple-600" fill="none" stroke="currentColor" viewBox="0 0 24 24">
                  <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9.663 17h4.673M12 3v1m6.364 1.636l-.707.707M21 12h-1M4 12H3m3.343-5.657l-.707-.707m2.828 9.9a5 5 0 117.072 0l-.548.547A3.374 3.374 0 0014 18.469V19a2 2 0 11-4 0v-.531c0-.895-.356-1.754-.988-2.386l-.548-.547z" />
                </svg>
              </div>
              <h3 className="font-semibold text-gray-900">Smart Analysis</h3>
            </div>
            <p className="text-sm text-gray-600 leading-relaxed">
              Advanced NLP identifies financial intents and entities to provide the most relevant and actionable insights.
            </p>
          </div>
        </div>
      </main>
    </div>
  );
}

export default App;
