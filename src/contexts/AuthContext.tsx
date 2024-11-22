import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../services/api';
import { User } from '../types/user';

interface AuthContextType {
  user: User | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<void>;
  register: (name: string, email: string, password: string) => Promise<void>;
  logout: () => void;
  updateUser: (data: Partial<User>) => Promise<void>;
}

const AuthContext = createContext<AuthContextType | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);

  useEffect(() => {
    const initAuth = async () => {
      const token = localStorage.getItem('token');
      if (token) {
        try {
          const userData = await auth.me();
          setUser(userData);
        } catch (error) {
          localStorage.removeItem('token');
          setUser(null);
        }
      }
      setLoading(false);
    };

    initAuth();
  }, []);

  const login = async (email: string, password: string) => {
    const { token, user: userData } = await auth.login(email, password);
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const register = async (name: string, email: string, password: string) => {
    const { token, user: userData } = await auth.register(name, email, password);
    localStorage.setItem('token', token);
    setUser(userData);
  };

  const logout = async () => {
    try {
      await auth.logout();
    } finally {
      localStorage.removeItem('token');
      setUser(null);
    }
  };

  const updateUser = async (data: Partial<User>) => {
    const updatedUser = await auth.update(data);
    setUser(updatedUser);
  };

  return (
    <AuthContext.Provider value={{ user, loading, login, register, logout, updateUser }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (context === undefined) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
