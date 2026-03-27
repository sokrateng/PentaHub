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
