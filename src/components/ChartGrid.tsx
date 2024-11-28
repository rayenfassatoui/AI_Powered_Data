import { useEffect, useRef } from 'react';
import Chart from 'chart.js/auto';

interface ChartGridProps {
  visualizations: Array<{
    id: string;
    type: string;
    data: any;
  }>;
}

export default function ChartGrid({ visualizations }: ChartGridProps) {
  const chartRefs = useRef<{ [key: string]: HTMLCanvasElement | null }>({});
  const chartInstances = useRef<{ [key: string]: Chart | null }>({});

  useEffect(() => {
    // Clean up old chart instances
    Object.values(chartInstances.current).forEach(chart => {
      if (chart) {
        chart.destroy();
      }
    });
    chartInstances.current = {};

    // Create new chart instances
    visualizations.forEach(viz => {
      const canvas = chartRefs.current[viz.id];
      if (!canvas) return;

      const ctx = canvas.getContext('2d');
      if (!ctx) return;

      // Ensure type is a valid string and convert to Chart.js type
      const getChartType = (type: string | undefined) => {
        if (!type) return 'bar'; // Default to bar chart if type is undefined
        
        const normalizedType = type.toLowerCase();
        if (normalizedType.includes('line')) return 'line';
        if (normalizedType.includes('bar')) return 'bar';
        if (normalizedType.includes('pie')) return 'pie';
        if (normalizedType.includes('doughnut')) return 'doughnut';
        if (normalizedType.includes('radar')) return 'radar';
        if (normalizedType.includes('polar')) return 'polarArea';
        if (normalizedType.includes('bubble')) return 'bubble';
        if (normalizedType.includes('scatter')) return 'scatter';
        return 'bar'; // Default to bar chart for unknown types
      };

      // Ensure data has the correct structure
      const getChartData = (vizData: any) => {
        if (!vizData) {
          return {
            labels: [],
            datasets: [{
              label: 'No Data',
              data: [],
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
            }]
          };
        }
        return vizData;
      };

      // Get formatted title from visualization type
      const getChartTitle = (type: string | undefined) => {
        if (!type) return 'Chart';
        return type.split('-')
          .map(word => word.charAt(0).toUpperCase() + word.slice(1))
          .join(' ');
      };

      const chartConfig = {
        type: getChartType(viz.type),
        data: getChartData(viz.data),
        options: {
          responsive: true,
          maintainAspectRatio: false,
          plugins: {
            legend: {
              position: 'top' as const,
            },
            title: {
              display: true,
              text: getChartTitle(viz.type)
            }
          }
        }
      };

      chartInstances.current[viz.id] = new Chart(ctx, chartConfig);
    });

    // Cleanup function
    return () => {
      Object.values(chartInstances.current).forEach(chart => {
        if (chart) {
          chart.destroy();
        }
      });
    };
  }, [visualizations]);

  return (
    <div className="grid grid-cols-1 md:grid-cols-2 gap-6 p-4">
      {visualizations.map(viz => (
        <div key={viz.id} className="bg-white rounded-lg shadow-sm p-4 h-[400px]">
          <canvas
            ref={el => chartRefs.current[viz.id] = el}
            className="w-full h-full"
          />
        </div>
      ))}
    </div>
  );
}
