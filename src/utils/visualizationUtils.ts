import { ChartData, ChartOptions } from "chart.js";

interface DataPoint {
  [key: string]: any;
}

export interface ChartConfiguration {
  title?: string;
  xAxisLabel?: string;
  yAxisLabel?: string;
  legendPosition?: "top" | "bottom" | "left" | "right";
  aspectRatio?: number;
  animation?: boolean;
}

export function getChartOptions(config: ChartConfiguration = {}): ChartOptions {
  return {
    responsive: true,
    maintainAspectRatio: true,
    aspectRatio: config.aspectRatio || 2,
    animation: {
      duration: config.animation === false ? 0 : 1000,
    },
    plugins: {
      legend: {
        position: config.legendPosition || "top",
        labels: {
          usePointStyle: true,
          padding: 15,
        },
      },
      title: {
        display: !!config.title,
        text: config.title || "",
        padding: 20,
        font: {
          size: 16,
          weight: "bold",
        },
      },
      tooltip: {
        backgroundColor: "rgba(0, 0, 0, 0.8)",
        padding: 12,
        titleFont: {
          size: 14,
          weight: "bold",
        },
        bodyFont: {
          size: 13,
        },
        cornerRadius: 6,
        displayColors: true,
      },
    },
    scales: {
      x: {
        title: {
          display: !!config.xAxisLabel,
          text: config.xAxisLabel || "",
          padding: 10,
          font: {
            size: 12,
            weight: "bold",
          },
        },
        grid: {
          display: true,
          drawOnChartArea: true,
          drawTicks: true,
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
      y: {
        title: {
          display: !!config.yAxisLabel,
          text: config.yAxisLabel || "",
          padding: 10,
          font: {
            size: 12,
            weight: "bold",
          },
        },
        grid: {
          display: true,

          drawOnChartArea: true,
          drawTicks: true,
          color: "rgba(0, 0, 0, 0.1)",
        },
      },
    },
  };
}

export function processTimeSeriesData(
  data: DataPoint[],
  dateColumn: string,
  valueColumn: string,
  config: ChartConfiguration = {}
): { data: ChartData<"line">; options: ChartOptions } {
  const sortedData = [...data].sort(
    (a, b) =>
      new Date(a[dateColumn]).getTime() - new Date(b[dateColumn]).getTime()
  );

  return {
    data: {
      labels: sortedData.map((d) =>
        new Date(d[dateColumn]).toLocaleDateString()
      ),
      datasets: [
        {
          label: valueColumn,
          data: sortedData.map((d) => Number(d[valueColumn])),
          borderColor: "rgb(59, 130, 246)",
          backgroundColor: "rgba(59, 130, 246, 0.1)",
          tension: 0.1,
          fill: true,
        },
      ],
    },
    options: getChartOptions({
      ...config,
      title: config.title || "Time Series Analysis",
      xAxisLabel: config.xAxisLabel || "Date",
      yAxisLabel: config.yAxisLabel || valueColumn,
    }),
  };
}

export function processDistributionData(
  data: DataPoint[],
  valueColumn: string,
  bins: number = 20,
  config: ChartConfiguration = {}
): { data: ChartData<"bar">; options: ChartOptions } {
  const values = data
    .map((d) => Number(d[valueColumn]))
    .filter((v) => !isNaN(v));
  const min = Math.min(...values);
  const max = Math.max(...values);
  const binWidth = (max - min) / bins;

  // Create bins
  const frequencies = new Array(bins).fill(0);
  values.forEach((value) => {
    const binIndex = Math.min(Math.floor((value - min) / binWidth), bins - 1);
    frequencies[binIndex]++;
  });

  // Create labels for bin ranges
  const labels = frequencies.map((_, i) => {
    const start = (min + i * binWidth).toFixed(2);
    const end = (min + (i + 1) * binWidth).toFixed(2);
    return `${start} - ${end}`;
  });

  return {
    data: {
      labels,
      datasets: [
        {
          label: `Distribution of ${valueColumn}`,
          data: frequencies,
          backgroundColor: "rgba(59, 130, 246, 0.8)",
          borderColor: "rgb(59, 130, 246)",
          borderWidth: 1,
        },
      ],
    },
    options: getChartOptions({
      ...config,
      title: config.title || "Distribution Analysis",
      xAxisLabel: config.xAxisLabel || valueColumn,
      yAxisLabel: config.yAxisLabel || "Frequency",
    }),
  };
}

export function processCorrelationData(
  data: DataPoint[],
  xColumn: string,
  yColumn: string,
  config: ChartConfiguration = {}
): { data: ChartData<"scatter">; options: ChartOptions } {
  return {
    data: {
      datasets: [
        {
          label: `${xColumn} vs ${yColumn}`,
          data: data.map((d) => ({
            x: Number(d[xColumn]),
            y: Number(d[yColumn]),
          })),
          backgroundColor: "rgba(59, 130, 246, 0.6)",
          pointRadius: 5,
          pointHoverRadius: 8,
        },
      ],
    },
    options: getChartOptions({
      ...config,
      title: config.title || "Correlation Analysis",
      xAxisLabel: config.xAxisLabel || xColumn,
      yAxisLabel: config.yAxisLabel || yColumn,
    }),
  };
}

export function processPieChartData(
  data: DataPoint[],
  categoryColumn: string,
  valueColumn?: string,
  config: ChartConfiguration = {}
): { data: ChartData<"pie">; options: ChartOptions } {
  const aggregatedData: { [key: string]: number } = {};

  if (valueColumn) {
    // Sum values for each category
    data.forEach((d) => {
      const category = String(d[categoryColumn]);
      const value = Number(d[valueColumn]);
      aggregatedData[category] = (aggregatedData[category] || 0) + value;
    });
  } else {
    // Count occurrences of each category
    data.forEach((d) => {
      const category = String(d[categoryColumn]);
      aggregatedData[category] = (aggregatedData[category] || 0) + 1;
    });
  }

  const colors = generateColors(Object.keys(aggregatedData).length);

  return {
    data: {
      labels: Object.keys(aggregatedData),
      datasets: [
        {
          data: Object.values(aggregatedData),
          backgroundColor: colors,
          borderColor: colors.map((c) => c.replace("0.8", "1")),
          borderWidth: 1,
        },
      ],
    },
    options: getChartOptions({
      ...config,
      title: config.title || "Category Distribution",
      aspectRatio: 1,
    }),
  };
}

export function processRadarData(
  data: DataPoint[],
  metrics: string[],
  categoryColumn?: string,
  config: ChartConfiguration = {}
): { data: ChartData<"radar">; options: ChartOptions } {
  if (categoryColumn) {
    // Calculate average for each metric by category
    const categories = [...new Set(data.map((d) => d[categoryColumn]))];
    const datasets = categories.map((category, index) => {
      const categoryData = data.filter((d) => d[categoryColumn] === category);
      const averages = metrics.map((metric) =>
        average(categoryData.map((d) => Number(d[metric])))
      );

      return {
        label: String(category),
        data: averages,
        backgroundColor: `rgba(59, 130, 246, ${0.2 + index * 0.2})`,
        borderColor: `rgba(59, 130, 246, ${0.8 + index * 0.2})`,
        borderWidth: 2,
      };
    });

    return {
      data: {
        labels: metrics,
        datasets,
      },
      options: getChartOptions({
        ...config,
        title: config.title || "Radar Analysis",
        aspectRatio: 1,
      }),
    };
  } else {
    return {
      data: {
        labels: metrics,
        datasets: [
          {
            label: "Values",
            data: metrics.map((metric) =>
              average(data.map((d) => Number(d[metric])))
            ),
            backgroundColor: "rgba(59, 130, 246, 0.2)",
            borderColor: "rgb(59, 130, 246)",
            borderWidth: 2,
          },
        ],
      },
      options: getChartOptions({
        ...config,
        title: config.title || "Radar Analysis",
        aspectRatio: 1,
      }),
    };
  }
}

// Helper functions
function average(numbers: number[]): number {
  const validNumbers = numbers.filter((n) => !isNaN(n));
  return validNumbers.reduce((a, b) => a + b, 0) / validNumbers.length;
}

function generateColors(count: number): string[] {
  const baseHue = 210; // Blue
  return Array.from({ length: count }, (_, i) => {
    const hue = (baseHue + (i * 360) / count) % 360;
    return `hsla(${hue}, 70%, 50%, 0.8)`;
  });
}

export function detectColumnTypes(data: DataPoint[]): Record<string, string> {
  const columnTypes: Record<string, string> = {};

  if (data.length === 0) return columnTypes;

  const sampleRow = data[0];
  const columns = Object.keys(sampleRow);

  columns.forEach((column) => {
    // Check first non-null value
    const firstValue = data.find((row) => row[column] != null)?.[column];
    if (firstValue == null) {
      columnTypes[column] = "string";
      return;
    }

    // Try to parse as date
    const dateValue = new Date(firstValue);
    if (dateValue instanceof Date && !isNaN(dateValue.getTime())) {
      // Verify that most values in the column are dates
      const dateCount = data.filter((row) => {
        const value = row[column];
        if (value == null) return true;
        const date = new Date(value);
        return date instanceof Date && !isNaN(date.getTime());
      }).length;

      if (dateCount / data.length > 0.8) {
        columnTypes[column] = "date";
        return;
      }
    }

    // Try to parse as number
    const numberCount = data.filter((row) => {
      const value = row[column];
      return value != null && !isNaN(Number(value));
    }).length;

    if (numberCount / data.length > 0.8) {
      columnTypes[column] = "number";
      return;
    }

    // Default to string
    columnTypes[column] = "string";
  });

  return columnTypes;
}
