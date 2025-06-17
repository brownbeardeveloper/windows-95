"use client"

import { useFileSystem } from "@/hooks/use-file-system"

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

interface ProjectDetailsProps {
    project: Project
}

export default function ProjectDetails({ project }: ProjectDetailsProps) {

    const formatDate = (dateString?: string) => {
        if (!dateString) return 'Ongoing'
        return new Date(dateString).toLocaleDateString()
    }

    return (
        <div className="h-full bg-gray-300 flex flex-col font-sans overflow-auto">


            {/* Content */}
            <div className="flex-1 p-4 space-y-4 overflow-auto">
                {/* Header */}
                <div className="flex items-center space-x-4 pb-3 border-b-2 border-gray-400">
                    <span className="text-3xl">{project.icon}</span>
                    <div>
                        <h1 className="text-xl font-bold">{project.name}</h1>
                        <p className="text-sm text-gray-600">{project.type}</p>
                        <p className="text-xs text-blue-600">ID: {project.id}</p>
                    </div>
                </div>

                {/* Main Info Grid */}
                <div className="grid grid-cols-2 gap-6">
                    <div className="space-y-4">
                        <div className="bg-white border-2 border-gray-400 p-3">
                            <h3 className="text-sm font-bold mb-2 text-blue-800">📋 Project Information</h3>
                            <div className="space-y-2 text-sm">
                                <div>
                                    <strong>Technologies:</strong>
                                    <p className="ml-2">{project.tech}</p>
                                </div>
                                <div className="flex items-center">
                                    <strong>Status:</strong>
                                    <span className={`ml-2 px-2 py-0.5 rounded text-xs ${project.status === "Completed"
                                        ? "bg-green-200 text-green-800"
                                        : "bg-yellow-200 text-yellow-800"
                                        }`}>
                                        {project.status}
                                    </span>
                                </div>
                                {project.teamSize && (
                                    <div>
                                        <strong>Team Size:</strong>
                                        <span className="ml-2">{project.teamSize} members</span>
                                    </div>
                                )}
                            </div>
                        </div>

                        <div className="bg-white border-2 border-gray-400 p-3">
                            <h3 className="text-sm font-bold mb-2 text-blue-800">📅 Timeline</h3>
                            <div className="space-y-2 text-sm">
                                <div>
                                    <strong>Start Date:</strong>
                                    <span className="ml-2">{formatDate(project.startDate)}</span>
                                </div>
                                <div>
                                    <strong>End Date:</strong>
                                    <span className="ml-2">{formatDate(project.endDate)}</span>
                                </div>
                                {project.startDate && project.endDate && (
                                    <div>
                                        <strong>Duration:</strong>
                                        <span className="ml-2">
                                            {Math.ceil((new Date(project.endDate).getTime() - new Date(project.startDate).getTime()) / (1000 * 60 * 60 * 24 * 30))} months
                                        </span>
                                    </div>
                                )}
                            </div>
                        </div>

                        {/* File System Integration Info */}
                        <div className="bg-blue-50 border-2 border-blue-300 p-3">
                            <h3 className="text-sm font-bold mb-2 text-blue-800">🔗 File System Integration</h3>
                            <div className="space-y-1 text-xs text-gray-700">
                                <div>✅ Data loaded from centralized file system</div>
                                <div>✅ Real-time sync with Terminal and My Computer</div>
                                <div>✅ JSON-based data structure</div>
                                <div className="text-blue-600 font-mono">projects.json → {project.id}</div>
                            </div>
                        </div>
                    </div>

                    <div className="space-y-4">
                        {/* Description */}
                        <div className="bg-white border-2 border-gray-400 p-3">
                            <h3 className="text-sm font-bold mb-2 text-blue-800">📝 Description</h3>
                            <p className="text-sm text-gray-700 leading-relaxed">{project.description}</p>
                        </div>

                        {/* Actions */}
                        <div className="bg-white border-2 border-gray-400 p-3">
                            <h3 className="text-sm font-bold mb-3 text-blue-800">🚀 Actions</h3>
                            <div className="flex flex-col space-y-2">
                                {project.url && (
                                    <button
                                        onClick={() => window.open(project.url, '_blank')}
                                        className="px-3 py-2 text-sm bg-blue-600 text-white hover:bg-blue-700 border-2 border-blue-800 active:border-blue-900"
                                    >
                                        🌐 Visit Live Site
                                    </button>
                                )}
                                {project.githubUrl && (
                                    <button
                                        onClick={() => window.open(project.githubUrl, '_blank')}
                                        className="px-3 py-2 text-sm bg-gray-600 text-white hover:bg-gray-700 border-2 border-gray-800 active:border-gray-900"
                                    >
                                        📁 View Source Code
                                    </button>
                                )}
                                <div className="mt-2 p-2 bg-gray-100 rounded text-xs text-gray-600">
                                    <div className="font-semibold mb-1">💡 Try This:</div>
                                    <div>1. Open Terminal</div>
                                    <div>2. Type: <code className="bg-gray-200 px-1">cat Documents/projects.json</code></div>
                                    <div>3. See this project's data in real-time!</div>
                                </div>
                            </div>
                        </div>
                    </div>
                </div>

                {/* Challenges */}
                {project.challenges && project.challenges.length > 0 && (
                    <div className="bg-white border-2 border-gray-400 p-3">
                        <h3 className="text-sm font-bold mb-2 text-blue-800">🎯 Key Challenges</h3>
                        <ul className="text-sm space-y-1">
                            {project.challenges.map((challenge, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="text-red-600 mr-2">▪</span>
                                    <span>{challenge}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Achievements */}
                {project.achievements && project.achievements.length > 0 && (
                    <div className="bg-white border-2 border-gray-400 p-3">
                        <h3 className="text-sm font-bold mb-2 text-blue-800">🏆 Key Achievements</h3>
                        <ul className="text-sm space-y-1">
                            {project.achievements.map((achievement, index) => (
                                <li key={index} className="flex items-start">
                                    <span className="text-green-600 mr-2">▪</span>
                                    <span>{achievement}</span>
                                </li>
                            ))}
                        </ul>
                    </div>
                )}

                {/* Technical Specs */}
                <div className="bg-white border-2 border-gray-400 p-3">
                    <h3 className="text-sm font-bold mb-2 text-blue-800">💻 Technical Specifications</h3>
                    <div className="grid grid-cols-2 gap-4 text-sm">
                        <div>
                            <strong>Project Type:</strong>
                            <p className="ml-2">{project.type}</p>
                        </div>
                        <div>
                            <strong>Technologies Used:</strong>
                            <p className="ml-2">{project.tech}</p>
                        </div>
                        {project.teamSize && (
                            <>
                                <div>
                                    <strong>Team Collaboration:</strong>
                                    <p className="ml-2">{project.teamSize > 1 ? "Multi-developer team" : "Solo project"}</p>
                                </div>
                                <div>
                                    <strong>Project Scale:</strong>
                                    <p className="ml-2">
                                        {project.teamSize === 1 ? "Individual" :
                                            project.teamSize <= 3 ? "Small team" :
                                                project.teamSize <= 5 ? "Medium team" : "Large team"}
                                    </p>
                                </div>
                            </>
                        )}
                    </div>
                </div>

                {/* Data Source Information */}
                <div className="bg-green-50 border-2 border-green-300 p-3">
                    <h3 className="text-sm font-bold mb-2 text-green-800">🗃️ Data Source & Architecture</h3>
                    <div className="text-sm space-y-1">
                        <div className="flex items-center space-x-2">
                            <span className="text-green-600">✓</span>
                            <span>Centralized File System Integration</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-green-600">✓</span>
                            <span>Real-time synchronization across all apps</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-green-600">✓</span>
                            <span>JSON-based data structure for scalability</span>
                        </div>
                        <div className="flex items-center space-x-2">
                            <span className="text-green-600">✓</span>
                            <span>Terminal, My Computer, and Projects app synchronized</span>
                        </div>
                        <div className="mt-2 text-xs text-gray-600 font-mono bg-gray-100 p-2 rounded">
                            File Location: C:\Documents\projects.json<br />
                            Project ID: {project.id}<br />
                            Last Modified: {new Date().toLocaleString()}
                        </div>
                    </div>
                </div>
            </div>
        </div>
    )
} 