import type { Metadata } from 'next'
import './globals.css'

export const metadata: Metadata = {
  title: 'PipeOps Dashboard',
  description: 'DevOps Web-Based Dashboard for Microservices',
}

export default function RootLayout({
  children,
}: {
  children: React.ReactNode
}) {
  return (
    <html lang="en" suppressHydrationWarning>
      <body suppressHydrationWarning className="min-h-screen bg-gray-50">
        {children}
      </body>
    </html>
  )
}