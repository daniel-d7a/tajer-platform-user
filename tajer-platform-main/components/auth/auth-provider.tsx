"use client";

import { createContext, useContext, useEffect, useState, useRef } from "react";

interface User {
  id: string;
  phone: string;
  name: string;
  email: string;
  role: "ADMIN" | "MERCHANT" | "SALES_REP";
  commercialName?: string;
  city?: string;
  area?: string;
  businessType?: string;
  isActive?: boolean;
}

interface AuthContextType {
  user: User | null;
  isLoading: boolean;
  isAuthenticated: boolean;
  login: (userData: User, token: string) => void;
  logout: () => void;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export function AuthProvider({ children }: { children: React.ReactNode }) {
  const [user, setUser] = useState<User | null>(null);
  const [isLoading, setIsLoading] = useState(true);
  const hasCheckedAuth = useRef(false);

  const validateToken = async (
    token: string
  ): Promise<{ isValid: boolean; userData?: User }> => {
    try {
      const response = await fetch(
        "https://tajer-backend.tajerplatform.workers.dev/api/auth/me",
        {
          method: "GET",
          headers: {
            Authorization: `Bearer ${token}`,
            "Content-Type": "application/json",
          },
          credentials: "include",
        }
      );

      if (response.ok) {
        const userData = await response.json();
        return { isValid: true, userData };
      }
      return { isValid: false };
    } catch (error) {
      console.error("Token validation error:", error);
      return { isValid: false };
    }
  };

  useEffect(() => {
    if (hasCheckedAuth.current) return;
    hasCheckedAuth.current = true;

    const checkAuthStatus = async () => {
      try {
        const { default: storage } = await import("@/lib/storage");
        const token = storage.getToken();
        const storedUser = storage.getUser();

        if (token && storedUser) {
          const { isValid, userData } = await validateToken(token);
          if (isValid && userData) {
            setUser(userData);
            storage.setUser(userData);
          } else {
            storage.clearAuth();
            setUser(null);
          }
        } else {
          console.log("No valid auth data found");
          storage.clearAuth();
        }
      } catch (error) {
        console.error("Error checking auth status:", error);
        const { default: storage } = await import("@/lib/storage");
        storage.clearAuth();
        setUser(null);
      } finally {
        setIsLoading(false);
      }
    };

    checkAuthStatus();
  }, []);

  const login = async (userData: User, token: string) => {
    const { default: storage } = await import("@/lib/storage");
    setUser(userData);
    storage.setUser(userData);
    storage.setToken(token);
  };

  const logout = async () => {
    try {
      const { default: storage } = await import("@/lib/storage");
      const token = storage.getToken();

      if (token) {
        await fetch(
          "https://tajer-backend.tajerplatform.workers.dev/api/auth/logout",
          {
            method: "POST",
            headers: {
              Authorization: `Bearer ${token}`,
            },
            credentials: "include",
          }
        );
      }
    } catch (error) {
      console.error("Logout API error:", error);
    } finally {
      setUser(null);
      const { default: storage } = await import("@/lib/storage");
      storage.clearAuth();
    }
  };

  return (
    <AuthContext.Provider
      value={{
        user,
        isLoading,
        isAuthenticated: !!user,
        login,
        logout,
      }}
    >
      {children}
    </AuthContext.Provider>
  );
}

export function useAuth() {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error("useAuth must be used within an AuthProvider");
  }
  return context;
}
