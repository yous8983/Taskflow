import { create } from 'zustand';
import { api } from './api';

interface AppState {
  projects: any[];
  tasks: any[];
  activeProjectId: number | null;
  isLoading: boolean;
  loadData: () => Promise<void>;
  setActiveProject: (id: number | null) => Promise<void>;
  addTask: (title: string) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  projects: [],
  tasks: [],
  activeProjectId: null,
  isLoading: false,
  
  loadData: async () => {
    set({ isLoading: true });
    const projects = await api.getProjects();
    const tasks = await api.getTasks();
    set({ projects, tasks, isLoading: false });
  },

  setActiveProject: async (id) => {
    set({ activeProjectId: id, isLoading: true });
    const tasks = await api.getTasks(id || undefined);
    set({ tasks, isLoading: false });
  },

  addTask: async (title) => {
    const { activeProjectId, tasks } = get();
    const newTask = await api.createTask({ 
      title, 
      project_id: activeProjectId,
      priority: 2 
    });
    set({ tasks: [...tasks, newTask] });
  }
}));
