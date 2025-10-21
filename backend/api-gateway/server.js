// backend/api-gateway/server.js
const express = require('express');
const cors = require('cors');
const WebSocket = require('ws');
const app = express();

app.use(cors());
app.use(express.json());

// In-memory database (replace with real database later)
let services = [
  { 
    id: 1, 
    name: 'Auth Service', 
    status: 'running', 
    cpu: 25, 
    memory: 45,
    port: 3001,
    version: '1.2.0',
    lastRestart: new Date().toISOString(),
    uptime: '5 days 2 hours',
    endpoint: 'http://auth-service:3001',
    replicas: 2,
    autoScaling: {
      enabled: false,
      minReplicas: 1,
      maxReplicas: 10,
      targetCPU: 70,
      targetMemory: 80
    },
    metricsHistory: {
      cpu: Array(30).fill(0).map(() => Math.random() * 50 + 20),
      memory: Array(30).fill(0).map(() => Math.random() * 40 + 30),
      timestamp: Array(30).fill(0).map((_, i) => new Date(Date.now() - i * 60000).toISOString())
    }
  },
  { 
    id: 2, 
    name: 'API Gateway', 
    status: 'running', 
    cpu: 30, 
    memory: 60,
    port: 5000,
    version: '1.0.0',
    lastRestart: new Date().toISOString(),
    uptime: '2 days 8 hours',
    endpoint: 'http://localhost:5000',
    replicas: 1,
    autoScaling: {
      enabled: true,
      minReplicas: 1,
      maxReplicas: 5,
      targetCPU: 75,
      targetMemory: 85
    },
    metricsHistory: {
      cpu: Array(30).fill(0).map(() => Math.random() * 60 + 25),
      memory: Array(30).fill(0).map(() => Math.random() * 50 + 35),
      timestamp: Array(30).fill(0).map((_, i) => new Date(Date.now() - i * 60000).toISOString())
    }
  },
  { 
    id: 3, 
    name: 'User Service', 
    status: 'deploying', 
    cpu: 15, 
    memory: 35,
    port: 3002,
    version: '1.1.5',
    lastRestart: new Date().toISOString(),
    uptime: '1 hour 15 minutes',
    endpoint: 'http://user-service:3002',
    replicas: 3,
    autoScaling: {
      enabled: true,
      minReplicas: 2,
      maxReplicas: 8,
      targetCPU: 65,
      targetMemory: 75
    },
    metricsHistory: {
      cpu: Array(30).fill(0).map(() => Math.random() * 30 + 10),
      memory: Array(30).fill(0).map(() => Math.random() * 25 + 20),
      timestamp: Array(30).fill(0).map((_, i) => new Date(Date.now() - i * 60000).toISOString())
    }
  },
  { 
    id: 4, 
    name: 'Payment Service', 
    status: 'running', 
    cpu: 20, 
    memory: 30,
    port: 3003,
    version: '1.3.2',
    lastRestart: new Date().toISOString(),
    uptime: '7 days 12 hours',
    endpoint: 'http://payment-service:3003',
    replicas: 2,
    autoScaling: {
      enabled: false,
      minReplicas: 1,
      maxReplicas: 4,
      targetCPU: 80,
      targetMemory: 90
    },
    metricsHistory: {
      cpu: Array(30).fill(0).map(() => Math.random() * 40 + 15),
      memory: Array(30).fill(0).map(() => Math.random() * 35 + 25),
      timestamp: Array(30).fill(0).map((_, i) => new Date(Date.now() - i * 60000).toISOString())
    }
  }
];

