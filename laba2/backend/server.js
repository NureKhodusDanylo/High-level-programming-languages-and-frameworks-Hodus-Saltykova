require('dotenv').config();
const express = require('express');
const cors = require('cors');
const authRoutes = require('./routes/auth');
const taskRoutes = require('./routes/tasks');
const analyticsRoutes = require('./routes/analytics');
const { checkDeadlines } = require('./services/cron');

const app = express();
const PORT = process.env.PORT || 3000;

app.use(cors({ exposedHeaders: ['X-Cache'] }));
app.use(express.json());

// Routes
app.use('/api/auth', authRoutes);
app.use('/api/tasks', taskRoutes);
app.use('/api/analytics', analyticsRoutes);

// Initialize background jobs
checkDeadlines();

app.listen(PORT, () => {
    console.log(`Server is running on port ${PORT}`);
});
