import { apiClient } from './client';

export const fetchReportSummary = (params) =>
  apiClient.get('/reports/summary', { params }).then((res) => res.data);

export const fetchReportDetails = (params) =>
  apiClient.get('/reports/details', { params }).then((res) => res.data);

export const downloadReportExcel = async (params) => {
  const res = await apiClient.get('/reports/export', { params, responseType: 'blob' });
  const disposition = res.headers['content-disposition'] || '';
  const match = disposition.match(/filename="([^"]+)"/);
  const filename = match ? match[1] : 'scholarship-report.xlsx';

  const url = window.URL.createObjectURL(new Blob([res.data]));
  const link = document.createElement('a');
  link.href = url;
  link.download = filename;
  document.body.appendChild(link);
  link.click();
  link.remove();
  window.URL.revokeObjectURL(url);
};
