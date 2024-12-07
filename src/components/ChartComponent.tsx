import React from 'react';
import { Line, Bar, Scatter, Pie, Radar } from 'react-chartjs-2';
import { useVisualization } from '../hooks/useVisualization';
import { VisualizationType } from '../types/visualization';
import { ChartConfiguration } from './ChartCustomization';

interface ChartComponentProps {
  data: any[];
  type: VisualizationType;
  mapping: Record<string, string>;
  chartConfig: ChartConfiguration;
  id: string; 
}

export const ChartComponent: React.FC<ChartComponentProps> = ({
  data,
  type,
  mapping,
  chartConfig,
  id, 
}) => {
  const { chartData, chartOptions } = useVisualization({
    data,
    type,
    mapping,
    chartConfig,
  });

  const defaultConfig: ChartConfiguration = {
    title: '',
    aspectRatio: 2,
    legendPosition: 'top',
    backgroundColor: '#ffffff',
    borderColor: '#2563eb',
    showGrid: true,
    animation: true,
    tension: 0.4,
    fill: false,
    pointStyle: 'circle',
    borderWidth: 2,
    fontSize: 12,
    padding: 20
  };

  const config = { ...defaultConfig, ...chartConfig };

  if (!chartData || !chartOptions) {
    return <div>Loading chart...</div>;
  }

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
              weight: 'bold',
            },
            padding: 20,
          },
        },
        title: {
          display: true,
          text: config.title,
          font: {
            size: (config.fontSize || 14) + 4,
            weight: 'bold',
          },
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
          },
          ticks: {
            font: {
              size: config.fontSize || 14,
            },
            padding: 10,
          },
        },
        y: {
          grid: {
            display: config.showGrid,
          },
          ticks: {
            font: {
              size: config.fontSize || 14,
            },
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
