export interface AppDefinition {
    id: string
    title: string
    component: string
    icon: string
    width?: number
    height?: number
    category?: 'system' | 'project' | 'utility' | 'other'
}

export const APPS: Record<string, AppDefinition> = {
    'my-computer': {
        id: 'my-computer',
        title: 'My Computer',
        component: 'my-computer',
        icon: '💻',
        width: 500,
        height: 350,
        category: 'system'
    },
    'projects': {
        id: 'projects',
        title: 'Projects',
        component: 'projects',
        icon: '📁',
        width: 800,
        height: 550,
        category: 'project'
    },
    'whoami': {
        id: 'whoami',
        title: 'whoami',
        component: 'whoami',
        icon: '👤',
        width: 480,
        height: 360,
        category: 'utility'
    },
    'terminal': {
        id: 'terminal',
        title: 'MS-DOS Prompt',
        component: 'terminal',
        icon: '⬛',
        width: 600,
        height: 400,
        category: 'system'
    },
    'recycle-bin': {
        id: 'recycle-bin',
        title: 'Recycle Bin',
        component: 'recycle-bin',
        icon: '🗑️',
        width: 400,
        height: 300,
        category: 'system'
    },

    'contact': {
        id: 'contact',
        title: 'Contact',
        component: 'contact',
        icon: '📧',
        width: 400,
        height: 300,
        category: 'utility'
    },
    'help': {
        id: 'help',
        title: 'Help',
        component: 'help',
        icon: '❓',
        width: 500,
        height: 400,
        category: 'utility'
    },
    'settings': {
        id: 'settings',
        title: 'Settings',
        component: 'settings',
        icon: '⚙️',
        width: 450,
        height: 350,
        category: 'system'
    }
}

export const getApp = (id: string): AppDefinition | undefined => {
    return APPS[id]
}

export const getAppsByCategory = (category: string): AppDefinition[] => {
    return Object.values(APPS).filter(app => app.category === category)
}

export const getAllApps = (): AppDefinition[] => {
    return Object.values(APPS)
} 