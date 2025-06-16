"use client"

import { useState, useCallback, useEffect } from "react"

interface Project {
  id: string
  name: string
  icon: string
  type: string
  tech: string
  status: "Completed" | "In Progress"
  description: string
  url?: string
  githubUrl?: string
  startDate?: string
  endDate?: string
  teamSize?: number
  challenges?: string[]
  achievements?: string[]
}

interface ProjectsProps {
  onOpenProjectDetails?: (project: Project) => void
}

export default function Projects({ onOpenProjectDetails }: ProjectsProps) {
  const [selectedProjects, setSelectedProjects] = useState<Set<string>>(new Set())
  const [isMobile, setIsMobile] = useState(false)

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const [projects, setProjects] = useState<Project[]>([
    {
      id: "ecommerce-platform",
      name: "E-Commerce Platform",
      icon: "🛒",
      type: "Web Application",
      tech: "React, Node.js, MongoDB",
      status: "Completed",
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
      status: "In Progress",
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
      status: "Completed",
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
      status: "Completed",
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
      status: "Completed",
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
      status: "In Progress",
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
      status: "In Progress",
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
      status: "Completed",
      description: "Microservices API gateway with load balancing",
      githubUrl: "https://github.com/developer/api-gateway",
      startDate: "2022-03-01",
      endDate: "2022-08-15",
      teamSize: 5,
      challenges: ["High availability", "Load balancing", "Security"],
      achievements: ["99.9% uptime", "Handles 1M+ requests/day", "Zero-downtime deployments"]
    },
  ])

  const handleProjectClick = useCallback((project: Project, event: React.MouseEvent) => {
    if (event.ctrlKey || event.metaKey) {
      // Multi-select with Ctrl/Cmd
      setSelectedProjects(prev => {
        const newSet = new Set(prev)
        if (newSet.has(project.id)) {
          newSet.delete(project.id)
        } else {
          newSet.add(project.id)
        }
        return newSet
      })
    } else {
      // Single select
      setSelectedProjects(new Set([project.id]))
    }
  }, [])

  const handleProjectDoubleClick = useCallback((project: Project, event: React.MouseEvent) => {
    event.preventDefault()
    if (onOpenProjectDetails) {
      onOpenProjectDetails(project)
    }
  }, [onOpenProjectDetails])

  const handleProjectSingleClick = useCallback((project: Project, event: React.MouseEvent) => {
    // On mobile, single click opens details
    if (isMobile && onOpenProjectDetails) {
      onOpenProjectDetails(project)
    } else {
      // On desktop, single click just selects
      handleProjectClick(project, event)
    }
  }, [isMobile, onOpenProjectDetails, handleProjectClick])



  return (
    <div className="h-full bg-white flex flex-col">
      {/* Menu Bar */}
      <div className="bg-gray-300 border-b border-gray-400 px-2 py-1">
        <div className="flex space-x-4 text-xs">
          <button className="hover:bg-blue-600 hover:text-white px-2 py-1">File</button>
          <button className="hover:bg-blue-600 hover:text-white px-2 py-1">Edit</button>
          <button className="hover:bg-blue-600 hover:text-white px-2 py-1">View</button>
          <button className="hover:bg-blue-600 hover:text-white px-2 py-1">Tools</button>
          <button className="hover:bg-blue-600 hover:text-white px-2 py-1">Help</button>
        </div>
      </div>



      {/* Content Area */}
      <div className="flex-1 overflow-auto">
        <div>
          {/* Column Headers */}
          <div className="flex bg-gray-300 border-b-2 border-gray-400 sticky top-0">
            <div className="w-48 px-2 py-1 text-xs font-bold border-r border-gray-400 bg-gray-300 border-t border-white border-l border-white">
              Project Name
            </div>
            <div className="w-32 px-2 py-1 text-xs font-bold border-r border-gray-400 bg-gray-300 border-t border-white">
              Type
            </div>
            <div className="w-40 px-2 py-1 text-xs font-bold border-r border-gray-400 bg-gray-300 border-t border-white">
              Technologies
            </div>
            <div className="w-24 px-2 py-1 text-xs font-bold border-r border-gray-400 bg-gray-300 border-t border-white">
              Status
            </div>
            <div className="flex-1 px-2 py-1 text-xs font-bold bg-gray-300 border-t border-white border-r border-white">
              Description
            </div>
          </div>

          {/* Project Items */}
          <div className="bg-white">
            {projects.map((project) => (
              <div
                key={project.id}
                className={`flex items-center text-xs border-b border-gray-200 cursor-pointer ${selectedProjects.has(project.id)
                  ? "bg-blue-600 text-white"
                  : "hover:bg-blue-600 hover:text-white"
                  }`}
                onClick={(e) => handleProjectSingleClick(project, e)}
                onDoubleClick={(e) => handleProjectDoubleClick(project, e)}
              >
                <div className="w-48 flex items-center space-x-2 px-2 py-2">
                  <span className="text-lg">{project.icon}</span>
                  <span className="font-medium">{project.name}</span>
                </div>
                <div className="w-32 px-2 py-2">{project.type}</div>
                <div className="w-40 px-2 py-2 text-xs">{project.tech}</div>
                <div className="w-24 px-2 py-2">
                  <span
                    className={`px-1 py-0.5 rounded text-xs ${project.status === "Completed"
                      ? selectedProjects.has(project.id)
                        ? "bg-green-800 text-green-200"
                        : "bg-green-200 text-green-800"
                      : selectedProjects.has(project.id)
                        ? "bg-yellow-800 text-yellow-200"
                        : "bg-yellow-200 text-yellow-800"
                      }`}
                  >
                    {project.status}
                  </span>
                </div>
                <div className="flex-1 px-2 py-2 text-xs">{project.description}</div>
              </div>
            ))}
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-5 bg-gray-300 border-t border-gray-400 px-2 flex items-center">
        <span className="text-xs status-bar-text">
          {projects.length} project(s) | {selectedProjects.size} selected | {isMobile ? 'Tap' : 'Double-click'} to open details
        </span>
      </div>
    </div>
  )
}
