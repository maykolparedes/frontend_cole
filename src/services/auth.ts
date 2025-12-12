// src/services/auth.ts
import api from './api';
import { http } from './http';

import type { AuthResponse, User } from './types';

type LoginParams = { email: string; password: string; device?: string };

const AUTH_ENDPOINT = import.meta.env.VITE_AUTH_LOGIN_ENDPOINT || '/login';

async function login({ email, password, device = 'web' }: LoginParams): Promise<AuthResponse> {
  // Backend espera username; usamos email como username
  const payload = { username: email, password, device };
  try {
    const res = await api.post(AUTH_ENDPOINT, payload);
    const data: AuthResponse = res.data;
    const token = data?.token || (data as any)?.access_token;
    if (token) {
      api.defaults.headers.common['Authorization'] = `Bearer ${token}`;
      if (http) http.defaults.headers.common['Authorization'] = `Bearer ${token}`;
    }
    return data;
  } catch (err: any) {
    // Propagar información útil al UI
    const resp = err?.response;
    if (resp && resp.data) {
      // Re-lanzar el objeto de response.data para que el UI pueda mostrar errores de validación
      throw resp.data;
    }
    throw err;
  }
}

async function me(): Promise<User> {
  const res = await api.get('/me');
  return res.data;
}

async function logout(): Promise<void> {
  await api.post('/logout');
  delete api.defaults.headers.common['Authorization'];
  if (http) delete http.defaults.headers.common['Authorization'];
  localStorage.removeItem('auth_token');
  localStorage.removeItem('user');
  localStorage.removeItem('user_role');
}

async function getRoles() {
  const res = await api.get('/roles');
  return res.data;
}

export default { login, me, logout, getRoles };
