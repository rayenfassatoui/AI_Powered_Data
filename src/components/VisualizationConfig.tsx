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
  const getRequiredColumns = (type: VisualizationType) => {
    const vizType = visualizationTypes.find(vt => vt.value === type);
    return vizType ? vizType.requiredColumns : [];
  };

  const getColumnOptions = (required: string) => {
    if (!columns.length) {
      return [];
    }

    switch (required) {
      case 'dateColumn':
        return columns.filter(col => columnTypes[col] === 'date');
      case 'valueColumn':
      case 'xColumn':
      case 'yColumn':
        return columns.filter(col => columnTypes[col] === 'number');
      case 'categoryColumn':
        return columns.filter(col => columnTypes[col] === 'string' || columnTypes[col] === 'number');
      case 'metrics':
        return columns.filter(col => columnTypes[col] === 'number');
      default:
        return columns;
    }
  };

  const getMappingError = (key: string): string | null => {
    const options = getColumnOptions(key);
    if (options.length === 0) {
      switch (key) {
        case 'dateColumn':
          return 'No date columns available in the dataset';
        case 'valueColumn':
        case 'xColumn':
        case 'yColumn':
        case 'metrics':
          return 'No numeric columns available in the dataset';
        case 'categoryColumn':
          return 'No categorical columns available in the dataset';
        default:
          return 'No suitable columns available';
      }
    }
    return null;
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
                className={`w-full p-4 rounded-lg border-2 transition-all ${
                  type === value
                    ? 'border-blue-500 bg-blue-50 shadow-sm'
                    : 'border-gray-200 hover:border-blue-200 hover:bg-gray-50'
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

      <div>
        <h3 className="text-lg font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
          Data Mapping
        </h3>
        <div className="space-y-4">
          {getRequiredColumns(type).map(({ key, label }) => {
            const error = getMappingError(key);
            const options = getColumnOptions(key);

            return (
              <div key={key}>
                <label className="block text-sm font-medium text-gray-700 mb-1">
                  {label}
                </label>
                {error ? (
                  <div className="text-sm text-red-600 mt-1">{error}</div>
                ) : key === 'metrics' ? (
                  <div className="space-y-2">
                    {options.map((column) => (
                      <label key={column} className="flex items-center space-x-2">
                        <input
                          type="checkbox"
                          checked={mapping[key]?.includes(column) || false}
                          onChange={(e) => {
                            const currentMetrics = mapping[key] ? mapping[key].split(',') : [];
                            const newMetrics = e.target.checked
                              ? [...currentMetrics, column]
                              : currentMetrics.filter(m => m !== column);
                            onMappingChange({
                              ...mapping,
                              [key]: newMetrics.join(',')
                            });
                          }}
                          className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                        />
                        <span className="text-sm text-gray-900">{column}</span>
                      </label>
                    ))}
                  </div>
                ) : (
                  <select
                    value={mapping[key] || ''}
                    onChange={(e) => onMappingChange({ ...mapping, [key]: e.target.value })}
                    className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                  >
                    <option value="">Select {label.toLowerCase()}</option>
                    {options.map((column) => (
                      <option key={column} value={column}>
                        {column}
                      </option>
                    ))}
                  </select>
                )}
              </div>
            );
          })}
        </div>
      </div>

      <div className="pt-4">
        <Button
          variant="outline"
          size="md"
          className="w-full"
          onClick={() => {
            onMappingChange({});
            onTypeChange('timeSeries');
          }}
        >
          Reset Configuration
        </Button>
      </div>
    </div>
  );
};

export default VisualizationConfig;
