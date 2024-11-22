export interface User {
  id: string;
  name: string;
  email: string;
  role: 'user' | 'admin';
  status: 'active' | 'blocked';
  createdAt: string;
  updatedAt: string;
}

export interface Tool {
  id: string;
  title: string;
  description: string;
  category: string;
  prompt: string;
  isPublic: boolean;
  inputFields: InputField[];
  userId: string;
  createdAt: string;
  updatedAt: string;
}

export interface InputField {
  name: string;
  type: 'text' | 'textarea' | 'select' | 'number';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

export interface PaginatedResponse<T> {
  items: T[];
  total: number;
  page: number;
  limit: number;
  totalPages: number;
}

export interface ApiError {
  message: string;
  code?: string;
  status?: number;
}
