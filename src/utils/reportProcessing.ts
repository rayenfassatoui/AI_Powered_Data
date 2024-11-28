export function calculateTotalRevenue(data: any[]): number {
  try {
    return data.reduce((total, item) => {
      const revenue = parseFloat(item.revenue || item.sales || item.amount || '0');
      return total + (isNaN(revenue) ? 0 : revenue);
    }, 0);
  } catch (error) {
    console.error('Error calculating total revenue:', error);
    return 0;
  }
}

export function calculateGrowthRate(data: any[]): number {
  try {
    if (data.length < 2) return 0;

    // Sort data by date
    const sortedData = [...data].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    const firstValue = parseFloat(sortedData[0].revenue || sortedData[0].sales || sortedData[0].amount || '0');
    const lastValue = parseFloat(sortedData[sortedData.length - 1].revenue || sortedData[sortedData.length - 1].sales || sortedData[sortedData.length - 1].amount || '0');

    if (firstValue === 0) return 0;
    return ((lastValue - firstValue) / firstValue) * 100;
  } catch (error) {
    console.error('Error calculating growth rate:', error);
    return 0;
  }
}

export function getTopProducts(data: any[]): any[] {
  try {
    const productMap = new Map();

    // Aggregate sales/revenue by product
    data.forEach(item => {
      const product = item.product || item.item || item.name;
      const value = parseFloat(item.revenue || item.sales || item.amount || '0');
      
      if (product && !isNaN(value)) {
        productMap.set(product, (productMap.get(product) || 0) + value);
      }
    });

    // Convert to array and sort by value
    return Array.from(productMap.entries())
      .map(([name, value]) => ({ name, value }))
      .sort((a, b) => b.value - a.value)
      .slice(0, 5); // Get top 5 products
  } catch (error) {
    console.error('Error getting top products:', error);
    return [];
  }
}

export function calculateAverageTransaction(data: any[]): number {
  try {
    const validTransactions = data.filter(item => {
      const value = parseFloat(item.revenue || item.sales || item.amount || '0');
      return !isNaN(value) && value > 0;
    });

    if (validTransactions.length === 0) return 0;

    const total = validTransactions.reduce((sum, item) => {
      return sum + parseFloat(item.revenue || item.sales || item.amount || '0');
    }, 0);

    return total / validTransactions.length;
  } catch (error) {
    console.error('Error calculating average transaction:', error);
    return 0;
  }
}

export function calculateSalesByPeriod(data: any[]): any[] {
  try {
    const periodMap = new Map();

    // Sort data by date
    const sortedData = [...data].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    // Group by month
    sortedData.forEach(item => {
      const date = new Date(item.date);
      const period = `${date.getFullYear()}-${String(date.getMonth() + 1).padStart(2, '0')}`;
      const value = parseFloat(item.revenue || item.sales || item.amount || '0');

      if (!isNaN(value)) {
        periodMap.set(period, (periodMap.get(period) || 0) + value);
      }
    });

    // Convert to array and sort by period
    return Array.from(periodMap.entries())
      .map(([period, value]) => ({ period, value }))
      .sort((a, b) => a.period.localeCompare(b.period));
  } catch (error) {
    console.error('Error calculating sales by period:', error);
    return [];
  }
}

export function generateLineChartData(data: any[]): any {
  try {
    // Sort data by date
    const sortedData = [...data].sort((a, b) => 
      new Date(a.date).getTime() - new Date(b.date).getTime()
    );

    return {
      labels: sortedData.map(item => new Date(item.date).toLocaleDateString()),
      datasets: [{
        label: 'Revenue',
        data: sortedData.map(item => 
          parseFloat(item.revenue || item.sales || item.amount || '0')
        ),
        borderColor: '#3B82F6',
        tension: 0.1
      }]
    };
  } catch (error) {
    console.error('Error generating line chart data:', error);
    return { labels: [], datasets: [] };
  }
}

export function generateBarChartData(data: any[]): any {
  try {
    const productData = getTopProducts(data);

    return {
      labels: productData.map(item => item.name),
      datasets: [{
        label: 'Revenue by Product',
        data: productData.map(item => item.value),
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#6366F1',
          '#F59E0B',
          '#EF4444'
        ]
      }]
    };
  } catch (error) {
    console.error('Error generating bar chart data:', error);
    return { labels: [], datasets: [] };
  }
}

export function generatePieChartData(data: any[]): any {
  try {
    const productData = getTopProducts(data);

    return {
      labels: productData.map(item => item.name),
      datasets: [{
        data: productData.map(item => item.value),
        backgroundColor: [
          '#3B82F6',
          '#10B981',
          '#6366F1',
          '#F59E0B',
          '#EF4444'
        ]
      }]
    };
  } catch (error) {
    console.error('Error generating pie chart data:', error);
    return { labels: [], datasets: [] };
  }
}

export function generateAreaChartData(data: any[]): any {
  try {
    const salesByPeriod = calculateSalesByPeriod(data);

    return {
      labels: salesByPeriod.map(item => item.period),
      datasets: [{
        label: 'Sales Over Time',
        data: salesByPeriod.map(item => item.value),
        fill: true,
        backgroundColor: 'rgba(59, 130, 246, 0.2)',
        borderColor: '#3B82F6',
        tension: 0.1
      }]
    };
  } catch (error) {
    console.error('Error generating area chart data:', error);
    return { labels: [], datasets: [] };
  }
}

export function generateScatterPlotData(data: any[]): any {
  try {
    // Create scatter plot of quantity vs revenue
    const points = data.map(item => {
      const quantity = parseFloat(item.quantity || '1');
      const revenue = parseFloat(item.revenue || item.sales || item.amount || '0');
      return {
        x: isNaN(quantity) ? 0 : quantity,
        y: isNaN(revenue) ? 0 : revenue
      };
    }).filter(point => point.x > 0 && point.y > 0);

    return {
      datasets: [{
        label: 'Quantity vs Revenue',
        data: points,
        backgroundColor: '#3B82F6',
        pointRadius: 6,
        pointHoverRadius: 8
      }]
    };
  } catch (error) {
    console.error('Error generating scatter plot data:', error);
    return { datasets: [] };
  }
}
