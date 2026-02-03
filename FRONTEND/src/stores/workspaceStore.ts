import { create } from 'zustand';
import type { Workspace, Project, Task } from '../types';
import {
  fetchWorkspaces,
  fetchProjectsByWorkspace,
  fetchTasksByProject,
  updateTaskStatusAPI,
  createTaskAPI,
  deleteTaskAPI,
} from '../services/workspaceService';
import { useUIStore } from './uiStore';

interface WorkspaceStore {
  currentWorkspace: Workspace | null;
  workspaces: Workspace[];
  projects: Project[];
  tasks: Task[];
  selectedProject: Project | null;
  selectedTask: Task | null;

  loadWorkspaces: () => Promise<void>;
  loadProjects: (workspaceId: string) => Promise<void>;
  loadTasks: (projectId: string) => Promise<void>;

  setCurrentWorkspace: (workspace: Workspace) => void;
  setSelectedProject: (project: Project | null) => void;
  setSelectedTask: (task: Task | null) => void;

  updateTaskWorkflowState: (taskId: string, workflowStateId: string) => Promise<void>;
  addTask: (task: Partial<Task>) => Promise<void>;
  removeTask: (taskId: string) => Promise<void>;
}

export const useWorkspaceStore = create<WorkspaceStore>((set, get) => ({
  currentWorkspace: null,
  workspaces: [],
  projects: [],
  tasks: [],
  selectedProject: null,
  selectedTask: null,

  /* ---------------- LOADERS ---------------- */

  loadWorkspaces: async () => {
    const data = await fetchWorkspaces();
    set({ workspaces: data });
  },

  loadProjects: async (workspaceId) => {
    const data = await fetchProjectsByWorkspace(workspaceId);
    set({ projects: data });
  },

  loadTasks: async (projectId) => {
    const data = await fetchTasksByProject(projectId);
    set({ tasks: data });
  },

  /* ---------------- SETTERS ---------------- */

  setCurrentWorkspace: (workspace) => set({ currentWorkspace: workspace }),

  setSelectedProject: (project) => set({ selectedProject: project }),

  setSelectedTask: (task) => set({ selectedTask: task }),

  /* ---------------- TASK ACTIONS ---------------- */

  updateTaskWorkflowState: async (taskId, workflowStateId) => {
    const previousTasks = get().tasks;

    // Optimistic update
    set({
      tasks: previousTasks.map((task) =>
        task.id === taskId
          ? { ...task, status: workflowStateId }
          : task
      ),
    });

    try {
      await updateTaskStatusAPI(taskId, workflowStateId);
      // Reload to get fresh data
      if (get().selectedProject) {
        await get().loadTasks(get().selectedProject!.id);
      }
    } catch (err: any) {
      // Rollback
      set({ tasks: previousTasks });

      useUIStore.getState().addNotification({
        type: 'error',
        message:
          err?.response?.data?.error ||
          'Failed to update task status',
      });
    }
  },

  addTask: async (task) => {
    try {
      const created = await createTaskAPI(task);
      set((state) => ({
        tasks: [...state.tasks, created],
      }));
    } catch (err: any) {
      useUIStore.getState().addNotification({
        type: 'error',
        message:
          err?.response?.data?.error ||
          'Failed to create task',
      });
    }
  },

  removeTask: async (taskId) => {
    const previousTasks = get().tasks;

    // Optimistic removal
    set({
      tasks: previousTasks.filter((t) => t.id !== taskId),
    });

    try {
      await deleteTaskAPI(taskId);
    } catch (err: any) {
      // Rollback
      set({ tasks: previousTasks });

      useUIStore.getState().addNotification({
        type: 'error',
        message:
          err?.response?.data?.error ||
          'Failed to delete task',
      });
    }
  },
}));
