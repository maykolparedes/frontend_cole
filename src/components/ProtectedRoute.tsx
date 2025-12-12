import React from 'react';
import { Navigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface ProtectedRouteProps {
  roles?: string[];
  children: React.ReactElement | null;
}

const ProtectedRoute: React.FC<ProtectedRouteProps> = ({ roles = [], children }) => {
  const { user, loading } = useAuth();

  // Mientras carga, evita parpadeos; podrías mostrar un spinner
  if (loading) return null;

  // Si no hay usuario autenticado, redirigir al inicio (login)
  if (!user) return <Navigate to="/" replace />;

  // Si no se requieren roles explícitos, permitir
  if (!roles || roles.length === 0) return children;

  const userRoles = Array.isArray(user.roles) ? user.roles : [];
  const allowed = roles.some((r) => userRoles.includes(r));

  if (!allowed) return <Navigate to="/" replace />;

  return children;
};

export default ProtectedRoute;
