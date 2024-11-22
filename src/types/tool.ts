export interface Tool {
  id: string;
  name: string;
  description: string;
  category: string;
  type: string;
  userId?: string;
  createdAt: string;
  updatedAt: string;
  usageCount?: number;
  inputs: Array<{
    name: string;
    type: string;
    description?: string;
    required?: boolean;
  }>;
}

export interface ToolsResponse {
  tools: Tool[];
  total: number;
  page: number;
  limit: number;
}

export interface ExecuteResponse {
  result: any;
  error?: string;
}
