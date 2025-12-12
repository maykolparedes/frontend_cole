import api from './api';

export const PreinscriptionService = {
  create: (payload: any) => api.post('/preinscriptions', payload).then(r => r.data),
  getByCode: (codigo: string) => api.get(`/preinscriptions/${codigo}`).then(r => r.data),
  downloadRude: (codigo: string) => api.get(`/preinscriptions/${codigo}/rude`, { responseType: 'blob' }).then(r => r.data),
  approve: (id: string) => api.patch(`/preinscriptions/${id}/approve`).then(r => r.data),
  reject: (id: string) => api.patch(`/preinscriptions/${id}/reject`).then(r => r.data),
};

export default PreinscriptionService;
