#!/usr/bin/env node

// Test script para verificar qué devuelve /me después de obtener token
const BASE_URL = 'http://127.0.0.1:8000/api';

async function testLoginAndMe() {
  console.log('🚀 Testing login → /me workflow...\n');

  try {
    // Paso 1: Login para obtener token
    console.log('📝 Paso 1: Haciendo login con admin/password');
    const loginRes = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify({
        username: 'admin',
        password: 'password',
        device: 'web',
      }),
    });

    console.log(`Status: ${loginRes.status}`);
    const loginData = await loginRes.json();
    console.log('📦 Respuesta de /login:', JSON.stringify(loginData, null, 2));

    const token = loginData.token;
    if (!token) {
      console.error('❌ No token en respuesta de login');
      return;
    }
    console.log(`✅ Token obtenido: ${token.substring(0, 20)}...`);

    // Paso 2: Llamar a /me con el token
    console.log('\n📝 Paso 2: Llamando a /me con token');
    const meRes = await fetch(`${BASE_URL}/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token}`,
        'Accept': 'application/json',
      },
    });

    console.log(`Status: ${meRes.status}`);
    const meData = await meRes.json();
    console.log('📦 Respuesta de /me:', JSON.stringify(meData, null, 2));

    // Verificar estructura
    console.log('\n✅ ANÁLISIS DE ESTRUCTURA:');
    console.log(`- Tiene 'roles'? ${Array.isArray(meData.roles) ? 'SÍ (' + meData.roles.join(', ') + ')' : 'NO'}`);
    console.log(`- Tiene 'permissions'? ${Array.isArray(meData.permissions) ? 'SÍ (' + meData.permissions.join(', ') + ')' : 'NO'}`);
    console.log(`- Tiene 'id'? ${meData.id ? 'SÍ (' + meData.id + ')' : 'NO'}`);
    console.log(`- Tiene 'name'? ${meData.name ? 'SÍ (' + meData.name + ')' : 'NO'}`);
    console.log(`- Tiene 'email'? ${meData.email ? 'SÍ (' + meData.email + ')' : 'NO'}`);

    // Probar con otro usuario (docente)
    console.log('\n\n📝 Repitiendo con docente/password...');
    const loginRes2 = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', 'Accept': 'application/json' },
      body: JSON.stringify({ username: 'docente', password: 'password', device: 'web' }),
    });
    const loginData2 = await loginRes2.json();
    const token2 = loginData2.token;

    const meRes2 = await fetch(`${BASE_URL}/me`, {
      method: 'GET',
      headers: {
        'Authorization': `Bearer ${token2}`,
        'Accept': 'application/json',
      },
    });
    const meData2 = await meRes2.json();
    console.log('📦 /me para docente:', JSON.stringify(meData2, null, 2));

  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

testLoginAndMe().catch(console.error);
