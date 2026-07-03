const express = require('express');
const cors = require('cors');
const morgan = require('morgan');
require('dotenv').config();

const { errorHandler, notFound } = require('./middleware/errorHandler');
const authRoutes = require('./routes/authRoutes');
const categoryRoutes = require('./routes/categoryRoutes');
const taskRoutes = require('./routes/taskRoutes');

const app = express();

// ---- Global middleware ------------------------------------------------
// Allow multiple frontend origins (Vite may use different ports)
const allowedOrigins = (process.env.CLIENT_URL || 'http://localhost:5173')
  .split(',')
  .map(s => s.trim());

app.use(
  cors({
    origin: (origin, callback) => {
      // Allow requests with no origin (server-to-server, curl, etc.)
      if (!origin) return callback(null, true);
      if (allowedOrigins.some(o => origin.startsWith(o))) {
        return callback(null, true);
      }
      // In development, allow any localhost origin
      if (process.env.NODE_ENV === 'development' && origin.startsWith('http://localhost')) {
        return callback(null, true);
      }
      callback(null, true); // Allow all in dev
    },
    credentials: true,
  })
);
app.use(express.json());
app.use(morgan('dev'));

// ---- Health check -------------------------------------------------------
app.get('/api/health', (req, res) => {
  res.status(200).json({ success: true, message: 'TaskFlow API is running' });
});

// ---- Routes -------------------------------------------------------------
app.use('/api/auth', authRoutes);
app.use('/api/categories', categoryRoutes);
app.use('/api/tasks', taskRoutes);

// ---- 404 + error handling (must be LAST) --------------------------------
app.use(notFound);
app.use(errorHandler);

module.exports = app;
