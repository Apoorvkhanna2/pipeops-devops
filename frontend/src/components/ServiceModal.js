// frontend/src/components/ServiceModal.js
import { useState, useEffect } from 'react';

export default function ServiceModal({ service, isOpen, onClose }) {
  const [logs, setLogs] = useState([]);

  useEffect(() => {
    if (isOpen && service) {
      fetchLogs();
    }
  }, [isOpen, service]);

  const fetchLogs = async () => {
    try {
      // For now, use mock logs since we don't have the backend endpoint yet
      const mockLogs = [
        `${new Date().toISOString()} - Service ${service?.name} is ${service?.status}`,
        `${new Date().toISOString()} - CPU: ${service?.cpu}%, Memory: ${service?.memory}%`,
        `${new Date().toISOString()} - Health check passed`,
        `${new Date().toISOString()} - No issues detected`,
        `${new Date().toISOString()} - All systems operational`,
      ];
      setLogs(mockLogs);
    } catch (error) {
      console.error('Error fetching logs:', error);
    }
  };

  if (!isOpen || !service) return null;

  return (
    <div className="modal-overlay">
      <div className="modal-content">
        <div className="modal-header">
          <h2>{service.name} Details</h2>
          <button onClick={onClose} className="close-button">×</button>
        </div>
        
        <div className="modal-body">
          <div className="service-info">
            <div className="info-item">
              <label>Status:</label>
              <span className={`status-badge ${service.status}`}>{service.status}</span>
            </div>
            <div className="info-item">
              <label>CPU Usage:</label>
              <span>{service.cpu}%</span>
            </div>
            <div className="info-item">
              <label>Memory Usage:</label>
              <span>{service.memory}%</span>
            </div>
            <div className="info-item">
              <label>Last Updated:</label>
              <span>{new Date().toLocaleString()}</span>
            </div>
          </div>

          <div className="logs-section">
            <h3>Recent Logs</h3>
            <div className="logs-container">
              {logs.map((log, index) => (
                <div key={index} className="log-entry">
                  {log}
                </div>
              ))}
            </div>
          </div>
        </div>
      </div>

      <style jsx>{`
        .modal-overlay {
          position: fixed;
          top: 0;
          left: 0;
          right: 0;
          bottom: 0;
          background: rgba(0, 0, 0, 0.5);
          display: flex;
          align-items: center;
          justify-content: center;
          z-index: 1000;
        }

        .modal-content {
          background: white;
          border-radius: 12px;
          width: 90%;
          max-width: 600px;
          max-height: 80vh;
          overflow: hidden;
        }

        .modal-header {
          display: flex;
          justify-content: space-between;
          align-items: center;
          padding: 20px;
          border-bottom: 1px solid #e5e7eb;
        }

        .modal-header h2 {
          margin: 0;
          color: #1f2937;
        }

        .close-button {
          background: none;
          border: none;
          font-size: 24px;
          cursor: pointer;
          color: #6b7280;
        }

        .modal-body {
          padding: 20px;
          max-height: 60vh;
          overflow-y: auto;
        }

        .service-info {
          display: grid;
          grid-template-columns: 1fr 1fr;
          gap: 15px;
          margin-bottom: 20px;
        }

        .info-item {
          display: flex;
          flex-direction: column;
        }

        .info-item label {
          font-weight: 600;
          color: #374151;
          margin-bottom: 5px;
        }

        .logs-section h3 {
          margin: 0 0 10px 0;
          color: #1f2937;
        }

        .logs-container {
          background: #f8fafc;
          border-radius: 6px;
          padding: 15px;
          max-height: 200px;
          overflow-y: auto;
        }

        .log-entry {
          font-family: monospace;
          font-size: 0.8rem;
          padding: 5px 0;
          border-bottom: 1px solid #e5e7eb;
        }

        .log-entry:last-child {
          border-bottom: none;
        }

        .service-name-button {
          background: none;
          border: none;
          font-weight: 600;
          color: #1f2937;
          cursor: pointer;
          text-align: left;
          padding: 0;
        }

        .service-name-button:hover {
          color: #3b82f6;
        }
      `}</style>
    </div>
  );
}