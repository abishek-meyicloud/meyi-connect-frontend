import axios from 'axios';

const API_BASE_URL = import.meta.env.VITE_API_BASE_URL || 'http://localhost:3000';

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
      window.location.href = '/login';
    }
    return Promise.reject(error);
  }
);

export const authAPI = {
  login: async (email: string, password: string) => {
    const { data } = await api.post('/auth/login', { email, password });
    return data;
  },
  register: async (userData: any) => {
    const { data } = await api.post('/auth/register', userData);
    return data;
  },
  getSSOProviders: async () => {
    const { data } = await api.get('/auth/sso/providers');
    return data;
  },
  logout: async () => {
    await api.post('/auth/logout');
  },
  refreshToken: async () => {
    const { data } = await api.post('/auth/refresh');
    return data;
  },
};

export const usersAPI = {
  getAll: async () => {
    const { data } = await api.get('/users');
    return data;
  },
  getById: async (id: string) => {
    const { data } = await api.get(`/users/${id}`);
    return data;
  },
  create: async (userData: any) => {
    const { data } = await api.post('/auth/register', userData);
    return data;
  },
  update: async (id: string, userData: any) => {
    const { data } = await api.patch(`/users/${id}`, userData);
    return data;
  },
  delete: async (id: string) => {
    await api.delete(`/users/${id}`);
  },
  getLoginHistory: async (id: string) => {
    const { data } = await api.get(`/users/${id}/login-history`);
    return data;
  },
  getCommandLogs: async (id: string) => {
    const { data } = await api.get(`/users/${id}/command-logs`);
    return data;
  },
};

export const teamsAPI = {
  getAll: async () => {
    const { data } = await api.get('/teams');
    return data;
  },
  create: async (teamData: any) => {
    const { data } = await api.post('/teams', teamData);
    return data;
  },
  addUsers: async (teamId: string, userIds: string[]) => {
    const { data } = await api.post(`/teams/${teamId}/users`, { userIds });
    return data;
  },
  removeUser: async (teamId: string, userId: string) => {
    await api.delete(`/teams/${teamId}/users/${userId}`);
  },
  getResources: async (teamId: string) => {
    const { data } = await api.get(`/teams/${teamId}/resources`);
    return data;
  },
  getPermissions: async (teamId: string) => {
    const { data } = await api.get(`/teams/${teamId}/permissions`);
    return data;
  },
};

export const resourcesAPI = {
  getAll: async () => {
    const { data } = await api.get('/resources');
    return data;
  },
  create: async (resourceData: any) => {
    const { data } = await api.post('/resources', resourceData);
    return data;
  },
  update: async (id: string, resourceData: any) => {
    const { data } = await api.patch(`/resources/${id}`, resourceData);
    return data;
  },
  delete: async (id: string) => {
    await api.delete(`/resources/${id}`);
  },
  getPermissions: async (id: string) => {
    const { data } = await api.get(`/resources/${id}/permissions`);
    return data;
  },
  assignPermission: async (id: string, permissionData: any) => {
    const { data } = await api.post(`/resources/${id}/permissions`, permissionData);
    return data;
  },
};

export const keysAPI = {
  getAll: async () => {
    const { data } = await api.get('/keys');
    return data;
  },
  create: async (keyData: any) => {
    const { data } = await api.post('/keys', keyData);
    return data;
  },
  delete: async (id: string) => {
    await api.delete(`/keys/${id}`);
  },
};

export const permissionsAPI = {
  getAll: async () => {
    const { data } = await api.get('/permissions');
    return data;
  },
  grant: async (permissionData: any) => {
    const { data } = await api.post('/permissions', permissionData);
    return data;
  },
  revoke: async (id: string) => {
    await api.delete(`/permissions/${id}`);
  },
};

export const settingsAPI = {
  get: async () => {
    const { data } = await api.get('/settings');
    return data;
  },
  update: async (settings: any) => {
    const { data } = await api.patch('/settings', settings);
    return data;
  },
  getProviders: async () => {
    const { data } = await api.get('/settings/providers');
    return data;
  },
};

export const logsAPI = {
  getSessions: async () => {
    const { data } = await api.get('/logs/sessions');
    return data;
  },
  getCommands: async () => {
    const { data } = await api.get('/logs/commands');
    return data;
  },
  getResources: async () => {
    const { data } = await api.get('/logs/resources');
    return data;
  },
};

export const proxyAPI = {
  startSession: async (sessionData: any) => {
    const { data } = await api.post('/proxy/session/start', sessionData);
    return data;
  },
  stopSession: async (sessionId: string) => {
    const { data } = await api.post('/proxy/session/stop', { sessionId });
    return data;
  },
  getSessionStatus: async (sessionId: string) => {
    const { data } = await api.get(`/proxy/session/${sessionId}/status`);
    return data;
  },
  getActiveSessions: async () => {
    const { data } = await api.get('/proxy/sessions');
    return data;
  },
};

export const healthAPI = {
  check: async () => {
    const { data } = await api.get('/health');
    return data;
  },
  version: async () => {
    const { data } = await api.get('/version');
    return data;
  },
  metrics: async () => {
    const { data } = await api.get('/metrics');
    return data;
  },
};

export default api;
