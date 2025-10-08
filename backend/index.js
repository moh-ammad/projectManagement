const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const connectToDb = require('./db/connection');
require('dotenv').config({ path: './.env.example' });


const app = express();

// Middleware
const allowedOrigins = [
  process.env.FRONTEND_URL,
  'http://localhost:5173',
];

const corsOptions = {
  origin: (origin, callback) => {
    if (!origin || allowedOrigins.includes(origin)) {
      callback(null, true);
    } else {
      callback(new Error('Not allowed by CORS'));
    }
  },
  credentials: true,
  methods: ['GET', 'POST', 'PUT', 'DELETE', 'OPTIONS'],
  allowedHeaders: ['Content-Type', 'Authorization'],
  optionsSuccessStatus: 200
};

// Apply global CORS middleware
app.use(cors(corsOptions));

// Universal preflight handler
app.options('/{*splat}', cors(corsOptions));

app.use(express.json());


// Database connection
connectToDb()
  .then(() => {
    console.log('MongoDB connected');
    // Initialize notification scheduler after DB connection
    const schedulerService = require('./services/schedulerService');
    schedulerService.init();
  })
  .catch(err => console.error('MongoDB connection error:', err));

// Routes
app.use('/api/auth', require('./routes/auth'));
app.use('/api/users', require('./routes/employees'));
app.use('/api/projects', require('./routes/projects'));
app.use('/api/tasks', require('./routes/tasks'));
app.use('/api/activities', require('./routes/activities'));
app.use('/api/reports', require('./routes/reports'));
app.use('/api/settings', require('./routes/settings'));
app.use('/api/notifications', require('./routes/notifications'));
app.use('/api/rvm', require('./routes/rvm'));

const PORT = process.env.PORT || 3000;
app.listen(PORT, () => {
  console.log(`Server running on port ${PORT}`);
});