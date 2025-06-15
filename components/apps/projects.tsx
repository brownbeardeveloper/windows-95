"use client"

export default function Projects() {
  const projects = [
    {
      name: "E-Commerce Platform",
      icon: "🛒",
      type: "Web Application",
      tech: "React, Node.js, MongoDB",
      status: "Completed",
      description: "Full-stack e-commerce solution with payment integration",
    },
    {
      name: "Task Management App",
      icon: "📋",
      type: "Mobile App",
      tech: "React Native, Firebase",
      status: "In Progress",
      description: "Cross-platform productivity app with real-time sync",
    },
    {
      name: "Weather Dashboard",
      icon: "🌤️",
      type: "Web Application",
      tech: "Vue.js, Express, API",
      status: "Completed",
      description: "Interactive weather visualization with forecasting",
    },
    {
      name: "Portfolio Website",
      icon: "💼",
      type: "Website",
      tech: "Next.js, Tailwind CSS",
      status: "Completed",
      description: "Personal portfolio showcasing projects and skills",
    },
    {
      name: "Chat Application",
      icon: "💬",
      type: "Web Application",
      tech: "Socket.io, React, Node.js",
      status: "Completed",
      description: "Real-time messaging app with group chat features",
    },
    {
      name: "Data Visualization Tool",
      icon: "📊",
      type: "Web Application",
      tech: "D3.js, Python, Flask",
      status: "In Progress",
      description: "Interactive charts and graphs for business analytics",
    },
    {
      name: "Game Engine",
      icon: "🎮",
      type: "Desktop Application",
      tech: "C++, OpenGL, SDL",
      status: "In Progress",
      description: "2D game engine with physics and rendering systems",
    },
    {
      name: "API Gateway",
      icon: "🔗",
      type: "Backend Service",
      tech: "Go, Docker, Kubernetes",
      status: "Completed",
      description: "Microservices API gateway with load balancing",
    },
  ]

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

      {/* Toolbar */}
      <div className="bg-gray-300 border-b border-gray-400 px-2 py-1 flex items-center space-x-2">
        <button className="px-2 py-1 text-xs border border-gray-400 bg-white hover:bg-gray-100">Open</button>
        <button className="px-2 py-1 text-xs border border-gray-400 bg-white hover:bg-gray-100">Details</button>
        <button className="px-2 py-1 text-xs border border-gray-400 bg-white hover:bg-gray-100">Refresh</button>
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
            {projects.map((project, index) => (
              <div
                key={index}
                className="flex items-center text-xs hover:bg-blue-600 hover:text-white border-b border-gray-200 cursor-pointer"
              >
                <div className="w-48 flex items-center space-x-2 px-2 py-2">
                  <span className="text-lg">{project.icon}</span>
                  <span className="font-medium">{project.name}</span>
                </div>
                <div className="w-32 px-2 py-2">{project.type}</div>
                <div className="w-40 px-2 py-2 text-xs">{project.tech}</div>
                <div className="w-24 px-2 py-2">
                  <span
                    className={`px-1 py-0.5 rounded text-xs ${
                      project.status === "Completed" ? "bg-green-200 text-green-800" : "bg-yellow-200 text-yellow-800"
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
        <span className="text-xs">{projects.length} project(s)</span>
      </div>
    </div>
  )
}
