import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Progress } from '@/components/ui/progress'
import { Button } from '@/components/ui/button'
import { 
  Beaker, 
  Clock, 
  TrendingUp, 
  CheckCircle,
  AlertCircle,
  Cpu,
  Zap,
  Settings,
  Activity,
  Target,
  BarChart3,
  Play,
  GitCompare
} from 'lucide-react'

const mockStats = {
  totalExperiments: 24,
  activeExperiments: 8,
  completedThisWeek: 3,
  avgIterationTime: 4.2,
  parameterSweepsRunning: 2,
  optimizationTargetsHit: 18,
  realTimeStreams: 3,
  bestEfficiency: 92.4
}

const mockRecentExperiments = [
  {
    id: '1',
    title: 'PCB Thermal Analysis',
    status: 'testing' as const,
    progress: 75,
    priority: 'high' as const,
    dueDate: '2025-01-20'
  },
  {
    id: '2',
    title: 'Battery Life Optimization',
    status: 'analysis' as const,
    progress: 90,
    priority: 'medium' as const,
    dueDate: '2025-01-22'
  },
  {
    id: '3',
    title: 'Signal Integrity Test',
    status: 'planning' as const,
    progress: 25,
    priority: 'high' as const,
    dueDate: '2025-01-25'
  }
]

const statusColors = {
  planning: 'bg-blue-100 text-blue-800',
  testing: 'bg-yellow-100 text-yellow-800',
  analysis: 'bg-purple-100 text-purple-800',
  iteration: 'bg-orange-100 text-orange-800',
  completed: 'bg-green-100 text-green-800'
}

const priorityColors = {
  low: 'bg-gray-100 text-gray-800',
  medium: 'bg-blue-100 text-blue-800',
  high: 'bg-red-100 text-red-800'
}

export function DashboardOverview() {
  return (
    <div className="space-y-6">
      {/* Stats Cards */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 xl:grid-cols-4 gap-6">
        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Total Experiments</CardTitle>
            <Beaker className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.totalExperiments}</div>
            <p className="text-xs text-muted-foreground">
              +2 from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Active Experiments</CardTitle>
            <Clock className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.activeExperiments}</div>
            <p className="text-xs text-muted-foreground">
              Currently in progress
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Completed This Week</CardTitle>
            <CheckCircle className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.completedThisWeek}</div>
            <p className="text-xs text-muted-foreground">
              +1 from last week
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Avg Iteration Time</CardTitle>
            <TrendingUp className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.avgIterationTime}d</div>
            <p className="text-xs text-muted-foreground">
              -0.5d from last month
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Parameter Sweeps</CardTitle>
            <Settings className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.parameterSweepsRunning}</div>
            <p className="text-xs text-muted-foreground">
              Currently running
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Optimization Targets</CardTitle>
            <Target className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.optimizationTargetsHit}</div>
            <p className="text-xs text-muted-foreground">
              Targets achieved
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Real-time Streams</CardTitle>
            <Activity className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.realTimeStreams}</div>
            <p className="text-xs text-muted-foreground">
              Active data streams
            </p>
          </CardContent>
        </Card>

        <Card>
          <CardHeader className="flex flex-row items-center justify-between space-y-0 pb-2">
            <CardTitle className="text-sm font-medium">Best Efficiency</CardTitle>
            <Zap className="h-4 w-4 text-muted-foreground" />
          </CardHeader>
          <CardContent>
            <div className="text-2xl font-bold">{mockStats.bestEfficiency}%</div>
            <p className="text-xs text-muted-foreground">
              Peak performance achieved
            </p>
          </CardContent>
        </Card>
      </div>

      {/* Quick Actions */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Play className="w-5 h-5 mr-2" />
            Quick Actions
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-4">
            <Button className="h-20 flex flex-col items-center justify-center space-y-2">
              <Settings className="w-6 h-6" />
              <span>Start Parameter Sweep</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <Activity className="w-6 h-6" />
              <span>Monitor Real-time Data</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <GitCompare className="w-6 h-6" />
              <span>Compare Experiments</span>
            </Button>
            <Button variant="outline" className="h-20 flex flex-col items-center justify-center space-y-2">
              <BarChart3 className="w-6 h-6" />
              <span>View Analytics</span>
            </Button>
          </div>
        </CardContent>
      </Card>

      {/* Recent Experiments */}
      <Card>
        <CardHeader>
          <CardTitle className="flex items-center">
            <Cpu className="w-5 h-5 mr-2" />
            Recent Experiments
          </CardTitle>
        </CardHeader>
        <CardContent>
          <div className="space-y-4">
            {mockRecentExperiments.map((experiment) => (
              <div key={experiment.id} className="flex items-center justify-between p-4 border rounded-lg hover:bg-gray-50 transition-colors">
                <div className="flex-1">
                  <div className="flex items-center space-x-3 mb-2">
                    <h3 className="font-medium text-gray-900">{experiment.title}</h3>
                    <Badge className={statusColors[experiment.status]}>
                      {experiment.status}
                    </Badge>
                    <Badge className={priorityColors[experiment.priority]}>
                      {experiment.priority}
                    </Badge>
                  </div>
                  <div className="flex items-center space-x-4">
                    <div className="flex-1">
                      <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                        <span>Progress</span>
                        <span>{experiment.progress}%</span>
                      </div>
                      <Progress value={experiment.progress} className="h-2" />
                    </div>
                    <div className="text-sm text-gray-500">
                      Due: {new Date(experiment.dueDate).toLocaleDateString()}
                    </div>
                  </div>
                </div>
                <div className="ml-4">
                  {experiment.priority === 'high' && (
                    <AlertCircle className="w-5 h-5 text-red-500" />
                  )}
                </div>
              </div>
            ))}
          </div>
        </CardContent>
      </Card>
    </div>
  )
}