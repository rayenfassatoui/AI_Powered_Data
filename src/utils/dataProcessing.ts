import { Dataset } from '@prisma/client';

interface MetricResult {
  id: string;
  value: number | Array<{ period: string; value: number }> | Array<{ product: string; value: number }>;
}

interface ChartData {
  id: string;
  data: {
    labels: string[];
    datasets: Array<{
      label: string;
      data: number[];
      backgroundColor?: string | string[];
      borderColor?: string;
      fill?: boolean;
      tension?: number;
      pointRadius?: number;
      pointHoverRadius?: number;
    }>;
  };
}

export function calculateMetrics(dataset: Dataset): MetricResult[] {
  const data = typeof dataset.data === 'string' ? JSON.parse(dataset.data) : dataset.data;
  if (!Array.isArray(data)) return [];

  const metrics: MetricResult[] = [];

  // Total Revenue
  const totalRevenue = data.reduce((sum, item) => {
    const amount = parseFloat(item.amount || item.revenue || item.sales || '0');
    return sum + (isNaN(amount) ? 0 : amount);
  }, 0);
  metrics.push({ id: 'total-revenue', value: totalRevenue });

  // Growth Rate
  const periods = data.reduce((acc: { [key: string]: number }, item) => {
    const date = new Date(item.date || item.timestamp);
    const period = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    const amount = parseFloat(item.amount || item.revenue || item.sales || '0');
    acc[period] = (acc[period] || 0) + (isNaN(amount) ? 0 : amount);
    return acc;
  }, {});

  const sortedPeriods = Object.keys(periods).sort();
  const growthRate = sortedPeriods.length > 1 ? 
    ((periods[sortedPeriods[sortedPeriods.length - 1]] / periods[sortedPeriods[0]]) - 1) * 100 : 0;
  metrics.push({ id: 'growth-rate', value: growthRate });

  // Sales by Period
  const salesByPeriod = sortedPeriods.map(period => ({
    period,
    value: periods[period]
  }));
  metrics.push({ id: 'sales-by-period', value: salesByPeriod });

  // Average Transaction
  const avgTransaction = totalRevenue / data.length;
  metrics.push({ id: 'avg-transaction', value: avgTransaction });

  // Top Products
  const productSales = data.reduce((acc: { [key: string]: number }, item) => {
    const product = item.product || item.item || item.name || 'Unknown';
    const amount = parseFloat(item.amount || item.revenue || item.sales || '0');
    acc[product] = (acc[product] || 0) + (isNaN(amount) ? 0 : amount);
    return acc;
  }, {});

  const topProducts = Object.entries(productSales)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5)
    .map(([product, value]) => ({ product, value }));
  metrics.push({ id: 'top-products', value: topProducts });

  return metrics;
}

export function generateVisualizations(dataset: Dataset): ChartData[] {
  const data = typeof dataset.data === 'string' ? JSON.parse(dataset.data) : dataset.data;
  if (!Array.isArray(data)) return [];

  const visualizations: ChartData[] = [];
  const colors = ['#3B82F6', '#10B981', '#6366F1', '#F59E0B', '#EF4444'];

  // Line Chart - Revenue over time
  const timeData = data.reduce((acc: { [key: string]: number }, item) => {
    const date = new Date(item.date || item.timestamp);
    const period = `${date.getFullYear()}-${(date.getMonth() + 1).toString().padStart(2, '0')}`;
    const amount = parseFloat(item.amount || item.revenue || item.sales || '0');
    acc[period] = (acc[period] || 0) + (isNaN(amount) ? 0 : amount);
    return acc;
  }, {});

  const sortedPeriods = Object.keys(timeData).sort();
  visualizations.push({
    id: 'line-chart',
    data: {
      labels: sortedPeriods,
      datasets: [{
        label: 'Revenue',
        data: sortedPeriods.map(period => timeData[period]),
        borderColor: '#3B82F6',
        tension: 0.1
      }]
    }
  });

  // Bar Chart - Top Products
  const productData = data.reduce((acc: { [key: string]: number }, item) => {
    const product = item.product || item.item || item.name || 'Unknown';
    const amount = parseFloat(item.amount || item.revenue || item.sales || '0');
    acc[product] = (acc[product] || 0) + (isNaN(amount) ? 0 : amount);
    return acc;
  }, {});

  const topProducts = Object.entries(productData)
    .sort(([, a], [, b]) => b - a)
    .slice(0, 5);

  visualizations.push({
    id: 'bar-chart',
    data: {
      labels: topProducts.map(([product]) => product),
      datasets: [{
        label: 'Revenue by Product',
        data: topProducts.map(([, value]) => value),
        backgroundColor: colors
      }]
    }
  });

  // Pie Chart - Product Distribution
  visualizations.push({
    id: 'pie-chart',
    data: {
      labels: topProducts.map(([product]) => product),
      datasets: [{
        data: topProducts.map(([, value]) => value),
        backgroundColor: colors
      }]
    }
  });

  // Area Chart - Cumulative Revenue
  let cumulative = 0;
  const cumulativeData = sortedPeriods.map(period => {
    cumulative += timeData[period];
    return cumulative;
  });

  visualizations.push({
    id: 'area-chart',
    data: {
      labels: sortedPeriods,
      datasets: [{
        label: 'Sales Over Time',
        data: cumulativeData,
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: '#3B82F6',
        tension: 0.1
      }]
    }
  });

  // Scatter Plot - Quantity vs Revenue
  const scatterData = data.map(item => {
    const quantity = parseFloat(item.quantity || '1');
    const amount = parseFloat(item.amount || item.revenue || item.sales || '0');
    return {
      x: isNaN(quantity) ? 0 : quantity,
      y: isNaN(amount) ? 0 : amount
    };
  });

  visualizations.push({
    id: 'scatter-plot',
    data: {
      datasets: [{
        label: 'Quantity vs Revenue',
        data: scatterData,
        backgroundColor: '#3B82F6',
        pointRadius: 6,
        pointHoverRadius: 8
      }]
    }
  });

  return visualizations;
}
