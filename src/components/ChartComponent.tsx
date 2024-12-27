import React from 'react';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  TimeScale,
} from 'chart.js';
import { Line, Bar, Pie, Scatter, Radar, Doughnut, PolarArea } from 'react-chartjs-2';
import { VisualizationType } from '@/hooks/useVisualization';
import { ChartConfiguration } from './ChartCustomization';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  TimeScale
);

interface ChartComponentProps {
  id: string;
  type: VisualizationType;
  data: any[];
  mapping: Record<string, string>;
  chartConfig: ChartConfiguration;
}

export const ChartComponent: React.FC<ChartComponentProps> = ({
  id,
  type,
  data,
  mapping,
  chartConfig
}) => {
  const processData = () => {
    if (!data || data.length === 0) return null;

    switch (type) {
      case 'timeSeries':
      case 'line': {
        const sortedData = [...data].sort((a, b) => 
          new Date(a[mapping.dateColumn]).getTime() - new Date(b[mapping.dateColumn]).getTime()
        );
        
        return {
          labels: sortedData.map(item => new Date(item[mapping.dateColumn])),
          datasets: [{
            label: mapping.valueColumn,
            data: sortedData.map(item => item[mapping.valueColumn]),
            borderColor: chartConfig.borderColor,
            backgroundColor: chartConfig.backgroundColor,
            tension: chartConfig.tension,
            fill: chartConfig.fill
          }]
        };
      }

      case 'bar': {
        const aggregatedData = data.reduce((acc, item) => {
          const category = item[mapping.categoryColumn];
          if (!acc[category]) {
            acc[category] = 0;
          }
          acc[category] += Number(item[mapping.valueColumn]) || 0;
          return acc;
        }, {});

        return {
          labels: Object.keys(aggregatedData),
          datasets: [{
            label: mapping.valueColumn,
            data: Object.values(aggregatedData),
            backgroundColor: chartConfig.backgroundColor,
            borderColor: chartConfig.borderColor,
            borderWidth: chartConfig.borderWidth
          }]
        };
      }

      case 'pie':
      case 'doughnut':
      case 'polarArea': {
        const aggregatedData = data.reduce((acc, item) => {
          const category = item[mapping.categoryColumn];
          if (!acc[category]) {
            acc[category] = 0;
          }
          acc[category] += Number(item[mapping.valueColumn]) || 1;
          return acc;
        }, {});

        return {
          labels: Object.keys(aggregatedData),
          datasets: [{
            data: Object.values(aggregatedData),
            backgroundColor: [
              'rgba(99, 102, 241, 0.5)',
              'rgba(168, 85, 247, 0.5)',
              'rgba(236, 72, 153, 0.5)',
              'rgba(59, 130, 246, 0.5)',
              'rgba(16, 185, 129, 0.5)'
            ],
            borderColor: [
              'rgb(99, 102, 241)',
              'rgb(168, 85, 247)',
              'rgb(236, 72, 153)',
              'rgb(59, 130, 246)',
              'rgb(16, 185, 129)'
            ],
            borderWidth: 1
          }]
        };
      }

      case 'scatter': {
        return {
          datasets: [{
            label: 'Data Points',
            data: data.map(item => ({
              x: item[mapping.xColumn],
              y: item[mapping.yColumn]
            })),
            backgroundColor: chartConfig.backgroundColor,
            borderColor: chartConfig.borderColor,
            pointRadius: 6,
            pointHoverRadius: 8
          }]
        };
      }

      case 'radar': {
        const metrics = mapping.metrics?.split(',') || [];
        const categories = [...new Set(data.map(item => item[mapping.categoryColumn]))];
        
        const processedData = categories.map(category => {
          const categoryData = data.filter(item => item[mapping.categoryColumn] === category);
          return metrics.map(metric => {
            const values = categoryData.map(item => Number(item[metric]) || 0);
            return values.reduce((a, b) => a + b, 0) / values.length;
          });
        });

        return {
          labels: metrics,
          datasets: categories.map((category, index) => ({
            label: category,
            data: processedData[index],
            backgroundColor: `rgba(99, 102, 241, ${0.2 + index * 0.1})`,
            borderColor: `rgba(99, 102, 241, ${0.8 + index * 0.1})`,
            borderWidth: 1
          }))
        };
      }

      default:
        return null;
    }
  };

  const chartData = processData();
  if (!chartData) return null;

  const commonOptions = {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: chartConfig.aspectRatio,
    animation: false,
    plugins: {
      legend: {
        position: chartConfig.legendPosition,
        display: true
      },
      title: {
        display: true,
        text: chartConfig.title,
        font: {
          size: chartConfig.fontSize
        },
        padding: chartConfig.padding
      }
    }
  };

  const renderChart = () => {
    switch (type) {
      case 'timeSeries':
      case 'line':
        return <Line data={chartData} options={{
          ...commonOptions,
          scales: {
            x: {
              type: 'time',
              time: {
                unit: 'day'
              }
            },
            y: {
              beginAtZero: true
            }
          }
        }} />;

      case 'bar':
        return <Bar data={chartData} options={commonOptions} />;

      case 'pie':
        return <Pie data={chartData} options={commonOptions} />;

      case 'doughnut':
        return <Doughnut data={chartData} options={commonOptions} />;

      case 'polarArea':
        return <PolarArea data={chartData} options={commonOptions} />;

      case 'scatter':
        return <Scatter data={chartData} options={{
          ...commonOptions,
          scales: {
            x: {
              type: 'linear',
              position: 'bottom'
            }
          }
        }} />;

      case 'radar':
        return <Radar data={chartData} options={commonOptions} />;

      default:
        return null;
    }
  };

  return (
    <div className="w-full h-full flex items-center justify-center">
      <div style={{ width: '100%', height: '100%', position: 'relative' }}>
        {renderChart()}
      </div>
    </div>
  );
};
