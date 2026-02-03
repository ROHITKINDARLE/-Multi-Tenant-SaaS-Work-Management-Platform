import api from './api';

export const getWorkflowStates = async () => {
  try {
    const res = await api.get('/api/workflows/states/all');
    console.log('getWorkflowStates response:', res.data);
    const states = res.data?.data || [];
    console.log('getWorkflowStates extracted:', states);
    return states;
  } catch (err) {
    console.error('getWorkflowStates error:', err);
    return [];
  }
};

export const getWorkflowTransitions = async () => {
  try {
    const res = await api.get('/api/workflows/transitions');
    console.log('getWorkflowTransitions response:', res.data);
    const transitions = res.data?.data || [];
    console.log('getWorkflowTransitions extracted:', transitions);
    return transitions;
  } catch (err) {
    console.error('getWorkflowTransitions error:', err);
    return [];
  }
};
