// frontend/src/app/deployments/page.tsx
'use client';

export default function Deployments() {
  const deployments = [
    {
      id: 1,
      service: 'Auth Service',
      version: 'v1.2.3',
      environment: 'Production',
      status: 'success',
      timestamp: '2024-01-15 14:30:00',
      duration: '2m 15s'
    },
    {
      id: 2,
      service: 'API Gateway',
      version: 'v2.1.0',
      environment: 'Staging',
      status: 'in-progress',
      timestamp: '2024-01-15 14:25:00',
      duration: '1m 45s'
    },
    {
      id: 3,
      service: 'Payment Service',
      version: 'v1.0.5',
      environment: 'Production',
      status: 'failed',
      timestamp: '2024-01-15 13:45:00',
      duration: '3m 30s'
    }
  ];

  const getStatusColor = (status: string) => {
    switch (status) {
      case 'success': return 'text-green-400 bg-green-400/20';
      case 'failed': return 'text-red-400 bg-red-400/20';
      case 'in-progress': return 'text-blue-400 bg-blue-400/20';
      default: return 'text-gray-400 bg-gray-400/20';
    }
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Deployments</h1>
        <p>Manage and monitor your service deployments</p>
      </div>

      <div className="deployments-grid">
        {deployments.map((deployment) => (
          <div key={deployment.id} className="deployment-card">
            <div className="deployment-header">
              <h3>{deployment.service}</h3>
              <span className={`status-badge ${getStatusColor(deployment.status)}`}>
                {deployment.status}
              </span>
            </div>
            <div className="deployment-info">
              <div className="info-item">
                <span>Version:</span>
                <strong>{deployment.version}</strong>
              </div>
              <div className="info-item">
                <span>Environment:</span>
                <strong>{deployment.environment}</strong>
              </div>
              <div className="info-item">
                <span>Duration:</span>
                <strong>{deployment.duration}</strong>
              </div>
              <div className="info-item">
                <span>Time:</span>
                <strong>{deployment.timestamp}</strong>
              </div>
            </div>
            <div className="deployment-actions">
              <button className="btn-secondary">View Logs</button>
              <button className="btn-primary">Redeploy</button>
            </div>
          </div>
        ))}
      </div>

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
          font-weight: 700;
          background: linear-gradient(45deg, #fff, #e0e7ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 0.5rem;
        }

        .page-header p {
          color: #94a3b8;
          font-size: 1.1rem;
        }

        .deployments-grid {
          display: grid;
          gap: 1.5rem;
          grid-template-columns: repeat(auto-fit, minmax(400px, 1fr));
        }

        .deployment-card {
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1.5rem;
          backdrop-filter: blur(10px);
        }

        .deployment-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .deployment-header h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #f8fafc;
        }

        .status-badge {
          padding: 0.4rem 0.8rem;
          border-radius: 20px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
        }

        .deployment-info {
          display: grid;
          gap: 0.75rem;
          margin-bottom: 1.5rem;
        }

        .info-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 0.5rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .info-item:last-child {
          border-bottom: none;
        }

        .deployment-actions {
          display: flex;
          gap: 0.75rem;
        }

        .btn-primary, .btn-secondary {
          padding: 0.6rem 1.2rem;
          border-radius: 8px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
          flex: 1;
        }

        .btn-primary {
          background: linear-gradient(45deg, #4facfe, #00f2fe);
          color: white;
        }

        .btn-primary:hover {
          transform: translateY(-2px);
          box-shadow: 0 4px 12px rgba(79, 172, 254, 0.3);
        }

        .btn-secondary {
          background: rgba(255, 255, 255, 0.1);
          color: #cbd5e1;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .btn-secondary:hover {
          background: rgba(255, 255, 255, 0.2);
          color: white;
        }
      `}</style>
    </div>
  );
}