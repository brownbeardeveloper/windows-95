"use client"

import { useState, useEffect } from "react"
import Desktop from "@/components/desktop"
import Taskbar from "@/components/taskbar"
import StartMenu from "@/components/start-menu"
import Window from "@/components/window"
import ControlPanel from "@/components/apps/control-panel"
import MyComputer from "@/components/apps/my-computer"
import Projects from "@/components/apps/projects"
import WhoAmI from "@/components/apps/whoami"
import Terminal from "@/components/apps/terminal"
import RecycleBin from "@/components/apps/recycle-bin"
import { getApp } from "@/lib/apps"

export default function Windows95() {
  const [showStartMenu, setShowStartMenu] = useState(true)
  const [windows, setWindows] = useState([
    {
      id: "control-panel",
      title: "Control Panel",
      component: "control-panel",
      x: 213,
      y: 26,
      width: 426,
      height: 320,
      minimized: false,
      zIndex: 1,
    },
  ])
  const [nextZIndex, setNextZIndex] = useState(2)
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

  // Recycle Bin state - in real Windows 95 this would be persistent
  const [recycleBinItems, setRecycleBinItems] = useState([
    { name: "Old Document.txt", icon: "📄", dateDeleted: "12/15/2023", originalLocation: "C:\\My Documents" },
    { name: "Photo.bmp", icon: "🖼️", dateDeleted: "12/14/2023", originalLocation: "C:\\My Documents\\Pictures" },
    { name: "Program Files", icon: "📁", dateDeleted: "12/13/2023", originalLocation: "C:\\Program Files\\OldApp" },
    // Add more items to show it's not empty
    ...Array.from({ length: 20 }, (_, i) => ({
      name: `Test File ${i + 4}.txt`,
      icon: "📄",
      dateDeleted: "12/12/2023",
      originalLocation: `C:\\Test\\Folder${i + 1}`,
    })),
  ])

  // Recycle Bin operations
  const handleEmptyRecycleBin = () => {
    setRecycleBinItems([])
  }

  const handleRestoreItems = (indices: number[]) => {
    setRecycleBinItems(prev =>
      prev.filter((_, index) => !indices.includes(index))
    )

    // In a real app, you'd restore the files to their original locations
    // For now, we just show a notification
    const restoredCount = indices.length
    setTimeout(() => {
      alert(`${restoredCount} item(s) have been restored to their original locations.`)
    }, 100)
  }

  const handleDeleteItems = (indices: number[]) => {
    setRecycleBinItems(prev =>
      prev.filter((_, index) => !indices.includes(index))
    )

    // In a real app, these would be permanently deleted
    const deletedCount = indices.length
    setTimeout(() => {
      alert(`${deletedCount} item(s) have been permanently deleted.`)
    }, 100)
  }

  const openWindow = (title: string, component: string, width = 400, height = 300) => {
    // Responsive window sizing and positioning
    let responsiveWidth = width
    let responsiveHeight = height
    let x = Math.random() * 200 + 100
    let y = Math.random() * 100 + 50

    if (isMobile) {
      // On mobile, make windows take up most of the screen
      responsiveWidth = Math.min(width, window.innerWidth - 20)
      responsiveHeight = Math.min(height, window.innerHeight - 100) // Leave space for taskbar
      x = 10
      y = 10
    } else {
      // On desktop, ensure windows fit within viewport
      responsiveWidth = Math.min(width, window.innerWidth - 100)
      responsiveHeight = Math.min(height, window.innerHeight - 100)
      x = Math.min(x, window.innerWidth - responsiveWidth - 20)
      y = Math.min(y, window.innerHeight - responsiveHeight - 60)
    }

    const newWindow = {
      id: Math.random().toString(36).substr(2, 9),
      title,
      component,
      x,
      y,
      width: responsiveWidth,
      height: responsiveHeight,
      minimized: false,
      zIndex: nextZIndex,
    }
    setWindows((prev) => [...prev, newWindow])
    setNextZIndex((prev) => prev + 1)
  }

  const openApp = (appId: string) => {
    const app = getApp(appId)
    if (app) {
      openWindow(app.title, app.component, app.width, app.height)
    }
  }

  const closeWindow = (id: string) => {
    setWindows((prev) => prev.filter((w) => w.id !== id))
  }

  const minimizeWindow = (id: string) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, minimized: true } : w)))
  }

  const restoreWindow = (id: string) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, minimized: false, zIndex: nextZIndex } : w)))
    setNextZIndex((prev) => prev + 1)
  }

  const focusWindow = (id: string) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, zIndex: nextZIndex } : w)))
    setNextZIndex((prev) => prev + 1)
  }

  const updateWindowPosition = (id: string, x: number, y: number) => {
    setWindows((prev) => prev.map((w) => (w.id === id ? { ...w, x, y } : w)))
  }

  const renderWindowContent = (component: string) => {
    switch (component) {
      case "control-panel":
        return <ControlPanel />
      case "my-computer":
        return <MyComputer />
      case "projects":
        return <Projects />
      case "whoami":
        return <WhoAmI />
      case "terminal":
        return <Terminal />
      case "recycle-bin":
        return (
          <RecycleBin
            items={recycleBinItems}
            onEmptyBin={handleEmptyRecycleBin}
            onRestoreItems={handleRestoreItems}
            onDeleteItems={handleDeleteItems}
          />
        )
      default:
        return <div className="p-4">Window content</div>
    }
  }

  return (
    <div className="h-screen relative overflow-hidden select-none" style={{ backgroundColor: "#008080" }}>
      <Desktop
        onDoubleClick={() => setShowStartMenu(false)}
        onOpenWindow={openWindow}
        recycleBinHasItems={recycleBinItems.length > 0}
      />

      {/* Windows */}
      {windows
        .filter((w) => !w.minimized)
        .map((window) => (
          <Window
            key={window.id}
            title={window.title}
            x={window.x}
            y={window.y}
            width={window.width}
            height={window.height}
            zIndex={window.zIndex}
            onClose={() => closeWindow(window.id)}
            onMinimize={() => minimizeWindow(window.id)}
            onFocus={() => focusWindow(window.id)}
            onMove={(x, y) => updateWindowPosition(window.id, x, y)}
          >
            {renderWindowContent(window.component)}
          </Window>
        ))}

      {/* Start Menu */}
      {showStartMenu && (
        <StartMenu
          onClose={() => setShowStartMenu(false)}
          onOpenApp={(appId) => {
            setShowStartMenu(false)
            openApp(appId)
          }}
        />
      )}

      {/* Taskbar */}
      <Taskbar
        onStartClick={() => setShowStartMenu(!showStartMenu)}
        windows={windows}
        onWindowClick={(id) => {
          const window = windows.find((w) => w.id === id)
          if (window?.minimized) {
            restoreWindow(id)
          } else {
            focusWindow(id)
          }
        }}
      />
    </div>
  )
}
