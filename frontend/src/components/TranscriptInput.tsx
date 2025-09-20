import React, { useState } from 'react';

interface TranscriptInputProps {
  onTranscriptSubmit: (transcript: string) => void;
  connectionStatus: 'connecting' | 'connected' | 'disconnected';
}

export const TranscriptInput: React.FC<TranscriptInputProps> = ({ onTranscriptSubmit, connectionStatus }) => {
  const [transcript, setTranscript] = useState('');

  const handleSubmit = (e: React.FormEvent) => {
    e.preventDefault();
    if (transcript.trim()) {
      onTranscriptSubmit(transcript);
      setTranscript('');
    }
  };

  const getSampleTranscript = () => {
    return `Q3 revenue increased by 15% to $2.5 million compared to last quarter. 
Our marketing expenses were $300,000 which is within budget. 
The profit margin improved to 22% due to cost optimization initiatives. 
We need to invest $500,000 in new technology for Q4. 
Overall sentiment is positive with strong growth projections for next year.`;
  };

  const handleSampleData = () => {
    const sample = getSampleTranscript();
    setTranscript(sample);
  };

  const getStatusColor = () => {
    switch (connectionStatus) {
      case 'connected':
        return 'text-green-600';
      case 'connecting':
        return 'text-yellow-600';
      case 'disconnected':
        return 'text-red-600';
      default:
        return 'text-gray-600';
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <div className="flex justify-between items-center mb-4">
        <h2 className="text-xl font-semibold text-gray-800">Meeting Transcript Input</h2>
        <div className={`flex items-center space-x-2 ${getStatusColor()}`}>
          <div className={`w-3 h-3 rounded-full ${
            connectionStatus === 'connected' ? 'bg-green-500' :
            connectionStatus === 'connecting' ? 'bg-yellow-500' : 'bg-red-500'
          }`}></div>
          <span className="text-sm font-medium capitalize">{connectionStatus}</span>
        </div>
      </div>
      
      <form onSubmit={handleSubmit} className="space-y-4">
        <div>
          <label htmlFor="transcript" className="block text-sm font-medium text-gray-700 mb-2">
            Enter or paste meeting transcript:
          </label>
          <textarea
            id="transcript"
            value={transcript}
            onChange={(e) => setTranscript(e.target.value)}
            className="w-full px-3 py-2 border border-gray-300 rounded-md shadow-sm focus:outline-none focus:ring-blue-500 focus:border-blue-500"
            rows={6}
            placeholder="Paste your meeting transcript here or use the sample data button below..."
            disabled={connectionStatus !== 'connected'}
          />
        </div>
        
        <div className="flex space-x-3">
          <button
            type="submit"
            disabled={!transcript.trim() || connectionStatus !== 'connected'}
            className="px-4 py-2 bg-blue-600 text-white rounded-md hover:bg-blue-700 disabled:bg-gray-400 disabled:cursor-not-allowed transition-colors"
          >
            Analyze Transcript
          </button>
          
          <button
            type="button"
            onClick={handleSampleData}
            className="px-4 py-2 bg-gray-600 text-white rounded-md hover:bg-gray-700 transition-colors"
          >
            Use Sample Data
          </button>
        </div>
      </form>
      
      <div className="mt-4 text-sm text-gray-600">
        <p>💡 <strong>Tip:</strong> The AI will analyze financial entities, metrics, sentiment, and key topics from your transcript to generate real-time visualizations.</p>
      </div>
    </div>
  );
};