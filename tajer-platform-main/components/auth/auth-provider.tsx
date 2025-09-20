'use client';

import type React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

interface User {
  name: string;
  email: string;
  role: "ADMIN" | "MERCHANT" | "SALES_REP";
  commercialName?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  isLoading: boolean;
  login: (userData: User) => void;
  logout: () => void;
  user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [isLoading, setIsLoading] = useState(true);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      setIsLoading(true);
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const data = localStorage.getItem('data');

      if (isLoggedIn && data) {
        try {
          setIsAuthenticated(true);
          setUser(JSON.parse(data) as User);
        } catch (error) {
          console.error('Error parsing user data:', error);
          localStorage.removeItem('isLoggedIn');
          localStorage.removeItem('data');
        }
      }
      setIsLoading(false);
    };
    
    checkAuth();
  }, []);

  const login = (data: User) => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('data', JSON.stringify(data));
    setIsAuthenticated(true);
    setUser(data);
  };
  const logout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('data');
    setIsAuthenticated(false);
    setUser(null);
  };

  return (
    <AuthContext.Provider value={{ isAuthenticated, isLoading, login, logout, user }}>
      {children}
    </AuthContext.Provider>
  );
};

export function useAuth() {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
}