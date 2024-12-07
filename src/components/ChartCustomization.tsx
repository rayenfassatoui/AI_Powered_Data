import React from 'react';
import { VisualizationType } from '@/types/visualization';

interface ChartCustomizationProps {
  type: VisualizationType;
  config: ChartConfiguration;
  onConfigChange: (config: ChartConfiguration) => void;
}

export interface ChartConfiguration {
  title: string;
  aspectRatio: number;
  legendPosition: 'top' | 'bottom' | 'left' | 'right';
  backgroundColor?: string;
  borderColor?: string;
  showGrid?: boolean;
  animation?: boolean;
  tension?: number;
  fill?: boolean;
  pointStyle?: 'circle' | 'cross' | 'dash' | 'rect' | 'star' | 'triangle';
  borderWidth?: number;
  fontSize?: number;
  padding?: number;
}

const ChartCustomization: React.FC<ChartCustomizationProps> = ({
  type,
  config,
  onConfigChange,
}) => {
  const updateConfig = (updates: Partial<ChartConfiguration>) => {
    onConfigChange({ ...config, ...updates });
  };

  return (
    <div className="space-y-6">
      <h3 className="text-lg font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
        Chart Customization
      </h3>

      {/* Basic Settings */}
      <div className="space-y-4">
        <div>
          <label className="block text-sm font-medium text-gray-700">Chart Title</label>
          <input
            type="text"
            value={config.title}
            onChange={(e) => updateConfig({ title: e.target.value })}
            className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 rounded-md border border-gray-300 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
              placeholder-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Aspect Ratio</label>
          <input
            type="number"
            min="0.5"
            max="4"
            step="0.1"
            value={config.aspectRatio}
            onChange={(e) => updateConfig({ aspectRatio: parseFloat(e.target.value) })}
            className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 rounded-md border border-gray-300 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent 
              placeholder-gray-400"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Legend Position</label>
          <select
            value={config.legendPosition}
            onChange={(e) => updateConfig({ legendPosition: e.target.value as any })}
            className="mt-1 block w-full px-3 py-2 bg-white text-gray-900 rounded-md border border-gray-300 
              focus:outline-none focus:ring-2 focus:ring-blue-500 focus:border-transparent"
          >
            <option value="top">Top</option>
            <option value="bottom">Bottom</option>
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
        </div>
      </div>
    </div>
  );
};

export default ChartCustomization;
