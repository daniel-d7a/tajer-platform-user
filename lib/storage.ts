// lib/storage.ts
'use client';

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

class SafeStorage {
  private isClient: boolean;

  constructor() {
    this.isClient = typeof window !== 'undefined';
  }

  setItem(key: string, value: string): void {
    if (this.isClient) {
      try {
        localStorage.setItem(key, value);
      } catch (error) {
        console.error('Error setting localStorage:', error);
      }
    }
  }

  getItem(key: string): string | null {
    if (this.isClient) {
      try {
        return localStorage.getItem(key);
      } catch (error) {
        console.error('Error getting localStorage:', error);
        return null;
      }
    }
    return null;
  }

  removeItem(key: string): void {
    if (this.isClient) {
      try {
        localStorage.removeItem(key);
      } catch (error) {
        console.error('Error removing localStorage:', error);
      }
    }
  }

  // Methods specific to auth
  setToken(token: string): void {
    this.setItem('authToken', token);
  }

  getToken(): string | null {
    return this.getItem('authToken');
  }

  setUser(user: User): void {
    this.setItem('userData', JSON.stringify(user));
  }

  getUser(): User | null {
    const user = this.getItem('userData');
    if (user) {
      try {
        return JSON.parse(user) as User;
      } catch (error) {
        console.error('Error parsing user data:', error);
        return null;
      }
    }
    return null;
  }

  clearAuth(): void {
    this.removeItem('authToken');
    this.removeItem('userData');
  }
}

const storage = new SafeStorage();
export default storage;