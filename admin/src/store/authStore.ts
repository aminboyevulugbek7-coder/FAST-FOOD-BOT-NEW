import { create } from 'zustand';

interface AuthState {
  isAuthenticated: boolean;
  admin: {
    id: number;
    username: string;
    role: string;
  } | null;
  login: (username: string, password: string) => Promise<boolean>;
  logout: () => void;
}

// Mock admin credentials (in production, this should be from backend)
const ADMIN_CREDENTIALS = {
  username: 'admin',
  password: 'admin123' // Change this in production!
};

export const useAuthStore = create<AuthState>((set) => ({
  isAuthenticated: false,
  admin: null,
  
  login: async (username: string, password: string) => {
    // Simulate API call
    await new Promise(resolve => setTimeout(resolve, 500));
    
    if (username === ADMIN_CREDENTIALS.username && password === ADMIN_CREDENTIALS.password) {
      set({
        isAuthenticated: true,
        admin: {
          id: 1,
          username: username,
          role: 'admin'
        }
      });
      localStorage.setItem('admin_token', 'mock_jwt_token');
      return true;
    }
    
    return false;
  },
  
  logout: () => {
    set({
      isAuthenticated: false,
      admin: null
    });
    localStorage.removeItem('admin_token');
  }
}));
