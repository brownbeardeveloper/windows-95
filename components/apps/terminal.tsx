"use client"

import type React from "react"

import { useState, useRef, useEffect } from "react"

interface TerminalLine {
  type: "command" | "output" | "error"
  content: string
}

interface FileSystemItem {
  name: string
  type: "file" | "directory"
  content?: string
  children?: { [key: string]: FileSystemItem }
}

export default function Terminal() {
  // Function to detect browser and OS
  const detectSystemInfo = () => {
    if (typeof window === 'undefined') {
      return { os: "Server", browser: "Unknown" };
    }

    const userAgent = navigator.userAgent;
    const platform = navigator.platform;

    // Detect OS
    let osName = "Unknown";
    if (platform.includes("Win")) {
      osName = "Windows";
    } else if (platform.includes("Mac")) {
      osName = "macOS";
    } else if (platform.includes("Linux")) {
      osName = "Linux";
    } else if (platform.includes("iPhone") || platform.includes("iPad")) {
      osName = "iOS";
    } else if (userAgent.includes("Android")) {
      osName = "Android";
    }

    // Detect browser
    let browserName = "Unknown";
    if (userAgent.includes("Chrome") && !userAgent.includes("Edg")) {
      browserName = "Google Chrome";
    } else if (userAgent.includes("Firefox")) {
      browserName = "Mozilla Firefox";
    } else if (userAgent.includes("Safari") && !userAgent.includes("Chrome")) {
      browserName = "Safari";
    } else if (userAgent.includes("Edg")) {
      browserName = "Microsoft Edge";
    } else if (userAgent.includes("Opera") || userAgent.includes("OPR")) {
      browserName = "Opera";
    }

    return { os: osName, browser: browserName };
  };

  const systemInfo = detectSystemInfo();

  const [history, setHistory] = useState<TerminalLine[]>([
    {
      type: "output",
      content: "Terminal v1.0.0",
    },
    { type: "output", content: "Welcome to the Terminal!" },
    { type: "output", content: "Type 'help' for available commands." },
    { type: "output", content: "" },
  ])
  const [currentInput, setCurrentInput] = useState("")
  const [currentDirectory, setCurrentDirectory] = useState([systemInfo.os, systemInfo.browser])
  const [commandHistory, setCommandHistory] = useState<string[]>([])
  const [historyIndex, setHistoryIndex] = useState(-1)
  const [vimMode, setVimMode] = useState(false)
  const [vimFile, setVimFile] = useState<{ name: string; content: string } | null>(null)
  const [vimCursor, setVimCursor] = useState({ line: 0, col: 0 })
  const [vimLines, setVimLines] = useState<string[]>([])
  const [vimStatus, setVimStatus] = useState("-- INSERT --")
  const [vimCommand, setVimCommand] = useState("")
  const [fileSystem, setFileSystem] = useState<{ [key: string]: FileSystemItem }>({
    [systemInfo.os]: {
      name: systemInfo.os,
      type: "directory",
      children: {
        [systemInfo.browser]: {
          name: systemInfo.browser,
          type: "directory",
          children: {
            projects: {
              name: "projects",
              type: "directory",
              children: {
                "ecommerce-platform": { name: "ecommerce-platform", type: "directory", children: {} },
                "task-management-app": { name: "task-management-app", type: "directory", children: {} },
                "weather-dashboard": { name: "weather-dashboard", type: "directory", children: {} },
                "chat-application": { name: "chat-application", type: "directory", children: {} },
              },
            },
            skills: {
              name: "skills",
              type: "directory",
              children: {
                "frontend.txt": { name: "frontend.txt", type: "file", content: "React, Vue.js, Angular, TypeScript" },
                "backend.txt": { name: "backend.txt", type: "file", content: "Node.js, Python, PostgreSQL, MongoDB" },
                "tools.txt": { name: "tools.txt", type: "file", content: "Git, Docker, AWS, Jest, Webpack" },
              },
            },
            experience: {
              name: "experience",
              type: "directory",
              children: {
                "techcorp.txt": {
                  name: "techcorp.txt",
                  type: "file",
                  content: "Senior Full Stack Developer (2022-Present)",
                },
                "startupxyz.txt": { name: "startupxyz.txt", type: "file", content: "Frontend Developer (2020-2022)" },
                "websolutions.txt": { name: "websolutions.txt", type: "file", content: "Junior Developer (2019-2020)" },
              },
            },
            "resume.pdf": { name: "resume.pdf", type: "file", content: "Developer's Resume - Full Stack Developer" },
            "contact.txt": {
              name: "contact.txt",
              type: "file",
              content: "Email: developer@example.com\nGitHub: github.com/developer",
            },
            "about.md": {
              name: "about.md",
              type: "file",
              content: "# About Me\n\nPassionate full-stack developer with 5+ years of experience.",
            },
          },
        },
      },
    },
  })

  const inputRef = useRef<HTMLInputElement>(null)
  const terminalRef = useRef<HTMLDivElement>(null)

  const getCurrentPath = () => `C:\\${currentDirectory.join("\\")}`
  const getCurrentPrompt = () => `${getCurrentPath()}>`

  const getCurrentDirectoryObject = (): FileSystemItem | null => {
    let current = fileSystem[currentDirectory[0]]
    for (let i = 1; i < currentDirectory.length; i++) {
      if (current?.children?.[currentDirectory[i]]) {
        current = current.children[currentDirectory[i]]
      } else {
        return null
      }
    }
    return current
  }

  const getItemAtPath = (path: string[]): FileSystemItem | null => {
    let current = fileSystem[path[0]]
    for (let i = 1; i < path.length; i++) {
      if (current?.children?.[path[i]]) {
        current = current.children[path[i]]
      } else {
        return null
      }
    }
    return current
  }

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
      const currentDir = getCurrentDirectoryObject()
      if (!currentDir || !currentDir.children) {
        return ["Directory not found"]
      }

      const items = Object.values(currentDir.children)
      const result = [`Directory of ${getCurrentPath()}`, ""]

      items.forEach((item) => {
        const date = "12/15/2023  10:30 AM"
        if (item.type === "directory") {
          result.push(`${date}    <DIR>          ${item.name}`)
        } else {
          const size = item.content?.length || 1024
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
      const currentDir = getCurrentDirectoryObject()
      if (!currentDir || !currentDir.children) {
        return ["Directory not found"]
      }

      return Object.values(currentDir.children).map((item) => (item.type === "directory" ? `${item.name}/` : item.name))
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
      "Use 'cat projects/<name>' for more details",
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
      const buildTree = (item: FileSystemItem, prefix = "", isLast = true): string[] => {
        const lines: string[] = []
        const connector = isLast ? "└── " : "├── "
        const displayName = item.type === "directory" ? `${item.name}/` : item.name
        lines.push(`${prefix}${connector}${displayName}`)

        if (item.children) {
          const children = Object.values(item.children)
          children.forEach((child, index) => {
            const isLastChild = index === children.length - 1
            const newPrefix = prefix + (isLast ? "    " : "│   ")
            lines.push(...buildTree(child, newPrefix, isLastChild))
          })
        }

        return lines
      }

      const rootDir = getCurrentDirectoryObject()
      if (!rootDir) return ["Directory not found"]

      return [getCurrentPath(), ...buildTree(rootDir)]
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
        if (currentDirectory.length > 1) {
          setCurrentDirectory((prev) => prev.slice(0, -1))
        }
        return
      }

      const currentDir = getCurrentDirectoryObject()
      if (currentDir?.children?.[target]?.type === "directory") {
        setCurrentDirectory((prev) => [...prev, target])
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

      const currentDir = getCurrentDirectoryObject()
      if (currentDir?.children?.[dirName]) {
        addOutput([`A subdirectory or file ${dirName} already exists.`], "error")
        return
      }

      setFileSystem((prev) => {
        const newFS = JSON.parse(JSON.stringify(prev))
        let current = newFS[currentDirectory[0]]
        for (let i = 1; i < currentDirectory.length; i++) {
          current = current.children[currentDirectory[i]]
        }
        current.children[dirName] = {
          name: dirName,
          type: "directory",
          children: {},
        }
        return newFS
      })

      addOutput([`Directory created: ${dirName}`])
      return
    }

    // TOUCH command
    if (lowerCommand === "touch") {
      const fileName = args[0]
      if (!fileName) {
        addOutput(["Usage: touch <filename>"], "error")
        return
      }

      setFileSystem((prev) => {
        const newFS = JSON.parse(JSON.stringify(prev))
        let current = newFS[currentDirectory[0]]
        for (let i = 1; i < currentDirectory.length; i++) {
          current = current.children[currentDirectory[i]]
        }
        current.children[fileName] = {
          name: fileName,
          type: "file",
          content: "",
        }
        return newFS
      })

      addOutput([`File created: ${fileName}`])
      return
    }

    // RM command
    if (lowerCommand === "rm") {
      const fileName = args[0]
      if (!fileName) {
        addOutput(["Usage: rm <filename>"], "error")
        return
      }

      const currentDir = getCurrentDirectoryObject()
      if (!currentDir?.children?.[fileName]) {
        addOutput([`File not found: ${fileName}`], "error")
        return
      }

      if (currentDir.children[fileName].type === "directory") {
        addOutput([`${fileName} is a directory. Use 'rmdir' to remove directories.`], "error")
        return
      }

      setFileSystem((prev) => {
        const newFS = JSON.parse(JSON.stringify(prev))
        let current = newFS[currentDirectory[0]]
        for (let i = 1; i < currentDirectory.length; i++) {
          current = current.children[currentDirectory[i]]
        }
        delete current.children[fileName]
        return newFS
      })

      addOutput([`File deleted: ${fileName}`])
      return
    }

    // RMDIR command
    if (lowerCommand === "rmdir") {
      const dirName = args[0]
      if (!dirName) {
        addOutput(["Usage: rmdir <directory>"], "error")
        return
      }

      const currentDir = getCurrentDirectoryObject()
      if (!currentDir?.children?.[dirName]) {
        addOutput([`Directory not found: ${dirName}`], "error")
        return
      }

      if (currentDir.children[dirName].type !== "directory") {
        addOutput([`${dirName} is not a directory.`], "error")
        return
      }

      const targetDir = currentDir.children[dirName]
      if (targetDir.children && Object.keys(targetDir.children).length > 0) {
        addOutput([`Directory not empty: ${dirName}. Use 'rm -rf' to force delete.`], "error")
        return
      }

      setFileSystem((prev) => {
        const newFS = JSON.parse(JSON.stringify(prev))
        let current = newFS[currentDirectory[0]]
        for (let i = 1; i < currentDirectory.length; i++) {
          current = current.children[currentDirectory[i]]
        }
        delete current.children[dirName]
        return newFS
      })

      addOutput([`Directory deleted: ${dirName}`])
      return
    }

    // CAT command
    if (lowerCommand === "cat") {
      const fileName = args[0]
      if (!fileName) {
        addOutput(["Usage: cat <filename>"], "error")
        return
      }

      const currentDir = getCurrentDirectoryObject()
      const file = currentDir?.children?.[fileName]

      if (!file) {
        addOutput([`File not found: ${fileName}`], "error")
        return
      }

      if (file.type === "directory") {
        addOutput([`${fileName} is a directory.`], "error")
        return
      }

      const content = file.content || ""
      addOutput(content.split("\n"))
      return
    }

    // VIM command
    if (lowerCommand === "vim") {
      const fileName = args[0]
      if (!fileName) {
        addOutput(["Usage: vim <filename>"], "error")
        return
      }

      const currentDir = getCurrentDirectoryObject()
      let file = currentDir?.children?.[fileName]

      if (!file) {
        // Create the file if it doesn't exist
        setFileSystem((prev) => {
          const newFS = JSON.parse(JSON.stringify(prev))
          let current = newFS[currentDirectory[0]]
          for (let i = 1; i < currentDirectory.length; i++) {
            current = current.children[currentDirectory[i]]
          }
          current.children[fileName] = {
            name: fileName,
            type: "file",
            content: "",
          }
          return newFS
        })
        file = { name: fileName, type: "file", content: "" }
      }

      if (file && file.type === "directory") {
        addOutput([`${fileName} is a directory.`], "error")
        return
      }

      // Get the most up-to-date file content
      const updatedDir = getCurrentDirectoryObject()
      const updatedFile = updatedDir?.children?.[fileName]
      const content = updatedFile?.content || ""
      const lines = content.split("\n")

      // Enter vim mode
      setVimMode(true)
      setVimFile({ name: fileName, content })
      setVimLines(lines.length === 1 && lines[0] === "" ? [""] : lines)
      setVimCursor({ line: 0, col: 0 })
      setVimStatus("-- INSERT --")
      return
    }

    // ECHO command
    if (lowerCommand === "echo") {
      const text = args.join(" ")
      addOutput([text])
      return
    }

    // Check if it's a built-in command
    const commandFunc = commands[lowerCommand as keyof typeof commands]
    if (commandFunc) {
      const output = commandFunc()
      addOutput(output)
    } else {
      addOutput([`'${command}' is not recognized as an internal or external command.`], "error")
    }
  }

  const saveVimFile = () => {
    if (!vimFile) return

    const content = vimLines.join("\n")
    setFileSystem((prev) => {
      const newFS = JSON.parse(JSON.stringify(prev))
      let current = newFS[currentDirectory[0]]
      for (let i = 1; i < currentDirectory.length; i++) {
        current = current.children[currentDirectory[i]]
      }
      if (current.children[vimFile.name]) {
        current.children[vimFile.name].content = content
      }
      return newFS
    })
  }

  const exitVim = () => {
    setVimMode(false)
    setVimFile(null)
    setVimLines([])
    setVimCursor({ line: 0, col: 0 })
    setVimStatus("-- INSERT --")
    setVimCommand("")
  }

  const handleVimKeyPress = (e: React.KeyboardEvent) => {
    e.preventDefault()

    if (e.key === "Escape") {
      setVimStatus("-- COMMAND --")
      setVimCommand("")
      return
    }

    if (vimStatus === "-- COMMAND --") {
      if (e.key === "i") {
        setVimStatus("-- INSERT --")
        return
      }
      if (e.key === ":") {
        setVimCommand(":")
        setVimStatus("-- COMMAND LINE --")
        return
      }
      return
    }

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
          setTimeout(() => setVimStatus("-- COMMAND --"), 1000)
          setVimCommand("")
          return
        } else if (cmd === "wq") {
          // Save and quit
          saveVimFile()
          exitVim()
          return
        }
        setVimCommand("")
        setVimStatus("-- COMMAND --")
        return
      } else if (e.key === "Backspace") {
        if (vimCommand.length > 1) {
          setVimCommand(vimCommand.slice(0, -1))
        } else {
          setVimCommand("")
          setVimStatus("-- COMMAND --")
        }
        return
      } else if (e.key === "Escape") {
        setVimCommand("")
        setVimStatus("-- COMMAND --")
        return
      } else if (e.key.length === 1 && !e.ctrlKey && !e.altKey) {
        const newCommand = vimCommand + e.key
        if (newCommand.length <= 3) { // : + max 2 characters
          setVimCommand(newCommand)
        } else {
          // Clear command if it gets too long
          setVimCommand("")
          setVimStatus("-- COMMAND --")
        }
        return
      }
      return
    }

    // INSERT mode
    const { line, col } = vimCursor
    const currentLine = vimLines[line] || ""

    if (e.key === "Enter") {
      const newLines = [...vimLines]
      const beforeCursor = currentLine.slice(0, col)
      const afterCursor = currentLine.slice(col)
      newLines[line] = beforeCursor
      newLines.splice(line + 1, 0, afterCursor)
      setVimLines(newLines)
      setVimCursor({ line: line + 1, col: 0 })
    } else if (e.key === "Backspace") {
      if (col > 0) {
        const newLines = [...vimLines]
        newLines[line] = currentLine.slice(0, col - 1) + currentLine.slice(col)
        setVimLines(newLines)
        setVimCursor({ line, col: col - 1 })
      } else if (line > 0) {
        const newLines = [...vimLines]
        const prevLine = newLines[line - 1]
        newLines[line - 1] = prevLine + currentLine
        newLines.splice(line, 1)
        setVimLines(newLines)
        setVimCursor({ line: line - 1, col: prevLine.length })
      }
    } else if (e.key === "ArrowUp" && line > 0) {
      setVimCursor({ line: line - 1, col: Math.min(col, vimLines[line - 1]?.length || 0) })
    } else if (e.key === "ArrowDown" && line < vimLines.length - 1) {
      setVimCursor({ line: line + 1, col: Math.min(col, vimLines[line + 1]?.length || 0) })
    } else if (e.key === "ArrowLeft" && col > 0) {
      setVimCursor({ line, col: col - 1 })
    } else if (e.key === "ArrowRight" && col < currentLine.length) {
      setVimCursor({ line, col: col + 1 })
    } else if (e.key.length === 1 && !e.ctrlKey && !e.altKey) {
      const newLines = [...vimLines]
      newLines[line] = currentLine.slice(0, col) + e.key + currentLine.slice(col)
      setVimLines(newLines)
      setVimCursor({ line, col: col + 1 })
    }
  }

  const handleKeyPress = (e: React.KeyboardEvent) => {
    if (vimMode) {
      handleVimKeyPress(e)
      return
    }

    if (e.key === "Enter") {
      if (currentInput.trim()) {
        executeCommand(currentInput)
      } else {
        setHistory((prev) => [...prev, { type: "command", content: getCurrentPrompt() }])
      }
      setCurrentInput("")
    } else if (e.key === "ArrowUp") {
      e.preventDefault()
      if (commandHistory.length > 0) {
        const newIndex = historyIndex === -1 ? commandHistory.length - 1 : Math.max(0, historyIndex - 1)
        setHistoryIndex(newIndex)
        setCurrentInput(commandHistory[newIndex])
      }
    } else if (e.key === "ArrowDown") {
      e.preventDefault()
      if (commandHistory.length > 0 && historyIndex !== -1) {
        const newIndex = historyIndex + 1
        if (newIndex >= commandHistory.length) {
          setHistoryIndex(-1)
          setCurrentInput("")
        } else {
          setHistoryIndex(newIndex)
          setCurrentInput(commandHistory[newIndex])
        }
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
  }, [])

  if (vimMode && vimFile) {
    return (
      <div className="h-full bg-black text-white flex flex-col font-mono text-sm">
        {/* Vim Header */}
        <div className="px-2 py-1 bg-gray-800 text-center">
          <span className="text-green-400">VIM</span> - {vimFile.name} - {vimLines.length} lines
        </div>

        {/* Vim Content */}
        <div className="flex-1 p-2 overflow-auto">
          {vimLines.map((line, lineIndex) => (
            <div key={lineIndex} className="flex">
              <span className="text-gray-500 w-8 text-right pr-2">{lineIndex + 1}</span>
              <div className="flex-1 relative">
                {line.split('').map((char, charIndex) => (
                  <span
                    key={charIndex}
                    className={
                      vimCursor.line === lineIndex && vimCursor.col === charIndex
                        ? "bg-white text-black"
                        : ""
                    }
                  >
                    {char}
                  </span>
                ))}
                {vimCursor.line === lineIndex && vimCursor.col === line.length && (
                  <span className="bg-white text-black">_</span>
                )}
                {line.length === 0 && vimCursor.line === lineIndex && (
                  <span className="bg-white text-black">_</span>
                )}
              </div>
            </div>
          ))}
        </div>

        {/* Vim Status Bar */}
        <div className="px-2 py-1 bg-gray-800 flex justify-between">
          <div className="flex flex-col">
            <div className="text-gray-400 text-xs">
              Line {vimCursor.line + 1}, Col {vimCursor.col + 1} | Esc - Command | i - Insert
            </div>
            <div className="text-gray-400 text-xs">
              :w - Save | :q - Quit | :wq - Save & Quit
            </div>
          </div>
          <div className="flex items-center space-x-2">
            <span className="text-yellow-400">{vimStatus}</span>
            {vimCommand && (
              <span className="text-white">
                {vimCommand.length <= 3 ? vimCommand : vimCommand.slice(0, 3)}
              </span>
            )}
          </div>
        </div>

        {/* Hidden input to capture keystrokes */}
        <input
          ref={inputRef}
          type="text"
          className="absolute opacity-0 pointer-events-none"
          onKeyDown={handleKeyPress}
          autoFocus
        />
      </div>
    )
  }

  return (
    <div className="h-full bg-black text-white flex flex-col font-mono text-sm">
      {/* Terminal Content */}
      <div ref={terminalRef} className="flex-1 p-2 overflow-auto" onClick={() => inputRef.current?.focus()}>
        {history.map((line, index) => (
          <div
            key={index}
            className={`${line.type === "command" ? "text-white" : line.type === "error" ? "text-red-400" : "text-gray-300"
              }`}
          >
            {line.content}
          </div>
        ))}

        {/* Current Input Line */}
        <div className="flex">
          <span className="text-white">{getCurrentPrompt()} </span>
          <input
            ref={inputRef}
            type="text"
            value={currentInput}
            onChange={(e) => setCurrentInput(e.target.value)}
            onKeyDown={handleKeyPress}
            className="flex-1 bg-transparent text-white outline-none border-none"
            style={{ caretColor: "white" }}
          />
          <span className="animate-pulse">_</span>
        </div>
      </div>
    </div>
  )
}
