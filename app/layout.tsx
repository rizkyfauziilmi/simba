import type { Metadata } from 'next'
import './globals.css'
import { ThemeProvider } from '@/components/theme-provider'
import { Toaster } from '@/components/ui/sonner'
import { TRPCReactProvider } from '@/trpc/client'
import { NuqsAdapter } from 'nuqs/adapters/next/app'
import { themes as themeConfig } from '@/constants/theme'

export const metadata: Metadata = {
  title: 'SIMBA - Sistem Informasi Manajemen Bustanul Arifin',
  description: 'Sistem Informasi Manajemen Bustanul Arifin',
}

export default function RootLayout({
  children,
}: Readonly<{
  children: React.ReactNode
}>) {
  return (
    <TRPCReactProvider>
      <html lang="en" suppressHydrationWarning>
        <body className="antialiased">
          <ThemeProvider
            defaultTheme="default-light"
            enableColorScheme
            themes={Object.values(themeConfig).flatMap(variant =>
              Object.values(variant.modes).map(mode => mode.value)
            )}
          >
            <NuqsAdapter>
              <main>{children}</main>
            </NuqsAdapter>
            <Toaster />
          </ThemeProvider>
        </body>
      </html>
    </TRPCReactProvider>
  )
}
