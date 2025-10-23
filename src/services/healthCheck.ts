// services/healthCheck.ts
const API_BASE_URL = import.meta.env.VITE_OPPORTUNITIES_API_BASE_URL;

export const healthCheck = {
  async checkBackend(): Promise<boolean> {
    try {
      const response = await fetch(`${API_BASE_URL}/health`);
      return response.ok;
    } catch (error) {
      console.error('Backend health check failed:', error);
      return false;
    }
  },

  async testEndpoints(): Promise<void> {
    try {
      console.log('Testing backend endpoints...');
      
      // Test health endpoint
      const health = await fetch(`${API_BASE_URL}/health`);
      console.log('Health endpoint:', health.status, health.statusText);
      
      // Test opportunities endpoint
      const opportunities = await fetch(`${API_BASE_URL}/opportunities`);
      console.log('Opportunities endpoint:', opportunities.status, opportunities.statusText);
      
      if (opportunities.ok) {
        const data = await opportunities.json();
        console.log('Opportunities data structure:', Array.isArray(data) ? `Array with ${data.length} items` : typeof data);
        console.log('First item sample:', data[0]);
      }
      
    } catch (error) {
      console.error('Endpoint test failed:', error);
    }
  }
};