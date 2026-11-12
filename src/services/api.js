const API_BASE = '/api';

export const api = {
  // Authentication
  async login(email, password) {
    try {
      const res = await fetch(`${API_BASE}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');
      return data;
    } catch (err) {
      console.warn('API login request error, falling back to local simulation:', err.message);
      throw err;
    }
  },

  async register(name, email, password, phone) {
    try {
      const res = await fetch(`${API_BASE}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ name, email, password, phone })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');
      return data;
    } catch (err) {
      console.warn('API register error:', err.message);
      throw err;
    }
  },

  async logout(email) {
    try {
      await fetch(`${API_BASE}/auth/logout`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
    } catch (err) {
      console.warn('Logout notification error:', err.message);
    }
  },

  async extendSession(email) {
    try {
      const res = await fetch(`${API_BASE}/auth/extend-session`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email })
      });
      if (!res.ok) throw new Error('Failed to extend session');
      return await res.json();
    } catch (err) {
      console.warn('Extend session error:', err.message);
      return null;
    }
  },

  // Orders
  async createOrder(orderData) {
    try {
      const res = await fetch(`${API_BASE}/orders`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(orderData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Order creation failed');
      return data.order;
    } catch (err) {
      console.warn('API createOrder error:', err.message);
      return null;
    }
  },

  // Admin Dashboard
  async getAdminStats() {
    try {
      const res = await fetch(`${API_BASE}/admin/stats`);
      if (!res.ok) throw new Error('Failed to fetch admin stats');
      return await res.json();
    } catch (err) {
      console.warn('API getAdminStats error:', err.message);
      return null;
    }
  },

  async getAdminCustomers() {
    try {
      const res = await fetch(`${API_BASE}/admin/customers`);
      if (!res.ok) throw new Error('Failed to fetch customers');
      return await res.json();
    } catch (err) {
      console.warn('API getAdminCustomers error:', err.message);
      return [];
    }
  },

  async getAdminActivities() {
    try {
      const res = await fetch(`${API_BASE}/admin/activities`);
      if (!res.ok) throw new Error('Failed to fetch activities');
      return await res.json();
    } catch (err) {
      console.warn('API getAdminActivities error:', err.message);
      return [];
    }
  },

  async getAdminOrders() {
    try {
      const res = await fetch(`${API_BASE}/admin/orders`);
      if (!res.ok) throw new Error('Failed to fetch admin orders');
      return await res.json();
    } catch (err) {
      console.warn('API getAdminOrders error:', err.message);
      return [];
    }
  },

  async updateOrderStatus(orderId, status, statusCode) {
    try {
      const res = await fetch(`${API_BASE}/admin/orders/${orderId}/status`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ status, statusCode })
      });
      return await res.json();
    } catch (err) {
      console.warn('API updateOrderStatus error:', err.message);
      return null;
    }
  }
};
