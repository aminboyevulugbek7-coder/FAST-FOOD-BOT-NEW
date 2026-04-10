import axios from 'axios';

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5000/api';

// Create axios instance
const api = axios.create({
  baseURL: API_URL,
  headers: {
    'Content-Type': 'application/json'
  }
});

// Request interceptor to add auth token
api.interceptors.request.use(
  (config) => {
    const token = localStorage.getItem('admin_token');
    if (token) {
      config.headers.Authorization = `Bearer ${token}`;
    }
    return config;
  },
  (error) => {
    return Promise.reject(error);
  }
);

// Response interceptor for error handling
api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      // Unauthorized - clear token and redirect to login
      localStorage.removeItem('admin_token');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

// Banner API
export const bannerAPI = {
  getAll: (filters?: { isActive?: boolean; limit?: number }) => 
    api.get('/banners', { params: filters }),
  create: (data: any) => api.post('/banners', data),
  update: (id: string, data: any) => api.put(`/banners/${id}`, data),
  delete: (id: string) => api.delete(`/banners/${id}`)
};

// Category API
export const categoryAPI = {
  getAll: (filters?: { isActive?: boolean; search?: string }) => 
    api.get('/categories', { params: filters }),
  create: (data: any) => api.post('/categories', data),
  update: (id: string, data: any) => api.put(`/categories/${id}`, data),
  delete: (id: string) => api.delete(`/categories/${id}`),
  reorder: (orders: Array<{ id: string; order: number }>) => 
    api.post('/categories/reorder', { orders })
};

// Product API
export const productAPI = {
  getAll: (filters?: any) => api.get('/products', { params: filters }),
  getById: (id: string) => api.get(`/products/${id}`),
  create: (data: any) => api.post('/products', data),
  update: (id: string, data: any) => api.put(`/products/${id}`, data),
  delete: (id: string) => api.delete(`/products/${id}`)
};

// Order API
export const orderAPI = {
  getAll: (filters?: any) => api.get('/orders', { params: filters }),
  getById: (id: string) => api.get(`/orders/${id}`),
  updateStatus: (id: string, status: string, note?: string) => 
    api.patch(`/orders/${id}/status`, { status, note })
};

// Analytics API
export const analyticsAPI = {
  getDashboard: (startDate: string, endDate: string) => 
    api.get('/analytics/dashboard', { params: { startDate, endDate } }),
  getOrdersOverTime: (startDate: string, endDate: string, groupBy: string) => 
    api.get('/analytics/orders-over-time', { params: { startDate, endDate, groupBy } }),
  getRevenueOverTime: (startDate: string, endDate: string, groupBy: string) => 
    api.get('/analytics/revenue-over-time', { params: { startDate, endDate, groupBy } })
};

// Upload API
export const uploadAPI = {
  uploadImage: (file: File, folder: string) => {
    const formData = new FormData();
    formData.append('image', file);
    formData.append('folder', folder);
    
    return api.post('/upload', formData, {
      headers: {
        'Content-Type': 'multipart/form-data'
      }
    });
  }
};

export default api;
