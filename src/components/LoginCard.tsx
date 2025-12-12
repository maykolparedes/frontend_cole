import { useState } from 'react';
import { Button } from '@/components/ui/button';
import { Card, CardContent, CardHeader, CardTitle } from '@/components/ui/card';
import { Input } from '@/components/ui/input';
import { Label } from '@/components/ui/label';
import { Users, User, BookOpen, Shield, ChevronRight } from 'lucide-react';
import { useToast } from '@/hooks/use-toast';
import { useNavigate } from 'react-router-dom';
import { useAuth } from '@/context/AuthContext';

interface LoginCardProps {
  type: 'parent' | 'student' | 'teacher' | 'admin';
  icon: React.ReactNode;
  title: string;
  description: string;
}

const LoginCard: React.FC<LoginCardProps> = ({ type, icon, title, description }) => {
  const [formData, setFormData] = useState({
    email: '',
    password: '',
    studentCode: ''
  });
  const { toast } = useToast();
  const navigate = useNavigate();
  const { login: authLogin } = useAuth();

  const handleSubmit = async (e: React.FormEvent) => {
    e.preventDefault();

    // Validaciones mínimas (todos inician por correo/contraseña)
    if (!formData.email.trim() || !formData.password.trim()) {
      toast({ title: "Error de validación", description: "Por favor completa correo y contraseña.", variant: "destructive" });
      return;
    }

    try {
      // Usar AuthProvider para login y manejo global de estado
      const user = await authLogin(formData.email.trim(), formData.password);
      // authLogin ya guarda token y user en localStorage

      // Verificar que el usuario tiene el rol correcto para este formulario
      const userRole = user?.roles?.[0];
      if (!userRole) {
        toast({ 
          title: "Error de autenticación", 
          description: "No se pudo obtener el rol del usuario. Intenta nuevamente.",
          variant: "destructive" 
        });
        return;
      }

      // Mapeo de roles esperados según el tipo de formulario
      const expectedRoles: Record<string, string> = {
        student: 'student',
        teacher: 'teacher',
        parent: 'parent',
        admin: 'admin',
      };

      const expectedRole = expectedRoles[type];
      if (userRole !== expectedRole) {
        // El usuario logueó pero con un rol diferente
        toast({ 
          title: "Acceso denegado", 
          description: `Tu cuenta no tiene permiso para acceder como ${title}. Tu rol es: ${userRole}.`,
          variant: "destructive"
        });
        return;
      }

      // Si el usuario debe cambiar contraseña, mostrar advertencia pero permitir acceso
      if (user?.mustChangePassword) {
        toast({ 
          title: "Acceso exitoso", 
          description: `Bienvenido, ${title}. ⚠️ Debes cambiar tu contraseña al acceder.`,
          variant: "default"
        });
      } else {
        toast({ title: "Acceso exitoso", description: `Bienvenido, ${title}.` });
      }

      // Redirección correcta según tipo
      setTimeout(() => {
        switch (type) {
          case 'student':
            navigate('/dashboard/student');
            break;
          case 'teacher':
            navigate('/seleccionar-nivel', { state: { role: 'teacher' } });
            break;
          case 'parent':
            navigate('/dashboard/parent');
            break;
          case 'admin':
            navigate('/dashboard/admin');
            break;
          default:
            navigate('/');
        }
      }, 400);
    } catch (err: any) {
      // auth.login ahora relanza `response.data` cuando hay error de validación
      console.error('[Login] error', err);

      // Si es un objeto con `errors` (Laravel validation), juntamos mensajes
      const validation = err?.errors;
      if (validation && typeof validation === 'object') {
        const msgs: string[] = [];
        Object.keys(validation).forEach((k) => {
          const v = validation[k];
          if (Array.isArray(v)) msgs.push(...v.map(String));
          else if (typeof v === 'string') msgs.push(v);
        });
        const first = msgs.slice(0, 3).join(' — ');
        toast({ title: 'Errores de validación', description: first || 'Campos inválidos', variant: 'destructive' });
        // guardar detalle en localStorage para inspección rápida (opcional)
        try { localStorage.setItem('last_auth_error', JSON.stringify(err)); } catch {}
        return;
      }

      // Si viene un mensaje simple
      let msg = err?.message || err?.error || err?.msg || (typeof err === 'string' ? err : null) || 'Error al iniciar sesión';
      
      // Mapear errores comunes
      if (msg.includes('invalidas') || msg.includes('invalid')) {
        msg = 'Usuario o contraseña incorrectos. Verifica tus credenciales.';
      }
      
      toast({ title: 'Error de autenticación', description: String(msg), variant: 'destructive' });
      try { localStorage.setItem('last_auth_error', JSON.stringify(err)); } catch {}
    }
  };

  const renderForm = () => {
    if (type === 'parent') {
      return (
        <div className="space-y-4">
          <div className="space-y-2">
            <Label htmlFor="studentCode">Código o Nombre del Estudiante (opcional)</Label>
            <Input
              id="studentCode"
              placeholder="Ej: EST-2025-001 o Juan Pérez"
              value={formData.studentCode}
              onChange={(e) => setFormData({ ...formData, studentCode: e.target.value })}
              className="font-inter"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="email">Usuario</Label>
            <Input
              id="email"
              placeholder="Ej: padre"
              value={formData.email}
              onChange={(e) => setFormData({ ...formData, email: e.target.value })}
              className="font-inter"
            />
          </div>
          <div className="space-y-2">
            <Label htmlFor="password">Contraseña</Label>
            <Input
              id="password"
              type="password"
              placeholder="••••••••"
              value={formData.password}
              onChange={(e) => setFormData({ ...formData, password: e.target.value })}
              className="font-inter"
            />
          </div>
        </div>
      );
    }
    return (
      <div className="space-y-4">
        <div className="space-y-2">
          <Label htmlFor="email">Usuario</Label>
          <Input
            id="email"
            placeholder={type === 'student' ? 'Ej: estudiante' : type === 'teacher' ? 'Ej: docente' : type === 'admin' ? 'Ej: admin' : 'Ingresa tu usuario'}
            value={formData.email}
            onChange={(e) => setFormData({ ...formData, email: e.target.value })}
            className="font-inter"
          />
        </div>
        <div className="space-y-2">
          <Label htmlFor="password">Contraseña</Label>
          <Input
            id="password"
            type="password"
            placeholder="••••••••"
            value={formData.password}
            onChange={(e) => setFormData({ ...formData, password: e.target.value })}
            className="font-inter"
          />
        </div>
      </div>
    );
  };

  const getButtonVariant = () => {
    switch (type) {
      case 'parent': return 'academicYellow';
      case 'student': return 'secondary';
      case 'teacher': return 'academic';
      case 'admin': return 'default';
      default: return 'default';
    }
  };

  return (
    <Card className="w-full max-w-md hover:shadow-academic transition-all duration-300 bg-card/95 backdrop-blur-sm">
      <CardHeader className="text-center pb-4">
        <div className="mx-auto mb-4 p-3 bg-gradient-primary rounded-full w-fit">
          {icon}
        </div>
        <CardTitle className="text-xl font-semibold text-foreground font-inter">
          {title}
        </CardTitle>
        <p className="text-sm text-muted-foreground">{description}</p>
      </CardHeader>

      <CardContent>
        <form onSubmit={handleSubmit} className="space-y-6">
          {renderForm()}
          <Button type="submit" className="w-full" variant={getButtonVariant()} size="lg">
            <span>Ingresar</span>
            <ChevronRight className="h-4 w-4" />
          </Button>
          {type !== 'parent' && (
            <div className="text-center">
              <Button variant="link" size="sm" className="text-muted-foreground">
                ¿Olvidaste tu contraseña?
              </Button>
            </div>
          )}
        </form>
      </CardContent>
    </Card>
  );
};

// Cards preconfiguradas
export const ParentLoginCard = () => (
  <LoginCard type="parent" icon={<Users className="h-6 w-6 text-primary-foreground" />} title="Padres/Tutores" description="Consulta la información académica de tu hijo" />
);
export const StudentLoginCard = () => (
  <LoginCard type="student" icon={<User className="h-6 w-6 text-primary-foreground" />} title="Estudiantes" description="Revisa tus notas, tareas y avances" />
);
export const TeacherLoginCard = () => (
  <LoginCard type="teacher" icon={<BookOpen className="h-6 w-6 text-primary-foreground" />} title="Docentes" description="Gestiona notas, tareas y observaciones" />
);
export const AdminLoginCard = () => (
  <LoginCard type="admin" icon={<Shield className="h-6 w-6 text-primary-foreground" />} title="Administrador" description="Administra el sistema académico" />
);

export default LoginCard;
