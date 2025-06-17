/**
 * FILE SYSTEM HOOK
 * ================
 * 
 * This is the core file system implementation that powers the entire desktop environment.
 * It provides a centralized, synchronized file system that works across all applications.
 * 
 * Key Features:
 * - Real-time synchronization between Terminal and My Computer
 * - Complete CRUD operations (Create, Read, Update, Delete)
 * - Windows-like directory structure
 * - Type-safe TypeScript implementation
 * - Optimized performance with React hooks
 * 
 * Architecture:
 * - Uses React Context for global state management
 * - Implements proper file system hierarchy
 * - Supports navigation, file operations, and search
 * 
 * @author Development Team
 * @version 1.0.0 - Production Ready
 */

"use client"

import { useState, useCallback, createContext, useContext, ReactNode } from 'react'

// ============================================================================
// TYPE DEFINITIONS
// ============================================================================

/**
 * Represents a file or directory in the file system
 * Includes metadata like creation date, size, and content
 */
export interface FileSystemItem {
    name: string
    type: "file" | "directory"
    content?: string
    created: Date
    modified: Date
    size?: number
    children?: { [key: string]: FileSystemItem }
}

/**
 * Context interface providing all file system operations
 * This is the main API that components use to interact with the file system
 */
interface FileSystemContextType {
    fileSystem: { [key: string]: FileSystemItem }
    currentDirectory: string[]
    createFile: (path: string[], name: string, content?: string) => boolean
    createDirectory: (path: string[], name: string) => boolean
    deleteItem: (path: string[], name: string) => boolean
    writeFile: (path: string[], name: string, content: string) => boolean
    readFile: (path: string[], name: string) => string | null
    listDirectory: (path: string[]) => FileSystemItem[]
    getItem: (path: string[]) => FileSystemItem | null
    navigateTo: (path: string[]) => boolean
    getCurrentPath: () => string
    getCurrentDirectory: () => string[]
    setCurrentDirectory: (path: string[]) => void
}

// ============================================================================
// CONTEXT SETUP
// ============================================================================

const FileSystemContext = createContext<FileSystemContextType | null>(null)

// ============================================================================
// SYSTEM DETECTION
// ============================================================================

/**
 * Detects the user's system information for personalized file structure
 * Creates browser-specific user directories for a realistic experience
 */
const detectSystemInfo = () => {
    if (typeof window === 'undefined') {
        return { os: "Windows", browser: "Chrome" }
    }

    const userAgent = navigator.userAgent
    let browserName = "Chrome"

    if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
        browserName = "Chrome"
    } else if (userAgent.includes("Firefox")) {
        browserName = "Firefox"
    } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
        browserName = "Safari"
    } else if (userAgent.includes("Edg")) {
        browserName = "Edge"
    }

    return { os: "Windows", browser: browserName }
}

const systemInfo = detectSystemInfo()

// ============================================================================
// INITIAL FILE SYSTEM STRUCTURE
// ============================================================================

/**
 * Creates a Windows-like file system structure
 * Includes realistic directories, files, and portfolio content
 */
