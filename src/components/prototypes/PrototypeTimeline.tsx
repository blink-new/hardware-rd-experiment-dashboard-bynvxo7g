import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { 
  GitBranch, 
  Plus, 
  CheckCircle, 
  Clock, 
  Wrench,
  Rocket
} from 'lucide-react'
import type { Prototype } from '@/types/experiment'

const mockPrototypes: Prototype[] = [
  {
    id: '1',
    name: 'IoT Sensor Module',
    version: 'v2.2',
    description: 'Advanced sensor module with improved power efficiency',
    status: 'testing',
    createdAt: '2025-01-16T10:00:00Z',
    userId: 'user1',
    experiments: ['1', '2', '3']
  },
  {
    id: '2',
    name: 'IoT Sensor Module',
    version: 'v2.1',
    description: 'Enhanced thermal management and signal processing',
    status: 'production',
    createdAt: '2025-01-10T14:00:00Z',
    userId: 'user1',
    experiments: ['1', '4']
  },
  {
    id: '3',
    name: 'IoT Sensor Module',
    version: 'v2.0',
    description: 'Major redesign with new microcontroller architecture',
    status: 'production',
    createdAt: '2025-01-05T09:00:00Z',
    userId: 'user1',
    experiments: ['3', '5']
  },
  {
    id: '4',
    name: 'IoT Sensor Module',
    version: 'v1.9',
    description: 'EMI compliance improvements and bug fixes',
    status: 'production',
    createdAt: '2024-12-28T11:00:00Z',
    userId: 'user1',
    experiments: ['4']
  },
  {
    id: '5',
    name: 'IoT Sensor Module',
    version: 'v1.8',
    description: 'Battery optimization and power management updates',
    status: 'production',
    createdAt: '2024-12-20T16:00:00Z',
    userId: 'user1',
    experiments: ['2', '6']
  }
]

const statusColors = {
  design: 'bg-blue-100 text-blue-800',
  development: 'bg-yellow-100 text-yellow-800',
  testing: 'bg-purple-100 text-purple-800',
  production: 'bg-green-100 text-green-800'
}

const statusIcons = {
  design: Wrench,
  development: GitBranch,
  testing: Clock,
  production: Rocket
}

export function PrototypeTimeline() {
  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Prototypes</h2>
          <p className="text-gray-600">Track prototype versions and their evolution</p>
        </div>
        <Button>
          <Plus className="w-4 h-4 mr-2" />
          New Version
        </Button>
      </div>

      <div className="relative">
        {/* Timeline line */}
        <div className="absolute left-8 top-0 bottom-0 w-0.5 bg-gray-200"></div>
        
        <div className="space-y-6">
          {mockPrototypes.map((prototype, index) => {
            const StatusIcon = statusIcons[prototype.status]
            const isLatest = index === 0
            
            return (
              <div key={prototype.id} className="relative flex items-start space-x-6">
                {/* Timeline dot */}
                <div className={`relative z-10 flex items-center justify-center w-16 h-16 rounded-full border-4 ${
                  isLatest 
                    ? 'bg-primary border-primary' 
                    : prototype.status === 'production'
                    ? 'bg-green-500 border-green-500'
                    : 'bg-white border-gray-300'
                }`}>
                  <StatusIcon className={`w-6 h-6 ${
                    isLatest || prototype.status === 'production' 
                      ? 'text-white' 
                      : 'text-gray-600'
                  }`} />
                </div>

                {/* Content */}
                <Card className="flex-1">
                  <CardHeader>
                    <div className="flex items-center justify-between">
                      <div>
                        <CardTitle className="flex items-center space-x-3">
                          <span>{prototype.name}</span>
                          <Badge variant="outline" className="font-mono">
                            {prototype.version}
                          </Badge>
                          {isLatest && (
                            <Badge className="bg-primary text-white">Latest</Badge>
                          )}
                        </CardTitle>
                        <p className="text-sm text-gray-600 mt-1">{prototype.description}</p>
                      </div>
                      <Badge className={statusColors[prototype.status]}>
                        {prototype.status}
                      </Badge>
                    </div>
                  </CardHeader>
                  
                  <CardContent>
                    <div className="flex items-center justify-between">
                      <div className="flex items-center space-x-4">
                        <div className="text-sm text-gray-500">
                          <span className="font-medium">{prototype.experiments.length}</span> experiments
                        </div>
                        <div className="text-sm text-gray-500">
                          Created {new Date(prototype.createdAt).toLocaleDateString()}
                        </div>
                      </div>
                      
                      <div className="flex items-center space-x-2">
                        <Button variant="outline" size="sm">
                          View Details
                        </Button>
                        {prototype.status !== 'production' && (
                          <Button size="sm">
                            <CheckCircle className="w-4 h-4 mr-1" />
                            Deploy
                          </Button>
                        )}
                      </div>
                    </div>
                  </CardContent>
                </Card>
              </div>
            )
          })}
        </div>
      </div>
    </div>
  )
}