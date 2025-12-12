import React, { createContext, useContext, useEffect, useState } from 'react';
import auth from '@/services/auth';
import type { User } from '@/services/types';

interface AuthContextValue {
  user: User | null;
  token: string | null;
  loading: boolean;
  login: (email: string, password: string) => Promise<User>;
  logout: () => Promise<void>;
  refresh: () => Promise<User | null>;
  hasRole: (role: string) => boolean;
  hasPermission: (perm: string) => boolean;
}

const AuthContext = createContext<AuthContextValue | undefined>(undefined);

export const AuthProvider: React.FC<{ children: React.ReactNode }> = ({ children }) => {
  const [user, setUser] = useState<User | null>(() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });
  const [token, setToken] = useState<string | null>(() => localStorage.getItem('auth_token'));
  const [loading, setLoading] = useState<boolean>(!!token && !user);

  useEffect(() => {
    // Si hay token pero no hay usuario en memoria, intentar obtener datos de /me
    const init = async () => {
      if (token && !user) {
        setLoading(true);
        try {
          // Asegurar que el header de Authorization está configurado
          const api = (await import('@/services/api')).default;
          api.defaults.headers.common['Authorization'] = `Bearer ${token}`;

          const me = await auth.me();
          // Normalizar abilities → permissions
          const userWithPermissions: User = {
            ...me,
            permissions: me.permissions || me.abilities || [],
          };
          setUser(userWithPermissions);
          localStorage.setItem('user', JSON.stringify(userWithPermissions));
        } catch (e) {
          console.warn('[Auth] Failed to fetch /me on init:', e);
          // Token inválido o expirado
          localStorage.removeItem('auth_token');
          setToken(null);
        } finally {
          setLoading(false);
        }
      }
    };
    init();
  }, [token, user]);

  const login = async (email: string, password: string) => {
    const resp = await auth.login({ email, password, device: 'web' });
    const t = (resp as any)?.token || (resp as any)?.access_token;

    if (!t) {
      throw new Error('No token returned from login');
    }

    // Guardar token inmediatamente para que /me pueda usarlo
    setToken(t);
    localStorage.setItem('auth_token', t);

    try {
      // Obtener datos autoritarios del servidor
      const me = await auth.me();
      
      // Normalizar: si /me tiene 'abilities' pero no 'permissions', usar 'abilities'
      const userWithPermissions: User = {
        ...me,
        permissions: me.permissions || me.abilities || [],
      };

      setUser(userWithPermissions);
      localStorage.setItem('user', JSON.stringify(userWithPermissions));
      
      if (Array.isArray(userWithPermissions.roles) && userWithPermissions.roles.length) {
        localStorage.setItem('user_role', userWithPermissions.roles[0]);
      }
      
      return userWithPermissions;
    } catch (e) {
      console.warn('[Auth] Failed to fetch /me after login:', e);
      
      // Fallback: si /me falla, construir usuario mínimo de la respuesta de login
      // Pero esto es una medida de seguridad degradada
      const role = (resp as any)?.role;
      const mustChangePassword = (resp as any)?.mustChangePassword;
      
      const u: User = {
        id: 0,
        name: email,
        email: email,
        username: email,
        roles: role ? [role] : [],
        permissions: [],
        mustChangePassword: mustChangePassword,
      };
      
      setUser(u);
      localStorage.setItem('user', JSON.stringify(u));
      
      if (u.roles && u.roles.length) {
        localStorage.setItem('user_role', u.roles[0]);
      }
      
      console.warn('[Auth] Using fallback user object (not from /me)');
      return u;
    }
  };

  const logout = async () => {
    try {
      await auth.logout();
    } catch (e) {
      console.warn('[Auth] logout failed', e);
    }
    setUser(null);
    setToken(null);
    localStorage.removeItem('auth_token');
    localStorage.removeItem('user');
    localStorage.removeItem('user_role');
  };

  const refresh = async () => {
    try {
      const me = await auth.me();
      // Normalizar abilities → permissions
      const userWithPermissions: User = {
        ...me,
        permissions: me.permissions || me.abilities || [],
      };
      setUser(userWithPermissions);
      localStorage.setItem('user', JSON.stringify(userWithPermissions));
      return userWithPermissions;
    } catch (e) {
      console.warn('[Auth] refresh /me failed:', e);
      return null;
    }
  };

  const hasRole = (role: string) => {
    if (!user) return false;
    return Array.isArray(user.roles) && user.roles.includes(role);
  };

  const hasPermission = (perm: string) => {
    if (!user) return false;
    // Verificar en permissions (normalizado) o abilities (original del backend)
    const permissions = user.permissions || user.abilities || [];
    // Si tiene "*", tiene todos los permisos
    if (Array.isArray(permissions) && permissions.includes('*')) return true;
    return Array.isArray(permissions) && permissions.includes(perm);
  };

  return (
    <AuthContext.Provider value={{ user, token, loading, login, logout, refresh, hasRole, hasPermission }}>
      {children}
    </AuthContext.Provider>
  );
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

export default AuthContext;
