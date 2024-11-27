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

const visualizationTypes: { value: VisualizationType; label: string; description: string }[] = [
  { value: 'timeSeries', label: 'Time Series', description: 'Visualize data points over time' },
  { value: 'distribution', label: 'Distribution', description: 'Show data distribution patterns' },
  { value: 'correlation', label: 'Correlation', description: 'Analyze relationships between variables' },
  { value: 'pie', label: 'Pie Chart', description: 'Display part-to-whole relationships' },
  { value: 'radar', label: 'Radar Chart', description: 'Compare multiple variables' },
];

const VisualizationConfig: React.FC<VisualizationConfigProps> = ({
  type,
  columns,
  columnTypes,
  mapping,
  onTypeChange,
  onMappingChange,
}) => {
  const getRequiredColumns = (type: VisualizationType): { key: string; label: string }[] => {
    switch (type) {
      case 'timeSeries':
        return [
          { key: 'dateColumn', label: 'Date' },
          { key: 'valueColumn', label: 'Value' }
        ];
      case 'distribution':
        return [{ key: 'valueColumn', label: 'Value' }];
      case 'correlation':
        return [
          { key: 'xColumn', label: 'X Axis' },
          { key: 'yColumn', label: 'Y Axis' }
        ];
      case 'pie':
        return [
          { key: 'categoryColumn', label: 'Category' },
          { key: 'valueColumn', label: 'Value (Optional)' }
        ];
      case 'radar':
        return [{ key: 'metrics', label: 'Metrics' }];
      default:
        return [];
    }
  };

  const getColumnOptions = (required: string) => {
    switch (required) {
      case 'dateColumn':
        return columns.filter(col => columnTypes[col] === 'date');
      case 'valueColumn':
      case 'xColumn':
      case 'yColumn':
        return columns.filter(col => columnTypes[col] === 'number');
      case 'categoryColumn':
        return columns.filter(col => columnTypes[col] === 'string');
      case 'metrics':
        return columns.filter(col => columnTypes[col] === 'number');
      default:
        return columns;
    }
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
                  onTypeChange(value);
                  onMappingChange({});
                }}
                className={`w-full p-4 rounded-lg border-2 transition-all ${
                  type === value
                    ? 'border-blue-500 bg-blue-50'
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
          {getRequiredColumns(type).map(({ key, label }) => (
            <div key={key}>
              <label className="block text-sm font-medium text-gray-700 mb-1">
                {label}
              </label>
              {key === 'metrics' ? (
                <div className="space-y-2">
                  {getColumnOptions(key).map((column) => (
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
                  <option value="" className="text-gray-900">Select {label.toLowerCase()}</option>
                  {getColumnOptions(key).map((column) => (
                    <option key={column} value={column} className="text-gray-900">
                      {column}
                    </option>
                  ))}
                </select>
              )}
            </div>
          ))}
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
