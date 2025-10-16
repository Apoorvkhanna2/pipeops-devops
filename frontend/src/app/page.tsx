'use client'

import { useState } from 'react'
import ClientWrapper from '@/components/ClientWrapper'
import Sidebar from '@/components/Sidebar'
import Dashboard from '@/components/Dashboard'
import Services from '@/components/Services'
import Deployments from '@/components/Deployments'

export default function Home() {
  const [activeTab, setActiveTab] = useState('dashboard')

  const renderContent = () => {
    switch (activeTab) {
      case 'dashboard':
        return <Dashboard />
      case 'services':
        return <Services />
      case 'deployments':
        return <Deployments />
      default:
        return <Dashboard />
    }
  }

  return (
    <ClientWrapper>
      <div className="flex h-screen bg-gray-100">
        <Sidebar activeTab={activeTab} setActiveTab={setActiveTab} />
        <main className="flex-1 overflow-auto">
          {renderContent()}
        </main>
      </div>
    </ClientWrapper>
  )
}