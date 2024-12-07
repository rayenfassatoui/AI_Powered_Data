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
import VisualizationConfig from "@/components/VisualizationConfig";
import Button from "@/components/ui/Button";
import Card from "@/components/ui/Card";
import { motion } from "framer-motion";
import { useVisualization, VisualizationType } from "@/hooks/useVisualization";
import { ChartComponent } from "../../components/ChartComponent";
import ChartCustomization, {
  ChartConfiguration,
} from "@/components/ChartCustomization";
import { downloadPDF } from "@/utils/pdfGenerator";

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

      setDatasetData(parsedData);
      setColumnTypes(detectColumnTypes(parsedData));

      // Reset visualizations when changing dataset
      setVisualizations([]);
      setActiveVisualization(null);
    } catch (err) {
      setError(
        err instanceof Error ? err.message : "Failed to fetch dataset data"
      );
    } finally {
      setLoading(false);
    }
  };

  const addVisualization = () => {
    if (!datasetData.length) {
      setError("Please select a dataset first");
      return;
    }

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
            config={visualization.config}
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
      <div className="container mx-auto px-4 py-8">
        <div className="flex justify-between items-center mb-8">
          <h1 className="text-3xl font-bold bg-clip-text text-transparent bg-gradient-to-r from-blue-600 to-indigo-600">
            Data Visualizations
          </h1>
          <div className="flex gap-4">
            <Button onClick={addVisualization} variant="primary" size="lg">
              Add Visualization
            </Button>
            {visualizations.length > 0 && (
              <Button 
                onClick={() => downloadPDF(visualizations, chartConfigs)} 
                variant="outline" 
                size="lg"
                className="text-gray-900 border-gray-300 hover:bg-gray-50"
              >
                Export to PDF
              </Button>
            )}
          </div>
        </div>

        <div className="grid grid-cols-1 lg:grid-cols-4 gap-8">
          <Card className="lg:col-span-1 h-fit">
            <div className="p-6">
              <div className="mb-6">
                <label className="block text-sm font-medium text-gray-700 mb-2">
                  Select Dataset
                </label>
                <select
                  value={selectedDataset}
                  onChange={(e) => handleDatasetSelect(e.target.value)}
                  className="chart-control w-full"
                >
                  <option value="">Select a dataset</option>
                  {datasets.map((dataset) => (
                    <option key={dataset.id} value={dataset.id}>
                      {dataset.name}
                    </option>
                  ))}
                </select>
              </div>

              {activeVisualization && (
                <>
                  <VisualizationConfig
                    columns={getColumns()}
                    columnTypes={columnTypes}
                    type={
                      visualizations.find((v) => v.id === activeVisualization)
                        ?.type || "timeSeries"
                    }
                    mapping={
                      visualizations.find((v) => v.id === activeVisualization)
                        ?.mapping || {}
                    }
                    onTypeChange={(type) =>
                      updateVisualization(activeVisualization, { type })
                    }
                    onMappingChange={(mapping) =>
                      updateVisualization(activeVisualization, { mapping })
                    }
                  />
                  <div className="mt-6">
                    <ChartCustomization
                      type={
                        visualizations.find((v) => v.id === activeVisualization)
                          ?.type || "timeSeries"
                      }
                      config={
                        visualizations.find((v) => v.id === activeVisualization)
                          ?.config || defaultChartConfig
                      }
                      onConfigChange={(config) =>
                        updateVisualization(activeVisualization, { config })
                      }
                    />
                  </div>
                </>
              )}
            </div>
          </Card>

          <div className="lg:col-span-3">
            <div className="grid grid-cols-1 gap-8">
              {visualizations.map((viz) => (
                <motion.div
                  key={viz.id}
                  initial={{ opacity: 0, y: 20 }}
                  animate={{ opacity: 1, y: 0 }}
                  exit={{ opacity: 0, y: -20 }}
                  className={`visualization-card ${
                    activeVisualization === viz.id
                      ? "visualization-card-active"
                      : ""
                  }`}
                  onClick={() => setActiveVisualization(viz.id)}
                >
                  <div className="chart-container">
                    <div className="visualization-controls">
                      <Button
                        variant="secondary"
                        size="sm"
                        className="visualization-control-button text-red-600 hover:text-red-700 hover:bg-red-50"
                        onClick={(e) => {
                          e.stopPropagation();
                          deleteVisualization(viz.id);
                        }}
                      >
                        Delete
                      </Button>
                    </div>
                    <div className="min-h-[500px]">
                      <ChartComponent
                        id={viz.id}
                        data={datasetData}
                        type={viz.type}
                        mapping={viz.mapping}
                        chartConfig={viz.config}
                      />
                    </div>
                  </div>
                </motion.div>
              ))}
            </div>
          </div>
        </div>
      </div>
    </Layout>
  );
}
