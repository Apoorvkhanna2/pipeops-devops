'use client';

import { useState, useEffect } from 'react';

const AnomalyDetector = () => {
  const [anomalies, setAnomalies] = useState([]);

  useEffect(() => {
    // Simulate AI anomaly detection
    const detectAnomalies = () => {
      const newAnomalies = [
        {
          id: Date.now(),
          service: 'Auth Service',
          type: 'cpu_spike',
          severity: 'high',
          message: 'Unusual CPU spike detected - 85% utilization',
          timestamp: new Date().toISOString(),
          confidence: 92
        },
        {
          id: Date.now() + 1,
          service: 'User Service',
          type: 'memory_leak',
          severity: 'medium',
          message: 'Potential memory leak detected',
          timestamp: new Date().toISOString(),
          confidence: 78
        }
      ];
      
      setAnomalies(prev => [...newAnomalies, ...prev.slice(0, 4)]);
    };

    const interval = setInterval(detectAnomalies, 15000);
    return () => clearInterval(interval);
  }, []);

  const getSeverityColor = (severity) => {
    switch (severity) {
      case 'high': return '#ef4444';
      case 'medium': return '#f59e0b';
      case 'low': return '#10b981';
      default: return '#6b7280';
    }
  };

  return (
    <div className="anomaly-detector">
      <h3>AI Anomaly Detection</h3>
      <div className="anomalies-list">
        {anomalies.map(anomaly => (
          <div key={anomaly.id} className="anomaly-card">
            <div className="anomaly-header">
              <span className="service-name">{anomaly.service}</span>
              <span 
                className="severity-badge"
                style={{ backgroundColor: getSeverityColor(anomaly.severity) }}
              >
                {anomaly.severity}
              </span>
            </div>
            <p className="anomaly-message">{anomaly.message}</p>
            <div className="anomaly-footer">
              <span className="confidence">
                Confidence: {anomaly.confidence}%
              </span>
              <span className="timestamp">
                {new Date(anomaly.timestamp).toLocaleTimeString()}
              </span>
            </div>
          </div>
        ))}
        {anomalies.length === 0 && (
          <div className="no-anomalies">
            <span>✅ No anomalies detected</span>
          </div>
        )}
      </div>
    </div>
  );
};

export default AnomalyDetector;