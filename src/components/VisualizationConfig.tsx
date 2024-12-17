import React from 'react';
import { Button } from './ui/button';
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

export function VisualizationConfig({
  type,
  columns,
  columnTypes,
  mapping,
  onTypeChange,
  onMappingChange,
}: VisualizationConfigProps) {
  const selectedType = visualizationTypes.find(vizType => vizType.value === type);

  const getFilteredColumns = (key: string) => {
    if (key === 'dateColumn') {
      return columns.filter(col => columnTypes[col] === 'date');
    }
    if (key === 'valueColumn' || key === 'xColumn' || key === 'yColumn') {
      return columns.filter(col => columnTypes[col] === 'number');
    }
    if (key === 'categoryColumn') {
      return columns.filter(col => columnTypes[col] === 'string');
    }
    return columns;
  };

  const handleMappingChange = (key: string, value: string) => {
    const newMapping = { ...mapping, [key]: value };
    
    // Auto-select first available column for required fields
    if (selectedType) {
      selectedType.requiredColumns.forEach(({ key: reqKey }) => {
        if (!newMapping[reqKey]) {
          const availableColumns = getFilteredColumns(reqKey);
          if (availableColumns.length > 0) {
            newMapping[reqKey] = availableColumns[0];
          }
        }
      });
    }
    
    onMappingChange(newMapping);
  };

  const handleTypeChange = (newType: VisualizationType) => {
    onTypeChange(newType);
    
    // Initialize mapping with first available columns for the new type
    const typeConfig = visualizationTypes.find(vt => vt.value === newType);
    if (typeConfig) {
      const initialMapping: Record<string, string> = {};
      typeConfig.requiredColumns.forEach(({ key }) => {
        const availableColumns = getFilteredColumns(key);
        if (availableColumns.length > 0) {
          initialMapping[key] = availableColumns[0];
        }
      });
      onMappingChange(initialMapping);
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
                onClick={() => handleTypeChange(value as VisualizationType)}
                className={`w-full text-left px-4 py-3 rounded-lg border ${
                  type === value 
                    ? 'border-blue-500 bg-blue-50 text-blue-700'
                    : 'border-gray-200 hover:border-blue-200 hover:bg-blue-50/50'
                }`}
              >
                <div className="flex flex-col">
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
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
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
          className="w-full text-red-600 border-red-200 hover:bg-red-50"
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
}
