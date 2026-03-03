require('dotenv').config();
const express = require('express');
const cors = require('cors');
const helmet = require('helmet');
const { globalRateLimiter } = require('./middleware/rateLimiter');
const authRoutes = require('./routes/auth');
const licenseRoutes = require('./routes/license');
const cheatRoutes = require('./routes/cheat');

const app = express();
const PORT = process.env.PORT || 4000;

// Security middleware
app.use(helmet());
app.use(cors({
  origin: process.env.FRONTEND_URL || 'http://localhost:1420',
  credentials: true,
}));

// Body parsing
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Global rate limiting
app.use(globalRateLimiter);

// Health check
app.get('/health', (req, res) => {
  res.json({ status: 'ok', timestamp: new Date().toISOString() });
});

// Routes
app.use('/auth', authRoutes);
app.use('/license', licenseRoutes);
app.use('/cheat', cheatRoutes);

// 404 handler
app.use((req, res) => {
  res.status(404).json({ error: 'Not found' });
});

// Global error handler
app.use((err, req, res, next) => {
  console.error(err.stack);
  res.status(err.status || 500).json({
    error: process.env.NODE_ENV === 'production' ? 'Internal server error' : err.message,
  });
});

app.listen(PORT, () => {
  console.log(`Vanish backend running on port ${PORT}`);
});
