export interface User {
  _id: string;
  email: string;
  name: string;
  role: 'user' | 'admin';
  favoriteTools: string[];
}

export interface AuthResponse {
  user: User;
  token: string;
}

export interface Tool {
  _id: string;
  title: string;
  description: string;
  category: string;
  prompt: string;
  inputFields: InputField[];
  isPublic: boolean;
  createdBy: string;
  usageCount: number;
  createdAt: string;
  updatedAt: string;
}

export interface InputField {
  name: string;
  type: 'text' | 'textarea' | 'file' | 'select';
  label: string;
  placeholder?: string;
  required: boolean;
  options?: string[];
}

export interface ApiError {
  message: string;
}
