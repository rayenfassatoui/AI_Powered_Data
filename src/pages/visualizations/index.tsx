import React, { useState, useEffect } from 'react';
import { useSession } from 'next-auth/react';
import { useRouter } from 'next/router';
import Layout from '@/components/Layout';
import {
  Chart as ChartJS,
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  TimeScale
} from 'chart.js';
import { Line, Bar, Scatter, Pie, Radar } from 'react-chartjs-2';
import 'chartjs-adapter-date-fns';
import VisualizationConfig from '@/components/VisualizationConfig';
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { motion } from "framer-motion";
import { useVisualization, VisualizationType } from '@/hooks/useVisualization';

ChartJS.register(
  CategoryScale,
  LinearScale,
  PointElement,
  LineElement,
  BarElement,
  Title,
  Tooltip,
  Legend,
  ArcElement,
  RadialLinearScale,
  TimeScale
);

export default function VisualizationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [datasets, setDatasets] = useState<any[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<string>('');
  const [datasetData, setDatasetData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visualizationType, setVisualizationType] = useState<VisualizationType>('timeSeries');
  const [columnMapping, setColumnMapping] = useState<any>({});
  const [chartConfig, setChartConfig] = useState<ChartConfiguration>({
    title: 'Dataset Visualization',
    aspectRatio: 2,
    legendPosition: 'top'
  });

  const { chartData, chartOptions, error: vizError, columnTypes } = useVisualization({
    data: datasetData,
    type: visualizationType,
    mapping: columnMapping,
    chartConfig
  });

  useEffect(() => {
    if (status === 'unauthenticated') {
      router.push('/auth/signin');
      return;
    }

    // Fetch datasets
    const fetchDatasets = async () => {
      try {
        const response = await fetch('/api/datasets');
        if (!response.ok) throw new Error('Failed to fetch datasets');
        const data = await response.json();
        setDatasets(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching datasets');
      }
    };

    fetchDatasets();
  }, [status, router]);

  useEffect(() => {
    if (!selectedDataset) {
      setDatasetData([]);
      return;
    }

    const fetchDatasetData = async () => {
      setLoading(true);
      setError(null);
      try {
        const response = await fetch(`/api/datasets/${selectedDataset}/data`);
        if (!response.ok) throw new Error('Failed to fetch dataset data');
        const data = await response.json();
        setDatasetData(data);
      } catch (err) {
        setError(err instanceof Error ? err.message : 'Error fetching dataset data');
        setDatasetData([]);
      } finally {
        setLoading(false);
      }
    };

    fetchDatasetData();
  }, [selectedDataset]);

  const renderChart = () => {
    if (!chartData || !chartOptions) return null;

    const commonProps = {
      options: chartOptions,
      data: chartData,
    };

    switch (visualizationType) {
      case 'timeSeries':
        return <Line {...commonProps} />;
      case 'distribution':
        return <Bar {...commonProps} />;
      case 'correlation':
        return <Scatter {...commonProps} />;
      case 'pie':
        return <Pie {...commonProps} />;
      case 'radar':
        return <Radar {...commonProps} />;
      default:
        return null;
    }
  };

  if (status === 'loading') {
    return <div>Loading...</div>;
  }

  return (
    <Layout>
      <motion.div
        initial={{ opacity: 0 }}
        animate={{ opacity: 1 }}
        className="min-h-screen bg-gradient-to-br from-slate-50 to-white p-6"
      >
        <div className="max-w-7xl mx-auto">
          <motion.h1
            initial={{ y: -20 }}
            animate={{ y: 0 }}
            className="text-4xl font-bold mb-8 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
          >
            Data Visualization
          </motion.h1>

          {/* Dataset Selection */}
          <Card gradient className="mb-8">
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Select Dataset
            </label>
            <div className="flex gap-4">
              <select
                value={selectedDataset}
                onChange={(e) => setSelectedDataset(e.target.value)}
                className="flex-1 border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
              >
                <option value="" className="text-gray-900">Select a dataset</option>
                {datasets.map((dataset) => (
                  <option key={dataset.id} value={dataset.id} className="text-gray-900">
                    {dataset.name}
                  </option>
                ))}
              </select>
              <Button
                variant="primary"
                size="md"
                isLoading={loading}
                onClick={() => setSelectedDataset("")}
              >
                Reset
              </Button>
            </div>
          </Card>

          {loading && (
            <Card className="p-8 text-center">
              <div className="animate-spin w-8 h-8 border-4 border-blue-600 border-t-transparent rounded-full mx-auto mb-4" />
              <p className="text-gray-600">Loading dataset...</p>
            </Card>
          )}

          {error && (
            <Card className="p-8 bg-red-50 border-red-200">
              <p className="text-red-600">{error}</p>
            </Card>
          )}

          {vizError && (
            <Card className="p-8 bg-red-50 border-red-200">
              <p className="text-red-600">{vizError}</p>
            </Card>
          )}

          {datasetData.length > 0 && (
            <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
              {/* Configuration Panel */}
              <div className="space-y-6">
                <Card gradient hoverEffect>
                  <VisualizationConfig
                    type={visualizationType}
                    columns={Object.keys(datasetData[0] || {})}
                    columnTypes={columnTypes}
                    mapping={columnMapping}
                    onTypeChange={setVisualizationType}
                    onMappingChange={setColumnMapping}
                  />
                </Card>

                {/* Chart Configuration */}
                <Card gradient hoverEffect>
                  <h3 className="text-lg font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                    Chart Settings
                  </h3>
                  
                  {/* Title */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Chart Title
                    </label>
                    <input
                      type="text"
                      value={chartConfig.title || ""}
                      onChange={(e) => setChartConfig({ ...chartConfig, title: e.target.value })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>

                  {/* Aspect Ratio */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Aspect Ratio
                    </label>
                    <input
                      type="number"
                      min="0.5"
                      max="4"
                      step="0.1"
                      value={chartConfig.aspectRatio || 2}
                      onChange={(e) => setChartConfig({ ...chartConfig, aspectRatio: Number(e.target.value) })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white"
                    />
                  </div>

                  {/* Legend Position */}
                  <div className="mb-4">
                    <label className="block text-sm font-medium text-gray-700 mb-1">
                      Legend Position
                    </label>
                    <select
                      value={chartConfig.legendPosition || "top"}
                      onChange={(e) => setChartConfig({ ...chartConfig, legendPosition: e.target.value as "top" | "bottom" | "left" | "right" })}
                      className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                    >
                      <option value="top" className="text-gray-900">Top</option>
                      <option value="bottom" className="text-gray-900">Bottom</option>
                      <option value="left" className="text-gray-900">Left</option>
                      <option value="right" className="text-gray-900">Right</option>
                    </select>
                  </div>

                  {/* Animation Toggle */}
                  <div className="mb-4">
                    <label className="flex items-center space-x-2">
                      <input
                        type="checkbox"
                        checked={chartConfig.animation !== false}
                        onChange={(e) => setChartConfig({ ...chartConfig, animation: e.target.checked })}
                        className="rounded border-gray-300 text-blue-600 shadow-sm focus:border-blue-300 focus:ring focus:ring-blue-200 focus:ring-opacity-50"
                      />
                      <span className="text-sm text-gray-700">Enable Animation</span>
                    </label>
                  </div>
                </Card>
              </div>

              {/* Chart Display */}
              <div className="lg:col-span-2">
                <Card gradient hoverEffect className="h-[calc(100vh-12rem)]">
                  <div className="h-full">
                    {renderChart()}
                  </div>
                </Card>
              </div>
            </div>
          )}
        </div>
      </motion.div>
    </Layout>
  );
}
