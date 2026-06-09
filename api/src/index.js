require('dotenv').config();
const express = require('express');
const cors    = require('cors');

const app = express();

app.use(cors({
  origin: [
    process.env.FRONTEND_URL,
    'http://localhost:5173',
    'http://localhost:5174',
  ].filter(Boolean),
  credentials: true,
}));
app.use(express.json());

// Routes
app.use('/auth',       require('./routes/auth'));
app.use('/me',         require('./routes/me'));
app.use('/couples',    require('./routes/couples'));
app.use('/dashboard',  require('./routes/dashboard'));
app.use('/workouts',   require('./routes/workouts'));
app.use('/challenges', require('./routes/challenges'));
app.use('/wagers',     require('./routes/wagers'));
app.use('/rewards',    require('./routes/rewards'));
app.use('/activity',   require('./routes/activity'));
app.use('/log',        require('./routes/log'));
app.use('/push',       require('./routes/push'));
app.use('/history',    require('./routes/history'));

// Health check
app.get('/', (_, res) => res.json({ status: 'ok', app: 'fittogether-api' }));

// Error handler
app.use((err, req, res, _next) => {
  console.error(err);
  res.status(500).json({ error: err.message || 'Internal server error' });
});

const PORT = process.env.PORT || 3001;
app.listen(PORT, () => console.log(`FitTogether API running on port ${PORT}`));
