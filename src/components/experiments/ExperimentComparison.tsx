import { useState, useMemo } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Separator } from '@/components/ui/separator'
import { Progress } from '@/components/ui/progress'
import { 
  LineChart, 
  Line, 
  BarChart, 
  Bar, 
  RadarChart,
  Radar,
  PolarGrid,
  PolarAngleAxis,
  PolarRadiusAxis,
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  Legend, 
  ResponsiveContainer,
  ReferenceLine,
  ComposedChart,
  Area,
  AreaChart
} from 'recharts'
import { 
  GitCompare as Compare,
  TrendingUp,
  TrendingDown,
  Minus,
  ArrowRight,
  Target,
  Zap,
  Award,
  AlertTriangle,
  CheckCircle,
  Clock,
  BarChart3,
  Activity,
  Radar as RadarIcon,
  Download,
  Share,
  Maximize2
} from 'lucide-react'
import type { Experiment, DataPoint, ExperimentMetric } from '@/types/experiment'

// Mock metrics (same as before)
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

// Generate comparison data
const generateComparisonData = (experimentIds: string[], metrics: string[]): Record<string, any> => {
  const data: Record<string, any> = {}
  
  experimentIds.forEach((expId, index) => {
    data[expId] = {}
    metrics.forEach(metric => {
      const baseValue = 50 + index * 15 + (Math.random() - 0.5) * 20
      const performance = 70 + index * 10 + (Math.random() - 0.5) * 30
      
      data[expId][metric] = {
        current: Math.max(0, baseValue),
        target: baseValue * 1.2,
        performance: Math.max(0, Math.min(100, performance)),
        trend: Math.random() > 0.5 ? 'up' : 'down',
        change: (Math.random() - 0.5) * 20,
        stability: 85 + Math.random() * 15,
        samples: Math.floor(100 + Math.random() * 200)
      }
    })
  })
  
  return data
}

// Calculate comparison metrics
const calculateComparison = (data: Record<string, any>, metric: string) => {
  const experiments = Object.keys(data)
  if (experiments.length < 2) return null
  
  const values = experiments.map(exp => data[exp][metric]?.current || 0)
  const best = Math.max(...values)
  const worst = Math.min(...values)
  const average = values.reduce((a, b) => a + b, 0) / values.length
  
  return {
    best,
    worst,
    average,
    range: best - worst,
    improvement: ((best - worst) / worst) * 100,
    leader: experiments[values.indexOf(best)]
  }
}

interface ExperimentComparisonProps {
  experiments: Experiment[]
}