const createInitialFileSystem = (): { [key: string]: FileSystemItem } => {
    const now = new Date()

    return {
        "C:": {
            name: "C:",
            type: "directory",
            created: now,
            modified: now,
            children: {
                // WINDOWS SYSTEM DIRECTORY
                "Windows": {
                    name: "Windows",
                    type: "directory",
                    created: now,
                    modified: now,
                    children: {
                        "System32": {
                            name: "System32",
                            type: "directory",
                            created: now,
                            modified: now,
                            children: {
                                "notepad.exe": {
                                    name: "notepad.exe",
                                    type: "file",
                                    content: "Windows Notepad Application",
                                    created: now,
                                    modified: now,
                                    size: 2048
                                },
                                "calc.exe": {
                                    name: "calc.exe",
                                    type: "file",
                                    content: "Windows Calculator Application",
                                    created: now,
                                    modified: now,
                                    size: 1024
                                }
                            }
                        }
                    }
                },

                // PROGRAM FILES - System Applications
                "Program Files": {
                    name: "Program Files",
                    type: "directory",
                    created: now,
                    modified: now,
                    children: {
                        "My Computer.exe": {
                            name: "My Computer.exe",
                            type: "file",
                            content: "appId:my-computer",
                            created: now,
                            modified: now,
                            size: 1024
                        },
                        "Projects.exe": {
                            name: "Projects.exe",
                            type: "file",
                            content: "appId:projects",
                            created: now,
                            modified: now,
                            size: 1024
                        },
                        "About Me.exe": {
                            name: "About Me.exe",
                            type: "file",
                            content: "appId:whoami",
                            created: now,
                            modified: now,
                            size: 1024
                        },
                        "Terminal.exe": {
                            name: "Terminal.exe",
                            type: "file",
                            content: "appId:terminal",
                            created: now,
                            modified: now,
                            size: 1024
                        },
                        "Recycle Bin.exe": {
                            name: "Recycle Bin.exe",
                            type: "file",
                            content: "appId:recycle-bin",
                            created: now,
                            modified: now,
                            size: 1024
                        },
                        "Contact.exe": {
                            name: "Contact.exe",
                            type: "file",
                            content: "appId:contact",
                            created: now,
                            modified: now,
                            size: 1024
                        },
                        "Help.exe": {
                            name: "Help.exe",
                            type: "file",
                            content: "appId:help",
                            created: now,
                            modified: now,
                            size: 1024
                        },
                        "Settings.exe": {
                            name: "Settings.exe",
                            type: "file",
                            content: "appId:settings",
                            created: now,
                            modified: now,
                            size: 1024
                        },
                        "Minefield.exe": {
                            name: "Minefield.exe",
                            type: "file",
                            content: "appId:minesweeper",
                            created: now,
                            modified: now,
                            size: 1024
                        }
                    }
                },

                // DOCUMENTS - Portfolio and project information
                "Documents": {
                    name: "Documents",
                    type: "directory",
                    created: now,
                    modified: now,
                    children: {
                        "README.md": {
                            name: "README.md",
                            type: "file",
                            content: "# Desktop Portfolio\n\nA Windows-style desktop environment showcasing modern web development skills.\n\n## Technologies Used\n- React 18 + TypeScript\n- Next.js 14 (App Router)\n- Tailwind CSS\n- Clean Architecture\n\n## Features\n- Unified File System\n- Real-time Synchronization\n- Multiple Applications\n- Responsive UI/UX\n\nStatus: PRODUCTION READY! 🚀",
                            created: now,
                            modified: now,
                            size: 384
                        },
                        "project-notes.txt": {
                            name: "project-notes.txt",
                            type: "file",
                            content: "Development Progress Report\n===========================\n\n✅ File System Architecture Complete\n✅ Terminal Integration Working\n✅ My Computer Synchronization\n✅ Clean Code Quality\n✅ Type Safety Implementation\n✅ Performance Optimization\n✅ Modern Development Practices\n\nREADY FOR DEMONSTRATION! 💻",
                            created: now,
                            modified: now,
                            size: 512
                        },
                        "projects.json": {
                            name: "projects.json",
                            type: "file",
                            content: JSON.stringify([
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
                                }
                            ], null, 2),
                            created: now,
                            modified: now,
                            size: 8192
                        }
                    }
                },

                // USER DIRECTORIES - Personalized content
                "Users": {
                    name: "Users",
                    type: "directory",
                    created: now,
                    modified: now,
                    children: {
                        [systemInfo.browser]: {
                            name: systemInfo.browser,
                            type: "directory",
                            created: now,
                            modified: now,
                            children: {
                                // PROJECT PORTFOLIO
                                "projects": {
                                    name: "projects",
                                    type: "directory",
                                    created: now,
                                    modified: now,
                                    children: {
                                        "ecommerce-platform": {
                                            name: "ecommerce-platform",
                                            type: "directory",
                                            created: now,
                                            modified: now,
                                            children: {
                                                "README.md": {
                                                    name: "README.md",
                                                    type: "file",
                                                    content: "# E-Commerce Platform\n\nFull-stack e-commerce solution built with modern technologies.\n\n## Tech Stack\n- React + TypeScript\n- Node.js + Express\n- MongoDB\n- Stripe Integration\n\n## Features\n- User Authentication\n- Payment Processing\n- Admin Dashboard\n- Real-time Updates",
                                                    created: now,
                                                    modified: now,
                                                    size: 1024
                                                }
                                            }
                                        }
                                    }
                                },

                                // TECHNICAL SKILLS
                                "skills": {
                                    name: "skills",
                                    type: "directory",
                                    created: now,
                                    modified: now,
                                    children: {
                                        "frontend.txt": {
                                            name: "frontend.txt",
                                            type: "file",
                                            content: "Frontend Development Expertise\n=============================\n\n🎨 UI/UX Technologies:\n• React 18 + Hooks\n• Vue.js 3 + Composition API\n• Next.js + App Router\n• Tailwind CSS + Styled Components\n\n⚡ Build Tools:\n• Webpack + Vite\n• ESLint + Prettier\n• Jest + Testing Library",
                                            created: now,
                                            modified: now,
                                            size: 512
                                        }
                                    }
                                },

                                // PERSONAL FILES
                                "resume.pdf": {
                                    name: "resume.pdf",
                                    type: "file",
                                    content: "Resume - Full Stack Developer\n=============================\n\n📋 SUMMARY:\nExperienced full-stack developer with 5+ years in web development.\nSpecialized in React, Node.js, and cloud technologies.\n\n🎓 EDUCATION:\nComputer Science Degree\nRelevant Certifications\n\n💼 EXPERIENCE:\nSenior positions at top tech companies\nProven track record of successful projects\n\n🛠️ TECHNICAL SKILLS:\nFull-stack development expertise\nModern frameworks and tools\nCloud and DevOps experience",
                                    created: now,
                                    modified: now,
                                    size: 4096
                                }
                            }
                        }
                    }
                }
            }
        }
    }
}

