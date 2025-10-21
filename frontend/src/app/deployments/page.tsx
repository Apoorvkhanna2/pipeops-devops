// frontend/src/app/deployments/page.tsx
'use client';

import { useState, useEffect } from 'react';

interface Deployment {
  id: string;
  repo: string;
  branch: string;
  status: 'pending' | 'success' | 'failure' | 'in_progress';
  environment: string;
  created_at: string;
  updated_at: string;
  commit: {
    sha: string;
    message: string;
    author: string;
  };
  deployment_url?: string;
  logs_url?: string;
}

export default function Deployments() {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [newDeployment, setNewDeployment] = useState({
    repo: '',
    branch: 'main',
    environment: 'production'
  });

  useEffect(() => {
    // Simulate fetching deployments
    const mockDeployments: Deployment[] = [
      {
        id: '1',
        repo: 'pipeops-devops',
        branch: 'main',
        status: 'success',
        environment: 'production',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        commit: {
          sha: 'a1b2c3d4',
          message: 'Add real-time deployment features',
          author: 'developer'
        },
        deployment_url: 'https://github.com/your-org/pipeops-devops/deployments',
        logs_url: '/logs/1'
      },
      {
        id: '2',
        repo: 'auth-service',
        branch: 'develop',
        status: 'in_progress',
        environment: 'staging',
        created_at: new Date().toISOString(),
        updated_at: new Date().toISOString(),
        commit: {
          sha: 'e5f6g7h8',
          message: 'Fix authentication bug',
          author: 'developer'
        }
      }
    ];
    setDeployments(mockDeployments);
  }, []);

  const handleDeploy = async () => {
    // Simulate deployment
    const newDeploy: Deployment = {
      id: Date.now().toString(),
      repo: newDeployment.repo,
      branch: newDeployment.branch,
      status: 'pending',
      environment: newDeployment.environment,
      created_at: new Date().toISOString(),
      updated_at: new Date().toISOString(),
      commit: {
        sha: Math.random().toString(36).substring(7),
        message: 'Manual deployment triggered',
        author: 'user'
      }
    };

    setDeployments(prev => [newDeploy, ...prev]);
    setShowDeployModal(false);
    setNewDeployment({ repo: '', branch: 'main', environment: 'production' });

    // Simulate deployment progress
    setTimeout(() => {
      setDeployments(prev => 
        prev.map(d => 
          d.id === newDeploy.id 
            ? { ...d, status: 'in_progress' }
            : d
        )
      );
    }, 2000);

    setTimeout(() => {
      setDeployments(prev => 
        prev.map(d => 
          d.id === newDeploy.id 
            ? { ...d, status: 'success' }
            : d
        )
      );
    }, 5000);
  };

  const getStatusColor = (status: Deployment['status']) => {
    switch (status) {
      case 'success': return 'text-green-400 bg-green-400/20';
      case 'failure': return 'text-red-400 bg-red-400/20';
      case 'in_progress': return 'text-blue-400 bg-blue-400/20';
      case 'pending': return 'text-yellow-400 bg-yellow-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getStatusIcon = (status: Deployment['status']) => {
    switch (status) {
      case 'success': return '✅';
      case 'failure': return '❌';
      case 'in_progress': return '🔄';
      case 'pending': return '⏳';
      default: return '❓';
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1>GitHub Deployments</h1>
            <p>Manage and monitor your GitHub repository deployments</p>
          </div>
          <button 
            onClick={() => setShowDeployModal(true)}
            className="btn-primary"
          >
            + New Deployment
          </button>
        </div>
      </div>

      {/* Deployment Stats */}
      <div className="grid-3 mb-6">
        <div className="metric-card">
          <div className="metric-value">{deployments.length}</div>
          <div className="metric-label">Total Deployments</div>
        </div>
        <div className="metric-card">
          <div className="metric-value text-green-400">
            {deployments.filter(d => d.status === 'success').length}
          </div>
          <div className="metric-label">Successful</div>
        </div>
        <div className="metric-card">
          <div className="metric-value text-blue-400">
            {deployments.filter(d => d.status === 'in_progress').length}
          </div>
          <div className="metric-label">In Progress</div>
        </div>
      </div>

      {/* Deployments List */}
      <div className="card">
        <h2>Recent Deployments</h2>
        <div className="space-y-4">
          {deployments.map((deployment) => (
            <div key={deployment.id} className="deployment-item">
              <div className="deployment-header">
                <div className="deployment-info">
                  <h3>{deployment.repo}</h3>
                  <div className="deployment-meta">
                    <span>Branch: {deployment.branch}</span>
                    <span>Environment: {deployment.environment}</span>
                    <span>Commit: {deployment.commit.sha.substring(0, 7)}</span>
                  </div>
                  <p className="commit-message">{deployment.commit.message}</p>
                </div>
                <div className="deployment-status">
                  <span className={`status-badge ${getStatusColor(deployment.status)}`}>
                    {getStatusIcon(deployment.status)} {deployment.status.replace('_', ' ')}
                  </span>
                </div>
              </div>
              <div className="deployment-footer">
                <div className="deployment-actions">
                  <button className="btn-secondary">View Logs</button>
                  <button className="btn-secondary">Redeploy</button>
                  {deployment.deployment_url && (
                    <a 
                      href={deployment.deployment_url} 
                      target="_blank" 
                      rel="noopener noreferrer"
                      className="btn-secondary"
                    >
                      GitHub
                    </a>
                  )}
                </div>
                <div className="deployment-time">
                  {new Date(deployment.created_at).toLocaleString()}
                </div>
              </div>
            </div>
          ))}
        </div>
      </div>

      {/* Deploy Modal */}
      {showDeployModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Trigger New Deployment</h2>
            <div className="form-group">
              <label className="form-label">Repository</label>
              <input
                type="text"
                className="form-input"
                placeholder="owner/repo-name"
                value={newDeployment.repo}
                onChange={(e) => setNewDeployment(prev => ({
                  ...prev,
                  repo: e.target.value
                }))}
              />
            </div>
            <div className="form-group">
              <label className="form-label">Branch</label>
              <select
                className="form-select"
                value={newDeployment.branch}
                onChange={(e) => setNewDeployment(prev => ({
                  ...prev,
                  branch: e.target.value
                }))}
              >
                <option value="main">main</option>
                <option value="develop">develop</option>
                <option value="staging">staging</option>
              </select>
            </div>
            <div className="form-group">
              <label className="form-label">Environment</label>
              <select
                className="form-select"
                value={newDeployment.environment}
                onChange={(e) => setNewDeployment(prev => ({
                  ...prev,
                  environment: e.target.value
                }))}
              >
                <option value="production">Production</option>
                <option value="staging">Staging</option>
                <option value="development">Development</option>
              </select>
            </div>
            <div className="modal-actions">
              <button 
                className="btn-secondary"
                onClick={() => setShowDeployModal(false)}
              >
                Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={handleDeploy}
                disabled={!newDeployment.repo}
              >
                Deploy
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .deployment-item {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 1.5rem;
          margin-bottom: 1rem;
        }

        .deployment-header {
          display: flex;
          justify-content: space-between;
          align-items: flex-start;
          margin-bottom: 1rem;
        }

        .deployment-info h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #f8fafc;
          margin-bottom: 0.5rem;
        }

        .deployment-meta {
          display: flex;
          gap: 1rem;
          margin-bottom: 0.5rem;
          font-size: 0.875rem;
          color: #94a3b8;
        }

        .commit-message {
          color: #cbd5e1;
          font-style: italic;
        }

        .deployment-footer {
          display: flex;
          justify-content: space-between;
          align-items: center;
        }

        .deployment-actions {
          display: flex;
          gap: 0.5rem;
        }

        .deployment-time {
          color: #64748b;
          font-size: 0.875rem;
        }

        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.8);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal {
          background: #1e293b;
          border-radius: 12px;
          padding: 2rem;
          width: 90%;
          max-width: 500px;
          border: 1px solid rgba(255, 255, 255, 0.1);
        }

        .modal h2 {
          margin-bottom: 1.5rem;
          color: #f8fafc;
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 2rem;
        }
      `}</style>
    </div>
  );
}