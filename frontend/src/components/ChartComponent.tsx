import React from 'react';
import { Chart as ChartJS, CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement } from 'chart.js';
import { Bar, Pie, Doughnut } from 'react-chartjs-2';
import { ChartData } from '../types';

ChartJS.register(CategoryScale, LinearScale, BarElement, Title, Tooltip, Legend, ArcElement);

interface ChartComponentProps {
  chartData: ChartData;
  title?: string;
}

export const ChartComponent: React.FC<ChartComponentProps> = ({ chartData, title }) => {
  const renderChart = () => {
    const { type, data, options } = chartData;

    switch (type) {
      case 'bar':
      case 'horizontalBar':
        return <Bar data={data} options={options} />;
      case 'pie':
        return <Pie data={data} options={options} />;
      case 'doughnut':
        return <Doughnut data={data} options={options} />;
      default:
        return <div className="text-gray-500">Unsupported chart type: {type}</div>;
    }
  };

  return (
    <div className="bg-white rounded-lg shadow-md p-6">
      {title && (
        <h3 className="text-lg font-semibold text-gray-800 mb-4">{title}</h3>
      )}
      <div className="w-full h-64">
        {renderChart()}
      </div>
    </div>
  );
};