#!/usr/bin/env node

const BASE_URL = 'http://127.0.0.1:8000/api';
const users = [
  { username: 'admin', password: 'password' },
  { username: 'docente', password: 'password' },
  { username: 'estudiante', password: 'password' },
  { username: 'padre', password: 'password' },
];

async function run() {
  for (const u of users) {
    console.log('\n---', u.username);
    const loginRes = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify({ username: u.username, password: u.password, device: 'web' }),
    });
    console.log('login status', loginRes.status);
    const loginData = await loginRes.json().catch(() => null);
    console.log('login data', loginData);
    const token = (loginData && (loginData.token || loginData.access_token)) || null;
    if (!token) continue;
    const meRes = await fetch(`${BASE_URL}/me`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    });
    console.log('/me status', meRes.status);
    const meData = await meRes.json().catch(() => null);
    console.log('/me data', meData);
  }
}

run().catch(console.error);
