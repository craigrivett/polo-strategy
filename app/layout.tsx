import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PoloIQ — Build Your Best Game',
  description: 'Polo team strategy and handicap management',
}

export default function RootLayout({ children }: { children: React.ReactNode }) {
  return (
    <html lang="en">
      <body className="min-h-screen bg-slate-900 text-slate-100 antialiased">
        {children}
      </body>
    </html>
  )
}
