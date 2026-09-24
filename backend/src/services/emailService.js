const nodemailer = require('nodemailer');

let transporter = null;

// Initialize or get nodemailer transporter
const getTransporter = async () => {
  if (transporter) return transporter;

  // If user provided SMTP credentials in .env, use them
  if (process.env.SMTP_USER && process.env.SMTP_PASS) {
    transporter = nodemailer.createTransport({
      host: process.env.SMTP_HOST || 'smtp.ethereal.email',
      port: Number(process.env.SMTP_PORT) || 587,
      secure: Number(process.env.SMTP_PORT) === 465,
      auth: {
        user: process.env.SMTP_USER,
        pass: process.env.SMTP_PASS,
      },
    });
    console.log('[EmailService] Configured custom SMTP transporter');
  } else {
    // Generate an automatic Ethereal test account for instant testing
    try {
      const testAccount = await nodemailer.createTestAccount();
      transporter = nodemailer.createTransport({
        host: 'smtp.ethereal.email',
        port: 587,
        secure: false,
        auth: {
          user: testAccount.user,
          pass: testAccount.pass,
        },
      });
      console.log(`[EmailService] Ethereal test mailer initialized (${testAccount.user})`);
    } catch (err) {
      console.warn('[EmailService] Could not connect to Ethereal, falling back to mock logger:', err.message);
      // Fallback mock transporter
      transporter = {
        sendMail: async (options) => {
          console.log(`[EmailService Mock] To: ${options.to} | Subject: ${options.subject}`);
          return { messageId: 'mock-' + Date.now() };
        },
      };
    }
  }

  return transporter;
};

// Generic mail sender
const sendEmail = async ({ to, subject, html, text }) => {
  try {
    const client = await getTransporter();
    const info = await client.sendMail({
      from: process.env.EMAIL_FROM || '"LuckyEvents" <noreply@luckyevents.com>',
      to,
      subject,
      text: text || html.replace(/<[^>]*>?/gm, ''),
      html,
    });

    console.log(`[EmailService] Message sent: %s to %s`, info.messageId, to);
    const previewUrl = nodemailer.getTestMessageUrl(info);
    if (previewUrl) {
      console.log(`[EmailService] Preview URL: ${previewUrl}`);
    }

    return { success: true, messageId: info.messageId, previewUrl };
  } catch (error) {
    console.error('[EmailService] Error sending email:', error.message);
    return { success: false, error: error.message };
  }
};

