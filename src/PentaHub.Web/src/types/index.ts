export enum ProjectStatus {
  Beklemede = 0,
  DevamEden = 1,
  Tamamlandi = 2,
}

export enum PrivacyLevel {
  InviteOnly = 0,
  AllEmployees = 1,
  ClientVisible = 2,
}

export enum EvaluationType {
  None = 0,
  Periodic = 1,
  OnStageChange = 2,
}

export interface Project {
  id: number;
  name: string;
  description?: string;
  status: ProjectStatus;
  statusText: string;
  projectManagerId: number;
  projectManagerName?: string;
  contactId?: number;
  departmentName?: string;
  privacyLevel: PrivacyLevel;
  isBillable: boolean;
  isTemplate: boolean;
  startDate?: string;
  endDate?: string;
  projectEmail?: string;
  customerEvaluation: EvaluationType;
  evaluationFrequency?: string;
  salesOrderId?: number;
  createdAt: string;
}

export interface ProjectListItem {
  id: number;
  name: string;
  status: ProjectStatus;
  statusText: string;
  projectManagerId: number;
  projectManagerName?: string;
  departmentName?: string;
  isBillable: boolean;
  isTemplate: boolean;
  startDate?: string;
  endDate?: string;
  taskCount: number;
}

export interface ProjectStats {
  total: number;
  active: number;
  waiting: number;
  completed: number;
  overdue: number;
}

export interface User {
  id: number;
  fullName: string;
  email: string;
  avatarUrl?: string;
  role: string;
  department?: string;
}

export interface ApiResponse<T> {
  success: boolean;
  data: T;
  error?: string;
  meta?: {
    total: number;
    page: number;
    pageSize: number;
    totalPages: number;
  };
}

export interface CreateProjectRequest {
  name: string;
  description?: string;
  status: ProjectStatus;
  projectManagerId: number;
  contactId?: number;
  departmentName?: string;
  privacyLevel: PrivacyLevel;
  isBillable: boolean;
  isTemplate: boolean;
  startDate?: string;
  endDate?: string;
  projectEmail?: string;
  customerEvaluation: EvaluationType;
  evaluationFrequency?: string;
}
