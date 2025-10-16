'use client'

import { useEffect, useState } from 'react'

export default function ClientWrapper({
  children,
}: {
  children: React.ReactNode
}) {
  const [isClient, setIsClient] = useState(false)

  useEffect(() => {
    setIsClient(true)
  }, [])

  if (!isClient) {
    return (
      <div className="flex h-screen bg-gray-100">
        <div className="w-64 bg-white shadow-lg">
          <div className="p-6">
            <h1 className="text-2xl font-bold text-gray-800">PipeOps</h1>
            <p className="text-sm text-gray-600">DevOps Dashboard</p>
          </div>
          <nav className="mt-6">
            {['Dashboard', 'Services', 'Deployments', 'Settings'].map((item) => (
              <div key={item} className="w-full flex items-center px-6 py-3 text-gray-600">
                {item}
              </div>
            ))}
          </nav>
        </div>
        <main className="flex-1 overflow-auto p-8">
          <div className="animate-pulse space-y-4">
            <div className="h-8 bg-gray-200 rounded w-1/4"></div>
            <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
              {[1, 2, 3, 4].map(i => (
                <div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
              ))}
            </div>
            <div className="bg-gray-200 h-64 rounded-lg"></div>
          </div>
        </main>
      </div>
    )
  }

  return <>{children}</>
}