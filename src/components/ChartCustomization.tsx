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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
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
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Legend Position</label>
          <select
            value={config.legendPosition}
            onChange={(e) => updateConfig({ legendPosition: e.target.value as any })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          >
            <option value="top">Top</option>
            <option value="bottom">Bottom</option>
            <option value="left">Left</option>
            <option value="right">Right</option>
          </select>
        </div>
      </div>

      {/* Style Settings */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Style Settings</h4>
        
        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Background Color</label>
            <input
              type="color"
              value={config.backgroundColor || '#ffffff'}
              onChange={(e) => updateConfig({ backgroundColor: e.target.value })}
              className="mt-1 block w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Border Color</label>
            <input
              type="color"
              value={config.borderColor || '#000000'}
              onChange={(e) => updateConfig({ borderColor: e.target.value })}
              className="mt-1 block w-full"
            />
          </div>
        </div>

        <div className="grid grid-cols-2 gap-4">
          <div>
            <label className="block text-sm font-medium text-gray-700">Border Width</label>
            <input
              type="number"
              min="0"
              max="10"
              value={config.borderWidth || 1}
              onChange={(e) => updateConfig({ borderWidth: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Font Size</label>
            <input
              type="number"
              min="8"
              max="32"
              value={config.fontSize || 12}
              onChange={(e) => updateConfig({ fontSize: parseInt(e.target.value) })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
          </div>
        </div>
      </div>

      {/* Chart-specific Settings */}
      {(type === 'timeSeries' || type === 'correlation') && (
        <div className="space-y-4">
          <h4 className="font-medium text-gray-900">Line Settings</h4>
          
          <div className="flex items-center space-x-4">
            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={config.fill}
                onChange={(e) => updateConfig({ fill: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Fill Area</span>
            </label>

            <label className="inline-flex items-center">
              <input
                type="checkbox"
                checked={config.animation}
                onChange={(e) => updateConfig({ animation: e.target.checked })}
                className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
              />
              <span className="ml-2 text-sm text-gray-700">Animation</span>
            </label>
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Line Tension</label>
            <input
              type="range"
              min="0"
              max="1"
              step="0.1"
              value={config.tension || 0}
              onChange={(e) => updateConfig({ tension: parseFloat(e.target.value) })}
              className="mt-1 block w-full"
            />
          </div>

          <div>
            <label className="block text-sm font-medium text-gray-700">Point Style</label>
            <select
              value={config.pointStyle || 'circle'}
              onChange={(e) => updateConfig({ pointStyle: e.target.value as any })}
              className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            >
              <option value="circle">Circle</option>
              <option value="cross">Cross</option>
              <option value="dash">Dash</option>
              <option value="rect">Rectangle</option>
              <option value="star">Star</option>
              <option value="triangle">Triangle</option>
            </select>
          </div>
        </div>
      )}

      {/* Grid Settings */}
      <div className="space-y-4">
        <h4 className="font-medium text-gray-900">Grid Settings</h4>
        
        <div className="flex items-center space-x-4">
          <label className="inline-flex items-center">
            <input
              type="checkbox"
              checked={config.showGrid}
              onChange={(e) => updateConfig({ showGrid: e.target.checked })}
              className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-500 focus:ring-blue-500"
            />
            <span className="ml-2 text-sm text-gray-700">Show Grid</span>
          </label>
        </div>

        <div>
          <label className="block text-sm font-medium text-gray-700">Chart Padding</label>
          <input
            type="number"
            min="0"
            max="50"
            value={config.padding || 20}
            onChange={(e) => updateConfig({ padding: parseInt(e.target.value) })}
            className="mt-1 block w-full rounded-md border-gray-300 shadow-sm focus:border-blue-500 focus:ring-blue-500"
          />
        </div>
      </div>
    </div>
  );
};

export default ChartCustomization;
