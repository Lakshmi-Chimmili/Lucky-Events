const http = require('http');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          resolve({ status: res.statusCode, body: JSON.parse(body) });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });
    req.on('error', reject);
    if (data) req.write(JSON.stringify(data));
    req.end();
  });
}

async function testProfile() {
  console.log('--- TESTING PROFILE UPDATE API ---');

  // 1. Login Customer
  const loginRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: 'customer@luckyevents.com', password: 'customer123' }
  );

  const token = loginRes.body.token;
  console.log('Logged in as customer:', loginRes.body.user.name);

  // 2. Update Profile Name & Phone
  const updateRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/profile',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
    { name: 'Ananya Verma (Updated)', phone: '+91 99887 76655' }
  );

  console.log('Update profile response status:', updateRes.status);
  console.log('Updated user data:', updateRes.body.user);

  if (updateRes.body.user.name !== 'Ananya Verma (Updated)') {
    throw new Error('Name update failed!');
  }
  if (updateRes.body.user.phone !== '+91 99887 76655') {
    throw new Error('Phone update failed!');
  }

  // 3. Revert back to original name for consistency
  await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/profile',
      method: 'PUT',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
    { name: 'Ananya Verma', phone: '+91 98765 55667' }
  );

  console.log('✓ Profile API successfully tested and verified!');
}

testProfile().catch((err) => {
  console.error('Profile test failed:', err);
  process.exit(1);
});
