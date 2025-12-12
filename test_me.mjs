#!/usr/bin/env node

const BASE_URL = 'http://127.0.0.1:8000/api';
const testUsers = [
  { username: 'admin', password: 'password' },
  { username: 'estudiante', password: 'password' },
];

async function loginAndMe(username, password) {
  console.log(`\n--- Testing ${username} ---`);
  const payload = { username, password, device: 'web' };
  try {
    const loginRes = await fetch(`${BASE_URL}/login`, {
      method: 'POST',
      headers: { 'Content-Type': 'application/json', Accept: 'application/json' },
      body: JSON.stringify(payload),
    });
    console.log('Login status:', loginRes.status);
    const loginData = await loginRes.json();
    console.log('Login response:', JSON.stringify(loginData));
    const token = loginData.token || loginData.access_token;
    if (!token) {
      console.log('No token, skipping /me');
      return;
    }
    const meRes = await fetch(`${BASE_URL}/me`, {
      method: 'GET',
      headers: { Authorization: `Bearer ${token}`, Accept: 'application/json' },
    });
    console.log('/me status:', meRes.status);
    const meData = await meRes.json();
    console.log('/me response:', JSON.stringify(meData));
  } catch (err) {
    console.error('Error', err);
  }
}

(async () => {
  for (const u of testUsers) {
    await loginAndMe(u.username, u.password);
  }
})();
