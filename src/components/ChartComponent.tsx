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
}

export const ChartComponent: React.FC<ChartComponentProps> = ({
  data,
  type,
  mapping,
  chartConfig,
}) => {
  const { chartData, chartOptions } = useVisualization({
    data,
    type,
    mapping,
    chartConfig,
  });

  if (!chartData || !chartOptions) {
    return <div>Loading chart...</div>;
  }

  const commonProps = {
    options: {
      ...chartOptions,
      responsive: true,
      maintainAspectRatio: true,
      aspectRatio: chartConfig.aspectRatio,
      plugins: {
        legend: {
          position: chartConfig.legendPosition,
          labels: {
            font: {
              size: chartConfig.fontSize,
            },
          },
        },
        title: {
          display: true,
          text: chartConfig.title,
          font: {
            size: chartConfig.fontSize ? chartConfig.fontSize + 4 : 16,
          },
          padding: chartConfig.padding || 20,
        },
      },
      scales: {
        x: {
          grid: {
            display: chartConfig.showGrid,
          },
        },
        y: {
          grid: {
            display: chartConfig.showGrid,
          },
        },
      },
      animation: {
        duration: chartConfig.animation ? 1000 : 0,
      },
      elements: {
        line: {
          tension: chartConfig.tension || 0,
          fill: chartConfig.fill,
          borderWidth: chartConfig.borderWidth,
          borderColor: chartConfig.borderColor,
        },
        point: {
          pointStyle: chartConfig.pointStyle,
          backgroundColor: chartConfig.backgroundColor,
          borderColor: chartConfig.borderColor,
          borderWidth: chartConfig.borderWidth,
        },
      },
    },
    data: {
      ...chartData,
      datasets: chartData.datasets.map(dataset => ({
        ...dataset,
        backgroundColor: chartConfig.backgroundColor,
        borderColor: chartConfig.borderColor,
        borderWidth: chartConfig.borderWidth,
      })),
    },
  };

  switch (type) {
    case 'timeSeries':
      return <Line {...commonProps} />;
    case 'distribution':
      return <Bar {...commonProps} />;
    case 'correlation':
      return <Scatter {...commonProps} />;
    case 'pie':
      return <Pie {...commonProps} />;
    case 'radar':
      return <Radar {...commonProps} />;
    default:
      return <div>Unsupported chart type</div>;
  }
};
