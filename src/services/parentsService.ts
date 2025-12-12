import api from './api';

export const ParentsService = {
  list: (q = '') => api.get(`/parents?${q}`).then(r => r.data),
  get: (id: string) => api.get(`/parents/${id}`).then(r => r.data),
  create: (payload: any) => api.post('/parents', payload).then(r => r.data),
  update: (id: string, payload: any) => api.put(`/parents/${id}`, payload).then(r => r.data),
  delete: (id: string) => api.delete(`/parents/${id}`).then(r => r.data),
  // Vínculo padre-hijo (si el backend implementa endpoint similar)
  linkChild: (parentId: string, childId: string) => api.post(`/parents/${parentId}/children`, { child_id: childId }).then(r => r.data),
  unlinkChild: (parentId: string, childId: string) => api.delete(`/parents/${parentId}/children/${childId}`).then(r => r.data),
};

export default ParentsService;
