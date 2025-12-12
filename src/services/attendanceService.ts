import api from './api';

export const AttendanceService = {
  list: (q = '') => api.get(`/attendance?${q}`).then(r => r.data),
  create: (payload: any) => api.post('/attendance', payload).then(r => r.data),
  bulkStore: (payload: any) => api.post('/attendance/bulk', payload).then(r => r.data),
  report: (studentId: string) => api.get(`/attendance/report/${studentId}`).then(r => r.data),
};

export default AttendanceService;
