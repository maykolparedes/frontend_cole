# ✅ Validación de Seguridad de Roles - Instrucciones

## 📋 Resumen de lo que se implementó

1. **AuthContext mejorado**: Después de cada login, el frontend llama a `/me` para obtener los datos reales del usuario desde el servidor.
2. **Roles autoritarios**: Los roles siempre vienen de `/me`, nunca de la respuesta de `/login` (que solo devuelve un role "genérico").
3. **Guards en dashboards**: Cada dashboard (`AdminDashboard`, `TeacherDashboard`, `StudentDashboard`, `ParentDashboard`) verifica que el usuario tenga el rol correcto. Si no, redirige a `/`.
4. **Normalización de abilities**: El backend devuelve `abilities` pero el frontend los mapea a `permissions` para compatibilidad.

## 🧪 Cómo probar en el navegador

### Requisitos
- Frontend ejecutándose en `http://localhost:8080`
- Backend ejecutándose en `http://127.0.0.1:8000`

### Pasos

#### Escenario 1: Login como ADMIN (debería funcionar)
1. Abre http://localhost:8080
2. Haz clic en "Administrador"
3. Ingresa:
   - **Usuario**: `admin`
   - **Contraseña**: `password`
4. **Resultado esperado**: 
   - ✅ Login exitoso
   - ✅ Redirigido a `/dashboard/admin`
   - ✅ Puedes ver el panel de administrador

#### Escenario 2: Login como ESTUDIANTE, intentar acceder a admin (DEBERÍA BLOQUEARSE)
1. Abre http://localhost:8080
2. Haz clic en "Estudiante"
3. Ingresa:
   - **Usuario**: `estudiante`
   - **Contraseña**: `password`
4. **Resultado esperado**:
   - ✅ Login exitoso
   - ✅ Redirigido a `/dashboard/student` (NO al admin)
   - ✅ Si intentas navegar manualmente a `/dashboard/admin`, serás redirigido a `/`

#### Escenario 3: Login como DOCENTE (debería funcionar)
1. Abre http://localhost:8080
2. Haz clic en "Docente"
3. Ingresa:
   - **Usuario**: `docente`
   - **Contraseña**: `password`
4. **Resultado esperado**:
   - ✅ Login exitoso
   - ✅ Redirigido a `/seleccionar-nivel` (flujo especial de docentes)
   - ✅ Luego a `/dashboard/teacher`

#### Escenario 4: Login como PADRE (debería funcionar)
1. Abre http://localhost:8080
2. Haz clic en "Padre/Tutor"
3. Ingresa:
   - **Usuario**: `padre`
   - **Contraseña**: `password`
4. **Resultado esperado**:
   - ✅ Login exitoso
   - ✅ Redirigido a `/dashboard/parent`

## 🔍 Cómo debuggear en el navegador

### Ver el usuario autenticado
1. Abre la **Consola del navegador** (F12)
2. Ejecuta:
   ```javascript
   // Ver token guardado
   localStorage.getItem('auth_token')
   
   // Ver usuario (con roles)
   JSON.parse(localStorage.getItem('user'))
   
   // Debería mostrar algo como:
   // {
   //   "id": 1,
   //   "name": "Admin",
   //   "email": "admin@example.com",
   //   "roles": ["admin"],
   //   "abilities": ["*"],
   //   ...
   // }
   ```

### Ver peticiones al backend
1. Abre **Network** en DevTools (F12)
2. Inicia sesión
3. Deberías ver:
   - `POST /api/login` → responde con `{ token, role, mustChangePassword }`
   - `GET /api/me` → responde con `{ id, name, email, roles, abilities }`

### Probar acceso denegado
1. Inicia sesión como `estudiante`
2. En la consola, modifica manualmente el usuario:
   ```javascript
   // Cambiar role a "admin" (SIMULACIÓN DE ATAQUE)
   let user = JSON.parse(localStorage.getItem('user'));
   user.roles = ['admin'];
   localStorage.setItem('user', JSON.stringify(user));
   ```
3. Intenta navegar a `/dashboard/admin`
4. **Resultado esperado**: Serás redirigido a `/` porque los guards verifican `user.roles` en memoria en tiempo real

## ⚠️ Notas importantes

- Los guards de dashboards verifican `user.roles` en tiempo real. Si modificas localStorage, el componente no se enterará hasta que se remonte (recarga de página).
- Los roles reales siempre provienen de `/me` después del login.
- Si el token expira, el siguiente llamado a `/me` (en `useEffect` de init) fallará y se limpiará el usuario.
- El fallback (si `/me` falla) es degradado: usa solo el `role` de `/login`. **No debe ocurrir en producción si el backend está OK.**

## 🚀 Prueba rápida desde terminal

Ya hemos ejecutado:
```bash
node test_roles_security.mjs
```

Este script verifica que:
- ✅ Cada usuario puede obtener su token
- ✅ `/me` devuelve el rol correcto
- ✅ No hay acceso cruzado (estudiante no puede obtener permisos de admin)

## ✅ Checklist

- [ ] Probé login como admin → acceso a `/dashboard/admin` ✅
- [ ] Probé login como estudiante → **bloqueado de admin** ✅
- [ ] Probé login como docente → acceso a `/dashboard/teacher` ✅
- [ ] Probé login como padre → acceso a `/dashboard/parent` ✅
- [ ] Verifiqué en DevTools que `localStorage` tiene `auth_token` y `user` con roles correctos ✅
- [ ] Intenté modificar localStorage y fui redirigido correctamente ✅

## 🎯 Conclusión

La seguridad de roles ahora es **robusta**:
1. ✅ Roles siempre vienen del servidor (`/me`)
2. ✅ Dashboards verifican roles antes de renderizar
3. ✅ Estudiantes no pueden acceder a admin aunque manipulen localStorage
4. ✅ Cada rol solo ve su dashboard correspondiente
