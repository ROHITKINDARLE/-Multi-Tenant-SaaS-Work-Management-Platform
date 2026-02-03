import api from './api';

export const getTasksByProject = async (projectId: string) => {
  try {
    const res = await api.get(`/api/tasks/project/${projectId}`);
    return res.data?.data || [];
  } catch (err) {
    console.error('getTasksByProject error:', err);
    return [];
  }
};

export const updateTaskStatus = async (
  taskId: string,
  status: string
) => {
  try {
    const res = await api.patch(`/api/tasks/${taskId}/status`, {
      status,
    });
    return res.data?.data || {};
  } catch (err) {
    console.error('updateTaskStatus error:', err);
    throw err;
  }
};
