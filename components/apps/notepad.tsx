"use client"

import { useState } from "react"

export default function Notepad() {
  const [text, setText] = useState("Welcome to Notepad!\n\nThis is a simple text editor built with React.")

  return (
    <div className="h-full flex flex-col bg-gray-300">
      {/* Menu Bar */}
      <div className="bg-gray-300 border-b border-gray-400 px-2 py-1">
        <div className="flex space-x-4 text-sm">
          <button className="hover:bg-blue-600 hover:text-white px-2 py-1">File</button>
          <button className="hover:bg-blue-600 hover:text-white px-2 py-1">Edit</button>
          <button className="hover:bg-blue-600 hover:text-white px-2 py-1">Search</button>
          <button className="hover:bg-blue-600 hover:text-white px-2 py-1">Help</button>
        </div>
      </div>

      {/* Text Area */}
      <div className="flex-1 p-1">
        <textarea
          value={text}
          onChange={(e) => setText(e.target.value)}
          className="w-full h-full p-2 border-2 border-gray-400 border-r-white border-b-white resize-none font-mono text-sm focus:outline-none"
          style={{ fontFamily: "Courier New, monospace" }}
        />
      </div>
    </div>
  )
}
