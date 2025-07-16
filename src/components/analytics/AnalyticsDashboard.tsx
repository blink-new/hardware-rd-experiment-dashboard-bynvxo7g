import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { 
  BarChart, 
  Bar, 
  XAxis, 
  YAxis, 
  CartesianGrid, 
  Tooltip, 
  ResponsiveContainer,
  LineChart,
  Line,
  PieChart,
  Pie,
  Cell
} from 'recharts'
import { TrendingUp, Clock, Target, Zap } from 'lucide-react'

const experimentsByMonth = [
  { month: 'Sep', completed: 4, active: 2 },
  { month: 'Oct', completed: 6, active: 3 },
  { month: 'Nov', completed: 8, active: 4 },
  { month: 'Dec', completed: 5, active: 6 },
  { month: 'Jan', completed: 3, active: 8 }
]

const iterationTimes = [
  { week: 'W1', avgTime: 5.2 },
  { week: 'W2', avgTime: 4.8 },
  { week: 'W3', avgTime: 4.1 },
  { week: 'W4', avgTime: 4.2 },
  { week: 'W5', avgTime: 3.9 }
]

const experimentsByStatus = [
  { name: 'Completed', value: 45, color: '#22c55e' },
  { name: 'Testing', value: 25, color: '#eab308' },
  { name: 'Analysis', value: 15, color: '#a855f7' },
  { name: 'Planning', value: 10, color: '#3b82f6' },
  { name: 'Iteration', value: 5, color: '#f97316' }
]

const successMetrics = [
  {
    title: 'Success Rate',
    value: '87%',
    change: '+5%',
    icon: Target,
    color: 'text-green-600'
  },
  {
    title: 'Avg Iteration Time',
    value: '4.2d',
    change: '-0.8d',
    icon: Clock,
    color: 'text-blue-600'
  },
  {
    title: 'Experiments/Month',
    value: '12',
    change: '+3',
    icon: TrendingUp,
    color: 'text-purple-600'
  },
  {
    title: 'Time to Market',
    value: '28d',
    change: '-5d',
    icon: Zap,
    color: 'text-orange-600'
  }
]

export function AnalyticsDashboard() {
  return (
    <div className="space-y-6">
      <div>
        <h2 className="text-2xl font-bold text-gray-900">Analytics</h2>
        <p className="text-gray-600">Performance metrics and insights for your R&D process</p>
      </div>

      {/* Key Metrics */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
        {successMetrics.map((metric) => {
          const Icon = metric.icon
          return (
            <Card key={metric.title}>
              <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
                <CardTitle className="text-sm font-medium">{metric.title}</CardTitle>
                <Icon className={`h-4 w-4 ${metric.color}`} />
              </CardHeader>
              <CardContent>
                <div className="text-2xl font-bold">{metric.value}</div>
                <p className={`text-xs ${metric.change.startsWith('+') || metric.change.startsWith('-') && !metric.change.includes('+') ? 'text-green-600' : 'text-red-600'}`}>
                  {metric.change} from last month
                </p>
              </CardContent>
            </Card>
          )
        })}
      </div>

      <Tabs defaultValue="experiments" className="space-y-4">
        <TabsList>
          <TabsTrigger value="experiments">Experiments</TabsTrigger>
          <TabsTrigger value="performance">Performance</TabsTrigger>
          <TabsTrigger value="distribution">Distribution</TabsTrigger>
        </TabsList>

        <TabsContent value="experiments" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Experiments Over Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <BarChart data={experimentsByMonth}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="month" />
                  <YAxis />
                  <Tooltip />
                  <Bar dataKey="completed" fill="#22c55e" name="Completed" />
                  <Bar dataKey="active" fill="#3b82f6" name="Active" />
                </BarChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="performance" className="space-y-4">
          <Card>
            <CardHeader>
              <CardTitle>Average Iteration Time</CardTitle>
            </CardHeader>
            <CardContent>
              <ResponsiveContainer width="100%" height={300}>
                <LineChart data={iterationTimes}>
                  <CartesianGrid strokeDasharray="3 3" />
                  <XAxis dataKey="week" />
                  <YAxis />
                  <Tooltip />
                  <Line 
                    type="monotone" 
                    dataKey="avgTime" 
                    stroke="#2563eb" 
                    strokeWidth={2}
                    name="Avg Time (days)"
                  />
                </LineChart>
              </ResponsiveContainer>
            </CardContent>
          </Card>
        </TabsContent>

        <TabsContent value="distribution" className="space-y-4">
          <div className="grid grid-cols-1 lg:grid-cols-2 gap-6">
            <Card>
              <CardHeader>
                <CardTitle>Experiments by Status</CardTitle>
              </CardHeader>
              <CardContent>
                <ResponsiveContainer width="100%" height={300}>
                  <PieChart>
                    <Pie
                      data={experimentsByStatus}
                      cx="50%"
                      cy="50%"
                      labelLine={false}
                      label={({ name, percent }) => `${name} ${(percent * 100).toFixed(0)}%`}
                      outerRadius={80}
                      fill="#8884d8"
                      dataKey="value"
                    >
                      {experimentsByStatus.map((entry, index) => (
                        <Cell key={`cell-${index}`} fill={entry.color} />
                      ))}
                    </Pie>
                    <Tooltip />
                  </PieChart>
                </ResponsiveContainer>
              </CardContent>
            </Card>

            <Card>
              <CardHeader>
                <CardTitle>Key Insights</CardTitle>
              </CardHeader>
              <CardContent className="space-y-4">
                <div className="p-4 bg-green-50 rounded-lg">
                  <h4 className="font-medium text-green-800">High Success Rate</h4>
                  <p className="text-sm text-green-600">87% of experiments are completing successfully, up 5% from last month.</p>
                </div>
                <div className="p-4 bg-blue-50 rounded-lg">
                  <h4 className="font-medium text-blue-800">Faster Iterations</h4>
                  <p className="text-sm text-blue-600">Average iteration time decreased to 4.2 days, improving development velocity.</p>
                </div>
                <div className="p-4 bg-purple-50 rounded-lg">
                  <h4 className="font-medium text-purple-800">Increased Throughput</h4>
                  <p className="text-sm text-purple-600">Processing 12 experiments per month, a 25% increase from previous quarter.</p>
                </div>
              </CardContent>
            </Card>
          </div>
        </TabsContent>
      </Tabs>
    </div>
  )
}