// frontend/src/app/monitoring/page.tsx
'use client';

export default function Monitoring() {
  const metrics = [
    { name: 'CPU Usage', value: '45%', trend: 'up' },
    { name: 'Memory Usage', value: '68%', trend: 'stable' },
    { name: 'Disk I/O', value: '120 MB/s', trend: 'down' },
    { name: 'Network', value: '85 Mbps', trend: 'up' },
    { name: 'Error Rate', value: '0.2%', trend: 'stable' },
    { name: 'Response Time', value: '145ms', trend: 'down' }
  ];

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Monitoring</h1>
        <p>Real-time metrics and performance monitoring</p>
      </div>

      <div className="metrics-grid">
        {metrics.map((metric, index) => (
          <div key={index} className="metric-card">
            <div className="metric-header">
              <h3>{metric.name}</h3>
              <span className={`trend trend-${metric.trend}`}>
                {metric.trend === 'up' ? '↗' : metric.trend === 'down' ? '↘' : '→'}
              </span>
            </div>
            <div className="metric-value">{metric.value}</div>
            <div className="metric-chart">
              <div className="chart-bar"></div>
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

        .metrics-grid {
          display: grid;
          gap: 1.5rem;
          grid-template-columns: repeat(auto-fit, minmax(300px, 1fr));
        }

        .metric-card {
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1.5rem;
          backdrop-filter: blur(10px);
        }

        .metric-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          margin-bottom: 1rem;
        }

        .metric-header h3 {
          font-size: 1rem;
          font-weight: 600;
          color: #94a3b8;
        }

        .trend {
          font-size: 1.2rem;
        }

        .trend-up { color: #10b981; }
        .trend-down { color: #ef4444; }
        .trend-stable { color: #f59e0b; }

        .metric-value {
          font-size: 2rem;
          font-weight: 700;
          color: #f8fafc;
          margin-bottom: 1rem;
        }

        .metric-chart {
          height: 4px;
          background: rgba(255, 255, 255, 0.1);
          border-radius: 2px;
          overflow: hidden;
        }

        .chart-bar {
          height: 100%;
          background: linear-gradient(90deg, #4facfe, #00f2fe);
          border-radius: 2px;
          animation: chartAnimation 2s ease-in-out infinite;
        }

        @keyframes chartAnimation {
          0%, 100% { width: 30%; }
          50% { width: 70%; }
        }
      `}</style>
    </div>
  );
}