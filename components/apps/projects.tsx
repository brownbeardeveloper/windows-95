"use client"

import React, { useState, useEffect } from 'react'
import { useFileSystem } from '@/hooks/use-file-system'
import { Badge } from '@/components/ui/badge'
import { Button } from '@/components/ui/button'
import { Input } from '@/components/ui/input'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { Avatar, AvatarFallback } from '@/components/ui/avatar'
import { Table, TableBody, TableCell, TableHead, TableHeader, TableRow } from '@/components/ui/table'
import {
  ExternalLink,
  Github,
  Search,
  Filter,
  Calendar,
  CheckCircle,
  AlertCircle,
  Play,
  Pause,
  Target,
  TrendingUp,
  Code,
  Globe,
  Smartphone,
  Monitor,
  Server,
  Layers,
  ChevronRight
} from 'lucide-react'

interface Project {
  id: string
  name: string
  icon: string
  type: string
  tech: string
  status: 'Completed' | 'In Progress' | 'Planning' | 'On Hold'
  description: string
  url?: string
  githubUrl?: string
  startDate: string
  endDate?: string
  teamSize: number
  challenges: string[]
  achievements: string[]
}

interface ProjectsProps {
  onOpenProjectDetails?: (project: Project) => void
}

export default function Projects({ onOpenProjectDetails }: ProjectsProps) {
  const [projects, setProjects] = useState<Project[]>([])
  const [loading, setLoading] = useState(true)
  const [error, setError] = useState<string | null>(null)

  const [searchTerm, setSearchTerm] = useState('')
  const [statusFilter, setStatusFilter] = useState<string>('all')
  const [typeFilter, setTypeFilter] = useState<string>('all')

  // Use centralized file system
  const { readFile, writeFile, getItem, listDirectory } = useFileSystem()

  // Load projects from file system
  useEffect(() => {
    const loadProjects = () => {
      try {
        setLoading(true)
        setError(null)

        // Read projects.json from Documents directory
        const projectsJson = readFile(["C:", "Documents"], "projects.json")

        if (projectsJson) {
          const projectsData = JSON.parse(projectsJson) as Project[]
          setProjects(projectsData)
        } else {
          // Try to create the projects.json file if it doesn't exist
          const projectsData = [
            {
              id: "ecommerce-platform",
              name: "E-Commerce Platform",
              icon: "🛒",
              type: "Web Application",
              tech: "React, Node.js, MongoDB",
              status: "Completed" as const,
              description: "Full-stack e-commerce solution with payment integration",
              url: "https://ecommerce-demo.example.com",
              githubUrl: "https://github.com/developer/ecommerce-platform",
              startDate: "2023-01-15",
              endDate: "2023-06-30",
              teamSize: 4,
              challenges: ["Payment gateway integration", "Real-time inventory management", "Performance optimization"],
              achievements: ["Increased conversion rate by 35%", "Handled 10k+ concurrent users", "Reduced page load time by 60%"]
            },
            {
              id: "task-management",
              name: "Task Management App",
              icon: "📋",
              type: "Mobile App",
              tech: "React Native, Firebase",
              status: "In Progress" as const,
              description: "Cross-platform productivity app with real-time sync",
              githubUrl: "https://github.com/developer/task-management",
              startDate: "2023-08-01",
              teamSize: 2,
              challenges: ["Cross-platform compatibility", "Offline synchronization", "Push notifications"],
              achievements: ["Cross-platform architecture", "Real-time collaboration features"]
            },
            {
              id: "weather-dashboard",
              name: "Weather Dashboard",
              icon: "🌤️",
              type: "Web Application",
              tech: "Vue.js, Express, API",
              status: "Completed" as const,
              description: "Interactive weather visualization with forecasting",
              url: "https://weather-dash.example.com",
              githubUrl: "https://github.com/developer/weather-dashboard",
              startDate: "2022-11-01",
              endDate: "2023-02-15",
              teamSize: 1,
              challenges: ["API rate limiting", "Data visualization", "Responsive design"],
              achievements: ["Beautiful data visualizations", "Accurate 7-day forecasts", "Mobile-first design"]
            },
            {
              id: "portfolio-website",
              name: "Portfolio Website",
              icon: "💼",
              type: "Website",
              tech: "Next.js, Tailwind CSS",
              status: "Completed" as const,
              description: "Personal portfolio showcasing projects and skills",
              url: "https://developer.dev",
              githubUrl: "https://github.com/developer/portfolio",
              startDate: "2023-03-01",
              endDate: "2023-04-15",
              teamSize: 1,
              challenges: ["SEO optimization", "Performance", "Accessibility"],
              achievements: ["95+ Lighthouse score", "Fully accessible", "Fast loading times"]
            },
            {
              id: "chat-application",
              name: "Chat Application",
              icon: "💬",
              type: "Web Application",
              tech: "Socket.io, React, Node.js",
              status: "Completed" as const,
              description: "Real-time messaging app with group chat features",
              url: "https://chat-app.example.com",
              githubUrl: "https://github.com/developer/chat-app",
              startDate: "2022-08-01",
              endDate: "2022-12-31",
              teamSize: 3,
              challenges: ["Real-time messaging", "Scalability", "Message encryption"],
              achievements: ["End-to-end encryption", "Group chat functionality", "File sharing capabilities"]
            },
            {
              id: "data-visualization",
              name: "Data Visualization Tool",
              icon: "📊",
              type: "Web Application",
              tech: "D3.js, Python, Flask",
              status: "In Progress" as const,
              description: "Interactive charts and graphs for business analytics",
              githubUrl: "https://github.com/developer/data-viz",
              startDate: "2023-09-01",
              teamSize: 2,
              challenges: ["Complex data processing", "Interactive visualizations", "Performance with large datasets"],
              achievements: ["Dynamic chart generation", "Multiple data source integration"]
            },
            {
              id: "game-engine",
              name: "Game Engine",
              icon: "🎮",
              type: "Desktop Application",
              tech: "C++, OpenGL, SDL",
              status: "In Progress" as const,
              description: "2D game engine with physics and rendering systems",
              githubUrl: "https://github.com/developer/game-engine",
              startDate: "2023-05-01",
              teamSize: 1,
              challenges: ["Memory management", "Physics simulation", "Cross-platform compatibility"],
              achievements: ["Custom physics engine", "Efficient rendering pipeline"]
            },
            {
              id: "api-gateway",
              name: "API Gateway",
              icon: "🔗",
              type: "Backend Service",
              tech: "Go, Docker, Kubernetes",
              status: "Completed" as const,
              description: "Microservices API gateway with load balancing",
              githubUrl: "https://github.com/developer/api-gateway",
              startDate: "2022-03-01",
              endDate: "2022-08-15",
              teamSize: 5,
              challenges: ["High availability", "Load balancing", "Security"],
              achievements: ["99.9% uptime", "Handles 1M+ requests/day", "Zero-downtime deployments"]
            }
          ]

          const success = writeFile(["C:", "Documents"], "projects.json", JSON.stringify(projectsData, null, 2))
          if (success) {
            setProjects(projectsData)
          } else {
            setError("Could not create projects file")
            setProjects([])
          }
        }
      } catch (err) {
        setError("Failed to load projects: " + (err instanceof Error ? err.message : String(err)))
        setProjects([])
      } finally {
        setLoading(false)
      }
    }

    loadProjects()
  }, [readFile, writeFile, getItem, listDirectory])

  // Filter projects based on search and filters
  const filteredProjects = projects.filter(project => {
    const matchesSearch = project.name.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.description.toLowerCase().includes(searchTerm.toLowerCase()) ||
      project.tech.toLowerCase().includes(searchTerm.toLowerCase())
    const matchesStatus = statusFilter === 'all' || project.status === statusFilter
    const matchesType = typeFilter === 'all' || project.type === typeFilter

    return matchesSearch && matchesStatus && matchesType
  })

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'Completed': return <CheckCircle className="h-4 w-4" />
      case 'In Progress': return <Play className="h-4 w-4" />
      case 'Planning': return <Target className="h-4 w-4" />
      case 'On Hold': return <Pause className="h-4 w-4" />
      default: return <AlertCircle className="h-4 w-4" />
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'Completed': return 'bg-green-100 text-green-800 border-green-200'
      case 'In Progress': return 'bg-blue-100 text-blue-800 border-blue-200'
      case 'Planning': return 'bg-yellow-100 text-yellow-800 border-yellow-200'
      case 'On Hold': return 'bg-gray-100 text-gray-800 border-gray-200'
      default: return 'bg-gray-100 text-gray-800 border-gray-200'
    }
  }

  const getTypeIcon = (type: string) => {
    switch (type) {
      case 'Web Application': return <Globe className="h-4 w-4" />
      case 'Mobile App': return <Smartphone className="h-4 w-4" />
      case 'Desktop Application': return <Monitor className="h-4 w-4" />
      case 'Backend Service': return <Server className="h-4 w-4" />
      case 'Website': return <Code className="h-4 w-4" />
      default: return <Layers className="h-4 w-4" />
    }
  }

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleDateString('en-US', {
      year: 'numeric',
      month: 'short',
      day: 'numeric'
    })
  }

  const getProjectStats = () => {
    const completed = projects.filter(p => p.status === 'Completed').length
    const inProgress = projects.filter(p => p.status === 'In Progress').length
    const totalTeamSize = projects.reduce((sum, p) => sum + p.teamSize, 0)

    return { completed, inProgress, totalTeamSize, total: projects.length }
  }

  const stats = getProjectStats()

  if (loading) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="flex flex-col items-center space-y-4">
          <div className="animate-spin rounded-full h-8 w-8 border-b-2 border-blue-600"></div>
          <p className="text-sm text-gray-600">Loading projects...</p>
        </div>
      </div>
    )
  }

  if (error) {
    return (
      <div className="flex items-center justify-center h-full">
        <div className="text-center space-y-4">
          <AlertCircle className="h-12 w-12 text-red-500 mx-auto" />
          <div>
            <h3 className="text-lg font-semibold text-gray-900">Error Loading Projects</h3>
            <p className="text-sm text-gray-600 mt-1">{error}</p>
          </div>
        </div>
      </div>
    )
  }

  return (
    <div className="h-full flex flex-col bg-gradient-to-br from-slate-50 to-blue-50 overflow-hidden">
      {/* Header */}
      <div className="bg-white border-b border-gray-200 px-6 py-4">
        <div className="flex items-center justify-between">
          <div>
            <h1 className="text-2xl font-bold text-gray-900 flex items-center gap-2">
              <Code className="h-6 w-6 text-blue-600" />
              Project Portfolio
            </h1>
            <p className="text-sm text-gray-600 mt-1">
              Showcasing development expertise and technical achievements
            </p>
          </div>

          {/* Stats Cards */}
          <div className="flex gap-4">
            <div className="bg-blue-50 rounded-lg px-3 py-2 text-center">
              <div className="text-lg font-bold text-blue-600">{stats.total}</div>
              <div className="text-xs text-blue-600">Total Projects</div>
            </div>
            <div className="bg-green-50 rounded-lg px-3 py-2 text-center">
              <div className="text-lg font-bold text-green-600">{stats.completed}</div>
              <div className="text-xs text-green-600">Completed</div>
            </div>
            <div className="bg-yellow-50 rounded-lg px-3 py-2 text-center">
              <div className="text-lg font-bold text-yellow-600">{stats.inProgress}</div>
              <div className="text-xs text-yellow-600">In Progress</div>
            </div>
          </div>
        </div>
      </div>

      {/* Filters */}
      <div className="bg-white border-b border-gray-200 px-6 py-3">
        <div className="flex items-center gap-4">
          <div className="relative flex-1 max-w-md">
            <Search className="absolute left-3 top-1/2 transform -translate-y-1/2 h-4 w-4 text-gray-400" />
            <Input
              placeholder="Search projects..."
              value={searchTerm}
              onChange={(e) => setSearchTerm(e.target.value)}
              className="pl-10"
            />
          </div>

          <Select value={statusFilter} onValueChange={setStatusFilter}>
            <SelectTrigger className="w-40">
              <SelectValue placeholder="Status" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg">
              <SelectItem value="all">All Status</SelectItem>
              <SelectItem value="Completed">Completed</SelectItem>
              <SelectItem value="In Progress">In Progress</SelectItem>
              <SelectItem value="Planning">Planning</SelectItem>
              <SelectItem value="On Hold">On Hold</SelectItem>
            </SelectContent>
          </Select>

          <Select value={typeFilter} onValueChange={setTypeFilter}>
            <SelectTrigger className="w-48">
              <SelectValue placeholder="Type" />
            </SelectTrigger>
            <SelectContent className="bg-white border border-gray-200 shadow-lg">
              <SelectItem value="all">All Types</SelectItem>
              <SelectItem value="Web Application">Web Application</SelectItem>
              <SelectItem value="Mobile App">Mobile App</SelectItem>
              <SelectItem value="Desktop Application">Desktop Application</SelectItem>
              <SelectItem value="Backend Service">Backend Service</SelectItem>
              <SelectItem value="Website">Website</SelectItem>
            </SelectContent>
          </Select>
        </div>
      </div>

      {/* Main Content */}
      <div className="flex-1 flex overflow-hidden">
        {/* Projects Table */}
        <div className="flex-1 bg-white flex flex-col">
          <div className="flex-1 overflow-auto" style={{ maxHeight: 'calc(100vh - 200px)' }}>
            <Table>
              <TableHeader className="bg-slate-50 sticky top-0 z-10">
                <TableRow className="border-b border-gray-200 h-10">
                  <TableHead className="w-12 py-2"></TableHead>
                  <TableHead className="font-semibold text-gray-900 py-2">Project</TableHead>
                  <TableHead className="font-semibold text-gray-900 py-2">Type</TableHead>
                  <TableHead className="font-semibold text-gray-900 py-2">Technologies</TableHead>
                  <TableHead className="font-semibold text-gray-900 py-2">Status</TableHead>
                  <TableHead className="font-semibold text-gray-900 py-2">Actions</TableHead>
                  <TableHead className="w-8 py-2"></TableHead>
                </TableRow>
              </TableHeader>
              <TableBody>
                {filteredProjects.map((project) => (
                  <TableRow
                    key={project.id}
                    className="hover:bg-blue-50/50 cursor-pointer transition-colors border-b border-gray-100 h-12"
                    onClick={() => onOpenProjectDetails?.(project)}
                  >
                    <TableCell className="py-2">
                      <Avatar className="h-6 w-6">
                        <AvatarFallback className="text-xs bg-gradient-to-br from-blue-500 to-purple-600 text-white">
                          {project.icon}
                        </AvatarFallback>
                      </Avatar>
                    </TableCell>
                    <TableCell className="py-2">
                      <div>
                        <div className="font-medium text-sm text-gray-900 hover:text-blue-600 transition-colors leading-tight">
                          {project.name}
                        </div>
                        <div className="text-xs text-gray-500 mt-0.5 line-clamp-1 leading-tight">
                          {project.description}
                        </div>
                      </div>
                    </TableCell>
                    <TableCell className="py-2">
                      <div className="flex items-center gap-1.5">
                        {getTypeIcon(project.type)}
                        <span className="text-xs text-gray-600">{project.type}</span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2">
                      <div className="flex items-center gap-1">
                        <Code className="h-3 w-3 text-gray-400" />
                        <span className="text-xs text-gray-600 truncate max-w-[180px]">
                          {project.tech}
                        </span>
                      </div>
                    </TableCell>
                    <TableCell className="py-2">
                      <Badge className={`${getStatusColor(project.status)} border text-xs px-2 py-0.5`}>
                        <div className="flex items-center gap-1">
                          {getStatusIcon(project.status)}
                          <span className="text-xs font-medium">{project.status}</span>
                        </div>
                      </Badge>
                    </TableCell>
                    <TableCell className="py-2">
                      <div className="flex gap-1">
                        {project.githubUrl && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={(e) => {
                              e.stopPropagation()
                              window.open(project.githubUrl, '_blank')
                            }}
                          >
                            <Github className="h-3 w-3" />
                          </Button>
                        )}
                        {project.url && (
                          <Button
                            variant="outline"
                            size="sm"
                            className="h-6 px-2 text-xs"
                            onClick={(e) => {
                              e.stopPropagation()
                              window.open(project.url, '_blank')
                            }}
                          >
                            <ExternalLink className="h-3 w-3" />
                          </Button>
                        )}
                      </div>
                    </TableCell>
                    <TableCell className="py-2">
                      <ChevronRight className="h-3 w-3 text-gray-400" />
                    </TableCell>
                  </TableRow>
                ))}
              </TableBody>
            </Table>

            {filteredProjects.length === 0 && (
              <div className="text-center py-12">
                <Filter className="h-12 w-12 text-gray-400 mx-auto mb-4" />
                <h3 className="text-lg font-semibold text-gray-900 mb-2">No projects found</h3>
                <p className="text-gray-600">Try adjusting your search or filters</p>
              </div>
            )}
          </div>
        </div>


      </div>
    </div>
  )
}
