const API_URL = '/api';

export const api = {
  getProjects: () => fetch(`${API_URL}/projects`).then(res => res.json()),
  getTasks: (projectId?: number) => {
    const url = projectId ? `${API_URL}/tasks?project_id=${projectId}` : `${API_URL}/tasks`;
    return fetch(url).then(res => res.json());
  },
  getStatuses: () => fetch(`${API_URL}/statuses`).then(res => res.json()),
  createTask: (data: any) => fetch(`${API_URL}/tasks`, {
    method: 'POST',
    headers: { 'Content-Type': 'application/json' },
    body: JSON.stringify(data)
  }).then(res => res.json()),
};
