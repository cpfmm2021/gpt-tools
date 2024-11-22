import axios, { AxiosInstance } from 'axios';

const API_URL = process.env.REACT_APP_API_URL || 'http://localhost:3001/api';

const createAxiosInstance = (): AxiosInstance => {
  const instance = axios.create({
    baseURL: API_URL,
    headers: {
      'Content-Type': 'application/json',
    },
  });

  instance.interceptors.request.use(
    (config) => {
      const token = localStorage.getItem('token');
      if (token) {
        config.headers.Authorization = `Bearer ${token}`;
      }
      return config;
    },
    (error) => {
      return Promise.reject(error);
    }
  );

  instance.interceptors.response.use(
    (response) => response,
    (error) => {
      if (error.response?.status === 401) {
        localStorage.removeItem('token');
        window.location.href = '/login';
      }
      return Promise.reject(error);
    }
  );

  return instance;
};

const api = createAxiosInstance();

export const auth = {
  login: (email: string, password: string) =>
    api.post('/auth/login', { email, password }).then((res) => res.data),
  register: (name: string, email: string, password: string) =>
    api.post('/auth/register', { name, email, password }).then((res) => res.data),
  me: () => api.get('/auth/me').then((res) => res.data),
  logout: () => api.post('/auth/logout').then((res) => res.data),
  update: (data: any) => api.put('/auth/profile', data).then((res) => res.data),
};

export const tools = {
  create: (data: any) => api.post('/tools', data).then((res) => res.data),
  getAll: (params?: { page?: number; limit?: number; search?: string; userId?: string }) =>
    api.get('/tools', { params }).then((res) => res.data),
  getById: (id: string) => api.get(`/tools/${id}`).then((res) => res.data),
  update: (id: string, data: any) =>
    api.put(`/tools/${id}`, data).then((res) => res.data),
  delete: (id: string) => api.delete(`/tools/${id}`).then((res) => res.data),
  execute: (id: string, data: any) =>
    api.post(`/tools/${id}/execute`, data).then((res) => res.data),
  run: (id: string, input: Record<string, any>) =>
    api.post(`/tools/${id}/run`, input).then((res) => res.data),
};

export const admin = {
  getStats: () => api.get('/admin/stats').then((res) => res.data),
  getSystemStatus: () => api.get('/admin/status').then((res) => res.data),
  getSettings: () => api.get('/admin/settings').then((res) => res.data),
  updateSettings: (data: any) =>
    api.put('/admin/settings', data).then((res) => res.data),
  getLogs: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get('/admin/logs', { params }).then((res) => res.data),
  deleteLogs: (params: { before: string }) =>
    api.delete('/admin/logs', { params }).then((res) => res.data),
  getUsers: (params?: { page?: number; limit?: number; search?: string }) =>
    api.get('/admin/users', { params }).then((res) => res.data),
  updateUser: (id: string, data: any) =>
    api.put(`/admin/users/${id}`, data).then((res) => res.data),
  deleteUser: (id: string) =>
    api.delete(`/admin/users/${id}`).then((res) => res.data),
  blockUser: (id: string) =>
    api.post(`/admin/users/${id}/block`).then((res) => res.data),
  unblockUser: (id: string) =>
    api.post(`/admin/users/${id}/unblock`).then((res) => res.data),
  getRecentActivity: () => api.get('/admin/activity').then((res) => res.data),
};

export const user = {
  updateProfile: async (data: { name: string; email: string }) => {
    const response = await api.put('/users/profile', data);
    return response.data;
  },

  changePassword: async (data: {
    currentPassword: string;
    newPassword: string;
  }) => {
    const response = await api.put('/users/password', data);
    return response.data;
  },

  deleteAccount: async () => {
    const response = await api.delete('/users/account');
    return response.data;
  },

  getAll: async (params?: {
    page?: number;
    limit?: number;
    search?: string;
  }) => {
    const response = await api.get('/users', { params });
    return response.data;
  },

  getById: async (id: string) => {
    const response = await api.get(`/users/${id}`);
    return response.data;
  },

  update: async (id: string, data: any) => {
    const response = await api.put(`/users/${id}`, data);
    return response.data;
  },

  delete: async (id: string) => {
    const response = await api.delete(`/users/${id}`);
    return response.data;
  },

  block: async (id: string) => {
    const response = await api.put(`/users/${id}/block`);
    return response.data;
  },

  unblock: async (id: string) => {
    const response = await api.put(`/users/${id}/unblock`);
    return response.data;
  },

  getNotifications: async () => {
    const response = await api.get('/users/notifications');
    return response.data;
  },

  markNotificationAsRead: async (notificationId: string) => {
    const response = await api.put(
      `/users/notifications/${notificationId}/read`
    );
    return response.data;
  },

  markAllNotificationsAsRead: async () => {
    const response = await api.put('/users/notifications/read-all');
    return response.data;
  },

  deleteNotification: async (notificationId: string) => {
    const response = await api.delete(
      `/users/notifications/${notificationId}`
    );
    return response.data;
  },
};

export default api;
