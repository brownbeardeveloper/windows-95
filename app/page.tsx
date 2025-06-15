"use client"

import { useState, useEffect } from "react"
import Desktop from "@/components/desktop"
import Taskbar from "@/components/taskbar"
import StartMenu from "@/components/start-menu"
import Window from "@/components/window"

import MyComputer from "@/components/apps/my-computer"
import Projects from "@/components/apps/projects"
import WhoAmI from "@/components/apps/whoami"
import Terminal from "@/components/apps/terminal"
import RecycleBin from "@/components/apps/recycle-bin"
import { getApp } from "@/lib/apps"
import { useRecycleBin } from "@/hooks/use-recycle-bin"

interface WindowType {
  id: string
  title: string
  component: string
  x: number
  y: number
  width: number
  height: number
  minimized: boolean
  zIndex: number
}

export default function Windows95() {
  const [showStartMenu, setShowStartMenu] = useState(false)
  const [windows, setWindows] = useState<WindowType[]>([])
  const [nextZIndex, setNextZIndex] = useState(2)
  const [isMobile, setIsMobile] = useState(false)

  // Recycle Bin hook
  const {
    recycleBinItems,
    emptyRecycleBin,
    restoreItems,
    deleteItems,
    hasItems
  } = useRecycleBin()

  // Check if device is mobile
  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])



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
            onEmptyBin={emptyRecycleBin}
            onRestoreItems={restoreItems}
            onDeleteItems={deleteItems}
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
        recycleBinHasItems={hasItems}
        recycleBinCount={recycleBinItems.length}
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
