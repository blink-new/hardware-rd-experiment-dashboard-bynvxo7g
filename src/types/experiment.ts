export interface Experiment {
  id: string
  title: string
  description: string
  status: 'planning' | 'testing' | 'analysis' | 'iteration' | 'completed'
  priority: 'low' | 'medium' | 'high'
  tags: string[]
  createdAt: string
  updatedAt: string
  userId: string
  prototypeVersion: string
  testResults?: TestResult[]
  notes: string
  estimatedDuration: number // in days
  actualDuration?: number // in days
}

export interface TestResult {
  id: string
  experimentId: string
  testName: string
  value: number
  unit: string
  timestamp: string
  passed: boolean
}

export interface DataPoint {
  id: string
  experimentId: string
  metric: string
  value: number
  unit: string
  timestamp: string
  metadata?: Record<string, any>
}

export interface ExperimentMetric {
  id: string
  name: string
  unit: string
  description: string
  type: 'continuous' | 'discrete' | 'categorical'
  color: string
}

export interface ChartConfig {
  id: string
  title: string
  type: 'line' | 'bar' | 'scatter' | 'area' | 'histogram' | 'heatmap' | 'radar' | 'box' | 'violin'
  metrics: string[]
  experiments: string[]
  timeRange?: {
    start: string
    end: string
  }
  aggregation?: 'raw' | 'average' | 'sum' | 'min' | 'max' | 'median' | 'std'
  groupBy?: string
  filters?: DataFilter[]
  annotations?: ChartAnnotation[]
  compareMode?: 'overlay' | 'sidebyside' | 'difference' | 'ratio'
  yAxisScale?: 'linear' | 'log'
  showTrendline?: boolean
  showConfidenceInterval?: boolean
  customColors?: string[]
}

export interface DataFilter {
  id: string
  field: string
  operator: 'equals' | 'greater' | 'less' | 'between' | 'contains'
  value: any
  enabled: boolean
}

export interface ChartAnnotation {
  id: string
  type: 'line' | 'area' | 'point' | 'text'
  value: number | { x: number; y: number }
  label: string
  color: string
}

export interface StatisticalAnalysis {
  correlation: Record<string, Record<string, number>>
  trends: Record<string, { slope: number; r2: number; direction: 'up' | 'down' | 'stable' }>
  anomalies: Array<{ timestamp: string; metric: string; value: number; severity: 'low' | 'medium' | 'high' }>
  summary: Record<string, { mean: number; median: number; std: number; min: number; max: number; count: number }>
}

export interface CustomDashboard {
  id: string
  name: string
  description: string
  charts: ChartConfig[]
  layout: DashboardLayout[]
  isShared: boolean
  createdAt: string
  updatedAt: string
  userId: string
}

export interface DashboardLayout {
  chartId: string
  x: number
  y: number
  width: number
  height: number
}

export interface Prototype {
  id: string
  name: string
  version: string
  description: string
  status: 'design' | 'development' | 'testing' | 'production'
  createdAt: string
  userId: string
  experiments: string[] // experiment IDs
}