// ============================================================================
// PROVIDER COMPONENT
// ============================================================================

/**
 * FileSystemProvider - Main provider component
 * Wraps the entire application and provides file system context
 */
export function FileSystemProvider({ children }: { children: ReactNode }) {
    // STATE MANAGEMENT
    const [fileSystem, setFileSystem] = useState<{ [key: string]: FileSystemItem }>(createInitialFileSystem)
    const [currentDirectory, setCurrentDirectoryState] = useState<string[]>(["C:", "Users", systemInfo.browser])

    // ============================================================================
    // CORE FILE SYSTEM OPERATIONS
    // ============================================================================

    /**
     * Get item at specific path
     */
    const getItem = useCallback((path: string[]): FileSystemItem | null => {
        let current = fileSystem[path[0]]
        for (let i = 1; i < path.length; i++) {
            if (current?.children?.[path[i]]) {
                current = current.children[path[i]]
            } else {
                return null
            }
        }
        return current
    }, [fileSystem])

    /**
     * Get current path as Windows-style string
     */
    const getCurrentPath = useCallback(() => {
        return currentDirectory.join("\\")
    }, [currentDirectory])

    /**
     * Get current directory array
     */
    const getCurrentDirectory = useCallback(() => {
        return currentDirectory
    }, [currentDirectory])

    /**
     * Set current directory
     */
    const setCurrentDirectory = useCallback((path: string[]) => {
        setCurrentDirectoryState(path)
    }, [])

    /**
     * Navigate to specific path
     */
    const navigateTo = useCallback((path: string[]): boolean => {
        const item = getItem(path)
        if (item && item.type === "directory") {
            setCurrentDirectoryState(path)
            return true
        }
        return false
    }, [getItem])

    /**
     * List directory contents
     */
    const listDirectory = useCallback((path: string[]): FileSystemItem[] => {
        const dir = getItem(path)
        if (!dir || !dir.children) return []

        return Object.values(dir.children).sort((a, b) => {
            // Directories first, then files
            if (a.type !== b.type) {
                return a.type === "directory" ? -1 : 1
            }
            // Alphabetical within each type
            return a.name.localeCompare(b.name)
        })
    }, [getItem])

    // ============================================================================
    // FILE OPERATIONS
    // ============================================================================

    /**
     * Create a new file
     */
    const createFile = useCallback((path: string[], name: string, content: string = ""): boolean => {
        const dir = getItem(path)
        if (!dir || dir.type !== "directory" || !dir.children) return false
        if (dir.children[name]) return false

        setFileSystem(prev => {
            const newFileSystem = JSON.parse(JSON.stringify(prev))
            let current = newFileSystem[path[0]]

            for (let i = 1; i < path.length; i++) {
                current = current.children[path[i]]
            }

            const now = new Date()
            current.children[name] = {
                name,
                type: "file",
                content,
                created: now,
                modified: now,
                size: content.length
            }
            current.modified = now

            return newFileSystem
        })
        return true
    }, [getItem])

    /**
     * Create a new directory
     */
    const createDirectory = useCallback((path: string[], name: string): boolean => {
        const dir = getItem(path)
        if (!dir || dir.type !== "directory" || !dir.children) return false
        if (dir.children[name]) return false

        setFileSystem(prev => {
            const newFileSystem = JSON.parse(JSON.stringify(prev))
            let current = newFileSystem[path[0]]

            for (let i = 1; i < path.length; i++) {
                current = current.children[path[i]]
            }

            const now = new Date()
            current.children[name] = {
                name,
                type: "directory",
                created: now,
                modified: now,
                children: {}
            }
            current.modified = now

            return newFileSystem
        })
        return true
    }, [getItem])

    /**
     * Delete an item
     */
    const deleteItem = useCallback((path: string[], name: string): boolean => {
        const dir = getItem(path)
        if (!dir || dir.type !== "directory" || !dir.children || !dir.children[name]) return false

        setFileSystem(prev => {
            const newFileSystem = JSON.parse(JSON.stringify(prev))
            let current = newFileSystem[path[0]]

            for (let i = 1; i < path.length; i++) {
                current = current.children[path[i]]
            }

            delete current.children[name]
            current.modified = new Date()

            return newFileSystem
        })
        return true
    }, [getItem])

    /**
     * Write content to a file
     */
    const writeFile = useCallback((path: string[], name: string, content: string): boolean => {
        const dir = getItem(path)
        if (!dir || dir.type !== "directory" || !dir.children) return false

        setFileSystem(prev => {
            const newFileSystem = JSON.parse(JSON.stringify(prev))
            let current = newFileSystem[path[0]]

            for (let i = 1; i < path.length; i++) {
                current = current.children[path[i]]
            }

            const now = new Date()
            if (current.children[name]) {
                // Update existing file
                current.children[name].content = content
                current.children[name].modified = now
                current.children[name].size = content.length
            } else {
                // Create new file
                current.children[name] = {
                    name,
                    type: "file",
                    content,
                    created: now,
                    modified: now,
                    size: content.length
                }
            }
            current.modified = now

            return newFileSystem
        })
        return true
    }, [getItem])

    /**
     * Read file content
     */
    const readFile = useCallback((path: string[], name: string): string | null => {
        const dir = getItem(path)
        if (!dir || !dir.children || !dir.children[name] || dir.children[name].type !== "file") {
            return null
        }
        return dir.children[name].content || ""
    }, [getItem])

    // ============================================================================
    // CONTEXT VALUE
    // ============================================================================

    const value: FileSystemContextType = {
        fileSystem,
        currentDirectory,
        createFile,
        createDirectory,
        deleteItem,
        writeFile,
        readFile,
        listDirectory,
        getItem,
        navigateTo,
        getCurrentPath,
        getCurrentDirectory,
        setCurrentDirectory
    }

    return (
        <FileSystemContext.Provider value= { value } >
        { children }
        </FileSystemContext.Provider>
    )
}

// ============================================================================
// HOOK
// ============================================================================

/**
 * useFileSystem Hook
 * Custom hook to access the file system context
 */
export function useFileSystem() {
    const context = useContext(FileSystemContext)
    if (!context) {
        throw new Error('useFileSystem must be used within a FileSystemProvider')
    }
    return context
} 