let deployments = [
  {
    id: 1,
    service: 'Auth Service',
    status: 'success',
    timestamp: new Date(Date.now() - 2 * 60 * 60 * 1000).toISOString(),
    version: 'v1.2.0',
    duration: '2m 15s',
    commit: 'a1b2c3d4',
    deployedBy: 'admin',
    logs: [
      '2024-01-15T14:30:00Z - Deployment started',
      '2024-01-15T14:31:15Z - Building container image',
      '2024-01-15T14:32:00Z - Image pushed to registry',
      '2024-01-15T14:32:15Z - Service updated successfully'
    ]
  },
  {
    id: 2,
    service: 'API Gateway',
    status: 'in-progress',
    timestamp: new Date().toISOString(),
    version: 'v1.1.5',
    duration: '1m 45s',
    commit: 'e5f6g7h8',
    deployedBy: 'ci-cd',
    logs: [
      '2024-01-15T14:25:00Z - Deployment started',
      '2024-01-15T14:26:00Z - Building container image',
      '2024-01-15T14:26:45Z - Image pushed to registry'
    ]
  },
  {
    id: 3,
    service: 'User Service',
    status: 'failed',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    version: 'v1.3.2',
    duration: '3m 10s',
    commit: 'i9j0k1l2',
    deployedBy: 'developer',
    logs: [
      '2024-01-15T14:20:00Z - Deployment started',
      '2024-01-15T14:21:30Z - Building container image',
      '2024-01-15T14:22:45Z - Health check failed',
      '2024-01-15T14:23:10Z - Deployment rolled back'
    ]
  }
];

let events = [
  {
    id: 1,
    type: 'service_restart',
    service: 'Auth Service',
    message: 'Service restarted successfully',
    timestamp: new Date().toISOString(),
    severity: 'info'
  },
  {
    id: 2,
    type: 'deployment_started',
    service: 'User Service',
    message: 'Deployment v1.3.2 started',
    timestamp: new Date(Date.now() - 10 * 60 * 1000).toISOString(),
    severity: 'info'
  },
  {
    id: 3,
    type: 'deployment_failed',
    service: 'User Service',
    message: 'Deployment v1.3.2 failed - Health check timeout',
    timestamp: new Date(Date.now() - 5 * 60 * 1000).toISOString(),
    severity: 'error'
  },
  {
    id: 4,
    type: 'anomaly_detected',
    service: 'API Gateway',
    message: 'High CPU usage detected (85%)',
    timestamp: new Date(Date.now() - 2 * 60 * 1000).toISOString(),
    severity: 'warning'
  }
];

let anomalies = [
  {
    id: 1,
    service: 'API Gateway',
    type: 'cpu_spike',
    severity: 'high',
    message: 'Unusual CPU spike detected - 85% utilization',
    timestamp: new Date().toISOString(),
    confidence: 92,
    resolved: false
  },
  {
    id: 2,
    service: 'User Service',
    type: 'memory_leak',
    severity: 'medium',
    message: 'Potential memory leak detected - steady increase over 2 hours',
    timestamp: new Date(Date.now() - 30 * 60 * 1000).toISOString(),
    confidence: 78,
    resolved: false
  }
];

// WebSocket Server
const wss = new WebSocket.Server({ port: 8080 });
const clients = new Set();

wss.on('connection', (ws) => {
  console.log('🔌 WebSocket client connected');
  clients.add(ws);
  
  // Send initial data
  ws.send(JSON.stringify({
    type: 'services_update',
    payload: services
  }));

  ws.send(JSON.stringify({
    type: 'anomalies_update',
    payload: anomalies
  }));

  // Heartbeat
  const heartbeat = setInterval(() => {
    if (ws.readyState === WebSocket.OPEN) {
      ws.send(JSON.stringify({ type: 'heartbeat', payload: 'ping' }));
    }
  }, 30000);

  ws.on('close', () => {
    console.log('🔌 WebSocket client disconnected');
    clients.delete(ws);
    clearInterval(heartbeat);
  });

  ws.on('error', (error) => {
    console.error('WebSocket error:', error);
    clients.delete(ws);
  });
});

// Broadcast function
function broadcastToClients(type, payload) {
  clients.forEach(client => {
    if (client.readyState === WebSocket.OPEN) {
      client.send(JSON.stringify({ type, payload }));
    }
  });
}

// ==================== UTILITY FUNCTIONS ====================

// Simulate realistic metric fluctuations
function simulateMetrics() {
  services.forEach(service => {
    if (service.status === 'running') {
      // Realistic CPU fluctuations (5-80%)
      const cpuChange = (Math.random() * 6 - 3);
      service.cpu = Math.max(5, Math.min(80, service.cpu + cpuChange));
      
      // Realistic Memory fluctuations (10-90%)
      const memoryChange = (Math.random() * 4 - 2);
      service.memory = Math.max(10, Math.min(90, service.memory + memoryChange));
      
      // Update metrics history
      service.metricsHistory.cpu.push(service.cpu);
      service.metricsHistory.memory.push(service.memory);
      service.metricsHistory.timestamp.push(new Date().toISOString());
      
      // Keep only last 30 data points
      if (service.metricsHistory.cpu.length > 30) {
        service.metricsHistory.cpu.shift();
        service.metricsHistory.memory.shift();
        service.metricsHistory.timestamp.shift();
      }
      
      // Auto-scaling simulation
      if (service.autoScaling.enabled) {
        simulateAutoScaling(service);
      }
      
      // Anomaly detection
      detectAnomalies(service);
    } else if (service.status === 'deploying') {
      // Simulate deployment progress
      service.cpu = 10 + Math.random() * 10;
      service.memory = 20 + Math.random() * 15;
    }
  });
}

