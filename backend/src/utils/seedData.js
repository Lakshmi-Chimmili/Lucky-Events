const mongoose = require('mongoose');
const dotenv = require('dotenv');
const User = require('../models/User');
const Event = require('../models/Event');
const RSVP = require('../models/RSVP');

dotenv.config({ path: __dirname + '/../../.env' });

const seedDatabase = async () => {
  try {
    const mongoUri = process.env.MONGO_URI || 'mongodb://localhost:27017/luckyevents';
    await mongoose.connect(mongoUri);
    console.log('[Seed] Connected to MongoDB at', mongoUri);

    // Clear existing data
    await RSVP.deleteMany({});
    await Event.deleteMany({});
    await User.deleteMany({});
    console.log('[Seed] Cleared existing data.');

    // 1. Create Users
    const adminUser = await User.create({
      name: 'Eleanor Vance',
      email: 'admin@luckyevents.com',
      password: 'password123',
      role: 'admin',
      organization: 'LuckyEvents HQ',
      bio: 'Platform Administrator and Executive Event Producer.',
      avatar: 'https://images.unsplash.com/photo-1534528741775-53994a69daeb?w=300&auto=format&fit=crop&q=80',
    });

    const organizerSarah = await User.create({
      name: 'Sarah Jenkins',
      email: 'sarah@luckyevents.com',
      password: 'password123',
      role: 'user',
      organization: 'TechVibe Productions',
      bio: 'Curating world-class developer summits and design intensives.',
      avatar: 'https://images.unsplash.com/photo-1573496359142-b8d87734a5a2?w=300&auto=format&fit=crop&q=80',
    });

    const attendeeAlex = await User.create({
      name: 'Alex Rivera',
      email: 'alex@luckyevents.com',
      password: 'password123',
      role: 'user',
      organization: 'NextGen Solutions',
      bio: 'Full-stack software engineer & community builder.',
      avatar: 'https://images.unsplash.com/photo-1507003211169-0a1dd7228f2d?w=300&auto=format&fit=crop&q=80',
    });

    console.log('[Seed] Created default users:');
    console.log('   - Admin: admin@luckyevents.com / password123');
    console.log('   - Organizer: sarah@luckyevents.com / password123');
    console.log('   - Attendee: alex@luckyevents.com / password123');

    // 2. Create Events
    const now = new Date();
    const addDays = (d) => new Date(now.getTime() + d * 24 * 60 * 60 * 1000);

    const sampleEvents = [
      {
        title: 'Global AI & Cloud Summit 2026',
        description:
          'Join over 2,500 AI architects, cloud leaders, and machine learning researchers for 3 transformative days of keynote addresses, hands-on architectural labs, and deep dive breakout sessions on agentic frameworks and autonomous systems.',
        category: 'Technology',
        organizer: organizerSarah._id,
        startDate: addDays(4),
        endDate: addDays(6),
        time: '09:00 AM - 05:30 PM PST',
        isVirtual: false,
        location: 'Moscone Convention Center, San Francisco, CA',
        capacity: 350,
        ticketType: 'Paid',
        price: 299,
        bannerImage:
          'https://images.unsplash.com/photo-1540575467063-178a50c2df87?w=1200&auto=format&fit=crop&q=80',
        tags: ['AI', 'Cloud', 'Machine Learning', 'San Francisco', 'DeepTech'],
        status: 'published',
        featured: true,
      },
      {
        title: 'SaaS Growth & Product Mastery Live',
        description:
          'An exclusive masterclass tailored for SaaS founders, product directors, and growth leads looking to accelerate from $1M to $20M ARR. Discover actionable pricing architectures, PLG strategies, and churn retention blueprints.',
        category: 'Business',
        organizer: adminUser._id,
        startDate: addDays(7),
        time: '11:00 AM - 03:00 PM EST',
        isVirtual: true,
        location: 'Global Virtual Stream',
        virtualMeetingUrl: 'https://zoom.us/j/luckyevents-saas-mastery',
        capacity: 500,
        ticketType: 'Free',
        price: 0,
        bannerImage:
          'https://images.unsplash.com/photo-1551836022-d5d88e9218df?w=1200&auto=format&fit=crop&q=80',
        tags: ['SaaS', 'Product', 'Founders', 'Growth', 'Masterclass'],
        status: 'published',
        featured: true,
      },
      {
        title: 'UX/UI Next: Spatial Design & Design Systems',
        description:
          'Explore modern design tooling, typography orchestration, micro-interactions, and high-performance glassmorphic UI systems with industry design leads from Figma, Linear, and Vercel.',
        category: 'Design',
        organizer: organizerSarah._id,
        startDate: addDays(12),
        time: '10:00 AM - 04:00 PM GMT',
        isVirtual: false,
        location: 'The Shard, London, UK',
        capacity: 120,
        ticketType: 'Paid',
        price: 149,
        bannerImage:
          'https://images.unsplash.com/photo-1531403009284-440f080d1e12?w=1200&auto=format&fit=crop&q=80',
        tags: ['UX', 'UI Design', 'Figma', 'London', 'Design Systems'],
        status: 'published',
        featured: true,
      },
      {
        title: 'Silicon Valley Founders & Angel Mixer',
        description:
          'High-energy networking mixer connecting early-stage tech founders, venture capitalists, and top angel investors over curated drinks and lightning pitches in downtown Palo Alto.',
        category: 'Networking',
        organizer: adminUser._id,
        startDate: addDays(2),
        time: '06:30 PM - 10:00 PM PST',
        isVirtual: false,
        location: 'The Rosewood Sand Hill, Menlo Park, CA',
        capacity: 80,
        ticketType: 'Free',
        price: 0,
        bannerImage:
          'https://images.unsplash.com/photo-1511795409834-ef04bbd61622?w=1200&auto=format&fit=crop&q=80',
        tags: ['Networking', 'VC', 'Startups', 'Silicon Valley', 'Angels'],
        status: 'published',
        featured: true,
      },
      {
        title: 'Holistic Wellness & Executive Peak State Retreat',
        description:
          'Recharge mental clarity, breathwork, and longevity protocols with wellness scientists and elite performance coaches. Includes meditation, sound bath, and nutritionist meal pairing.',
        category: 'Health & Wellness',
        organizer: organizerSarah._id,
        startDate: addDays(18),
        time: '08:00 AM - 06:00 PM PST',
        isVirtual: false,
        location: 'Esalen Institute, Big Sur, CA',
        capacity: 40,
        ticketType: 'Paid',
        price: 395,
        bannerImage:
          'https://images.unsplash.com/photo-1506126613408-eca07ce68773?w=1200&auto=format&fit=crop&q=80',
        tags: ['Wellness', 'Mindfulness', 'Big Sur', 'Longevity', 'Retreat'],
        status: 'published',
        featured: false,
      },
      {
        title: 'Next-Gen Performance Marketing & Creator Economy',
        description:
          'Master modern omnichannel distribution, high-converting video creative, performance TikTok/Meta ad engines, and creator brand partnerships.',
        category: 'Marketing',
        organizer: adminUser._id,
        startDate: addDays(22),
        time: '01:00 PM - 05:00 PM EST',
        isVirtual: true,
        location: 'Virtual Broadcast Stage',
        virtualMeetingUrl: 'https://zoom.us/j/luckyevents-marketing-live',
        capacity: 600,
        ticketType: 'Free',
        price: 0,
        bannerImage:
          'https://images.unsplash.com/photo-1557804506-669a67965ba0?w=1200&auto=format&fit=crop&q=80',
        tags: ['Marketing', 'Creator Economy', 'Social Ads', 'Branding'],
        status: 'published',
        featured: false,
      },
    ];

    const createdEvents = await Event.insertMany(sampleEvents);
    console.log(`[Seed] Created ${createdEvents.length} events.`);

    // 3. Create initial RSVPs
    const rsvp1 = await RSVP.create({
      event: createdEvents[0]._id,
      user: attendeeAlex._id,
      status: 'attending',
      guestCount: 2,
      notes: 'Excited for the agentic systems keynote!',
      ticketCode: 'TKT-AI2026-ALEX',
    });

    const rsvp2 = await RSVP.create({
      event: createdEvents[1]._id,
      user: attendeeAlex._id,
      status: 'attending',
      guestCount: 1,
      notes: 'Attending remotely via Zoom.',
      ticketCode: 'TKT-SAAS-ALEX',
    });

    const rsvp3 = await RSVP.create({
      event: createdEvents[3]._id,
      user: organizerSarah._id,
      status: 'attending',
      guestCount: 1,
      notes: 'Looking forward to meeting angel syndicates.',
      ticketCode: 'TKT-MIX-SARAH',
    });

    // Update rsvpCount on events
    createdEvents[0].rsvpCount = 2;
    await createdEvents[0].save();

    createdEvents[1].rsvpCount = 1;
    await createdEvents[1].save();

    createdEvents[3].rsvpCount = 1;
    await createdEvents[3].save();

    console.log('[Seed] Created sample RSVPs and synced seat counts.');
    console.log('[Seed] Database successfully seeded! 🎉');

    process.exit(0);
  } catch (error) {
    console.error('[Seed] Error seeding database:', error);
    process.exit(1);
  }
};

seedDatabase();
