import { useState } from 'react'
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Progress } from '@/components/ui/progress'
import { 
  MoreHorizontal, 
  Play, 
  Pause, 
  CheckCircle,
  Clock,
  AlertTriangle
} from 'lucide-react'
import { DropdownMenu, DropdownMenuContent, DropdownMenuItem, DropdownMenuTrigger } from '@/components/ui/dropdown-menu'
import type { Experiment } from '@/types/experiment'

const mockExperiments: Experiment[] = [
  {
    id: '1',
    title: 'PCB Thermal Analysis',
    description: 'Testing thermal dissipation under various load conditions',
    status: 'testing',
    priority: 'high',
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
    status: 'analysis',
    priority: 'medium',
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
    status: 'planning',
    priority: 'high',
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
    status: 'completed',
    priority: 'medium',
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
    title: 'Mechanical Stress Analysis',
    description: 'Testing structural integrity under various stress conditions',
    status: 'iteration',
    priority: 'low',
    tags: ['mechanical', 'stress', 'durability'],
    createdAt: '2025-01-12T13:00:00Z',
    updatedAt: '2025-01-16T10:00:00Z',
    userId: 'user1',
    prototypeVersion: 'v2.2',
    notes: 'Iterating on design based on stress test results',
    estimatedDuration: 6,
    actualDuration: 5
  },
  {
    id: '6',
    title: 'Wireless Range Testing',
    description: 'Measuring wireless communication range and reliability',
    status: 'testing',
    priority: 'medium',
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

const statusIcons = {
  planning: Clock,
  testing: Play,
  analysis: AlertTriangle,
  iteration: Pause,
  completed: CheckCircle
}

function getProgress(experiment: Experiment): number {
  switch (experiment.status) {
    case 'planning': return 20
    case 'testing': return 60
    case 'analysis': return 80
    case 'iteration': return 70
    case 'completed': return 100
    default: return 0
  }
}

export function ExperimentGrid() {
  const [experiments] = useState<Experiment[]>(mockExperiments)

  return (
    <div className="space-y-6">
      <div className="flex items-center justify-between">
        <div>
          <h2 className="text-2xl font-bold text-gray-900">Experiments</h2>
          <p className="text-gray-600">Track and manage your hardware R&D experiments</p>
        </div>
        <Button>
          <Play className="w-4 h-4 mr-2" />
          New Experiment
        </Button>
      </div>

      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-3 gap-6">
        {experiments.map((experiment) => {
          const StatusIcon = statusIcons[experiment.status]
          const progress = getProgress(experiment)
          
          return (
            <Card key={experiment.id} className="hover:shadow-md transition-shadow">
              <CardHeader className="pb-3">
                <div className="flex items-start justify-between">
                  <div className="flex-1">
                    <CardTitle className="text-lg mb-2">{experiment.title}</CardTitle>
                    <p className="text-sm text-gray-600 line-clamp-2">{experiment.description}</p>
                  </div>
                  <DropdownMenu>
                    <DropdownMenuTrigger asChild>
                      <Button variant="ghost" size="sm">
                        <MoreHorizontal className="w-4 h-4" />
                      </Button>
                    </DropdownMenuTrigger>
                    <DropdownMenuContent align="end">
                      <DropdownMenuItem>Edit</DropdownMenuItem>
                      <DropdownMenuItem>Duplicate</DropdownMenuItem>
                      <DropdownMenuItem>Archive</DropdownMenuItem>
                      <DropdownMenuItem className="text-red-600">Delete</DropdownMenuItem>
                    </DropdownMenuContent>
                  </DropdownMenu>
                </div>
              </CardHeader>
              
              <CardContent className="space-y-4">
                {/* Status and Priority */}
                <div className="flex items-center space-x-2">
                  <StatusIcon className="w-4 h-4" />
                  <Badge className={statusColors[experiment.status]}>
                    {experiment.status}
                  </Badge>
                  <Badge className={priorityColors[experiment.priority]}>
                    {experiment.priority}
                  </Badge>
                </div>

                {/* Progress */}
                <div>
                  <div className="flex items-center justify-between text-sm text-gray-600 mb-1">
                    <span>Progress</span>
                    <span>{progress}%</span>
                  </div>
                  <Progress value={progress} className="h-2" />
                </div>

                {/* Tags */}
                <div className="flex flex-wrap gap-1">
                  {experiment.tags.slice(0, 3).map((tag) => (
                    <Badge key={tag} variant="outline" className="text-xs">
                      {tag}
                    </Badge>
                  ))}
                  {experiment.tags.length > 3 && (
                    <Badge variant="outline" className="text-xs">
                      +{experiment.tags.length - 3}
                    </Badge>
                  )}
                </div>

                {/* Prototype Version */}
                <div className="text-sm text-gray-500">
                  Prototype: <span className="font-medium">{experiment.prototypeVersion}</span>
                </div>

                {/* Duration */}
                <div className="text-sm text-gray-500">
                  Duration: {experiment.actualDuration || experiment.estimatedDuration}d
                  {experiment.actualDuration && experiment.actualDuration !== experiment.estimatedDuration && (
                    <span className="text-gray-400"> (est. {experiment.estimatedDuration}d)</span>
                  )}
                </div>

                {/* Last Updated */}
                <div className="text-xs text-gray-400">
                  Updated {new Date(experiment.updatedAt).toLocaleDateString()}
                </div>
              </CardContent>
            </Card>
          )
        })}
      </div>
    </div>
  )
}