// Simulate auto-scaling behavior
function simulateAutoScaling(service) {
  const { targetCPU, targetMemory, minReplicas, maxReplicas } = service.autoScaling;
  
  // Simple scaling logic based on CPU and memory
  const shouldScaleUp = service.cpu > targetCPU || service.memory > targetMemory;
  const shouldScaleDown = service.cpu < targetCPU * 0.6 && service.memory < targetMemory * 0.6;
  
  if (shouldScaleUp && service.replicas < maxReplicas) {
    service.replicas++;
    events.push({
      id: events.length + 1,
      type: 'service_scaled',
      service: service.name,
      message: `Auto-scaled UP to ${service.replicas} replicas (CPU: ${service.cpu.toFixed(1)}%, Memory: ${service.memory.toFixed(1)}%)`,
      timestamp: new Date().toISOString(),
      severity: 'info'
    });
    broadcastToClients('service_scaled', service);
  } else if (shouldScaleDown && service.replicas > minReplicas) {
    service.replicas--;
    events.push({
      id: events.length + 1,
      type: 'service_scaled',
      service: service.name,
      message: `Auto-scaled DOWN to ${service.replicas} replicas (CPU: ${service.cpu.toFixed(1)}%, Memory: ${service.memory.toFixed(1)}%)`,
      timestamp: new Date().toISOString(),
      severity: 'info'
    });
    broadcastToClients('service_scaled', service);
  }
}

// AI-powered anomaly detection
function detectAnomalies(service) {
  // Simulate occasional anomalies
  if (Math.random() > 0.95) {
    const anomalyTypes = ['cpu_spike', 'memory_leak', 'high_latency', 'error_rate_spike'];
    const severities = ['low', 'medium', 'high'];
    
    const newAnomaly = {
      id: anomalies.length + 1,
      service: service.name,
      type: anomalyTypes[Math.floor(Math.random() * anomalyTypes.length)],
      severity: severities[Math.floor(Math.random() * severities.length)],
      message: `AI detected anomaly in ${service.name} - ${service.cpu.toFixed(1)}% CPU, ${service.memory.toFixed(1)}% Memory`,
      timestamp: new Date().toISOString(),
      confidence: Math.floor(Math.random() * 30) + 70,
      resolved: false
    };
    
    anomalies.push(newAnomaly);
    events.push({
      id: events.length + 1,
      type: 'anomaly_detected',
      service: service.name,
      message: newAnomaly.message,
      timestamp: new Date().toISOString(),
      severity: newAnomaly.severity
    });
    
    broadcastToClients('anomaly_detected', newAnomaly);
    broadcastToClients('anomalies_update', anomalies);
  }
}

// Update deployment statuses
function updateDeployments() {
  deployments.forEach(deployment => {
    if (deployment.status === 'in-progress') {
      // Randomly complete some deployments
      if (Math.random() > 0.7) {
        deployment.status = Math.random() > 0.2 ? 'success' : 'failed';
        deployment.timestamp = new Date().toISOString();
        
        // Add completion log
        if (deployment.status === 'success') {
          deployment.logs.push(`${new Date().toISOString()} - Deployment completed successfully`);
        } else {
          deployment.logs.push(`${new Date().toISOString()} - Deployment failed`);
        }
        
        // Add event for deployment completion
        events.push({
          id: events.length + 1,
          type: deployment.status === 'success' ? 'deployment_success' : 'deployment_failed',
          service: deployment.service,
          message: `Deployment ${deployment.version} ${deployment.status === 'success' ? 'completed' : 'failed'}`,
          timestamp: new Date().toISOString(),
          severity: deployment.status === 'success' ? 'info' : 'error'
        });
        
        broadcastToClients('deployment_updated', deployment);
      }
    }
  });
}

