'use client';

import type React from 'react';

import { createContext, useContext, useEffect, useState } from 'react';

interface AuthContextType {
  isAuthenticated: boolean;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  login: (userData: any) => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  logout: () => void;
  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  user: any;
};
const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState(null);

  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const userData = localStorage.getItem('userData');

      if (isLoggedIn && userData) {
        setIsAuthenticated(true);
        setUser(JSON.parse(userData));
      }
    };
    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    checkAuth();
  }, []);

  // eslint-disable-next-line @typescript-eslint/no-explicit-any
  const login = (userData: any) => {
    localStorage.setItem('isLoggedIn', 'true');
    localStorage.setItem('userData', JSON.stringify(userData));
    setIsAuthenticated(true);
    setUser(userData);
  };

  const logout = () => {
    localStorage.removeItem('isLoggedIn');
    localStorage.removeItem('userData');
    setIsAuthenticated(false);
    setUser(null);
  };
  return (
    <AuthContext.Provider value={{ isAuthenticated, login, logout, user }}>
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
};