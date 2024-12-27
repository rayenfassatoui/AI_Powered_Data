export type VisualizationType = 
  | "line"
  | "bar"
  | "pie"
  | "scatter"
  | "radar"
  | "timeSeries"
  | "area"
  | "doughnut"
  | "polarArea"
  | "bubble";

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
  description?: string;
  data?: any;
}

export interface Visualization {
  id: string;
  type: VisualizationType;
  mapping: Record<string, string>;
  config: ChartConfiguration;
}

export interface DatasetColumn {
  name: string;
  type: 'string' | 'number' | 'date';
}

export interface Dataset {
  id: string;
  name: string;
  columns: DatasetColumn[];
  data: any[];
}