// ==================== SERVICE ENDPOINTS ====================

// Get all services
app.get('/api/services', (req, res) => {
  simulateMetrics();
  res.json(services);
});

// Get specific service by ID
app.get('/api/services/:id', (req, res) => {
  const serviceId = parseInt(req.params.id);
  const service = services.find(s => s.id === serviceId);
  
  if (service) {
    simulateMetrics(); // Update metrics for this service too
    res.json(service);
  } else {
    res.status(404).json({ error: 'Service not found' });
  }
});

// Get service metrics history
app.get('/api/services/:id/metrics', (req, res) => {
  const serviceId = parseInt(req.params.id);
  const service = services.find(s => s.id === serviceId);
  
  if (service) {
    res.json(service.metricsHistory);
  } else {
    res.status(404).json({ error: 'Service not found' });
  }
});

// Restart a service
app.post('/api/services/:id/restart', (req, res) => {
  const serviceId = parseInt(req.params.id);
  const service = services.find(s => s.id === serviceId);
  
  if (service) {
    const oldStatus = service.status;
    service.status = 'restarting';
    service.cpu = 5;
    service.memory = 15;
    
    // Add restart event
    events.push({
      id: events.length + 1,
      type: 'service_restart',
      service: service.name,
      message: 'Service restart initiated',
      timestamp: new Date().toISOString(),
      severity: 'warning'
    });
    
    broadcastToClients('service_status_changed', service);
    
    // Simulate restart process (3 seconds)
    setTimeout(() => {
      service.status = 'running';
      service.lastRestart = new Date().toISOString();
      service.cpu = 15 + Math.random() * 20;
      service.memory = 20 + Math.random() * 30;
      service.uptime = '0 minutes';
      
      // Add success event
      events.push({
        id: events.length + 1,
        type: 'service_restart',
        service: service.name,
        message: 'Service restarted successfully',
        timestamp: new Date().toISOString(),
        severity: 'info'
      });
      
      broadcastToClients('service_status_changed', service);
      broadcastToClients('services_update', services);
    }, 3000);
    
    res.json({ 
      message: `Restarting ${service.name}`,
      service 
    });
  } else {
    res.status(404).json({ error: 'Service not found' });
  }
});

// Scale a service
app.post('/api/services/:id/scale', (req, res) => {
  const serviceId = parseInt(req.params.id);
  const { replicas } = req.body;
  const service = services.find(s => s.id === serviceId);
  
  if (service) {
    const oldReplicas = service.replicas;
    service.replicas = replicas;
    
    // Add scaling event
    events.push({
      id: events.length + 1,
      type: 'service_scaled',
      service: service.name,
      message: `Service scaled from ${oldReplicas} to ${replicas} replicas`,
      timestamp: new Date().toISOString(),
      severity: 'info'
    });
    
    broadcastToClients('service_scaled', service);
    
    res.json({ 
      message: `Scaled ${service.name} from ${oldReplicas} to ${replicas} replicas`,
      service 
    });
  } else {
    res.status(404).json({ error: 'Service not found' });
  }
});

// Update auto-scaling configuration
app.post('/api/services/:id/autoscaling', (req, res) => {
  const serviceId = parseInt(req.params.id);
  const config = req.body;
  const service = services.find(s => s.id === serviceId);
  
  if (service) {
    service.autoScaling = { ...service.autoScaling, ...config };
    
    events.push({
      id: events.length + 1,
      type: 'autoscaling_updated',
      service: service.name,
      message: `Auto-scaling ${config.enabled ? 'enabled' : 'disabled'}`,
      timestamp: new Date().toISOString(),
      severity: 'info'
    });
    
    broadcastToClients('autoscaling_updated', service);
    
    res.json({ 
      message: 'Auto-scaling configuration updated',
      config: service.autoScaling
    });
  } else {
    res.status(404).json({ error: 'Service not found' });
  }
});

