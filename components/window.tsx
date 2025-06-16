"use client"

import type React from "react"
import { useState, useRef, useEffect } from "react"

interface WindowProps {
  title: string
  children: React.ReactNode
  x: number
  y: number
  width: number
  height: number
  zIndex: number
  isActive: boolean
  onClose: () => void
  onMinimize: () => void
  onFocus: () => void
  onMove: (x: number, y: number) => void
}

export default function Window({
  title,
  children,
  x,
  y,
  width,
  height,
  zIndex,
  isActive,
  onClose,
  onMinimize,
  onFocus,
  onMove,
}: WindowProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [dragOffset, setDragOffset] = useState({ x: 0, y: 0 })
  const [isMobile, setIsMobile] = useState(false)
  const windowRef = useRef<HTMLDivElement>(null)

  useEffect(() => {
    const checkMobile = () => {
      setIsMobile(window.innerWidth < 768)
    }

    checkMobile()
    window.addEventListener('resize', checkMobile)
    return () => window.removeEventListener('resize', checkMobile)
  }, [])

  const handleMouseDown = (e: React.MouseEvent) => {
    if (isMobile) return // Disable dragging on mobile

    if (e.target === e.currentTarget || (e.target as HTMLElement).classList.contains("title-bar")) {
      setIsDragging(true)
      setDragOffset({
        x: e.clientX - x,
        y: e.clientY - y,
      })
      onFocus()
    }
  }

  const handleTouchStart = (e: React.TouchEvent) => {
    onFocus()
  }

  useEffect(() => {
    const handleMouseMove = (e: MouseEvent) => {
      if (isDragging && !isMobile) {
        const newX = Math.max(0, Math.min(window.innerWidth - width, e.clientX - dragOffset.x))
        const newY = Math.max(0, Math.min(window.innerHeight - height - 40, e.clientY - dragOffset.y))
        onMove(newX, newY)
      }
    }

    const handleMouseUp = () => {
      setIsDragging(false)
    }

    if (isDragging) {
      document.addEventListener("mousemove", handleMouseMove)
      document.addEventListener("mouseup", handleMouseUp)
    }

    return () => {
      document.removeEventListener("mousemove", handleMouseMove)
      document.removeEventListener("mouseup", handleMouseUp)
    }
  }, [isDragging, dragOffset, x, y, width, height, onMove, isMobile])

  return (
    <div
      ref={windowRef}
      className="absolute bg-gray-300 border-2 border-white border-r-gray-400 border-b-gray-400 shadow-lg"
      style={{
        left: isMobile ? 10 : x,
        top: isMobile ? 10 : y,
        width: isMobile ? 'calc(100vw - 20px)' : width,
        height: isMobile ? 'calc(100vh - 80px)' : height, // Leave space for taskbar on mobile
        zIndex,
        maxWidth: isMobile ? 'calc(100vw - 20px)' : 'none',
        maxHeight: isMobile ? 'calc(100vh - 80px)' : 'none',
        ...(isActive ? {} : {
          background: 'linear-gradient(rgba(240, 240, 240, 0.2), rgba(240, 240, 240, 0.2)), #d1d5db'
        })
      }}
      onMouseDown={() => onFocus()}
      onTouchStart={handleTouchStart}
    >
      {/* Title Bar */}
      <div
        className={`title-bar h-6 md:h-5 ${isActive
          ? 'bg-gradient-to-r from-blue-800 to-blue-600 text-white'
          : 'bg-gradient-to-r from-gray-600 to-gray-500 text-gray-200'
          } flex items-center justify-between px-2 md:px-1 ${isMobile ? '' : 'cursor-move'}`}
        onMouseDown={handleMouseDown}
      >
        <span className="text-sm md:text-xs font-bold truncate">{title}</span>
        <div className="flex space-x-1">
          <button
            onClick={onMinimize}
            className="w-6 h-4 md:w-4 md:h-3 bg-gray-300 border border-gray-400 text-black text-sm md:text-xs flex items-center justify-center hover:bg-gray-200 touch-manipulation"
          >
            _
          </button>
          <button
            onClick={onClose}
            className="w-6 h-4 md:w-4 md:h-3 bg-gray-300 border border-gray-400 text-black text-sm md:text-xs flex items-center justify-center hover:bg-gray-200 touch-manipulation"
          >
            ×
          </button>
        </div>
      </div>

      {/* Window Content */}
      <div className="h-full pb-6 md:pb-5 overflow-hidden">{children}</div>
    </div>
  )
}
