// frontend/src/components/Dashboard.tsx
'use client';

import { useState, useEffect } from 'react';

interface Service {
  id: number;
  name: string;
  status: string;
  cpu: number;
  memory: number;
}

export default function Dashboard() {
  const [services, setServices] = useState<Service[]>([
    { id: 1, name: 'Auth Service', status: 'running', cpu: 25, memory: 45 },
    { id: 2, name: 'API Gateway', status: 'running', cpu: 30, memory: 60 },
    { id: 3, name: 'User Service', status: 'running', cpu: 15, memory: 35 },
    { id: 4, name: 'Payment Service', status: 'running', cpu: 20, memory: 30 }
  ]);
  const [loading, setLoading] = useState(false);

  // Calculate stats
  const totalServices = services.length;
  const runningServices = services.filter(s => s.status === 'running').length;
  const deployingServices = services.filter(s => s.status === 'deploying' || s.status === 'restarting').length;
  const failedServices = services.filter(s => s.status === 'failed').length;

  if (loading) {
    return (
      <div style={{ 
        minHeight: '100vh', 
        background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
        display: 'flex',
        alignItems: 'center',
        justifyContent: 'center',
        color: 'white',
        fontSize: '18px'
      }}>
        Loading services...
      </div>
    );
  }

  return (
    <div style={{
      minHeight: '100vh',
      background: 'linear-gradient(135deg, #667eea 0%, #764ba2 100%)',
      padding: '20px',
      fontFamily: '-apple-system, BlinkMacSystemFont, "Segoe UI", Roboto, sans-serif'
    }}>
      {/* Header */}
      <header style={{
        textAlign: 'center',
        marginBottom: '30px',
        color: 'white'
      }}>
        <h1 style={{
          fontSize: '3rem',
          fontWeight: 700,
          margin: 0,
          background: 'linear-gradient(45deg, #fff, #e0e7ff)',
          WebkitBackgroundClip: 'text',
          WebkitTextFillColor: 'transparent'
        }}>
          PipeOps
        </h1>
        <p style={{
          fontSize: '1.2rem',
          opacity: 0.9,
          margin: '10px 0 0 0'
        }}>
          DevOps Dashboard
        </p>
      </header>

      {/* Stats Cards */}
      <div style={{
        display: 'grid',
        gridTemplateColumns: 'repeat(auto-fit, minmax(200px, 1fr))',
        gap: '20px',
        marginBottom: '30px'
      }}>
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{
            margin: '0 0 10px 0',
            color: '#6b7280',
            fontSize: '0.9rem',
            textTransform: 'uppercase'
          }}>
            Total Services
          </h3>
          <div style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#1f2937'
          }}>
            {totalServices}
          </div>
        </div>
        
        <div style={{
          background: 'white',
          padding: '25px',
          borderRadius: '12px',
          boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)',
          textAlign: 'center'
        }}>
          <h3 style={{
            margin: '0 0 10px 0',
            color: '#6b7280',
            fontSize: '0.9rem',
            textTransform: 'uppercase'
          }}>
            Running
          </h3>
          <div style={{
            fontSize: '2.5rem',
            fontWeight: 700,
            color: '#10b981'
          }}>
            {runningServices}
          </div>
        </div>
      </div>

      {/* Services Table */}
      <div style={{
        background: 'white',
        borderRadius: '12px',
        padding: '30px',
        boxShadow: '0 4px 6px rgba(0, 0, 0, 0.1)'
      }}>
        <h2 style={{
          margin: '0 0 20px 0',
          color: '#1f2937',
          fontSize: '1.5rem'
        }}>
          Service Status
        </h2>
        
        <div style={{ overflowX: 'auto' }}>
          <table style={{
            width: '100%',
            borderCollapse: 'collapse'
          }}>
            <thead>
              <tr>
                <th style={{
                  background: '#f8fafc',
                  padding: '15px',
                  textAlign: 'left',
                  fontWeight: 600,
                  color: '#374151',
                  borderBottom: '2px solid #e5e7eb',
                  textTransform: 'uppercase',
                  fontSize: '0.8rem'
                }}>
                  SERVICE
                </th>
                <th style={{
                  background: '#f8fafc',
                  padding: '15px',
                  textAlign: 'left',
                  fontWeight: 600,
                  color: '#374151',
                  borderBottom: '2px solid #e5e7eb',
                  textTransform: 'uppercase',
                  fontSize: '0.8rem'
                }}>
                  STATUS
                </th>
                <th style={{
                  background: '#f8fafc',
                  padding: '15px',
                  textAlign: 'left',
                  fontWeight: 600,
                  color: '#374151',
                  borderBottom: '2px solid #e5e7eb',
                  textTransform: 'uppercase',
                  fontSize: '0.8rem'
                }}>
                  CPU
                </th>
                <th style={{
                  background: '#f8fafc',
                  padding: '15px',
                  textAlign: 'left',
                  fontWeight: 600,
                  color: '#374151',
                  borderBottom: '2px solid #e5e7eb',
                  textTransform: 'uppercase',
                  fontSize: '0.8rem'
                }}>
                  MEMORY
                </th>
              </tr>
            </thead>
            <tbody>
              {services.map((service) => (
                <tr key={service.id}>
                  <td style={{
                    padding: '15px',
                    borderBottom: '1px solid #e5e7eb',
                    fontWeight: 600,
                    color: '#1f2937'
                  }}>
                    {service.name}
                  </td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #e5e7eb' }}>
                    <span style={{
                      padding: '6px 12px',
                      borderRadius: '20px',
                      fontSize: '0.8rem',
                      fontWeight: 600,
                      background: '#d1fae5',
                      color: '#065f46'
                    }}>
                      {service.status}
                    </span>
                  </td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #e5e7eb' }}>
                    {service.cpu}%
                  </td>
                  <td style={{ padding: '15px', borderBottom: '1px solid #e5e7eb' }}>
                    {service.memory}%
                  </td>
                </tr>
              ))}
            </tbody>
          </table>
        </div>
      </div>

      {/* Footer Tips */}
      <div style={{
        background: 'rgba(255, 255, 255, 0.1)',
        padding: '20px',
        borderRadius: '8px',
        color: 'white',
        textAlign: 'center',
        marginTop: '20px'
      }}>
        <p style={{ margin: '5px 0', opacity: 0.9 }}>
          🚀 PipeOps DevOps Dashboard is running!
        </p>
        <p style={{ margin: '5px 0', opacity: 0.9 }}>
          Next: Connect to backend API for real data
        </p>
      </div>
    </div>
  );
}