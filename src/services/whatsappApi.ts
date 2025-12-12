import api from './api';

export const WhatsappApi = {
  send: (payload: any) => api.post('/whatsapp/send', payload).then(r => r.data),
  bulk: (payload: any) => api.post('/whatsapp/bulk', payload).then(r => r.data),
  logs: (q = '') => api.get(`/whatsapp/logs?${q}`).then(r => r.data),
};

export default WhatsappApi;
