// frontend/src/app/page.tsx
'use client';

import { Suspense } from 'react';
import Dashboard from '../components/Dashboard';

export default function Home() {
  return (
    <Suspense fallback={<LoadingFallback />}>
      <Dashboard />
    </Suspense>
  );
}

function LoadingFallback() {
  return (
    <div className="enhanced-loading">
      <div className="loading-container">
        <div className="loading-logo">
          <div className="logo-gradient">PipeOps</div>
          <div className="loading-subtitle">DevOps Dashboard</div>
        </div>
        
        <div className="loading-progress">
          <div className="progress-bar">
            <div className="progress-fill"></div>
          </div>
          <div className="loading-steps">
            <div className="loading-step active">
              <span className="step-icon">🔧</span>
              <span>Initializing dashboard</span>
            </div>
            <div className="loading-step">
              <span className="step-icon">📊</span>
              <span>Loading services</span>
            </div>
            <div className="loading-step">
              <span className="step-icon">🚀</span>
              <span>Connecting to backend</span>
            </div>
          </div>
        </div>

        <div className="loading-tips">
          <div className="tip-card">
            <span className="tip-icon">💡</span>
            <div className="tip-content">
              <strong>Pro Tip:</strong> Services auto-refresh every 5 seconds
            </div>
          </div>
          <div className="tip-card">
            <span className="tip-icon">🔄</span>
            <div className="tip-content">
              <strong>Feature:</strong> Click restart to test real-time updates
            </div>
          </div>
          <div className="tip-card">
            <span className="tip-icon">📈</span>
            <div className="tip-content">
              <strong>Monitor:</strong> Live metrics with AI anomaly detection
            </div>
          </div>
        </div>

        <div className="loading-stats">
          <div className="stat-preview">
            <div className="preview-service">
              <div className="preview-service-name">Auth Service</div>
              <div className="preview-status running">running</div>
              <div className="preview-metrics">
                <div className="preview-metric">
                  <span>CPU:</span>
                  <span className="preview-value">25%</span>
                </div>
                <div className="preview-metric">
                  <span>Memory:</span>
                  <span className="preview-value">45%</span>
                </div>
              </div>
            </div>
            <div className="preview-service">
              <div className="preview-service-name">API Gateway</div>
              <div className="preview-status running">running</div>
              <div className="preview-metrics">
                <div className="preview-metric">
                  <span>CPU:</span>
                  <span className="preview-value">30%</span>
                </div>
                <div className="preview-metric">
                  <span>Memory:</span>
                  <span className="preview-value">60%</span>
                </div>
              </div>
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .enhanced-loading {
          min-height: 100vh;
          background: linear-gradient(135deg, #667eea 0%, #764ba2 100%);
          display: flex;
          align-items: center;
          justify-content: center;
          color: white;
          font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, sans-serif;
          padding: 20px;
        }

        .loading-container {
          text-align: center;
          max-width: 600px;
          width: 100%;
        }

        .loading-logo {
          margin-bottom: 40px;
        }

        .logo-gradient {
          font-size: 3.5rem;
          font-weight: 800;
          background: linear-gradient(45deg, #fff, #e0e7ff);
          -webkit-background-clip: text;
          -webkit-text-fill-color: transparent;
          margin-bottom: 10px;
        }

        .loading-subtitle {
          font-size: 1.3rem;
          opacity: 0.9;
          font-weight: 300;
        }

        .loading-progress {
          margin-bottom: 40px;
        }

        .progress-bar {
          width: 100%;
          height: 6px;
          background: rgba(255, 255, 255, 0.2);
          border-radius: 3px;
          margin-bottom: 30px;
          overflow: hidden;
        }

        .progress-fill {
          height: 100%;
          background: linear-gradient(90deg, #4facfe 0%, #00f2fe 100%);
          border-radius: 3px;
          animation: progressAnimation 2s ease-in-out infinite;
          width: 60%;
        }

        @keyframes progressAnimation {
          0% { transform: translateX(-100%); }
          50% { transform: translateX(100%); }
          100% { transform: translateX(100%); }
        }

        .loading-steps {
          display: flex;
          justify-content: space-between;
          gap: 20px;
        }

        .loading-step {
          flex: 1;
          padding: 15px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 10px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          opacity: 0.6;
          transition: all 0.3s ease;
        }

        .loading-step.active {
          opacity: 1;
          background: rgba(255, 255, 255, 0.2);
          transform: translateY(-5px);
        }

        .step-icon {
          display: block;
          font-size: 1.5rem;
          margin-bottom: 8px;
        }

        .loading-tips {
          display: grid;
          grid-template-columns: repeat(auto-fit, minmax(250px, 1fr));
          gap: 15px;
          margin-bottom: 40px;
        }

        .tip-card {
          display: flex;
          align-items: flex-start;
          gap: 12px;
          padding: 15px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 8px;
          border: 1px solid rgba(255, 255, 255, 0.2);
          text-align: left;
        }

        .tip-icon {
          font-size: 1.2rem;
          flex-shrink: 0;
        }

        .tip-content {
          flex: 1;
        }

        .tip-content strong {
          color: #e0e7ff;
        }

        .loading-stats {
          background: rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 20px;
          border: 1px solid rgba(255, 255, 255, 0.2);
        }

        .preview-service {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 12px;
          background: rgba(255, 255, 255, 0.05);
          border-radius: 8px;
          margin-bottom: 10px;
        }

        .preview-service:last-child {
          margin-bottom: 0;
        }

        .preview-service-name {
          font-weight: 600;
          flex: 2;
          text-align: left;
        }

        .preview-status {
          padding: 4px 12px;
          border-radius: 12px;
          font-size: 0.75rem;
          font-weight: 600;
          text-transform: uppercase;
          flex: 1;
        }

        .preview-status.running {
          background: rgba(16, 185, 129, 0.2);
          color: #10b981;
          border: 1px solid rgba(16, 185, 129, 0.3);
        }

        .preview-metrics {
          display: flex;
          gap: 15px;
          flex: 2;
          justify-content: flex-end;
        }

        .preview-metric {
          display: flex;
          gap: 5px;
          font-size: 0.85rem;
        }

        .preview-value {
          font-weight: 600;
          color: #e0e7ff;
        }

        @media (max-width: 768px) {
          .logo-gradient {
            font-size: 2.5rem;
          }
          
          .loading-steps {
            flex-direction: column;
            gap: 10px;
          }
          
          .preview-service {
            flex-direction: column;
            gap: 8px;
            text-align: center;
          }
          
          .preview-metrics {
            justify-content: center;
          }
        }
      `}</style>
    </div>
  );
}