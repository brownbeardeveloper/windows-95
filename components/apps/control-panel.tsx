"use client"

export default function ControlPanel() {
  const controlPanelItems = [
    { name: "Add New Hardware", icon: "🔧", color: "bg-green-400" },
    { name: "Add/Remove Programs", icon: "💾", color: "bg-blue-400" },
    { name: "Regional Settings", icon: "🌍", color: "bg-green-400" },
    { name: "Passwords", icon: "🔐", color: "bg-yellow-400" },
    { name: "Power Management", icon: "🔋", color: "bg-red-400" },
    { name: "Date/Time", icon: "🕐", color: "bg-red-400" },
    { name: "Fonts", icon: "🔤", color: "bg-yellow-400" },
    { name: "Printers", icon: "🖨️", color: "bg-yellow-400" },
    { name: "Internet", icon: "🌐", color: "bg-blue-400" },
    { name: "Joystick", icon: "🕹️", color: "bg-gray-400" },
    { name: "Modems", icon: "📞", color: "bg-yellow-400" },
    { name: "Mouse", icon: "🖱️", color: "bg-gray-400" },
    { name: "Multimedia", icon: "🎵", color: "bg-blue-400" },
    { name: "Accessibility Options", icon: "♿", color: "bg-blue-400" },
    { name: "Display", icon: "🖥️", color: "bg-blue-400" },
    { name: "Network", icon: "🌐", color: "bg-blue-400" },
    { name: "System", icon: "💻", color: "bg-blue-400" },
    { name: "Sounds", icon: "🔊", color: "bg-blue-400" },
    { name: "Keyboard", icon: "⌨️", color: "bg-gray-400" },
  ]

  return (
    <div className="h-full bg-gray-300 flex flex-col">
      {/* Menu Bar */}
      <div className="bg-gray-300 border-b border-gray-400 px-2 py-1">
        <div className="flex space-x-4 text-xs">
          <button className="hover:bg-blue-600 hover:text-white px-2 py-1">File</button>
          <button className="hover:bg-blue-600 hover:text-white px-2 py-1">Edit</button>
          <button className="hover:bg-blue-600 hover:text-white px-2 py-1">View</button>
          <button className="hover:bg-blue-600 hover:text-white px-2 py-1">Help</button>
        </div>
      </div>

      {/* Control Panel Grid */}
      <div className="flex-1 p-3 overflow-auto">
        <div className="grid grid-cols-5 gap-4">
          {controlPanelItems.map((item, index) => (
            <div
              key={index}
              className="flex flex-col items-center cursor-pointer hover:bg-blue-600 hover:bg-opacity-20 p-2 rounded"
            >
              <div
                className={`w-8 h-8 ${item.color} border border-gray-600 flex items-center justify-center text-sm mb-1`}
              >
                {item.icon}
              </div>
              <span className="text-xs text-center leading-tight">{item.name}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-5 bg-gray-300 border-t border-gray-400 px-2 flex items-center">
        <span className="text-xs">Changes the settings for your mouse.</span>
      </div>
    </div>
  )
}
