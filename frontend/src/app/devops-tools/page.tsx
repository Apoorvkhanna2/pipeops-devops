// frontend/src/app/devops-tools/page.tsx
'use client';

import { useState } from 'react';

export default function DevOpsTools() {
  const [activeTab, setActiveTab] = useState('ci-cd');

  const ciCdTools = [
    {
      name: 'GitHub Actions',
      description: 'Automate your workflow from idea to production',
      status: 'connected',
      icon: '⚡',
      actions: ['View Workflows', 'Run Manual', 'Settings']
    },
    {
      name: 'Jenkins',
      description: 'Open source automation server',
      status: 'disconnected',
      icon: '🔧',
      actions: ['Connect', 'Documentation']
    },
    {
      name: 'GitLab CI',
      description: 'Continuous integration and delivery',
      status: 'available',
      icon: '🦊',
      actions: ['Connect', 'Learn More']
    }
  ];

  const monitoringTools = [
    {
      name: 'Prometheus',
      description: 'Monitoring system and time series database',
      status: 'connected',
      icon: '📊',
      metrics: ['CPU Usage', 'Memory', 'Response Time']
    },
    {
      name: 'Grafana',
      description: 'Observability and data visualization platform',
      status: 'connected',
      icon: '📈',
      metrics: ['Dashboards', 'Alerts', 'Data Sources']
    },
    {
      name: 'Datadog',
      description: 'Monitoring and security platform',
      status: 'available',
      icon: '🐶',
      metrics: ['APM', 'Logs', 'Infrastructure']
    }
  ];

  const containerTools = [
    {
      name: 'Docker',
      description: 'Container platform',
      status: 'connected',
      icon: '🐳',
      stats: { containers: 12, images: 45 }
    },
    {
      name: 'Kubernetes',
      description: 'Container orchestration',
      status: 'connected',
      icon: '☸️',
      stats: { pods: 24, nodes: 3 }
    },
    {
      name: 'Helm',
      description: 'Kubernetes package manager',
      status: 'connected',
      icon: '🧭',
      stats: { charts: 8, releases: 15 }
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'connected': return 'text-green-400 bg-green-400/20';
      case 'disconnected': return 'text-red-400 bg-red-400/20';
      case 'available': return 'text-blue-400 bg-blue-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>DevOps Tools</h1>
        <p>Integrate and manage your DevOps toolchain</p>
      </div>

      {/* Tools Navigation */}
      <div className="card mb-6">
        <div className="tools-nav">
          <button 
            className={`nav-tab ${activeTab === 'ci-cd' ? 'active' : ''}`}
            onClick={() => setActiveTab('ci-cd')}
          >
            CI/CD Tools
          </button>
          <button 
            className={`nav-tab ${activeTab === 'monitoring' ? 'active' : ''}`}
            onClick={() => setActiveTab('monitoring')}
          >
            Monitoring
          </button>
          <button 
            className={`nav-tab ${activeTab === 'containers' ? 'active' : ''}`}
            onClick={() => setActiveTab('containers')}
          >
            Containers
          </button>
          <button 
            className={`nav-tab ${activeTab === 'config' ? 'active' : ''}`}
            onClick={() => setActiveTab('config')}
          >
            Configuration
          </button>
        </div>
      </div>

      {/* CI/CD Tools */}
      {activeTab === 'ci-cd' && (
        <div className="grid-auto">
          {ciCdTools.map((tool, index) => (
            <div key={index} className="tool-card">
              <div className="tool-header">
                <div className="tool-icon">{tool.icon}</div>
                <div>
                  <h3>{tool.name}</h3>
                  <span className={`status-badge ${getStatusColor(tool.status)}`}>
                    {tool.status}
                  </span>
                </div>
              </div>
              <p className="tool-description">{tool.description}</p>
              <div className="tool-actions">
                {tool.actions.map((action, actionIndex) => (
                  <button key={actionIndex} className="btn-secondary">
                    {action}
                  </button>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Monitoring Tools */}
      {activeTab === 'monitoring' && (
        <div className="grid-auto">
          {monitoringTools.map((tool, index) => (
            <div key={index} className="tool-card">
              <div className="tool-header">
                <div className="tool-icon">{tool.icon}</div>
                <div>
                  <h3>{tool.name}</h3>
                  <span className={`status-badge ${getStatusColor(tool.status)}`}>
                    {tool.status}
                  </span>
                </div>
              </div>
              <p className="tool-description">{tool.description}</p>
              <div className="tool-metrics">
                {tool.metrics.map((metric, metricIndex) => (
                  <span key={metricIndex} className="metric-tag">
                    {metric}
                  </span>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Container Tools */}
      {activeTab === 'containers' && (
        <div className="grid-auto">
          {containerTools.map((tool, index) => (
            <div key={index} className="tool-card">
              <div className="tool-header">
                <div className="tool-icon">{tool.icon}</div>
                <div>
                  <h3>{tool.name}</h3>
                  <span className={`status-badge ${getStatusColor(tool.status)}`}>
                    {tool.status}
                  </span>
                </div>
              </div>
              <p className="tool-description">{tool.description}</p>
              <div className="tool-stats">
                {Object.entries(tool.stats).map(([key, value]) => (
                  <div key={key} className="stat-item">
                    <span className="stat-value">{value}</span>
                    <span className="stat-label">{key}</span>
                  </div>
                ))}
              </div>
            </div>
          ))}
        </div>
      )}

      {/* Configuration */}
      {activeTab === 'config' && (
        <div className="card">
          <h2>Toolchain Configuration</h2>
          <div className="config-section">
            <h3>GitHub Integration</h3>
            <div className="config-item">
              <label>GitHub Organization</label>
              <input type="text" className="form-input" placeholder="your-org" />
            </div>
            <div className="config-item">
              <label>Access Token</label>
              <input type="password" className="form-input" placeholder="••••••••" />
            </div>
          </div>
          
          <div className="config-section">
            <h3>Webhook Settings</h3>
            <div className="config-item">
              <label>Webhook URL</label>
              <input 
                type="text" 
                className="form-input" 
                value="https://api.pipeops.dev/webhook/github" 
                readOnly 
              />
            </div>
          </div>

          <div className="config-actions">
            <button className="btn-primary">Save Configuration</button>
            <button className="btn-secondary">Test Connections</button>
          </div>
        </div>
      )}

      <style jsx>{`
        .tools-nav {
          display: flex;
          gap: 1rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .nav-tab {
          padding: 1rem 1.5rem;
          background: none;
          border: none;
          color: #94a3b8;
          cursor: pointer;
          border-bottom: 2px solid transparent;
          transition: all 0.3s ease;
        }

        .nav-tab:hover,
        .nav-tab.active {
          color: #f8fafc;
          border-bottom-color: #4facfe;
        }

        .tool-card {
          background: rgba(255, 255, 255, 0.05);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1.5rem;
        }

        .tool-header {
          display: flex;
          align-items: center;
          gap: 1rem;
          margin-bottom: 1rem;
        }

        .tool-icon {
          font-size: 2rem;
        }

        .tool-header h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #f8fafc;
          margin-bottom: 0.25rem;
        }

        .tool-description {
          color: #94a3b8;
          margin-bottom: 1rem;
          line-height: 1.5;
        }

        .tool-actions {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .tool-metrics {
          display: flex;
          gap: 0.5rem;
          flex-wrap: wrap;
        }

        .metric-tag {
          background: rgba(255, 255, 255, 0.1);
          padding: 0.25rem 0.5rem;
          border-radius: 4px;
          font-size: 0.75rem;
          color: #cbd5e1;
        }

        .tool-stats {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 1rem;
        }

        .stat-item {
          text-align: center;
          padding: 0.75rem;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
        }

        .stat-value {
          display: block;
          font-size: 1.5rem;
          font-weight: 700;
          color: #f8fafc;
        }

        .stat-label {
          font-size: 0.75rem;
          color: #94a3b8;
          text-transform: uppercase;
        }

        .config-section {
          margin-bottom: 2rem;
          padding-bottom: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
        }

        .config-section h3 {
          font-size: 1.125rem;
          font-weight: 600;
          color: #f8fafc;
          margin-bottom: 1rem;
        }

        .config-item {
          margin-bottom: 1rem;
        }

        .config-item label {
          display: block;
          margin-bottom: 0.5rem;
          font-weight: 600;
          color: #e2e8f0;
        }

        .config-actions {
          display: flex;
          gap: 1rem;
        }
      `}</style>
    </div>
  );
}