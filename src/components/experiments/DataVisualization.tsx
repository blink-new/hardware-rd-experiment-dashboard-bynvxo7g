import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
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
  ReferenceLine
} from 'recharts'
import { 
  TrendingUp, 
  BarChart3, 
  ScatterChart as Scatter3D, 
  Activity,
  Settings,
  GitCompare as Compare,
  Download,
  Maximize2
} from 'lucide-react'
import type { DataPoint, ExperimentMetric, ChartConfig, Experiment } from '@/types/experiment'

// Mock data for demonstration
const mockMetrics: ExperimentMetric[] = [
  { id: 'temperature', name: 'Temperature', unit: '°C', description: 'Operating temperature', type: 'continuous', color: '#ef4444' },
  { id: 'voltage', name: 'Voltage', unit: 'V', description: 'Supply voltage', type: 'continuous', color: '#3b82f6' },
  { id: 'current', name: 'Current', unit: 'mA', description: 'Current consumption', type: 'continuous', color: '#10b981' },
  { id: 'frequency', name: 'Frequency', unit: 'MHz', description: 'Operating frequency', type: 'continuous', color: '#f59e0b' },
  { id: 'power', name: 'Power', unit: 'mW', description: 'Power consumption', type: 'continuous', color: '#8b5cf6' },
  { id: 'efficiency', name: 'Efficiency', unit: '%', description: 'Power efficiency', type: 'continuous', color: '#06b6d4' },
  { id: 'latency', name: 'Latency', unit: 'ms', description: 'Response latency', type: 'continuous', color: '#f97316' },
  { id: 'throughput', name: 'Throughput', unit: 'Mbps', description: 'Data throughput', type: 'continuous', color: '#84cc16' }
]

const generateMockData = (experimentIds: string[], metrics: string[], days: number = 7): DataPoint[] => {
  const data: DataPoint[] = []
  const now = new Date()
  
  experimentIds.forEach(expId => {
    metrics.forEach(metric => {
      for (let i = 0; i < days * 24; i++) {
        const timestamp = new Date(now.getTime() - (days * 24 - i) * 60 * 60 * 1000)
        const baseValue = Math.random() * 100
        const noise = (Math.random() - 0.5) * 20
        
        data.push({
          id: `${expId}-${metric}-${i}`,
          experimentId: expId,
          metric,
          value: Math.max(0, baseValue + noise),
          unit: mockMetrics.find(m => m.id === metric)?.unit || '',
          timestamp: timestamp.toISOString(),
          metadata: {
            testRun: Math.floor(i / 24) + 1,
            condition: i % 3 === 0 ? 'normal' : i % 3 === 1 ? 'stress' : 'optimal'
          }
        })
      }
    })
  })
  
  return data
}

interface DataVisualizationProps {
  experiments: Experiment[]
  selectedExperiments?: string[]
  onExperimentSelect?: (experimentIds: string[]) => void
}

