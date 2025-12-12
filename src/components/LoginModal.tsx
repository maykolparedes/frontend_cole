// src/components/LoginModal.tsx 

import { useState } from "react"; 

import { 

  ParentLoginCard, 

  StudentLoginCard, 

  TeacherLoginCard, 

  AdminLoginCard, 

} from "@/components/LoginCard"; 

import { X, ArrowLeft, Home } from "lucide-react"; 

 

interface LoginModalProps { 

  isOpen: boolean; 

  onClose: () => void; 

} 

 

type UserRole = "parent" | "student" | "teacher" | "admin" | null; 

 

const LoginModal = ({ isOpen, onClose }: LoginModalProps) => { 

  const [selectedRole, setSelectedRole] = useState<UserRole>(null); 

 

  if (!isOpen) return null; 

 

  const handleBackToRoles = () => { 

    setSelectedRole(null); 

  }; 

 

  const getRoleTitle = (role: UserRole) => { 

    switch (role) { 

      case "parent": return "Padre/Madre"; 

      case "student": return "Estudiante"; 

      case "teacher": return "Docente"; 

      case "admin": return "Administrador"; 

      default: return ""; 

    } 

  }; 

 

  return ( 

    <div  

      className="fixed inset-0 z-50 flex items-center justify-center p-4 bg-black/50 backdrop-blur-sm" 

      onClick={(e) => { 

        if (e.target === e.currentTarget) onClose(); 

      }} 

    > 

      {/* Botón de Home flotante */} 

      <button 

        onClick={onClose} 

        className="fixed top-4 left-4 z-50 w-9 h-9 flex items-center justify-center cursor-pointer rounded-full bg-white/20 backdrop-blur-sm transition-all duration-300 hover:bg-white/30 hover:scale-105" 

      > 

        <Home className="h-5 w-5 text-white opacity-80" /> 

      </button> 

 

      <div className="relative bg-white rounded-xl shadow-2xl w-full max-w-5xl max-h-[95vh] overflow-hidden flex min-h-[600px]"> 

        {/* Panel Izquierdo - 40% */} 

        <div className="hidden md:flex w-[40%] brand-panel relative overflow-hidden"> 

          {/* Fondo de color sólido */} 

          <div className="absolute inset-0 bg-gradient-to-br from-sky-700 to-sky-900"></div> 

           

          {/* Contenido */} 

          <div className="relative z-10 w-full h-full flex flex-col items-center justify-center p-8"> 

            {/* Logo en la parte superior izquierda */} 

            <div className="absolute top-8 left-8"> 

              <img  

                src="/src/assets/logo.png" 

                alt="Logo Colegio" 

                className="w-16 h-16 object-contain" 

                onError={(e) => { 

                  (e.target as HTMLImageElement).src = "https://via.placeholder.com/64x64/FFFFFF/000000?text=LOGO"; 

                }} 

              /> 

            </div> 

 

            <div className="w-full max-w-xs flex flex-col items-center"> 

              {/* Cuadro con la imagen - un poco más abajo y con marco */} 

              <div className="mb-4 mt-32"> 

                <div className="relative w-70 h-48 rounded-xl overflow-hidden shadow-2xl border-4 border-white"> 

                  <img  

                    src="/src/assets/fondo5.jpg" 

                    alt="Colegio" 

                    className="w-full h-full object-cover" 

                    onError={(e) => { 

                      (e.target as HTMLImageElement).src = "https://images.unsplash.com/photo-1523050854058-8df90110c9f1?ixlib=rb-4.0.3&auto=format&fit=crop&w=600&q=80"; 

                    }} 

                  /> 

                  <div className="absolute inset-0 bg-gradient-to-t from-black/30 to-transparent"></div> 

                </div> 

              </div> 

 

              {/* Texto debajo de la imagen */} 

              <div className="text-center text-white"> 

                <h2 className="text-2xl font-bold font-serif mb-4">Bienvenido al Sistema Educativo</h2> 

                <p className="text-sm leading-relaxed opacity-90"> 

                  Accede a tu panel de gestión educativa de forma segura.  

                  Selecciona tu rol para continuar con el inicio de sesión. 

                </p> 

              </div> 

            </div> 

          </div> 

        </div> 

 

        {/* Panel Derecho - 60% */} 

        <div className="flex-1 w-full md:w-[60%] bg-white overflow-y-auto"> 

          {/* Header */} 

          <div className="sticky top-0 bg-white border-b px-6 py-4 flex items-center justify-between"> 

            <div className="flex items-center gap-3"> 

              {selectedRole && ( 

                <button 

                  onClick={handleBackToRoles} 

                  className="h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors" 

                > 

                  <ArrowLeft className="h-4 w-4 text-gray-600" /> 

                </button> 

              )} 

              <div> 

                <h2 className="text-xl font-semibold text-gray-800"> 

                  {selectedRole ? `Iniciar Sesión` : "Acceso a la Plataforma"} 

                </h2> 

                <p className="text-sm text-gray-600"> 

                  {selectedRole  

                    ? `Como ${getRoleTitle(selectedRole)}`  

                    : "Selecciona tu tipo de usuario" 

                  } 

                </p> 

              </div> 

            </div> 

            <button 

              onClick={onClose} 

              className="h-8 w-8 rounded-full hover:bg-gray-100 flex items-center justify-center transition-colors" 

            > 

              <X className="h-4 w-4 text-gray-600" /> 

            </button> 

          </div> 

 

          <div className="p-6 md:p-8"> 

            {!selectedRole ? ( 

              // PANTALLA DE SELECCIÓN DE ROLES 

              <> 

                {/* Logo del colegio en mobile */} 

                <div className="md:hidden flex flex-col items-center gap-4 mb-8"> 

                  <img  

                    src="/src/assets/logo.png" 

                    alt="Logo Colegio"  

                    className="w-16 h-16 object-contain" 

                    onError={(e) => { 

                      (e.target as HTMLImageElement).src = "https://via.placeholder.com/64x64/3B82F6/FFFFFF?text=LOGO"; 

                    }} 

                  /> 

                  <div className="text-center"> 

                    <h3 className="text-xl font-semibold text-gray-800">Seleccionar Rol</h3> 

                    <p className="text-sm text-gray-600">Elige tu tipo de usuario</p> 

                  </div> 

                </div> 

 

                {/* Cards de Roles - CONTENIDO CENTRADO */} 

                <div className="grid grid-cols-1 md:grid-cols-2 gap-4"> 

                  {[ 

                    { id: "parent", label: "Padre/Madre", desc: "Accede al seguimiento académico", emoji: "👨‍👩‍👧", color: "blue" }, 

                    { id: "student", label: "Estudiante", desc: "Ingresa a cursos y calificaciones", emoji: "👨‍🎓", color: "green" }, 

                    { id: "teacher", label: "Docente", desc: "Gestiona cursos y estudiantes", emoji: "👨‍🏫", color: "purple" }, 

                    { id: "admin", label: "Administrador", desc: "Administra el sistema completo", emoji: "👨‍💼", color: "red" }, 

                  ].map((role) => ( 

                    <button 

                      key={role.id} 

                      onClick={() => setSelectedRole(role.id as UserRole)} 

                      className="text-center p-5 bg-white border border-gray-200 rounded-lg hover:shadow-md transition-all duration-200 hover:-translate-y-1 hover:border-gray-300 group cursor-pointer w-full" 

                    > 

                      {/* CAMBIÉ: text-left por text-center y flex-col para centrar verticalmente */} 

                      <div className="flex flex-col items-center gap-3"> 

                        <div className={`h-16 w-16 rounded-full ${ 

                          role.color === "blue" ? "bg-blue-50" : 

                          role.color === "green" ? "bg-green-50" : 

                          role.color === "purple" ? "bg-purple-50" : 

                          "bg-red-50" 

                        } flex items-center justify-center group-hover:scale-110 transition-transform duration-200`}> 

                          <span className="text-3xl">{role.emoji}</span> 

                        </div> 

                        <div className="flex-1"> 

                          <h3 className="font-semibold text-gray-800 text-lg mb-1">{role.label}</h3> 

                          <p className="text-sm text-gray-600">{role.desc}</p> 

                        </div> 

                      </div> 

                    </button> 

                  ))} 

                </div> 

              </> 

            ) : ( 

              // PANTALLA DE LOGIN SEGÚN ROL SELECCIONADO 

              <div className="max-w-md mx-auto"> 

                {/* Logo y título */} 

                <div className="flex items-center gap-4 mb-8"> 

                  <div className={`h-16 w-16 rounded-full ${ 

                    selectedRole === "parent" ? "bg-blue-50" : 

                    selectedRole === "student" ? "bg-green-50" : 

                    selectedRole === "teacher" ? "bg-purple-50" : 

                    "bg-red-50" 

                  } flex items-center justify-center`}> 

                    <span className="text-3xl"> 

                      {selectedRole === "parent" ? "👨‍👩‍👧" : 

                      selectedRole === "student" ? "👨‍🎓" : 

                      selectedRole === "teacher" ? "👨‍🏫" : 

                      "👨‍💼"} 

                    </span> 

                  </div> 

                  <div> 

                    <h3 className="text-2xl font-semibold text-gray-800">Iniciar Sesión</h3> 

                    <p className="text-sm text-gray-600">Como {getRoleTitle(selectedRole)}</p> 

                  </div> 

                </div> 

 

                {/* Renderizar el LoginCard correspondiente */} 

                <div className="mb-6"> 

                  {selectedRole === "parent" && <ParentLoginCard />} 

                  {selectedRole === "student" && <StudentLoginCard />} 

                  {selectedRole === "teacher" && <TeacherLoginCard />} 

                  {selectedRole === "admin" && <AdminLoginCard />} 

                </div> 

 

                {/* Opción para cambiar de rol */} 

                <div className="text-center pt-6 border-t border-gray-200"> 

                  <button  

                    onClick={handleBackToRoles} 

                    className="text-sm text-blue-600 hover:text-blue-800 hover:underline transition-colors font-medium inline-flex items-center gap-1" 

                  > 

                    <ArrowLeft className="h-3 w-3" /> 

                    Volver a selección de roles 

                  </button> 

                </div> 

              </div> 

            )} 

          </div> 

        </div> 

      </div> 

    </div> 

  ); 

}; 

 

export default LoginModal; 

 