// Get service logs
app.get('/api/services/:id/logs', (req, res) => {
  const serviceId = parseInt(req.params.id);
  const service = services.find(s => s.id === serviceId);
  
  if (service) {
    const logs = [
      `${new Date().toISOString()} - INFO - Service ${service.name} is ${service.status}`,
      `${new Date().toISOString()} - INFO - CPU: ${service.cpu}%, Memory: ${service.memory}%`,
      `${new Date().toISOString()} - INFO - Health check passed`,
      `${new Date(Date.now() - 60000).toISOString()} - DEBUG - Processing incoming requests`,
      `${new Date(Date.now() - 120000).toISOString()} - INFO - Metrics collection completed`,
      `${new Date(Date.now() - 180000).toISOString()} - INFO - Connection pool: 50 active, 10 idle`,
    ];
    res.json({ logs });
  } else {
    res.status(404).json({ error: 'Service not found' });
  }
});

// Search service logs
app.get('/api/services/:id/logs/search', (req, res) => {
  const { query, level, from, to } = req.query;
  
  // Simulate log search
  const logs = Array.from({ length: 50 }, (_, i) => ({
    timestamp: new Date(Date.now() - i * 60000).toISOString(),
    level: ['INFO', 'WARN', 'ERROR'][Math.floor(Math.random() * 3)],
    message: `Log entry ${i} - ${query || 'processing request'}`,
    service: `Service ${req.params.id}`
  })).filter(log => {
    if (level && log.level !== level) return false;
    if (query && !log.message.includes(query)) return false;
    return true;
  });
  
  res.json({ logs, total: logs.length });
});

// ==================== DEPLOYMENT ENDPOINTS ====================

// Get all deployments
app.get('/api/deployments', (req, res) => {
  updateDeployments();
  res.json(deployments);
});

// Start a new deployment
app.post('/api/deploy', (req, res) => {
  const { serviceName, version, commit } = req.body;
  
  const newDeployment = {
    id: deployments.length + 1,
    service: serviceName,
    status: 'in-progress',
    timestamp: new Date().toISOString(),
    version: version || 'v1.0.0',
    duration: '0s',
    commit: commit || 'abc123def',
    deployedBy: 'user',
    logs: [
      `${new Date().toISOString()} - Deployment started`
    ]
  };
  
  deployments.unshift(newDeployment); // Add to beginning
  
  // Add deployment event
  events.push({
    id: events.length + 1,
    type: 'deployment_started',
    service: serviceName,
    message: `Deployment ${version} started`,
    timestamp: new Date().toISOString(),
    severity: 'info'
  });
  
  broadcastToClients('deployment_started', newDeployment);
  
  res.json({ 
    success: true, 
    message: `Deployment started for ${serviceName} ${version}`,
    deployment: newDeployment
  });
});

// Get deployment by ID
app.get('/api/deployments/:id', (req, res) => {
  const deploymentId = parseInt(req.params.id);
  const deployment = deployments.find(d => d.id === deploymentId);
  
  if (deployment) {
    res.json(deployment);
  } else {
    res.status(404).json({ error: 'Deployment not found' });
  }
});

// Get deployment logs
app.get('/api/deployments/:id/logs', (req, res) => {
  const deploymentId = parseInt(req.params.id);
  const deployment = deployments.find(d => d.id === deploymentId);
  
  if (deployment) {
    res.json({ logs: deployment.logs });
  } else {
    res.status(404).json({ error: 'Deployment not found' });
  }
});

// ==================== AI & ANALYTICS ENDPOINTS ====================

// Get AI-detected anomalies
app.get('/api/anomalies', (req, res) => {
  const { resolved } = req.query;
  let filteredAnomalies = anomalies;
  
  if (resolved !== undefined) {
    filteredAnomalies = anomalies.filter(a => a.resolved === (resolved === 'true'));
  }
  
  res.json(filteredAnomalies);
});

// Resolve an anomaly
app.post('/api/anomalies/:id/resolve', (req, res) => {
  const anomalyId = parseInt(req.params.id);
  const anomaly = anomalies.find(a => a.id === anomalyId);
  
  if (anomaly) {
    anomaly.resolved = true;
    anomaly.resolvedAt = new Date().toISOString();
    
    events.push({
      id: events.length + 1,
      type: 'anomaly_resolved',
      service: anomaly.service,
      message: `Anomaly resolved: ${anomaly.message}`,
      timestamp: new Date().toISOString(),
      severity: 'info'
    });
    
    broadcastToClients('anomaly_resolved', anomaly);
    broadcastToClients('anomalies_update', anomalies);
    
    res.json({ 
      message: 'Anomaly resolved successfully',
      anomaly 
    });
  } else {
    res.status(404).json({ error: 'Anomaly not found' });
  }
});

