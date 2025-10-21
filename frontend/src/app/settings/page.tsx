// frontend/src/app/settings/page.tsx
'use client';

import { useState } from 'react';

export default function Settings() {
  const [settings, setSettings] = useState({
    autoRefresh: true,
    refreshInterval: 5,
    notifications: true,
    darkMode: true,
    anomalyDetection: true
  });

  const updateSetting = (key: string, value: any) => {
    setSettings(prev => ({ ...prev, [key]: value }));
  };

  return (
    <div className="page-container">
      <div className="page-header">
        <h1>Settings</h1>
        <p>Configure your dashboard preferences</p>
      </div>

      <div className="settings-grid">
        <div className="setting-card">
          <h3>Dashboard Settings</h3>
          <div className="setting-item">
            <label>Auto Refresh</label>
            <input
              type="checkbox"
              checked={settings.autoRefresh}
              onChange={(e) => updateSetting('autoRefresh', e.target.checked)}
            />
          </div>
          <div className="setting-item">
            <label>Refresh Interval (seconds)</label>
            <select
              value={settings.refreshInterval}
              onChange={(e) => updateSetting('refreshInterval', parseInt(e.target.value))}
            >
              <option value={5}>5 seconds</option>
              <option value={10}>10 seconds</option>
              <option value={30}>30 seconds</option>
              <option value={60}>1 minute</option>
            </select>
          </div>
        </div>

        <div className="setting-card">
          <h3>Notification Settings</h3>
          <div className="setting-item">
            <label>Enable Notifications</label>
            <input
              type="checkbox"
              checked={settings.notifications}
              onChange={(e) => updateSetting('notifications', e.target.checked)}
            />
          </div>
          <div className="setting-item">
            <label>Anomaly Detection</label>
            <input
              type="checkbox"
              checked={settings.anomalyDetection}
              onChange={(e) => updateSetting('anomalyDetection', e.target.checked)}
            />
          </div>
        </div>

        <div className="setting-card">
          <h3>Appearance</h3>
          <div className="setting-item">
            <label>Dark Mode</label>
            <input
              type="checkbox"
              checked={settings.darkMode}
              onChange={(e) => updateSetting('darkMode', e.target.checked)}
            />
          </div>
        </div>
      </div>

      <div className="settings-actions">
        <button className="btn-primary">Save Settings</button>
        <button className="btn-secondary">Reset to Defaults</button>
      </div>

      <style jsx>{`
        .page-container {
          max-width: 800px;
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

        .settings-grid {
          display: grid;
          gap: 1.5rem;
          margin-bottom: 2rem;
        }

        .setting-card {
          background: rgba(30, 41, 59, 0.5);
          border: 1px solid rgba(255, 255, 255, 0.1);
          border-radius: 12px;
          padding: 1.5rem;
          backdrop-filter: blur(10px);
        }

        .setting-card h3 {
          font-size: 1.25rem;
          font-weight: 600;
          color: #f8fafc;
          margin-bottom: 1.5rem;
          border-bottom: 1px solid rgba(255, 255, 255, 0.1);
          padding-bottom: 0.5rem;
        }

        .setting-item {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 1rem 0;
          border-bottom: 1px solid rgba(255, 255, 255, 0.05);
        }

        .setting-item:last-child {
          border-bottom: none;
        }

        .setting-item label {
          font-weight: 500;
          color: #e2e8f0;
        }

        .setting-item input[type="checkbox"] {
          width: 20px;
          height: 20px;
          accent-color: #4facfe;
        }

        .setting-item select {
          background: rgba(255, 255, 255, 0.1);
          border: 1px solid rgba(255, 255, 255, 0.2);
          border-radius: 6px;
          padding: 0.5rem;
          color: white;
          min-width: 120px;
        }

        .settings-actions {
          display: flex;
          gap: 1rem;
          justify-content: flex-end;
        }

        .btn-primary, .btn-secondary {
          padding: 0.75rem 1.5rem;
          border-radius: 8px;
          font-weight: 600;
          border: none;
          cursor: pointer;
          transition: all 0.3s ease;
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