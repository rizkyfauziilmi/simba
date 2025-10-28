'use client'

import { useState, useEffect } from 'react'
import { Card, CardContent, CardDescription, CardHeader, CardTitle } from '@/components/ui/card'
import { Check } from 'lucide-react'
import { useTheme } from 'next-themes'
import { themes } from '@/constants/theme'
import { Switch } from '@/components/ui/switch'
import { ThemePreview } from './theme-preview'

export default function ThemeSettings() {
  const { theme: currentTheme, setTheme } = useTheme()
  const [mounted, setMounted] = useState(false)

  useEffect(() => setMounted(true), [])

  if (!mounted) return null

  // Get current flavour (light/dark) from theme value
  const currentMode = currentTheme?.split('-').pop() || 'light'

  // Get current variant from theme value
  const currentVariant =
    Object.keys(themes).find(variant => currentTheme?.startsWith(variant)) || 'default'

  // Handler for switch
  const handleModeChange = (checked: boolean) => {
    const newMode = checked ? 'dark' : 'light'
    setTheme(`${currentVariant}-${newMode}`)
  }

  return (
    <div className="space-y-6">
      <div>
        <h1 className="text-3xl font-bold text-foreground mb-2">Pengaturan Tema</h1>
        <p className="text-muted-foreground">Pilih tema yang Anda sukai untuk aplikasi</p>
      </div>

      <Card>
        <CardHeader>
          <CardTitle>Pilih Tema</CardTitle>
          <CardDescription>Pilih tema sesuai preferensi Anda</CardDescription>
        </CardHeader>
        <CardContent>
          <div className="flex items-center gap-4 mb-4">
            <span className="text-sm">Terang</span>
            <Switch checked={currentMode === 'dark'} onCheckedChange={handleModeChange} />
            <span className="text-sm">Gelap</span>
          </div>
          <div className="grid grid-cols-1 md:grid-cols-2 gap-4">
            {Object.entries(themes).map(([variantKey, variant]) => {
              const isActive = currentVariant === variantKey
              return (
                <button
                  key={variantKey}
                  onClick={() => setTheme(`${variantKey}-${currentMode}`)}
                  className={`relative p-4 rounded-lg border-2 transition-all ${
                    isActive
                      ? 'border-primary bg-primary/5'
                      : 'border-border hover:border-primary/50'
                  }`}
                >
                  <div className="flex items-start justify-between mb-3">
                    <div>
                      <h3 className="font-semibold text-foreground text-left">{variant.name}</h3>
                      <p className="text-sm text-muted-foreground text-left">
                        {variant.description}
                      </p>
                    </div>
                    {isActive && (
                      <div className="flex-shrink-0">
                        <div className="flex items-center justify-center w-5 h-5 rounded-full bg-primary">
                          <Check className="w-3 h-3 text-primary-foreground" />
                        </div>
                      </div>
                    )}
                  </div>
                  <div className="flex flex-wrap gap-1 mt-2">
                    {/* Show 4 colors for light and 4 for dark */}
                    {/*{(
                      ["light", "dark"] as Array<keyof typeof variant.modes>
                    ).map((mode) =>
                      variant.modes[currentMode as "light" | "dark"].colors.map(
                        (color: string, idx: number) => (
                          <div
                            key={`${mode}-${idx}`}
                            style={{ backgroundColor: color }}
                            className="w-6 h-6 rounded-md border border-border"
                            title={`${variant.name} ${mode} ${idx + 1}`}
                          />
                        ),
                      ),
                    )}*/}
                    {variant.modes[currentMode as 'light' | 'dark'].colors.map((color, index) => (
                      <div
                        key={`${currentMode}-${index}`}
                        style={{ backgroundColor: color }}
                        className="w-6 h-6 rounded-md border border-border"
                        title={`${variant.name} ${currentMode} ${color}`}
                      />
                    ))}
                  </div>
                </button>
              )
            })}
          </div>
        </CardContent>
      </Card>

      <Card>
        <CardHeader>
          <CardTitle>Pratinjau</CardTitle>
          <CardDescription>Lihat tampilan tema yang dipilih</CardDescription>
        </CardHeader>
        <CardContent>
          <ThemePreview />
        </CardContent>
      </Card>
    </div>
  )
}
