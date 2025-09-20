import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend,
} from 'chart.js';
import { Bar, Line, Pie } from 'react-chartjs-2';
import { ChartData } from '../types';

// Register Chart.js components
ChartJS.register(
  CategoryScale,
  LinearScale,
  BarElement,
  LineElement,
  PointElement,
  ArcElement,
  Title,
  Tooltip,
  Legend
);

interface ChartDisplayProps {
  chartData: ChartData;
}

const ChartDisplay: React.FC<ChartDisplayProps> = ({ chartData }) => {
  const { chart_config, title } = chartData;

  const renderChart = () => {
    // Ensure legend position is properly typed
    const options = {
      ...chart_config.options,
      responsive: true,
      maintainAspectRatio: false,
      plugins: {
        ...chart_config.options.plugins,
        legend: {
          ...chart_config.options.plugins?.legend,
          position: (chart_config.options.plugins?.legend?.position as any) || 'top'
        }
      }
    };

    const chartProps = {
      data: chart_config.data,
      options
    };

    switch (chart_config.type) {
      case 'bar':
        return <Bar {...chartProps as any} />;
      case 'line':
        return <Line {...chartProps as any} />;
      case 'pie':
        return <Pie {...chartProps as any} />;
      default:
        return <Bar {...chartProps as any} />;
    }
  };

  return (
    <div className="w-full">
      <div className="mb-4">
        <h3 className="text-xl font-semibold text-gray-900">{title}</h3>
        <p className="text-sm text-gray-500 mt-1">
          Generated automatically from meeting conversation
        </p>
      </div>
      
      <div className="h-96 w-full">
        {renderChart()}
      </div>
      
      <div className="mt-4 flex items-center justify-between text-sm text-gray-500">
        <span>Chart Type: {chart_config.type}</span>
        <span>Last Updated: {new Date().toLocaleTimeString()}</span>
      </div>
    </div>
  );
};

export default ChartDisplay;