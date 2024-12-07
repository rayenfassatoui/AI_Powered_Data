import React from 'react';
import Button from './ui/Button';
import { motion } from 'framer-motion';
import type { VisualizationType } from '@/types/visualization';

interface VisualizationConfigProps {
  type: VisualizationType;
  columns: string[];
  columnTypes: Record<string, string>;
  mapping: Record<string, string>;
  onTypeChange: (type: VisualizationType) => void;
  onMappingChange: (mapping: Record<string, string>) => void;
}

const visualizationTypes = [
  {
    value: 'timeSeries',
    label: 'Time Series',
    description: 'Visualize data points over time',
    requiredColumns: [
      { key: 'dateColumn', label: 'Date Column' },
      { key: 'valueColumn', label: 'Value Column' }
    ]
  },
  {
    value: 'distribution',
    label: 'Distribution',
    description: 'Show data distribution patterns',
    requiredColumns: [
      { key: 'valueColumn', label: 'Value Column' }
    ]
  },
  {
    value: 'correlation',
    label: 'Correlation',
    description: 'Analyze relationships between variables',
    requiredColumns: [
      { key: 'xColumn', label: 'X Axis' },
      { key: 'yColumn', label: 'Y Axis' }
    ]
  },
  {
    value: 'pie',
    label: 'Pie Chart',
    description: 'Display part-to-whole relationships',
    requiredColumns: [
      { key: 'categoryColumn', label: 'Category' },
      { key: 'valueColumn', label: 'Value' }
    ]
  },
  {
    value: 'radar',
    label: 'Radar Chart',
    description: 'Compare multiple variables',
    requiredColumns: [
      { key: 'metrics', label: 'Metrics' }
    ]
  }
];

const VisualizationConfig: React.FC<VisualizationConfigProps> = ({
  type,
  columns,
  columnTypes,
  mapping,
  onTypeChange,
  onMappingChange,
}) => {
  const selectedType = visualizationTypes.find(vizType => vizType.value === type);

  const getFilteredColumns = (key: string) => {
    if (key === 'dateColumn') {
      return columns.filter(col => columnTypes[col] === 'date');
    }
    if (key === 'valueColumn' || key === 'xColumn' || key === 'yColumn') {
      return columns.filter(col => columnTypes[col] === 'number');
    }
    return columns;
  };

  const handleMappingChange = (key: string, value: string) => {
    onMappingChange({
      ...mapping,
      [key]: value
    });
  };

  return (
    <div className="space-y-6">
      <div>
        <h3 className="text-lg font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          Chart Type
        </h3>
        <div className="grid grid-cols-1 gap-4">
          {visualizationTypes.map(({ value, label, description }) => (
            <motion.div
              key={value}
              whileHover={{ scale: 1.02 }}
              whileTap={{ scale: 0.98 }}
            >
              <button
                onClick={() => {
                  onTypeChange(value as VisualizationType);
                  onMappingChange({});
                }}
                className={`chart-type-button ${
                  type === value ? 'chart-type-button-active' : ''
                }`}
              >
                <div className="flex flex-col items-start">
                  <span className="font-medium text-gray-900">{label}</span>
                  <span className="text-sm text-gray-500">{description}</span>
                </div>
              </button>
            </motion.div>
          ))}
        </div>
      </div>

      {selectedType && (
        <div className="space-y-4">
          <h3 className="text-lg font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Data Mapping
          </h3>
          {selectedType.requiredColumns.map(({ key, label }) => (
            <div key={key} className="space-y-2">
              <label className="block text-sm font-medium text-gray-700">
                {label}
              </label>
              <select
                value={mapping[key] || ''}
                onChange={(e) => handleMappingChange(key, e.target.value)}
                className="chart-control w-full"
              >
                <option value="">Select a column</option>
                {getFilteredColumns(key).map((column) => (
                  <option key={column} value={column}>
                    {column}
                  </option>
                ))}
              </select>
            </div>
          ))}
        </div>
      )}

      <div className="pt-4">
        <Button
          variant="outline"
          size="md"
          className="w-full text-red-800 border-red-600 bg-red-100 hover:text-red-700 hover:bg-red-300"
          onClick={() => {
            onMappingChange({});
            onTypeChange('timeSeries');
          }}
        >
          Reset
        </Button>
      </div>
    </div>
  );
};

export default VisualizationConfig;
