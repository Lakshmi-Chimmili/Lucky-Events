const cron = require('node-cron');
const Event = require('../models/Event');
const RSVP = require('../models/RSVP');
const { sendEventReminder } = require('./emailService');

// Function to trigger reminders for a specific event
const sendRemindersForEvent = async (eventId) => {
  const event = await Event.findById(eventId);
  if (!event) {
    throw new Error('Event not found');
  }

  const rsvps = await RSVP.find({
    event: eventId,
    status: 'attending',
  }).populate('user', 'name email');

  let sentCount = 0;
  for (const rsvp of rsvps) {
    if (rsvp.user && rsvp.user.email) {
      await sendEventReminder({
        user: rsvp.user,
        event,
        rsvp,
      });
      rsvp.reminderSent = true;
      await rsvp.save();
      sentCount++;
    }
  }

  event.remindersSent = true;
  await event.save();

  return { totalAttendees: rsvps.length, sentCount };
};

// Scheduler running every hour to check for upcoming events within the next 24 hours
const initReminderScheduler = () => {
  // Runs at minute 0 of every hour
  cron.schedule('0 * * * *', async () => {
    console.log('[Scheduler] Running automated event reminder check...');
    try {
      const now = new Date();
      const in24Hours = new Date(now.getTime() + 24 * 60 * 60 * 1000);

      // Find published events starting between now and 24 hours ahead whose reminders haven't been sent
      const upcomingEvents = await Event.find({
        status: 'published',
        remindersSent: false,
        startDate: { $gte: now, $lte: in24Hours },
      });

      console.log(`[Scheduler] Found ${upcomingEvents.length} events needing reminders.`);

      for (const event of upcomingEvents) {
        try {
          const result = await sendRemindersForEvent(event._id);
          console.log(`[Scheduler] Sent ${result.sentCount} reminders for event "${event.title}"`);
        } catch (err) {
          console.error(`[Scheduler] Error processing event ${event._id}:`, err.message);
        }
      }
    } catch (error) {
      console.error('[Scheduler] Cron error in reminder job:', error.message);
    }
  });

  console.log('[Scheduler] Automated event reminder cron job registered (Hourly)');
};

module.exports = {
  initReminderScheduler,
  sendRemindersForEvent,
};
