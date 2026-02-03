import { create } from 'zustand';
import {
  getWorkflowEfficiency,
  getWorkload,
  getDelayRisk,
} from '../services/analyticsService';

interface AnalyticsStore {
  efficiency: any;
  workload: any;
  delayRisk: any;
  isLoading: boolean;
  error: string | null;
  loadAnalytics: () => Promise<void>;
}

export const useAnalyticsStore = create<AnalyticsStore>((set) => ({
  efficiency: null,
  workload: null,
  delayRisk: null,
  isLoading: false,
  error: null,

  loadAnalytics: async () => {
    set({ isLoading: true, error: null });
    try {
      const [efficiency, workload, delayRisk] = await Promise.all([
        getWorkflowEfficiency(),
        getWorkload(),
        getDelayRisk(),
      ]);
      
      set({ 
        efficiency: efficiency || {}, 
        workload: workload || {}, 
        delayRisk: delayRisk || {},
        isLoading: false 
      });
    } catch (err: any) {
      console.error('loadAnalytics error:', err);
      set({ 
        efficiency: {}, 
        workload: {}, 
        delayRisk: {},
        error: err?.message || 'Failed to load analytics',
        isLoading: false 
      });
    }
  },
}));
