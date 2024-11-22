import { User } from './user';

export interface AdminStats {
  totalUsers: number;
  activeUsers: number;
  totalTools: number;
  totalExecutions: number;
}

export interface SystemStatus {
  status: 'healthy' | 'degraded' | 'down';
  uptime: number;
  memory: {
    total: number;
    used: number;
    free: number;
  };
  cpu: {
    usage: number;
    cores: number;
  };
}

export interface LogEntry {
  id: string;
  timestamp: string;
  level: 'info' | 'warn' | 'error';
  message: string;
  metadata?: Record<string, any>;
}

export interface LogsResponse {
  logs: LogEntry[];
  total: number;
  page: number;
  limit: number;
}

export interface UsersResponse {
  users: User[];
  total: number;
  page: number;
  limit: number;
}

export interface AdminSettings {
  maintenance: boolean;
  maxConcurrentExecutions: number;
  rateLimits: {
    perSecond: number;
    perMinute: number;
    perHour: number;
  };
}
