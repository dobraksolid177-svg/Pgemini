'use client'

import { useState, useCallback } from 'react'
import { Upload, X, Image as ImageIcon, Loader2 } from 'lucide-react'
import { cn } from '@/lib/utils'
import { useToast } from '@/components/ui/use-toast'

interface ImageUploaderProps {
  onImageUpload: (image: string) => void
  onAnalysisComplete: (result: any) => void
}

export function ImageUploader({ onImageUpload, onAnalysisComplete }: ImageUploaderProps) {
  const [isDragging, setIsDragging] = useState(false)
  const [isLoading, setIsLoading] = useState(false)
  const [preview, setPreview] = useState<string | null>(null)
  const [progress, setProgress] = useState(0)
  const { toast } = useToast()

  const handleFile = useCallback(async (file: File) => {
    // Validate file type
    const validTypes = ['image/jpeg', 'image/jpg', 'image/png', 'image/webp']
    if (!validTypes.includes(file.type)) {
      toast({
        title: 'Format tidak didukung',
        description: 'Silakan upload file JPG, JPEG, PNG, atau WEBP',
        variant: 'destructive',
      })
      return
    }

    // Validate file size (20MB)
    if (file.size > 20 * 1024 * 1024) {
      toast({
        title: 'File terlalu besar',
        description: 'Maksimal ukuran file adalah 20MB',
        variant: 'destructive',
      })
      return
    }

    try {
      setIsLoading(true)
      setProgress(0)

      // Read file as base64
      const reader = new FileReader()
      reader.onprogress = (e) => {
        if (e.total) {
          setProgress((e.loaded / e.total) * 50)
        }
      }
      
      const base64 = await new Promise<string>((resolve, reject) => {
        reader.onload = () => resolve(reader.result as string)
        reader.onerror = reject
        reader.readAsDataURL(file)
      })

      setProgress(60)
      setPreview(base64)
      onImageUpload(base64)

      // Send to API
      setProgress(70)
      const response = await fetch('/api/analyze', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          image: base64,
        }),
      })

      setProgress(90)

      if (!response.ok) {
        throw new Error('Failed to analyze image')
      }

      const result = await response.json()
      setProgress(100)
      
      onAnalysisComplete(result)
      
      toast({
        title: 'Analisis selesai!',
        description: 'Prompt berhasil dihasilkan dari gambar',
      })
    } catch (error) {
      console.error('Error:', error)
      toast({
        title: 'Gagal menganalisis gambar',
        description: 'Terjadi kesalahan saat memproses gambar',
        variant: 'destructive',
      })
    } finally {
      setIsLoading(false)
      setProgress(0)
    }
  }, [onImageUpload, onAnalysisComplete, toast])

  const handleDrop = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
    
    const files = e.dataTransfer.files
    if (files.length > 0) {
      handleFile(files[0])
    }
  }, [handleFile])

  const handleDragOver = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(true)
  }, [])

  const handleDragLeave = useCallback((e: React.DragEvent) => {
    e.preventDefault()
    setIsDragging(false)
  }, [])

  const handleFileInput = useCallback((e: React.ChangeEvent<HTMLInputElement>) => {
    const files = e.target.files
    if (files && files.length > 0) {
      handleFile(files[0])
    }
  }, [handleFile])

  const clearImage = useCallback(() => {
    setPreview(null)
    onImageUpload('')
  }, [onImageUpload])

  return (
    <div className="space-y-4">
      {!preview ? (
        <div
          className={cn(
            'relative rounded-2xl border-2 border-dashed transition-all duration-300',
            'min-h-[400px] flex flex-col items-center justify-center p-8',
            'bg-white/50 dark:bg-gray-800/50 backdrop-blur',
            isDragging
              ? 'border-blue-500 bg-blue-50/50 dark:bg-blue-900/20'
              : 'border-gray-300 dark:border-gray-600 hover:border-blue-400',
            isLoading && 'opacity-50 pointer-events-none'
          )}
          onDrop={handleDrop}
          onDragOver={handleDragOver}
          onDragLeave={handleDragLeave}
        >
          <div className="text-center space-y-4">
            <div className="p-4 rounded-full bg-gradient-to-br from-blue-500 to-purple-500 w-20 h-20 mx-auto flex items-center justify-center">
              <Upload className="w-10 h-10 text-white" />
            </div>
            <div>
              <h3 className="text-lg font-semibold">Upload Gambar</h3>
              <p className="text-sm text-gray-500 dark:text-gray-400 mt-1">
                Drag & drop atau klik untuk memilih
              </p>
            </div>
            <div className="flex flex-wrap gap-2 justify-center text-xs text-gray-400">
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">JPG</span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">JPEG</span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">PNG</span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">WEBP</span>
              <span className="px-2 py-1 bg-gray-100 dark:bg-gray-700 rounded">Max 20MB</span>
            </div>
            <input
              type="file"
              className="hidden"
              accept="image/jpeg,image/jpg,image/png,image/webp"
              onChange={handleFileInput}
              id="file-upload"
              disabled={isLoading}
            />
            <label
              htmlFor="file-upload"
              className={cn(
                'inline-flex items-center gap-2 px-6 py-2 rounded-lg cursor-pointer transition-all',
                'bg-gradient-to-r from-blue-600 to-purple-600 text-white',
                'hover:shadow-lg hover:scale-105 transform',
                isLoading && 'opacity-50 cursor-not-allowed'
              )}
            >
              {isLoading ? (
                <>
                  <Loader2 className="w-4 h-4 animate-spin" />
                  Memproses...
                </>
              ) : (
                <>
                  <ImageIcon className="w-4 h-4" />
                  Pilih Gambar
                </>
              )}
            </label>
          </div>
        </div>
      ) : (
        <div className="relative rounded-2xl overflow-hidden bg-white/50 dark:bg-gray-800/50 backdrop-blur">
          <div className="relative">
            <img
              src={preview}
              alt="Preview"
              className="w-full h-auto max-h-[500px] object-contain"
            />
            <button
              onClick={clearImage}
              className="absolute top-2 right-2 p-2 rounded-full bg-black/50 text-white hover:bg-black/70 transition-colors"
            >
              <X className="w-4 h-4" />
            </button>
            {isLoading && (
              <div className="absolute inset-0 bg-black/50 flex flex-col items-center justify-center">
                <Loader2 className="w-12 h-12 text-white animate-spin mb-4" />
                <div className="w-64 bg-white/20 rounded-full h-2">
                  <div
                    className="h-full rounded-full bg-gradient-to-r from-blue-500 to-purple-500 transition-all duration-300"
                    style={{ width: `${progress}%` }}
                  />
                </div>
                <p className="text-white text-sm mt-2">
                  Menganalisis gambar... {Math.round(progress)}%
                </p>
              </div>
            )}
          </div>
        </div>
      )}
    </div>
  )
}