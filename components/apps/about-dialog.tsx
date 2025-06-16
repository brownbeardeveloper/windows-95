export default function AboutDialog() {
  return (
    <div className="p-4 bg-gray-300 h-full flex flex-col items-center justify-center text-center">
      <div className="mb-4">
        <div className="w-16 h-16 bg-blue-600 rounded-lg flex items-center justify-center text-white text-2xl font-bold mb-2">
          W95
        </div>
      </div>

      <h2 className="text-lg font-bold mb-2">Retro Desktop</h2>
      <p className="text-sm text-gray-600 mb-4">
        Version 1.0.0
        <br />
        Open Source Project
      </p>

      <div className="text-xs text-gray-500 mb-4">
        This product is licensed to:
        <br />
        <strong>Registered User</strong>
      </div>

      <div className="border-t border-gray-400 pt-4 text-xs text-gray-500">
        Built with React & Next.js
        <br />A nostalgic recreation of classic desktop
      </div>

      <div className="mt-4">
        <button className="px-4 py-1 bg-gray-300 border-2 border-white border-r-gray-400 border-b-gray-400 hover:bg-gray-200 text-sm">
          OK
        </button>
      </div>
    </div>
  )
}
