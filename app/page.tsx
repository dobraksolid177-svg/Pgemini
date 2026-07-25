'use client'

import { useState } from 'react'
import { ImageUploader } from '@/components/image-uploader'
import { PromptResult } from '@/components/prompt-result'
import { History } from '@/components/history'
import { Settings } from '@/components/settings'
import { ThemeToggle } from '@/components/theme-toggle'
import { Tabs, TabsContent, TabsList, TabsTrigger } from '@/components/ui/tabs'
import { Sparkles, History as HistoryIcon, Settings as SettingsIcon } from 'lucide-react'

export default function Home() {
  const [analysisResult, setAnalysisResult] = useState(null)
  const [uploadedImage, setUploadedImage] = useState<string | null>(null)
  const [activeTab, setActiveTab] = useState('upload')

  return (
    <main className="min-h-screen bg-gradient-to-br from-gray-50 to-gray-100 dark:from-gray-900 dark:to-gray-950">
      <div className="container mx-auto px-4 py-8 max-w-7xl">
        {/* Header */}
        <header className="flex justify-between items-center mb-8">
          <div className="flex items-center gap-3">
            <div className="p-2 rounded-xl gradient-bg">
              <Sparkles className="w-6 h-6 text-white" />
            </div>
            <div>
              <h1 className="text-2xl font-bold bg-gradient-to-r from-blue-600 to-purple-600 bg-clip-text text-transparent">
                Image to Prompt
              </h1>
              <p className="text-sm text-gray-500 dark:text-gray-400">
                Gemini AI Image Analyzer
              </p>
            </div>
          </div>
          <div className="flex items-center gap-2">
            <ThemeToggle />
          </div>
        </header>

        {/* Tabs */}
        <Tabs value={activeTab} onValueChange={setActiveTab} className="space-y-6">
          <TabsList className="grid w-full grid-cols-3 max-w-md mx-auto bg-white/50 dark:bg-gray-800/50 backdrop-blur">
            <TabsTrigger value="upload" className="flex items-center gap-2">
              <Sparkles className="w-4 h-4" />
              Upload
            </TabsTrigger>
            <TabsTrigger value="history" className="flex items-center gap-2">
              <HistoryIcon className="w-4 h-4" />
              History
            </TabsTrigger>
            <TabsTrigger value="settings" className="flex items-center gap-2">
              <SettingsIcon className="w-4 h-4" />
              Settings
            </TabsTrigger>
          </TabsList>

          <TabsContent value="upload" className="space-y-6">
            <div className="grid lg:grid-cols-5 gap-6">
              <div className="lg:col-span-2">
                <ImageUploader
                  onImageUpload={setUploadedImage}
                  onAnalysisComplete={setAnalysisResult}
                />
              </div>
              <div className="lg:col-span-3">
                <PromptResult
                  result={analysisResult}
                  uploadedImage={uploadedImage}
                  onClear={() => {
                    setAnalysisResult(null)
                    setUploadedImage(null)
                  }}
                />
              </div>
            </div>
          </TabsContent>

          <TabsContent value="history">
            <History onSelectPrompt={(prompt) => {
              setAnalysisResult(prompt)
              setActiveTab('upload')
            }} />
          </TabsContent>

          <TabsContent value="settings">
            <Settings />
          </TabsContent>
        </Tabs>
      </div>
    </main>
  )
}