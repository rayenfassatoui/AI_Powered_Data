import { useState, useEffect } from 'react';
import { ChartData, ChartOptions } from 'chart.js';
import {
  processTimeSeriesData,
  processDistributionData,
  processCorrelationData,
  processPieChartData,
  processRadarData,
  detectColumnTypes,
  ChartConfiguration
} from '../utils/visualizationUtils';

export type VisualizationType = 
  | 'timeSeries'
  | 'distribution'
  | 'correlation'
  | 'pie'
  | 'radar';

export interface UseVisualizationProps {
  data: any[];
  type: VisualizationType;
  mapping: Record<string, string>;
  chartConfig?: ChartConfiguration;
}

export function useVisualization({ data, type, mapping, chartConfig }: UseVisualizationProps) {
  const [chartData, setChartData] = useState<ChartData<any> | null>(null);
  const [chartOptions, setChartOptions] = useState<ChartOptions | null>(null);
  const [error, setError] = useState<string | null>(null);
  const [columnTypes, setColumnTypes] = useState<Record<string, string>>({});

  useEffect(() => {
    if (!data || data.length === 0) {
      setError('No data available');
      setChartData(null);
      setChartOptions(null);
      return;
    }

    // Detect column types
    const types = detectColumnTypes(data);
    setColumnTypes(types);

    try {
      let processedResult: { data: ChartData<any>, options: ChartOptions } | null = null;

      switch (type) {
        case 'timeSeries':
          if (!mapping.dateColumn || !mapping.valueColumn) {
            setError('Please select both date and value columns');
            break;
          }
          if (types[mapping.dateColumn] !== 'date') {
            setError('Selected date column must contain valid dates');
            break;
          }
          if (types[mapping.valueColumn] !== 'number') {
            setError('Selected value column must contain numbers');
            break;
          }
          processedResult = processTimeSeriesData(data, mapping.dateColumn, mapping.valueColumn, chartConfig);
          break;

        case 'distribution':
          if (!mapping.valueColumn) {
            setError('Please select a value column');
            break;
          }
          if (types[mapping.valueColumn] !== 'number') {
            setError('Selected value column must contain numbers');
            break;
          }
          processedResult = processDistributionData(data, mapping.valueColumn, 20, chartConfig);
          break;

        case 'correlation':
          if (!mapping.xColumn || !mapping.yColumn) {
            setError('Please select both X and Y columns');
            break;
          }
          if (types[mapping.xColumn] !== 'number' || types[mapping.yColumn] !== 'number') {
            setError('Both X and Y columns must contain numbers');
            break;
          }
          processedResult = processCorrelationData(data, mapping.xColumn, mapping.yColumn, chartConfig);
          break;

        case 'pie':
          if (!mapping.categoryColumn) {
            setError('Please select a category column');
            break;
          }
          if (types[mapping.categoryColumn] !== 'string') {
            setError('Category column must contain text values');
            break;
          }
          if (mapping.valueColumn && types[mapping.valueColumn] !== 'number') {
            setError('Value column must contain numbers');
            break;
          }
          processedResult = processPieChartData(data, mapping.categoryColumn, mapping.valueColumn, chartConfig);
          break;

        case 'radar':
          if (!mapping.metrics) {
            setError('Please select at least one metric');
            break;
          }
          const metrics = mapping.metrics.split(',').filter(Boolean);
          if (metrics.length === 0) {
            setError('Please select at least one metric');
            break;
          }
          if (!metrics.every(metric => types[metric] === 'number')) {
            setError('All selected metrics must contain numbers');
            break;
          }
          processedResult = processRadarData(data, metrics, mapping.categoryColumn, chartConfig);
          break;

        default:
          setError('Unsupported visualization type');
          break;
      }

      if (processedResult) {
        setChartData(processedResult.data);
        setChartOptions(processedResult.options);
        setError(null);
      } else if (!error) {
        setChartData(null);
        setChartOptions(null);
      }
    } catch (err) {
      setError(err instanceof Error ? err.message : 'Error processing data');
      setChartData(null);
      setChartOptions(null);
    }
  }, [data, type, mapping, chartConfig]);

  return {
    chartData,
    chartOptions,
    error,
    columnTypes
  };
}

// Validation helper functions
export function validateTimeSeriesMapping(mapping: Record<string, string>, columnTypes: Record<string, string>): string | null {
  if (!mapping.dateColumn || columnTypes[mapping.dateColumn] !== 'date') {
    return 'Invalid or missing date column';
  }
  if (!mapping.valueColumn || columnTypes[mapping.valueColumn] !== 'number') {
    return 'Invalid or missing value column';
  }
  return null;
}

export function validateDistributionMapping(mapping: Record<string, string>, columnTypes: Record<string, string>): string | null {
  if (!mapping.valueColumn || columnTypes[mapping.valueColumn] !== 'number') {
    return 'Invalid or missing value column';
  }
  return null;
}

export function validateCorrelationMapping(mapping: Record<string, string>, columnTypes: Record<string, string>): string | null {
  if (!mapping.xColumn || columnTypes[mapping.xColumn] !== 'number') {
    return 'Invalid or missing X column';
  }
  if (!mapping.yColumn || columnTypes[mapping.yColumn] !== 'number') {
    return 'Invalid or missing Y column';
  }
  return null;
}

export function validatePieChartMapping(mapping: Record<string, string>, columnTypes: Record<string, string>): string | null {
  if (!mapping.categoryColumn || columnTypes[mapping.categoryColumn] !== 'string') {
    return 'Invalid or missing category column';
  }
  if (mapping.valueColumn && columnTypes[mapping.valueColumn] !== 'number') {
    return 'Invalid value column';
  }
  return null;
}

export function validateRadarMapping(mapping: Record<string, string>, columnTypes: Record<string, string>): string | null {
  if (!mapping.metrics) {
    return 'At least one metric is required';
  }
  const metrics = mapping.metrics.split(',').filter(Boolean);
  if (metrics.length === 0) {
    return 'At least one metric is required';
  }
  if (!metrics.every(metric => columnTypes[metric] === 'number')) {
    return 'All metrics must be numeric columns';
  }
  if (mapping.categoryColumn && columnTypes[mapping.categoryColumn] !== 'string') {
    return 'Invalid category column';
  }
  return null;
}
