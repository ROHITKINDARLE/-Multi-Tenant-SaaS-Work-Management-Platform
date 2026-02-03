import api from './api';

export interface Automation {
  id: string;
  type: 'escalation' | 'notification' | 'status_update';
  name: string;
  description?: string;
  enabled: boolean;
  trigger: {
    type: 'stuck_task' | 'overdue_task' | 'manual';
    hoursThreshold?: number;
  };
  action: {
    type: string;
    config: any;
  };
  createdAt?: Date;
  updatedAt?: Date;
}

export const getStuckTasks = async (hours: number = 24) => {
  try {
    const res = await api.get(`/api/automations/stuck?hours=${hours}`);
    return res.data?.data || [];
  } catch (err) {
    console.error('getStuckTasks error:', err);
    return [];
  }
};

export const getOverdueTasks = async () => {
  try {
    const res = await api.get('/api/automations/overdue');
    return res.data?.data || [];
  } catch (err) {
    console.error('getOverdueTasks error:', err);
    return [];
  }
};

export const runEscalation = async () => {
  try {
    const res = await api.post('/api/automations/escalate', {});
    return res.data?.data || { affected: 0 };
  } catch (err) {
    console.error('runEscalation error:', err);
    throw err;
  }
};

export const createAutomation = async (automation: Partial<Automation>) => {
  try {
    // Map frontend structure to backend expected structure
    const payload = {
      name: automation.name,
      description: automation.description,
      type: automation.type,
      enabled: automation.enabled !== false,
      trigger: automation.trigger,
      action: automation.action,
    };

    const res = await api.post('/api/automations', payload);
    return res.data?.data || automation;
  } catch (err) {
    console.error('createAutomation error:', err);
    throw err;
  }
};

export const updateAutomation = async (
  automationId: string,
  updates: Partial<Automation>
) => {
  try {
    // Map frontend structure to backend expected structure
    const payload: any = {};
    
    if (updates.name !== undefined) payload.name = updates.name;
    if (updates.description !== undefined) payload.description = updates.description;
    if (updates.type !== undefined) payload.type = updates.type;
    if (updates.enabled !== undefined) payload.enabled = updates.enabled;
    if (updates.trigger !== undefined) payload.trigger = updates.trigger;
    if (updates.action !== undefined) payload.action = updates.action;

    const res = await api.put(`/api/automations/${automationId}`, payload);
    return res.data?.data || updates;
  } catch (err) {
    console.error('updateAutomation error:', err);
    throw err;
  }
};

export const deleteAutomation = async (automationId: string) => {
  try {
    await api.delete(`/api/automations/${automationId}`);
  } catch (err) {
    console.error('deleteAutomation error:', err);
    throw err;
  }
};

export const listAutomations = async () => {
  try {
    const res = await api.get('/api/automations');
    return res.data?.data || [];
  } catch (err) {
    console.error('listAutomations error:', err);
    return [];
  }
};
