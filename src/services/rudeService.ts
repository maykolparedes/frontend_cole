import api from './api';

export const RudeService = {
  show: (codigo: string) => api.get(`/rude/${codigo}`).then(r => r.data),
  upload: (studentId: string, file: File) => {
    const fd = new FormData();
    fd.append('file', file);
    return api.post(`/rude/${studentId}/upload`, fd, {
      headers: { 'Content-Type': 'multipart/form-data' },
    }).then(r => r.data);
  }
};

export default RudeService;
