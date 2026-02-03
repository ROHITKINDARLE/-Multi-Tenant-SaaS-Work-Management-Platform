import api from './api';

export const fetchWorkspaces = async () => {
  try {
    const res = await api.get('/api/workspaces');
    return res.data?.data || [];
  } catch (err) {
    console.error('fetchWorkspaces error:', err);
    return [];
  }
};

export const fetchProjectsByWorkspace = async (workspaceId: string) => {
  try {
    const res = await api.get(`/api/projects/workspace/${workspaceId}`);
    return res.data?.data || [];
  } catch (err) {
    console.error('fetchProjectsByWorkspace error:', err);
    return [];
  }
};

export const fetchTasksByProject = async (projectId: string) => {
  try {
    const res = await api.get(`/api/tasks/project/${projectId}`);
    return res.data?.data || [];
  } catch (err) {
    console.error('fetchTasksByProject error:', err);
    return [];
  }
};

export const updateTaskStatusAPI = async (
  taskId: string,
  status: string
) => {
  try {
    const res = await api.patch(`/api/tasks/${taskId}/status`, {
      status,
    });
    return res.data?.data || {};
  } catch (err) {
    console.error('updateTaskStatusAPI error:', err);
    throw err;
  }
};

export const createTaskAPI = async (task: any) => {
  try {
    const res = await api.post('/api/tasks', task);
    return res.data?.data || task;
  } catch (err) {
    console.error('createTaskAPI error:', err);
    throw err;
  }
};

export const deleteTaskAPI = async (taskId: string) => {
  try {
    await api.delete(`/api/tasks/${taskId}`);
  } catch (err) {
    console.error('deleteTaskAPI error:', err);
    throw err;
  }
};
