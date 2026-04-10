import { create } from 'zustand';
import axios from 'axios';

interface AdminUser {
  id: string;
  email: string;
  name: string;
  role: 'admin' | 'super_admin';
}

interface AuthState {
  isAuthenticated: boolean;
  admin: AdminUser | null;
  token: string | null;
  login: (email: string, password: string) => Promise<boolean>;
  logout: () => void;
  checkAuth: () => void;
}

const API_URL = import.meta.env.VITE_API_URL || 'http://localhost:5001/api';

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  admin: null,
  token: null,
  
  login: async (email: string, password: string) => {
    try {
      console.log('🔐 Attempting login...', { email, API_URL });
      
      const response = await axios.post(`${API_URL}/auth/login`, {
        email,
        password
      });
      
      console.log('✅ Login response:', response.data);
      
      if (response.data.success && response.data.token) {
        const { token, user } = response.data;
        
        // Store token
        localStorage.setItem('admin_token', token);
        localStorage.setItem('admin_user', JSON.stringify(user));
        
        set({
          isAuthenticated: true,
          admin: user,
          token
        });
        
        console.log('✅ Login successful!');
        return true;
      }
      
      console.error('❌ Login failed: Invalid response', response.data);
      return false;
    } catch (error: any) {
      console.error('❌ Login error:', error.response?.data || error.message);
      return false;
    }
  },
  
  logout: () => {
    localStorage.removeItem('admin_token');
    localStorage.removeItem('admin_user');
    
    set({
      isAuthenticated: false,
      admin: null,
      token: null
    });
  },
  
  checkAuth: () => {
    const token = localStorage.getItem('admin_token');
    const userStr = localStorage.getItem('admin_user');
    
    if (token && userStr) {
      try {
        const user = JSON.parse(userStr);
        set({
          isAuthenticated: true,
          admin: user,
          token
        });
      } catch (error) {
        // Invalid stored data
        localStorage.removeItem('admin_token');
        localStorage.removeItem('admin_user');
        set({
          isAuthenticated: false,
          admin: null,
          token: null
        });
      }
    } else {
      set({
        isAuthenticated: false,
        admin: null,
        token: null
      });
    }
  }
}));
