// Portfolio Item Types
export interface Project {
  id: string;
  title: string;
  slug: string;
  description: string;
  category: string;
  clientName: string | null;
  projectDate: string | null;
  externalUrl: string | null;
  technologies: string[];
  tags: string[];
  status: ProjectStatus;
  displayOrder: number;
  images: ProjectImage[];
  createdAt: string;
  updatedAt: string;
}

export interface ProjectImage {
  id: string;
  projectId: string;
  url: string;
  alt: string | null;
  isPrimary: boolean;
  displayOrder: number;
  createdAt: string;
}

export type ProjectStatus = 'published' | 'draft';

export interface CreateProjectInput {
  title: string;
  slug: string;
  description: string;
  category: string;
  clientName?: string;
  projectDate?: string;
  externalUrl?: string;
  technologies?: string[];
  tags?: string[];
  status?: ProjectStatus;
  displayOrder?: number;
}

export interface UpdateProjectInput extends Partial<CreateProjectInput> {}

export interface ReorderInput {
  items: { id: string; displayOrder: number }[];
}

// API Response Types
export interface ApiResponse<T = unknown> {
  success: boolean;
  data?: T;
  error?: string;
  message?: string;
}

export interface PaginatedResponse<T> extends ApiResponse<T[]> {
  total: number;
  page: number;
  pageSize: number;
  totalPages: number;
}

// Auth Types
export interface LoginInput {
  email: string;
  password: string;
}

export interface AuthToken {
  token: string;
  expiresIn: number;
}

export interface User {
  id: string;
  email: string;
  name: string | null;
  createdAt: string;
}

// Theme Types
export type ThemeMode = 'light' | 'dark';

export interface ThemeColors {
  primary: string;
  secondary: string;
  accent: string;
  background: string;
  foreground: string;
  muted: string;
  mutedForeground: string;
  border: string;
  card: string;
  cardForeground: string;
}

export interface Theme {
  mode: ThemeMode;
  colors: ThemeColors;
}
