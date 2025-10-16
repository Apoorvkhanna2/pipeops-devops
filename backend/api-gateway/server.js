const express = require('express');
const cors = require('cors');
const http = require('http');
const socketIo = require('socket.io');

const app = express();
const server = http.createServer(app);
const io = socketIo(server, {
  cors: {
    origin: "http://localhost:3000",
    methods: ["GET", "POST"]
  }
});

// Middleware
app.use(cors());
app.use(express.json());

// Mock database
let services = [
  { id: 1, name: 'Auth Service', status: 'running', cpu: 25, memory: 45 },
  { id: 2, name: 'API Gateway', status: 'running', cpu: 30, memory: 60 },
  { id: 3, name: 'User Service', status: 'deploying', cpu: 15, memory: 35 },
  { id: 4, name: 'Payment Service', status: 'failed', cpu: 0, memory: 0 }
];

// API Routes
app.get('/api/services', (req, res) => {
  res.json(services);
});

app.post('/api/deploy', (req, res) => {
  const { serviceName } = req.body;
  
  // Simulate deployment process
  const newService = {
    id: services.length + 1,
    name: serviceName,
    status: 'deploying',
    cpu: 0,
    memory: 0
  };
  
  services.push(newService);
  
  // Broadcast update to all connected clients
  io.emit('services-update', services);
  
  res.json({ 
    success: true, 
    message: `Deployment started for ${serviceName}`,
    service: newService
  });
});

app.post('/api/services/:id/restart', (req, res) => {
  const serviceId = parseInt(req.params.id);
  const service = services.find(s => s.id === serviceId);
  
  if (service && service.status === 'failed') {
    service.status = 'running';
    service.cpu = 20;
    service.memory = 30;
    
    io.emit('services-update', services);
    res.json({ success: true, message: `Service ${service.name} restarted` });
  } else {
    res.status(400).json({ success: false, message: 'Cannot restart this service' });
  }
});

// Health check endpoint
app.get('/health', (req, res) => {
  res.json({ 
    status: 'healthy', 
    message: 'PipeOps API is running',
    timestamp: new Date().toISOString(),
    services: services.length
  });
});

// WebSocket for real-time updates
io.on('connection', (socket) => {
  console.log('Client connected to WebSocket');
  
  // Send current services to new client
  socket.emit('services-update', services);
  
  // Simulate real-time metric changes
  const interval = setInterval(() => {
    services.forEach(service => {
      if (service.status === 'running') {
        // Small random fluctuations in metrics
        service.cpu = Math.max(10, Math.min(80, service.cpu + (Math.random() - 0.5) * 10));
        service.memory = Math.max(15, Math.min(85, service.memory + (Math.random() - 0.5) * 8));
      }
    });
    
    // Send updated metrics to all clients
    io.emit('services-update', services);
  }, 5000);
  
  socket.on('disconnect', () => {
    console.log('Client disconnected from WebSocket');
    clearInterval(interval);
  });
});

const PORT = 5000;
server.listen(PORT, () => {
  console.log('🚀 PipeOps Backend API running on http://localhost:' + PORT);
  console.log('📊 Services API: http://localhost:' + PORT + '/api/services');
  console.log('❤️  Health Check: http://localhost:' + PORT + '/health');
  console.log('🔌 WebSocket: Connected on port ' + PORT);
  console.log('⏰ Real-time updates every 5 seconds');
});