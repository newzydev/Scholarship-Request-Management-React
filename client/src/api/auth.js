import { apiClient } from './client';

export const login = (username, password) =>
  apiClient.post('/auth/login', { username, password }).then((res) => res.data);

export const logout = () => apiClient.post('/auth/logout').then((res) => res.data);

export const fetchMe = () => apiClient.get('/auth/me').then((res) => res.data);
