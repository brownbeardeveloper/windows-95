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
 * @author @brownbeardeveloper
 * @version Desktop v1.2
 */

"use client"

import React, { useState, useCallback, createContext, useContext, ReactNode } from 'react'

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
 * Application definition extracted from file system
 * Replaces the old apps.ts approach with dynamic file system queries
 */
export interface AppDefinition {
    id: string
    title: string
    component: string
    icon: string
    width?: number
    height?: number
    category?: 'system' | 'project' | 'utility' | 'other'
}

/**
 * Context interface providing all file system operations
 * This is the main API that components use to interact with the file system
 * Note: No global currentDirectory - each app manages its own directory state
 */
interface FileSystemContextType {
    fileSystem: { [key: string]: FileSystemItem }
    createFile: (path: string[], name: string, content?: string) => boolean
    createDirectory: (path: string[], name: string) => boolean
    deleteItem: (path: string[], name: string) => boolean
    writeFile: (path: string[], name: string, content: string) => boolean
    readFile: (path: string[], name: string) => string | null
    listDirectory: (path: string[]) => FileSystemItem[]
    getItem: (path: string[]) => FileSystemItem | null
    isValidPath: (path: string[]) => boolean
    getDefaultPath: () => string[]
    // App registry functions
    getApp: (id: string) => AppDefinition | null
    getAllApps: () => AppDefinition[]
    getAppsByCategory: (category: string) => AppDefinition[]
    getDesktopApps: () => string[]
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
                            content: "# Desktop v1.2\n\nA Windows-style desktop environment showcasing modern web development skills.\n\n## Technologies Used\n- React 18 + TypeScript\n- Next.js 14 (App Router)\n- Tailwind CSS\n- Clean Architecture\n\n## Features\n- Unified File System\n- Independent Application Navigation\n- Multiple Applications\n- Responsive UI/UX\n\n## Author\n@brownbeardeveloper\n\nStatus: PRODUCTION READY! 🚀",
                            created: now,
                            modified: now,
                            size: 448
                        },
                        "project-notes.txt": {
                            name: "project-notes.txt",
                            type: "file",
                            content: "Desktop v1.2 - Development Progress Report\n==========================================\n\n✅ File System Architecture Complete\n✅ Independent Application Navigation\n✅ Terminal & My Computer Working\n✅ Clean Code Quality\n✅ Type Safety Implementation\n✅ Performance Optimization\n✅ Modern Development Practices\n\nAuthor: @brownbeardeveloper\nREADY FOR DEMONSTRATION! 💻",
                            created: now,
                            modified: now,
                            size: 576
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
     * Check if a path is valid (directory exists)
     */
    const isValidPath = useCallback((path: string[]): boolean => {
        const item = getItem(path)
        return item !== null && item.type === "directory"
    }, [getItem])

    /**
     * Get default starting path for applications
     */
    const getDefaultPath = useCallback((): string[] => {
        return ["C:", "Users", systemInfo.browser]
    }, [])

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
    // APP REGISTRY FUNCTIONS
    // ============================================================================

    /**
     * App metadata registry - replaces apps.ts with dynamic file system approach
     * This creates the bridge between executable files and their app definitions
     */
    const APP_REGISTRY: Record<string, Omit<AppDefinition, 'id' | 'component'>> = {
        'my-computer': {
            title: 'My Computer',
            icon: '💻',
            width: 500,
            height: 350,
            category: 'system'
        },
        'projects': {
            title: 'Projects',
            icon: '📁',
            width: 800,
            height: 550,
            category: 'project'
        },
        'whoami': {
            title: 'About Me',
            icon: '👤',
            width: 480,
            height: 360,
            category: 'utility'
        },
        'terminal': {
            title: 'Terminal',
            icon: '🖥',
            width: 600,
            height: 400,
            category: 'system'
        },
        'recycle-bin': {
            title: 'Recycle Bin',
            icon: '🗑️',
            width: 500,
            height: 300,
            category: 'system'
        },
        'contact': {
            title: 'Contact',
            icon: '📧',
            width: 400,
            height: 300,
            category: 'utility'
        },
        'help': {
            title: 'Help',
            icon: '❓',
            width: 500,
            height: 400,
            category: 'utility'
        },
        'settings': {
            title: 'Settings',
            icon: '⚙️',
            width: 450,
            height: 350,
            category: 'system'
        },
        'minesweeper': {
            title: 'Minefield',
            icon: '💣',
            width: 500,
            height: 600,
            category: 'utility'
        }
    }

    /**
     * Get app definition by ID from file system
     */
    const getApp = useCallback((id: string): AppDefinition | null => {
        const appMeta = APP_REGISTRY[id]
        if (!appMeta) return null

        return {
            id,
            component: id,
            ...appMeta
        }
    }, [])

    /**
     * Get all available apps from Program Files directory
     */
    const getAllApps = useCallback((): AppDefinition[] => {
        const programFiles = listDirectory(['C:', 'Program Files'])
        const apps: AppDefinition[] = []

        programFiles.forEach(file => {
            if (file.type === 'file' && file.name.endsWith('.exe') && file.content?.startsWith('appId:')) {
                const appId = file.content.replace('appId:', '')
                const app = getApp(appId)
                if (app) {
                    apps.push(app)
                }
            }
        })

        return apps
    }, [listDirectory, getApp])

    /**
     * Get apps by category
     */
    const getAppsByCategory = useCallback((category: string): AppDefinition[] => {
        return getAllApps().filter(app => app.category === category)
    }, [getAllApps])

    /**
     * Get apps that should appear on desktop
     */
    const getDesktopApps = useCallback((): string[] => {
        return [
            'my-computer',
            'projects',
            'whoami',
            'terminal',
            'recycle-bin',
            'minesweeper'
        ]
    }, [])

    // ============================================================================
    // CONTEXT VALUE
    // ============================================================================

    const value: FileSystemContextType = {
        fileSystem,
        createFile,
        createDirectory,
        deleteItem,
        writeFile,
        readFile,
        listDirectory,
        getItem,
        isValidPath,
        getDefaultPath,
        getApp,
        getAllApps,
        getAppsByCategory,
        getDesktopApps
    }

    return (
        <FileSystemContext.Provider value={value}>
            {children}
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

/**
 * useDirectory Hook
 * Custom hook for independent directory navigation
 * Each application instance gets its own directory state
 */
export function useDirectory(initialPath?: string[]) {
    const { getDefaultPath, isValidPath } = useFileSystem()
    const [currentDirectory, setCurrentDirectory] = useState<string[]>(
        initialPath || getDefaultPath()
    )

    /**
     * Navigate to a specific path
     */
    const navigateTo = useCallback((path: string[]): boolean => {
        if (isValidPath(path)) {
            setCurrentDirectory(path)
            return true
        }
        return false
    }, [isValidPath])

    /**
     * Get current path as Windows-style string
     */
    const getCurrentPath = useCallback((): string => {
        return currentDirectory.join("\\")
    }, [currentDirectory])

    /**
     * Get current directory array
     */
    const getCurrentDirectory = useCallback((): string[] => {
        return currentDirectory
    }, [currentDirectory])

    /**
     * Navigate up one directory level
     */
    const navigateUp = useCallback((): boolean => {
        if (currentDirectory.length > 1) {
            const parentPath = currentDirectory.slice(0, -1)
            return navigateTo(parentPath)
        }
        return false
    }, [currentDirectory, navigateTo])

    /**
     * Navigate to a subdirectory
     */
    const navigateToChild = useCallback((childName: string): boolean => {
        const childPath = [...currentDirectory, childName]
        return navigateTo(childPath)
    }, [currentDirectory, navigateTo])

    return {
        currentDirectory,
        setCurrentDirectory,
        navigateTo,
        getCurrentPath,
        getCurrentDirectory,
        navigateUp,
        navigateToChild
    }
} 