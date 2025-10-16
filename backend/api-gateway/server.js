const client = require('prom-client');

// Create a Registry to register the metrics
const register = new client.Registry();

// Add a default metrics collection
client.collectDefaultMetrics({ register });

// Custom metrics
const httpRequestDurationMicroseconds = new client.Histogram({
  name: 'http_request_duration_ms',
  help: 'Duration of HTTP requests in ms',
  labelNames: ['method', 'route', 'code'],
  buckets: [0.1, 5, 15, 50, 100, 500]
});

const activeServicesGauge = new client.Gauge({
  name: 'active_services',
  help: 'Number of active services'
});

register.registerMetric(httpRequestDurationMicroseconds);
register.registerMetric(activeServicesGauge);

// Add metrics endpoint
app.get('/metrics', async (req, res) => {
  res.set('Content-Type', register.contentType);
  res.end(await register.metrics());
});

// Update active services metric
setInterval(() => {
  const runningServices = services.filter(s => s.status === 'running').length;
  activeServicesGauge.set(runningServices);
}, 5000);