// Send RSVP Confirmation
const sendRSVPConfirmation = async ({ user, event, rsvp }) => {
  const formattedDate = new Date(event.startDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const subject = `Confirmed: Your RSVP for ${event.title}`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 24px; }
        .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); }
        .header { background: linear-gradient(135deg, #6366f1 0%, #8b5cf6 100%); padding: 32px; text-align: center; color: #ffffff; }
        .content { padding: 32px; }
        .ticket-box { background: #f1f5f9; border-radius: 12px; padding: 20px; border-left: 4px solid #6366f1; margin: 24px 0; }
        .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #64748b; }
        .btn { display: inline-block; background: #6366f1; color: #ffffff !important; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1 style="margin: 0; font-size: 24px; font-weight: 700;">RSVP Confirmed!</h1>
          <p style="margin: 8px 0 0; opacity: 0.9; font-size: 14px;">You're on the guest list for this event</p>
        </div>
        <div class="content">
          <p>Hi <strong>${user.name}</strong>,</p>
          <p>Your registration for <strong>${event.title}</strong> has been successfully confirmed. Here are your event details:</p>
          
          <div class="ticket-box">
            <div style="font-size: 12px; text-transform: uppercase; letter-spacing: 1px; color: #6366f1; font-weight: bold; margin-bottom: 8px;">Ticket Pass</div>
            <div style="font-size: 20px; font-weight: bold; color: #0f172a; margin-bottom: 12px;">${rsvp.ticketCode || 'TKT-LUCKY'}</div>
            
            <div class="detail-row">
              <span style="color: #64748b;">Date:</span>
              <strong>${formattedDate}</strong>
            </div>
            <div class="detail-row">
              <span style="color: #64748b;">Time:</span>
              <strong>${event.time || 'Check schedule'}</strong>
            </div>
            <div class="detail-row">
              <span style="color: #64748b;">Location:</span>
              <strong>${event.isVirtual ? 'Virtual Webinar' : event.location}</strong>
            </div>
            <div class="detail-row">
              <span style="color: #64748b;">Guests:</span>
              <strong>${rsvp.guestCount} ticket(s)</strong>
            </div>
          </div>

          ${
            event.isVirtual && event.virtualMeetingUrl
              ? `<p><strong>Virtual Meeting Link:</strong> <a href="${event.virtualMeetingUrl}">${event.virtualMeetingUrl}</a></p>`
              : ''
          }

          <div style="text-align: center;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/events/${event._id}" class="btn">View Event in App</a>
          </div>
        </div>
        <div class="footer">
          Sent by LuckyEvents &bull; Streamlining extraordinary experiences.
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to: user.email, subject, html });
};

// Send Event Reminder
const sendEventReminder = async ({ user, event, rsvp }) => {
  const formattedDate = new Date(event.startDate).toLocaleDateString('en-US', {
    weekday: 'long',
    year: 'numeric',
    month: 'long',
    day: 'numeric',
  });

  const subject = `Reminder: ${event.title} is coming up!`;
  const html = `
    <!DOCTYPE html>
    <html>
    <head>
      <style>
        body { font-family: -apple-system, BlinkMacSystemFont, 'Segoe UI', Roboto, Helvetica, Arial, sans-serif; background-color: #f8fafc; color: #1e293b; margin: 0; padding: 24px; }
        .card { max-width: 580px; margin: 0 auto; background: #ffffff; border-radius: 16px; border: 1px solid #e2e8f0; overflow: hidden; box-shadow: 0 10px 25px -5px rgba(0, 0, 0, 0.05); }
        .header { background: linear-gradient(135deg, #0ea5e9 0%, #6366f1 100%); padding: 32px; text-align: center; color: #ffffff; }
        .content { padding: 32px; }
        .banner { background: #fef3c7; border: 1px solid #fde68a; border-radius: 8px; padding: 12px 16px; color: #92400e; font-weight: 500; font-size: 14px; margin-bottom: 20px; }
        .detail-row { display: flex; justify-content: space-between; padding: 8px 0; border-bottom: 1px solid #e2e8f0; font-size: 14px; }
        .footer { text-align: center; padding: 20px; font-size: 12px; color: #64748b; }
        .btn { display: inline-block; background: #6366f1; color: #ffffff !important; padding: 12px 24px; border-radius: 8px; text-decoration: none; font-weight: 600; margin-top: 16px; }
      </style>
    </head>
    <body>
      <div class="card">
        <div class="header">
          <h1 style="margin: 0; font-size: 24px; font-weight: 700;">Upcoming Event Reminder</h1>
          <p style="margin: 8px 0 0; opacity: 0.9; font-size: 14px;">Get ready for an exciting experience!</p>
        </div>
        <div class="content">
          <div class="banner">
            🔔 Your event starts soon! Please arrive 10-15 minutes early.
          </div>
          <p>Hi <strong>${user.name}</strong>,</p>
          <p>This is a friendly reminder that you are scheduled to attend <strong>${event.title}</strong>.</p>
          
          <div style="background: #f8fafc; border-radius: 12px; padding: 20px; margin: 20px 0;">
            <div class="detail-row">
              <span style="color: #64748b;">Event:</span>
              <strong>${event.title}</strong>
            </div>
            <div class="detail-row">
              <span style="color: #64748b;">Date:</span>
              <strong>${formattedDate}</strong>
            </div>
            <div class="detail-row">
              <span style="color: #64748b;">Time:</span>
              <strong>${event.time || 'Check schedule'}</strong>
            </div>
            <div class="detail-row">
              <span style="color: #64748b;">Location:</span>
              <strong>${event.isVirtual ? 'Virtual Meeting' : event.location}</strong>
            </div>
            <div class="detail-row">
              <span style="color: #64748b;">Ticket Code:</span>
              <strong>${rsvp ? rsvp.ticketCode : 'N/A'}</strong>
            </div>
          </div>

          ${
            event.isVirtual && event.virtualMeetingUrl
              ? `<p><strong>Join URL:</strong> <a href="${event.virtualMeetingUrl}">${event.virtualMeetingUrl}</a></p>`
              : ''
          }

          <div style="text-align: center;">
            <a href="${process.env.CLIENT_URL || 'http://localhost:5173'}/events/${event._id}" class="btn">View Event Details</a>
          </div>
        </div>
        <div class="footer">
          LuckyEvents &bull; You're receiving this because you RSVP'd to this event.
        </div>
      </div>
    </body>
    </html>
  `;

  return sendEmail({ to: user.email, subject, html });
};

// Send RSVP Cancellation
const sendRSVPCancellation = async ({ user, event }) => {
  const subject = `Cancelled: RSVP for ${event.title}`;
  const html = `
    <div style="font-family: sans-serif; padding: 20px; max-width: 500px; margin: 0 auto; border: 1px solid #e2e8f0; border-radius: 12px;">
      <h2 style="color: #ef4444;">RSVP Cancelled</h2>
      <p>Hi ${user.name},</p>
      <p>Your RSVP for <strong>${event.title}</strong> has been cancelled. Your seat has been released.</p>
      <p>If this was a mistake, you can always visit the event page to RSVP again if seats remain available.</p>
    </div>
  `;
  return sendEmail({ to: user.email, subject, html });
};

module.exports = {
  sendEmail,
  sendRSVPConfirmation,
  sendEventReminder,
  sendRSVPCancellation,
};
