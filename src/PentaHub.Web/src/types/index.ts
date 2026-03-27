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

export interface TaskStage {
  id: number;
  projectId: number;
  name: string;
  sortOrder: number;
  isDefault: boolean;
  isClosedStage: boolean;
  showInKanban: boolean;
}

export interface ProjectTask {
  id: number;
  taskNumber: string;
  title: string;
  description?: string;
  projectId: number;
  projectName?: string;
  stageId: number;
  stageName?: string;
  assigneeId?: number;
  assigneeName?: string;
  priority: number;
  priorityText?: string;
  isBillable: boolean;
  startDate?: string;
  dueDate?: string;
  plannedHours: number;
  spentHours: number;
  remainingHours: number;
  progressPercent: number;
  tags?: string;
  sortOrder: number;
  subTaskCount: number;
  createdAt: string;
}

export interface TaskKanbanColumn {
  stageId: number;
  stageName: string;
  sortOrder: number;
  tasks: ProjectTask[];
}

export interface CreateTaskRequest {
  title: string;
  description?: string;
  projectId: number;
  assigneeId?: number;
  priority: number;
  isBillable: boolean;
  startDate?: string;
  dueDate?: string;
  plannedHours: number;
}

export enum SprintState {
  Draft = 0,
  InProgress = 1,
  Done = 2,
}

export interface Sprint {
  id: number;
  name: string;
  projectId: number;
  projectName?: string;
  state: SprintState;
  stateText?: string;
  goal?: string;
  startDate: string;
  endDate: string;
  taskCount: number;
  completedTaskCount: number;
  progressPercent: number;
}

export interface SprintDetail extends Sprint {
  tasks: ProjectTask[];
}

export interface CreateSprintRequest {
  name: string;
  projectId: number;
  goal?: string;
  startDate: string;
  endDate: string;
}

export interface TaskChecklistItem {
  id: number;
  taskId: number;
  title: string;
  assigneeId?: number;
  assigneeName?: string;
  isCompleted: boolean;
  sortOrder: number;
}

export interface TaskDependencyItem {
  id: number;
  taskId: number;
  taskTitle?: string;
  taskNumber?: string;
  dependsOnTaskId: number;
  dependsOnTaskTitle?: string;
  dependsOnTaskNumber?: string;
  dependencyType: number;
  dependencyTypeText?: string;
}

export interface GanttTask {
  id: number;
  taskNumber: string;
  title: string;
  startDate?: string;
  dueDate?: string;
  progressPercent: number;
  assigneeName?: string;
  stageName?: string;
  dependencies: { dependsOnTaskId: number; dependencyType: number }[];
}
