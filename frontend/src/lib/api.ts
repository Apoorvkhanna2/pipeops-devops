export interface Service {
  id: number;
  name: string;
  status: 'running' | 'deploying' | 'failed';
  cpu: number;
  memory: number;
}

const API_BASE = 'http://localhost:5000/api';

export const api = {
  getServices: async (): Promise<Service[]> => {
    const response = await fetch(`${API_BASE}/services`);
    return response.json();
  },

  restartService: async (serviceId: number): Promise<{ success: boolean; message: string }> => {
    const response = await fetch(`${API_BASE}/services/${serviceId}/restart`, {
      method: 'POST',
    });
    return response.json();
  },
};