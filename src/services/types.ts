// src/services/types.ts

export interface User {
  id: number;
  name: string;
  email: string;
  username?: string;
  roles?: string[];
  permissions?: string[];
  abilities?: string[]; // Del backend (puede tener ["*"] para permisos globales)
  mustChangePassword?: number | boolean;
  [key: string]: any;
}

export interface AuthResponse {
  token?: string;
  access_token?: string;
  user?: User;
  [key: string]: any;
}

export interface Role {
  id: number;
  name: string;
}
