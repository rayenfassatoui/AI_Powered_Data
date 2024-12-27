import React, { useState, useEffect } from "react";
import { useSession } from "next-auth/react";
import { useRouter } from "next/router";
import Layout from "@/components/Layout";
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
  TimeScale,
} from "chart.js";
import { Line, Bar, Scatter, Pie, Radar } from "react-chartjs-2";
import "chartjs-adapter-date-fns";
import { VisualizationConfig } from "@/components/VisualizationConfig";
import { Button } from "@/components/ui/Button";
import { Card } from "@/components/ui/Card";
import { motion, AnimatePresence } from "framer-motion";
import { useVisualization, VisualizationType } from "@/hooks/useVisualization";
import { ChartComponent } from "@/components/ChartComponent";
import ChartCustomization, { ChartConfiguration } from "@/components/ChartCustomization";
import { downloadPDF } from "@/utils/pdfGenerator";
import { FiPieChart, FiTrendingUp, FiGrid, FiDownload, FiPlus, FiTrash2, FiSettings, FiMaximize2, FiSave } from "react-icons/fi";

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

interface Visualization {
  id: string;
  type: VisualizationType;
  mapping: Record<string, string>;
  config: ChartConfiguration;
  data: any[];
}

export default function VisualizationsPage() {
  const { data: session, status } = useSession();
  const router = useRouter();
  const [datasets, setDatasets] = useState<any[]>([]);
  const [selectedDataset, setSelectedDataset] = useState<string>("");
  const [datasetData, setDatasetData] = useState<any[]>([]);
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState<string | null>(null);
  const [visualizations, setVisualizations] = useState<
    Array<{
      id: string;
      type: VisualizationType;
      mapping: Record<string, string>;
      config: ChartConfiguration;
    }>
  >([]);
  const [activeVisualization, setActiveVisualization] = useState<string | null>(null);
  const [columnTypes, setColumnTypes] = useState<Record<string, string>>({});

  const defaultChartConfig: ChartConfiguration = {
    title: "Chart Title",
    aspectRatio: 2,
    legendPosition: "bottom",
    backgroundColor: "#ffffff",
    borderColor: "#6366F1",
    showGrid: true,
    animation: true,
    tension: 0.4,
    fill: false,
    pointStyle: "circle",
    borderWidth: 2,
    fontSize: 14,
    padding: 20,
    data: {
      labels: [],
      datasets: []
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    } else if (status === "authenticated") {
      fetchDatasets();
    }
  }, [status, router]);

  const detectColumnTypes = (data: any[]): Record<string, string> => {
    if (!data.length) return {};

    const types: Record<string, string> = {};
    const sampleSize = Math.min(data.length, 100); // Check first 100 rows for better type detection

    // Initialize types based on first row
    Object.keys(data[0]).forEach(key => {
      types[key] = 'string';
    });

    // Analyze sample rows
    for (let i = 0; i < sampleSize; i++) {
      const row = data[i];
      Object.entries(row).forEach(([key, value]) => {
        // Skip null or undefined values
        if (value == null) return;

        // Check for date
        if (value instanceof Date) {
          types[key] = 'date';
          return;
        }

        if (typeof value === 'string') {
          // Try parsing as date
          const dateValue = new Date(value);
          if (!isNaN(dateValue.getTime()) && value.length > 8) {
            types[key] = 'date';
            return;
          }

          // Try parsing as number
          const numberValue = Number(value);
          if (!isNaN(numberValue) && types[key] !== 'date') {
            types[key] = 'number';
            return;
          }
        }

        if (typeof value === 'number') {
          types[key] = 'number';
        }
      });
    }

    return types;
  };

  const fetchDatasets = async () => {
    try {
      setLoading(true);
      const response = await fetch("/api/datasets");
      if (!response.ok) throw new Error("Failed to fetch datasets");
      const data = await response.json();
      setDatasets(data);
    } catch (err) {
      setError(err instanceof Error ? err.message : "Failed to fetch datasets");
      console.error("Error fetching datasets:", err);
    } finally {
      setLoading(false);
    }
  };

  const handleDatasetSelect = async (datasetId: string) => {
    try {
      setLoading(true);
      setError(null);
      setSelectedDataset(datasetId);

      const response = await fetch(`/api/datasets/${datasetId}`);
      if (!response.ok) throw new Error("Failed to fetch dataset data");
      const result = await response.json();

      // Parse dates and numbers in the dataset
      const parsedData = result.data.map((item: any) => {
        const parsed = { ...item };
        Object.entries(item).forEach(([key, value]) => {
          if (typeof value === "string") {
            // Try parsing as date first
            const dateValue = new Date(value);
            if (!isNaN(dateValue.getTime()) && value.length > 8) {
              parsed[key] = dateValue;
              return;
            }
            // Try parsing as number
            const numberValue = Number(value);
            if (!isNaN(numberValue)) {
              parsed[key] = numberValue;
            }
          }
        });
        return parsed;
      });

      console.log('Parsed dataset data:', parsedData.slice(0, 5));
      
      const detectedTypes = detectColumnTypes(parsedData);
      console.log('Detected column types:', detectedTypes);

      setDatasetData(parsedData);
      setColumnTypes(detectedTypes);

      // Reset visualizations when changing dataset
      setVisualizations([]);
      setActiveVisualization(null);
    } catch (err) {
      console.error('Error in handleDatasetSelect:', err);
      setError(err instanceof Error ? err.message : "Failed to fetch dataset data");
    } finally {
      setLoading(false);
    }
  };

  const addVisualization = () => {
    if (!datasetData.length) {
      setError("Please select a dataset first");
      return;
    }

    // Determine the best initial visualization type based on column types
    let initialType: VisualizationType = "bar";
    const columns = Object.entries(columnTypes);
    const hasDate = columns.some(([_, type]) => type === 'date');
    const hasNumber = columns.some(([_, type]) => type === 'number');

    if (hasDate && hasNumber) {
      initialType = "timeSeries";
    } else if (hasNumber) {
      initialType = "bar";
    } else {
      initialType = "pie";
    }

    const newViz = {
      id: Math.random().toString(36).substr(2, 9),
      type: initialType,
      mapping: {},
      config: {
        ...defaultChartConfig,
        title: `Visualization ${visualizations.length + 1}`,
      },
    };

    setVisualizations([...visualizations, newViz]);
    setActiveVisualization(newViz.id);
  };

  const validateMapping = (
    type: VisualizationType,
    mapping: Record<string, string>
  ): boolean => {
    const hasValidColumns = (columns: string[]) => 
      columns.every(col => mapping[col] && columnTypes[mapping[col]]);

    switch (type) {
      case "timeSeries":
        return hasValidColumns(['dateColumn', 'valueColumn']) &&
               columnTypes[mapping.dateColumn] === 'date' &&
               columnTypes[mapping.valueColumn] === 'number';
      
      case "line":
      case "area":
        return hasValidColumns(['xColumn', 'valueColumn']) &&
               columnTypes[mapping.valueColumn] === 'number';
      
      case "bar":
        return hasValidColumns(['categoryColumn', 'valueColumn']) &&
               columnTypes[mapping.valueColumn] === 'number';
      
      case "pie":
      case "doughnut":
      case "polarArea":
        return hasValidColumns(['categoryColumn', 'valueColumn']) &&
               columnTypes[mapping.valueColumn] === 'number';
      
      case "scatter":
      case "bubble":
        return hasValidColumns(['xColumn', 'yColumn']) &&
               columnTypes[mapping.xColumn] === 'number' &&
               columnTypes[mapping.yColumn] === 'number';
      
      case "radar":
        return mapping.metrics?.split(',').length >= 3 &&
               mapping.metrics.split(',').every(metric => 
                 columnTypes[metric] === 'number'
               );
      
      default:
        return false;
    }
  };

  const updateVisualization = (
    id: string,
    updates: Partial<{
      type: VisualizationType;
      mapping: Record<string, string>;
      config: ChartConfiguration;
    }>
  ) => {
    setVisualizations((prevViz) =>
      prevViz.map((viz) => {
        if (viz.id === id) {
          const updatedViz = {
            ...viz,
            ...updates,
            config: updates.config
              ? { ...defaultChartConfig, ...updates.config }
              : viz.config,
          };
          
          // Reset mapping if changing visualization type
          if (updates.type && viz.type !== updates.type) {
            updatedViz.mapping = {};
          }
          
          return updatedViz;
        }
        return viz;
      })
    );
  };

  const deleteVisualization = (id: string) => {
    setVisualizations((prevViz) => prevViz.filter((viz) => viz.id !== id));
    if (activeVisualization === id) {
      setActiveVisualization(null);
    }
  };

  const getColumns = () => {
    if (!datasetData.length) return [];
    return Object.keys(datasetData[0]);
  };

  if (status === "loading") {
    return (
      <Layout>
        <div className="flex items-center justify-center min-h-screen">
          <div className="relative w-16 h-16">
            <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-blue-200 animate-pulse"></div>
            <div className="absolute top-0 left-0 w-full h-full rounded-full border-4 border-blue-500 border-t-transparent animate-spin"></div>
          </div>
        </div>
      </Layout>
    );
  }

  return (
    <Layout>
      <div className="min-h-screen bg-gray-50/50">
        {/* Hero Section */}
        <div className="relative overflow-hidden bg-white shadow-sm">
          <div className="absolute inset-0 bg-gradient-to-br from-blue-500/5 via-indigo-500/5 to-purple-500/5"></div>
          <div className="absolute -top-24 -right-20 w-96 h-96 bg-gradient-to-br from-blue-500/10 via-indigo-500/10 to-purple-500/10 blur-3xl rounded-full transform rotate-12"></div>
          <div className="absolute -bottom-24 -left-20 w-96 h-96 bg-gradient-to-tr from-green-500/10 via-blue-500/10 to-purple-500/10 blur-3xl rounded-full transform -rotate-12"></div>
          
          <div className="relative max-w-7xl mx-auto py-12 px-4 sm:px-6 lg:px-8">
            <div className="lg:grid lg:grid-cols-12 lg:gap-8">
              <div className="sm:text-center md:max-w-2xl md:mx-auto lg:col-span-6 lg:text-left">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  transition={{ duration: 0.5 }}
                >
                  <h1>
                    <span className="block text-sm font-semibold text-blue-600 tracking-wide uppercase">
                      Data Visualization
                    </span>
                    <span className="mt-1 block text-4xl font-extrabold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 via-indigo-600 to-purple-600 sm:text-5xl">
                      Transform Your Data
                    </span>
                  </h1>
                  <p className="mt-3 text-base text-gray-500 sm:mt-5 sm:text-xl lg:text-lg xl:text-xl">
                    Create stunning visualizations from your datasets with our intuitive tools.
                    Gain insights and tell compelling stories through data.
                  </p>
                </motion.div>
              </div>
              <div className="mt-12 relative sm:max-w-lg sm:mx-auto lg:mt-0 lg:max-w-none lg:mx-0 lg:col-span-6 lg:flex lg:items-center">
                <div className="relative mx-auto w-full rounded-lg shadow-lg lg:max-w-md">
                  <motion.div
                    initial={{ opacity: 0, scale: 0.95 }}
                    animate={{ opacity: 1, scale: 1 }}
                    transition={{ duration: 0.5, delay: 0.2 }}
                    className="relative block w-full bg-white rounded-lg overflow-hidden"
                  >
                    <div className="p-8">
                      <div className="grid grid-cols-2 gap-4">
                        {[
                          { icon: FiPieChart, color: "blue" },
                          { icon: FiTrendingUp, color: "indigo" },
                          { icon: FiGrid, color: "purple" },
                          { icon: FiMaximize2, color: "green" }
                        ].map((item, index) => (
                          <motion.div
                            key={index}
                            whileHover={{ scale: 1.05 }}
                            whileTap={{ scale: 0.95 }}
                            className={`p-6 rounded-xl bg-gradient-to-br from-${item.color}-500/10 to-${item.color}-600/20 flex items-center justify-center`}
                          >
                            <item.icon className={`w-8 h-8 text-${item.color}-600`} />
                          </motion.div>
                        ))}
                      </div>
                    </div>
                  </motion.div>
                </div>
              </div>
            </div>
          </div>
        </div>

        {/* Main Content */}
        <div className="max-w-7xl mx-auto px-4 sm:px-6 lg:px-8 py-12">
          <div className="flex flex-col lg:flex-row gap-8">
            {/* Sidebar */}
            <div className="lg:w-80">
              <motion.div
                initial={{ opacity: 0, x: -20 }}
                animate={{ opacity: 1, x: 0 }}
                className="sticky top-20"
              >
                <Card className="overflow-hidden backdrop-blur-xl bg-white/80">
                  <div className="p-6">
                    <h2 className="text-lg font-semibold text-gray-900 mb-4">
                      Dataset Selection
                    </h2>
                    <select
                      value={selectedDataset}
                      onChange={(e) => handleDatasetSelect(e.target.value)}
                      className="w-full px-3 py-2 bg-white border border-gray-300 rounded-lg shadow-sm focus:border-blue-500 focus:ring-1 focus:ring-blue-500"
                    >
                      <option value="">Select a dataset</option>
                      {datasets.map((dataset) => (
                        <option key={dataset.id} value={dataset.id}>
                          {dataset.name}
                        </option>
                      ))}
                    </select>

                    {activeVisualization && (
                      <motion.div
                        initial={{ opacity: 0, y: 20 }}
                        animate={{ opacity: 1, y: 0 }}
                        className="mt-6 space-y-6"
                      >
                        <VisualizationConfig
                          columns={getColumns()}
                          columnTypes={columnTypes}
                          type={visualizations.find((v) => v.id === activeVisualization)?.type || "timeSeries"}
                          mapping={visualizations.find((v) => v.id === activeVisualization)?.mapping || {}}
                          onTypeChange={(type) => updateVisualization(activeVisualization, { type })}
                          onMappingChange={(mapping) => updateVisualization(activeVisualization, { mapping })}
                        />
                        <ChartCustomization
                          type={visualizations.find((v) => v.id === activeVisualization)?.type || "timeSeries"}
                          config={visualizations.find((v) => v.id === activeVisualization)?.config || defaultChartConfig}
                          onConfigChange={(config) => updateVisualization(activeVisualization, { config })}
                        />
                      </motion.div>
                    )}
                  </div>
                </Card>
              </motion.div>
            </div>

            {/* Main Content */}
            <div className="flex-1">
              <div className="mb-8 flex justify-between items-center">
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="flex gap-4"
                >
                  <Button
                    onClick={addVisualization}
                    className="inline-flex items-center px-6 py-3 shadow-lg shadow-blue-500/30 border border-transparent text-base font-medium rounded-xl text-white bg-gradient-to-r from-blue-600 to-indigo-600 hover:from-blue-700 hover:to-indigo-700 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform hover:scale-105 transition-all duration-200"
                  >
                    <FiPlus className="w-5 h-5 mr-2" />
                    Add Visualization
                  </Button>

                  {visualizations.length > 0 && (
                    <Button
                      onClick={() => downloadPDF(visualizations)}
                      variant="outline"
                      className="inline-flex items-center px-6 py-3 border border-gray-300 shadow-lg text-base font-medium rounded-xl text-gray-700 bg-white hover:bg-gray-50 focus:outline-none focus:ring-2 focus:ring-offset-2 focus:ring-blue-500 transform hover:scale-105 transition-all duration-200"
                    >
                      <FiDownload className="w-5 h-5 mr-2" />
                      Export PDF
                    </Button>
                  )}
                </motion.div>
              </div>

              <AnimatePresence mode="popLayout">
                <motion.div className="grid gap-8">
                  {visualizations.map((viz) => (
                    <motion.div
                      key={viz.id}
                      layout
                      initial={{ opacity: 0, y: 20 }}
                      animate={{ opacity: 1, y: 0 }}
                      exit={{ opacity: 0, y: -20 }}
                      className={`group ${activeVisualization === viz.id ? 'ring-2 ring-blue-500' : ''}`}
                    >
                      <Card className="overflow-hidden backdrop-blur-xl bg-white/80">
                        <div className="relative">
                          {/* Decorative elements */}
                          <div className="absolute top-0 right-0 w-40 h-40 bg-gradient-to-br from-blue-500/10 via-purple-500/10 to-pink-500/10 blur-3xl transform rotate-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>
                          <div className="absolute bottom-0 left-0 w-40 h-40 bg-gradient-to-tr from-green-500/10 via-blue-500/10 to-purple-500/10 blur-3xl transform -rotate-12 opacity-0 group-hover:opacity-100 transition-opacity duration-500"></div>

                          <div className="relative p-6">
                            <div className="flex justify-between items-center mb-4">
                              <motion.h3
                                layout
                                className="text-lg font-semibold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600"
                              >
                                {viz.config.title || `Visualization ${visualizations.indexOf(viz) + 1}`}
                              </motion.h3>
                              <div className="flex gap-2">
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => setActiveVisualization(viz.id)}
                                  className="text-gray-600 hover:text-blue-600"
                                >
                                  <FiSettings className="w-4 h-4" />
                                </Button>
                                <Button
                                  variant="ghost"
                                  size="sm"
                                  onClick={() => deleteVisualization(viz.id)}
                                  className="text-gray-600 hover:text-red-600"
                                >
                                  <FiTrash2 className="w-4 h-4" />
                                </Button>
                              </div>
                            </div>

                            <div className="min-h-[400px] bg-white rounded-xl p-4 shadow-inner">
                              <div
                                data-viz-id={viz.id}
                                className="w-full h-[400px] bg-white"
                                style={{ position: 'relative' }}
                              >
                                <ChartComponent
                                  id={viz.id}
                                  data={datasetData}
                                  type={viz.type}
                                  mapping={viz.mapping}
                                  chartConfig={viz.config}
                                />
                              </div>
                            </div>
                          </div>
                        </div>
                      </Card>
                    </motion.div>
                  ))}
                </motion.div>
              </AnimatePresence>

              {!visualizations.length && (
                <motion.div
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  className="text-center py-12"
                >
                  <div className="mx-auto h-24 w-24 flex items-center justify-center rounded-full bg-gradient-to-br from-blue-500/20 to-indigo-500/30 mb-6">
                    <FiPieChart className="h-12 w-12 text-blue-600" />
                  </div>
                  <h3 className="text-lg font-medium text-gray-900">No visualizations yet</h3>
                  <p className="mt-2 text-sm text-gray-500">
                    Get started by selecting a dataset and adding your first visualization
                  </p>
                </motion.div>
              )}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
