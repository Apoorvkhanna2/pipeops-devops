import { useState, useEffect } from 'react';

export default function SystemMetrics() {
  const [metrics, setMetrics] = useState(null);

  useEffect(() => {
    fetchMetrics();
    const interval = setInterval(fetchMetrics, 10000);
    return () => clearInterval(interval);
  }, []);

  const fetchMetrics = async () => {
    try {
      const response = await fetch('http://localhost:5000/api/metrics');
      const data = await response.json();
      setMetrics(data.system);
    } catch (error) {
      console.error('Error fetching metrics:', error);
    }
  };

  if (!metrics) return <div>Loading system metrics...</div>;

  return (
    <div className="system-metrics">
      <h3>System Overview</h3>
      <div className="metrics-grid">
        <div className="metric-card">
          <span className="metric-label">Total CPU</span>
          <span className="metric-value">{metrics.totalCPU}%</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Total Memory</span>
          <span className="metric-value">{metrics.totalMemory}%</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Services</span>
          <span className="metric-value">{metrics.runningServices}/{metrics.totalServices}</span>
        </div>
        <div className="metric-card">
          <span className="metric-label">Health</span>
          <span className="metric-value healthy">{metrics.health}</span>
        </div>
      </div>
    </div>
  );
}