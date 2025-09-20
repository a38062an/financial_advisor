import React from 'react';
import { AnalysisData } from '../types';

interface AnalysisPanelProps {
  analysis: AnalysisData | null;
}

export const AnalysisPanel: React.FC<AnalysisPanelProps> = ({ analysis }) => {
  if (!analysis) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6">
        <h2 className="text-xl font-semibold text-gray-800 mb-4">Analysis Results</h2>
        <p className="text-gray-600">No analysis data available. Submit a transcript to see results.</p>
      </div>
    );
  }

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      <h2 className="text-xl font-semibold text-gray-800 mb-6">Analysis Results</h2>
      
      <div className="space-y-6">
        {/* Sentiment */}
        <div>
          <h3 className="text-lg font-medium text-gray-700 mb-2">Overall Sentiment</h3>
          <div className={`inline-flex items-center px-3 py-1 rounded-full text-sm font-medium ${
            analysis.sentiment === 'positive' ? 'bg-green-100 text-green-800' :
            analysis.sentiment === 'negative' ? 'bg-red-100 text-red-800' :
            'bg-yellow-100 text-yellow-800'
          }`}>
            {analysis.sentiment.charAt(0).toUpperCase() + analysis.sentiment.slice(1)}
          </div>
        </div>

        {/* Key Topics */}
        {analysis.key_topics && analysis.key_topics.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Key Topics</h3>
            <div className="flex flex-wrap gap-2">
              {analysis.key_topics.map((topic, index) => (
                <span
                  key={index}
                  className="px-3 py-1 bg-blue-100 text-blue-800 rounded-full text-sm"
                >
                  {topic}
                </span>
              ))}
            </div>
          </div>
        )}

        {/* Financial Entities */}
        {analysis.entities && analysis.entities.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Financial Entities</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {analysis.entities.slice(0, 10).map((entity, index) => (
                <div key={index} className="bg-gray-50 rounded p-3">
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-gray-800 capitalize">{entity.category}</span>
                    <span className="text-xs text-gray-500">{Math.round(entity.confidence * 100)}%</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{entity.context}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Financial Metrics */}
        {analysis.financial_metrics && analysis.financial_metrics.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Financial Metrics</h3>
            <div className="space-y-2 max-h-48 overflow-y-auto">
              {analysis.financial_metrics.slice(0, 5).map((metric, index) => (
                <div key={index} className="bg-gray-50 rounded p-3">
                  <div className="flex justify-between items-start">
                    <span className="font-medium text-gray-800">{metric.raw_text}</span>
                    <span className="text-sm text-gray-600">${metric.value.toLocaleString()}</span>
                  </div>
                  <p className="text-sm text-gray-600 mt-1">{metric.context}</p>
                </div>
              ))}
            </div>
          </div>
        )}

        {/* Action Items */}
        {analysis.action_items && analysis.action_items.length > 0 && (
          <div>
            <h3 className="text-lg font-medium text-gray-700 mb-2">Action Items</h3>
            <ul className="space-y-2">
              {analysis.action_items.map((item, index) => (
                <li key={index} className="flex items-start space-x-2">
                  <span className="text-blue-600 mt-1">•</span>
                  <span className="text-gray-700">{item}</span>
                </li>
              ))}
            </ul>
          </div>
        )}
      </div>
    </div>
  );
};