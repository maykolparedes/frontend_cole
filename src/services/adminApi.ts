// src/services/adminApi.ts
import type { EstudianteCreateDTO, EstudianteDTO, DocenteCreateDTO, DocenteDTO } from "@/lib/dtos";
import api from '@/services/api';

// ESTUDIANTES
export const AdminStudent = {
  list: (q = "") => api.get<EstudianteDTO[]>(`/students?${q}`).then(r => r.data),
  get: (id: string) => api.get<EstudianteDTO>(`/students/${id}`).then(r => r.data),
  create: (payload: EstudianteCreateDTO) => api.post<EstudianteDTO>(`/students`, payload).then(r => r.data),
  update: (id: string, payload: Partial<EstudianteCreateDTO>) => api.put<EstudianteDTO>(`/students/${id}`, payload).then(r => r.data),
  // Generación RUDE la hace el backend al crear; también puedes refrescar:
  regenRUDE: (id: string) => api.post<{ codigo_rude: string }>(`/students/${id}/rude`).then(r => r.data),
  delete: (id: string) => api.delete<void>(`/students/${id}`).then(r => r.data),
};

// DOCENTES
export const AdminTeacher = {
  list: (q = "") => api.get<DocenteDTO[]>(`/teachers?${q}`).then(r => r.data),
  get: (id: string) => api.get<DocenteDTO>(`/teachers/${id}`).then(r => r.data),
  create: (payload: DocenteCreateDTO) => api.post<DocenteDTO>(`/teachers`, payload).then(r => r.data),
  update: (id: string, payload: Partial<DocenteCreateDTO>) => api.put<DocenteDTO>(`/teachers/${id}`, payload).then(r => r.data),
  delete: (id: string) => api.delete<void>(`/teachers/${id}`).then(r => r.data),
};
