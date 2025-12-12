#!/usr/bin/env node

// Test script to debug login endpoint
const BASE_URL = 'http://127.0.0.1:8000/api';
const testUsers = [
  { username: 'admin', password: 'password' },
  { username: 'docente', password: 'password' },
  { username: 'estudiante', password: 'password' },
  { username: 'padre', password: 'password' },
];

async function testLogin(username, password) {
  console.log(`\n📝 Testing login for: ${username}`);
  const payload = {
    username,
    password,
    device: 'web',
  };
  
  try {
    const response = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        'Accept': 'application/json',
      },
      body: JSON.stringify(payload),
    });

    console.log(`📊 Status: ${response.status} ${response.statusText}`);
    
    const data = await response.json();
    console.log('📦 Response:', JSON.stringify(data, null, 2));
    
    if (response.ok) {
      console.log('✅ Login successful!');
      console.log('Token:', data.token ? '✓ Present' : '✗ Missing');
      console.log('User:', data.user ? JSON.stringify(data.user, null, 2) : 'Missing');
    }
  } catch (error) {
    console.error('❌ Error:', error.message);
  }
}

async function main() {
  console.log('🚀 Starting login tests...');
  console.log(`📍 Target: ${BASE_URL}`);
  
  for (const user of testUsers) {
    await testLogin(user.username, user.password);
  }
}

main().catch(console.error);
