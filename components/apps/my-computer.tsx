/**
 * MY COMPUTER - PROFESSIONAL FILE EXPLORER
 * =======================================
 * 
 * A Windows-style file explorer that integrates with the unified file system.
 * Features professional navigation, app launching, and real-time synchronization.
 * 
 * Key Features:
 * - Real-time file system integration
 * - Professional navigation (Back/Forward/Up)
 * - Application launching from Program Files
 * - Windows-authentic UI/UX
 * - Responsive design
 * 
 * @author @brownbeardeveloper
 * @version Desktop v1.2
 */

"use client"

import { useState, useEffect } from "react"
import { SYSTEM_ICONS } from "@/lib/system-icons"
import { useFileSystem, useDirectory } from "@/hooks/use-file-system"
import { useIsMobile } from "@/hooks/use-mobile"

interface MyComputerProps {
  onOpenApp?: (appId: string) => void
}

export default function MyComputer({ onOpenApp }: MyComputerProps) {
  const isMobile = useIsMobile()

  // Use file system operations (no global directory state)
  const { listDirectory, getItem } = useFileSystem()

  // Each My Computer window gets its own independent directory navigation
  const {
    currentDirectory: currentPath,
    navigateTo,
    navigateUp
  } = useDirectory(["C:"])

  const [navigationHistory, setNavigationHistory] = useState<string[][]>([["C:"]])
  const [historyIndex, setHistoryIndex] = useState(0)
  const [clickTimeouts, setClickTimeouts] = useState<{ [key: string]: NodeJS.Timeout }>({})

  const navigate = (path: string[]) => {
    const newHistory = navigationHistory.slice(0, historyIndex + 1)
    newHistory.push(path)
    setNavigationHistory(newHistory)
    setHistoryIndex(newHistory.length - 1)
    navigateTo(path)
  }

  const goBack = () => {
    if (historyIndex > 0) {
      const newIndex = historyIndex - 1
      setHistoryIndex(newIndex)
      const newPath = navigationHistory[newIndex]
      navigateTo(newPath)
    }
  }

  const goForward = () => {
    if (historyIndex < navigationHistory.length - 1) {
      const newIndex = historyIndex + 1
      setHistoryIndex(newIndex)
      const newPath = navigationHistory[newIndex]
      navigateTo(newPath)
    }
  }

  const goUpLevel = () => {
    if (currentPath.length > 1) {
      const parentPath = currentPath.slice(0, -1)
      navigate(parentPath)
    }
  }

  const handleItemClick = (itemName: string, event?: React.MouseEvent) => {
    if (event) {
      event.preventDefault()
      event.stopPropagation()
    }

    // Mobile: single click to open immediately
    if (isMobile) {
      openItem(itemName)
      return
    }

    // Desktop: delay single click to allow for double-click detection
    const existingTimeout = clickTimeouts[itemName]
    if (existingTimeout) {
      // If there's already a timeout, this is a double-click - clear it and open immediately
      clearTimeout(existingTimeout)
      setClickTimeouts(prev => {
        const newTimeouts = { ...prev }
        delete newTimeouts[itemName]
        return newTimeouts
      })
      openItem(itemName)
    } else {
      // First click - set timeout for single click action
      const timeout = setTimeout(() => {
        // This is a single click - don't open anything (Windows behavior)
        setClickTimeouts(prev => {
          const newTimeouts = { ...prev }
          delete newTimeouts[itemName]
          return newTimeouts
        })
      }, 300)

      setClickTimeouts(prev => ({ ...prev, [itemName]: timeout }))
    }
  }



  const openItem = (itemName: string) => {
    // Check if we're in Program Files and clicking an .exe file
    const isInProgramFiles = currentPath.length === 2 && currentPath[1] === "Program Files"
    const isExeFile = itemName.endsWith(".exe")

    if (isInProgramFiles && isExeFile && onOpenApp) {
      // Map exe files to app IDs
      const exeToAppId: { [key: string]: string } = {
        "My Computer.exe": "my-computer",
        "Projects.exe": "projects",
        "About Me.exe": "whoami",
        "Terminal.exe": "terminal",
        "Recycle Bin.exe": "recycle-bin",
        "Contact.exe": "contact",
        "Help.exe": "help",
        "Settings.exe": "settings",
        "Minefield.exe": "minesweeper"
      }

      const appId = exeToAppId[itemName]

      if (appId) {
        onOpenApp(appId)
        return
      }
    }

    // Handle regular file system navigation
    const newPath = [...currentPath, itemName]
    const item = getItem(newPath)

    if (item?.type === "directory") {
      navigate(newPath)
    }
  }

  const currentDir = getItem(currentPath)
  const currentItems = listDirectory(currentPath)

  // Add apps to Program Files if we're viewing Program Files
  const isInProgramFiles = currentPath.length === 2 && currentPath[1] === "Program Files"
  const displayItems = isInProgramFiles
    ? [
      ...currentItems,
      // Add application exe files
      { name: "My Computer.exe", type: "file" as const, content: "Application: My Computer", created: new Date(), modified: new Date(), size: 1024 },
      { name: "Projects.exe", type: "file" as const, content: "Application: Projects", created: new Date(), modified: new Date(), size: 1024 },
      { name: "About Me.exe", type: "file" as const, content: "Application: About Me", created: new Date(), modified: new Date(), size: 1024 },
      { name: "Terminal.exe", type: "file" as const, content: "Application: Terminal", created: new Date(), modified: new Date(), size: 1024 },
      { name: "Recycle Bin.exe", type: "file" as const, content: "Application: Recycle Bin", created: new Date(), modified: new Date(), size: 1024 },
      { name: "Contact.exe", type: "file" as const, content: "Application: Contact", created: new Date(), modified: new Date(), size: 1024 },
      { name: "Help.exe", type: "file" as const, content: "Application: Help", created: new Date(), modified: new Date(), size: 1024 },
      { name: "Settings.exe", type: "file" as const, content: "Application: Settings", created: new Date(), modified: new Date(), size: 1024 },
      { name: "Minefield.exe", type: "file" as const, content: "Application: Minefield", created: new Date(), modified: new Date(), size: 1024 }
    ]
    : currentItems

  const getCurrentPathString = () => {
    return currentPath.join("\\")
  }

  // Cleanup timeouts on unmount
  useEffect(() => {
    return () => {
      Object.values(clickTimeouts).forEach(timeout => {
        if (timeout) clearTimeout(timeout)
      })
    }
  }, [clickTimeouts])

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
        <button
          onClick={goBack}
          disabled={historyIndex <= 0}
          className={`px-3 py-1 text-sm border border-gray-400 flex items-center space-x-1 ${historyIndex <= 0
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-white hover:bg-gray-100 cursor-pointer'
            }`}
          title="Go back to previous folder"
        >
          <span className="text-xs">◀</span>
          <span className="text-xs">Back</span>
        </button>
        <button
          onClick={goForward}
          disabled={historyIndex >= navigationHistory.length - 1}
          className={`px-3 py-1 text-sm border border-gray-400 flex items-center space-x-1 ${historyIndex >= navigationHistory.length - 1
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-white hover:bg-gray-100 cursor-pointer'
            }`}
          title="Go forward to next folder"
        >
          <span className="text-xs">▶</span>
          <span className="text-xs">Forward</span>
        </button>
        <button
          onClick={goUpLevel}
          disabled={currentPath.length <= 1}
          className={`px-3 py-1 text-sm border border-gray-400 flex items-center space-x-1 ${currentPath.length <= 1
            ? 'bg-gray-200 text-gray-400 cursor-not-allowed'
            : 'bg-white hover:bg-gray-100 cursor-pointer'
            }`}
          title="Go up one level"
        >
          <span className="text-xs">▲</span>
          <span className="text-xs">Up</span>
        </button>
      </div>

      {/* Address Bar */}
      <div className="bg-gray-100 border-b border-gray-400 px-2 py-1">
        <div className="text-xs">
          <span className="font-semibold">Address: </span>
          <span className="font-mono">{getCurrentPathString()}</span>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="grid grid-cols-4 gap-6">
          {displayItems.map((item, index) => {
            const isAppFile = item.name.endsWith(".exe")

            // Map exe files to their icons
            const getExeIcon = (fileName: string) => {
              const iconMap: { [key: string]: string } = {
                "My Computer.exe": "💻",
                "Projects.exe": "📁",
                "About Me.exe": "👤",
                "Terminal.exe": "🖥",
                "Recycle Bin.exe": "🗑️",
                "Contact.exe": "📧",
                "Help.exe": "❓",
                "Settings.exe": "⚙️",
                "Minefield.exe": "💣"
              }
              return iconMap[fileName] || "⚙️"
            }

            return (
              <div
                key={`${item.name}-${index}`}
                className={`flex flex-col items-center cursor-pointer hover:bg-blue-600 hover:bg-opacity-20 p-2 rounded transition-colors ${isAppFile ? 'hover:bg-green-600 hover:bg-opacity-20' : ''
                  }`}
                onClick={(e) => {
                  handleItemClick(item.name, e)
                }}
                title={
                  item.type === "directory"
                    ? isMobile ? "Tap to open folder" : "Double-click to open folder"
                    : isAppFile
                      ? isMobile ? "Tap to launch application" : "Double-click to launch application"
                      : isMobile ? "Tap to open file" : "Double-click to open file"
                }
              >
                <div className="w-10 h-10 flex items-center justify-center text-2xl mb-2">
                  {item.type === "directory" ? (
                    SYSTEM_ICONS.FOLDER
                  ) : isAppFile ? (
                    getExeIcon(item.name)
                  ) : item.name.endsWith(".txt") ? (
                    "📄"
                  ) : item.name.endsWith(".md") ? (
                    "📄"
                  ) : item.name.endsWith(".pdf") ? (
                    "📄"
                  ) : (
                    "📄"
                  )}
                </div>
                <span className="text-xs text-center leading-tight">
                  {item.name}
                </span>
                {item.type === "file" && item.size && (
                  <span className="text-xs text-gray-500 text-center">
                    {item.size < 1024 ? `${item.size} B` : `${Math.round(item.size / 1024)} KB`}
                  </span>
                )}
              </div>
            )
          })}
        </div>

        {displayItems.length === 0 && (
          <div className="text-center text-gray-500 mt-8">
            This folder is empty
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="h-5 bg-gray-300 border-t border-gray-400 px-2 flex items-center">
        <span className="text-xs">
          {displayItems.length} object(s) | {getCurrentPathString()}
        </span>
      </div>
    </div>
  )
}
