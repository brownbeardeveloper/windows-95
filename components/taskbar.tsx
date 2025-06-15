"use client"

interface TaskbarProps {
  onStartClick: () => void
  windows: Array<{
    id: string
    title: string
    minimized: boolean
  }>
  onWindowClick: (id: string) => void
}

export default function Taskbar({ onStartClick, windows, onWindowClick }: TaskbarProps) {
  return (
    <div className="absolute bottom-0 left-0 right-0 h-10 md:h-7 bg-gray-300 border-t-2 border-white flex items-center px-1">
      {/* Start Button */}
      <button
        onClick={onStartClick}
        className="h-8 md:h-6 px-3 md:px-2 bg-gray-300 border-2 border-white border-r-gray-400 border-b-gray-400 hover:bg-gray-200 active:border-gray-400 active:border-r-white active:border-b-white flex items-center space-x-1 touch-manipulation"
      >
        <div className="w-5 h-5 md:w-4 md:h-4 bg-red-500 flex items-center justify-center text-white text-sm md:text-xs font-bold">⊞</div>
        <span className="text-sm md:text-xs font-bold">Start</span>
      </button>

      {/* Window Buttons */}
      <div className="flex-1 flex items-center space-x-1 ml-2 overflow-x-auto">
        {windows.map((window) => (
          <button
            key={window.id}
            onClick={() => onWindowClick(window.id)}
            className={`h-8 md:h-6 px-3 text-sm md:text-xs border-2 max-w-32 md:max-w-40 truncate touch-manipulation flex-shrink-0 ${window.minimized
                ? "bg-gray-200 border-gray-400 border-r-white border-b-white"
                : "bg-gray-300 border-white border-r-gray-400 border-b-gray-400"
              }`}
          >
            {window.title}
          </button>
        ))}
      </div>

      {/* System Tray */}
      <div className="flex items-center space-x-2 mr-1 md:mr-2">
        <div className="w-6 h-6 md:w-5 md:h-5 bg-gray-400 border border-gray-500 flex items-center justify-center text-sm md:text-xs touch-manipulation">🔊</div>
        <div className="text-sm md:text-xs bg-gray-200 border border-gray-400 px-2 py-1 md:py-0.5 whitespace-nowrap">8:19 PM</div>
      </div>
    </div>
  )
}
