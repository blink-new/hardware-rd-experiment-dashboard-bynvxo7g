import { useState, useEffect } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Label } from '@/components/ui/label'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Slider } from '@/components/ui/slider'
import { Switch } from '@/components/ui/switch'
import { 
  Play, 
  Pause, 
  Square, 
  Settings, 
  TrendingUp,
  Zap,
  Thermometer,
  Radio,
  Battery,
  Plus,
  Trash2
} from 'lucide-react'
import { LineChart, Line, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer, ScatterChart, Scatter } from 'recharts'

interface Parameter {
  id: string
  name: string
  unit: string
  min: number
  max: number
  step: number
  current: number
  enabled: boolean
  icon: any
}

interface SweepResult {
  id: string
  parameters: Record<string, number>
  metrics: Record<string, number>
  timestamp: number
  passed: boolean
}

const defaultParameters: Parameter[] = [
  {
    id: 'voltage',
    name: 'Supply Voltage',
    unit: 'V',
    min: 3.0,
    max: 5.0,
    step: 0.1,
    current: 3.3,
    enabled: true,
    icon: Zap
  },
  {
    id: 'frequency',
    name: 'Clock Frequency',
    unit: 'MHz',
    min: 10,
    max: 100,
    step: 5,
    current: 50,
    enabled: true,
    icon: Radio
  },
  {
    id: 'temperature',
    name: 'Operating Temperature',
    unit: '°C',
    min: -20,
    max: 85,
    step: 5,
    current: 25,
    enabled: false,
    icon: Thermometer
  },
  {
    id: 'current',
    name: 'Supply Current',
    unit: 'mA',
    min: 10,
    max: 500,
    step: 10,
    current: 100,
    enabled: false,
    icon: Battery
  }
]

// Mock sweep results for demonstration
const generateMockResults = (parameters: Parameter[]): SweepResult[] => {
  const results: SweepResult[] = []
  const enabledParams = parameters.filter(p => p.enabled)
  
  // Generate results for different parameter combinations
  for (let i = 0; i < 50; i++) {
    const paramValues: Record<string, number> = {}
    
    enabledParams.forEach(param => {
      const range = param.max - param.min
      paramValues[param.id] = param.min + (Math.random() * range)
    })
    
    // Simulate metrics based on parameters
    const voltage = paramValues.voltage || 3.3
    const frequency = paramValues.frequency || 50
    
    const efficiency = Math.max(0, 85 - Math.abs(voltage - 3.3) * 10 - Math.abs(frequency - 50) * 0.2 + Math.random() * 5)
    const power = voltage * voltage * 0.1 + frequency * 0.05 + Math.random() * 2
    const snr = Math.max(0, 40 + Math.log10(voltage) * 10 - frequency * 0.1 + Math.random() * 3)
    
    results.push({
      id: `result_${i}`,
      parameters: paramValues,
      metrics: {
        efficiency,
        power_consumption: power,
        snr,
        temperature: 25 + power * 2 + Math.random() * 5
      },
      timestamp: Date.now() - Math.random() * 86400000, // Random time in last 24h
      passed: efficiency > 80 && power < 5 && snr > 35
    })
  }
  
  return results.sort((a, b) => b.timestamp - a.timestamp)
}

