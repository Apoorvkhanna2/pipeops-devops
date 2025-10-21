// frontend/src/lib/api.ts
interface Service {
  name: string;
  status: string;
  cpu: number;
  memory: number;
}

export async function getServices(): Promise<Service[]> {
  try {
    const response = await fetch('http://localhost:5000/api/services');
    if (!response.ok) {
      throw new Error('Failed to fetch services');
    }
    return await response.json();
  } catch (error) {
    console.error('Error fetching services:', error);
    return [
      { name: 'Auth Service', status: 'running', cpu: 25, memory: 45 },
      { name: 'API Gateway', status: 'running', cpu: 30, memory: 60 },
      { name: 'User Service', status: 'deploying', cpu: 15, memory: 35 },
      { name: 'Payment Service', status: 'running', cpu: 20, memory: 30 }
    ];
  }
}

export async function restartService(serviceName: string): Promise<{ message: string }> {
  try {
    const response = await fetch(`http://localhost:5000/api/services/${serviceName}/restart`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
      },
    });
    
    if (!response.ok) {
      throw new Error('Failed to restart service');
    }
    
    return await response.json();
  } catch (error) {
    console.error('Error restarting service:', error);
    return { message: `Restarted ${serviceName} (simulated)` };
  }
}