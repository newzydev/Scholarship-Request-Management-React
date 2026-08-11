import axios from 'axios';

export const apiClient = axios.create({
  baseURL: '/api',
  withCredentials: true,
});

apiClient.interceptors.response.use(
  (response) => response,
  (error) => {
    const message = error.response?.data?.message || 'เกิดข้อผิดพลาดในการเชื่อมต่อกับระบบ';
    const fieldErrors = error.response?.data?.errors || [];
    return Promise.reject({ message, fieldErrors, status: error.response?.status });
  }
);
