import { useState, useEffect, useRef } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Badge } from '@/components/ui/badge'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { 
  Play, 
  Pause, 
  Square, 
  Activity,
  Zap,
  Thermometer,
  Radio,
  Gauge,
  AlertTriangle,
  CheckCircle,
  TrendingUp,
  TrendingDown
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ReferenceLine } from 'recharts'

interface DataPoint {
  timestamp: number
  voltage: number
  current: number
  temperature: number
  frequency: number
  efficiency: number
  power: number
  snr: number
}

interface MetricConfig {
  id: keyof DataPoint
  name: string
  unit: string
  color: string
  icon: any
  min: number
  max: number
  target?: number
  warning?: { min?: number; max?: number }
  critical?: { min?: number; max?: number }
}

const metricConfigs: MetricConfig[] = [
  {
    id: 'voltage',
    name: 'Supply Voltage',
    unit: 'V',
    color: '#2563EB',
    icon: Zap,
    min: 0,
    max: 6,
    target: 3.3,
    warning: { min: 3.0, max: 3.6 },
    critical: { min: 2.8, max: 3.8 }
  },
  {
    id: 'current',
    name: 'Supply Current',
    unit: 'mA',
    color: '#DC2626',
    icon: Activity,
    min: 0,
    max: 600,
    target: 100,
    warning: { max: 400 },
    critical: { max: 500 }
  },
  {
    id: 'temperature',
    name: 'Temperature',
    unit: '°C',
    color: '#EA580C',
    icon: Thermometer,
    min: -10,
    max: 100,
    target: 25,
    warning: { max: 70 },
    critical: { max: 85 }
  },
  {
    id: 'frequency',
    name: 'Clock Frequency',
    unit: 'MHz',
    color: '#7C3AED',
    icon: Radio,
    min: 0,
    max: 120,
    target: 50,
    warning: { min: 45, max: 55 },
    critical: { min: 40, max: 60 }
  },
  {
    id: 'efficiency',
    name: 'Efficiency',
    unit: '%',
    color: '#059669',
    icon: Gauge,
    min: 0,
    max: 100,
    target: 85,
    warning: { min: 80 },
    critical: { min: 75 }
  },
  {
    id: 'snr',
    name: 'Signal-to-Noise Ratio',
    unit: 'dB',
    color: '#0891B2',
    icon: TrendingUp,
    min: 0,
    max: 60,
    target: 40,
    warning: { min: 35 },
    critical: { min: 30 }
  }
]

// Generate realistic mock data
const generateDataPoint = (previousPoint?: DataPoint): DataPoint => {
  const baseTime = previousPoint?.timestamp || Date.now()
  const timestamp = baseTime + 1000 // 1 second intervals
  
  // Simulate realistic hardware behavior with some correlation
  const voltage = previousPoint ? 
    Math.max(2.5, Math.min(4.0, previousPoint.voltage + (Math.random() - 0.5) * 0.1)) :
    3.3 + (Math.random() - 0.5) * 0.2
    
  const frequency = previousPoint ?
    Math.max(40, Math.min(60, previousPoint.frequency + (Math.random() - 0.5) * 2)) :
    50 + (Math.random() - 0.5) * 5
    
  const current = 80 + voltage * 20 + frequency * 0.5 + Math.random() * 20
  const power = voltage * current / 1000 // Convert mA to A
  const temperature = 25 + power * 15 + Math.random() * 5
  const efficiency = Math.max(0, Math.min(100, 90 - Math.abs(voltage - 3.3) * 10 - Math.abs(frequency - 50) * 0.3 + Math.random() * 5))
  const snr = Math.max(0, 45 - (temperature - 25) * 0.2 + Math.log10(voltage) * 5 + Math.random() * 3)
  
  return {
    timestamp,
    voltage: Math.round(voltage * 100) / 100,
    current: Math.round(current * 10) / 10,
    temperature: Math.round(temperature * 10) / 10,
    frequency: Math.round(frequency * 10) / 10,
    efficiency: Math.round(efficiency * 10) / 10,
    power: Math.round(power * 1000) / 1000,
    snr: Math.round(snr * 10) / 10
  }
}

const getMetricStatus = (value: number, config: MetricConfig): 'normal' | 'warning' | 'critical' => {
  if (config.critical) {
    if ((config.critical.min !== undefined && value < config.critical.min) ||
        (config.critical.max !== undefined && value > config.critical.max)) {
      return 'critical'
    }
  }
  
  if (config.warning) {
    if ((config.warning.min !== undefined && value < config.warning.min) ||
        (config.warning.max !== undefined && value > config.warning.max)) {
      return 'warning'
    }
  }
  
  return 'normal'
}

