import axios from 'axios';
import type {
  ApiResponse,
  Project,
  ProjectListItem,
  ProjectStats,
  User,
  CreateProjectRequest,
  ProjectTask,
  TaskKanbanColumn,
  TaskStage,
  CreateTaskRequest,
  Sprint,
  SprintDetail,
  CreateSprintRequest,
  TaskChecklistItem,
  TaskDependencyItem,
  GanttTask,
  ResourceAllocation,
  CreateResourceAllocationRequest,
  Milestone,
  CreateMilestoneRequest,
  UpdateMilestoneRequest,
  TimeSheet,
  CreateTimeSheetRequest,
} from '@/types';

const api = axios.create({ baseURL: '/api' });

export const projectsApi = {
  getAll: async (params?: {
    status?: number;
    managerId?: number;
    search?: string;
    excludeTemplates?: boolean;
    page?: number;
    pageSize?: number;
  }) => {
    const { data } = await api.get<ApiResponse<ProjectListItem[]>>('/projects', { params });
    return data;
  },

  getById: async (id: number) => {
    const { data } = await api.get<ApiResponse<Project>>(`/projects/${id}`);
    return data;
  },

  create: async (project: CreateProjectRequest) => {
    const { data } = await api.post<ApiResponse<Project>>('/projects', project);
    return data;
  },

  update: async (id: number, project: CreateProjectRequest) => {
    const { data } = await api.put<ApiResponse<Project>>(`/projects/${id}`, project);
    return data;
  },

  delete: async (id: number) => {
    const { data } = await api.delete<ApiResponse<boolean>>(`/projects/${id}`);
    return data;
  },

  getStats: async () => {
    const { data } = await api.get<ApiResponse<ProjectStats>>('/projects/stats');
    return data;
  },

  updateStatus: async (id: number, status: number) => {
    const project = await projectsApi.getById(id);
    if (!project.data) throw new Error('Project not found');
    const { data } = await api.put<ApiResponse<Project>>(`/projects/${id}`, {
      ...project.data,
      status,
    });
    return data;
  },
};

export const usersApi = {
  getAll: async () => {
    const { data } = await api.get<ApiResponse<User[]>>('/users');
    return data;
  },
};

export const tasksApi = {
  getByProject: async (projectId: number) => {
    const { data } = await api.get<ApiResponse<TaskKanbanColumn[]>>(`/projects/${projectId}/tasks`);
    return data;
  },
  getById: async (id: number) => {
    const { data } = await api.get<ApiResponse<ProjectTask>>(`/tasks/${id}`);
    return data;
  },
  create: async (projectId: number, task: CreateTaskRequest) => {
    const { data } = await api.post<ApiResponse<ProjectTask>>(`/projects/${projectId}/tasks`, task);
    return data;
  },
  update: async (id: number, task: Partial<ProjectTask>) => {
    const { data } = await api.put<ApiResponse<ProjectTask>>(`/tasks/${id}`, task);
    return data;
  },
  moveStage: async (id: number, stageId: number) => {
    const { data } = await api.patch<ApiResponse<boolean>>(`/tasks/${id}/stage`, { stageId });
    return data;
  },
  delete: async (id: number) => {
    const { data } = await api.delete<ApiResponse<boolean>>(`/tasks/${id}`);
    return data;
  },
};

export const taskStagesApi = {
  getByProject: async (projectId: number) => {
    const { data } = await api.get<ApiResponse<TaskStage[]>>(`/projects/${projectId}/task-stages`);
    return data;
  },
};

export const sprintsApi = {
  getAll: async (params?: { projectId?: number; state?: number }) => {
    const { data } = await api.get<ApiResponse<Sprint[]>>('/sprints', { params });
    return data;
  },
  getById: async (id: number) => {
    const { data } = await api.get<ApiResponse<SprintDetail>>(`/sprints/${id}`);
    return data;
  },
  create: async (sprint: CreateSprintRequest) => {
    const { data } = await api.post<ApiResponse<Sprint>>('/sprints', sprint);
    return data;
  },
  update: async (id: number, sprint: CreateSprintRequest) => {
    const { data } = await api.put<ApiResponse<Sprint>>(`/sprints/${id}`, sprint);
    return data;
  },
  changeState: async (id: number, newState: number) => {
    const { data } = await api.patch<ApiResponse<boolean>>(`/sprints/${id}/state`, { newState });
    return data;
  },
  assignTask: async (id: number, taskId: number) => {
    const { data } = await api.post<ApiResponse<boolean>>(`/sprints/${id}/assign-task`, { taskId });
    return data;
  },
  removeTask: async (id: number, taskId: number) => {
    const { data } = await api.post<ApiResponse<boolean>>(`/sprints/${id}/remove-task`, { taskId });
    return data;
  },
};

