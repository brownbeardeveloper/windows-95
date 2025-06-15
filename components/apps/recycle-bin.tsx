"use client"

import { useState } from 'react'
import { BinItem } from '@/lib/bin-data'

interface RecycleBinProps {
  items?: BinItem[]
  onEmptyBin?: () => void
  onRestoreItems?: (indices: number[]) => void
  onDeleteItems?: (indices: number[]) => void
}

export default function RecycleBin({
  items = [],
  onEmptyBin,
  onRestoreItems,
  onDeleteItems
}: RecycleBinProps) {
  const [selectedItems, setSelectedItems] = useState<number[]>([])

  // Use passed items or default items
  const deletedItems = items !== undefined && items !== null
    ? items
    : [
      { name: "Old Document.txt", icon: "📄", dateDeleted: "12/15/2023", originalLocation: "C:\\My Documents" },
      { name: "Photo.bmp", icon: "🖼️", dateDeleted: "12/14/2023", originalLocation: "C:\\My Documents\\Pictures" },
      {
        name: "Program Files",
        icon: "📁",
        dateDeleted: "12/13/2023",
        originalLocation: "C:\\Program Files\\OldApp",
      },
      // Add more items for testing scroll
      ...Array.from({ length: 20 }, (_, i) => ({
        name: `Test File ${i + 4}.txt`,
        icon: "📄",
        dateDeleted: "12/12/2023",
        originalLocation: `C:\\Test\\Folder${i + 1}`,
      })),
    ]

  const toggleItemSelection = (index: number) => {
    setSelectedItems(prev =>
      prev.includes(index)
        ? prev.filter(i => i !== index)
        : [...prev, index]
    )
  }

  const handleEmptyBin = () => {
    if (deletedItems.length === 0) return

    const confirmEmpty = window.confirm(
      `Are you sure you want to permanently delete all ${deletedItems.length} items in the Recycle Bin?\n\nThis action cannot be undone.`
    )

    if (confirmEmpty) {
      onEmptyBin?.()
      setSelectedItems([])
    }
  }

  const handleRestore = () => {
    if (selectedItems.length === 0) return

    const itemNames = selectedItems.map(index => deletedItems[index]?.name).filter(Boolean)
    const confirmRestore = window.confirm(
      `Restore ${selectedItems.length} item(s)?\n\n${itemNames.slice(0, 3).join('\n')}${itemNames.length > 3 ? '\n...' : ''}`
    )

    if (confirmRestore) {
      onRestoreItems?.(selectedItems)
      setSelectedItems([])
    }
  }

  const handleDelete = () => {
    if (selectedItems.length === 0) return

    const itemNames = selectedItems.map(index => deletedItems[index]?.name).filter(Boolean)
    const confirmDelete = window.confirm(
      `Are you sure you want to permanently delete ${selectedItems.length} item(s)?\n\n${itemNames.slice(0, 3).join('\n')}${itemNames.length > 3 ? '\n...' : ''}\n\nThis action cannot be undone.`
    )

    if (confirmDelete) {
      onDeleteItems?.(selectedItems)
      setSelectedItems([])
    }
  }

  const selectAll = () => {
    setSelectedItems(deletedItems.map((_, index) => index))
  }

  const clearSelection = () => {
    setSelectedItems([])
  }

  return (
    <div className="h-full bg-gray-300 flex flex-col font-sans">
      {/* Menu Bar */}
      <div className="bg-gray-300 border-b border-gray-500 px-1 py-1">
        <div className="flex space-x-4 text-xs">
          <div className="relative group">
            <button className="hover:bg-blue-600 hover:text-white px-2 py-1 rounded-none">
              <span className="underline">F</span>ile
            </button>
            {/* File menu dropdown could be implemented here */}
          </div>
          <div className="relative group">
            <button className="hover:bg-blue-600 hover:text-white px-2 py-1 rounded-none">
              <span className="underline">E</span>dit
            </button>
            {/* Edit menu with Select All, etc. could be implemented here */}
          </div>
          <button className="hover:bg-blue-600 hover:text-white px-2 py-1 rounded-none">
            <span className="underline">V</span>iew
          </button>
          <button className="hover:bg-blue-600 hover:text-white px-2 py-1 rounded-none">
            <span className="underline">H</span>elp
          </button>
        </div>
      </div>

      {/* Toolbar */}
      <div className="bg-gray-300 border-b border-gray-500 px-2 py-2 flex items-center space-x-1">
        <button
          className={`px-3 py-1 text-xs bg-gray-300 border-2 border-white border-r-gray-500 border-b-gray-500 hover:bg-gray-200 active:border-gray-500 active:border-r-white active:border-b-white font-sans ${selectedItems.length === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
          disabled={selectedItems.length === 0}
          onClick={handleRestore}
        >
          Restore
        </button>
        <button
          className={`px-3 py-1 text-xs bg-gray-300 border-2 border-white border-r-gray-500 border-b-gray-500 hover:bg-gray-200 active:border-gray-500 active:border-r-white active:border-b-white font-sans ${selectedItems.length === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
          disabled={selectedItems.length === 0}
          onClick={handleDelete}
        >
          Delete
        </button>
        <button
          className={`px-3 py-1 text-xs bg-gray-300 border-2 border-white border-r-gray-500 border-b-gray-500 hover:bg-gray-200 active:border-gray-500 active:border-r-white active:border-b-white font-sans ${deletedItems.length === 0 ? 'opacity-50 cursor-not-allowed' : 'cursor-pointer'
            }`}
          disabled={deletedItems.length === 0}
          onClick={handleEmptyBin}
        >
          Empty Recycle Bin
        </button>

        {/* Additional helper buttons */}
        {deletedItems.length > 0 && (
          <>
            <div className="border-l border-gray-500 h-4 mx-2"></div>
            <button
              className="px-2 py-1 text-xs bg-gray-300 border-2 border-white border-r-gray-500 border-b-gray-500 hover:bg-gray-200 active:border-gray-500 active:border-r-white active:border-b-white font-sans cursor-pointer"
              onClick={selectAll}
            >
              Select All
            </button>
            {selectedItems.length > 0 && (
              <button
                className="px-2 py-1 text-xs bg-gray-300 border-2 border-white border-r-gray-500 border-b-gray-500 hover:bg-gray-200 active:border-gray-500 active:border-r-white active:border-b-white font-sans cursor-pointer"
                onClick={clearSelection}
              >
                Clear Selection
              </button>
            )}
          </>
        )}
      </div>

      {/* Content Area */}
      <div className="flex-1 overflow-auto bg-white border-2 border-gray-500 border-t-gray-400 border-l-gray-400 m-2">
        {deletedItems.length === 0 ? (
          <div className="flex flex-col items-center justify-center h-32 text-gray-500 p-4">
            <div className="text-4xl mb-2">🗑️</div>
            <span className="text-sm font-sans">Recycle Bin is empty</span>
            <span className="text-xs font-sans mt-1 text-gray-400">
              Items you delete will be moved here until you empty the Recycle Bin.
            </span>
          </div>
        ) : (
          <div>
            {/* Column Headers */}
            <div className="flex bg-gray-300 border-b border-gray-500 sticky top-0">
              <div className="w-48 px-2 py-1 text-xs font-bold border-r border-gray-500 bg-gray-300 border-2 border-white border-r-gray-500 border-b-gray-500">
                Name
              </div>
              <div className="w-32 px-2 py-1 text-xs font-bold border-r border-gray-500 bg-gray-300 border-2 border-white border-r-gray-500 border-b-gray-500 border-l-gray-500">
                Date Deleted
              </div>
              <div className="flex-1 px-2 py-1 text-xs font-bold bg-gray-300 border-2 border-white border-r-gray-500 border-b-gray-500 border-l-gray-500">
                Original Location
              </div>
            </div>

            {/* Items */}
            <div className="bg-white">
              {deletedItems.map((item, index) => (
                <div
                  key={index}
                  className={`flex items-center text-xs cursor-pointer border-b border-gray-200 ${selectedItems.includes(index)
                    ? 'bg-blue-600 text-white'
                    : 'hover:bg-blue-600 hover:text-white'
                    }`}
                  onClick={() => toggleItemSelection(index)}
                  onDoubleClick={() => {
                    // Double-click to restore item
                    if (window.confirm(`Restore "${item.name}"?`)) {
                      onRestoreItems?.([index])
                    }
                  }}
                >
                  <div className="w-48 flex items-center space-x-2 px-2 py-1">
                    <span className="text-sm">{item.icon}</span>
                    <span className="font-sans">{item.name}</span>
                  </div>
                  <div className="w-32 px-2 py-1 font-sans">{item.dateDeleted}</div>
                  <div className="flex-1 px-2 py-1 font-sans">{item.originalLocation}</div>
                </div>
              ))}
            </div>
          </div>
        )}
      </div>

      {/* Status Bar */}
      <div className="h-5 bg-gray-300 border-t-2 border-white border-r-2 border-r-gray-500 border-b-2 border-b-gray-500 border-l-2 border-l-white px-2 flex items-center">
        <div className="text-xs font-sans bg-gray-300 border border-gray-500 border-t-gray-400 border-l-gray-400 px-1">
          {deletedItems.length} object(s)
        </div>
        {selectedItems.length > 0 && (
          <div className="text-xs font-sans bg-gray-300 border border-gray-500 border-t-gray-400 border-l-gray-400 px-1 ml-2">
            {selectedItems.length} selected
          </div>
        )}
      </div>
    </div>
  )
}
