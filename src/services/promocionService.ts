import api from './api';

export const PromocionService = {
  list: (q = '') => api.get(`/promociones?${q}`).then(r => r.data),
  get: (id: string) => api.get(`/promociones/${id}`).then(r => r.data),
  create: (payload: any) => api.post('/promociones', payload).then(r => r.data),
  update: (id: string, payload: any) => api.put(`/promociones/${id}`, payload).then(r => r.data),
  delete: (id: string) => api.delete(`/promociones/${id}`).then(r => r.data),
  approve: (id: string) => api.post(`/promociones/${id}/aprobar`).then(r => r.data),
  reject: (id: string) => api.post(`/promociones/${id}/rechazar`).then(r => r.data),
  massPromote: (payload: any) => api.post('/promociones/masiva', payload).then(r => r.data),
};

export default PromocionService;