// Performance analytics
app.get('/api/analytics/performance', (req, res) => {
  const totalCPU = services.reduce((sum, service) => sum + service.cpu, 0) / services.length;
  const totalMemory = services.reduce((sum, service) => sum + service.memory, 0) / services.length;
  const runningServices = services.filter(s => s.status === 'running').length;
  
  const analytics = {
    uptime: 99.95 - (services.length - runningServices) * 0.1,
    performance: 85 + (runningServices / services.length) * 15,
    errorRate: (services.length - runningServices) * 0.05,
    responseTime: 120 + Math.random() * 50,
    throughput: 1000 + Math.random() * 500,
    trends: {
      uptime: runningServices === services.length ? '+0.1%' : '-0.2%',
      performance: runningServices === services.length ? '+2.3%' : '-1.5%',
      errorRate: runningServices === services.length ? '-0.05%' : '+0.1%'
    }
  };
  
  res.json(analytics);
});

// System predictions
app.get('/api/analytics/predictions', (req, res) => {
  const predictions = {
    cpuUsage: {
      current: services.reduce((sum, s) => sum + s.cpu, 0) / services.length,
      predicted: Math.min(85, services.reduce((sum, s) => sum + s.cpu, 0) / services.length + 10),
      trend: 'increasing'
    },
    memoryUsage: {
      current: services.reduce((sum, s) => sum + s.memory, 0) / services.length,
      predicted: Math.min(90, services.reduce((sum, s) => sum + s.memory, 0) / services.length + 5),
      trend: 'stable'
    },
    scalingRecommendations: services.map(service => ({
      service: service.name,
      recommendation: service.cpu > 70 ? 'scale-up' : service.cpu < 30 ? 'scale-down' : 'maintain',
      confidence: Math.floor(Math.random() * 30) + 70
    }))
  };
  
  res.json(predictions);
});

// ==================== SYSTEM ENDPOINTS ====================

// Health check endpoint
app.get('/api/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
    version: '1.0.0',
    environment: process.env.NODE_ENV || 'development',
    websocketClients: clients.size
  });
});

// System metrics
app.get('/api/system/metrics', (req, res) => {
  simulateMetrics();
  
  const totalCPU = services.reduce((sum, service) => sum + service.cpu, 0) / services.length;
  const totalMemory = services.reduce((sum, service) => sum + service.memory, 0) / services.length;
  const runningServices = services.filter(s => s.status === 'running').length;
  
  res.json({
    system: {
      totalServices: services.length,
      runningServices: runningServices,
      deployingServices: services.filter(s => s.status === 'deploying').length,
      failedServices: services.filter(s => s.status === 'failed').length,
      totalCPU: Math.round(totalCPU),
      totalMemory: Math.round(totalMemory),
      health: runningServices === services.length ? 'healthy' : 'degraded',
      activeAnomalies: anomalies.filter(a => !a.resolved).length
    },
    services: services.map(s => ({
      name: s.name,
      status: s.status,
      cpu: s.cpu,
      memory: s.memory,
      replicas: s.replicas
    }))
  });
});

// Get system events
app.get('/api/events', (req, res) => {
  const limit = parseInt(req.query.limit) || 50;
  const severity = req.query.severity;
  
  let filteredEvents = events;
  
  if (severity) {
    filteredEvents = events.filter(event => event.severity === severity);
  }
  
  const limitedEvents = filteredEvents.slice(-limit).reverse(); // Get latest events, newest first
  
  res.json({
    events: limitedEvents,
    total: events.length,
    filtered: filteredEvents.length
  });
});

// ==================== DASHBOARD ENDPOINTS ====================

// Dashboard overview
app.get('/api/dashboard/overview', (req, res) => {
  simulateMetrics();
  updateDeployments();
  
  const runningServices = services.filter(s => s.status === 'running').length;
  const totalCPU = services.reduce((sum, service) => sum + service.cpu, 0) / services.length;
  const totalMemory = services.reduce((sum, service) => sum + service.memory, 0) / services.length;
  
  res.json({
    stats: {
      totalServices: services.length,
      runningServices: runningServices,
      deployingServices: services.filter(s => s.status === 'deploying').length,
      failedServices: services.filter(s => s.status === 'failed').length,
      systemHealth: runningServices === services.length ? 'healthy' : 'degraded',
      totalCPU: Math.round(totalCPU),
      totalMemory: Math.round(totalMemory),
      activeAnomalies: anomalies.filter(a => !a.resolved).length
    },
    recentDeployments: deployments.slice(0, 5), // Last 5 deployments
    recentEvents: events.slice(-10).reverse(), // Last 10 events, newest first
    criticalAlerts: anomalies.filter(a => !a.resolved && a.severity === 'high').slice(0, 3)
  });
});

