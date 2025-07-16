import { useState, useEffect } from 'react'
import { blink } from '@/blink/client'
import { Sidebar } from '@/components/layout/Sidebar'
import { DashboardOverview } from '@/components/dashboard/DashboardOverview'
import { ExperimentGrid } from '@/components/experiments/ExperimentGrid'
import { ParameterSweep } from '@/components/experiments/ParameterSweep'
import { RealTimeDataStream } from '@/components/experiments/RealTimeDataStream'
import { AdvancedDataVisualization } from '@/components/experiments/AdvancedDataVisualization'
import { ExperimentComparison } from '@/components/experiments/ExperimentComparison'
import { PrototypeTimeline } from '@/components/prototypes/PrototypeTimeline'
import { AnalyticsDashboard } from '@/components/analytics/AnalyticsDashboard'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Settings, User } from 'lucide-react'

// Mock experiments data for visualization components
const mockExperiments = [
  {
    id: '1',
    title: 'PCB Thermal Analysis',
    description: 'Testing thermal dissipation under various load conditions',
    status: 'testing' as const,
    priority: 'high' as const,
    tags: ['thermal', 'pcb', 'performance'],
    createdAt: '2025-01-15T10:00:00Z',
    updatedAt: '2025-01-16T14:30:00Z',
    userId: 'user1',
    prototypeVersion: 'v2.1',
    notes: 'Initial results show promising thermal management',
    estimatedDuration: 5,
    actualDuration: 3
  },
  {
    id: '2',
    title: 'Battery Life Optimization',
    description: 'Optimizing power consumption for extended battery life',
    status: 'analysis' as const,
    priority: 'medium' as const,
    tags: ['battery', 'power', 'optimization'],
    createdAt: '2025-01-14T09:00:00Z',
    updatedAt: '2025-01-16T16:00:00Z',
    userId: 'user1',
    prototypeVersion: 'v1.8',
    notes: 'Power consumption reduced by 15%',
    estimatedDuration: 7,
    actualDuration: 6
  },
  {
    id: '3',
    title: 'Signal Integrity Test',
    description: 'Analyzing signal quality at high frequencies',
    status: 'planning' as const,
    priority: 'high' as const,
    tags: ['signal', 'frequency', 'quality'],
    createdAt: '2025-01-16T08:00:00Z',
    updatedAt: '2025-01-16T08:00:00Z',
    userId: 'user1',
    prototypeVersion: 'v2.0',
    notes: 'Preparing test setup and equipment',
    estimatedDuration: 4
  },
  {
    id: '4',
    title: 'EMI Compliance Testing',
    description: 'Ensuring electromagnetic interference compliance',
    status: 'completed' as const,
    priority: 'medium' as const,
    tags: ['emi', 'compliance', 'testing'],
    createdAt: '2025-01-10T11:00:00Z',
    updatedAt: '2025-01-14T17:00:00Z',
    userId: 'user1',
    prototypeVersion: 'v1.9',
    notes: 'Passed all EMI compliance tests',
    estimatedDuration: 3,
    actualDuration: 4
  },
  {
    id: '5',
    title: 'Wireless Range Testing',
    description: 'Measuring wireless communication range and reliability',
    status: 'testing' as const,
    priority: 'medium' as const,
    tags: ['wireless', 'range', 'communication'],
    createdAt: '2025-01-13T15:00:00Z',
    updatedAt: '2025-01-16T12:00:00Z',
    userId: 'user1',
    prototypeVersion: 'v1.7',
    notes: 'Testing in various environmental conditions',
    estimatedDuration: 5,
    actualDuration: 4
  }
]

function App() {
  const [user, setUser] = useState(null)
  const [loading, setLoading] = useState(true)
  const [activeTab, setActiveTab] = useState('dashboard')

  useEffect(() => {
    const unsubscribe = blink.auth.onAuthStateChanged((state) => {
      setUser(state.user)
      setLoading(state.isLoading)
    })
    return unsubscribe
  }, [])

  if (loading) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <div className="text-center">
          <div className="w-8 h-8 border-4 border-primary border-t-transparent rounded-full animate-spin mx-auto mb-4"></div>
          <p className="text-gray-600">Loading dashboard...</p>
        </div>
      </div>
    )
  }

  if (!user) {
    return (
      <div className="min-h-screen bg-background flex items-center justify-center">
        <Card className="w-full max-w-md">
          <CardHeader className="text-center">
            <CardTitle className="flex items-center justify-center space-x-2">
              <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
                <Settings className="w-5 h-5 text-white" />
              </div>
              <span>R&D Dashboard</span>
            </CardTitle>
          </CardHeader>
          <CardContent className="text-center">
            <p className="text-gray-600 mb-4">Please sign in to access your hardware R&D experiment dashboard.</p>
            <div className="text-sm text-gray-500">
              Authentication is handled automatically by Blink
            </div>
          </CardContent>
        </Card>
      </div>
    )
  }

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <DashboardOverview />
      case 'experiments':
        return <ExperimentGrid />
      case 'parameter-sweep':
        return <ParameterSweep />
      case 'realtime-stream':
        return <RealTimeDataStream />
      case 'data-viz':
        return <AdvancedDataVisualization experiments={mockExperiments} />
      case 'comparison':
        return <ExperimentComparison experiments={mockExperiments} />
      case 'prototypes':
        return <PrototypeTimeline />
      case 'analytics':
        return <AnalyticsDashboard />
      case 'settings':
        return (
          <div className="space-y-6">
            <div>
              <h2 className="text-2xl font-bold text-gray-900">Settings</h2>
              <p className="text-gray-600">Manage your dashboard preferences and account settings</p>
            </div>
            <Card>
              <CardHeader>
                <CardTitle className="flex items-center">
                  <User className="w-5 h-5 mr-2" />
                  User Profile
                </CardTitle>
              </CardHeader>
              <CardContent>
                <div className="space-y-4">
                  <div>
                    <label className="text-sm font-medium text-gray-700">Email</label>
                    <p className="text-gray-900">{user.email}</p>
                  </div>
                  <div>
                    <label className="text-sm font-medium text-gray-700">User ID</label>
                    <p className="text-gray-500 font-mono text-sm">{user.id}</p>
                  </div>
                </div>
              </CardContent>
            </Card>
          </div>
        )
      default:
        return <DashboardOverview />
    }
  }

  return (
    <div className="min-h-screen bg-background flex">
      <Sidebar activeTab={activeTab} onTabChange={setActiveTab} />
      <main className="flex-1 p-8 overflow-auto">
        {renderContent()}
      </main>
    </div>
  )
}

export default App