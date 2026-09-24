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

    // 2. Seed Categories (Expanded catalog with affordable discounted pricing)
    const categoriesData = [
      {
        name: 'Birthday Party',
        description: 'Vibrant birthdays with energetic party hosts, interactive games, balloon setups, and music.',
        image: 'https://images.unsplash.com/photo-1513151233558-d860c5398176?w=800&auto=format&fit=crop&q=80',
        basePricePerAttendee: 400,
        isActive: true,
      },
      {
        name: 'Wedding/Marriage',
        description: 'Grand royal wedding coordination, full hospitality managers, guest welcoming, and flawless execution.',
        image: 'https://images.unsplash.com/photo-1519741497674-611481863552?w=800&auto=format&fit=crop&q=80',
        basePricePerAttendee: 1200,
        isActive: true,
      },
      {
        name: 'Corporate/Professional',
        description: 'Elite corporate summits, executive conferences, seminars, team retreats, and annual galas.',
        image: 'https://images.unsplash.com/photo-1511578314322-379afb476865?w=800&auto=format&fit=crop&q=80',
        basePricePerAttendee: 800,
        isActive: true,
      },
      {
        name: 'Family Function',
        description: 'Intimate anniversaries, housewarming rituals, baby showers, and reunions handled with warmth.',
        image: 'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=800&auto=format&fit=crop&q=80',
        basePricePerAttendee: 500,
        isActive: true,
      },
      {
        name: 'Festival & Cultural Celebration',
        description: 'Traditional festive gatherings, Dandiya nights, Holi celebrations, and community cultural fests.',
        image: 'https://images.unsplash.com/photo-1533174072545-7a4b6ad7a6c3?w=800&auto=format&fit=crop&q=80',
        basePricePerAttendee: 450,
        isActive: true,
      },
      {
        name: 'Anniversary & Engagement',
        description: 'Romantic engagement ring ceremonies, silver/golden wedding anniversaries, and cocktail nights.',
        image: 'https://images.unsplash.com/photo-1515934751635-c81c6bc9a2d8?w=800&auto=format&fit=crop&q=80',
        basePricePerAttendee: 600,
        isActive: true,
      },
      {
        name: 'Concert & Stage Show',
        description: 'Mega musical concerts, celebrity artist management, sound setup, and crowd control teams.',
        image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
        basePricePerAttendee: 750,
        isActive: true,
      },
      {
        name: 'Baby Shower & Naming Ceremony',
        description: 'Heartwarming baby shower themes, cradle ceremony decor, guest welcoming, and catering desk.',
        image: 'https://images.unsplash.com/photo-1522673607200-164d1b6ce486?w=800&auto=format&fit=crop&q=80',
        basePricePerAttendee: 350,
        isActive: true,
      },
    ];

    const createdCategories = await Category.insertMany(categoriesData);
    console.log(`[Seed] Seeded ${createdCategories.length} Categories.`);

    // 3. Seed Add-on Services (Expanded options with discounted rates)
    const servicesData = [
      {
        name: 'Dance Performance',
        description: 'Choreographed troupe performances, flash mob, and traditional or contemporary stage dances.',
        image: 'https://images.unsplash.com/photo-1508700115892-45ecd05ae2ad?w=800&auto=format&fit=crop&q=80',
        pricingType: 'flat',
        price: 3500,
        isActive: true,
      },
      {
        name: 'Games & Entertainment',
        description: 'Interactive anchor-hosted party games, trivia challenges, magic shows, and fun prizes.',
        image: 'https://images.unsplash.com/photo-1516450360452-9312f5e86fc7?w=800&auto=format&fit=crop&q=80',
        pricingType: 'flat',
        price: 2000,
        isActive: true,
      },
      {
        name: 'Natural/Floral Decoration',
        description: 'Exquisite fresh floral mandaps, floral entrance arches, and centerpiece table bouquets.',
        image: 'https://images.unsplash.com/photo-1526047932273-341f2a7631f9?w=800&auto=format&fit=crop&q=80',
        pricingType: 'perAttendee',
        price: 100,
        isActive: true,
      },
      {
        name: 'DJ & Music',
        description: 'High-end concert sound rig, dynamic ambient lighting, subwoofer arrays, and professional DJ.',
        image: 'https://images.unsplash.com/photo-1470225620780-dba8ba36b745?w=800&auto=format&fit=crop&q=80',
        pricingType: 'flat',
        price: 5000,
        isActive: true,
      },
      {
        name: 'Photography & Videography',
        description: '4K cinematic highlight reel, full event drone coverage, and high-res edited photo gallery.',
        image: 'https://images.unsplash.com/photo-1516035069371-29a1b244cc32?w=800&auto=format&fit=crop&q=80',
        pricingType: 'flat',
        price: 7500,
        isActive: true,
      },
      {
        name: 'Catering',
        description: 'Gourmet multi-course buffet, live counter stations, dessert bar, and professional waitstaff.',
        image: 'https://images.unsplash.com/photo-1555244162-803834f70033?w=800&auto=format&fit=crop&q=80',
        pricingType: 'perAttendee',
        price: 220,
        isActive: true,
      },
      {
        name: 'Special Effects & Pyrotechnics',
        description: 'Sparkler cold pyros, CO2 jet blast cannons, fog haze generator, and flower showers.',
        image: 'https://images.unsplash.com/photo-1492684223066-81342ee5ff30?w=800&auto=format&fit=crop&q=80',
        pricingType: 'flat',
        price: 3000,
        isActive: true,
      },
      {
        name: 'Live Music Band & Vocalists',
        description: 'Acoustic band setup, live singers, flute/violinist background music during guest welcoming.',
        image: 'https://images.unsplash.com/photo-1511671782779-c97d3d27a1d4?w=800&auto=format&fit=crop&q=80',
        pricingType: 'flat',
        price: 6000,
        isActive: true,
      },
      {
        name: 'Valet & Security Crew',
        description: 'Uniformed bouncers, crowd security managers, and valet parking attendants.',
        image: 'https://images.unsplash.com/photo-1507679799987-c73779587ccf?w=800&auto=format&fit=crop&q=80',
        pricingType: 'flat',
        price: 2500,
        isActive: true,
      },
    ];

    const createdServices = await Service.insertMany(servicesData);
    console.log(`[Seed] Seeded ${createdServices.length} Add-on Services.`);

    // 4. Seed sample booking with updated pricing:
    const weddingCat = createdCategories.find((c) => c.name.includes('Wedding'));
    const cateringServ = createdServices.find((s) => s.name === 'Catering');
    const djServ = createdServices.find((s) => s.name === 'DJ & Music');

    // Wedding (1200 * 100 = 120,000) + Catering (220 * 100 = 22,000) + DJ (5,000) = 147,000
    const sampleBooking = await Booking.create({
      customer: customer._id,
      category: weddingCat._id,
      addOns: [cateringServ._id, djServ._id],
      attendeeCount: 100,
      eventDate: new Date(Date.now() + 14 * 24 * 60 * 60 * 1000),
      venueAddress: 'The Leela Palace Ballroom, Bengaluru',
      notes: 'Need stage setup ready by 4:00 PM for Sangeet & Reception.',
      priceBreakdown: {
        categoryName: weddingCat.name,
        basePricePerAttendee: weddingCat.basePricePerAttendee,
        categoryTotal: 120000,
        addOnsBreakdown: [
          {
            serviceId: cateringServ._id,
            name: cateringServ.name,
            pricingType: cateringServ.pricingType,
            unitPrice: cateringServ.price,
            lineTotal: 22000,
          },
          {
            serviceId: djServ._id,
            name: djServ.name,
            pricingType: djServ.pricingType,
            unitPrice: djServ.price,
            lineTotal: 5000,
          },
        ],
        addOnsTotal: 27000,
        grandTotal: 147000,
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