export function DataVisualization({ 
  experiments, 
  selectedExperiments = [], 
  onExperimentSelect 
}: DataVisualizationProps) {
  const [chartConfig, setChartConfig] = useState<ChartConfig>({
    id: 'default',
    title: 'Experiment Data',
    type: 'line',
    metrics: ['temperature', 'voltage'],
    aggregation: 'raw'
  })
  
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['temperature', 'voltage'])
  const [timeRange, setTimeRange] = useState<string>('7d')
  const [isCompareMode, setIsCompareMode] = useState(false)

  // Generate mock data for selected experiments
  const mockData = useMemo(() => {
    const expIds = selectedExperiments.length > 0 ? selectedExperiments : experiments.slice(0, 2).map(e => e.id)
    return generateMockData(expIds, selectedMetrics)
  }, [selectedExperiments, experiments, selectedMetrics])

  // Process data for charts
  const chartData = useMemo(() => {
    const grouped = mockData.reduce((acc, point) => {
      const timeKey = new Date(point.timestamp).toISOString().split('T')[0]
      const key = `${timeKey}-${point.experimentId}`
      
      if (!acc[key]) {
        acc[key] = {
          timestamp: timeKey,
          experimentId: point.experimentId,
          experimentName: experiments.find(e => e.id === point.experimentId)?.title || point.experimentId
        }
      }
      
      acc[key][point.metric] = point.value
      return acc
    }, {} as Record<string, any>)
    
    return Object.values(grouped).sort((a: any, b: any) => 
      new Date(a.timestamp).getTime() - new Date(b.timestamp).getTime()
    )
  }, [mockData, experiments])

  const chartTypes = [
    { id: 'line', name: 'Line Chart', icon: TrendingUp },
    { id: 'bar', name: 'Bar Chart', icon: BarChart3 },
    { id: 'scatter', name: 'Scatter Plot', icon: Scatter3D },
    { id: 'area', name: 'Area Chart', icon: Activity }
  ]

  const renderChart = () => {
    const commonProps = {
      data: chartData,
      margin: { top: 5, right: 30, left: 20, bottom: 5 }
    }

    const renderLines = () => {
      if (isCompareMode) {
        // In compare mode, show each experiment as separate lines for each metric
        const lines = []
        const expIds = selectedExperiments.length > 0 ? selectedExperiments : experiments.slice(0, 2).map(e => e.id)
        
        expIds.forEach((expId, expIndex) => {
          selectedMetrics.forEach((metric, metricIndex) => {
            const metricInfo = mockMetrics.find(m => m.id === metric)
            const experiment = experiments.find(e => e.id === expId)
            lines.push(
              <Line
                key={`${expId}-${metric}`}
                type="monotone"
                dataKey={metric}
                stroke={metricInfo?.color}
                strokeWidth={2}
                strokeDasharray={expIndex === 0 ? '0' : '5 5'}
                name={`${experiment?.title} - ${metricInfo?.name}`}
                connectNulls={false}
              />
            )
          })
        })
        return lines
      } else {
        // Normal mode, show metrics as different colored lines
        return selectedMetrics.map(metric => {
          const metricInfo = mockMetrics.find(m => m.id === metric)
          return (
            <Line
              key={metric}
              type="monotone"
              dataKey={metric}
              stroke={metricInfo?.color}
              strokeWidth={2}
              name={metricInfo?.name}
              connectNulls={false}
            />
          )
        })
      }
    }

    switch (chartConfig.type) {
      case 'line':
        return (
          <LineChart {...commonProps}>
            <CartesianGrid strokeDasharray="3 3" />
            <XAxis dataKey="timestamp" />
            <YAxis />
            <Tooltip />
            <Legend />
            {renderLines()}
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
            {selectedMetrics.map(metric => {
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
            {selectedMetrics.map(metric => {
              const metricInfo = mockMetrics.find(m => m.id === metric)
              return (
                <Area
                  key={metric}
                  type="monotone"
                  dataKey={metric}
                  stackId="1"
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
        if (selectedMetrics.length >= 2) {
          return (
            <ScatterChart {...commonProps}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey={selectedMetrics[0]} name={mockMetrics.find(m => m.id === selectedMetrics[0])?.name} />
              <YAxis dataKey={selectedMetrics[1]} name={mockMetrics.find(m => m.id === selectedMetrics[1])?.name} />
              <Tooltip cursor={{ strokeDasharray: '3 3' }} />
              <Scatter
                name="Data Points"
                dataKey={selectedMetrics[1]}
                fill="#3b82f6"
              />
            </ScatterChart>
          )
        }
        return <div className="flex items-center justify-center h-64 text-gray-500">Select at least 2 metrics for scatter plot</div>
      
      default:
        return null
    }
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Data Visualization</h2>
          <p className="text-gray-600">Plot and compare experiment data with customizable charts</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button
            variant={isCompareMode ? "default" : "outline"}
            onClick={() => setIsCompareMode(!isCompareMode)}
          >
            <Compare className="w-4 h-4 mr-2" />
            Compare Mode
          </Button>
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export
          </Button>
          <Button variant="outline">
            <Maximize2 className="w-4 h-4 mr-2" />
            Fullscreen
          </Button>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-4 gap-6">
        {/* Controls Panel */}
        <Card className="lg:col-span-1">
          <CardHeader>
            <CardTitle className="flex items-center">
              <Settings className="w-5 h-5 mr-2" />
              Chart Controls
            </CardTitle>
          </CardHeader>
          <CardContent className="space-y-4">
            {/* Chart Type */}
            <div>
              <label className="text-sm font-medium mb-2 block">Chart Type</label>
              <div className="grid grid-cols-2 gap-2">
                {chartTypes.map(type => {
                  const Icon = type.icon
                  return (
                    <Button
                      key={type.id}
                      variant={chartConfig.type === type.id ? "default" : "outline"}
                      size="sm"
                      onClick={() => setChartConfig(prev => ({ ...prev, type: type.id as any }))}
                      className="flex flex-col items-center p-3 h-auto"
                    >
                      <Icon className="w-4 h-4 mb-1" />
                      <span className="text-xs">{type.name.split(' ')[0]}</span>
                    </Button>
                  )
                })}
              </div>
            </div>

            <Separator />

            {/* Experiment Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">
                Experiments {isCompareMode && <Badge variant="secondary" className="ml-1">Compare</Badge>}
              </label>
              <div className="space-y-2 max-h-32 overflow-y-auto">
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
                        onExperimentSelect?.(newSelection)
                      }}
                      className="rounded"
                    />
                    <label htmlFor={exp.id} className="text-sm truncate flex-1">
                      {exp.title}
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Metrics Selection */}
            <div>
              <label className="text-sm font-medium mb-2 block">Metrics</label>
              <div className="space-y-2 max-h-40 overflow-y-auto">
                {mockMetrics.map(metric => (
                  <div key={metric.id} className="flex items-center space-x-2">
                    <input
                      type="checkbox"
                      id={metric.id}
                      checked={selectedMetrics.includes(metric.id)}
                      onChange={(e) => {
                        const newMetrics = e.target.checked
                          ? [...selectedMetrics, metric.id]
                          : selectedMetrics.filter(id => id !== metric.id)
                        setSelectedMetrics(newMetrics)
                      }}
                      className="rounded"
                    />
                    <div 
                      className="w-3 h-3 rounded-full" 
                      style={{ backgroundColor: metric.color }}
                    />
                    <label htmlFor={metric.id} className="text-sm flex-1">
                      {metric.name}
                      <span className="text-gray-500 ml-1">({metric.unit})</span>
                    </label>
                  </div>
                ))}
              </div>
            </div>

            <Separator />

            {/* Time Range */}
            <div>
              <label className="text-sm font-medium mb-2 block">Time Range</label>
              <Select value={timeRange} onValueChange={setTimeRange}>
                <SelectTrigger>
                  <SelectValue />
                </SelectTrigger>
                <SelectContent>
                  <SelectItem value="1d">Last 24 hours</SelectItem>
                  <SelectItem value="7d">Last 7 days</SelectItem>
                  <SelectItem value="30d">Last 30 days</SelectItem>
                  <SelectItem value="90d">Last 90 days</SelectItem>
                  <SelectItem value="custom">Custom range</SelectItem>
                </SelectContent>
              </Select>
            </div>
          </CardContent>
        </Card>

        {/* Chart Area */}
        <Card className="lg:col-span-3">
          <CardHeader>
            <CardTitle>
              {chartConfig.title}
              {isCompareMode && (
                <Badge variant="outline" className="ml-2">
                  Comparing {selectedExperiments.length || 2} experiments
                </Badge>
              )}
            </CardTitle>
          </CardHeader>
          <CardContent>
            <div className="h-96">
              <ResponsiveContainer width="100%" height="100%">
                {renderChart()}
              </ResponsiveContainer>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Data Summary */}
      <Card>
        <CardHeader>
          <CardTitle>Data Summary</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {selectedMetrics.map(metricId => {
              const metric = mockMetrics.find(m => m.id === metricId)
              const values = mockData.filter(d => d.metric === metricId).map(d => d.value)
              const avg = values.reduce((a, b) => a + b, 0) / values.length
              const min = Math.min(...values)
              const max = Math.max(...values)
              
              return (
                <div key={metricId} className="text-center p-4 border rounded-lg">
                  <div 
                    className="w-4 h-4 rounded-full mx-auto mb-2" 
                    style={{ backgroundColor: metric?.color }}
                  />
                  <h4 className="font-medium text-sm">{metric?.name}</h4>
                  <div className="text-xs text-gray-500 space-y-1 mt-2">
                    <div>Avg: {avg.toFixed(1)} {metric?.unit}</div>
                    <div>Min: {min.toFixed(1)} {metric?.unit}</div>
                    <div>Max: {max.toFixed(1)} {metric?.unit}</div>
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}