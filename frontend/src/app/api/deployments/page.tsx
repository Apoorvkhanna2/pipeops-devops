// frontend/src/app/deployments/page.tsx
'use client';

import { useState, useEffect } from 'react';

interface Deployment {
  id: string;
  repo: string;
  branch: string;
  status: 'pending' | 'success' | 'failure' | 'in_progress' | 'queued' | 'error';
  environment: string;
  created_at: string;
  updated_at: string;
  commit: {
    sha: string;
    message: string;
    author: string;
    avatar_url?: string;
  };
  deployment_url?: string;
  logs_url?: string;
}

interface Repository {
  id: number;
  name: string;
  full_name: string;
  owner: string;
  private: boolean;
  html_url: string;
  description: string;
  default_branch: string;
}

interface Branch {
  name: string;
  commit: string;
  protected: boolean;
}

export default function Deployments() {
  const [deployments, setDeployments] = useState<Deployment[]>([]);
  const [repositories, setRepositories] = useState<Repository[]>([]);
  const [branches, setBranches] = useState<Branch[]>([]);
  const [loading, setLoading] = useState(true);
  const [deploying, setDeploying] = useState(false);
  const [showDeployModal, setShowDeployModal] = useState(false);
  const [selectedRepo, setSelectedRepo] = useState('');
  const [newDeployment, setNewDeployment] = useState({
    repo: '',
    branch: '',
    environment: 'production',
    description: ''
  });

  useEffect(() => {
    fetchRepositories();
    fetchDeployments();
  }, []);

  useEffect(() => {
    if (selectedRepo) {
      fetchBranches(selectedRepo);
    }
  }, [selectedRepo]);

  const fetchRepositories = async () => {
    try {
      const response = await fetch('/api/repositories');
      if (response.ok) {
        const repos = await response.json();
        setRepositories(repos);
      }
    } catch (error) {
      console.error('Error fetching repositories:', error);
    }
  };

  const fetchBranches = async (repoFullName: string) => {
    try {
      const [owner, repo] = repoFullName.split('/');
      const response = await fetch(`/api/branches?owner=${owner}&repo=${repo}`);
      if (response.ok) {
        const branchesData = await response.json();
        setBranches(branchesData);
        // Set default branch
        const defaultBranch = branchesData.find((b: Branch) => b.name === 'main') || 
                             branchesData.find((b: Branch) => b.name === 'master') ||
                             branchesData[0];
        if (defaultBranch) {
          setNewDeployment(prev => ({ ...prev, branch: defaultBranch.name }));
        }
      }
    } catch (error) {
      console.error('Error fetching branches:', error);
    }
  };

  const fetchDeployments = async () => {
    try {
      setLoading(true);
      // For demo, we'll use a sample repo. In production, you'd want to track multiple repos
      const response = await fetch('/api/deployments?owner=your-username&repo=your-repo');
      if (response.ok) {
        const deploymentsData = await response.json();
        setDeployments(deploymentsData);
      }
    } catch (error) {
      console.error('Error fetching deployments:', error);
    } finally {
      setLoading(false);
    }
  };

  const handleDeploy = async () => {
    if (!newDeployment.repo || !newDeployment.branch) {
      alert('Please select a repository and branch');
      return;
    }

    try {
      setDeploying(true);
      const [owner, repo] = newDeployment.repo.split('/');
      
      const response = await fetch('/api/deployments', {
        method: 'POST',
        headers: {
          'Content-Type': 'application/json',
        },
        body: JSON.stringify({
          owner,
          repo,
          branch: newDeployment.branch,
          environment: newDeployment.environment,
          description: newDeployment.description || `Deploy ${newDeployment.branch} to ${newDeployment.environment}`
        }),
      });

      if (response.ok) {
        const newDeploy = await response.json();
        setDeployments(prev => [newDeploy, ...prev]);
        setShowDeployModal(false);
        setNewDeployment({
          repo: '',
          branch: '',
          environment: 'production',
          description: ''
        });
        setSelectedRepo('');
        
        // Poll for status updates
        pollDeploymentStatus(newDeploy.id, owner, repo);
      } else {
        const error = await response.json();
        alert(`Deployment failed: ${error.error}`);
      }
    } catch (error) {
      console.error('Error creating deployment:', error);
      alert('Failed to create deployment');
    } finally {
      setDeploying(false);
    }
  };

  const pollDeploymentStatus = async (deploymentId: string, owner: string, repo: string) => {
    const maxAttempts = 30; // 5 minutes at 10-second intervals
    let attempts = 0;

    const poll = async () => {
      if (attempts >= maxAttempts) return;

      try {
        const response = await fetch(`/api/deployments?owner=${owner}&repo=${repo}`);
        if (response.ok) {
          const deployments = await response.json();
          const updatedDeployment = deployments.find((d: Deployment) => d.id === deploymentId);
          
          // Updated to include 'error' as a terminal state
          if (updatedDeployment && 
              (updatedDeployment.status === 'success' || 
               updatedDeployment.status === 'failure' || 
               updatedDeployment.status === 'error')) {
            // Deployment completed
            setDeployments(prev => 
              prev.map(d => d.id === deploymentId ? updatedDeployment : d)
            );
            return;
          }
        }

        attempts++;
        setTimeout(poll, 10000); // Poll every 10 seconds
      } catch (error) {
        console.error('Error polling deployment status:', error);
        attempts++;
        setTimeout(poll, 10000);
      }
    };

    poll();
  };

  const getStatusColor = (status: Deployment['status']) => {
    switch (status) {
      case 'success': return 'text-green-400 bg-green-400/20';
      case 'failure': 
      case 'error': return 'text-red-400 bg-red-400/20';
      case 'in_progress': return 'text-blue-400 bg-blue-400/20';
      case 'queued':
      case 'pending': return 'text-yellow-400 bg-yellow-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  const getStatusIcon = (status: Deployment['status']) => {
    switch (status) {
      case 'success': return '✅';
      case 'failure': 
      case 'error': return '❌';
      case 'in_progress': return '🔄';
      case 'queued':
      case 'pending': return '⏳';
      default: return '❓';
    }
  };

  const formatDate = (dateString: string) => {
    return new Date(dateString).toLocaleString();
  };

  if (loading) {
    return (
      <div className="page-container">
        <div className="flex justify-center items-center min-h-64">
          <div className="loading-spinner">Loading deployments...</div>
        </div>
      </div>
    );
  }

  return (
    <div className="page-container">
      <div className="page-header">
        <div className="flex justify-between items-center">
          <div>
            <h1>GitHub Deployments</h1>
            <p>Real GitHub repository deployments and status monitoring</p>
          </div>
          <button 
            onClick={() => setShowDeployModal(true)}
            className="btn-primary"
            disabled={deploying}
          >
            {deploying ? 'Deploying...' : '+ New Deployment'}
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
        <div className="flex justify-between items-center mb-4">
          <h2>Recent Deployments</h2>
          <button 
            onClick={fetchDeployments}
            className="btn-secondary"
          >
            Refresh
          </button>
        </div>
        
        {deployments.length === 0 ? (
          <div className="text-center py-8 text-gray-500">
            No deployments found. Create your first deployment!
          </div>
        ) : (
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
                    {formatDate(deployment.created_at)}
                  </div>
                </div>
              </div>
            ))}
          </div>
        )}
      </div>

      {/* Deploy Modal */}
      {showDeployModal && (
        <div className="modal-overlay">
          <div className="modal">
            <h2>Trigger New Deployment</h2>
            
            <div className="form-group">
              <label className="form-label">Repository</label>
              <select
                className="form-select"
                value={selectedRepo}
                onChange={(e) => {
                  setSelectedRepo(e.target.value);
                  setNewDeployment(prev => ({ ...prev, repo: e.target.value }));
                }}
              >
                <option value="">Select a repository</option>
                {repositories.map(repo => (
                  <option key={repo.id} value={repo.full_name}>
                    {repo.full_name} {repo.private ? '🔒' : '🌐'}
                  </option>
                ))}
              </select>
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
                disabled={!selectedRepo}
              >
                <option value="">Select a branch</option>
                {branches.map(branch => (
                  <option key={branch.name} value={branch.name}>
                    {branch.name} {branch.protected ? '🛡️' : ''}
                  </option>
                ))}
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
                <option value="preview">Preview</option>
              </select>
            </div>

            <div className="form-group">
              <label className="form-label">Description (Optional)</label>
              <input
                type="text"
                className="form-input"
                placeholder="Describe this deployment..."
                value={newDeployment.description}
                onChange={(e) => setNewDeployment(prev => ({
                  ...prev,
                  description: e.target.value
                }))}
              />
            </div>

            <div className="modal-actions">
              <button 
                className="btn-secondary"
                onClick={() => setShowDeployModal(false)}
                disabled={deploying}
              >
                Cancel
              </button>
              <button 
                className="btn-primary"
                onClick={handleDeploy}
                disabled={deploying || !newDeployment.repo || !newDeployment.branch}
              >
                {deploying ? 'Deploying...' : 'Deploy'}
              </button>
            </div>
          </div>
        </div>
      )}

      <style jsx>{`
        .page-container {
          max-width: 1200px;
          margin: 0 auto;
          padding: 2rem;
        }

        .page-header {
          margin-bottom: 2rem;
        }

        .page-header h1 {
          font-size: 2.5rem;
          font-weight: bold;
          color: #f8fafc;
          margin-bottom: 0.5rem;
        }

        .page-header p {
          color: #94a3b8;
          font-size: 1.125rem;
        }

        .grid-3 {
          display: grid;
          grid-template-columns: repeat(3, 1fr);
          gap: 1rem;
        }

        .metric-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          padding: 1.5rem;
          text-align: center;
        }

        .metric-value {
          font-size: 2rem;
          font-weight: bold;
          color: #f8fafc;
          margin-bottom: 0.5rem;
        }

        .metric-label {
          color: #94a3b8;
          font-size: 0.875rem;
        }

        .card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1.5rem;
        }

        .card h2 {
          font-size: 1.5rem;
          font-weight: 600;
          color: #f8fafc;
          margin: 0;
        }

        .btn-primary {
          background: #3b82f6;
          color: white;
          border: none;
          padding: 0.75rem 1.5rem;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: background 0.2s;
        }

        .btn-primary:hover:not(:disabled) {
          background: #2563eb;
        }

        .btn-primary:disabled {
          background: #64748b;
          cursor: not-allowed;
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: #f8fafc;
          border: 1px solid rgba(255, 255, 255, 0.2);
          padding: 0.5rem 1rem;
          border-radius: 6px;
          font-weight: 500;
          cursor: pointer;
          transition: all 0.2s;
        }

        .btn-secondary:hover:not(:disabled) {
          background: rgba(255, 255, 255, 0.2);
        }

        .btn-secondary:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .loading-spinner {
          color: #94a3b8;
          font-size: 1.125rem;
        }

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

        .deployment-status {
          display: flex;
          align-items: center;
        }

        .status-badge {
          padding: 0.25rem 0.75rem;
          border-radius: 9999px;
          font-size: 0.875rem;
          font-weight: 500;
          display: flex;
          align-items: center;
          gap: 0.5rem;
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
          font-size: 1.5rem;
          font-weight: 600;
        }

        .form-group {
          margin-bottom: 1.5rem;
        }

        .form-label {
          display: block;
          color: #f8fafc;
          font-weight: 500;
          margin-bottom: 0.5rem;
        }

        .form-select,
        .form-input {
          width: 100%;
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          padding: 0.75rem;
          color: #f8fafc;
          font-size: 1rem;
        }

        .form-select:focus,
        .form-input:focus {
          outline: none;
          border-color: #3b82f6;
          box-shadow: 0 0 0 2px rgba(59, 130, 246, 0.2);
        }

        .form-select:disabled {
          opacity: 0.5;
          cursor: not-allowed;
        }

        .modal-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
          margin-top: 2rem;
        }

        .text-center {
          text-align: center;
        }

        .py-8 {
          padding-top: 2rem;
          padding-bottom: 2rem;
        }

        .text-gray-500 {
          color: #64748b;
        }

        .space-y-4 > * + * {
          margin-top: 1rem;
        }

        .mb-4 {
          margin-bottom: 1rem;
        }

        .mb-6 {
          margin-bottom: 1.5rem;
        }

        .min-h-64 {
          min-height: 16rem;
        }

        .flex {
          display: flex;
        }

        .justify-center {
          justify-content: center;
        }

        .justify-between {
          justify-content: space-between;
        }

        .items-center {
          align-items: center;
        }

        .text-green-400 {
          color: #4ade80;
        }

        .text-blue-400 {
          color: #60a5fa;
        }

        .text-red-400 {
          color: #f87171;
        }

        .text-yellow-400 {
          color: #fbbf24;
        }

        .text-gray-400 {
          color: #9ca3af;
        }

        .bg-green-400\/20 {
          background-color: rgba(74, 222, 128, 0.2);
        }

        .bg-red-400\/20 {
          background-color: rgba(248, 113, 113, 0.2);
        }

        .bg-blue-400\/20 {
          background-color: rgba(96, 165, 250, 0.2);
        }

        .bg-yellow-400\/20 {
          background-color: rgba(251, 191, 36, 0.2);
        }

        .bg-gray-400\/20 {
          background-color: rgba(156, 163, 175, 0.2);
        }
      `}</style>
    </div>
  );
}