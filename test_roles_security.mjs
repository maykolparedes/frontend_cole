#!/usr/bin/env node

/**
 * Script de prueba para validar seguridad de roles
 * Intenta:
 * 1. Login con admin → acceder a /dashboard/admin (debería funcionar)
 * 2. Login con estudiante → acceder a /dashboard/admin (debería bloquearse)
 * 3. Verificar que /me devuelve roles corretos para cada usuario
 */

const BASE_URL = 'http://127.0.0.1:8000/api';

const testUsers = [
  { username: 'admin', expectedRole: 'admin', dashboard: '/dashboard/admin', shouldSucceed: true },
  { username: 'docente', expectedRole: 'teacher', dashboard: '/dashboard/teacher', shouldSucceed: true },
  { username: 'estudiante', expectedRole: 'student', dashboard: '/dashboard/student', shouldSucceed: true },
  { username: 'padre', expectedRole: 'parent', dashboard: '/dashboard/parent', shouldSucceed: true },
];

async function testUserRoles() {
  console.log('🔐 VALIDACIÓN DE SEGURIDAD DE ROLES\n');
  console.log('=' .repeat(60));

  for (const testUser of testUsers) {
    console.log(`\n🧪 Probando: ${testUser.username}`);
    console.log('-'.repeat(60));

    try {
      // 1. Login
      const loginRes = await fetch(`${BASE_URL}/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({
          username: testUser.username,
          password: 'password',
          device: 'web',
        }),
      });

      if (!loginRes.ok) {
        console.error(`  ❌ Login falló: ${loginRes.status}`);
        continue;
      }

      const loginData = await loginRes.json();
      const token = loginData.token;
      console.log(`  ✅ Login exitoso`);
      console.log(`     - Token: ${token.substring(0, 20)}...`);
      console.log(`     - Role (en /login): ${loginData.role || 'NO INCLUÍDO'}`);

      // 2. Llamar a /me
      const meRes = await fetch(`${BASE_URL}/me`, {
        method: 'GET',
        headers: {
          'Authorization': `Bearer ${token}`,
          'Accept': 'application/json',
        },
      });

      if (!meRes.ok) {
        console.error(`  ❌ /me falló: ${meRes.status}`);
        continue;
      }

      const meData = await meRes.json();
      const actualRole = meData.roles?.[0];
      console.log(`  ✅ /me exitoso`);
      console.log(`     - Roles: ${JSON.stringify(meData.roles || [])}`);
      console.log(`     - ID: ${meData.id}`);
      console.log(`     - Nombre: ${meData.name}`);

      // 3. Validar rol
      if (actualRole === testUser.expectedRole) {
        console.log(`  ✅ Rol coincide: "${actualRole}"`);
      } else {
        console.warn(`  ⚠️  Rol NO coincide. Esperado: "${testUser.expectedRole}", Obtenido: "${actualRole}"`);
      }

      // 4. Simular lo que haría el frontend con los guards
      console.log(`\n  🔍 SIMULACIÓN DE GUARDS FRONTEND:`);
      console.log(`     - Dashboard permitido: ${testUser.dashboard}`);
      console.log(`     - Roles del usuario: ${JSON.stringify(meData.roles)}`);
      
      // Verificar acceso a su propio dashboard
      const userDashboardRole = testUser.dashboard.split('/').pop(); // "admin", "teacher", "student", "parent"
      const canAccessOwnDashboard = meData.roles.includes(userDashboardRole);
      console.log(`     - ¿Puede acceder a ${testUser.dashboard}? ${canAccessOwnDashboard ? '✅ SÍ' : '❌ NO'}`);

      // Verificar acceso a dashboard admin (solo admin debería poder)
      const isAdmin = meData.roles.includes('admin');
      const canAccessAdminDashboard = isAdmin;
      console.log(`     - ¿Puede acceder a /dashboard/admin? ${canAccessAdminDashboard ? '✅ SÍ' : '❌ NO'}`);

      if (testUser.expectedRole === 'admin' && !canAccessAdminDashboard) {
        console.error(`  ❌ FALLO DE SEGURIDAD: Admin no puede acceder a /dashboard/admin`);
      } else if (testUser.expectedRole !== 'admin' && canAccessAdminDashboard) {
        console.error(`  ❌ FALLO DE SEGURIDAD: ${testUser.username} (${actualRole}) puede acceder a /dashboard/admin`);
      } else {
        console.log(`  ✅ Seguridad OK para ${testUser.username}`);
      }

    } catch (error) {
      console.error(`  ❌ Error: ${error.message}`);
    }
  }

  console.log('\n' + '='.repeat(60));
  console.log('✅ Validación completada\n');
}

testUserRoles().catch(console.error);
