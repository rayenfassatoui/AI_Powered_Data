import { useState } from 'react';

export type VisualizationType = 
  | "line"
  | "bar"
  | "pie"
  | "scatter"
  | "radar"
  | "timeSeries"
  | "area"
  | "doughnut"
  | "polarArea"
  | "bubble";

export interface ChartData {
  labels: string[];
  datasets: Array<{
    label: string;
    data: any[];
    backgroundColor?: string | string[];
    borderColor?: string | string[];
    fill?: boolean;
    tension?: number;
  }>;
}

export interface ChartOptions {
  responsive?: boolean;
  maintainAspectRatio?: boolean;
  scales?: {
    x?: {
      type?: string;
      time?: {
        unit?: string;
      };
      title?: {
        display?: boolean;
        text?: string;
      };
    };
    y?: {
      beginAtZero?: boolean;
      title?: {
        display?: boolean;
        text?: string;
      };
    };
  };
  plugins?: {
    legend?: {
      position?: 'top' | 'bottom' | 'left' | 'right';
      display?: boolean;
    };
    title?: {
      display?: boolean;
      text?: string;
    };
  };
}

export const useVisualization = () => {
  const [chartType, setChartType] = useState<VisualizationType>("bar");
  const [chartData, setChartData] = useState<ChartData>({
    labels: [],
    datasets: []
  });
  const [chartOptions, setChartOptions] = useState<ChartOptions>({
    responsive: true,
    maintainAspectRatio: true,
    plugins: {
      legend: {
        position: 'bottom',
        display: true
      }
    }
  });

  const updateChartType = (type: VisualizationType) => {
    setChartType(type);
  };

  const updateChartData = (data: ChartData) => {
    setChartData(data);
  };

  const updateChartOptions = (options: ChartOptions) => {
    setChartOptions(options);
  };

  return {
    chartType,
    chartData,
    chartOptions,
    updateChartType,
    updateChartData,
    updateChartOptions
  };
};

export const getDefaultDatasetStyle = (type: VisualizationType) => {
  switch (type) {
    case 'line':
    case 'timeSeries':
      return {
        fill: false,
        tension: 0.4,
        borderWidth: 2,
        pointRadius: 4
      };
    case 'bar':
      return {
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        borderColor: 'rgb(99, 102, 241)',
        borderWidth: 1
      };
    case 'pie':
    case 'doughnut':
    case 'polarArea':
      return {
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
      };
    case 'scatter':
    case 'bubble':
      return {
        backgroundColor: 'rgba(99, 102, 241, 0.5)',
        borderColor: 'rgb(99, 102, 241)',
        pointRadius: 6,
        pointHoverRadius: 8
      };
    case 'radar':
      return {
        backgroundColor: 'rgba(99, 102, 241, 0.2)',
        borderColor: 'rgb(99, 102, 241)',
        pointBackgroundColor: 'rgb(99, 102, 241)',
        pointBorderColor: '#fff',
        pointHoverBackgroundColor: '#fff',
        pointHoverBorderColor: 'rgb(99, 102, 241)'
      };
    default:
      return {};
  }
};
