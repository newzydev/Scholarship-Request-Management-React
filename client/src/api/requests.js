import { apiClient } from './client';

export const fetchRequests = (params) =>
  apiClient.get('/scholarship-requests', { params }).then((res) => res.data);

export const fetchRequestById = (id) =>
  apiClient.get(`/scholarship-requests/${id}`).then((res) => res.data.item);

export const createRequest = (payload) =>
  apiClient.post('/scholarship-requests', payload).then((res) => res.data.item);

export const updateRequest = (id, payload) =>
  apiClient.put(`/scholarship-requests/${id}`, payload).then((res) => res.data.item);

export const changeRequestStatus = (id, status, statusNote) =>
  apiClient
    .patch(`/scholarship-requests/${id}/status`, { status, status_note: statusNote })
    .then((res) => res.data.item);

export const deleteRequest = (id) =>
  apiClient.delete(`/scholarship-requests/${id}`).then((res) => res.data);
