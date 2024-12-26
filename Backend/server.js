const express = require('express');
const mongoose = require('mongoose');
const cors = require('cors');
const userRoutes = require('./routes/user');
const questionRoutes = require('./routes/question');

const app = express();

// CORS configuration
const corsOptions = {
  origin: 'https://innovate-learn.vercel.app', // Allow frontend domain
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allow these HTTP methods
  credentials: true, // Enable cookies if needed
  allowedHeaders: ['Content-Type', 'Authorization'] // Allow specific headers
};

// Middleware
app.use(express.json());
app.use(cors(corsOptions)); // Apply CORS to all routes

// Specific routes
app.use('/api', userRoutes);
app.use('/api/ques', questionRoutes);

// Route for root to check if server is running
app.get('/', (req, res) => {
  res.send('Server is running!');
});

// Favicon route to avoid 404 errors
app.get('/favicon.ico', (req, res) => res.status(204)); // No content

// Error handling middleware (optional but useful for debugging)
app.use((err, req, res, next) => {
  console.error('Error:', err.message);
  res.status(500).json({ error: 'Internal Server Error' });
});

const PORT = process.env.PORT || 4000;

mongoose.connect(process.env.MONGO_URI, { useNewUrlParser: true, useUnifiedTopology: true })
  .then(() => console.log('Connected to MongoDB'))
  .catch((err) => {
    console.error('Database connection error:', err.message);
    process.exit(1);
  });

module.exports = app;
