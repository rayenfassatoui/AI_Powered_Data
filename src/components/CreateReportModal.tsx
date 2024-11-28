import { useState, useEffect } from 'react';
import { FiBarChart2, FiPieChart, FiTrendingUp, FiGrid, FiActivity, FiMap, FiX, FiCheck } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

interface Dataset {
  id: string;
  name: string;
  type: string;
  createdAt: string;
  updatedAt: string;
}

interface CreateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateReport: (reportData: any) => void;
}

export default function CreateReportModal({ isOpen, onClose, onCreateReport }: CreateReportModalProps) {
  const [datasets, setDatasets] = useState<Dataset[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [reportConfig, setReportConfig] = useState({
    title: '',
    description: '',
    datasetId: '',
    metrics: [] as string[],
    visualizations: [] as string[],
    exportFormat: 'pdf',
    orientation: 'portrait',
    includeRawData: false
  });

  const availableMetrics = [
    { id: 'total-revenue', name: 'Total Revenue', description: 'Calculate total revenue from sales' },
    { id: 'growth-rate', name: 'Growth Rate', description: 'Calculate growth rate over time' },
    { id: 'top-products', name: 'Top Products', description: 'Identify best performing products' },
    { id: 'avg-transaction', name: 'Average Transaction', description: 'Calculate average transaction value' },
    { id: 'sales-by-period', name: 'Sales by Period', description: 'Break down sales by time period' }
  ];

  const availableVisualizations = [
    { id: 'line-chart', name: 'Line Chart', icon: FiTrendingUp, description: 'Show trends over time' },
    { id: 'bar-chart', name: 'Bar Chart', icon: FiBarChart2, description: 'Compare values across categories' },
    { id: 'pie-chart', name: 'Pie Chart', icon: FiPieChart, description: 'Show composition of data' },
    { id: 'area-chart', name: 'Area Chart', icon: FiActivity, description: 'Display cumulative totals over time' },
    { id: 'scatter-plot', name: 'Scatter Plot', icon: FiGrid, description: 'Show correlation between variables' }
  ];

  useEffect(() => {
    if (isOpen) {
      fetchDatasets();
    }
  }, [isOpen]);

  const fetchDatasets = async () => {
    try {
      setLoading(true);
      const response = await fetch('/api/datasets/list');
      if (!response.ok) {
        throw new Error('Failed to fetch datasets');
      }
      const data = await response.json();
      setDatasets(data);
      setError(null);
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error fetching datasets');
    } finally {
      setLoading(false);
    }
  };

  const toggleMetric = (metricId: string) => {
    setReportConfig(prev => ({
      ...prev,
      metrics: prev.metrics.includes(metricId)
        ? prev.metrics.filter(m => m !== metricId)
        : [...prev.metrics, metricId]
    }));
  };

  const toggleVisualization = (vizId: string) => {
    setReportConfig(prev => ({
      ...prev,
      visualizations: prev.visualizations.includes(vizId)
        ? prev.visualizations.filter(v => v !== vizId)
        : [...prev.visualizations, vizId]
    }));
  };

  const handleSubmit = async () => {
    if (!reportConfig.title || !reportConfig.datasetId || !reportConfig.metrics.length || !reportConfig.visualizations.length) {
      setError('Please fill in all required fields: title, dataset, metrics, and visualizations');
      return;
    }

    try {
      setLoading(true);
      setError(null);

      // Create visualization data structure
      const visualizationsData = reportConfig.visualizations.map(vizId => {
        const vizType = availableVisualizations.find(v => v.id === vizId)?.id || 'bar-chart';
        return {
          id: vizId,
          type: vizType,
          data: {
            labels: ['January', 'February', 'March', 'April', 'May'], // Example data
            datasets: [{
              label: 'Sample Data',
              data: [65, 59, 80, 81, 56],
              backgroundColor: 'rgba(54, 162, 235, 0.5)',
              borderColor: 'rgba(54, 162, 235, 1)',
              borderWidth: 1
            }]
          }
        };
      });

      const reportData = {
        ...reportConfig,
        visualizations: visualizationsData
      };
      
      const response = await fetch('/api/reports', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify(reportData),
      });

      if (!response.ok) {
        const errorData = await response.json();
        throw new Error(errorData.message || 'Failed to create report');
      }

      const newReport = await response.json();
      onCreateReport(newReport);
      onClose();
      setReportConfig({
        title: '',
        description: '',
        datasetId: '',
        metrics: [],
        visualizations: [],
        exportFormat: 'pdf',
        orientation: 'portrait',
        includeRawData: false
      });
    } catch (err) {
      console.error('Error creating report:', err);
      setError(err instanceof Error ? err.message : 'Error creating report');
    } finally {
      setLoading(false);
    }
  };

  if (!isOpen) return null;

  return (
    <div className="fixed inset-0 bg-black bg-opacity-50 z-50 flex items-center justify-center">
      <motion.div
        initial={{ opacity: 0, scale: 0.95 }}
        animate={{ opacity: 1, scale: 1 }}
        exit={{ opacity: 0, scale: 0.95 }}
        className="bg-white rounded-xl p-6 max-w-4xl w-full max-h-[90vh] overflow-y-auto relative"
      >
        <button
          onClick={onClose}
          className="absolute top-4 right-4 p-2 hover:bg-gray-100 rounded-lg transition-colors"
        >
          <FiX className="w-5 h-5" />
        </button>

        <div className="mb-6">
          <h2 className="text-2xl font-bold text-gray-900">Create Custom Report</h2>
          <p className="text-sm text-gray-600 mt-1">
            Select your data source and customize your report
          </p>
        </div>

        {error && (
          <div className="mb-6 p-4 bg-red-50 text-red-700 rounded-lg">
            {error}
          </div>
        )}

        <div className="space-y-6">
          {/* Basic Information */}
          <div className="space-y-4">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Title *
              </label>
              <input
                type="text"
                value={reportConfig.title}
                onChange={(e) => setReportConfig(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                placeholder="Enter report title"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={reportConfig.description}
                onChange={(e) => setReportConfig(prev => ({ ...prev, description: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                rows={3}
                placeholder="Enter report description"
              />
            </div>
          </div>

          {/* Dataset Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Dataset *
            </label>
            {loading ? (
              <div className="flex items-center justify-center py-4">
                <div className="animate-spin rounded-full h-6 w-6 border-b-2 border-blue-500"></div>
              </div>
            ) : (
              <select
                value={reportConfig.datasetId}
                onChange={(e) => setReportConfig(prev => ({ ...prev, datasetId: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a dataset</option>
                {datasets.map((dataset) => (
                  <option key={dataset.id} value={dataset.id}>
                    {dataset.name} ({dataset.type})
                  </option>
                ))}
              </select>
            )}
          </div>

          {/* Metrics Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Select Metrics *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableMetrics.map((metric) => (
                <div
                  key={metric.id}
                  onClick={() => toggleMetric(metric.id)}
                  className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
                    reportConfig.metrics.includes(metric.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <span className="font-medium text-gray-900">{metric.name}</span>
                    {reportConfig.metrics.includes(metric.id) && (
                      <FiCheck className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{metric.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Visualizations Selection */}
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-4">
              Select Visualizations *
            </label>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
              {availableVisualizations.map((viz) => (
                <div
                  key={viz.id}
                  onClick={() => toggleVisualization(viz.id)}
                  className={`cursor-pointer p-4 rounded-lg border-2 transition-all ${
                    reportConfig.visualizations.includes(viz.id)
                      ? 'border-blue-500 bg-blue-50'
                      : 'border-gray-200 hover:border-blue-200'
                  }`}
                >
                  <div className="flex items-center justify-between mb-2">
                    <div className="flex items-center">
                      <viz.icon className="w-5 h-5 text-blue-500 mr-2" />
                      <span className="font-medium text-gray-900">{viz.name}</span>
                    </div>
                    {reportConfig.visualizations.includes(viz.id) && (
                      <FiCheck className="w-5 h-5 text-blue-500" />
                    )}
                  </div>
                  <p className="text-sm text-gray-600">{viz.description}</p>
                </div>
              ))}
            </div>
          </div>

          {/* Export Options */}
          <div className="space-y-4">
            <h3 className="text-lg font-medium text-gray-900">Export Options</h3>
            
            <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Export Format
                </label>
                <select
                  value={reportConfig.exportFormat}
                  onChange={(e) => setReportConfig(prev => ({ ...prev, exportFormat: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="pdf">PDF Document</option>
                  <option value="excel">Excel Spreadsheet</option>
                  <option value="csv">CSV File</option>
                </select>
              </div>

              <div>
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Page Orientation
                </label>
                <select
                  value={reportConfig.orientation}
                  onChange={(e) => setReportConfig(prev => ({ ...prev, orientation: e.target.value }))}
                  className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
                >
                  <option value="portrait">Portrait</option>
                  <option value="landscape">Landscape</option>
                </select>
              </div>
            </div>

            <div className="flex items-center">
              <input
                type="checkbox"
                id="includeRawData"
                checked={reportConfig.includeRawData}
                onChange={(e) => setReportConfig(prev => ({ ...prev, includeRawData: e.target.checked }))}
                className="h-4 w-4 text-blue-600 focus:ring-blue-500 border-gray-300 rounded"
              />
              <label htmlFor="includeRawData" className="ml-2 block text-sm text-gray-700">
                Include raw data in export
              </label>
            </div>
          </div>

          <div className="flex justify-end space-x-4 pt-6 border-t">
            <button
              onClick={onClose}
              className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50"
            >
              Cancel
            </button>
            <button
              onClick={handleSubmit}
              className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700"
            >
              Create Report
            </button>
          </div>
        </div>
      </motion.div>
    </div>
  );
}
