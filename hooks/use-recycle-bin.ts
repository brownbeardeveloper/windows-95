import { useState } from 'react'
import { BinItem, DEFAULT_BIN_ITEMS } from '@/lib/bin-data'

export function useRecycleBin() {
    const [recycleBinItems, setRecycleBinItems] = useState<BinItem[]>(DEFAULT_BIN_ITEMS)

    const emptyRecycleBin = () => {
        setRecycleBinItems([])
    }

    const restoreItems = (indices: number[]) => {
        setRecycleBinItems(prev =>
            prev.filter((_, index) => !indices.includes(index))
        )

        // In a real app, you'd restore the files to their original locations
        // For now, we just show a notification
        const restoredCount = indices.length
        setTimeout(() => {
            alert(`${restoredCount} item(s) have been restored to their original locations.`)
        }, 100)
    }

    const deleteItems = (indices: number[]) => {
        setRecycleBinItems(prev =>
            prev.filter((_, index) => !indices.includes(index))
        )

        // In a real app, these would be permanently deleted
        const deletedCount = indices.length
        setTimeout(() => {
            alert(`${deletedCount} item(s) have been permanently deleted.`)
        }, 100)
    }

    const addItem = (item: BinItem) => {
        setRecycleBinItems(prev => [item, ...prev])
    }

    return {
        recycleBinItems,
        emptyRecycleBin,
        restoreItems,
        deleteItems,
        addItem,
        hasItems: recycleBinItems.length > 0
    }
} 