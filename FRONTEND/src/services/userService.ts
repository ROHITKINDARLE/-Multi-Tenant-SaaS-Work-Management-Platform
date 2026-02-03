import api from './api';

export interface User {
  id: string;
  email: string;
  role: string;
  created_at: string;
}

export const getUsers = async (): Promise<User[]> => {
  try {
    const res = await api.get('/api/users');
    return res.data.data || [];
  } catch (error) {
    console.error('Error fetching users:', error);
    return [];
  }
};

export const getUserById = async (userId: string): Promise<User | null> => {
  try {
    const res = await api.get(`/api/users/${userId}`);
    return res.data.data || null;
  } catch (error) {
    console.error('Error fetching user:', error);
    return null;
  }
};

export const updateUserRole = async (userId: string, role: string): Promise<User | null> => {
  try {
    const res = await api.put(`/api/users/${userId}/role`, { role });
    return res.data.data || null;
  } catch (error) {
    console.error('Error updating user role:', error);
    throw error;
  }
};

export const deleteUser = async (userId: string): Promise<boolean> => {
  try {
    await api.delete(`/api/users/${userId}`);
    return true;
  } catch (error) {
    console.error('Error deleting user:', error);
    return false;
  }
};