export const backlogApi = {
  getByProject: async (projectId: number) => {
    const { data } = await api.get<ApiResponse<ProjectTask[]>>(`/projects/${projectId}/backlog`);
    return data;
  },
};

export const checklistApi = {
  getByTask: async (taskId: number) => {
    const { data } = await api.get<ApiResponse<TaskChecklistItem[]>>(`/tasks/${taskId}/checklists`);
    return data;
  },
  add: async (taskId: number, title: string, assigneeId?: number) => {
    const { data } = await api.post<ApiResponse<TaskChecklistItem>>(`/tasks/${taskId}/checklists`, { taskId, title, assigneeId });
    return data;
  },
  toggle: async (id: number) => {
    const { data } = await api.patch<ApiResponse<TaskChecklistItem>>(`/checklists/${id}/toggle`);
    return data;
  },
  delete: async (id: number) => {
    const { data } = await api.delete<ApiResponse<boolean>>(`/checklists/${id}`);
    return data;
  },
};

export const dependencyApi = {
  getByTask: async (taskId: number) => {
    const { data } = await api.get<ApiResponse<TaskDependencyItem[]>>(`/tasks/${taskId}/dependencies`);
    return data;
  },
  add: async (taskId: number, dependsOnTaskId: number, dependencyType: number) => {
    const { data } = await api.post<ApiResponse<TaskDependencyItem>>(`/tasks/${taskId}/dependencies`, { taskId, dependsOnTaskId, dependencyType });
    return data;
  },
  delete: async (id: number) => {
    const { data } = await api.delete<ApiResponse<boolean>>(`/dependencies/${id}`);
    return data;
  },
};

export const ganttApi = {
  getByProject: async (projectId: number) => {
    const { data } = await api.get<ApiResponse<GanttTask[]>>(`/projects/${projectId}/gantt`);
    return data;
  },
};

export const resourcesApi = {
  getByProject: async (projectId: number) => {
    const { data } = await api.get<ApiResponse<ResourceAllocation[]>>(`/projects/${projectId}/resources`);
    return data;
  },
  create: async (resource: CreateResourceAllocationRequest) => {
    const { data } = await api.post<ApiResponse<ResourceAllocation>>('/resources', resource);
    return data;
  },
  delete: async (id: number) => {
    const { data } = await api.delete<ApiResponse<boolean>>(`/resources/${id}`);
    return data;
  },
};

export const milestonesApi = {
  getByProject: async (projectId: number) => {
    const { data } = await api.get<ApiResponse<Milestone[]>>(`/projects/${projectId}/milestones`);
    return data;
  },
  create: async (milestone: CreateMilestoneRequest) => {
    const { data } = await api.post<ApiResponse<Milestone>>('/milestones', milestone);
    return data;
  },
  update: async (id: number, milestone: UpdateMilestoneRequest) => {
    const { data } = await api.put<ApiResponse<Milestone>>(`/milestones/${id}`, milestone);
    return data;
  },
  delete: async (id: number) => {
    const { data } = await api.delete<ApiResponse<boolean>>(`/milestones/${id}`);
    return data;
  },
};

export const timeSheetsApi = {
  getByTask: async (taskId: number) => {
    const { data } = await api.get<ApiResponse<TimeSheet[]>>(`/tasks/${taskId}/timesheets`);
    return data;
  },
  getByUser: async (userId: number, startDate?: string, endDate?: string) => {
    const { data } = await api.get<ApiResponse<TimeSheet[]>>(`/users/${userId}/timesheets`, {
      params: { startDate, endDate },
    });
    return data;
  },
  create: async (timeSheet: CreateTimeSheetRequest) => {
    const { data } = await api.post<ApiResponse<TimeSheet>>('/timesheets', timeSheet);
    return data;
  },
  delete: async (id: number) => {
    const { data } = await api.delete<ApiResponse<boolean>>(`/timesheets/${id}`);
    return data;
  },
};
