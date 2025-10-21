const fs = require('fs');
const path = require('path');

const dbPath = path.join(__dirname, 'data.json');

function readData() {
  try {
    const data = fs.readFileSync(dbPath, 'utf8');
    return JSON.parse(data);
  } catch (error) {
    return { services: [], events: [] };
  }
}

function writeData(data) {
  fs.writeFileSync(dbPath, JSON.stringify(data, null, 2));
}

function saveService(service) {
  const data = readData();
  const existingIndex = data.services.findIndex(s => s.id === service.id);
  
  if (existingIndex >= 0) {
    data.services[existingIndex] = service;
  } else {
    data.services.push(service);
  }
  
  // Add event
  data.events.push({
    id: Date.now(),
    type: 'service_update',
    service: service.name,
    status: service.status,
    timestamp: new Date().toISOString()
  });
  
  writeData(data);
}

function getServices() {
  return readData().services;
}

function getEvents() {
  return readData().events;
}

module.exports = { saveService, getServices, getEvents };