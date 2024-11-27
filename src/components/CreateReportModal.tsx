import { useState } from 'react';
import { FiBarChart2, FiPieChart, FiTrendingUp, FiGrid, FiActivity, FiMap, FiX } from 'react-icons/fi';
import { motion, AnimatePresence } from 'framer-motion';

interface CreateReportModalProps {
  isOpen: boolean;
  onClose: () => void;
  onCreateReport: (reportData: any) => void;
}

const reportTemplates = [
  {
    id: 'sales-analysis',
    title: 'Sales Analysis',
    description: 'Analyze sales trends, revenue metrics, and product performance',
    icon: FiTrendingUp,
    charts: ['Line Chart', 'Bar Chart', 'Pie Chart'],
    metrics: ['Total Revenue', 'Growth Rate', 'Top Products']
  },
  {
    id: 'customer-insights',
    title: 'Customer Insights',
    description: 'Understand customer behavior, demographics, and segmentation',
    icon: FiPieChart,
    charts: ['Demographics Chart', 'Behavior Pattern', 'Segmentation'],
    metrics: ['Customer Lifetime Value', 'Churn Rate', 'Satisfaction Score']
  },
  {
    id: 'inventory-analysis',
    title: 'Inventory Analysis',
    description: 'Track inventory levels, turnover rates, and stock optimization',
    icon: FiGrid,
    charts: ['Stock Level Chart', 'Turnover Rate', 'Reorder Points'],
    metrics: ['Stock Value', 'Turnover Ratio', 'Dead Stock']
  },
  {
    id: 'performance-metrics',
    title: 'Performance Metrics',
    description: 'Monitor KPIs, performance trends, and efficiency metrics',
    icon: FiActivity,
    charts: ['KPI Dashboard', 'Performance Trends', 'Efficiency Matrix'],
    metrics: ['ROI', 'Conversion Rate', 'Growth Rate']
  },
  {
    id: 'market-analysis',
    title: 'Market Analysis',
    description: 'Analyze market trends, competition, and opportunities',
    icon: FiMap,
    charts: ['Market Share', 'Competitor Analysis', 'Trend Analysis'],
    metrics: ['Market Share', 'Growth Potential', 'Competition Index']
  }
];

