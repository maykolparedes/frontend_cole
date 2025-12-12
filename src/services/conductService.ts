import api from './api';

export const ConductService = {
  list: (q = '') => api.get(`/conduct?${q}`).then(r => r.data),
  get: (id: string) => api.get(`/conduct/${id}`).then(r => r.data),
  create: (payload: any) => api.post('/conduct', payload).then(r => r.data),
  update: (id: string, payload: any) => api.put(`/conduct/${id}`, payload).then(r => r.data),
  delete: (id: string) => api.delete(`/conduct/${id}`).then(r => r.data),
  approve: (id: string) => api.patch(`/conduct/${id}/approve`).then(r => r.data),
};

export default ConductService;