export function ExperimentComparison({ experiments }: ExperimentComparisonProps) {
  const [selectedExperiments, setSelectedExperiments] = useState<string[]>(
    experiments.slice(0, 3).map(e => e.id)
  )
  const [selectedMetrics, setSelectedMetrics] = useState<string[]>(['temperature', 'voltage', 'current', 'efficiency'])
  const [comparisonMode, setComparisonMode] = useState<'performance' | 'trends' | 'radar' | 'detailed'>('performance')

  // Generate mock comparison data
  const comparisonData = useMemo(() => {
    return generateComparisonData(selectedExperiments, selectedMetrics)
  }, [selectedExperiments, selectedMetrics])

  // Calculate metrics comparisons
  const metricsComparison = useMemo(() => {
    return selectedMetrics.reduce((acc, metric) => {
      acc[metric] = calculateComparison(comparisonData, metric)
      return acc
    }, {} as Record<string, any>)
  }, [comparisonData, selectedMetrics])

  // Prepare radar chart data
  const radarData = useMemo(() => {
    return selectedMetrics.map(metric => {
      const metricInfo = mockMetrics.find(m => m.id === metric)
      const result: any = { metric: metricInfo?.name || metric }
      
      selectedExperiments.forEach(expId => {
        const experiment = experiments.find(e => e.id === expId)
        result[experiment?.title || expId] = comparisonData[expId]?.[metric]?.performance || 0
      })
      
      return result
    })
  }, [selectedMetrics, selectedExperiments, comparisonData, experiments])

  // Prepare trend comparison data
  const trendData = useMemo(() => {
    const days = 7
    const data = []
    
    for (let i = 0; i < days; i++) {
      const date = new Date()
      date.setDate(date.getDate() - (days - i - 1))
      
      const point: any = {
        date: date.toISOString().split('T')[0],
        timestamp: date.getTime()
      }
      
      selectedExperiments.forEach(expId => {
        const experiment = experiments.find(e => e.id === expId)
        selectedMetrics.forEach(metric => {
          const baseValue = comparisonData[expId]?.[metric]?.current || 50
          const trend = comparisonData[expId]?.[metric]?.trend === 'up' ? 1 : -1
          const noise = (Math.random() - 0.5) * 10
          const value = baseValue + (trend * i * 2) + noise
          
          point[`${experiment?.title}_${metric}`] = Math.max(0, value)
        })
      })
      
      data.push(point)
    }
    
    return data
  }, [selectedExperiments, selectedMetrics, comparisonData, experiments])

  const getExperimentColor = (index: number) => {
    const colors = ['#3b82f6', '#ef4444', '#10b981', '#f59e0b', '#8b5cf6', '#06b6d4']
    return colors[index % colors.length]
  }

  const renderPerformanceComparison = () => (
    <div className="space-y-6">
      {/* Performance Overview Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
        {selectedMetrics.map(metric => {
          const metricInfo = mockMetrics.find(m => m.id === metric)
          const comparison = metricsComparison[metric]
          if (!comparison) return null
          
          const leaderExp = experiments.find(e => e.id === comparison.leader)
          
          return (
            <Card key={metric}>
              <CardHeader className="pb-2">
                <CardTitle className="text-sm flex items-center">
                  <div 
                    className="w-3 h-3 rounded-full mr-2" 
                    style={{ backgroundColor: metricInfo?.color }}
                  />
                  {metricInfo?.name}
                </CardTitle>
              </CardHeader>
              <CardContent className="space-y-3">
                <div className="text-center">
                  <div className="text-2xl font-bold">{comparison.best.toFixed(1)}</div>
                  <div className="text-xs text-gray-500">Best Performance</div>
                </div>
                
                <div className="space-y-2">
                  <div className="flex justify-between text-xs">
                    <span>Range</span>
                    <span>{comparison.range.toFixed(1)} {metricInfo?.unit}</span>
                  </div>
                  <div className="flex justify-between text-xs">
                    <span>Improvement</span>
                    <span className="text-green-600">+{comparison.improvement.toFixed(1)}%</span>
                  </div>
                </div>
                
                <div className="pt-2 border-t">
                  <div className="flex items-center text-xs">
                    <Award className="w-3 h-3 mr-1 text-yellow-500" />
                    <span className="truncate">{leaderExp?.title}</span>
                  </div>
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>

      {/* Detailed Performance Table */}
      <Card>
        <CardHeader>
          <CardTitle>Detailed Performance Comparison</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="overflow-x-auto">
            <table className="w-full text-sm">
              <thead>
                <tr className="border-b">
                  <th className="text-left p-2">Experiment</th>
                  {selectedMetrics.map(metric => {
                    const metricInfo = mockMetrics.find(m => m.id === metric)
                    return (
                      <th key={metric} className="text-center p-2">
                        <div className="flex items-center justify-center">
                          <div 
                            className="w-2 h-2 rounded-full mr-1" 
                            style={{ backgroundColor: metricInfo?.color }}
                          />
                          {metricInfo?.name}
                        </div>
                      </th>
                    )
                  })}
                </tr>
              </thead>
              <tbody>
                {selectedExperiments.map((expId, index) => {
                  const experiment = experiments.find(e => e.id === expId)
                  return (
                    <tr key={expId} className="border-b hover:bg-gray-50">
                      <td className="p-2">
                        <div className="flex items-center">
                          <div 
                            className="w-3 h-3 rounded-full mr-2" 
                            style={{ backgroundColor: getExperimentColor(index) }}
                          />
                          <div>
                            <div className="font-medium">{experiment?.title}</div>
                            <div className="text-xs text-gray-500">{experiment?.prototypeVersion}</div>
                          </div>
                        </div>
                      </td>
                      {selectedMetrics.map(metric => {
                        const data = comparisonData[expId]?.[metric]
                        const metricInfo = mockMetrics.find(m => m.id === metric)
                        const comparison = metricsComparison[metric]
                        const isLeader = comparison?.leader === expId
                        
                        return (
                          <td key={metric} className="p-2 text-center">
                            <div className="space-y-1">
                              <div className={`font-medium ${isLeader ? 'text-green-600' : ''}`}>
                                {data?.current.toFixed(1)} {metricInfo?.unit}
                                {isLeader && <Award className="w-3 h-3 inline ml-1" />}
                              </div>
                              <div className="flex items-center justify-center text-xs">
                                {data?.trend === 'up' ? (
                                  <TrendingUp className="w-3 h-3 text-green-500 mr-1" />
                                ) : (
                                  <TrendingDown className="w-3 h-3 text-red-500 mr-1" />
                                )}
                                <span className={data?.trend === 'up' ? 'text-green-600' : 'text-red-600'}>
                                  {data?.change > 0 ? '+' : ''}{data?.change.toFixed(1)}%
                                </span>
                              </div>
                              <Progress value={data?.performance} className="h-1" />
                            </div>
                          </td>
                        )
                      })}
                    </tr>
                  )
                })}
              </tbody>
            </table>
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderRadarComparison = () => (
    <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
      <Card>
        <CardHeader>
          <CardTitle>Performance Radar</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-80">
            <ResponsiveContainer width="100%" height="100%">
              <RadarChart data={radarData}>
                <PolarGrid />
                <PolarAngleAxis dataKey="metric" tick={{ fontSize: 12 }} />
                <PolarRadiusAxis angle={90} domain={[0, 100]} tick={{ fontSize: 10 }} />
                {selectedExperiments.map((expId, index) => {
                  const experiment = experiments.find(e => e.id === expId)
                  return (
                    <Radar
                      key={expId}
                      name={experiment?.title}
                      dataKey={experiment?.title}
                      stroke={getExperimentColor(index)}
                      fill={getExperimentColor(index)}
                      fillOpacity={0.1}
                      strokeWidth={2}
                    />
                  )
                })}
                <Legend />
              </RadarChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Metric Rankings</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {selectedMetrics.map(metric => {
              const metricInfo = mockMetrics.find(m => m.id === metric)
              const rankings = selectedExperiments
                .map(expId => ({
                  expId,
                  experiment: experiments.find(e => e.id === expId),
                  value: comparisonData[expId]?.[metric]?.performance || 0
                }))
                .sort((a, b) => b.value - a.value)

              return (
                <div key={metric} className="space-y-2">
                  <div className="flex items-center">
                    <div 
                      className="w-3 h-3 rounded-full mr-2" 
                      style={{ backgroundColor: metricInfo?.color }}
                    />
                    <h4 className="font-medium text-sm">{metricInfo?.name}</h4>
                  </div>
                  <div className="space-y-1">
                    {rankings.map((item, index) => (
                      <div key={item.expId} className="flex items-center justify-between text-sm">
                        <div className="flex items-center">
                          <Badge variant={index === 0 ? "default" : "secondary"} className="w-6 h-6 rounded-full p-0 flex items-center justify-center text-xs mr-2">
                            {index + 1}
                          </Badge>
                          <span className="truncate">{item.experiment?.title}</span>
                        </div>
                        <div className="flex items-center">
                          <span className="mr-2">{item.value.toFixed(1)}%</span>
                          <Progress value={item.value} className="w-16 h-2" />
                        </div>
                      </div>
                    ))}
                  </div>
                </div>
              )
            })}
          </div>
        </CardContent>
      </Card>
    </div>
  )

  const renderTrendComparison = () => (
    <Card>
      <CardHeader>
        <CardTitle>Trend Comparison</CardTitle>
      </CardHeader>
      <CardContent>
        <div className="h-96">
          <ResponsiveContainer width="100%" height="100%">
            <LineChart data={trendData}>
              <CartesianGrid strokeDasharray="3 3" />
              <XAxis dataKey="date" />
              <YAxis />
              <Tooltip />
              <Legend />
              {selectedExperiments.map((expId, expIndex) => {
                const experiment = experiments.find(e => e.id === expId)
                return selectedMetrics.map((metric, metricIndex) => {
                  const metricInfo = mockMetrics.find(m => m.id === metric)
                  const key = `${experiment?.title}_${metric}`
                  return (
                    <Line
                      key={key}
                      type="monotone"
                      dataKey={key}
                      stroke={metricInfo?.color}
                      strokeWidth={2}
                      strokeDasharray={expIndex === 0 ? '0' : expIndex === 1 ? '5 5' : '10 5'}
                      name={`${experiment?.title} - ${metricInfo?.name}`}
                      connectNulls={false}
                      dot={false}
                    />
                  )
                })
              })}
            </LineChart>
          </ResponsiveContainer>
        </div>
      </CardContent>
    </Card>
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Experiment Comparison</h2>
          <p className="text-gray-600">Compare performance metrics across multiple experiments</p>
        </div>
        <div className="flex items-center space-x-2">
          <Button variant="outline">
            <Download className="w-4 h-4 mr-2" />
            Export Report
          </Button>
          <Button variant="outline">
            <Share className="w-4 h-4 mr-2" />
            Share Analysis
          </Button>
          <Button variant="outline">
            <Maximize2 className="w-4 h-4 mr-2" />
            Fullscreen
          </Button>
        </div>
      </div>

      {/* Controls */}
      <div className="grid grid-cols-1 lg:grid-cols-3 gap-4">
        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Select Experiments</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-32 overflow-y-auto">
              {experiments.map(exp => (
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
                    }}
                    className="rounded"
                  />
                  <label htmlFor={exp.id} className="text-sm truncate flex-1">
                    {exp.title}
                  </label>
                  <Badge variant="outline" className="text-xs">
                    {exp.prototypeVersion}
                  </Badge>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Select Metrics</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2 max-h-32 overflow-y-auto">
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
                  </label>
                </div>
              ))}
            </div>
          </CardContent>
        </Card>

        <Card>
          <CardHeader>
            <CardTitle className="text-sm">Comparison Mode</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="grid grid-cols-2 gap-2">
              <Button
                variant={comparisonMode === 'performance' ? "default" : "outline"}
                size="sm"
                onClick={() => setComparisonMode('performance')}
                className="flex flex-col items-center p-3 h-auto"
              >
                <Target className="w-4 h-4 mb-1" />
                <span className="text-xs">Performance</span>
              </Button>
              <Button
                variant={comparisonMode === 'radar' ? "default" : "outline"}
                size="sm"
                onClick={() => setComparisonMode('radar')}
                className="flex flex-col items-center p-3 h-auto"
              >
                <RadarIcon className="w-4 h-4 mb-1" />
                <span className="text-xs">Radar</span>
              </Button>
              <Button
                variant={comparisonMode === 'trends' ? "default" : "outline"}
                size="sm"
                onClick={() => setComparisonMode('trends')}
                className="flex flex-col items-center p-3 h-auto"
              >
                <TrendingUp className="w-4 h-4 mb-1" />
                <span className="text-xs">Trends</span>
              </Button>
              <Button
                variant={comparisonMode === 'detailed' ? "default" : "outline"}
                size="sm"
                onClick={() => setComparisonMode('detailed')}
                className="flex flex-col items-center p-3 h-auto"
              >
                <BarChart3 className="w-4 h-4 mb-1" />
                <span className="text-xs">Detailed</span>
              </Button>
            </div>
          </CardContent>
        </Card>
      </div>

      {/* Comparison Results */}
      <div>
        {comparisonMode === 'performance' && renderPerformanceComparison()}
        {comparisonMode === 'radar' && renderRadarComparison()}
        {comparisonMode === 'trends' && renderTrendComparison()}
        {comparisonMode === 'detailed' && (
          <div className="space-y-6">
            {renderPerformanceComparison()}
            {renderRadarComparison()}
            {renderTrendComparison()}
          </div>
        )}
      </div>

      {/* Summary Insights */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Zap className="w-5 h-5 mr-2" />
            Key Insights
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-4">
            {Object.entries(metricsComparison).map(([metric, comparison]) => {
              if (!comparison) return null
              const metricInfo = mockMetrics.find(m => m.id === metric)
              const leaderExp = experiments.find(e => e.id === comparison.leader)
              
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
                    <div className="flex items-center">
                      <CheckCircle className="w-3 h-3 mr-1 text-green-500" />
                      <span>Best: {leaderExp?.title}</span>
                    </div>
                    <div>Performance gap: {comparison.improvement.toFixed(1)}%</div>
                    <div>Value range: {comparison.range.toFixed(1)} {metricInfo?.unit}</div>
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