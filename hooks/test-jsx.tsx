import React from 'react'

const TestContext = React.createContext<{ test: string } | null>(null)

export function TestProvider({ children }: { children: React.ReactNode }) {
    const value = { test: "hello" }

    return (
        <TestContext.Provider value={value}>
            {children}
        </TestContext.Provider>
    )
} 