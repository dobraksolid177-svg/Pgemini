'use client'

import { useState } from 'react'
import { Copy, Download, RefreshCw, Trash2, Check, FileText, FileJson } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'

interface PromptResultProps {
  result: any
  uploadedImage: string | null
  onClear: () => void
}

export function PromptResult({ result, uploadedImage, onClear }: PromptResultProps) {
  const [copied, setCopied] = useState<'id' | 'en' | null>(null)
  const { toast } = useToast()

  if (!result) {
    return (
      <div className="flex flex-col items-center justify-center min-h-[400px] rounded-2xl bg-white/50 dark:bg-gray-800/50 backdrop-blur border border-gray-200 dark:border-gray-700 p-8">
        <div className="text-center space-y-4">
          <div className="p-4 rounded-full bg-gray-100 dark:bg-gray-700 w-20 h-20 mx-auto flex items-center justify-center">
            <FileText className="w-10 h-10 text-gray-400" />
          </div>
          <div>
            <h3 className="text-lg font-semibold">Belum Ada Hasil</h3>
            <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
              Upload gambar untuk menganalisis dan menghasilkan prompt
            </p>
          </div>
        </div>
      </div>
    )
  }

  const copyToClipboard = (text: string, type: 'id' | 'en') => {
    navigator.clipboard.writeText(text)
    setCopied(type)
    toast({
      title: 'Berhasil disalin!',
      description: 'Prompt telah disalin ke clipboard',
    })
    setTimeout(() => setCopied(null), 2000)
  }

  const downloadTXT = () => {
    const content = `
=== PROMPT INDONESIA ===
${result.indonesian}

=== PROMPT ENGLISH ===
${result.english}

=== KEYWORDS ===
${result.keywords.join(', ')}

=== TAGS ===
${result.tags.join(', ')}

=== STYLE ===
${result.style}

=== NEGATIVE PROMPT ===
${result.negativePrompt}

=== SUMMARY ===
${result.summary}

=== DETAILS ===
Objects: ${result.details.objects.join(', ')}
People: ${result.details.people.join(', ')}
Clothing: ${result.details.clothing.join(', ')}
Expressions: ${result.details.expressions.join(', ')}
Poses: ${result.details.poses.join(', ')}
Background: ${result.details.background}
Lighting: ${result.details.lighting}
Colors: ${result.details.colors.join(', ')}
Camera: ${result.details.camera}
Angle: ${result.details.angle}
Quality: ${result.details.quality}
Photo Style: ${result.details.photoStyle}
Atmosphere: ${result.details.atmosphere}
Small Details: ${result.details.smallDetails.join(', ')}
    `.trim()

    const blob = new Blob([content], { type: 'text/plain' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `prompt-${Date.now()}.txt`
    a.click()
    URL.revokeObjectURL(url)
  }

  const downloadJSON = () => {
    const json = JSON.stringify(result, null, 2)
    const blob = new Blob([json], { type: 'application/json' })
    const url = URL.createObjectURL(blob)
    const a = document.createElement('a')
    a.href = url
    a.download = `prompt-${Date.now()}.json`
    a.click()
    URL.revokeObjectURL(url)
  }

  return (
    <div className="space-y-6">
      {/* Header */}
      <div className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h2 className="text-xl font-semibold">Hasil Analisis</h2>
          <p className="text-sm text-gray-500 dark:text-gray-400">
            Prompt siap digunakan untuk Gemini AI
          </p>
        </div>
        <div className="flex flex-wrap gap-2">
          <button
            onClick={onClear}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-red-100 dark:bg-red-900/30 text-red-600 dark:text-red-400 hover:bg-red-200 dark:hover:bg-red-900/50 transition-colors"
          >
            <Trash2 className="w-4 h-4" />
            Clear
          </button>
          <button
            onClick={() => window.location.reload()}
            className="flex items-center gap-2 px-3 py-1.5 rounded-lg bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400 hover:bg-blue-200 dark:hover:bg-blue-900/50 transition-colors"
          >
            <RefreshCw className="w-4 h-4" />
            Analisis Ulang
          </button>
        </div>
      </div>

      {/* Summary */}
      <div className="p-4 rounded-xl bg-gradient-to-r from-blue-500/10 to-purple-500/10 border border-blue-200/20 dark:border-blue-700/20">
        <h3 className="text-sm font-medium text-gray-500 dark:text-gray-400">Ringkasan</h3>
        <p className="mt-1 text-gray-800 dark:text-gray-200">{result.summary}</p>
      </div>

      {/* Prompts */}
      <Tabs defaultValue="indonesian" className="w-full">
        <TabsList className="grid w-full grid-cols-2">
          <TabsTrigger value="indonesian">Bahasa Indonesia</TabsTrigger>
          <TabsTrigger value="english">English</TabsTrigger>
        </TabsList>
        <TabsContent value="indonesian" className="mt-4">
          <div className="relative p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={() => copyToClipboard(result.indonesian, 'id')}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  copied === 'id'
                    ? 'bg-green-500 text-white'
                    : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                )}
              >
                {copied === 'id' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-sm leading-relaxed pr-16">{result.indonesian}</p>
          </div>
        </TabsContent>
        <TabsContent value="english" className="mt-4">
          <div className="relative p-4 rounded-xl bg-gray-50 dark:bg-gray-800/50 border border-gray-200 dark:border-gray-700">
            <div className="absolute top-2 right-2 flex gap-2">
              <button
                onClick={() => copyToClipboard(result.english, 'en')}
                className={cn(
                  'p-2 rounded-lg transition-colors',
                  copied === 'en'
                    ? 'bg-green-500 text-white'
                    : 'bg-white dark:bg-gray-700 hover:bg-gray-100 dark:hover:bg-gray-600'
                )}
              >
                {copied === 'en' ? <Check className="w-4 h-4" /> : <Copy className="w-4 h-4" />}
              </button>
            </div>
            <p className="text-sm leading-relaxed pr-16">{result.english}</p>
          </div>
        </TabsContent>
      </Tabs>

      {/* Download Buttons */}
      <div className="flex flex-wrap gap-2">
        <button
          onClick={downloadTXT}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <Download className="w-4 h-4" />
          Download TXT
        </button>
        <button
          onClick={downloadJSON}
          className="flex items-center gap-2 px-4 py-2 rounded-lg bg-gray-100 dark:bg-gray-700 hover:bg-gray-200 dark:hover:bg-gray-600 transition-colors"
        >
          <FileJson className="w-4 h-4" />
          Download JSON
        </button>
      </div>

      {/* Details */}
      <div className="space-y-4">
        <h3 className="text-sm font-semibold text-gray-500 dark:text-gray-400">Detail Analisis</h3>
        <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <h4 className="text-xs font-medium text-gray-400">Objects</h4>
            <p className="text-sm">{result.details.objects.join(', ')}</p>
          </div>
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <h4 className="text-xs font-medium text-gray-400">People</h4>
            <p className="text-sm">{result.details.people.join(', ')}</p>
          </div>
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <h4 className="text-xs font-medium text-gray-400">Style</h4>
            <p className="text-sm">{result.style}</p>
          </div>
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <h4 className="text-xs font-medium text-gray-400">Negative Prompt</h4>
            <p className="text-sm">{result.negativePrompt}</p>
          </div>
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <h4 className="text-xs font-medium text-gray-400">Keywords</h4>
            <div className="flex flex-wrap gap-1 mt-1">
              {result.keywords.map((keyword: string, i: number) => (
                <span key={i} className="px-2 py-0.5 text-xs rounded bg-blue-100 dark:bg-blue-900/30 text-blue-600 dark:text-blue-400">
                  {keyword}
                </span>
              ))}
            </div>
          </div>
          <div className="p-3 rounded-lg bg-gray-50 dark:bg-gray-800/50">
            <h4 className="text-xs font-medium text-gray-400">Tags</h4>
            <div className="flex flex-wrap gap-1 mt-1">
              {result.tags.map((tag: string, i: number) => (
                <span key={i} className="px-2 py-0.5 text-xs rounded bg-purple-100 dark:bg-purple-900/30 text-purple-600 dark:text-purple-400">
                  {tag}
                </span>
              ))}
            </div>
          </div>
        </div>
      </div>
    </div>
  )
}