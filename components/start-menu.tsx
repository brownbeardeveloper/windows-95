"use client"

import { useState } from 'react'
import { APPS } from "@/lib/apps"

interface StartMenuProps {
  onClose: () => void
  onOpenApp: (appId: string) => void
}

export default function StartMenu({ onClose, onOpenApp }: StartMenuProps) {
  const [showProjectsSubmenu, setShowProjectsSubmenu] = useState(false)
  const [showProgramSubmenu, setShowProgramSubmenu] = useState(false)

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
        <div className="absolute top-12 left-1/2 transform -translate-x-1/2">
          <div className="transform -rotate-90 origin-center">
            <span className="text-white font-bold text-sm md:text-xs whitespace-nowrap tracking-wider">
              Windows 95
            </span>
          </div>
        </div>
      </div>

      {/* Main Menu */}
      <div className="w-60 md:w-52">
        {/* Menu Items */}
        <div className="py-1 relative">
          <button
            className="w-full text-left px-4 md:px-3 py-2 md:py-1 hover:bg-blue-600 hover:text-white flex items-center justify-between text-base md:text-sm touch-manipulation"
            onClick={handleProjectsClick}
            onTouchEnd={handleProjectsClick}
            onMouseEnter={() => setShowProjectsSubmenu(true)}
            onMouseLeave={() => setShowProjectsSubmenu(false)}
          >
            <div className="flex items-center space-x-4 md:space-x-3">
              <div className="w-10 h-10 md:w-8 md:h-8 flex items-center justify-center">
                <div className="w-8 h-8 md:w-6 md:h-6 bg-yellow-400 border border-gray-600 flex items-center justify-center">
                  <span className="text-base md:text-xs">{APPS['projects'].icon}</span>
                </div>
              </div>
              <span><span className="underline">P</span>rojects</span>
            </div>
            <span>▶</span>
          </button>

          <button
            className="w-full text-left px-4 md:px-3 py-2 md:py-1 hover:bg-blue-600 hover:text-white flex items-center justify-between text-base md:text-sm touch-manipulation"
            onClick={handleProgramClick}
            onTouchEnd={handleProgramClick}
            onMouseEnter={() => setShowProgramSubmenu(true)}
            onMouseLeave={() => setShowProgramSubmenu(false)}
          >
            <div className="flex items-center space-x-4 md:space-x-3">
              <div className="w-10 h-10 md:w-8 md:h-8 flex items-center justify-center">
                <div className="w-8 h-8 md:w-6 md:h-6 bg-gray-400 border border-gray-600 flex items-center justify-center">
                  <span className="text-base md:text-xs">📋</span>
                </div>
              </div>
              <span><span className="underline">P</span>rogram</span>
            </div>
            <span>▶</span>
          </button>

          <button
            onClick={() => onOpenApp("contact")}
            className="w-full text-left px-4 md:px-3 py-2 md:py-1 hover:bg-blue-600 hover:text-white flex items-center text-base md:text-sm touch-manipulation"
          >
            <div className="flex items-center space-x-4 md:space-x-3">
              <div className="w-10 h-10 md:w-8 md:h-8 flex items-center justify-center">
                <div className="w-8 h-8 md:w-6 md:h-6 bg-blue-400 border border-gray-600 flex items-center justify-center">
                  <span className="text-base md:text-xs">{APPS['contact'].icon}</span>
                </div>
              </div>
              <span><span className="underline">C</span>ontact</span>
            </div>
          </button>

          <button
            onClick={() => onOpenApp("help")}
            className="w-full text-left px-4 md:px-3 py-2 md:py-1 hover:bg-blue-600 hover:text-white flex items-center text-base md:text-sm touch-manipulation"
          >
            <div className="flex items-center space-x-4 md:space-x-3">
              <div className="w-10 h-10 md:w-8 md:h-8 flex items-center justify-center">
                <div className="w-8 h-8 md:w-6 md:h-6 bg-purple-600 border border-gray-600 flex items-center justify-center">
                  <span className="text-white text-base md:text-xs">{APPS['help'].icon}</span>
                </div>
              </div>
              <span><span className="underline">H</span>elp</span>
            </div>
          </button>

          <button
            onClick={() => onOpenApp("settings")}
            className="w-full text-left px-4 md:px-3 py-2 md:py-1 hover:bg-blue-600 hover:text-white flex items-center text-base md:text-sm touch-manipulation"
          >
            <div className="flex items-center space-x-4 md:space-x-3">
              <div className="w-10 h-10 md:w-8 md:h-8 flex items-center justify-center">
                <div className="w-8 h-8 md:w-6 md:h-6 bg-gray-400 border border-gray-600 flex items-center justify-center">
                  <span className="text-base md:text-xs">{APPS['settings'].icon}</span>
                </div>
              </div>
              <span><span className="underline">S</span>ettings</span>
            </div>
          </button>

          <div className="border-t border-gray-500 my-1 mx-2"></div>

          <button className="w-full text-left px-4 md:px-3 py-2 md:py-1 hover:bg-blue-600 hover:text-white flex items-center text-base md:text-sm touch-manipulation">
            <div className="flex items-center space-x-4 md:space-x-3">
              <div className="w-10 h-10 md:w-8 md:h-8 flex items-center justify-center">
                <div className="w-8 h-8 md:w-6 md:h-6 bg-blue-800 border border-gray-600 flex items-center justify-center">
                  <span className="text-white text-base md:text-xs">⏻</span>
                </div>
              </div>
              <span><span className="underline">S</span>hut Down</span>
            </div>
          </button>

          {/* Program Submenu */}
          {showProgramSubmenu && (
            <div
              className="absolute left-full top-12 md:top-8 w-60 md:w-52 bg-gray-300 border-2 border-white border-r-gray-500 border-b-gray-500 shadow-lg z-10"
              onMouseEnter={() => setShowProgramSubmenu(true)}
              onMouseLeave={() => setShowProgramSubmenu(false)}
            >
              <button
                onClick={() => {
                  onOpenApp("my-computer")
                  onClose()
                }}
                className="w-full text-left px-4 md:px-3 py-2 md:py-1 hover:bg-blue-600 hover:text-white flex items-center text-base md:text-sm touch-manipulation"
              >
                <div className="flex items-center space-x-4 md:space-x-3">
                  <div className="w-10 h-10 md:w-8 md:h-8 flex items-center justify-center">
                    <div className="w-8 h-8 md:w-6 md:h-6 bg-gray-500 border border-gray-600 flex items-center justify-center">
                      <span className="text-base md:text-xs">{APPS['my-computer'].icon}</span>
                    </div>
                  </div>
                  <span>{APPS['my-computer'].title}</span>
                </div>
              </button>

              <button
                onClick={() => {
                  onOpenApp("recycle-bin")
                  onClose()
                }}
                className="w-full text-left px-4 md:px-3 py-2 md:py-1 hover:bg-blue-600 hover:text-white flex items-center text-base md:text-sm touch-manipulation"
              >
                <div className="flex items-center space-x-4 md:space-x-3">
                  <div className="w-10 h-10 md:w-8 md:h-8 flex items-center justify-center">
                    <div className="w-8 h-8 md:w-6 md:h-6 bg-blue-400 border border-gray-600 flex items-center justify-center">
                      <span className="text-base md:text-xs">{APPS['recycle-bin'].icon}</span>
                    </div>
                  </div>
                  <span>{APPS['recycle-bin'].title}</span>
                </div>
              </button>

              <button
                onClick={() => {
                  onOpenApp("terminal")
                  onClose()
                }}
                className="w-full text-left px-4 md:px-3 py-2 md:py-1 hover:bg-blue-600 hover:text-white flex items-center text-base md:text-sm touch-manipulation"
              >
                <div className="flex items-center space-x-4 md:space-x-3">
                  <div className="w-10 h-10 md:w-8 md:h-8 flex items-center justify-center">
                    <div className="w-8 h-8 md:w-6 md:h-6 bg-black border border-gray-600 flex items-center justify-center">
                      <span className="text-white text-base md:text-xs">{APPS['terminal'].icon}</span>
                    </div>
                  </div>
                  <span>{APPS['terminal'].title}</span>
                </div>
              </button>
            </div>
          )}

          {/* Projects Submenu */}
          {showProjectsSubmenu && (
            <div
              className="absolute left-full top-0 w-60 md:w-52 bg-gray-300 border-2 border-white border-r-gray-500 border-b-gray-500 shadow-lg z-10"
              onMouseEnter={() => setShowProjectsSubmenu(true)}
              onMouseLeave={() => setShowProjectsSubmenu(false)}
            >
              <button
                onClick={() => {
                  onOpenApp("projects")
                  onClose()
                }}
                className="w-full text-left px-4 md:px-3 py-2 md:py-1 hover:bg-blue-600 hover:text-white flex items-center text-base md:text-sm touch-manipulation"
              >
                <div className="flex items-center space-x-4 md:space-x-3">
                  <div className="w-10 h-10 md:w-8 md:h-8 flex items-center justify-center">
                    <div className="w-8 h-8 md:w-6 md:h-6 bg-yellow-400 border border-gray-600 flex items-center justify-center">
                      <span className="text-base md:text-xs">{APPS['projects'].icon}</span>
                    </div>
                  </div>
                  <span>{APPS['projects'].title}</span>
                </div>
              </button>

              <button
                onClick={() => {
                  onOpenApp("whoami")
                  onClose()
                }}
                className="w-full text-left px-4 md:px-3 py-2 md:py-1 hover:bg-blue-600 hover:text-white flex items-center text-base md:text-sm touch-manipulation"
              >
                <div className="flex items-center space-x-4 md:space-x-3">
                  <div className="w-10 h-10 md:w-8 md:h-8 flex items-center justify-center">
                    <div className="w-8 h-8 md:w-6 md:h-6 bg-blue-400 border border-gray-600 flex items-center justify-center">
                      <span className="text-base md:text-xs">{APPS['whoami'].icon}</span>
                    </div>
                  </div>
                  <span>{APPS['whoami'].title}</span>
                </div>
              </button>
            </div>
          )}
        </div>
      </div>
    </div>
  )
}
