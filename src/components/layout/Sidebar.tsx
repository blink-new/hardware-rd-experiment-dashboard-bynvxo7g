import { useState } from 'react'
import { 
  BarChart3, 
  Beaker, 
  Home, 
  Settings, 
  Cpu,
  Plus,
  Search,
  TrendingUp,
  GitCompare as Compare,
  Activity
} from 'lucide-react'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { cn } from '@/lib/utils'

interface SidebarProps {
  activeTab: string
  onTabChange: (tab: string) => void
}

const navigation = [
  { id: 'dashboard', name: 'Dashboard', icon: Home },
  { id: 'experiments', name: 'Experiments', icon: Beaker },
  { id: 'parameter-sweep', name: 'Parameter Sweep', icon: Settings },
  { id: 'realtime-stream', name: 'Real-time Data', icon: Activity },
  { id: 'data-viz', name: 'Data Visualization', icon: TrendingUp },
  { id: 'comparison', name: 'Compare Experiments', icon: Compare },
  { id: 'prototypes', name: 'Prototypes', icon: Cpu },
  { id: 'analytics', name: 'Analytics', icon: BarChart3 },
  { id: 'settings', name: 'Settings', icon: Settings },
]

export function Sidebar({ activeTab, onTabChange }: SidebarProps) {
  const [searchQuery, setSearchQuery] = useState('')

  return (
    <div className="w-64 bg-white border-r border-gray-200 h-screen flex flex-col">
      {/* Header */}
      <div className="p-6 border-b border-gray-200">
        <div className="flex items-center space-x-2">
          <div className="w-8 h-8 bg-primary rounded-lg flex items-center justify-center">
            <Cpu className="w-5 h-5 text-white" />
          </div>
          <div>
            <h1 className="text-lg font-semibold text-gray-900">R&D Lab</h1>
            <p className="text-xs text-gray-500">Hardware Dashboard</p>
          </div>
        </div>
      </div>

      {/* Search */}
      <div className="p-4">
        <div className="relative">
          <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 text-gray-400 w-4 h-4" />
          <Input
            placeholder="Search experiments..."
            value={searchQuery}
            onChange={(e) => setSearchQuery(e.target.value)}
            className="pl-10"
          />
        </div>
      </div>

      {/* Navigation */}
      <nav className="flex-1 px-4 space-y-1">
        {navigation.map((item) => {
          const Icon = item.icon
          return (
            <button
              key={item.id}
              onClick={() => onTabChange(item.id)}
              className={cn(
                'w-full flex items-center px-3 py-2 text-sm font-medium rounded-lg transition-colors',
                activeTab === item.id
                  ? 'bg-primary text-white'
                  : 'text-gray-700 hover:bg-gray-100'
              )}
            >
              <Icon className="w-5 h-5 mr-3" />
              {item.name}
            </button>
          )
        })}
      </nav>

      {/* Quick Actions */}
      <div className="p-4 border-t border-gray-200">
        <Button className="w-full" size="sm">
          <Plus className="w-4 h-4 mr-2" />
          New Experiment
        </Button>
      </div>
    </div>
  )
}