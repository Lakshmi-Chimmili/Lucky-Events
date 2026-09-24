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

async function testCustomerCancel() {
  console.log('Testing customer cancellation while pending/confirmed...');
  // 1. Login customer
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

  // 2. Fetch Birthday Party Category
  const catRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/categories',
    method: 'GET',
  });
  const bdayCat = catRes.body.data.find((c) => c.name.includes('Birthday'));

  // 3. Create a pending booking
  const createRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/bookings',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
    {
      categoryId: bdayCat._id,
      attendeeCount: 50,
      eventDate: '2026-12-10T15:00:00Z',
      venueAddress: 'Greenwood Resort, Hyderabad',
      notes: 'Customer cancel test',
    }
  );
  const bookingId = createRes.body.data._id;
  console.log('Created booking with ID:', bookingId, 'status:', createRes.body.data.status);

  // 4. Customer cancels the booking
  const cancelRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: `/api/bookings/${bookingId}/status`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${token}`,
      },
    },
    { status: 'cancelled' }
  );

  console.log('Cancel response status:', cancelRes.status, 'body:', cancelRes.body);
  if (cancelRes.body.data?.status !== 'cancelled') {
    throw new Error('Expected booking status to be cancelled!');
  }
  console.log('✓ Customer successfully cancelled booking while pending.');
}

testCustomerCancel().catch((err) => {
  console.error('Customer cancel test failed:', err);
  process.exit(1);
});
