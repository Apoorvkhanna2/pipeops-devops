'use client';

import { useState } from 'react';

const AutoScalingPanel = ({ service, onScale }) => {
  const [scalingConfig, setScalingConfig] = useState({
    minReplicas: 1,
    maxReplicas: 10,
    targetCPU: 70,
    targetMemory: 80,
    enabled: false
  });

  const handleConfigUpdate = (key, value) => {
    const newConfig = { ...scalingConfig, [key]: value };
    setScalingConfig(newConfig);
    
    // Send to backend
    fetch(`/api/services/${service.id}/autoscaling`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
      body: JSON.stringify(newConfig)
    });
  };

  return (
    <div className="auto-scaling-panel">
      <h4>Auto-scaling Configuration</h4>
      
      <div className="scaling-toggle">
        <label>
          <input
            type="checkbox"
            checked={scalingConfig.enabled}
            onChange={(e) => handleConfigUpdate('enabled', e.target.checked)}
          />
          Enable Auto-scaling
        </label>
      </div>

      {scalingConfig.enabled && (
        <div className="scaling-config">
          <div className="config-item">
            <label>Min Replicas</label>
            <input
              type="number"
              min="1"
              max="50"
              value={scalingConfig.minReplicas}
              onChange={(e) => handleConfigUpdate('minReplicas', parseInt(e.target.value))}
            />
          </div>
          
          <div className="config-item">
            <label>Max Replicas</label>
            <input
              type="number"
              min="1"
              max="100"
              value={scalingConfig.maxReplicas}
              onChange={(e) => handleConfigUpdate('maxReplicas', parseInt(e.target.value))}
            />
          </div>
          
          <div className="config-item">
            <label>Target CPU (%)</label>
            <input
              type="range"
              min="10"
              max="90"
              value={scalingConfig.targetCPU}
              onChange={(e) => handleConfigUpdate('targetCPU', parseInt(e.target.value))}
            />
            <span>{scalingConfig.targetCPU}%</span>
          </div>
          
          <div className="config-item">
            <label>Target Memory (%)</label>
            <input
              type="range"
              min="10"
              max="90"
              value={scalingConfig.targetMemory}
              onChange={(e) => handleConfigUpdate('targetMemory', parseInt(e.target.value))}
            />
            <span>{scalingConfig.targetMemory}%</span>
          </div>
        </div>
      )}
      
      <div className="scaling-preview">
        <h5>Scaling Preview</h5>
        <div className="replica-indicators">
          {Array.from({ length: scalingConfig.maxReplicas }, (_, i) => (
            <div
              key={i}
              className={`replica-indicator ${i < service.replicas ? 'active' : ''} ${
                i < scalingConfig.minReplicas ? 'required' : ''
              }`}
            />
          ))}
        </div>
        <div className="replica-info">
          Current: {service.replicas} | Min: {scalingConfig.minReplicas} | Max: {scalingConfig.maxReplicas}
        </div>
      </div>
    </div>
  );
};

export default AutoScalingPanel;