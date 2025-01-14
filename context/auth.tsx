import { createContext, useContext, useState, useEffect } from 'react';
import * as SecureStore from 'expo-secure-store';
import React, { ReactNode } from 'react';
import { Platform } from 'react-native';

export const storage = {
  async setItem(key: string, value: string) {
    if (Platform.OS === 'web') {
      localStorage.setItem(key, value);
      return;
    }
    await SecureStore.setItemAsync(key, value);
  },

  async getItem(key: string) {
    if (Platform.OS === 'web') {
      return localStorage.getItem(key);
    }
    return await SecureStore.getItemAsync(key);
  },

  async removeItem(key: string) {
    if (Platform.OS === 'web') {
      localStorage.removeItem(key);
      return;
    }
    await SecureStore.deleteItemAsync(key);
  }
};

type AuthContextType = {
  isAuthenticated: boolean;
  user: any;
  login: (token: string, userInfo: any) => Promise<void>;
  logout: () => Promise<void>;
};

const AuthContext = createContext<AuthContextType | null>(null);

export function AuthProvider({ children }: { children: ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    loadAuthState();
  }, []);

  const loadAuthState = async () => {
    try {
      const token = await storage.getItem('auth_token');
      const userInfo = await storage.getItem('user_info');
      
      if (token && userInfo) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userInfo));
      }
    } catch (error) {
      console.error('Error loading auth state:', error);
    }
  };

  const login = async (token: string, userInfo: any) => {
    console.log('Login called with userInfo:', userInfo);  // Add this
    await storage.setItem('auth_token', token);
    await storage.setItem('user_info', JSON.stringify(userInfo));
    setIsAuthenticated(true);
    setUser(userInfo);
  };

  const logout = async () => {
    await storage.removeItem('auth_token');
    await storage.removeItem('user_info');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, user, login, logout }}>
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}
