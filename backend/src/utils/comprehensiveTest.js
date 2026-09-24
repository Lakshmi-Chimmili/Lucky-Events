const http = require('http');

function request(options, data) {
  return new Promise((resolve, reject) => {
    const req = http.request(options, (res) => {
      let body = '';
      res.on('data', (chunk) => (body += chunk));
      res.on('end', () => {
        try {
          const parsed = JSON.parse(body);
          resolve({ status: res.statusCode, body: parsed });
        } catch (e) {
          resolve({ status: res.statusCode, body });
        }
      });
    });
    req.on('error', reject);
    if (data) {
      req.write(typeof data === 'string' ? data : JSON.stringify(data));
    }
    req.end();
  });
}

async function runTests() {
  console.log('--- STARTING COMPREHENSIVE END-TO-END VERIFICATION ---');

  // 1. Login Customer
  const custRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: 'customer@luckyevents.com', password: 'customer123' }
  );
  if (!custRes.body.token) throw new Error('Customer login failed: ' + JSON.stringify(custRes.body));
  const custToken = custRes.body.token;
  console.log('✓ Customer Login passed. Token acquired.');

  // 2. Login Staff
  const staffRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: 'staff@luckyevents.com', password: 'staff123' }
  );
  if (!staffRes.body.token) throw new Error('Staff login failed');
  const staffToken = staffRes.body.token;
  const staffId = staffRes.body.user.id;
  console.log('✓ Staff Login passed. Staff ID:', staffId);

  // 3. Login Admin
  const adminRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/auth/login',
      method: 'POST',
      headers: { 'Content-Type': 'application/json' },
    },
    { email: 'admin@luckyevents.com', password: 'admin123' }
  );
  if (!adminRes.body.token) throw new Error('Admin login failed');
  const adminToken = adminRes.body.token;
  console.log('✓ Admin Login passed.');

  // 4. Fetch Categories & Services
  const catRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/categories',
    method: 'GET',
  });
  const weddingCat = catRes.body.data.find((c) => c.name.toLowerCase().includes('wedding'));
  console.log(`✓ Fetched categories: Found ${catRes.body.count} categories. Wedding price/attendee: ₹${weddingCat.basePricePerAttendee}`);

  const srvRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/services',
    method: 'GET',
  });
  const catering = srvRes.body.data.find((s) => s.name.toLowerCase().includes('catering'));
  const dj = srvRes.body.data.find((s) => s.name.toLowerCase().includes('dj'));
  console.log(`✓ Fetched services: Catering (₹${catering.price} ${catering.pricingType}), DJ (₹${dj.price} ${dj.pricingType})`);

  // 5. Test Worked Example Booking
  // Wedding (₹1,500/attendee) · 100 attendees · Catering (perAttendee ₹300) + DJ (flat ₹8000)
  // Expected: Category = 150000, Addons = 30000 + 8000 = 38000, Grand = 188000
  console.log('Creating Worked Example Booking via Customer API...');
  const bookingCreateRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: '/api/bookings',
      method: 'POST',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${custToken}`,
      },
    },
    {
      categoryId: weddingCat._id,
      attendeeCount: 100,
      addOnIds: [catering._id, dj._id],
      eventDate: '2026-11-15T18:00:00Z',
      venueAddress: 'Royal Palace Banquet Hall, Jubilee Hills, Hyderabad',
      notes: 'Worked example self-check test booking',
      // Intentionally pass a bogus client-sent total to confirm server ignores it
      bogusClientTotal: 999,
    }
  );

  const newBooking = bookingCreateRes.body.data;
  console.log('✓ Booking created! Response Status:', bookingCreateRes.status);
  console.log('  Category Total:', newBooking.priceBreakdown.categoryTotal);
  console.log('  Add-ons Total:', newBooking.priceBreakdown.addOnsTotal);
  console.log('  Grand Total:', newBooking.priceBreakdown.grandTotal);

  if (newBooking.priceBreakdown.categoryTotal !== 150000) {
    throw new Error(`Category total mismatch: expected 150000, got ${newBooking.priceBreakdown.categoryTotal}`);
  }
  if (newBooking.priceBreakdown.addOnsTotal !== 38000) {
    throw new Error(`Add-ons total mismatch: expected 38000, got ${newBooking.priceBreakdown.addOnsTotal}`);
  }
  if (newBooking.priceBreakdown.grandTotal !== 188000) {
    throw new Error(`Grand total mismatch: expected 188000, got ${newBooking.priceBreakdown.grandTotal}`);
  }
  console.log('>>> WORKED EXAMPLE CONFIRMED: 150000 + 38000 = ₹188,000 matches spec exactly! <<<');

  // 6. Admin assigns staff
  console.log('Testing Admin assign staff...');
  const assignRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: `/api/bookings/${newBooking._id}/assign`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${adminToken}`,
      },
    },
    { staffIds: [staffId] }
  );
  if (!assignRes.body.success) throw new Error('Assign staff failed: ' + JSON.stringify(assignRes.body));
  console.log('✓ Admin assigned staff member successfully. Booking status:', assignRes.body.data.status);

  // 7. Staff views assigned bookings
  console.log('Testing Staff assigned bookings view...');
  const staffBookingsRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/bookings/assigned',
    method: 'GET',
    headers: { Authorization: `Bearer ${staffToken}` },
  });
  const foundAssigned = staffBookingsRes.body.data.some((b) => b._id === newBooking._id);
  if (!foundAssigned) throw new Error('Staff did not see assigned booking!');
  console.log(`✓ Staff successfully retrieved ${staffBookingsRes.body.count} assigned booking(s).`);

  // 8. Staff updates status to confirmed
  console.log('Testing Staff status update to confirmed...');
  const statusUpdateRes = await request(
    {
      hostname: 'localhost',
      port: 5000,
      path: `/api/bookings/${newBooking._id}/status`,
      method: 'PATCH',
      headers: {
        'Content-Type': 'application/json',
        Authorization: `Bearer ${staffToken}`,
      },
    },
    { status: 'confirmed' }
  );
  if (statusUpdateRes.body.data.status !== 'confirmed') {
    throw new Error('Status update failed');
  }
  console.log('✓ Staff updated status to confirmed successfully.');

  // 9. Admin Stats Overview
  console.log('Testing Admin stats endpoint...');
  const statsRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/bookings/stats',
    method: 'GET',
    headers: { Authorization: `Bearer ${adminToken}` },
  });
  console.log('✓ Admin Stats summary:', {
    totalBookings: statsRes.body.data.totalBookings,
    totalRevenue: statsRes.body.data.totalRevenue,
    byStatus: statsRes.body.data.byStatus,
  });

  // 10. Role Security Barrier
  console.log('Testing RBAC security: Customer trying to access Admin Stats...');
  const forbiddenRes = await request({
    hostname: 'localhost',
    port: 5000,
    path: '/api/bookings/stats',
    method: 'GET',
    headers: { Authorization: `Bearer ${custToken}` },
  });
  if (forbiddenRes.status !== 403) {
    throw new Error(`Expected 403 Forbidden for customer accessing admin route, got ${forbiddenRes.status}`);
  }
  console.log('✓ RBAC Security Barrier verified: Customer access to admin routes blocked with 403.');

  console.log('\n======================================================');
  console.log('ALL TESTS PASSED! BACKEND & BUSINESS RULES FULLY VALIDATED');
  console.log('======================================================\n');
}

runTests().catch((err) => {
  console.error('Test failed:', err);
  process.exit(1);
});
