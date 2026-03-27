import axios from 'axios';
import type { ApiResponse, Project, ProjectListItem, ProjectStats, User, CreateProjectRequest } from '@/types';

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
