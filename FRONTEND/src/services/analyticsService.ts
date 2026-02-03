import api from './api';

export const getDelayRisk = async () => {
  try {
    const res = await api.get('/api/analytics/delay-risk');
    return res.data?.data || res.data || {};
  } catch (err) {
    console.error('getDelayRisk error:', err);
    return {};
  }
};

export const getWorkflowEfficiency = async () => {
  try {
    const res = await api.get('/api/analytics/workflow-efficiency');
    return res.data?.data || res.data || {};
  } catch (err) {
    console.error('getWorkflowEfficiency error:', err);
    return {};
  }
};

export const getWorkload = async () => {
  try {
    const res = await api.get('/api/analytics/workload');
    return res.data?.data || res.data || {};
  } catch (err) {
    console.error('getWorkload error:', err);
    return {};
  }
};
