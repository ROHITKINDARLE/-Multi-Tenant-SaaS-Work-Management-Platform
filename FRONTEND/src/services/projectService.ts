import api from './api';

export const getProjectsByWorkspace = async (workspaceId: string) => {
  const res = await api.get(`/api/projects/workspace/${workspaceId}`);
  return res.data;
};

export const createProject = async (data: {
  name: string;
  workspaceId: string;
  description?: string;
}) => {
  const res = await api.post('/api/projects', data);
  return res.data;
};

export const updateProject = async (projectId: string, data: {
  name?: string;
  description?: string;
  status?: string;
  priority?: string;
  progress?: number;
}) => {
  const res = await api.put(`/api/projects/${projectId}`, data);
  return res.data;
};
