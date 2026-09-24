const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
const dotenv = require('dotenv');
const connectDB = require('./config/db');
const { errorHandler, notFound } = require('./middleware/errorMiddleware');

// Load environment variables
dotenv.config();

// Connect to MongoDB
connectDB();

const app = express();

// Dynamic Production & Localhost CORS Configuration
const defaultAllowedOrigins = [
  'https://lucky-events-wkcz.vercel.app',
  'https://lucky-events.onrender.com',
  'http://localhost:5173',
  'http://localhost:3000',
  'http://localhost:5000',
  'http://127.0.0.1:5173',
  'http://127.0.0.1:3000',
];

const envOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((url) => url.trim().replace(/\/+$/, ''))
  : [];

const allowedOriginsList = Array.from(new Set([...defaultAllowedOrigins, ...envOrigins]));

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin) return callback(null, true);

      const cleanOrigin = origin.replace(/\/+$/, '');
      if (
        allowedOriginsList.includes('*') ||
        allowedOriginsList.includes(cleanOrigin) ||
        cleanOrigin.endsWith('.vercel.app') ||
        cleanOrigin.endsWith('.onrender.com') ||
        cleanOrigin.includes('localhost') ||
        cleanOrigin.includes('127.0.0.1')
      ) {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
    methods: ['GET', 'POST', 'PUT', 'PATCH', 'DELETE', 'OPTIONS'],
    allowedHeaders: ['Content-Type', 'Authorization', 'X-Requested-With', 'Accept', 'Origin'],
  })
);
app.use(express.json({ limit: '10mb' }));
app.use(express.urlencoded({ extended: true, limit: '10mb' }));

if (process.env.NODE_ENV !== 'test') {
  app.use(morgan('dev'));
}

// Health check endpoint
app.get('/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    app: 'Event Management Booking Platform API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});
app.get('/api/health', (req, res) => {
  res.status(200).json({
    status: 'online',
    app: 'Event Management Booking Platform API',
    timestamp: new Date().toISOString(),
    uptime: process.uptime(),
  });
});

// Route imports
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const serviceRoutes = require('./routes/serviceRoutes');
const bookingRoutes = require('./routes/bookingRoutes');
const staffRoutes = require('./routes/staffRoutes');
const eventRoutes = require('./routes/eventRoutes');
const rsvpRoutes = require('./routes/rsvpRoutes');
const userRoutes = require('./routes/userRoutes');

// Mount routes (supporting both /api/* and root paths)
app.use('/auth', authRoutes);
app.use('/api/auth', authRoutes);

app.use('/categories', categoryRoutes);
app.use('/api/categories', categoryRoutes);

app.use('/services', serviceRoutes);
app.use('/api/services', serviceRoutes);

app.use('/bookings', bookingRoutes);
app.use('/api/bookings', bookingRoutes);

app.use('/staff', staffRoutes);
app.use('/api/staff', staffRoutes);

app.use('/events', eventRoutes);
app.use('/api/events', eventRoutes);

app.use('/rsvps', rsvpRoutes);
app.use('/api/rsvps', rsvpRoutes);

app.use('/users', userRoutes);
app.use('/api/users', userRoutes);

// Serve static frontend assets in production (Full-stack single service deployment)
const path = require('path');
const fs = require('fs');

const frontendDistPath = path.join(__dirname, '../../frontend/dist');
if (fs.existsSync(frontendDistPath)) {
  app.use(express.static(frontendDistPath));
  app.use((req, res, next) => {
    if (
      req.path.startsWith('/api') ||
      req.path.startsWith('/auth') ||
      req.path.startsWith('/categories') ||
      req.path.startsWith('/services') ||
      req.path.startsWith('/bookings') ||
      req.path.startsWith('/staff') ||
      req.path.startsWith('/events') ||
      req.path.startsWith('/rsvps') ||
      req.path.startsWith('/users') ||
      req.path.startsWith('/health')
    ) {
      return next();
    }
    res.sendFile(path.join(frontendDistPath, 'index.html'));
  });
}

// Error handlers
app.use(notFound);
app.use(errorHandler);

const PORT = process.env.PORT || 5000;

const server = app.listen(PORT, () => {
  console.log(`[Server] Event Management Booking API running in ${process.env.NODE_ENV || 'development'} mode on port ${PORT}`);
});

process.on('unhandledRejection', (err) => {
  console.error(`Unhandled Rejection: ${err.message}`);
});

module.exports = app;
