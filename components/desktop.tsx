"use client"

import { useFileSystem } from "@/hooks/use-file-system"

interface DesktopProps {
  onDoubleClick: () => void
  onClick?: () => void
  onOpenWindow: (title: string, component: string, width?: number, height?: number) => void
  recycleBinHasItems: boolean

  recycleBinCount?: number
}

export default function Desktop({ onDoubleClick, onClick, onOpenWindow, recycleBinHasItems, recycleBinCount = 0 }: DesktopProps) {
  const { getDesktopApps, getApp } = useFileSystem()

  // Get desktop apps from file system
  const desktopApps = getDesktopApps()

  return (
    <div
      className="w-full h-full relative"
      onDoubleClick={onDoubleClick}
      onClick={onClick}
      style={{
        backgroundImage: "url('./wallpaper.jpg')",
        backgroundSize: "cover",
        backgroundPosition: "center",
        backgroundRepeat: "no-repeat"
      }}
    >
      {/* Desktop Icons */}
      <div className="absolute top-4 left-4 space-y-6 md:space-y-6 space-y-4">
        {desktopApps.map((appId) => {
          const app = getApp(appId)
          if (!app) return null

          return (
            <div
              key={appId}
              className="flex flex-col items-center w-16 md:w-16 w-20 cursor-pointer hover:bg-blue-600 hover:bg-opacity-30 p-1 touch-manipulation"
              onDoubleClick={(e) => {
                e.stopPropagation()
                onOpenWindow(app.title, app.component, app.width, app.height)
              }}
              onTouchEnd={(e) => {
                e.preventDefault()
                e.stopPropagation()
                onOpenWindow(app.title, app.component, app.width, app.height)
              }}
            >
              <div className="w-8 h-8 md:w-8 md:h-8 w-10 h-10 flex items-center justify-center text-2xl md:text-2xl text-3xl mb-1">
                {app.icon}
              </div>
              <span className="text-white text-xs md:text-xs text-sm text-center leading-tight">
                {appId === 'recycle-bin' && recycleBinHasItems
                  ? `${app.title} (${recycleBinCount})`
                  : app.title
                }
              </span>
            </div>
          )
        })}
      </div>
    </div>
  )
}
