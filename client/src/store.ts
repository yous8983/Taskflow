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
  toggleTask: (id: number, currentStatusId: number) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  addProject: (name: string, color: string) => Promise<void>;
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
    const newTask = await api.createTask({ title, project_id: activeProjectId, priority: 2 });
    set({ tasks: [newTask, ...tasks] });
  },

  toggleTask: async (id, currentStatusId) => {
    // Si le statut est "Terminé" (4), on repasse à "À faire" (1), sinon on termine (4)
    const newStatusId = currentStatusId === 4 ? 1 : 4;
    const updatedTask = await api.updateTask(id, { status_id: newStatusId });
    set({ tasks: get().tasks.map(t => t.id === id ? updatedTask : t) });
  },

  deleteTask: async (id) => {
    await api.deleteTask(id);
    set({ tasks: get().tasks.filter(t => t.id !== id) });
  },

  addProject: async (name, color) => {
    const newProject = await api.createProject({ name, color });
    set({ projects: [...get().projects, newProject] });
  }
}));
