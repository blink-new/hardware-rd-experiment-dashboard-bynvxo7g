import { useState, useMemo, useCallback } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Switch } from '@/components/ui/switch'
import { Slider } from '@/components/ui/slider'
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  ScatterChart, 
  Scatter, 
  AreaChart, 
  Area,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine,
  ReferenceArea,
  ComposedChart,
  Cell
} from 'recharts'
import { 
  TrendingUp, 
  BarChart3, 
  ScatterChart as Scatter3D, 
  Activity,
  Settings,
  GitCompare as Compare,
  Download,
  Maximize2,
  Plus,
  Save,
  Share,
  Filter,
  Zap,
  Target,
  TrendingDown,
  AlertTriangle,
  Eye,
  EyeOff,
  Palette,
  Grid3X3,
  RotateCcw,
  Copy,
  Trash2
} from 'lucide-react'
import type { 
  DataPoint, 
  ExperimentMetric, 
  ChartConfig, 
  Experiment, 
  StatisticalAnalysis,
  DataFilter,
  ChartAnnotation
} from '@/types/experiment'

// Enhanced mock metrics with more detailed information
const mockMetrics: ExperimentMetric[] = [
  { id: 'temperature', name: 'Temperature', unit: '°C', description: 'Operating temperature', type: 'continuous', color: '#ef4444' },
  { id: 'voltage', name: 'Voltage', unit: 'V', description: 'Supply voltage', type: 'continuous', color: '#3b82f6' },
  { id: 'current', name: 'Current', unit: 'mA', description: 'Current consumption', type: 'continuous', color: '#10b981' },
  { id: 'frequency', name: 'Frequency', unit: 'MHz', description: 'Operating frequency', type: 'continuous', color: '#f59e0b' },
  { id: 'power', name: 'Power', unit: 'mW', description: 'Power consumption', type: 'continuous', color: '#8b5cf6' },
  { id: 'efficiency', name: 'Efficiency', unit: '%', description: 'Power efficiency', type: 'continuous', color: '#06b6d4' },
  { id: 'latency', name: 'Latency', unit: 'ms', description: 'Response latency', type: 'continuous', color: '#f97316' },
  { id: 'throughput', name: 'Throughput', unit: 'Mbps', description: 'Data throughput', type: 'continuous', color: '#84cc16' },
  { id: 'noise', name: 'Noise Level', unit: 'dB', description: 'Signal noise level', type: 'continuous', color: '#ec4899' },
  { id: 'stability', name: 'Stability', unit: '%', description: 'Signal stability', type: 'continuous', color: '#14b8a6' }
]

// Generate more realistic mock data with trends and patterns
const generateAdvancedMockData = (experimentIds: string[], metrics: string[], days: number = 7): DataPoint[] => {
  const data: DataPoint[] = []
  const now = new Date()
  
  experimentIds.forEach((expId, expIndex) => {
    metrics.forEach(metric => {
      const baseValue = 50 + expIndex * 10 // Different baseline for each experiment
      const trend = (expIndex % 2 === 0 ? 1 : -1) * 0.1 // Some experiments have upward trend, others downward
      
      for (let i = 0; i < days * 24; i++) {
        const timestamp = new Date(now.getTime() - (days * 24 - i) * 60 * 60 * 1000)
        const trendValue = trend * i
        const cyclicValue = Math.sin(i * 0.1) * 5 // Daily cycle
        const noise = (Math.random() - 0.5) * 8
        const anomaly = Math.random() < 0.02 ? (Math.random() - 0.5) * 30 : 0 // 2% chance of anomaly
        
        const value = Math.max(0, baseValue + trendValue + cyclicValue + noise + anomaly)
        
        data.push({
          id: `${expId}-${metric}-${i}`,
          experimentId: expId,
          metric,
          value,
          unit: mockMetrics.find(m => m.id === metric)?.unit || '',
          timestamp: timestamp.toISOString(),
          metadata: {
            testRun: Math.floor(i / 24) + 1,
            condition: i % 3 === 0 ? 'normal' : i % 3 === 1 ? 'stress' : 'optimal',
            isAnomaly: Math.abs(anomaly) > 10
          }
        })
      }
    })
  })
  
  return data
}

