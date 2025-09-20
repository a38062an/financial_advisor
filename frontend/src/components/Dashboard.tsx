import React from 'react';
import { ChartData } from '../types';
import { ChartComponent } from './ChartComponent';

interface DashboardProps {
  chartData: Record<string, ChartData>;
  isLoading?: boolean;
}

export const Dashboard: React.FC<DashboardProps> = ({ chartData, isLoading }) => {
  const chartEntries = Object.entries(chartData);

  if (isLoading) {
    return (
      <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
        {[1, 2, 3, 4].map((i) => (
          <div key={i} className="bg-white rounded-lg shadow-md p-6 animate-pulse">
            <div className="h-4 bg-gray-200 rounded w-1/2 mb-4"></div>
            <div className="h-64 bg-gray-200 rounded"></div>
          </div>
        ))}
      </div>
    );
  }

  if (chartEntries.length === 0) {
    return (
      <div className="bg-white rounded-lg shadow-md p-6 text-center">
        <div className="text-gray-600">
          <svg className="mx-auto h-16 w-16 text-gray-400 mb-4" fill="none" viewBox="0 0 24 24" stroke="currentColor">
            <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M9 19v-6a2 2 0 00-2-2H5a2 2 0 00-2 2v6a2 2 0 002 2h2a2 2 0 002-2zm0 0V9a2 2 0 012-2h2a2 2 0 012 2v10m-6 0a2 2 0 002 2h2a2 2 0 002-2m0 0V5a2 2 0 012-2h2a2 2 0 012 2v14a2 2 0 01-2 2h-2a2 2 0 01-2-2z" />
          </svg>
          <h3 className="text-lg font-medium text-gray-900 mb-2">No Visualizations Yet</h3>
          <p className="text-gray-500">Submit a meeting transcript to see real-time financial analysis and visualizations.</p>
        </div>
      </div>
    );
  }

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
      {chartEntries.map(([key, chart]) => (
        <ChartComponent
          key={key}
          chartData={chart}
          title={getChartTitle(key)}
        />
      ))}
    </div>
  );
};

const getChartTitle = (key: string): string => {
  const titles: Record<string, string> = {
    entity_distribution: 'Financial Entity Distribution',
    financial_metrics: 'Key Financial Metrics',
    sentiment: 'Meeting Sentiment Analysis',
    topics: 'Discussion Topics'
  };
  
  return titles[key] || key.replace(/_/g, ' ').replace(/\b\w/g, l => l.toUpperCase());
};