// ==================== SETTINGS ENDPOINTS ====================

let settings = {
  autoRefresh: true,
  refreshInterval: 5,
  theme: 'light',
  notifications: true,
  apiUrl: 'http://localhost:5000',
  aiMonitoring: true,
  autoScaling: true,
  alertThresholds: {
    cpu: 80,
    memory: 85,
    disk: 90
  }
};

// Get settings
app.get('/api/settings', (req, res) => {
  res.json(settings);
});

// Update settings
app.post('/api/settings', (req, res) => {
  const newSettings = req.body;
  settings = { ...settings, ...newSettings };
  
  events.push({
    id: events.length + 1,
    type: 'settings_updated',
    service: 'System',
    message: 'Dashboard settings updated',
    timestamp: new Date().toISOString(),
    severity: 'info'
  });
  
  res.json({
    message: 'Settings updated successfully',
    settings: settings
  });
});

// ==================== ERROR HANDLING ====================

// 404 handler
app.use('*', (req, res) => {
  res.status(404).json({
    error: 'Endpoint not found',
    path: req.originalUrl,
    availableEndpoints: [
      'GET  /api/services',
      'GET  /api/services/:id',
      'GET  /api/services/:id/metrics',
      'POST /api/services/:id/restart',
      'POST /api/services/:id/scale',
      'POST /api/services/:id/autoscaling',
      'GET  /api/services/:id/logs',
      'GET  /api/deployments',
      'POST /api/deploy',
      'GET  /api/deployments/:id/logs',
      'GET  /api/anomalies',
      'POST /api/anomalies/:id/resolve',
      'GET  /api/analytics/performance',
      'GET  /api/analytics/predictions',
      'GET  /api/health',
      'GET  /api/system/metrics',
      'GET  /api/events',
      'GET  /api/dashboard/overview',
      'GET  /api/settings',
      'POST /api/settings'
    ]
  });
});

// Error handler
app.use((err, req, res, next) => {
  console.error('Error:', err);
  res.status(500).json({
    error: 'Internal server error',
    message: err.message,
    timestamp: new Date().toISOString()
  });
});

// ==================== START SERVERS ====================

const PORT = process.env.PORT || 5000;

// Start Express server
const expressServer = app.listen(PORT, () => {
  console.log(`🚀 PipeOps Backend Server running on http://localhost:${PORT}`);
  console.log(`🔌 WebSocket Server running on ws://localhost:8080`);
  console.log(`\n📊 Available Endpoints:`);
  console.log(`   GET  /api/services           - Get all services`);
  console.log(`   POST /api/services/:id/restart - Restart a service`);
  console.log(`   POST /api/services/:id/autoscaling - Configure auto-scaling`);
  console.log(`   GET  /api/deployments        - Get deployment history`);
  console.log(`   POST /api/deploy             - Start new deployment`);
  console.log(`   GET  /api/anomalies          - Get AI-detected anomalies`);
  console.log(`   GET  /api/analytics/performance - Performance analytics`);
  console.log(`   GET  /api/health             - Health check`);
  console.log(`   GET  /api/system/metrics     - System metrics`);
  console.log(`   GET  /api/dashboard/overview - Dashboard overview`);
  console.log(`   GET  /api/events             - System events`);
  console.log(`   GET  /api/settings           - Get settings`);
  console.log(`   POST /api/settings           - Update settings`);
  console.log(`\n💡 Try: curl http://localhost:${PORT}/api/health`);
  console.log(`💡 Try: curl http://localhost:${PORT}/api/dashboard/overview`);
});

// Graceful shutdown
process.on('SIGTERM', () => {
  console.log('SIGTERM received, shutting down gracefully...');
  expressServer.close(() => {
    console.log('Express server closed');
    wss.close(() => {
      console.log('WebSocket server closed');
      process.exit(0);
    });
  });
});