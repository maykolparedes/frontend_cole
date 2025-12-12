// src/components/AccessDenied.tsx
import React from 'react';
import { AlertTriangle, Home, LogOut } from 'lucide-react';
import { Button } from '@/components/ui/button';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface AccessDeniedProps {
  requiredRole: string;
  userRole?: string;
}

const AccessDenied: React.FC<AccessDeniedProps> = ({ requiredRole, userRole }) => {
  const navigate = useNavigate();
  const { logout } = useAuth();

  const roleDisplayNames: Record<string, string> = {
    admin: 'Administrador',
    teacher: 'Docente',
    student: 'Estudiante',
    parent: 'Padre/Tutor',
  };

  const handleLogout = async () => {
    await logout();
    navigate('/');
  };

  return (
    <div className="min-h-screen bg-gradient-to-br from-red-50 to-red-100 flex items-center justify-center px-4">
      <div className="bg-white rounded-lg shadow-2xl p-8 md:p-12 max-w-md w-full text-center">
        <div className="flex justify-center mb-6">
          <div className="bg-red-100 rounded-full p-4">
            <AlertTriangle className="h-12 w-12 text-red-600" />
          </div>
        </div>

        <h1 className="text-3xl font-bold text-gray-900 mb-2">
          Acceso Denegado
        </h1>

        <p className="text-gray-600 mb-6">
          {userRole 
            ? `Tu cuenta de ${roleDisplayNames[userRole] || userRole} no tiene permiso para acceder a esta sección.`
            : 'No tienes permiso para acceder a esta sección.'}
        </p>

        <div className="bg-blue-50 border border-blue-200 rounded-lg p-4 mb-8">
          <p className="text-sm text-blue-700">
            <strong>Acceso requerido:</strong> {roleDisplayNames[requiredRole] || requiredRole}
          </p>
          {userRole && (
            <p className="text-sm text-blue-700 mt-2">
              <strong>Tu rol:</strong> {roleDisplayNames[userRole] || userRole}
            </p>
          )}
        </div>

        <p className="text-sm text-gray-500 mb-8">
          Si crees que esto es un error, contacta al administrador del sistema.
        </p>

        <div className="flex flex-col gap-3">
          <Button
            onClick={() => navigate('/')}
            className="bg-blue-600 hover:bg-blue-700 text-white w-full flex items-center justify-center gap-2"
          >
            <Home className="h-4 w-4" />
            Volver al Inicio
          </Button>

          <Button
            onClick={handleLogout}
            variant="outline"
            className="w-full flex items-center justify-center gap-2"
          >
            <LogOut className="h-4 w-4" />
            Cerrar Sesión
          </Button>
        </div>
      </div>
    </div>
  );
};

export default AccessDenied;