const statusColors = {
  normal: 'bg-green-100 text-green-800',
  warning: 'bg-yellow-100 text-yellow-800',
  critical: 'bg-red-100 text-red-800'
}

const statusIcons = {
  normal: CheckCircle,
  warning: AlertTriangle,
  critical: AlertTriangle
}

export function RealTimeDataStream() {
  const [isStreaming, setIsStreaming] = useState(false)
  const [data, setData] = useState<DataPoint[]>([])
  const [selectedMetrics, setSelectedMetrics] = useState<Set<keyof DataPoint>>(
    new Set(['voltage', 'current', 'temperature', 'efficiency'])
  )
  const [bufferSize, setBufferSize] = useState(100)
  const intervalRef = useRef<NodeJS.Timeout>()
  
  useEffect(() => {
    if (isStreaming) {
      intervalRef.current = setInterval(() => {
        setData(prevData => {
          const lastPoint = prevData[prevData.length - 1]
          const newPoint = generateDataPoint(lastPoint)
          const newData = [...prevData, newPoint]
          
          // Keep only the last bufferSize points
          return newData.slice(-bufferSize)
        })
      }, 1000) // Update every second
    } else {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
    
    return () => {
      if (intervalRef.current) {
        clearInterval(intervalRef.current)
      }
    }
  }, [isStreaming, bufferSize])
  
  const startStreaming = () => {
    setIsStreaming(true)
    // Initialize with some data
    if (data.length === 0) {
      const initialData: DataPoint[] = []
      for (let i = 0; i < 10; i++) {
        const lastPoint = initialData[initialData.length - 1]
        initialData.push(generateDataPoint(lastPoint))
      }
      setData(initialData)
    }
  }
  
  const stopStreaming = () => {
    setIsStreaming(false)
  }
  
  const clearData = () => {
    setData([])
    setIsStreaming(false)
  }
  
  const toggleMetric = (metricId: keyof DataPoint) => {
    setSelectedMetrics(prev => {
      const newSet = new Set(prev)
      if (newSet.has(metricId)) {
        newSet.delete(metricId)
      } else {
        newSet.add(metricId)
      }
      return newSet
    })
  }
  
  const currentValues = data.length > 0 ? data[data.length - 1] : null
  
  // Prepare chart data
  const chartData = data.map(point => ({
    ...point,
    time: new Date(point.timestamp).toLocaleTimeString()
  }))
  
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Real-time Data Stream</h2>
          <p className="text-gray-600">Monitor live hardware metrics and performance data</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Label>Buffer Size:</Label>
            <select 
              value={bufferSize} 
              onChange={(e) => setBufferSize(Number(e.target.value))}
              className="px-2 py-1 border rounded text-sm"
            >
              <option value={50}>50 points</option>
              <option value={100}>100 points</option>
              <option value={200}>200 points</option>
              <option value={500}>500 points</option>
            </select>
          </div>
        </div>
      </div>

      {/* Control Panel */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center justify-between">
            <span>Stream Control</span>
            <div className="flex items-center space-x-2">
              <Badge className={isStreaming ? 'bg-green-100 text-green-800' : 'bg-gray-100 text-gray-800'}>
                {isStreaming ? 'LIVE' : 'STOPPED'}
              </Badge>
            </div>
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="flex items-center space-x-2">
            {!isStreaming ? (
              <Button onClick={startStreaming}>
                <Play className="w-4 h-4 mr-2" />
                Start Stream
              </Button>
            ) : (
              <Button onClick={stopStreaming} variant="outline">
                <Pause className="w-4 h-4 mr-2" />
                Stop Stream
              </Button>
            )}
            <Button onClick={clearData} variant="outline">
              <Square className="w-4 h-4 mr-2" />
              Clear Data
            </Button>
            <div className="text-sm text-gray-600 ml-4">
              Data Points: {data.length} | Rate: 1 Hz
            </div>
          </div>
        </CardContent>
      </Card>

      {/* Current Values Dashboard */}
      {currentValues && (
        <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
          {metricConfigs.map((config) => {
            const value = currentValues[config.id]
            const status = getMetricStatus(value, config)
            const StatusIcon = statusIcons[status]
            const Icon = config.icon
            
            return (
              <Card key={config.id} className="relative">
                <CardContent className="p-4">
                  <div className="flex items-center justify-between mb-2">
                    <Icon className="w-5 h-5 text-gray-500" />
                    <StatusIcon className={`w-4 h-4 ${
                      status === 'normal' ? 'text-green-600' :
                      status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                    }`} />
                  </div>
                  <div className="text-2xl font-bold" style={{ color: config.color }}>
                    {value}
                  </div>
                  <div className="text-sm text-gray-500">{config.unit}</div>
                  <div className="text-xs text-gray-400 mt-1">{config.name}</div>
                  {config.target && (
                    <div className="text-xs text-gray-400">
                      Target: {config.target} {config.unit}
                    </div>
                  )}
                </CardContent>
              </Card>
            )
          })}
        </div>
      )}

      {/* Metric Selection */}
      <Card>
        <CardHeader>
          <CardTitle>Chart Configuration</CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-2 md:grid-cols-3 lg:grid-cols-6 gap-4">
            {metricConfigs.map((config) => (
              <div key={config.id} className="flex items-center space-x-2">
                <Switch
                  checked={selectedMetrics.has(config.id)}
                  onCheckedChange={() => toggleMetric(config.id)}
                />
                <div className="flex items-center space-x-2">
                  <div 
                    className="w-3 h-3 rounded-full" 
                    style={{ backgroundColor: config.color }}
                  />
                  <Label className="text-sm">{config.name}</Label>
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>

      {/* Real-time Chart */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Activity className="w-5 h-5 mr-2" />
            Live Data Visualization
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="h-96">
            <ResponsiveContainer width="100%" height="100%">
              <LineChart data={chartData}>
                <CartesianGrid strokeDasharray="3 3" />
                <XAxis 
                  dataKey="time"
                  tick={{ fontSize: 12 }}
                />
                <YAxis 
                  tick={{ fontSize: 12 }}
                />
                <Tooltip 
                  labelFormatter={(label) => `Time: ${label}`}
                  formatter={(value: number, name: string) => {
                    const config = metricConfigs.find(c => c.id === name)
                    return [`${value} ${config?.unit || ''}`, config?.name || name]
                  }}
                />
                
                {Array.from(selectedMetrics).map((metricId) => {
                  const config = metricConfigs.find(c => c.id === metricId)
                  if (!config) return null
                  
                  return (
                    <Line
                      key={metricId}
                      type="monotone"
                      dataKey={metricId}
                      stroke={config.color}
                      strokeWidth={2}
                      dot={false}
                      connectNulls={false}
                    />
                  )
                })}
                
                {/* Reference lines for targets */}
                {Array.from(selectedMetrics).map((metricId) => {
                  const config = metricConfigs.find(c => c.id === metricId)
                  if (!config?.target) return null
                  
                  return (
                    <ReferenceLine
                      key={`target-${metricId}`}
                      y={config.target}
                      stroke={config.color}
                      strokeDasharray="5 5"
                      strokeOpacity={0.5}
                    />
                  )
                })}
              </LineChart>
            </ResponsiveContainer>
          </div>
        </CardContent>
      </Card>

      {/* Alerts and Status */}
      {currentValues && (
        <Card>
          <CardHeader>
            <CardTitle>System Status</CardTitle>
          </CardHeader>
          <CardContent>
            <div className="space-y-2">
              {metricConfigs.map((config) => {
                const value = currentValues[config.id]
                const status = getMetricStatus(value, config)
                
                if (status === 'normal') return null
                
                return (
                  <div key={config.id} className={`p-3 rounded-lg flex items-center space-x-3 ${
                    status === 'warning' ? 'bg-yellow-50 border border-yellow-200' :
                    'bg-red-50 border border-red-200'
                  }`}>
                    <AlertTriangle className={`w-5 h-5 ${
                      status === 'warning' ? 'text-yellow-600' : 'text-red-600'
                    }`} />
                    <div className="flex-1">
                      <div className="font-medium">
                        {config.name} {status === 'warning' ? 'Warning' : 'Critical'}
                      </div>
                      <div className="text-sm text-gray-600">
                        Current: {value} {config.unit}
                        {config.target && ` | Target: ${config.target} ${config.unit}`}
                      </div>
                    </div>
                    <Badge className={statusColors[status]}>
                      {status.toUpperCase()}
                    </Badge>
                  </div>
                )
              })}
              
              {metricConfigs.every(config => getMetricStatus(currentValues[config.id], config) === 'normal') && (
                <div className="p-3 rounded-lg bg-green-50 border border-green-200 flex items-center space-x-3">
                  <CheckCircle className="w-5 h-5 text-green-600" />
                  <div className="font-medium text-green-800">All systems operating normally</div>
                </div>
              )}
            </div>
          </CardContent>
        </Card>
      )}
    </div>
  )
}