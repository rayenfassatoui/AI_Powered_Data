import React from 'react';
import { VisualizationType } from '@/hooks/useVisualization';

interface VisualizationConfigProps {
  columns: string[];
  columnTypes: Record<string, string>;
  type: VisualizationType;
  mapping: Record<string, string>;
  onTypeChange: (type: VisualizationType) => void;
  onMappingChange: (mapping: Record<string, string>) => void;
}

export const VisualizationConfig: React.FC<VisualizationConfigProps> = ({
  columns,
  columnTypes,
  type,
  mapping,
  onTypeChange,
  onMappingChange,
}) => {
  const chartTypes: { value: VisualizationType; label: string }[] = [
    { value: 'line', label: 'Line Chart' },
    { value: 'bar', label: 'Bar Chart' },
    { value: 'pie', label: 'Pie Chart' },
    { value: 'doughnut', label: 'Doughnut Chart' },
    { value: 'polarArea', label: 'Polar Area' },
    { value: 'scatter', label: 'Scatter Plot' },
    { value: 'radar', label: 'Radar Chart' },
    { value: 'timeSeries', label: 'Time Series' },
  ];

  const handleMappingChange = (key: string, value: string) => {
    onMappingChange({ ...mapping, [key]: value });
  };

  const renderColumnSelect = (
    label: string,
    key: string,
    filter?: (columnName: string) => boolean
  ) => {
    const filteredColumns = filter ? columns.filter(col => filter(col)) : columns;

    return (
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          {label}
        </label>
        <select
          value={mapping[key] || ''}
          onChange={(e) => handleMappingChange(key, e.target.value)}
          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          <option value="">Select column</option>
          {filteredColumns.map((column) => (
            <option key={column} value={column}>
              {column} ({columnTypes[column]})
            </option>
          ))}
        </select>
      </div>
    );
  };

  const renderMappingFields = () => {
    switch (type) {
      case 'timeSeries':
        return (
          <>
            {renderColumnSelect('Date Column', 'dateColumn', (col) => columnTypes[col] === 'date')}
            {renderColumnSelect('Value Column', 'valueColumn', (col) => columnTypes[col] === 'number')}
          </>
        );

      case 'line':
        return (
          <>
            {renderColumnSelect('X-Axis', 'xColumn')}
            {renderColumnSelect('Y-Axis', 'valueColumn', (col) => columnTypes[col] === 'number')}
          </>
        );

      case 'bar':
        return (
          <>
            {renderColumnSelect('Category Column', 'categoryColumn')}
            {renderColumnSelect('Value Column', 'valueColumn', (col) => columnTypes[col] === 'number')}
          </>
        );

      case 'pie':
      case 'doughnut':
      case 'polarArea':
        return (
          <>
            {renderColumnSelect('Category Column', 'categoryColumn')}
            {renderColumnSelect('Value Column', 'valueColumn', (col) => columnTypes[col] === 'number')}
          </>
        );

      case 'scatter':
        return (
          <>
            {renderColumnSelect('X-Axis', 'xColumn', (col) => columnTypes[col] === 'number')}
            {renderColumnSelect('Y-Axis', 'yColumn', (col) => columnTypes[col] === 'number')}
          </>
        );

      case 'radar':
        return (
          <>
            {renderColumnSelect('Category Column', 'categoryColumn')}
            <div className="mb-4">
              <label className="block text-sm font-medium text-gray-700 mb-1">
                Metrics
              </label>
              <select
                multiple
                value={mapping.metrics?.split(',') || []}
                onChange={(e) => {
                  const selected = Array.from(e.target.selectedOptions).map(option => option.value);
                  handleMappingChange('metrics', selected.join(','));
                }}
                className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
              >
                {columns
                  .filter(col => columnTypes[col] === 'number')
                  .map((column) => (
                    <option key={column} value={column}>
                      {column}
                    </option>
                  ))}
              </select>
              <p className="mt-1 text-sm text-gray-500">
                Hold Ctrl/Cmd to select multiple metrics
              </p>
            </div>
          </>
        );

      default:
        return null;
    }
  };

  return (
    <div className="space-y-6">
      <div className="mb-4">
        <label className="block text-sm font-medium text-gray-700 mb-1">
          Chart Type
        </label>
        <select
          value={type}
          onChange={(e) => onTypeChange(e.target.value as VisualizationType)}
          className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
        >
          {chartTypes.map(({ value, label }) => (
            <option key={value} value={value}>
              {label}
            </option>
          ))}
        </select>
      </div>

      {renderMappingFields()}
    </div>
  );
};
