import { ChartConfiguration } from 'chart.js/auto';
import { createCanvas } from 'canvas';
import { Chart } from 'chart.js/auto';

export async function generateChartImage(config: ChartConfiguration): Promise<Buffer> {
  // Create canvas with appropriate size
  const canvas = createCanvas(800, 600); // Specify width and height

  // Create and render chart
  const chart = new Chart(canvas as any, {
    ...config,
    options: {
      ...config.options,
      animation: false,
      responsive: false,
      plugins: {
        ...config.options?.plugins,
        legend: {
          ...config.options?.plugins?.legend,
          labels: {
            ...config.options?.plugins?.legend?.labels,
            font: {
              size: 14,
              family: 'Arial'
            }
          }
        }
      },
      scales: {
        ...config.options?.scales,
        x: {
          ...config.options?.scales?.x,
          ticks: {
            ...config.options?.scales?.x?.ticks,
            font: {
              size: 12,
              family: 'Arial'
            }
          }
        },
        y: {
          ...config.options?.scales?.y,
          ticks: {
            ...config.options?.scales?.y?.ticks,
            font: {
              size: 12,
              family: 'Arial'
            }
          }
        }
      }
    }
  });

  // Convert chart to buffer directly
  const buffer = canvas.toBuffer('image/png');
  
  chart.destroy();
  return buffer;
}

export function createChartConfig(visualization: any): ChartConfiguration {
  if (!visualization || !visualization.type) {
    throw new Error('Visualization type is required');
  }

  const baseConfig: Partial<ChartConfiguration> = {
    options: {
      plugins: {
        legend: {
          display: true,
          position: 'top'
        }
      }
    }
  };

  // Prepare the data structure
  const chartData = {
    labels: [],
    datasets: []
  };

  // If data is provided, process it
  if (visualization.data) {
    if (Array.isArray(visualization.data)) {
      // Handle array data
      chartData.labels = visualization.data.map((item: any) => item.label || item.period || item.category || '');
      chartData.datasets = [{
        label: visualization.label || 'Value',
        data: visualization.data.map((item: any) => item.value || item.amount || 0),
        backgroundColor: [
          'rgba(255, 99, 132, 0.5)',
          'rgba(54, 162, 235, 0.5)',
          'rgba(255, 206, 86, 0.5)',
          'rgba(75, 192, 192, 0.5)',
          'rgba(153, 102, 255, 0.5)'
        ],
        borderColor: [
          'rgba(255, 99, 132, 1)',
          'rgba(54, 162, 235, 1)',
          'rgba(255, 206, 86, 1)',
          'rgba(75, 192, 192, 1)',
          'rgba(153, 102, 255, 1)'
        ],
        borderWidth: 1
      }];
    } else {
      // Handle object data
      chartData.labels = Object.keys(visualization.data);
      chartData.datasets = [{
        label: visualization.label || 'Value',
        data: Object.values(visualization.data),
        backgroundColor: 'rgba(54, 162, 235, 0.5)',
        borderColor: 'rgba(54, 162, 235, 1)',
        borderWidth: 1
      }];
    }
  }

  switch (visualization.type.toLowerCase()) {
    case 'line':
    case 'line-chart':
      return {
        ...baseConfig,
        type: 'line',
        data: chartData,
        options: {
          ...baseConfig.options,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: visualization.yAxisLabel || 'Value'
              }
            },
            x: {
              title: {
                display: true,
                text: visualization.xAxisLabel || 'Category'
              }
            }
          }
        }
      };

    case 'bar':
    case 'bar-chart':
      return {
        ...baseConfig,
        type: 'bar',
        data: chartData,
        options: {
          ...baseConfig.options,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: visualization.yAxisLabel || 'Value'
              }
            },
            x: {
              title: {
                display: true,
                text: visualization.xAxisLabel || 'Category'
              }
            }
          }
        }
      };

    case 'pie':
    case 'pie-chart':
      return {
        ...baseConfig,
        type: 'pie',
        data: chartData,
        options: {
          ...baseConfig.options,
          layout: {
            padding: 20
          }
        }
      };

    case 'area':
    case 'area-chart':
      return {
        ...baseConfig,
        type: 'line',
        data: {
          ...chartData,
          datasets: chartData.datasets.map(dataset => ({
            ...dataset,
            fill: true
          }))
        },
        options: {
          ...baseConfig.options,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: visualization.yAxisLabel || 'Value'
              }
            },
            x: {
              title: {
                display: true,
                text: visualization.xAxisLabel || 'Category'
              }
            }
          }
        }
      };

    case 'scatter':
    case 'scatter-plot':
      return {
        ...baseConfig,
        type: 'scatter',
        data: chartData,
        options: {
          ...baseConfig.options,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: visualization.yAxisLabel || 'Value'
              }
            },
            x: {
              title: {
                display: true,
                text: visualization.xAxisLabel || 'Value'
              }
            }
          }
        }
      };

    case 'doughnut':
    case 'doughnut-chart':
      return {
        ...baseConfig,
        type: 'doughnut',
        data: chartData,
        options: {
          ...baseConfig.options,
          layout: {
            padding: 20
          },
          plugins: {
            ...baseConfig.options?.plugins
          }
        }
      };

    case 'radar':
    case 'radar-chart':
      return {
        ...baseConfig,
        type: 'radar',
        data: chartData,
        options: {
          ...baseConfig.options,
          scales: {
            r: {
              beginAtZero: true
            }
          }
        }
      };

    case 'polar':
    case 'polar-area':
      return {
        ...baseConfig,
        type: 'polarArea',
        data: chartData,
        options: {
          ...baseConfig.options,
          scales: {
            r: {
              beginAtZero: true
            }
          }
        }
      };

    case 'bubble':
    case 'bubble-chart':
      return {
        ...baseConfig,
        type: 'bubble',
        data: {
          datasets: [{
            label: visualization.label || 'Value',
            data: visualization.data.map((item: any) => ({
              x: item.x || 0,
              y: item.y || 0,
              r: item.r || 5
            })),
            backgroundColor: 'rgba(54, 162, 235, 0.5)',
            borderColor: 'rgba(54, 162, 235, 1)',
          }]
        },
        options: {
          ...baseConfig.options,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: visualization.yAxisLabel || 'Y Value'
              }
            },
            x: {
              title: {
                display: true,
                text: visualization.xAxisLabel || 'X Value'
              }
            }
          }
        }
      };

    case 'mixed':
    case 'combo':
      return {
        ...baseConfig,
        type: 'bar',
        data: {
          labels: chartData.labels,
          datasets: [
            {
              type: 'bar',
              label: visualization.barLabel || 'Bar Data',
              data: visualization.barData || [],
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
            },
            {
              type: 'line',
              label: visualization.lineLabel || 'Line Data',
              data: visualization.lineData || [],
              borderColor: 'rgba(255, 99, 132, 1)',
              borderWidth: 2,
              fill: false
            }
          ]
        },
        options: {
          ...baseConfig.options,
          scales: {
            y: {
              beginAtZero: true,
              title: {
                display: true,
                text: visualization.yAxisLabel || 'Value'
              }
            },
            x: {
              title: {
                display: true,
                text: visualization.xAxisLabel || 'Category'
              }
            }
          }
        }
      };

    default:
      throw new Error(`Unsupported chart type: ${visualization.type}`);
  }
}
