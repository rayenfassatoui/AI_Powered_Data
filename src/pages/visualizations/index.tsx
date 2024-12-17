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
  const [activeVisualization, setActiveVisualization] = useState<string | null>(
    null
  );
  const [columnTypes, setColumnTypes] = useState<Record<string, string>>({});
  const [chartConfigs, setChartConfigs] = useState<ChartConfiguration[]>([]);

  const defaultChartConfig: ChartConfiguration = {
    title: "Chart Title",
    aspectRatio: 2,
    legendPosition: "bottom",
    backgroundColor: "#f7f7f7",
    borderColor: "#333",
    showGrid: false,
    animation: false,
    tension: 0.5,
    fill: true,
    pointStyle: "rect",
    borderWidth: 1,
    fontSize: 16,
    padding: 30,
    data: {
      labels: [],
      datasets: []
    }
  };

  useEffect(() => {
    if (status === "unauthenticated") {
      router.push("/auth/signin");
    }
  }, [status, router]);

  useEffect(() => {
    fetchDatasets();
  }, []);

  const detectColumnTypes = (data: any[]): Record<string, string> => {
    if (!data.length) return {};

    const types: Record<string, string> = {};
    const sample = data[0];

    Object.entries(sample).forEach(([key, value]) => {
      // Check if it's a date
      if (
        value instanceof Date ||
        (typeof value === "string" && !isNaN(Date.parse(value)))
      ) {
        types[key] = "date";
      }
      // Check if it's a number
      else if (
        typeof value === "number" ||
        (typeof value === "string" && !isNaN(Number(value)))
      ) {
        types[key] = "number";
      }
      // Default to string
      else {
        types[key] = "string";
      }
    });

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
    } finally {
      setLoading(false);
    }
  };

  const handleDatasetSelect = async (datasetId: string) => {
    try {
      setLoading(true);
      setSelectedDataset(datasetId);
      const response = await fetch(`/api/datasets/${datasetId}`);
      if (!response.ok) throw new Error("Failed to fetch dataset data");
      const result = await response.json();

      console.log('Raw dataset data:', result);

      // Parse dates in the dataset
      const parsedData = result.data.map((item: any) => {
        const parsed = { ...item };
        Object.entries(item).forEach(([key, value]) => {
          if (typeof value === "string" && !isNaN(Date.parse(value))) {
            parsed[key] = new Date(value);
          }
        });
        return parsed;
      });

      console.log('Parsed dataset data:', parsedData);
      console.log('Detected column types:', detectColumnTypes(parsedData));

      setDatasetData(parsedData);
      setColumnTypes(detectColumnTypes(parsedData));

      // Reset visualizations when changing dataset
      setVisualizations([]);
      setActiveVisualization(null);
    } catch (err) {
      console.error('Error in handleDatasetSelect:', err);
      setError(
        err instanceof Error ? err.message : "Failed to fetch dataset data"
      );
    } finally {
      setLoading(false);
    }
  };

  const addVisualization = () => {
    if (!datasetData.length) {
      console.log('No dataset data available');
      setError("Please select a dataset first");
      return;
    }

    console.log('Current dataset data:', datasetData);
    console.log('Current column types:', columnTypes);

    const newViz = {
      id: Math.random().toString(36).substr(2, 9),
      type: "timeSeries" as VisualizationType,
      mapping: {},
      config: {
        ...defaultChartConfig,
        title: `Visualization ${visualizations.length + 1}`,
        aspectRatio: 1.5,
        padding: 30,
        fontSize: 14,
      },
    };

    console.log('Adding new visualization:', newViz);
    setVisualizations([...visualizations, newViz]);
    setActiveVisualization(newViz.id);
  };

  const validateMapping = (
    type: VisualizationType,
    mapping: Record<string, string>
  ): boolean => {
    switch (type) {
      case "timeSeries":
        return !!mapping.dateColumn && !!mapping.valueColumn;
      case "distribution":
        return !!mapping.valueColumn;
      case "correlation":
        return !!mapping.xColumn && !!mapping.yColumn;
      case "pie":
        return !!mapping.categoryColumn;
      case "radar":
        return !!mapping.metrics && mapping.metrics.split(",").length > 0;
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
          if (
            updates.type &&
            !validateMapping(updates.type, updatedViz.mapping)
          ) {
            updatedViz.mapping = {};
          }
          return updatedViz;
        }
        return viz;
      })
    );
    setChartConfigs((prev) => {
      const newConfigs = [...prev];
      const index = visualizations.findIndex((v) => v.id === id);
      if (index !== -1) {
        newConfigs[index] = updates.config
          ? { ...defaultChartConfig, ...updates.config }
          : visualizations[index].config;
      }
      return newConfigs;
    });
  };

  const deleteVisualization = (id: string) => {
    setVisualizations((prevViz) => prevViz.filter((viz) => viz.id !== id));
    if (activeVisualization === id) {
      setActiveVisualization(null);
    }
    setChartConfigs((prev) =>
      prev.filter(
        (_, index) => index !== visualizations.findIndex((v) => v.id === id)
      )
    );
  };

  const getColumns = () => {
    if (!datasetData.length) return [];
    return Object.keys(datasetData[0]);
  };

  const renderChart = (visualization: {
    id: string;
    type: VisualizationType;
    mapping: Record<string, string>;
    config: ChartConfiguration;
  }) => {
    if (!datasetData.length) return null;

    return (
      <motion.div
        key={visualization.id}
        initial={{ opacity: 0, y: 20 }}
        animate={{ opacity: 1, y: 0 }}
        exit={{ opacity: 0, y: -20 }}
        className="w-full"
      >
        <Card className="p-4" gradient hoverEffect>
          <ChartComponent
            type={visualization.type}
            data={datasetData}
            mapping={visualization.mapping}
            chartConfig={visualization.config}
            id={visualization.id}
          />
        </Card>
      </motion.div>
    );
  };

  if (status === "loading") {
    return <div>Loading...</div>;
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
                      onClick={() => downloadPDF(visualizations, chartConfigs)}
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
