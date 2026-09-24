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

// Middleware
const allowedOrigins = process.env.CLIENT_URL
  ? process.env.CLIENT_URL.split(',').map((url) => url.trim())
  : ['http://localhost:5173', 'http://localhost:3000'];

app.use(
  cors({
    origin: (origin, callback) => {
      if (!origin || allowedOrigins.includes('*') || allowedOrigins.includes(origin) || process.env.NODE_ENV !== 'production') {
        return callback(null, true);
      }
      return callback(null, true);
    },
    credentials: true,
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
