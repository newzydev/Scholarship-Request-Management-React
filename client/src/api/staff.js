import { apiClient } from './client';

export const fetchStaffList = () =>
  apiClient.get('/staff').then((res) => res.data.items);

export const fetchStaffById = (id) =>
  apiClient.get(`/staff/${id}`).then((res) => res.data.item);

export const createStaff = (payload) =>
  apiClient.post('/staff', payload).then((res) => res.data.item);

export const updateStaff = (id, payload) =>
  apiClient.put(`/staff/${id}`, payload).then((res) => res.data.item);

export const deleteStaff = (id) =>
  apiClient.delete(`/staff/${id}`).then((res) => res.data);
