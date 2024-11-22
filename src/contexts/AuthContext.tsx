import React, { createContext, useContext, useState, useEffect } from 'react';
import { auth } from '../services/api';
import { User, AuthContextType } from '../types/user';

const AuthContext = createContext<AuthContextType | null>(null);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(null);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState<string | null>(null);

  useEffect(() => {
    const initializeAuth = async () => {
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

    initializeAuth();
  }, []);

  const login = async (email: string, password: string) => {
    try {
      const response = await auth.login(email, password);
      localStorage.setItem('token', response.token);
      setUser(response.user);
      setError(null);
    } catch (error: any) {
      setError(error.response?.data?.message || '로그인 중 오류가 발생했습니다.');
      throw error;
    }
  };

  const register = async (name: string, email: string, password: string) => {
    try {
      const response = await auth.register(name, email, password);
      localStorage.setItem('token', response.token);
      setUser(response.user);
      setError(null);
    } catch (error: any) {
      setError(error.response?.data?.message || '회원가입 중 오류가 발생했습니다.');
      throw error;
    }
  };

  const logout = async () => {
    try {
      await auth.logout();
      localStorage.removeItem('token');
      setUser(null);
      setError(null);
    } catch (error: any) {
      setError(error.response?.data?.message || '로그아웃 중 오류가 발생했습니다.');
      throw error;
    }
  };

  const updateProfile = async (data: Partial<User>) => {
    try {
      const updatedUser = await auth.update(data);
      setUser(updatedUser);
      setError(null);
    } catch (error: any) {
      setError(error.response?.data?.message || '프로필 수정 중 오류가 발생했습니다.');
      throw error;
    }
  };

  const value = {
    user,
    loading,
    error,
    login,
    register,
    logout,
    updateProfile,
  };

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const context = useContext(AuthContext);
  if (!context) {
    throw new Error('useAuth must be used within an AuthProvider');
  }
  return context;
};
