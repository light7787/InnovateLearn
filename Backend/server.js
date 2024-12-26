const express = require('express');
const mongoose = require('mongoose');
const userRoutes = require('./routes/user'); // Adjust if necessary
const questionRoutes = require('./routes/question');
const cors = require('cors');

const app = express();

// Middleware
app.use(express.json());
app.use(cors({
  origin: 'https://innovate-learn.vercel.app', // Allow only your frontend
  methods: ['GET', 'POST', 'PUT', 'DELETE'], // Allowed HTTP methods
  credentials: true // Allow cookies, if needed
}));
app.options('*', cors()); // Allow preflight requests

// Routes
app.use('/api', userRoutes);
app.use('/api/ques', questionRoutes);

const PORT = process.env.PORT || 4000; // Default to 4000 if PORT is not set in the environment

mongoose.connect(process.env.MONGO_URI)
  .then(() => {
    console.log('Connected to MongoDB');
    app.listen(PORT, () => {
      console.log(`Server running on port ${PORT}`);
    });
  })
  .catch((error) => {
    console.error('Database connection error:', error);
  });
