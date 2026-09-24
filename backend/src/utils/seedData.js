const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Category = require('../models/Category');
const Service = require('../models/Service');
const Booking = require('../models/Booking');

dotenv.config({ path: __dirname + '/../../.env' });

const seedDatabase = async () => {
  try {
    const mongoUri =
      process.env.MONGO_URI ||
      'mongodb://localhost:27017/luckyevents';

    console.log('[Seed] Connecting to MongoDB...');
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected successfully.');

    // Clear existing collections
    await Booking.deleteMany({});
    await Service.deleteMany({});
    await Category.deleteMany({});
    await User.deleteMany({});
    console.log('[Seed] Cleared existing database records.');

    // 1. Seed Users (Admin, Staff, Customer)
    const adminPasswordHash = await User.hashPassword('admin123');
    const staffPasswordHash = await User.hashPassword('staff123');
    const customerPasswordHash = await User.hashPassword('customer123');

    const admin = await User.create({
      name: 'Executive Admin',
      email: 'admin@luckyevents.com',
      passwordHash: adminPasswordHash,
      phone: '+91 98765 43210',
      role: 'admin',
    });

    const staff1 = await User.create({
      name: 'Rohan Sharma (Manager)',
      email: 'staff@luckyevents.com',
      passwordHash: staffPasswordHash,
      phone: '+91 98765 11223',
      role: 'staff',
    });

    const staff2 = await User.create({
      name: 'Priya Patel (Lead Coordinator)',
      email: 'priya.staff@luckyevents.com',
      passwordHash: staffPasswordHash,
      phone: '+91 98765 33445',
      role: 'staff',
    });

    const customer = await User.create({
      name: 'Ananya Verma',
      email: 'customer@luckyevents.com',
      passwordHash: customerPasswordHash,
      phone: '+91 98765 55667',
      role: 'customer',
    });

    console.log('[Seed] Seeded Users:');
    console.log('   - Admin:    admin@luckyevents.com / admin123');
    console.log('   - Staff:    staff@luckyevents.com / staff123');
    console.log('   - Customer: customer@luckyevents.com / customer123');

    // 2. Seed Categories per spec:
    // Birthday Party 500 · Wedding/Marriage 1500 · Corporate/Professional 1000 · Family Function 700
    const categoriesData = [
      {
        name: 'Birthday Party',
        description: 'Vibrant birthdays with energetic party hosts, interactive games, balloon setups, and music.',
        image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80',
        basePricePerAttendee: 500,
        isActive: true,
      },
      {
        name: 'Wedding/Marriage',
        description: 'Grand royal wedding coordination, full hospitality managers, guest welcoming, and flawless execution.',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
        basePricePerAttendee: 1500,
        isActive: true,
      },
      {
        name: 'Corporate/Professional',
        description: 'Elite corporate summits, executive conferences, seminars, team retreats, and annual galas.',
        image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
        basePricePerAttendee: 1000,
        isActive: true,
      },
      {
        name: 'Family Function',
        description: 'Intimate anniversaries, housewarming rituals, baby showers, and reunions handled with warmth.',
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop&q=80',
        basePricePerAttendee: 700,
        isActive: true,
      },
    ];

    const createdCategories = await Category.insertMany(categoriesData);
    console.log(`[Seed] Seeded ${createdCategories.length} Categories.`);

    // 3. Seed Add-on Services per spec:
    // Dance Performance → flat → 5000
    // Games & Entertainment → flat → 3000
    // Natural/Floral Decoration → perAttendee → 150
    // DJ & Music → flat → 8000
    // Photography & Videography → flat → 10000
    // Catering → perAttendee → 300
    const servicesData = [
      {
        name: 'Dance Performance',
        description: 'Choreographed troupe performances, flash mob, and traditional or contemporary stage dances.',
        image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80',
        pricingType: 'flat',
        price: 5000,
        isActive: true,
      },
      {
        name: 'Games & Entertainment',
        description: 'Interactive anchor-hosted party games, trivia challenges, magic shows, and fun prizes.',
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
        pricingType: 'flat',
        price: 3000,
        isActive: true,
      },
      {
        name: 'Natural/Floral Decoration',
        description: 'Exquisite fresh floral mandaps, floral entrance arches, and centerpiece table bouquets.',
        image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&auto=format&fit=crop&q=80',
        pricingType: 'perAttendee',
        price: 150,
        isActive: true,
      },
      {
        name: 'DJ & Music',
        description: 'High-end concert sound rig, dynamic ambient lighting, subwoofer arrays, and professional DJ.',
        image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
        pricingType: 'flat',
        price: 8000,
        isActive: true,
      },
      {
        name: 'Photography & Videography',
        description: '4K cinematic highlight reel, full event drone coverage, and high-res edited photo gallery.',
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
        pricingType: 'flat',
        price: 10000,
        isActive: true,
      },
      {
        name: 'Catering',
        description: 'Gourmet multi-course buffet, live counter stations, dessert bar, and professional waitstaff.',
        image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&auto=format&fit=crop&q=80',
        pricingType: 'perAttendee',
        price: 300,
        isActive: true,
      },
    ];

    const createdServices = await Service.insertMany(servicesData);
    console.log(`[Seed] Seeded ${createdServices.length} Add-on Services.`);

    // 4. Seed an initial sample booking using the exact worked example:
    // Wedding (₹1500) * 100 attendees + Catering (300 * 100 = 30000) + DJ & Music (8000) = ₹188,000
    const weddingCat = createdCategories.find((c) => c.name.includes('Wedding'));
    const cateringServ = createdServices.find((s) => s.name === 'Catering');
    const djServ = createdServices.find((s) => s.name === 'DJ & Music');

    const sampleBooking = await Booking.create({
      customer: customer._id,
      category: weddingCat._id,
      addOns: [cateringServ._id, djServ._id],
      attendeeCount: 100,
      eventDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000), // in 14 days
      venueAddress: 'The Leela Palace Ballroom, Bengaluru',
      notes: 'Need stage setup ready by 4:00 PM for Sangeet & Reception.',
      priceBreakdown: {
        categoryName: weddingCat.name,
        basePricePerAttendee: weddingCat.basePricePerAttendee,
        categoryTotal: 150000,
        addOnsBreakdown: [
          {
            serviceId: cateringServ._id,
            name: cateringServ.name,
            pricingType: cateringServ.pricingType,
            unitPrice: cateringServ.price,
            lineTotal: 30000,
          },
          {
            serviceId: djServ._id,
            name: djServ.name,
            pricingType: djServ.pricingType,
            unitPrice: djServ.price,
            lineTotal: 8000,
          },
        ],
        addOnsTotal: 38000,
        grandTotal: 188000,
      },
      status: 'assigned',
      assignedStaff: [staff1._id],
    });

    console.log(`[Seed] Created Sample Booking with Grand Total: ₹${sampleBooking.priceBreakdown.grandTotal.toLocaleString('en-IN')}`);
    console.log('[Seed] Database successfully populated! ✨');
    process.exit(0);
  } catch (err) {
    console.error('[Seed] Error seeding database:', err);
    process.exit(1);
  }
};

seedDatabase();
