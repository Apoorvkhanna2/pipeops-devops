'use client'

import { useState } from 'react'
import { Upload, Play, Clock, CheckCircle } from 'lucide-react'

export default function Deployments() {
  const [serviceName, setServiceName] = useState('')
  const [gitRepo, setGitRepo] = useState('')
  const [deploying, setDeploying] = useState(false)

  const handleDeploy = async (e: React.FormEvent) => {
    e.preventDefault()
    setDeploying(true)
    
    // Simulate deployment process
    setTimeout(() => {
      setDeploying(false)
      setServiceName('')
      setGitRepo('')
      alert('Deployment started successfully!')
    }, 3000)
  }

  const deploymentHistory = [
    { id: 1, service: 'Auth Service', status: 'success', time: '2 minutes ago' },
    { id: 2, service: 'User Service', status: 'deploying', time: '5 minutes ago' },
    { id: 3, service: 'Payment Service', status: 'failed', time: '1 hour ago' },
  ]

  const getStatusIcon = (status: string) => {
    switch (status) {
      case 'success': return <CheckCircle className="w-5 h-5 text-green-600" />
      case 'deploying': return <Clock className="w-5 h-5 text-yellow-600 animate-spin" />
      case 'failed': return <Play className="w-5 h-5 text-red-600" />
      default: return <Clock className="w-5 h-5 text-gray-600" />
    }
  }

  return (
    <div className="p-8">
      <h1 className="text-3xl font-bold text-gray-800 mb-2">Deployments</h1>
      <p className="text-gray-600 mb-8">Deploy and manage your microservices</p>

      {/* Deployment Form */}
      <div className="bg-white rounded-lg shadow-sm border p-6 mb-8">
        <h2 className="text-xl font-semibold mb-4">Deploy New Service</h2>
        <form onSubmit={handleDeploy} className="space-y-4">
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Service Name
            </label>
            <input
              type="text"
              value={serviceName}
              onChange={(e) => setServiceName(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="e.g., Notification Service"
              required
            />
          </div>
          <div>
            <label className="block text-sm font-medium text-gray-700 mb-2">
              Git Repository
            </label>
            <input
              type="url"
              value={gitRepo}
              onChange={(e) => setGitRepo(e.target.value)}
              className="w-full px-3 py-2 border border-gray-300 rounded-md focus:outline-none focus:ring-2 focus:ring-blue-500"
              placeholder="https://github.com/username/repo.git"
              required
            />
          </div>
          <button
            type="submit"
            disabled={deploying}
            className="flex items-center px-6 py-3 bg-blue-600 text-white rounded-lg hover:bg-blue-700 transition-colors disabled:opacity-50"
          >
            <Upload className="w-5 h-5 mr-2" />
            {deploying ? 'Deploying...' : 'Deploy Service'}
          </button>
        </form>
      </div>

      {/* Deployment History */}
      <div className="bg-white rounded-lg shadow-sm border">
        <div className="p-6 border-b">
          <h2 className="text-xl font-semibold">Deployment History</h2>
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
                  Time
                </th>
              </tr>
            </thead>
            <tbody className="bg-white divide-y divide-gray-200">
              {deploymentHistory.map((deployment) => (
                <tr key={deployment.id} className="hover:bg-gray-50">
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm font-medium text-gray-900">
                      {deployment.service}
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="flex items-center">
                      {getStatusIcon(deployment.status)}
                      <span className="ml-2 text-sm capitalize">{deployment.status}</span>
                    </div>
                  </td>
                  <td className="px-6 py-4 whitespace-nowrap">
                    <div className="text-sm text-gray-900">{deployment.time}</div>
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>
    </div>
  )
}