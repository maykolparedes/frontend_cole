import api from './api';

export const ReportsService = {
  centralByCourse: (params?: Record<string, any>) => api.get('/centralizador/course', { params }).then(r => r.data),
  centralByStudent: (studentId: string) => api.get(`/centralizador/student/${studentId}`).then(r => r.data),
};

export default ReportsService;
