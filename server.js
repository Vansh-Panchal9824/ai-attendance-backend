const express = require('express');
const dotenv = require('dotenv');
const cors = require('cors');
const colors = require('colors');
const connectDB = require('./src/config/database');

// Load env vars
dotenv.config();

// Connect to database
connectDB();

const app = express();

// ✅ INCREASE PAYLOAD LIMIT - ADD THIS
app.use(express.json({ limit: '50mb' }));
app.use(express.urlencoded({ extended: true, limit: '50mb' }));

// Middleware
app.use(cors());

// Routes
app.use('/api/auth', require('./src/routes/authRoutes'));
app.use('/api/attendance', require('./src/routes/attendanceRoutes'));
app.use('/api/classes', require('./src/routes/classRoutes'));
app.use('/api/faces', require('./src/routes/faceRoutes'));
// In server.js, add this line with your other routes
app.use('/api/users', require('./src/routes/userRoutes'));

// Test routes
app.get('/', (req, res) => {
  res.send('🚀 Server is running');
});

app.get('/api/health', (req, res) => {
  res.json({ status: 'success', message: 'API working' });
});

const PORT = process.env.PORT || 5000;

app.listen(PORT, () => {
  console.log(`✅ Server running on port ${PORT}`.green.bold);
});