// Statistical analysis functions
const calculateStatistics = (data: DataPoint[]): StatisticalAnalysis => {
  const metricGroups = data.reduce((acc, point) => {
    if (!acc[point.metric]) acc[point.metric] = []
    acc[point.metric].push(point.value)
    return acc
  }, {} as Record<string, number[]>)

  const summary = Object.entries(metricGroups).reduce((acc, [metric, values]) => {
    const sorted = [...values].sort((a, b) => a - b)
    const mean = values.reduce((a, b) => a + b, 0) / values.length
    const median = sorted[Math.floor(sorted.length / 2)]
    const variance = values.reduce((acc, val) => acc + Math.pow(val - mean, 2), 0) / values.length
    const std = Math.sqrt(variance)
    
    acc[metric] = {
      mean,
      median,
      std,
      min: Math.min(...values),
      max: Math.max(...values),
      count: values.length
    }
    return acc
  }, {} as Record<string, any>)

  // Simple correlation calculation
  const correlation = {} as Record<string, Record<string, number>>
  const metrics = Object.keys(metricGroups)
  
  metrics.forEach(metric1 => {
    correlation[metric1] = {}
    metrics.forEach(metric2 => {
      if (metric1 === metric2) {
        correlation[metric1][metric2] = 1
      } else {
        const values1 = metricGroups[metric1]
        const values2 = metricGroups[metric2]
        const n = Math.min(values1.length, values2.length)
        
        const mean1 = values1.slice(0, n).reduce((a, b) => a + b, 0) / n
        const mean2 = values2.slice(0, n).reduce((a, b) => a + b, 0) / n
        
        let numerator = 0
        let sum1 = 0
        let sum2 = 0
        
        for (let i = 0; i < n; i++) {
          const diff1 = values1[i] - mean1
          const diff2 = values2[i] - mean2
          numerator += diff1 * diff2
          sum1 += diff1 * diff1
          sum2 += diff2 * diff2
        }
        
        const denominator = Math.sqrt(sum1 * sum2)
        correlation[metric1][metric2] = denominator === 0 ? 0 : numerator / denominator
      }
    })
  })

  // Detect anomalies
  const anomalies = data.filter(point => point.metadata?.isAnomaly).map(point => ({
    timestamp: point.timestamp,
    metric: point.metric,
    value: point.value,
    severity: Math.abs(point.value - summary[point.metric]?.mean) > 2 * summary[point.metric]?.std ? 'high' as const : 'medium' as const
  }))

  // Calculate trends (simplified)
  const trends = Object.entries(metricGroups).reduce((acc, [metric, values]) => {
    const n = values.length
    const x = Array.from({ length: n }, (_, i) => i)
    const y = values
    
    const sumX = x.reduce((a, b) => a + b, 0)
    const sumY = y.reduce((a, b) => a + b, 0)
    const sumXY = x.reduce((acc, xi, i) => acc + xi * y[i], 0)
    const sumXX = x.reduce((acc, xi) => acc + xi * xi, 0)
    
    const slope = (n * sumXY - sumX * sumY) / (n * sumXX - sumX * sumX)
    const intercept = (sumY - slope * sumX) / n
    
    const yPred = x.map(xi => slope * xi + intercept)
    const ssRes = y.reduce((acc, yi, i) => acc + Math.pow(yi - yPred[i], 2), 0)
    const ssTot = y.reduce((acc, yi) => acc + Math.pow(yi - sumY / n, 2), 0)
    const r2 = 1 - (ssRes / ssTot)
    
    acc[metric] = {
      slope,
      r2,
      direction: Math.abs(slope) < 0.01 ? 'stable' : slope > 0 ? 'up' : 'down'
    }
    return acc
  }, {} as Record<string, any>)

  return { correlation, trends, anomalies, summary }
}