export function ParameterSweep() {
  const [parameters, setParameters] = useState<Parameter[]>(defaultParameters)
  const [isRunning, setIsRunning] = useState(false)
  const [isPaused, setIsPaused] = useState(false)
  const [progress, setProgress] = useState(0)
  const [results, setResults] = useState<SweepResult[]>([])
  const [selectedMetric, setSelectedMetric] = useState('efficiency')
  const [autoOptimize, setAutoOptimize] = useState(true)

  useEffect(() => {
    // Generate initial mock results
    setResults(generateMockResults(parameters))
  }, [parameters])

  useEffect(() => {
    let interval: NodeJS.Timeout
    
    if (isRunning && !isPaused) {
      interval = setInterval(() => {
        setProgress(prev => {
          const newProgress = prev + 2
          if (newProgress >= 100) {
            setIsRunning(false)
            setProgress(0)
            // Generate new results
            setResults(generateMockResults(parameters))
            return 0
          }
          return newProgress
        })
      }, 100)
    }
    
    return () => clearInterval(interval)
  }, [isRunning, isPaused, parameters])

  const updateParameter = (id: string, field: keyof Parameter, value: any) => {
    setParameters(prev => prev.map(p => 
      p.id === id ? { ...p, [field]: value } : p
    ))
  }

  const addParameter = () => {
    const newParam: Parameter = {
      id: `param_${Date.now()}`,
      name: 'New Parameter',
      unit: 'units',
      min: 0,
      max: 100,
      step: 1,
      current: 50,
      enabled: false,
      icon: Settings
    }
    setParameters(prev => [...prev, newParam])
  }

  const removeParameter = (id: string) => {
    setParameters(prev => prev.filter(p => p.id !== id))
  }

  const startSweep = () => {
    setIsRunning(true)
    setIsPaused(false)
    setProgress(0)
  }

  const pauseSweep = () => {
    setIsPaused(!isPaused)
  }

  const stopSweep = () => {
    setIsRunning(false)
    setIsPaused(false)
    setProgress(0)
  }

  const getBestResult = () => {
    if (results.length === 0) return null
    return results.reduce((best, current) => 
      current.metrics[selectedMetric] > best.metrics[selectedMetric] ? current : best
    )
  }

  const bestResult = getBestResult()
  const enabledParams = parameters.filter(p => p.enabled)

  // Prepare chart data
  const chartData = results.slice(0, 20).map(result => ({
    ...result.parameters,
    ...result.metrics,
    timestamp: new Date(result.timestamp).toLocaleTimeString()
  }))

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Parameter Sweep</h2>
          <p className="text-gray-600">Configure and run automated parameter optimization</p>
        </div>
        <div className="flex items-center space-x-2">
          <div className="flex items-center space-x-2">
            <Switch
              checked={autoOptimize}
              onCheckedChange={setAutoOptimize}
            />
            <Label>Auto-optimize</Label>
          </div>
        </div>
      </div>

      <div className="grid grid-cols-1 lg:grid-cols-3 gap-6">
        {/* Parameter Configuration */}
        <div className="lg:col-span-1 space-y-4">
          <Card>
            <CardHeader>
              <CardTitle className="flex items-center justify-between">
                <span>Parameters</span>
                <Button size="sm" variant="outline" onClick={addParameter}>
                  <Plus className="w-4 h-4" />
                </Button>
              </CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              {parameters.map((param) => {
                const Icon = param.icon
                return (
                  <div key={param.id} className="p-4 border rounded-lg space-y-3">
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-2">
                        <Icon className="w-4 h-4 text-gray-500" />
                        <Input
                          value={param.name}
                          onChange={(e) => updateParameter(param.id, 'name', e.target.value)}
                          className="font-medium border-none p-0 h-auto"
                        />
                      </div>
                      <div className="flex items-center space-x-2">
                        <Switch
                          checked={param.enabled}
                          onCheckedChange={(checked) => updateParameter(param.id, 'enabled', checked)}
                        />
                        <Button
                          size="sm"
                          variant="ghost"
                          onClick={() => removeParameter(param.id)}
                        >
                          <Trash2 className="w-4 h-4" />
                        </Button>
                      </div>
                    </div>
                    
                    {param.enabled && (
                      <>
                        <div className="grid grid-cols-3 gap-2">
                          <div>
                            <Label className="text-xs">Min</Label>
                            <Input
                              type="number"
                              value={param.min}
                              onChange={(e) => updateParameter(param.id, 'min', parseFloat(e.target.value))}
                              className="h-8"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Max</Label>
                            <Input
                              type="number"
                              value={param.max}
                              onChange={(e) => updateParameter(param.id, 'max', parseFloat(e.target.value))}
                              className="h-8"
                            />
                          </div>
                          <div>
                            <Label className="text-xs">Step</Label>
                            <Input
                              type="number"
                              value={param.step}
                              onChange={(e) => updateParameter(param.id, 'step', parseFloat(e.target.value))}
                              className="h-8"
                            />
                          </div>
                        </div>
                        
                        <div>
                          <div className="flex items-center justify-between mb-2">
                            <Label className="text-xs">Current: {param.current} {param.unit}</Label>
                          </div>
                          <Slider
                            value={[param.current]}
                            onValueChange={([value]) => updateParameter(param.id, 'current', value)}
                            min={param.min}
                            max={param.max}
                            step={param.step}
                            className="w-full"
                          />
                        </div>
                      </>
                    )}
                  </div>
                )
              })}
            </CardContent>
          </Card>

          {/* Control Panel */}
          <Card>
            <CardHeader>
              <CardTitle>Sweep Control</CardTitle>
            </CardHeader>
            <CardContent className="space-y-4">
              <div className="flex space-x-2">
                {!isRunning ? (
                  <Button onClick={startSweep} className="flex-1">
                    <Play className="w-4 h-4 mr-2" />
                    Start Sweep
                  </Button>
                ) : (
                  <>
                    <Button onClick={pauseSweep} variant="outline" className="flex-1">
                      <Pause className="w-4 h-4 mr-2" />
                      {isPaused ? 'Resume' : 'Pause'}
                    </Button>
                    <Button onClick={stopSweep} variant="destructive">
                      <Square className="w-4 h-4" />
                    </Button>
                  </>
                )}
              </div>
              
              {isRunning && (
                <div>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{progress.toFixed(0)}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>
              )}
              
              <div className="text-sm text-gray-600">
                <div>Enabled Parameters: {enabledParams.length}</div>
                <div>Total Combinations: {enabledParams.reduce((acc, p) => acc * Math.ceil((p.max - p.min) / p.step), 1)}</div>
                <div>Results Collected: {results.length}</div>
              </div>
            </CardContent>
          </Card>
        </div>

        {/* Results Visualization */}
        <div className="lg:col-span-2 space-y-4">
          {/* Best Result */}
          {bestResult && (
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <TrendingUp className="w-5 h-5 mr-2" />
                  Best Result - {selectedMetric}
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="grid grid-cols-2 md:grid-cols-4 gap-4">
                  <div className="text-center">
                    <div className="text-2xl font-bold text-green-600">
                      {bestResult.metrics[selectedMetric].toFixed(2)}
                    </div>
                    <div className="text-sm text-gray-500">
                      {selectedMetric === 'efficiency' ? '%' : 
                       selectedMetric === 'power_consumption' ? 'W' :
                       selectedMetric === 'snr' ? 'dB' : 'units'}
                    </div>
                  </div>
                  {Object.entries(bestResult.parameters).map(([key, value]) => (
                    <div key={key} className="text-center">
                      <div className="text-lg font-semibold">{value.toFixed(2)}</div>
                      <div className="text-sm text-gray-500">
                        {parameters.find(p => p.id === key)?.unit || 'units'}
                      </div>
                      <div className="text-xs text-gray-400">
                        {parameters.find(p => p.id === key)?.name || key}
                      </div>
                    </div>
                  ))}
                </div>
              </CardContent>
            </Card>
          )}

          {/* Metric Selection */}
          <Card>
            <CardHeader>
              <CardTitle>Optimization Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="flex space-x-2 mb-4">
                {['efficiency', 'power_consumption', 'snr', 'temperature'].map((metric) => (
                  <Button
                    key={metric}
                    size="sm"
                    variant={selectedMetric === metric ? 'default' : 'outline'}
                    onClick={() => setSelectedMetric(metric)}
                  >
                    {metric.replace('_', ' ')}
                  </Button>
                ))}
              </div>
              
              {/* Chart */}
              <div className="h-64">
                <ResponsiveContainer width="100%" height="100%">
                  {enabledParams.length === 1 ? (
                    <LineChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey={enabledParams[0].id}
                        label={{ value: `${enabledParams[0].name} (${enabledParams[0].unit})`, position: 'insideBottom', offset: -10 }}
                      />
                      <YAxis 
                        label={{ value: selectedMetric.replace('_', ' '), angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip />
                      <Line 
                        type="monotone" 
                        dataKey={selectedMetric} 
                        stroke="#2563EB" 
                        strokeWidth={2}
                        dot={{ fill: '#2563EB', strokeWidth: 2, r: 4 }}
                      />
                    </LineChart>
                  ) : (
                    <ScatterChart data={chartData}>
                      <CartesianGrid strokeDasharray="3 3" />
                      <XAxis 
                        dataKey={enabledParams[0]?.id || 'voltage'}
                        label={{ value: `${enabledParams[0]?.name || 'Voltage'} (${enabledParams[0]?.unit || 'V'})`, position: 'insideBottom', offset: -10 }}
                      />
                      <YAxis 
                        label={{ value: selectedMetric.replace('_', ' '), angle: -90, position: 'insideLeft' }}
                      />
                      <Tooltip />
                      <Scatter 
                        dataKey={selectedMetric} 
                        fill="#2563EB"
                      />
                    </ScatterChart>
                  )}
                </ResponsiveContainer>
              </div>
            </CardContent>
          </Card>

          {/* Recent Results Table */}
          <Card>
            <CardHeader>
              <CardTitle>Recent Results</CardTitle>
            </CardHeader>
            <CardContent>
              <div className="overflow-x-auto">
                <table className="w-full text-sm">
                  <thead>
                    <tr className="border-b">
                      <th className="text-left p-2">Time</th>
                      {enabledParams.map(param => (
                        <th key={param.id} className="text-left p-2">
                          {param.name} ({param.unit})
                        </th>
                      ))}
                      <th className="text-left p-2">Efficiency (%)</th>
                      <th className="text-left p-2">Power (W)</th>
                      <th className="text-left p-2">SNR (dB)</th>
                      <th className="text-left p-2">Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {results.slice(0, 10).map((result) => (
                      <tr key={result.id} className="border-b hover:bg-gray-50">
                        <td className="p-2">
                          {new Date(result.timestamp).toLocaleTimeString()}
                        </td>
                        {enabledParams.map(param => (
                          <td key={param.id} className="p-2">
                            {result.parameters[param.id]?.toFixed(2) || '-'}
                          </td>
                        ))}
                        <td className="p-2">{result.metrics.efficiency.toFixed(1)}</td>
                        <td className="p-2">{result.metrics.power_consumption.toFixed(2)}</td>
                        <td className="p-2">{result.metrics.snr.toFixed(1)}</td>
                        <td className="p-2">
                          <Badge className={result.passed ? 'bg-green-100 text-green-800' : 'bg-red-100 text-red-800'}>
                            {result.passed ? 'Pass' : 'Fail'}
                          </Badge>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            </CardContent>
          </Card>
        </div>
      </div>
    </div>
  )
}