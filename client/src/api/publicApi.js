import { apiClient } from './client';

export const fetchScholarshipTypes = () =>
  apiClient.get('/public/scholarship-types').then((res) => res.data.items);

export const fetchBanks = () => apiClient.get('/public/banks').then((res) => res.data.items);

export const submitPublicRequest = (payload) =>
  apiClient.post('/public/scholarship-requests', payload).then((res) => res.data);
