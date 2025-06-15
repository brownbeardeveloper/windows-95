"use client"

export default function MyComputer() {
  const drives = [
    { name: "3½ Floppy (A:)", icon: "💾", type: "floppy" },
    { name: "Local Disk (C:)", icon: "💿", type: "hard-drive", space: "2.1 GB free of 4.2 GB" },
    { name: "CD-ROM (D:)", icon: "💿", type: "cd-rom" },
  ]

  const folders = [
    { name: "Printers", icon: "🖨️" },
    { name: "Dial-Up Networking", icon: "📞" },
  ]

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
        <button className="px-2 py-1 text-xs border border-gray-400 bg-white hover:bg-gray-100">Back</button>
        <button className="px-2 py-1 text-xs border border-gray-400 bg-white hover:bg-gray-100">Forward</button>
        <button className="px-2 py-1 text-xs border border-gray-400 bg-white hover:bg-gray-100">Up</button>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="grid grid-cols-4 gap-6">
          {/* Drives */}
          {drives.map((drive, index) => (
            <div
              key={index}
              className="flex flex-col items-center cursor-pointer hover:bg-blue-600 hover:bg-opacity-20 p-2 rounded"
            >
              <div className="w-10 h-10 flex items-center justify-center text-2xl mb-2">{drive.icon}</div>
              <span className="text-xs text-center leading-tight">{drive.name}</span>
              {drive.space && <span className="text-xs text-gray-600 text-center mt-1">{drive.space}</span>}
            </div>
          ))}

          {/* System Folders */}
          {folders.map((folder, index) => (
            <div
              key={index}
              className="flex flex-col items-center cursor-pointer hover:bg-blue-600 hover:bg-opacity-20 p-2 rounded"
            >
              <div className="w-10 h-10 flex items-center justify-center text-2xl mb-2">{folder.icon}</div>
              <span className="text-xs text-center leading-tight">{folder.name}</span>
            </div>
          ))}

          {/* Add more items for testing scroll */}
          {Array.from({ length: 15 }, (_, i) => (
            <div
              key={`extra-${i}`}
              className="flex flex-col items-center cursor-pointer hover:bg-blue-600 hover:bg-opacity-20 p-2 rounded"
            >
              <div className="w-10 h-10 flex items-center justify-center text-2xl mb-2">📁</div>
              <span className="text-xs text-center leading-tight">Folder {i + 1}</span>
            </div>
          ))}
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-5 bg-gray-300 border-t border-gray-400 px-2 flex items-center">
        <span className="text-xs">{6 + 15} object(s)</span>
      </div>
    </div>
  )
}
