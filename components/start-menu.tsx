"use client"

import { useState, useEffect } from 'react'
import { useFileSystem } from "@/hooks/use-file-system"
import { SYSTEM_ICONS } from "@/lib/system-icons"

interface StartMenuProps {
  onClose: () => void
  onOpenApp: (appId: string) => void
}

export default function StartMenu({ onClose, onOpenApp }: StartMenuProps) {
  const { getApp } = useFileSystem()
  const [showProjectsSubmenu, setShowProjectsSubmenu] = useState(false)
  const [showProgramSubmenu, setShowProgramSubmenu] = useState(false)
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

  const handleProjectsClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowProjectsSubmenu(!showProjectsSubmenu)
    setShowProgramSubmenu(false) // Close other submenu
  }

  const handleProgramClick = (e: React.MouseEvent | React.TouchEvent) => {
    e.preventDefault()
    e.stopPropagation()
    setShowProgramSubmenu(!showProgramSubmenu)
    setShowProjectsSubmenu(false) // Close other submenu
  }

  return (
    <div className="absolute bottom-10 md:bottom-7 left-0 flex bg-gray-300 border-2 border-white border-r-gray-500 border-b-gray-500 shadow-lg font-sans z-[9999]">
      {/* Vertical Windows 95 Sidebar */}
      <div className="bg-gradient-to-b from-gray-400 to-gray-500 w-10 md:w-8 relative min-h-full overflow-hidden">
        <div className="absolute bottom-8 left-1/2 transform -translate-x-1/2">
          <div className="transform -rotate-90 origin-center">
            <span className="text-white font-bold text-lg md:text-base whitespace-nowrap tracking-wider">
              Home
            </span>
          </div>
        </div>
      </div>

      {/* Main Menu */}
      <div className="w-60 md:w-52 max-w-[75vw] max-h-[70vh] overflow-y-auto">
        {/* Menu Items */}
        <div className="py-1">
          {/* Projects Menu Item */}
          <button
            className="w-full text-left px-4 md:px-3 py-2 md:py-1 hover:bg-blue-600 hover:text-white flex items-center justify-between text-base md:text-sm touch-manipulation"
            onClick={handleProjectsClick}
            onTouchEnd={handleProjectsClick}
          >
            <div className="flex items-center space-x-4 md:space-x-3">
              <div className="w-10 h-10 md:w-8 md:h-8 flex items-center justify-center flex-shrink-0">
                <div className="w-8 h-8 md:w-6 md:h-6 bg-yellow-400 border border-gray-600 flex items-center justify-center">
                  <span className="text-base md:text-xs">{getApp('projects')?.icon}</span>
                </div>
              </div>
              <span className="truncate"><span className="underline">U</span>ser Folder</span>
            </div>
            <span className={`flex-shrink-0 transition-transform duration-200 ${showProjectsSubmenu ? 'rotate-90' : ''}`}>▶</span>
          </button>

          {/* Projects Submenu - Accordion Style */}
          {showProjectsSubmenu && (
            <div className="bg-gray-200 border-l-4 border-blue-500 ml-4 animate-in slide-in-from-top-2 duration-200">
              <button
                onClick={() => {
                  onOpenApp("projects")
                  onClose()
                }}
                className="w-full text-left px-4 md:px-3 py-2 md:py-1 hover:bg-blue-600 hover:text-white flex items-center text-sm md:text-xs touch-manipulation"
              >
                <div className="flex items-center space-x-3 md:space-x-2">
                  <div className="w-8 h-8 md:w-6 md:h-6 flex items-center justify-center flex-shrink-0">
                    <div className="w-6 h-6 md:w-4 md:h-4 bg-yellow-400 border border-gray-600 flex items-center justify-center">
                      <span className="text-xs md:text-[10px]">{getApp('projects')?.icon}</span>
                    </div>
                  </div>
                  <span className="truncate">{getApp('projects')?.title}</span>
                </div>
              </button>

              <button
                onClick={() => {
                  onOpenApp("whoami")
                  onClose()
                }}
                className="w-full text-left px-4 md:px-3 py-2 md:py-1 hover:bg-blue-600 hover:text-white flex items-center text-sm md:text-xs touch-manipulation"
              >
                <div className="flex items-center space-x-3 md:space-x-2">
                  <div className="w-8 h-8 md:w-6 md:h-6 flex items-center justify-center flex-shrink-0">
                    <div className="w-6 h-6 md:w-4 md:h-4 bg-blue-400 border border-gray-600 flex items-center justify-center">
                      <span className="text-xs md:text-[10px]">{getApp('whoami')?.icon}</span>
                    </div>
                  </div>
                  <span className="truncate">{getApp('whoami')?.title}</span>
                </div>
              </button>
            </div>
          )}

          {/* Program Menu Item */}
          <button
            className="w-full text-left px-4 md:px-3 py-2 md:py-1 hover:bg-blue-600 hover:text-white flex items-center justify-between text-base md:text-sm touch-manipulation"
            onClick={handleProgramClick}
            onTouchEnd={handleProgramClick}
          >
            <div className="flex items-center space-x-4 md:space-x-3">
              <div className="w-10 h-10 md:w-8 md:h-8 flex items-center justify-center flex-shrink-0">
                <div className="w-8 h-8 md:w-6 md:h-6 bg-gray-400 border border-gray-600 flex items-center justify-center">
                  <span className="text-base md:text-xs">{SYSTEM_ICONS.PROGRAMS_FOLDER}</span>
                </div>
              </div>
              <span className="truncate"><span className="underline">P</span>rogram</span>
            </div>
            <span className={`flex-shrink-0 transition-transform duration-200 ${showProgramSubmenu ? 'rotate-90' : ''}`}>▶</span>
          </button>

          {/* Program Submenu - Accordion Style */}
          {showProgramSubmenu && (
            <div className="bg-gray-200 border-l-4 border-blue-500 ml-4 animate-in slide-in-from-top-2 duration-200">
              <button
                onClick={() => {
                  onOpenApp("my-computer")
                  onClose()
                }}
                className="w-full text-left px-4 md:px-3 py-2 md:py-1 hover:bg-blue-600 hover:text-white flex items-center text-sm md:text-xs touch-manipulation"
              >
                <div className="flex items-center space-x-3 md:space-x-2">
                  <div className="w-8 h-8 md:w-6 md:h-6 flex items-center justify-center flex-shrink-0">
                    <div className="w-6 h-6 md:w-4 md:h-4 bg-gray-500 border border-gray-600 flex items-center justify-center">
                      <span className="text-xs md:text-[10px]">{getApp('my-computer')?.icon}</span>
                    </div>
                  </div>
                  <span className="truncate">{getApp('my-computer')?.title}</span>
                </div>
              </button>

              <button
                onClick={() => {
                  onOpenApp("recycle-bin")
                  onClose()
                }}
                className="w-full text-left px-4 md:px-3 py-2 md:py-1 hover:bg-blue-600 hover:text-white flex items-center text-sm md:text-xs touch-manipulation"
              >
                <div className="flex items-center space-x-3 md:space-x-2">
                  <div className="w-8 h-8 md:w-6 md:h-6 flex items-center justify-center flex-shrink-0">
                    <div className="w-6 h-6 md:w-4 md:h-4 bg-blue-400 border border-gray-600 flex items-center justify-center">
                      <span className="text-xs md:text-[10px]">{getApp('recycle-bin')?.icon}</span>
                    </div>
                  </div>
                  <span className="truncate">{getApp('recycle-bin')?.title}</span>
                </div>
              </button>

              <button
                onClick={() => {
                  onOpenApp("terminal")
                  onClose()
                }}
                className="w-full text-left px-4 md:px-3 py-2 md:py-1 hover:bg-blue-600 hover:text-white flex items-center text-sm md:text-xs touch-manipulation"
              >
                <div className="flex items-center space-x-3 md:space-x-2">
                  <div className="w-8 h-8 md:w-6 md:h-6 flex items-center justify-center flex-shrink-0">
                    <div className="w-6 h-6 md:w-4 md:h-4 bg-black border border-gray-600 flex items-center justify-center">
                      <span className="text-white text-xs md:text-[10px]">{getApp('terminal')?.icon}</span>
                    </div>
                  </div>
                  <span className="truncate">{getApp('terminal')?.title}</span>
                </div>
              </button>

              <button
                onClick={() => {
                  onOpenApp("minesweeper")
                  onClose()
                }}
                className="w-full text-left px-4 md:px-3 py-2 md:py-1 hover:bg-blue-600 hover:text-white flex items-center text-sm md:text-xs touch-manipulation"
              >
                <div className="flex items-center space-x-3 md:space-x-2">
                  <div className="w-8 h-8 md:w-6 md:h-6 flex items-center justify-center flex-shrink-0">
                    <div className="w-6 h-6 md:w-4 md:h-4 bg-red-500 border border-gray-600 flex items-center justify-center">
                      <span className="text-white text-xs md:text-[10px]">{getApp('minesweeper')?.icon}</span>
                    </div>
                  </div>
                  <span className="truncate">{getApp('minesweeper')?.title}</span>
                </div>
              </button>
            </div>
          )}

          {/* Other Menu Items */}
          <div className="border-t border-gray-400 my-1"></div>

          <button
            onClick={() => {
              onOpenApp("contact")
              onClose()
            }}
            className="w-full text-left px-4 md:px-3 py-2 md:py-1 hover:bg-blue-600 hover:text-white flex items-center text-base md:text-sm touch-manipulation"
          >
            <div className="flex items-center space-x-4 md:space-x-3">
              <div className="w-10 h-10 md:w-8 md:h-8 flex items-center justify-center flex-shrink-0">
                <div className="w-8 h-8 md:w-6 md:h-6 bg-blue-400 border border-gray-600 flex items-center justify-center">
                  <span className="text-base md:text-xs">{getApp('contact')?.icon}</span>
                </div>
              </div>
              <span className="truncate"><span className="underline">C</span>ontact</span>
            </div>
          </button>

          <button
            onClick={() => {
              onOpenApp("help")
              onClose()
            }}
            className="w-full text-left px-4 md:px-3 py-2 md:py-1 hover:bg-blue-600 hover:text-white flex items-center text-base md:text-sm touch-manipulation"
          >
            <div className="flex items-center space-x-4 md:space-x-3">
              <div className="w-10 h-10 md:w-8 md:h-8 flex items-center justify-center flex-shrink-0">
                <div className="w-8 h-8 md:w-6 md:h-6 bg-yellow-400 border border-gray-600 flex items-center justify-center">
                  <span className="text-white text-base md:text-xs">{getApp('help')?.icon}</span>
                </div>
              </div>
              <span className="truncate"><span className="underline">H</span>elp</span>
            </div>
          </button>

          <div className="border-t border-gray-400 my-1"></div>

          <button
            onClick={() => {
              onOpenApp("settings")
              onClose()
            }}
            className="w-full text-left px-4 md:px-3 py-2 md:py-1 hover:bg-blue-600 hover:text-white flex items-center text-base md:text-sm touch-manipulation"
          >
            <div className="flex items-center space-x-4 md:space-x-3">
              <div className="w-10 h-10 md:w-8 md:h-8 flex items-center justify-center flex-shrink-0">
                <div className="w-8 h-8 md:w-6 md:h-6 bg-gray-500 border border-gray-600 flex items-center justify-center">
                  <span className="text-base md:text-xs">{getApp('settings')?.icon}</span>
                </div>
              </div>
              <span className="truncate"><span className="underline">S</span>ettings</span>
            </div>
          </button>
        </div>
      </div>
    </div>
  )
}
