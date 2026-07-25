'use client'

import { useState, useEffect } from 'react'
import { Switch } from '@/components/ui/switch'
import { Label } from '@/components/ui/label'
import { Select, SelectContent, SelectItem, SelectTrigger, SelectValue } from '@/components/ui/select'
import { PromptLength } from '@/types'

export function Settings() {
  const [settings, setSettings] = useState({
    language: 'id',
    promptLength: 'medium' as PromptLength,
    darkMode: true,
    autoSave: true,
  })

  useEffect(() => {
    const saved = localStorage.getItem('appSettings')
    if (saved) {
      setSettings(JSON.parse(saved))
    }
  }, [])

  const updateSettings = (key: string, value: any) => {
    const updated = { ...settings, [key]: value }
    setSettings(updated)
    localStorage.setItem('appSettings', JSON.stringify(updated))
  }

  return (
    <div className="max-w-2xl mx-auto space-y-8">
      <div>
        <h2 className="text-xl font-semibold">Pengaturan</h2>
        <p className="text-sm text-gray-500 dark:text-gray-400">
          Sesuaikan preferensi aplikasi Anda
        </p>
      </div>

      <div className="space-y-6">
        {/* Language */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur">
          <div>
            <Label>Bahasa Prompt</Label>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Bahasa utama untuk menghasilkan prompt
            </p>
          </div>
          <Select
            value={settings.language}
            onValueChange={(value) => updateSettings('language', value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="id">Indonesia</SelectItem>
              <SelectItem value="en">English</SelectItem>
              <SelectItem value="both">Keduanya</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Prompt Length */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur">
          <div>
            <Label>Panjang Prompt</Label>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Tingkat detail prompt yang dihasilkan
            </p>
          </div>
          <Select
            value={settings.promptLength}
            onValueChange={(value) => updateSettings('promptLength', value)}
          >
            <SelectTrigger className="w-40">
              <SelectValue />
            </SelectTrigger>
            <SelectContent>
              <SelectItem value="low">Detail Rendah</SelectItem>
              <SelectItem value="medium">Detail Sedang</SelectItem>
              <SelectItem value="high">Detail Tinggi</SelectItem>
              <SelectItem value="ultra">Ultra Detail</SelectItem>
            </SelectContent>
          </Select>
        </div>

        {/* Dark Mode */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur">
          <div>
            <Label>Mode Gelap</Label>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Tampilan gelap untuk kenyamanan mata
            </p>
          </div>
          <Switch
            checked={settings.darkMode}
            onCheckedChange={(checked) => updateSettings('darkMode', checked)}
          />
        </div>

        {/* Auto Save */}
        <div className="flex items-center justify-between p-4 rounded-xl bg-white/50 dark:bg-gray-800/50 backdrop-blur">
          <div>
            <Label>Simpan Otomatis</Label>
            <p className="text-sm text-gray-500 dark:text-gray-400">
              Simpan prompt ke riwayat secara otomatis
            </p>
          </div>
          <Switch
            checked={settings.autoSave}
            onCheckedChange={(checked) => updateSettings('autoSave', checked)}
          />
        </div>
      </div>
    </div>
  )
}