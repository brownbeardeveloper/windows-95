"use client"

export default function WhoAmI() {
  return (
    <div className="h-full bg-white flex flex-col">
      {/* Menu Bar */}
      <div className="bg-gray-300 border-b border-gray-400 px-2 py-1">
        <div className="flex space-x-4 text-xs">
          <button className="hover:bg-blue-600 hover:text-white px-2 py-1">File</button>
          <button className="hover:bg-blue-600 hover:text-white px-2 py-1">Edit</button>
          <button className="hover:bg-blue-600 hover:text-white px-2 py-1">View</button>
          <button className="hover:bg-blue-600 hover:text-white px-2 py-1">Help</button>
        </div>
      </div>

      {/* Content Area */}
      <div className="flex-1 p-4 overflow-auto">
        <div className="space-y-4">
          {/* Header Section */}
          <div className="flex items-center space-x-4 pb-4 border-b-2 border-gray-300">
            <div className="w-16 h-16 bg-blue-600 rounded-full flex items-center justify-center text-white text-2xl font-bold">
              DE
            </div>
            <div>
              <h1 className="text-lg font-bold">Developer</h1>
              <p className="text-sm text-gray-600">Full Stack Developer</p>
              <p className="text-xs text-gray-500">📍 Remote</p>
            </div>
          </div>

          {/* About Section */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold border-b border-gray-300 pb-1">About Me</h2>
            <p className="text-xs leading-relaxed">
              Passionate full-stack developer with 5+ years of experience building scalable web applications. I love
              creating efficient, user-friendly solutions and staying up-to-date with the latest technologies. When I'm
              not coding, you can find me exploring new frameworks or contributing to open-source projects.
            </p>
          </div>

          {/* Skills Section */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold border-b border-gray-300 pb-1">Technical Skills</h2>
            <div className="grid grid-cols-2 gap-2 text-xs">
              <div>
                <strong>Frontend:</strong>
                <ul className="ml-4 mt-1 space-y-0.5">
                  <li>• React, Vue.js, Angular</li>
                  <li>• TypeScript, JavaScript</li>
                  <li>• HTML5, CSS3, Sass</li>
                  <li>• Tailwind CSS, Bootstrap</li>
                </ul>
              </div>
              <div>
                <strong>Backend:</strong>
                <ul className="ml-4 mt-1 space-y-0.5">
                  <li>• Node.js, Express</li>
                  <li>• Python, Django, Flask</li>
                  <li>• PostgreSQL, MongoDB</li>
                  <li>• REST APIs, GraphQL</li>
                </ul>
              </div>
            </div>
          </div>

          {/* Experience Section */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold border-b border-gray-300 pb-1">Experience</h2>
            <div className="space-y-3 text-xs">
              <div>
                <div className="flex justify-between items-start">
                  <strong>Senior Full Stack Developer</strong>
                  <span className="text-gray-500">2022 - Present</span>
                </div>
                <p className="text-gray-600">TechCorp Inc.</p>
                <p className="mt-1">Led development of microservices architecture serving 100K+ users daily.</p>
              </div>

              <div>
                <div className="flex justify-between items-start">
                  <strong>Frontend Developer</strong>
                  <span className="text-gray-500">2020 - 2022</span>
                </div>
                <p className="text-gray-600">StartupXYZ</p>
                <p className="mt-1">Built responsive web applications using React and modern JavaScript.</p>
              </div>

              <div>
                <div className="flex justify-between items-start">
                  <strong>Junior Developer</strong>
                  <span className="text-gray-500">2019 - 2020</span>
                </div>
                <p className="text-gray-600">WebSolutions Ltd.</p>
                <p className="mt-1">Developed and maintained client websites using various web technologies.</p>
              </div>
            </div>
          </div>

          {/* Contact Section */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold border-b border-gray-300 pb-1">Contact Information</h2>
            <div className="text-xs space-y-1">
              <p>📧 developer@example.com</p>
              <p>🔗 linkedin.com/in/developer</p>
              <p>🐙 github.com/developer</p>
              <p>🌐 developer.dev</p>
              <p>📱 +1 (555) 123-4567</p>
            </div>
          </div>

          {/* Fun Facts */}
          <div className="space-y-2">
            <h2 className="text-sm font-bold border-b border-gray-300 pb-1">Fun Facts</h2>
            <div className="text-xs space-y-1">
              <p>☕ Coffee enthusiast - I run on caffeine and clean code</p>
              <p>🎮 Classic gaming fan - Hence this nostalgic portfolio!</p>
              <p>🏔️ Weekend hiker and nature photographer</p>
              <p>🤖 AI/ML hobbyist - Always experimenting with new models</p>
              <p>📚 Continuous learner - Currently exploring Rust and WebAssembly</p>
            </div>
          </div>
        </div>
      </div>

      {/* Status Bar */}
      <div className="h-5 bg-gray-300 border-t border-gray-400 px-2 flex items-center">
        <span className="text-xs">Last updated: December 2023</span>
      </div>
    </div>
  )
}