interface AdvancedDataVisualizationProps {
  experiments: Experiment[]
}

export function AdvancedDataVisualization({ experiments }: AdvancedDataVisualizationProps) {
  const [selectedExperiments, setSelectedExperiments] = useState<string[]>(
    experiments.slice(0, 2).map(e => e.id)
  )
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['temperature', 'voltage', 'current'])
  const [chartConfigs, setChartConfigs] = useState<ChartConfig[]>([
    {
      id: 'main-chart',
      title: 'Primary Analysis',
      type: 'line',
      metrics: ['temperature', 'voltage'],
      experiments: selectedExperiments,
      compareMode: 'overlay',
      showTrendline: false,
      showConfidenceInterval: false,
      yAxisScale: 'linear'
    }
  ])
  const [activeChartId, setActiveChartId] = useState('main-chart')
  const [showStatistics, setShowStatistics] = useState(false)
  const [filters, setFilters] = useState<DataFilter[]>([])
  const [annotations, setAnnotations] = useState<ChartAnnotation[]>([])

  // Generate mock data
  const mockData = useMemo(() => {
    return generateAdvancedMockData(selectedExperiments, selectedMetrics, 7)
  }, [selectedExperiments, selectedMetrics])

  // Calculate statistics
  const statistics = useMemo(() => {
    return calculateStatistics(mockData)
  }, [mockData])

  // Get active chart config
  const activeChart = chartConfigs.find(c => c.id === activeChartId) || chartConfigs[0]

  // Process data for charts with filters applied
  const processedData = useMemo(() => {
    let filteredData = mockData

    // Apply filters
    filters.forEach(filter => {
      if (!filter.enabled) return
      
      filteredData = filteredData.filter(point => {
        const value = point.value
        switch (filter.operator) {
          case 'greater':
            return value > filter.value
          case 'less':
            return value < filter.value
          case 'between':
            return value >= filter.value[0] && value <= filter.value[1]
          case 'equals':
            return value === filter.value
          default:
            return true
        }
      })
    })

    // Group by time and experiment
    const grouped = filteredData.reduce((acc, point) => {
      const timeKey = new Date(point.timestamp).toISOString().split('T')[0]
      const key = `${timeKey}-${point.experimentId}`
      
      if (!acc[key]) {
        acc[key] = {
          timestamp: timeKey,
          experimentId: point.experimentId,
          experimentName: experiments.find(e => e.id === point.experimentId)?.title || point.experimentId,
          date: new Date(point.timestamp)
        }
      }
      
      acc[key][point.metric] = point.value
      return acc
    }, {} as Record<string, any>)
    
    return Object.values(grouped).sort((a: any, b: any) => 
      a.date.getTime() - b.date.getTime()
    )
  }, [mockData, filters, experiments])

  // Chart type options with advanced types
  const chartTypes = [
    { id: 'line', name: 'Line Chart', icon: TrendingUp, description: 'Time series data' },
    { id: 'bar', name: 'Bar Chart', icon: BarChart3, description: 'Categorical comparison' },
    { id: 'scatter', name: 'Scatter Plot', icon: Scatter3D, description: 'Correlation analysis' },
    { id: 'area', name: 'Area Chart', icon: Activity, description: 'Cumulative data' },
    { id: 'box', name: 'Box Plot', icon: Grid3X3, description: 'Distribution analysis' },
    { id: 'heatmap', name: 'Heatmap', icon: Palette, description: 'Pattern visualization' }
  ]

  const updateChartConfig = useCallback((updates: Partial<ChartConfig>) => {
    setChartConfigs(prev => prev.map(config => 
      config.id === activeChartId ? { ...config, ...updates } : config
    ))
  }, [activeChartId])

  const addNewChart = () => {
    const newChart: ChartConfig = {
      id: `chart-${Date.now()}`,
      title: `Chart ${chartConfigs.length + 1}`,
      type: 'line',
      metrics: ['temperature'],
      experiments: selectedExperiments,
      compareMode: 'overlay',
      showTrendline: false,
      showConfidenceInterval: false,
      yAxisScale: 'linear'
    }
    setChartConfigs(prev => [...prev, newChart])
    setActiveChartId(newChart.id)
  }

  const duplicateChart = () => {
    const newChart: ChartConfig = {
      ...activeChart,
      id: `chart-${Date.now()}`,
      title: `${activeChart.title} (Copy)`
    }
    setChartConfigs(prev => [...prev, newChart])
    setActiveChartId(newChart.id)
  }

  const deleteChart = () => {
    if (chartConfigs.length > 1) {
      setChartConfigs(prev => prev.filter(c => c.id !== activeChartId))
      setActiveChartId(chartConfigs.find(c => c.id !== activeChartId)?.id || chartConfigs[0].id)
    }
  }

  const addFilter = () => {
    const newFilter: DataFilter = {
      id: `filter-${Date.now()}`,
      field: 'value',
      operator: 'greater',
      value: 0,
      enabled: true
    }
    setFilters(prev => [...prev, newFilter])
  }

  const renderAdvancedChart = () => {
    const commonProps = {
      data: processedData,
      margin: { top: 20, right: 30, left: 20, bottom: 20 }
    }

    const getMetricColor = (metric: string, experimentIndex: number = 0) => {
      const metricInfo = mockMetrics.find(m => m.id === metric)
      if (activeChart.compareMode === 'overlay' && selectedExperiments.length > 1) {
        // Different shades for different experiments
        const baseColor = metricInfo?.color || '#3b82f6'
        const opacity = 1 - (experimentIndex * 0.3)
        return `${baseColor}${Math.floor(opacity * 255).toString(16).padStart(2, '0')}`
      }
      return metricInfo?.color || '#3b82f6'
    }

    const renderLines = () => {
      const lines = []
      
      if (activeChart.compareMode === 'overlay') {
        // Overlay mode: different colors/styles for each experiment
        selectedExperiments.forEach((expId, expIndex) => {
          activeChart.metrics.forEach(metric => {
            const metricInfo = mockMetrics.find(m => m.id === metric)
            const experiment = experiments.find(e => e.id === expId)
            const color = getMetricColor(metric, expIndex)
            
            lines.push(
              <Line
                key={`${expId}-${metric}`}
                type="monotone"
                dataKey={metric}
                stroke={color}
                strokeWidth={2}
                strokeDasharray={expIndex === 0 ? '0' : expIndex === 1 ? '5 5' : '10 5'}
                name={`${experiment?.title} - ${metricInfo?.name}`}
                connectNulls={false}
                dot={false}
              />
            )
            
            // Add trendline if enabled
            if (activeChart.showTrendline) {
              lines.push(
                <Line
                  key={`${expId}-${metric}-trend`}
                  type="linear"
                  dataKey={`${metric}_trend`}
                  stroke={color}
                  strokeWidth={1}
                  strokeDasharray="2 2"
                  name={`${experiment?.title} - ${metricInfo?.name} Trend`}
                  dot={false}
                />
              )
            }
          })
        })
      } else {
        // Normal mode: different colors for different metrics
        activeChart.metrics.forEach(metric => {
          const metricInfo = mockMetrics.find(m => m.id === metric)
          lines.push(
            <Line
              key={metric}
              type="monotone"
              dataKey={metric}
              stroke={metricInfo?.color}
              strokeWidth={2}
              name={metricInfo?.name}
              connectNulls={false}
              dot={false}
            />
          )
        })
      }
      
      return lines
    }

    // Add annotations
    const renderAnnotations = () => {
      return annotations.map(annotation => {
        if (annotation.type === 'line') {
          return (
            <ReferenceLine
              key={annotation.id}
              y={annotation.value as number}
              stroke={annotation.color}
              strokeDasharray="5 5"
              label={annotation.label}
            />
          )
        }
        return null
      })
    }

    switch (activeChart.type) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" stroke="#f0f0f0" />
            <XAxis 
              dataKey="timestamp" 
              tick={{ fontSize: 12 }}
              tickFormatter={(value) => new Date(value).toLocaleDateString()}
            />
            <YAxis 
              scale={activeChart.yAxisScale}
              tick={{ fontSize: 12 }}
            />
            <Tooltip 
              labelFormatter={(value) => new Date(value).toLocaleString()}
              formatter={(value: any, name: string) => [
                `${Number(value).toFixed(2)}`,
                name
              ]}
            />
            <Legend />
            {renderLines()}
            {renderAnnotations()}
          </LineChart>
        )
      
      case 'bar':
        return (
          <BarChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Legend />
            {activeChart.metrics.map(metric => {
              const metricInfo = mockMetrics.find(m => m.id === metric)
              return (
                <Bar
                  key={metric}
                  dataKey={metric}
                  fill={metricInfo?.color}
                  name={metricInfo?.name}
                />
              )
            })}
          </BarChart>
        )
      
      case 'area':
        return (
          <AreaChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Legend />
            {activeChart.metrics.map((metric, index) => {
              const metricInfo = mockMetrics.find(m => m.id === metric)
              return (
                <Area
                  key={metric}
                  type="monotone"
                  dataKey={metric}
                  stackId={activeChart.compareMode === 'overlay' ? index : '1'}
                  stroke={metricInfo?.color}
                  fill={metricInfo?.color}
                  fillOpacity={0.6}
                  name={metricInfo?.name}
                />
              )
            })}
          </AreaChart>
        )
      
      case 'scatter':
        if (activeChart.metrics.length >= 2) {
          const xMetric = activeChart.metrics[0]
          const yMetric = activeChart.metrics[1]
          const xMetricInfo = mockMetrics.find(m => m.id === xMetric)
          const yMetricInfo = mockMetrics.find(m => m.id === yMetric)
          
          return (
            <ScatterChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis 
                dataKey={xMetric} 
                name={xMetricInfo?.name}
                unit={xMetricInfo?.unit}
              />
              <YAxis 
                dataKey={yMetric} 
                name={yMetricInfo?.name}
                unit={yMetricInfo?.unit}
              />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter
                name={`${xMetricInfo?.name} vs ${yMetricInfo?.name}`}
                dataKey={yMetric}
                fill="#3b82f6"
              />
            </ScatterChart>
          )
        }
        return (
          <div className="flex items-center justify-center h-64 text-gray-500">
            Select at least 2 metrics for scatter plot
          </div>
        )
      
      default:
        return <div className="flex items-center justify-center h-64 text-gray-500">Chart type not implemented</div>
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Advanced Data Visualization</h2>
          <p className="text-gray-600">Deep dive into experiment data with advanced plotting and comparison tools</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline" onClick={() => setShowStatistics(!showStatistics)}>
            <Target className="w-4 h-4 mr-2" />
            {showStatistics ? 'Hide' : 'Show'} Statistics
          </Button>
          <Button variant="outline" onClick={addFilter}>
            <Filter className="w-4 h-4 mr-2" />
            Add Filter
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Data
          </Button>
          <Button variant="outline">
            <Share className="w-4 h-4 mr-2" />
            Share Dashboard
          </Button>
        </div>
      </div>

      {/* Chart Tabs */}
      <div className="flex items-center justify-between">
        <Tabs value={activeChartId} onValueChange={setActiveChartId} className="flex-1">
          <TabsList>
            {chartConfigs.map(config => (
              <TabsTrigger key={config.id} value={config.id}>
                {config.title}
              </TabsTrigger>
            ))}
          </TabsList>
        </Tabs>
        <div className="flex items-center space-x-2 ml-4">
          <Button size="sm" onClick={addNewChart}>
            <Plus className="w-4 h-4" />
          </Button>
          <Button size="sm" variant="outline" onClick={duplicateChart}>
            <Copy className="w-4 h-4" />
          </Button>
          {chartConfigs.length > 1 && (
            <Button size="sm" variant="outline" onClick={deleteChart}>
              <Trash2 className="w-4 h-4" />
            </Button>
          )}
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-5 gap-6">
        {/* Advanced Controls Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center text-sm">
              <Settings className="w-4 h-4 mr-2" />
              Chart Builder
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Chart Type */}
            <div>
              <Label className="text-xs font-medium mb-2 block">Chart Type</Label>
              <div className="grid grid-cols-2 gap-1">
                {chartTypes.map(type => {
                  const Icon = type.icon
                  return (
                    <Button
                      key={type.id}
                      variant={activeChart.type === type.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => updateChartConfig({ type: type.id as any })}
                      className="flex flex-col items-center p-2 h-auto text-xs"
                      title={type.description}
                    >
                      <Icon className="w-3 h-3 mb-1" />
                      <span className="text-xs">{type.name.split(' ')[0]}</span>
                    </Button>
                  )
                })}
              </div>
            </div>

            <Separator />

            {/* Experiments */}
            <div>
              <Label className="text-xs font-medium mb-2 block">Experiments</Label>
              <div className="space-y-1 max-h-24 overflow-y-auto">
                {experiments.slice(0, 6).map(exp => (
                  <div key={exp.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={exp.id}
                      checked={selectedExperiments.includes(exp.id)}
                      onChange={(e) => {
                        const newSelection = e.target.checked
                          ? [...selectedExperiments, exp.id]
                          : selectedExperiments.filter(id => id !== exp.id)
                        setSelectedExperiments(newSelection)
                        updateChartConfig({ experiments: newSelection })
                      }}
                      className="rounded text-xs"
                    />
                    <label htmlFor={exp.id} className="text-xs truncate flex-1">
                      {exp.title}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Metrics */}
            <div>
              <Label className="text-xs font-medium mb-2 block">Metrics</Label>
              <div className="space-y-1 max-h-32 overflow-y-auto">
                {mockMetrics.map(metric => (
                  <div key={metric.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={metric.id}
                      checked={activeChart.metrics.includes(metric.id)}
                      onChange={(e) => {
                        const newMetrics = e.target.checked
                          ? [...activeChart.metrics, metric.id]
                          : activeChart.metrics.filter(id => id !== metric.id)
                        updateChartConfig({ metrics: newMetrics })
                      }}
                      className="rounded text-xs"
                    />
                    <div 
                      className="w-2 h-2 rounded-full" 
                      style={{ backgroundColor: metric.color }}
                    />
                    <label htmlFor={metric.id} className="text-xs flex-1">
                      {metric.name}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Compare Mode */}
            <div>
              <Label className="text-xs font-medium mb-2 block">Compare Mode</Label>
              <Select 
                value={activeChart.compareMode} 
                onValueChange={(value) => updateChartConfig({ compareMode: value as any })}
              >
                <SelectTrigger className="h-8 text-xs">
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="overlay">Overlay</SelectItem>
                  <SelectItem value="sidebyside">Side by Side</SelectItem>
                  <SelectItem value="difference">Difference</SelectItem>
                  <SelectItem value="ratio">Ratio</SelectItem>
                </SelectContent>
              </Select>
            </div>

            {/* Advanced Options */}
            <div className="space-y-3">
              <div className="flex items-center justify-between">
                <Label className="text-xs">Trendline</Label>
                <Switch
                  checked={activeChart.showTrendline}
                  onCheckedChange={(checked) => updateChartConfig({ showTrendline: checked })}
                />
              </div>
              <div className="flex items-center justify-between">
                <Label className="text-xs">Confidence Interval</Label>
                <Switch
                  checked={activeChart.showConfidenceInterval}
                  onCheckedChange={(checked) => updateChartConfig({ showConfidenceInterval: checked })}
                />
              </div>
              <div>
                <Label className="text-xs font-medium mb-2 block">Y-Axis Scale</Label>
                <Select 
                  value={activeChart.yAxisScale} 
                  onValueChange={(value) => updateChartConfig({ yAxisScale: value as any })}
                >
                  <SelectTrigger className="h-8 text-xs">
                    <SelectValue />
                  </SelectTrigger>
                  <SelectContent>
                    <SelectItem value="linear">Linear</SelectItem>
                    <SelectItem value="log">Logarithmic</SelectItem>
                  </SelectContent>
                </Select>
              </div>
            </div>
          </CardContent>
        </Card>

        {/* Main Chart Area */}
        <Card className="lg:col-span-4">
          <CardHeader>
            <div className="flex items-center justify-between">
              <div>
                <CardTitle className="flex items-center">
                  <Input
                    value={activeChart.title}
                    onChange={(e) => updateChartConfig({ title: e.target.value })}
                    className="text-lg font-semibold border-none p-0 h-auto bg-transparent"
                  />
                  {selectedExperiments.length > 1 && (
                    <Badge variant="outline" className="ml-2 text-xs">
                      Comparing {selectedExperiments.length} experiments
                    </Badge>
                  )}
                </CardTitle>
                <p className="text-sm text-gray-600 mt-1">
                  {activeChart.metrics.length} metrics • {processedData.length} data points
                </p>
              </div>
              <div className="flex items-center space-x-2">
                <Button size="sm" variant="outline">
                  <Save className="w-4 h-4" />
                </Button>
                <Button size="sm" variant="outline">
                  <Maximize2 className="w-4 h-4" />
                </Button>
              </div>
            </div>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                {renderAdvancedChart()}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Filters */}
      {filters.length > 0 && (
        <Card>
          <CardHeader>
            <CardTitle className="text-sm flex items-center">
              <Filter className="w-4 h-4 mr-2" />
              Active Filters
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="flex flex-wrap gap-2">
              {filters.map(filter => (
                <Badge key={filter.id} variant={filter.enabled ? "default" : "secondary"}>
                  {filter.field} {filter.operator} {filter.value}
                  <Button
                    size="sm"
                    variant="ghost"
                    className="ml-1 h-auto p-0"
                    onClick={() => setFilters(prev => prev.filter(f => f.id !== filter.id))}
                  >
                    ×
                  </Button>
                </Badge>
              ))}
            </div>
          </CardContent>
        </Card>
      )}

      {/* Statistics Panel */}
      {showStatistics && (
        <Card>
          <CardHeader>
            <CardTitle className="flex items-center">
              <Target className="w-5 h-5 mr-2" />
              Statistical Analysis
            </CardTitle>
          </CardHeader>
          <CardContent>
            <Tabs defaultValue="summary" className="w-full">
              <TabsList>
                <TabsTrigger value="summary">Summary</TabsTrigger>
                <TabsTrigger value="correlation">Correlation</TabsTrigger>
                <TabsTrigger value="trends">Trends</TabsTrigger>
                <TabsTrigger value="anomalies">Anomalies</TabsTrigger>
              </TabsList>
              
              <TabsContent value="summary" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
                  {Object.entries(statistics.summary).map(([metric, stats]) => {
                    const metricInfo = mockMetrics.find(m => m.id === metric)
                    return (
                      <div key={metric} className="p-4 border rounded-lg">
                        <div className="flex items-center mb-2">
                          <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: metricInfo?.color }}
                          />
                          <h4 className="font-medium text-sm">{metricInfo?.name}</h4>
                        </div>
                        <div className="text-xs text-gray-600 space-y-1">
                          <div>Mean: {stats.mean.toFixed(2)} {metricInfo?.unit}</div>
                          <div>Median: {stats.median.toFixed(2)} {metricInfo?.unit}</div>
                          <div>Std Dev: {stats.std.toFixed(2)} {metricInfo?.unit}</div>
                          <div>Range: {stats.min.toFixed(1)} - {stats.max.toFixed(1)} {metricInfo?.unit}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </TabsContent>
              
              <TabsContent value="correlation" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
                  {Object.entries(statistics.correlation).map(([metric1, correlations]) => {
                    const metricInfo1 = mockMetrics.find(m => m.id === metric1)
                    return (
                      <div key={metric1} className="p-4 border rounded-lg">
                        <h4 className="font-medium text-sm mb-2">{metricInfo1?.name} Correlations</h4>
                        <div className="space-y-1">
                          {Object.entries(correlations).map(([metric2, correlation]) => {
                            if (metric1 === metric2) return null
                            const metricInfo2 = mockMetrics.find(m => m.id === metric2)
                            const strength = Math.abs(correlation as number)
                            const color = strength > 0.7 ? 'text-red-600' : strength > 0.4 ? 'text-yellow-600' : 'text-green-600'
                            return (
                              <div key={metric2} className="flex justify-between text-xs">
                                <span>{metricInfo2?.name}</span>
                                <span className={color}>{(correlation as number).toFixed(3)}</span>
                              </div>
                            )
                          })}
                        </div>
                      </div>
                    )
                  })}
                </div>
              </TabsContent>
              
              <TabsContent value="trends" className="mt-4">
                <div className="grid grid-cols-1 md:grid-cols-3 gap-4">
                  {Object.entries(statistics.trends).map(([metric, trend]) => {
                    const metricInfo = mockMetrics.find(m => m.id === metric)
                    const TrendIcon = trend.direction === 'up' ? TrendingUp : trend.direction === 'down' ? TrendingDown : Target
                    const trendColor = trend.direction === 'up' ? 'text-green-600' : trend.direction === 'down' ? 'text-red-600' : 'text-gray-600'
                    return (
                      <div key={metric} className="p-4 border rounded-lg">
                        <div className="flex items-center justify-between mb-2">
                          <h4 className="font-medium text-sm">{metricInfo?.name}</h4>
                          <TrendIcon className={`w-4 h-4 ${trendColor}`} />
                        </div>
                        <div className="text-xs text-gray-600 space-y-1">
                          <div>Direction: <span className={trendColor}>{trend.direction}</span></div>
                          <div>Slope: {trend.slope.toFixed(4)}</div>
                          <div>R²: {trend.r2.toFixed(3)}</div>
                        </div>
                      </div>
                    )
                  })}
                </div>
              </TabsContent>
              
              <TabsContent value="anomalies" className="mt-4">
                <div className="space-y-2">
                  {statistics.anomalies.length === 0 ? (
                    <p className="text-gray-500 text-sm">No anomalies detected</p>
                  ) : (
                    statistics.anomalies.map((anomaly, index) => (
                      <div key={index} className="flex items-center justify-between p-3 border rounded-lg">
                        <div className="flex items-center space-x-3">
                          <AlertTriangle className={`w-4 h-4 ${
                            anomaly.severity === 'high' ? 'text-red-500' : 'text-yellow-500'
                          }`} />
                          <div>
                            <div className="text-sm font-medium">
                              {mockMetrics.find(m => m.id === anomaly.metric)?.name}
                            </div>
                            <div className="text-xs text-gray-500">
                              {new Date(anomaly.timestamp).toLocaleString()}
                            </div>
                          </div>
                        </div>
                        <div className="text-right">
                          <div className="text-sm font-medium">{anomaly.value.toFixed(2)}</div>
                          <Badge variant={anomaly.severity === 'high' ? 'destructive' : 'secondary'} className="text-xs">
                            {anomaly.severity}
                          </Badge>
                        </div>
                      </div>
                    ))
                  )}
                </div>
              </TabsContent>
            </Tabs>
          </CardContent>
        </Card>
      )}
    </div>
  )
}