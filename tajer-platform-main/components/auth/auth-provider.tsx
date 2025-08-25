'use client';

import type React from 'react';
import { createContext, useContext, useEffect, useState } from 'react';

interface User {
  name: string;
  email: string;
  role: "admin" | "trader" | "sales";
  commercialName?: string;
}

interface AuthContextType {
  isAuthenticated: boolean;
  login: (userData: User) => void;
  logout: () => void;
  user: User | null;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [isAuthenticated, setIsAuthenticated] = useState(false);
  const [user, setUser] = useState<User | null>(null);

  useEffect(() => {
    const checkAuth = () => {
      const isLoggedIn = localStorage.getItem('isLoggedIn') === 'true';
      const data = localStorage.getItem('data');

      if (isLoggedIn && data) {
        setIsAuthenticated(true);
        setUser(JSON.parse(data) as User);
      }
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
