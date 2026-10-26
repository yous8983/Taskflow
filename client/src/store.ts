import { create } from 'zustand';
import { api } from './api';

interface AppState {
  projects: any[];
  tasks: any[];
  statuses: any[];
  activeProjectId: number | null;
  editingTask: any | null;
  isLoading: boolean;
  loadData: () => Promise<void>;
  setActiveProject: (id: number | null) => Promise<void>;
  setEditingTask: (task: any | null) => void;
  addTask: (title: string, dueDate?: string) => Promise<void>;
  toggleTask: (id: number, currentStatusId: number) => Promise<void>;
  deleteTask: (id: number) => Promise<void>;
  addProject: (name: string, color: string) => Promise<void>;
  updateTaskStatus: (taskId: number, newStatusId: number) => Promise<void>;
  saveTask: (id: number, data: any) => Promise<void>;
}

export const useStore = create<AppState>((set, get) => ({
  projects: [],
  tasks: [],
  statuses: [],
  activeProjectId: null,
  editingTask: null,
  isLoading: false,
  
  loadData: async () => {
    set({ isLoading: true });
    const [projects, tasks, statuses] = await Promise.all([
      api.getProjects(),
      api.getTasks(),
      api.getStatuses()
    ]);
    set({ projects, tasks, statuses, isLoading: false });
  },

  setActiveProject: async (id) => {
    set({ activeProjectId: id, isLoading: true });
    const tasks = await api.getTasks(id || undefined);
    set({ tasks, isLoading: false });
  },

  setEditingTask: (task) => set({ editingTask: task }),

  addTask: async (title, dueDate) => {
    const { activeProjectId, tasks } = get();
    const newTask = await api.createTask({ title, project_id: activeProjectId, priority: 2, due_date: dueDate || null });
    set({ tasks: [newTask, ...tasks] });
  },

  toggleTask: async (id, currentStatusId) => {
    const newStatusId = currentStatusId === 4 ? 1 : 4;
    const updatedTask = await api.updateTask(id, { status_id: newStatusId });
    set({ tasks: get().tasks.map(t => t.id === id ? updatedTask : t) });
  },

  deleteTask: async (id) => {
    await api.deleteTask(id);
    set({ tasks: get().tasks.filter(t => t.id !== id), editingTask: null });
  },

  addProject: async (name, color) => {
    const newProject = await api.createProject({ name, color });
    set({ projects: [...get().projects, newProject] });
  },

  updateTaskStatus: async (taskId, newStatusId) => {
    set({ tasks: get().tasks.map(t => t.id === taskId ? { ...t, status_id: newStatusId } : t) });
    await api.updateTask(taskId, { status_id: newStatusId });
  },

  saveTask: async (id, data) => {
    const updatedTask = await api.updateTask(id, data);
    set({ tasks: get().tasks.map(t => t.id === id ? updatedTask : t), editingTask: null });
  }
}));