export default function CreateReportModal({ isOpen, onClose, onCreateReport }: CreateReportModalProps) {
  const [step, setStep] = useState(1);
  const [selectedTemplate, setSelectedTemplate] = useState<string | null>(null);
  const [reportConfig, setReportConfig] = useState({
    title: '',
    description: '',
    dataSource: '',
    metrics: [] as string[],
    visualizations: [] as string[]
  });

  const handleTemplateSelect = (templateId: string) => {
    setSelectedTemplate(templateId);
    const template = reportTemplates.find(t => t.id === templateId);
    if (template) {
      setReportConfig(prev => ({
        ...prev,
        title: template.title,
        description: template.description,
        metrics: template.metrics,
        visualizations: template.charts
      }));
    }
    setStep(2);
  };

  const handleCreateReport = () => {
    onCreateReport(reportConfig);
    onClose();
    setStep(1);
    setSelectedTemplate(null);
    setReportConfig({
      title: '',
      description: '',
      dataSource: '',
      metrics: [],
      visualizations: []
    });
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
          <h2 className="text-2xl font-bold text-gray-900">Create New Report</h2>
          <p className="text-sm text-gray-600 mt-1">
            Select a template and customize your report
          </p>
        </div>

        {/* Step indicator */}
        <div className="mb-8">
          <div className="flex items-center">
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step >= 1 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              1
            </div>
            <div className={`flex-1 h-1 mx-4 ${
              step >= 2 ? 'bg-blue-600' : 'bg-gray-200'
            }`} />
            <div className={`flex items-center justify-center w-8 h-8 rounded-full ${
              step >= 2 ? 'bg-blue-600 text-white' : 'bg-gray-200 text-gray-600'
            }`}>
              2
            </div>
          </div>
          <div className="flex justify-between mt-2">
            <span className="text-sm font-medium text-gray-600">Select Template</span>
            <span className="text-sm font-medium text-gray-600">Configure Report</span>
          </div>
        </div>

        {step === 1 && (
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {reportTemplates.map((template) => (
              <motion.div
                key={template.id}
                whileHover={{ scale: 1.02 }}
                whileTap={{ scale: 0.98 }}
                className={`cursor-pointer p-4 bg-white rounded-xl border-2 transition-all duration-200 ${
                  selectedTemplate === template.id
                    ? 'border-blue-500 shadow-lg'
                    : 'border-gray-200 hover:border-blue-200 hover:shadow-md'
                }`}
                onClick={() => handleTemplateSelect(template.id)}
              >
                <div className="flex items-center mb-3">
                  <div className="p-2 bg-blue-50 rounded-lg">
                    <template.icon className="w-5 h-5 text-blue-600" />
                  </div>
                  <h3 className="ml-3 text-lg font-semibold text-gray-900">{template.title}</h3>
                </div>
                <p className="text-sm text-gray-600 mb-3">{template.description}</p>
                <div className="space-y-2">
                  <div className="flex items-center text-sm text-gray-600">
                    <FiBarChart2 className="w-4 h-4 mr-2 text-blue-500" />
                    <span>{template.charts.length} Visualizations</span>
                  </div>
                  <div className="flex items-center text-sm text-gray-600">
                    <FiActivity className="w-4 h-4 mr-2 text-blue-500" />
                    <span>{template.metrics.length} Key Metrics</span>
                  </div>
                </div>
              </motion.div>
            ))}
          </div>
        )}

        {step === 2 && (
          <div className="space-y-6">
            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Report Title
              </label>
              <input
                type="text"
                value={reportConfig.title}
                onChange={(e) => setReportConfig(prev => ({ ...prev, title: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Description
              </label>
              <textarea
                value={reportConfig.description}
                onChange={(e) => setReportConfig(prev => ({ ...prev, description: e.target.value }))}
                rows={3}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              />
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Data Source
              </label>
              <select
                value={reportConfig.dataSource}
                onChange={(e) => setReportConfig(prev => ({ ...prev, dataSource: e.target.value }))}
                className="w-full px-4 py-2 border border-gray-300 rounded-lg focus:ring-2 focus:ring-blue-500 focus:border-blue-500"
              >
                <option value="">Select a data source</option>
                <option value="sales_data">Sales Data</option>
                <option value="customer_data">Customer Data</option>
                <option value="inventory_data">Inventory Data</option>
                <option value="performance_data">Performance Data</option>
              </select>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Metrics to Include
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reportConfig.metrics.map((metric, index) => (
                  <div
                    key={index}
                    className="flex items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <FiActivity className="w-4 h-4 text-blue-500 mr-2" />
                    <span className="text-sm text-gray-700">{metric}</span>
                  </div>
                ))}
              </div>
            </div>

            <div>
              <label className="block text-sm font-medium text-gray-700 mb-2">
                Visualizations
              </label>
              <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
                {reportConfig.visualizations.map((chart, index) => (
                  <div
                    key={index}
                    className="flex items-center p-3 bg-gray-50 rounded-lg"
                  >
                    <FiBarChart2 className="w-4 h-4 text-blue-500 mr-2" />
                    <span className="text-sm text-gray-700">{chart}</span>
                  </div>
                ))}
              </div>
            </div>

            <div className="flex justify-end space-x-4 mt-8">
              <button
                onClick={() => setStep(1)}
                className="px-4 py-2 text-sm font-medium text-gray-700 bg-white border border-gray-300 rounded-lg hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Back
              </button>
              <button
                onClick={handleCreateReport}
                className="px-4 py-2 text-sm font-medium text-white bg-blue-600 border border-transparent rounded-lg hover:bg-blue-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500"
              >
                Create Report
              </button>
            </div>
          </div>
        )}
      </motion.div>
    </div>
  );
}
