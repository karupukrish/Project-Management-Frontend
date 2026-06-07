import axios from 'axios';

const API_BASE_URL = process.env.REACT_APP_API_URL || 'http://localhost:8000';

const api = axios.create({
  baseURL: API_BASE_URL,
  headers: {
    'Content-Type': 'application/json',
  },
});

api.interceptors.request.use((config) => {
  const token = localStorage.getItem('token');
  if (token) {
    config.headers.Authorization = `Bearer ${token}`;
  }
  return config;
});

api.interceptors.response.use(
  (response) => response,
  (error) => {
    if (error.response?.status === 401) {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: (data) => api.post('/api/auth/login', data),
  registerAdmin: (data) => api.post('/api/auth/register-admin', data),
};

export const adminAPI = {
  getProjects: () => api.get('/api/admin/projects'),
  createProject: (data) => api.post('/api/admin/projects', data),
  getProject: (id) => api.get(`/api/admin/projects/${id}`),
  updateProject: (id, data) => api.put(`/api/admin/projects/${id}`, data),
  deleteProject: (id) => api.delete(`/api/admin/projects/${id}`),

  getDevelopers: () => api.get('/api/admin/developers'),
  createDeveloper: (data) => api.post('/api/admin/developers', data),
  getDeveloper: (id) => api.get(`/api/admin/developers/${id}`),
  updateDeveloper: (id, data) => api.put(`/api/admin/developers/${id}`, data),
  deleteDeveloper: (id) => api.delete(`/api/admin/developers/${id}`),

  getTasks: (params) => api.get('/api/admin/tasks', { params }),
  createTask: (data) => api.post('/api/admin/tasks', data),
  getTask: (id) => api.get(`/api/admin/tasks/${id}`),
  updateTask: (id, data) => api.put(`/api/admin/tasks/${id}`, data),
  deleteTask: (id) => api.delete(`/api/admin/tasks/${id}`),
};

export const developerAPI = {
  getMyTasks: (params) => api.get('/api/developer/tasks', { params }),
  getMyTask: (id) => api.get(`/api/developer/tasks/${id}`),
  updateTaskStatus: (id, data) => api.put(`/api/developer/tasks/${id}/status`, data),
};

export const healthAPI = {
  check: () => api.get('/api/health'),
};

export default api;
