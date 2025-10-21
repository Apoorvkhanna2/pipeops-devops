'use client';

import { useState, useEffect } from 'react';

const AnalyticsDashboard = () => {
  const [analytics, setAnalytics] = useState({
    uptime: 0,
    performance: 0,
    errorRate: 0,
    responseTime: 0,
    throughput: 0
  });

  useEffect(() => {
    const interval = setInterval(() => {
      setAnalytics(prev => ({
        uptime: Math.min(100, prev.uptime + Math.random() * 0.1),
        performance: 85 + Math.random() * 10,
        errorRate: Math.max(0, prev.errorRate + (Math.random() - 0.5) * 0.2),
        responseTime: 120 + Math.random() * 50,
        throughput: 1000 + Math.random() * 500
      }));
    }, 3000);

    return () => clearInterval(interval);
  }, []);

  return (
    <div className="analytics-dashboard">
      <h3>Advanced Analytics</h3>
      <div className="analytics-grid">
        <div className="analytics-card">
          <h4>Uptime</h4>
          <div className="gauge">
            <div 
              className="gauge-fill" 
              style={{ width: `${analytics.uptime}%` }}
            ></div>
          </div>
          <span className="analytics-value">{analytics.uptime.toFixed(1)}%</span>
        </div>
        
        <div className="analytics-card">
          <h4>Performance</h4>
          <div className="gauge">
            <div 
              className="gauge-fill performance" 
              style={{ width: `${analytics.performance}%` }}
            ></div>
          </div>
          <span className="analytics-value">{analytics.performance.toFixed(1)}%</span>
        </div>
        
        <div className="analytics-card">
          <h4>Error Rate</h4>
          <div className="gauge">
            <div 
              className="gauge-fill error" 
              style={{ width: `${analytics.errorRate}%` }}
            ></div>
          </div>
          <span className="analytics-value">{analytics.errorRate.toFixed(2)}%</span>
        </div>
        
        <div className="analytics-card">
          <h4>Response Time</h4>
          <span className="analytics-value large">{analytics.responseTime.toFixed(0)}ms</span>
        </div>
        
        <div className="analytics-card">
          <h4>Throughput</h4>
          <span className="analytics-value large">
            {(analytics.throughput / 1000).toFixed(1)}k req/s
          </span>
        </div>
      </div>
    </div>
  );
};

export default AnalyticsDashboard;