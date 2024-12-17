import React from 'react';
import { Line, Bar, Scatter, Pie, Radar } from 'react-chartjs-2';
import { useVisualization } from '../hooks/useVisualization';
import { VisualizationType } from '../types/visualization';
import { ChartConfiguration } from './ChartCustomization';

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
  console.log('ChartComponent props:', {
    id,
    type,
    dataLength: data?.length,
    mapping,
    chartConfig
  });

  const { chartData, chartOptions, error } = useVisualization({
    data,
    type,
    mapping,
    chartConfig,
  });

  console.log('Visualization results:', {
    hasChartData: !!chartData,
    hasChartOptions: !!chartOptions,
    error
  });

  if (error) {
    console.error('Chart error:', error);
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center bg-red-50 text-red-600 rounded-lg">
        {error}
      </div>
    );
  }

  if (!chartData || !chartOptions) {
    return (
      <div className="w-full min-h-[400px] flex items-center justify-center bg-gray-50 text-gray-500">
        Please configure the chart settings
      </div>
    );
  }

  const defaultConfig: ChartConfiguration = {
    title: '',
    aspectRatio: 2,
    legendPosition: 'top',
    backgroundColor: 'white',
    borderColor: '#000000',
    showGrid: true,
    animation: true,
    tension: 0.4,
    fill: false,
    pointStyle: 'circle',
    borderWidth: 2,
    fontSize: 12,
    padding: 20,
    // Remove the description field if it's not needed
    // description: '',
    data: {},
    description: '',
  };

  const config = { ...defaultConfig, ...chartConfig };

  const getChartComponent = () => {
    switch (type) {
      case 'timeSeries':
        return Line;
      case 'distribution':
        return Bar;
      case 'correlation':
        return Scatter;
      case 'pie':
        return Pie;
      case 'radar':
        return Radar;
      default:
        return Line;
    }
  };

  const ChartType = getChartComponent();

  const commonProps = {
    options: {
      ...chartOptions,
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: config.aspectRatio || 2,
      plugins: {
        legend: {
          position: config.legendPosition,
          labels: {
            font: {
              size: config.fontSize || 14,
              weight: 'normal' as const,
            },
            color: '#1f2937',
            padding: 20,
          },
        },
        title: {
          display: true,
          text: config.title,
          font: {
            size: (config.fontSize || 14) + 4,
            weight: 'bold' as const,
          },
          color: '#1f2937',
          padding: {
            top: 20,
            bottom: 20
          },
        },
      },
      layout: {
        padding: {
          left: 20,
          right: 20,
          top: 20,
          bottom: 20
        }
      },
      scales: type !== 'pie' && type !== 'radar' ? {
        x: {
          grid: {
            display: config.showGrid,
            color: 'rgba(156, 163, 175, 0.2)',
          },
          ticks: {
            font: {
              size: config.fontSize || 14,
              weight: 'normal' as const,
            },
            color: '#4b5563',
            padding: 10,
          },
        },
        y: {
          grid: {
            display: config.showGrid,
            color: 'rgba(156, 163, 175, 0.2)',
          },
          ticks: {
            font: {
              size: config.fontSize || 14,
              weight: 'normal' as const,
            },
            color: '#4b5563',
            padding: 10,
          },
          beginAtZero: true,
        },
      } : undefined,
      animation: {
        duration: config.animation ? 1000 : 0,
      },
    },
    data: {
      ...chartData,
      datasets: chartData.datasets.map(dataset => ({
        ...dataset,
        backgroundColor: config.backgroundColor,
        borderColor: config.borderColor,
        borderWidth: config.borderWidth,
        tension: config.tension,
        fill: config.fill,
        pointStyle: config.pointStyle,
        radius: 5,
        hoverRadius: 7,
      })),
    },
  };

  return (
    <div className="w-full min-h-[400px] p-4 bg-white rounded-lg shadow-sm" data-chart-id={id}>
      <div className="w-full h-full" style={{ minHeight: '400px' }}>
        <ChartType {...commonProps} />
      </div>
    </div>
  );
};
