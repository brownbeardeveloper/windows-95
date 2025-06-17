"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"
import { useFileSystem } from "@/hooks/use-file-system"

interface TerminalLine {
  type: "command" | "output" | "error"
  content: string
}

export default function Terminal() {
  // Use the centralized file system hook
  const {
    listDirectory,
    getItem,
    navigateTo,
    getCurrentPath,
    getCurrentDirectory,
    setCurrentDirectory,
    createFile,
    createDirectory,
    deleteItem,
    writeFile,
    readFile
  } = useFileSystem()

  const [history, setHistory] = useState<TerminalLine[]>([
    {
      type: "output",
      content: "Terminal v2.0 - Synchronized File System",
    },
    { type: "output", content: "Welcome to the Terminal!" },
    { type: "output", content: "Type 'help' for available commands." },
    { type: "output", content: "File system is now synchronized with My Computer." },
    { type: "output", content: "" },
  ])
  const [currentInput, setCurrentInput] = useState("")
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [vimMode, setVimMode] = useState(false)
  const [vimFile, setVimFile] = useState<{ name: string; content: string } | null>(null)
  const [vimCursor, setVimCursor] = useState({ line: 0, col: 0 })
  const [vimLines, setVimLines] = useState<string[]>([])
  const [vimStatus, setVimStatus] = useState("-- INSERT --")
  const [vimCommand, setVimCommand] = useState("")
  const [vimInsertMode, setVimInsertMode] = useState(true)

  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  const getCurrentPrompt = () => `${getCurrentPath()}>`

  const addOutput = (lines: string[], type: "output" | "error" = "output") => {
    setHistory((prev) => [...prev, ...lines.map((line) => ({ type, content: line }))])
  }

  const commands = {
    help: () => [
      "Available commands:",
      "  help          - Show this help message",
      "  whoami        - Display user information",
      "  ls / dir      - List directory contents",
      "  cd <dir>      - Change directory",
      "  pwd           - Print working directory",
      "  mkdir <dir>   - Create directory",
      "  touch <file>  - Create empty file",
      "  rm <file>     - Remove file",
      "  rmdir <dir>   - Remove directory",
      "  cat <file>    - Display file contents",
      "  vim <file>    - View/edit file contents",
      "  echo <text>   - Display text or write to file",
      "  skills        - Show technical skills",
      "  projects      - List all projects",
      "  contact       - Show contact information",
      "  experience    - Display work experience",
      "  clear         - Clear terminal screen",
      "  date          - Show current date and time",
      "  tree          - Show directory structure",
    ],
    pwd: () => [getCurrentPath()],
    whoami: () => [
      "Developer",
      "Full Stack Developer",
      "Location: Remote",
      "Experience: Multiple years",
      "Specialization: React, Node.js, Python",
    ],
    dir: () => {
      const items = listDirectory(getCurrentDirectory())
      const result = [`Directory of ${getCurrentPath()}`, ""]

      items.forEach((item) => {
        const date = "12/15/2023  10:30 AM"
        if (item.type === "directory") {
          result.push(`${date}    <DIR>          ${item.name}`)
        } else {
          const size = item.size || 1024
          result.push(`${date}         ${size.toString().padStart(8)}     ${item.name}`)
        }
      })

      const fileCount = items.filter((i) => i.type === "file").length
      const dirCount = items.filter((i) => i.type === "directory").length
      result.push(`               ${fileCount} File(s)`)
      result.push(`               ${dirCount} Dir(s)   2,147,483,648 bytes free`)

      return result
    },
    ls: () => {
      const items = listDirectory(getCurrentDirectory())
      return items.map((item) => (item.type === "directory" ? `${item.name}/` : item.name))
    },
    skills: () => [
      "Technical Skills:",
      "",
      "Frontend:",
      "  • React, Vue.js, Angular",
      "  • TypeScript, JavaScript",
      "  • HTML5, CSS3, Sass",
      "  • Tailwind CSS, Bootstrap",
      "",
      "Backend:",
      "  • Node.js, Express",
      "  • Python, Django, Flask",
      "  • PostgreSQL, MongoDB",
      "  • REST APIs, GraphQL",
      "",
      "Tools & Others:",
      "  • Git, Docker, AWS",
      "  • Jest, Cypress, Testing",
      "  • Webpack, Vite, Build Tools",
    ],
    projects: () => [
      "Recent Projects:",
      "",
      "1. E-Commerce Platform",
      "   Tech: React, Node.js, MongoDB",
      "   Status: Completed",
      "",
      "2. Task Management App",
      "   Tech: React Native, Firebase",
      "   Status: In Progress",
      "",
      "3. Weather Dashboard",
      "   Tech: Vue.js, Express, API",
      "   Status: Completed",
      "",
      "4. Chat Application",
      "   Tech: Socket.io, React, Node.js",
      "   Status: Completed",
      "",
      "Use 'cat' command to read file contents",
    ],
    contact: () => [
      "Contact Information:",
      "",
      "Email: developer@example.com",
      "LinkedIn: linkedin.com/in/developer",
      "GitHub: github.com/developer",
      "Website: developer.dev",
      "Phone: +1 (555) 123-4567",
    ],
    experience: () => [
      "Work Experience:",
      "",
      "Senior Full Stack Developer (2022 - Present)",
      "TechCorp Inc.",
      "• Led development of microservices architecture",
      "• Managed team of 5 developers",
      "• Improved system performance by 40%",
      "",
      "Frontend Developer (2020 - 2022)",
      "StartupXYZ",
      "• Built responsive web applications",
      "• Implemented modern JavaScript frameworks",
      "• Collaborated with design team",
      "",
      "Junior Developer (2019 - 2020)",
      "WebSolutions Ltd.",
      "• Developed client websites",
      "• Maintained legacy codebases",
      "• Learned industry best practices",
    ],
    date: () => [new Date().toString()],
    tree: () => {
      const buildTree = (path: string[], prefix = "", isLast = true): string[] => {
        const lines: string[] = []
        const item = getItem(path)
        if (!item) return lines

        const connector = isLast ? "└── " : "├── "
        const displayName = item.type === "directory" ? `${item.name}/` : item.name
        lines.push(`${prefix}${connector}${displayName}`)

        if (item.type === "directory") {
          const children = listDirectory(path)
          children.forEach((child, index) => {
            const isLastChild = index === children.length - 1
            const newPrefix = prefix + (isLast ? "    " : "│   ")
            const childPath = [...path, child.name]
            lines.push(...buildTree(childPath, newPrefix, isLastChild))
          })
        }

        return lines
      }

      return [getCurrentPath(), ...buildTree(getCurrentDirectory())]
    },
    clear: () => [],
  }

  const executeCommand = (cmd: string) => {
    const trimmedCmd = cmd.trim()
    const [command, ...args] = trimmedCmd.split(" ")
    const lowerCommand = command.toLowerCase()

    // Add command to terminal history display
    setHistory((prev) => [...prev, { type: "command", content: `${getCurrentPrompt()} ${cmd}` }])

    // Add command to command history for navigation (only if not empty and not duplicate)
    if (trimmedCmd && (commandHistory.length === 0 || commandHistory[commandHistory.length - 1] !== trimmedCmd)) {
      setCommandHistory((prev) => [...prev, trimmedCmd])
    }

    // Reset history index
    setHistoryIndex(-1)

    if (lowerCommand === "clear") {
      setHistory([])
      return
    }

    // CD command
    if (lowerCommand === "cd") {
      const target = args[0]
      if (!target || target === ".") {
        return
      }

      if (target === "..") {
        const currentDir = getCurrentDirectory()
        if (currentDir.length > 1) {
          const parentPath = currentDir.slice(0, -1)
          navigateTo(parentPath)
        }
        return
      }

      const targetPath = [...getCurrentDirectory(), target]
      const targetItem = getItem(targetPath)
      if (targetItem && targetItem.type === "directory") {
        navigateTo(targetPath)
      } else {
        addOutput([`The system cannot find the path specified: ${target}`], "error")
      }
      return
    }

    // MKDIR command
    if (lowerCommand === "mkdir") {
      const dirName = args[0]
      if (!dirName) {
        addOutput(["The syntax of the command is incorrect."], "error")
        return
      }

      const success = createDirectory(getCurrentDirectory(), dirName)
      if (!success) {
        addOutput([`A subdirectory or file ${dirName} already exists.`], "error")
      }
      return
    }

    // TOUCH command
    if (lowerCommand === "touch") {
      const fileName = args[0]
      if (!fileName) {
        addOutput(["Usage: touch <filename>"], "error")
        return
      }

      const success = createFile(getCurrentDirectory(), fileName, "")
      if (!success) {
        addOutput([`File ${fileName} already exists.`], "error")
      }
      return
    }

    // RM command
    if (lowerCommand === "rm") {
      const fileName = args[0]
      if (!fileName) {
        addOutput(["Usage: rm <filename>"], "error")
        return
      }

      const success = deleteItem(getCurrentDirectory(), fileName)
      if (!success) {
        addOutput([`File not found: ${fileName}`], "error")
      }
      return
    }

    // RMDIR command
    if (lowerCommand === "rmdir") {
      const dirName = args[0]
      if (!dirName) {
        addOutput(["Usage: rmdir <dirname>"], "error")
        return
      }

      const success = deleteItem(getCurrentDirectory(), dirName)
      if (!success) {
        addOutput([`Directory not found: ${dirName}`], "error")
      }
      return
    }

    // CAT command
    if (lowerCommand === "cat") {
      const fileName = args[0]
      if (!fileName) {
        addOutput(["Usage: cat <filename>"], "error")
        return
      }

      const content = readFile(getCurrentDirectory(), fileName)
      if (content !== null) {
        addOutput(content.split("\n"))
      } else {
        addOutput([`File not found: ${fileName}`], "error")
      }
      return
    }

    // VIM command
    if (lowerCommand === "vim") {
      const fileName = args[0]
      if (!fileName) {
        addOutput(["Usage: vim <filename>"], "error")
        return
      }

      const content = readFile(getCurrentDirectory(), fileName) || ""
      setVimFile({ name: fileName, content })
      setVimLines(content.split("\n"))
      setVimMode(true)
      setVimInsertMode(true)
      setVimCursor({ line: 0, col: 0 })
      setVimStatus("-- INSERT --")
      setVimCommand("")
      return
    }

    // ECHO command
    if (lowerCommand === "echo") {
      const text = args.join(" ")

      // Check if redirecting to file (echo "text" > file.txt)
      const redirectIndex = args.findIndex(arg => arg === ">")
      if (redirectIndex !== -1 && redirectIndex < args.length - 1) {
        const fileName = args[redirectIndex + 1]
        const textToWrite = args.slice(0, redirectIndex).join(" ")
        const success = writeFile(getCurrentDirectory(), fileName, textToWrite)
        if (!success) {
          addOutput([`Could not write to file: ${fileName}`], "error")
        }
        return
      }

      addOutput([text])
      return
    }

    // Check if it's a built-in command
    if (lowerCommand in commands) {
      const result = commands[lowerCommand as keyof typeof commands]()
      addOutput(result)
      return
    }

    // Command not found
    addOutput([`'${command}' is not recognized as an internal or external command.`], "error")
  }

  const saveVimFile = () => {
    if (vimFile) {
      const content = vimLines.join("\n")
      const success = writeFile(getCurrentDirectory(), vimFile.name, content)
      if (success) {
        setVimStatus("File saved!")
      } else {
        setVimStatus("Error saving file!")
      }
      setTimeout(() => setVimStatus("-- INSERT --"), 2000)
    }
  }

  const exitVim = () => {
    setVimMode(false)
    setVimFile(null)
    setVimLines([])
    setVimCursor({ line: 0, col: 0 })
    setVimStatus("-- INSERT --")
    setVimCommand("")
    setVimInsertMode(true)
  }

  const handleVimKeyPress = (e: React.KeyboardEvent) => {
    e.preventDefault()

    // Handle command line mode (when typing :w, :q, etc.)
    if (vimCommand.startsWith(":")) {
      if (e.key === "Enter") {
        const cmd = vimCommand.slice(1) // Remove the ":"
        if (cmd === "q") {
          // Quit
          exitVim()
          return
        } else if (cmd === "w") {
          // Save
          saveVimFile()
          setVimStatus("File saved!")
          setTimeout(() => setVimStatus(vimInsertMode ? "-- INSERT --" : "-- COMMAND --"), 2000)
          setVimCommand("")
          return
        } else if (cmd === "wq") {
          // Save and quit
          saveVimFile()
          exitVim()
          return
        }
        setVimCommand("")
        setVimStatus(vimInsertMode ? "-- INSERT --" : "-- COMMAND --")
        return
      } else if (e.key === "Escape") {
        setVimCommand("")
        setVimStatus(vimInsertMode ? "-- INSERT --" : "-- COMMAND --")
        return
      } else if (e.key === "Backspace") {
        if (vimCommand.length > 1) {
          setVimCommand(vimCommand.slice(0, -1))
        } else {
          setVimCommand("")
          setVimStatus(vimInsertMode ? "-- INSERT --" : "-- COMMAND --")
        }
        return
      } else if (e.key.length === 1 && !e.ctrlKey && !e.altKey) {
        setVimCommand(vimCommand + e.key)
        return
      }
      return
    }

    // Handle normal VIM modes
    if (e.key === "Escape") {
      if (vimInsertMode) {
        // Exit INSERT mode to COMMAND mode
        setVimInsertMode(false)
        setVimStatus("-- COMMAND --")
      }
      return
    }

    // COMMAND mode
    if (!vimInsertMode) {
      if (e.key === "i") {
        // Enter INSERT mode
        setVimInsertMode(true)
        setVimStatus("-- INSERT --")
        return
      }

      if (e.key === ":") {
        // Enter command line mode
        setVimCommand(":")
        setVimStatus("-- COMMAND LINE --")
        return
      }

      // Arrow keys work in both modes
      if (e.key === "ArrowUp" && vimCursor.line > 0) {
        const newLine = vimCursor.line - 1
        const maxCol = vimLines[newLine]?.length || 0
        setVimCursor({ line: newLine, col: Math.min(vimCursor.col, maxCol) })
        return
      }

      if (e.key === "ArrowDown" && vimCursor.line < vimLines.length - 1) {
        const newLine = vimCursor.line + 1
        const maxCol = vimLines[newLine]?.length || 0
        setVimCursor({ line: newLine, col: Math.min(vimCursor.col, maxCol) })
        return
      }

      if (e.key === "ArrowLeft" && vimCursor.col > 0) {
        setVimCursor({ ...vimCursor, col: vimCursor.col - 1 })
        return
      }

      if (e.key === "ArrowRight") {
        const currentLine = vimLines[vimCursor.line] || ""
        if (vimCursor.col < currentLine.length) {
          setVimCursor({ ...vimCursor, col: vimCursor.col + 1 })
        }
        return
      }

      // In COMMAND mode, ignore other keys
      return
    }

    // INSERT mode - handle text editing
    if (e.key === "Enter") {
      const newLines = [...vimLines]
      const currentLine = newLines[vimCursor.line] || ""
      const beforeCursor = currentLine.slice(0, vimCursor.col)
      const afterCursor = currentLine.slice(vimCursor.col)

      newLines[vimCursor.line] = beforeCursor
      newLines.splice(vimCursor.line + 1, 0, afterCursor)

      setVimLines(newLines)
      setVimCursor({ line: vimCursor.line + 1, col: 0 })
      return
    }

    if (e.key === "Backspace") {
      const newLines = [...vimLines]

      if (vimCursor.col > 0) {
        const currentLine = newLines[vimCursor.line] || ""
        const newLine = currentLine.slice(0, vimCursor.col - 1) + currentLine.slice(vimCursor.col)
        newLines[vimCursor.line] = newLine
        setVimCursor({ ...vimCursor, col: vimCursor.col - 1 })
      } else if (vimCursor.line > 0) {
        const currentLine = newLines[vimCursor.line] || ""
        const prevLine = newLines[vimCursor.line - 1] || ""
        const newCol = prevLine.length
        newLines[vimCursor.line - 1] = prevLine + currentLine
        newLines.splice(vimCursor.line, 1)
        setVimCursor({ line: vimCursor.line - 1, col: newCol })
      }

      setVimLines(newLines)
      return
    }

    // Arrow keys in INSERT mode
    if (e.key === "ArrowUp" && vimCursor.line > 0) {
      const newLine = vimCursor.line - 1
      const maxCol = vimLines[newLine]?.length || 0
      setVimCursor({ line: newLine, col: Math.min(vimCursor.col, maxCol) })
      return
    }

    if (e.key === "ArrowDown" && vimCursor.line < vimLines.length - 1) {
      const newLine = vimCursor.line + 1
      const maxCol = vimLines[newLine]?.length || 0
      setVimCursor({ line: newLine, col: Math.min(vimCursor.col, maxCol) })
      return
    }

    if (e.key === "ArrowLeft" && vimCursor.col > 0) {
      setVimCursor({ ...vimCursor, col: vimCursor.col - 1 })
      return
    }

    if (e.key === "ArrowRight") {
      const currentLine = vimLines[vimCursor.line] || ""
      if (vimCursor.col < currentLine.length) {
        setVimCursor({ ...vimCursor, col: vimCursor.col + 1 })
      }
      return
    }

    // Type characters in INSERT mode
    if (e.key.length === 1 && !e.ctrlKey && !e.altKey) {
      const newLines = [...vimLines]
      const currentLine = newLines[vimCursor.line] || ""
      const newLine = currentLine.slice(0, vimCursor.col) + e.key + currentLine.slice(vimCursor.col)
      newLines[vimCursor.line] = newLine
      setVimLines(newLines)
      setVimCursor({ ...vimCursor, col: vimCursor.col + 1 })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (vimMode) {
      handleVimKeyPress(e)
      return
    }

    if (e.key === "Enter") {
      executeCommand(currentInput)
      setCurrentInput("")
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (historyIndex < commandHistory.length - 1) {
        const newIndex = historyIndex + 1
        setHistoryIndex(newIndex)
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (historyIndex > 0) {
        const newIndex = historyIndex - 1
        setHistoryIndex(newIndex)
        setCurrentInput(commandHistory[commandHistory.length - 1 - newIndex])
      } else if (historyIndex === 0) {
        setHistoryIndex(-1)
        setCurrentInput("")
      }
    } else if (e.key === "Tab") {
      e.preventDefault()
      const items = listDirectory(getCurrentDirectory())
      const matches = items.filter(item =>
        item.name.toLowerCase().startsWith(currentInput.toLowerCase())
      )
      if (matches.length === 1) {
        setCurrentInput(matches[0].name)
      }
    }
  }

  useEffect(() => {
    if (terminalRef.current) {
      terminalRef.current.scrollTop = terminalRef.current.scrollHeight
    }
  }, [history])

  useEffect(() => {
    if (inputRef.current) {
      inputRef.current.focus()
    }
  }, [vimMode])

  if (vimMode && vimFile) {
    return (
      <div
        className="h-full bg-black text-green-400 font-mono flex flex-col"
        tabIndex={0}
        onKeyDown={handleVimKeyPress}
        onClick={() => {
          // Focus the hidden input to capture keyboard events
          if (inputRef.current) {
            inputRef.current.focus()
          }
        }}
      >
        <div className="flex-1 p-2 overflow-auto">
          <div className="mb-2 text-blue-400">-- VIM MODE --</div>
          <div className="mb-2 text-yellow-400">File: {vimFile.name}</div>
          <div className="mb-2 text-gray-400">
            {vimInsertMode ? "Esc: Command Mode" : "i: Insert | :: Commands"}
          </div>
          <div className="border-t border-gray-600 pt-2">
            {vimLines.map((line, lineIndex) => (
              <div key={lineIndex} className="flex">
                <span className="text-gray-500 w-8 text-right pr-2">
                  {lineIndex + 1}
                </span>
                <span className="flex-1">
                  {lineIndex === vimCursor.line ? (
                    <>
                      {line.slice(0, vimCursor.col)}
                      <span className="bg-green-400 text-black">
                        {line[vimCursor.col] || " "}
                      </span>
                      {line.slice(vimCursor.col + 1)}
                    </>
                  ) : (
                    line || "\u00A0"
                  )}
                </span>
              </div>
            ))}
          </div>
        </div>
        <div className="border-t border-gray-600 p-2 bg-gray-900">
          <div className="flex justify-between">
            <div className="text-yellow-400">{vimStatus}</div>
            {vimCommand && (
              <div className="text-white">{vimCommand}</div>
            )}
          </div>
        </div>
        {/* Hidden input to capture keyboard events */}
        <input
          ref={inputRef}
          type="text"
          className="absolute opacity-0 pointer-events-none"
          onKeyDown={handleVimKeyPress}
          autoFocus
        />
      </div>
    )
  }

  return (
    <div
      className="h-full bg-black text-green-400 font-mono text-sm flex flex-col"
      onClick={() => inputRef.current?.focus()}
    >
      <div
        ref={terminalRef}
        className="flex-1 p-4 overflow-auto"
      >
        {history.map((line, index) => (
          <div key={index} className={`mb-1 ${line.type === "command" ? "text-white" :
            line.type === "error" ? "text-red-400" : "text-green-400"
            }`}>
            {line.content}
          </div>
        ))}
        <div className="flex items-center">
          <span className="text-white mr-1">{getCurrentPrompt()}</span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className="bg-transparent outline-none flex-1 text-green-400"
            spellCheck={false}
            autoComplete="off"
          />
        </div>
      </div>
    </div>
  )
}
