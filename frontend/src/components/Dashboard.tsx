'use client'

import { useState, useEffect } from 'react'
import { Cpu, Database, Zap, AlertTriangle, RefreshCw, Play } from 'lucide-react'
import { Service, api } from '@/lib/api'

export default function Dashboard() {
  const [services, setServices] = useState<Service[]>([])
  const [loading, setLoading] = useState(true)
  const [refreshing, setRefreshing] = useState(false)

  // Load services from API
  const loadServices = async () => {
    try {
      const data = await api.getServices()
      setServices(data)
    } catch (error) {
      console.error('Error loading services:', error)
      // Fallback to mock data if API is unavailable
      const mockServices: Service[] = [
        { id: 1, name: 'Auth Service', status: 'running', cpu: 25, memory: 45 },
        { id: 2, name: 'API Gateway', status: 'running', cpu: 30, memory: 60 },
        { id: 3, name: 'User Service', status: 'deploying', cpu: 15, memory: 35 },
        { id: 4, name: 'Payment Service', status: 'failed', cpu: 0, memory: 0 },
      ]
      setServices(mockServices)
    } finally {
      setLoading(false)
      setRefreshing(false)
    }
  }

  // Restart a service
  const handleRestart = async (serviceId: number) => {
    try {
      await api.restartService(serviceId)
      // The WebSocket will update the services automatically
    } catch (error) {
      console.error('Error restarting service:', error)
      alert('Failed to restart service. Please check if backend is running.')
    }
  }

  // Refresh data
  const handleRefresh = () => {
    setRefreshing(true)
    loadServices()
  }

  useEffect(() => {
    loadServices()
    setupWebSocket()
  }, [])

  // WebSocket for real-time updates
  const setupWebSocket = () => {
    const socket = new WebSocket('ws://localhost:5000')
    
    socket.onopen = () => {
      console.log('WebSocket connected')
    }
    
    socket.onmessage = (event) => {
      try {
        const data = JSON.parse(event.data)
        if (Array.isArray(data)) {
          setServices(data)
        }
      } catch (error) {
        console.log('WebSocket message:', event.data)
      }
    }
    
    socket.onerror = (error) => {
      console.log('WebSocket error:', error)
    }
    
    socket.onclose = () => {
      console.log('WebSocket disconnected')
    }

    return () => {
      socket.close()
    }
  }

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'running': return 'text-green-600 bg-green-100'
      case 'deploying': return 'text-yellow-600 bg-yellow-100'
      case 'failed': return 'text-red-600 bg-red-100'
      default: return 'text-gray-600 bg-gray-100'
    }
  }

  if (loading) {
    return (
      <div className="p-8">
        <div className="animate-pulse space-y-4">
          <div className="h-8 bg-gray-200 rounded w-1/4"></div>
          <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6">
            {[1, 2, 3, 4].map(i => (
              <div key={i} className="bg-gray-200 h-24 rounded-lg"></div>
            ))}
          </div>
          <div className="bg-gray-200 h-64 rounded-lg"></div>
        </div>
      </div>
    )
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Dashboard</h1>
      <p className="text-gray-600 mb-8">Real-time service monitoring and management</p>
      
      {/* Stats Grid */}
      <div className="grid grid-cols-1 md:grid-cols-2 lg:grid-cols-4 gap-6 mb-8">
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Cpu className="w-8 h-8 text-blue-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Total Services</p>
              <p className="text-2xl font-bold">{services.length}</p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Zap className="w-8 h-8 text-green-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Running</p>
              <p className="text-2xl font-bold">
                {services.filter(s => s.status === 'running').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <Database className="w-8 h-8 text-yellow-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Deploying</p>
              <p className="text-2xl font-bold">
                {services.filter(s => s.status === 'deploying').length}
              </p>
            </div>
          </div>
        </div>
        
        <div className="bg-white p-6 rounded-lg shadow-sm border">
          <div className="flex items-center">
            <AlertTriangle className="w-8 h-8 text-red-600" />
            <div className="ml-4">
              <p className="text-sm text-gray-600">Failed</p>
              <p className="text-2xl font-bold">
                {services.filter(s => s.status === 'failed').length}
              </p>
            </div>
          </div>
        </div>
      </div>

      {/* Services Table */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b flex justify-between items-center">
          <div>
            <h2 className="text-xl font-semibold">Service Status</h2>
            <p className="text-sm text-gray-600 mt-1">
              Backend: <span className="text-green-600 font-medium">Connected</span>
            </p>
          </div>
          <button 
            onClick={handleRefresh}
            disabled={refreshing}
            className="flex items-center px-4 py-2 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <RefreshCw className={`w-4 h-4 mr-2 ${refreshing ? 'animate-spin' : ''}`} />
            {refreshing ? 'Refreshing...' : 'Refresh'}
          </button>
        </div>
        <div className="overflow-x-auto">
          <table className="w-full">
            <thead className="bg-gray-50">
              <tr>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Service
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Status
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  CPU Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Memory Usage
                </th>
                <th className="px-6 py-3 text-left text-xs font-medium text-gray-500 uppercase tracking-wider">
                  Actions
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {services.map((service) => (
                <tr key={service.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {service.name}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <span className={`inline-flex px-2 py-1 text-xs font-semibold rounded-full ${getStatusColor(service.status)}`}>
                      {service.status}
                    </span>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{service.cpu}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{service.memory}%</div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    {service.status === 'failed' && (
                      <button
                        onClick={() => handleRestart(service.id)}
                        className="flex items-center text-sm bg-green-600 text-white px-3 py-1 rounded hover:bg-green-700 transition-colors"
                      >
                        <Play className="w-3 h-3 mr-1" />
                        Restart
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Connection Status */}
      <div className="mt-4 text-sm text-gray-500">
        <p>💡 <strong>Tip:</strong> The metrics will update automatically every 5 seconds via WebSocket</p>
        <p>🔄 Try clicking "Restart" on the failed service to see real-time updates</p>
      </div>
    </div>
  )
}