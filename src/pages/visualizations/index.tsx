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
import { ChartComponent } from '../../components/ChartComponent';
import ChartCustomization, { ChartConfiguration } from '@/components/ChartCustomization';

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
  const [visualizations, setVisualizations] = useState<Array<{
    id: string;
    type: VisualizationType;
    mapping: Record<string, string>;
    config: ChartConfiguration;
  }>>([]);
  const [activeVisualization, setActiveVisualization] = useState<string | null>(null);
  const [columnTypes, setColumnTypes] = useState<Record<string, string>>({});

  const addVisualization = () => {
    const newViz = {
      id: `viz-${Date.now()}`,
      type: 'timeSeries' as VisualizationType,
      mapping: {},
      config: {
        title: `Visualization ${visualizations.length + 1}`,
        aspectRatio: 2,
        legendPosition: 'top'
      }
    };
    setVisualizations(prev => [...prev, newViz]);
    setActiveVisualization(newViz.id);
  };

  const updateVisualization = (id: string, updates: Partial<{
    type: VisualizationType;
    mapping: Record<string, string>;
    config: ChartConfiguration;
  }>) => {
    setVisualizations(prev => prev.map(viz => 
      viz.id === id ? { ...viz, ...updates } : viz
    ));
  };

  const deleteVisualization = (id: string) => {
    setVisualizations(prev => prev.filter(viz => viz.id !== id));
    if (activeVisualization === id) {
      setActiveVisualization(null);
    }
  };

  const renderChart = (viz: typeof visualizations[0]) => {
    if (!datasetData) return null;

    return (
      <div 
        key={viz.id}
        className={`chart-container ${activeVisualization === viz.id ? 'active' : ''}`}
        onClick={() => setActiveVisualization(viz.id)}
      >
        <ChartComponent
          data={datasetData}
          type={viz.type}
          mapping={viz.mapping}
          chartConfig={viz.config}
        />
      </div>
    );
  };

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

  useEffect(() => {
    if (datasetData && datasetData.length > 0) {
      const sample = datasetData[0];
      const types: Record<string, string> = {};
      
      Object.entries(sample).forEach(([key, value]) => {
        if (value instanceof Date || (typeof value === 'string' && !isNaN(Date.parse(value)))) {
          types[key] = 'date';
        } else if (typeof value === 'number' || (typeof value === 'string' && !isNaN(Number(value)))) {
          types[key] = 'number';
        } else {
          types[key] = 'string';
        }
      });
      
      setColumnTypes(types);
    }
  }, [datasetData]);

  const getColumns = () => {
    if (!datasetData || datasetData.length === 0) return [];
    return Object.keys(datasetData[0]);
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

          {datasetData.length > 0 && (
            <>
              <div className="flex justify-between items-center mb-6">
                <h2 className="text-2xl font-semibold text-gray-900">Visualizations</h2>
                <Button
                  variant="primary"
                  size="md"
                  onClick={addVisualization}
                >
                  Add Visualization
                </Button>
              </div>

              {visualizations.length === 0 ? (
                <Card className="p-8 text-center">
                  <p className="text-gray-600 mb-4">No visualizations yet</p>
                  <Button
                    variant="outline"
                    size="md"
                    onClick={addVisualization}
                  >
                    Create Your First Visualization
                  </Button>
                </Card>
              ) : (
                <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
                  {/* Configuration Panel */}
                  <div className="space-y-6">
                    <Card gradient hoverEffect>
                      <div className="mb-4">
                        <label className="block text-sm font-medium text-gray-700 mb-2">
                          Select Visualization
                        </label>
                        <select
                          value={activeVisualization || ''}
                          onChange={(e) => setActiveVisualization(e.target.value)}
                          className="w-full border border-gray-300 rounded-md px-3 py-2 focus:outline-none focus:ring-2 focus:ring-blue-500 bg-white text-gray-900"
                        >
                          {visualizations.map(viz => (
                            <option key={viz.id} value={viz.id}>
                              {viz.config.title}
                            </option>
                          ))}
                        </select>
                      </div>

                      {activeVisualization && (
                        <div className="space-y-8">
                          <div>
                            <h3 className="text-lg font-semibold mb-4 bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
                              Data Mapping
                            </h3>
                            <VisualizationConfig
                              type={visualizations.find(v => v.id === activeVisualization)?.type || 'timeSeries'}
                              columns={getColumns()}
                              columnTypes={columnTypes}
                              mapping={visualizations.find(v => v.id === activeVisualization)?.mapping || {}}
                              onTypeChange={(type) => updateVisualization(activeVisualization, { type })}
                              onMappingChange={(mapping) => updateVisualization(activeVisualization, { mapping })}
                            />
                          </div>

                          <ChartCustomization
                            type={visualizations.find(v => v.id === activeVisualization)?.type || 'timeSeries'}
                            config={visualizations.find(v => v.id === activeVisualization)?.config || {}}
                            onConfigChange={(config) => updateVisualization(activeVisualization, { config })}
                          />

                          <div className="pt-4 border-t border-gray-200">
                            <Button
                              variant="danger"
                              onClick={() => deleteVisualization(activeVisualization)}
                            >
                              Delete Visualization
                            </Button>
                          </div>
                        </div>
                      )}
                    </Card>
                  </div>

                  {/* Charts Display */}
                  <div className="lg:col-span-2">
                    <div className="grid grid-cols-1 md:grid-cols-2 gap-6">
                      {visualizations.map(viz => (
                        renderChart(viz)
                      ))}
                    </div>
                  </div>
                </div>
              )}
            </>
          )}
        </div>
      </motion.div>
    </Layout>
  );
}
