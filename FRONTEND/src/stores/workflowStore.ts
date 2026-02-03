import { create } from 'zustand';
import {
  getWorkflowStates,
  getWorkflowTransitions,
} from '../services/workflowService';

interface WorkflowState {
  id: string;        // UUID
  name: string;      // e.g. "Todo"
  order: number;     // for column sorting
}

interface WorkflowTransition {
  fromStateId: string;
  toStateId: string;
}

interface WorkflowStore {
  states: WorkflowState[];
  transitions: WorkflowTransition[];
  isLoading: boolean;

  loadWorkflows: () => Promise<void>;
  isTransitionAllowed: (from: string, to: string) => boolean;
}

export const useWorkflowStore = create<WorkflowStore>((set, get) => ({
  states: [],
  transitions: [],
  isLoading: false,

  loadWorkflows: async () => {
    set({ isLoading: true });

    try {
      const [states, transitions] = await Promise.all([
        getWorkflowStates(),
        getWorkflowTransitions(),
      ]);

      set({
        states,
        transitions,
        isLoading: false,
      });
    } catch {
      set({ isLoading: false });
    }
  },

  isTransitionAllowed: (from, to) => {
    return get().transitions.some(
      (t) =>
        t.fromStateId === from &&
        t.toStateId === to
    );
  },
}));
