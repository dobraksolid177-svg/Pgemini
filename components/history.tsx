'use client'

import { useState, useEffect } from 'react'
import { Search, Trash2, Clock } from 'lucide-react'
import { HistoryItem } from '@/types'

interface HistoryProps {
  onSelectPrompt: (prompt: any) => void
}

export function History({ onSelectPrompt }: HistoryProps) {
  const [history, setHistory] = useState<HistoryItem[]>([])
  const [search, setSearch] = useState('')

  useEffect(() => {
    // Load history from localStorage
    const saved = localStorage.getItem('promptHistory')
    if (saved) {
      setHistory(JSON.parse(saved))
    }
  }, [])

  const deleteItem = (id: string) => {
    const updated = history.filter(item => item.id !== id)
    setHistory(updated)
    localStorage.setItem('promptHistory', JSON.stringify(updated))
  }

  const clearAll = () => {
    setHistory([])
    localStorage.setItem('promptHistory', JSON.stringify([]))
  }

  const filteredHistory = history.filter(item =>
    item.imageName.toLowerCase().includes(search.toLowerCase()) ||
    item.prompt.summary.toLowerCase().includes(search.toLowerCase())
  )

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <h2 className="text-xl font-semibold">Riwayat Prompt</h2>
        {history.length > 0 && (
          <button
            onClick={clearAll}
            className="text-sm text-red-500 hover:text-red-600 transition-colors"
          >
            Hapus Semua
          </button>
        )}
      </div>

      {/* Search */}
      <div className="relative">
        <Search className="absolute left-3 top-1/2 -translate-y-1/2 w-4 h-4 text-gray-400" />
        <input
          type="text"
          placeholder="Cari riwayat..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
          className="w-full pl-10 pr-4 py-2 rounded-lg border border-gray-200 dark:border-gray-700 bg-white dark:bg-gray-800 focus:ring-2 focus:ring-blue-500 focus:border-transparent transition-shadow"
        />
      </div>

      {/* History List */}
      {filteredHistory.length === 0 ? (
        <div className="flex flex-col items-center justify-center py-12 text-center">
          <Clock className="w-16 h-16 text-gray-300 dark:text-gray-600 mb-4" />
          <h3 className="text-lg font-semibold">Belum Ada Riwayat</h3>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Prompt yang dihasilkan akan muncul di sini
          </p>
        </div>
      ) : (
        <div className="space-y-3">
          {filteredHistory.map((item) => (
            <div
              key={item.id}
              className="p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur border border-gray-200 dark:border-gray-700 hover:border-blue-400 transition-colors cursor-pointer group"
              onClick={() => onSelectPrompt(item.prompt)}
            >
              <div className="flex items-start justify-between gap-4">
                <div className="flex-1 min-w-0">
                  <h4 className="text-sm font-medium truncate">{item.imageName}</h4>
                  <p className="text-sm text-gray-500 dark:text-gray-400 mt-1 line-clamp-2">
                    {item.prompt.summary}
                  </p>
                  <p className="text-xs text-gray-400 mt-2">
                    {new Date(item.timestamp).toLocaleString('id-ID')}
                  </p>
                </div>
                <button
                  onClick={(e) => {
                    e.stopPropagation()
                    deleteItem(item.id)
                  }}
                  className="p-2 rounded-lg opacity-0 group-hover:opacity-100 hover:bg-red-100 dark:hover:bg-red-900/30 text-red-500 transition-all"
                >
                  <Trash2 className="w-4 h-4" />
                </button>
              </div>
            </div>
          ))}
        </div>
      )}
    </div>
  )
}