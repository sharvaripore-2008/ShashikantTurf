const express = require('express');
const cors = require('cors');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config();

const db = require('./config/db');

const app = express();
const PORT = process.env.PORT || 5000;

// Middleware
app.use(cors());
app.use(express.json());
app.use(express.urlencoded({ extended: true }));

// Request Logger
app.use((req, res, next) => {
  console.log(`[${new Date().toLocaleTimeString()}] ${req.method} ${req.originalUrl}`);
  next();
});

// Import Routes
const authRoutes = require('./routes/authRoutes');
const turfRoutes = require('./routes/turfRoutes');
const bookingRoutes = require('./routes/bookingRoutes');

app.use('/api/auth', authRoutes);
app.use('/api/turfs', turfRoutes);
app.use('/api/bookings', bookingRoutes);

// Health Check API
app.get('/api/health', (req, res) => {
  res.json({
    status: 'online',
    project: 'Shashikant Turf Booking API',
    database: db.isUsingMySQL() ? 'MySQL (shashikant_turf)' : 'Local File (db.json)',
    version: '1.0.0',
    timestamp: new Date().toISOString()
  });
});

// Welcome Root Page
app.get('/', (req, res) => {
  const dbStatus = db.isUsingMySQL() 
    ? '<span style="color:#10b981; font-weight:bold;">MySQL Database (shashikant_turf)</span>'
    : '<span style="color:#f59e0b; font-weight:bold;">Local File (db.json)</span>';

  res.send(`
    <div style="font-family: Arial, sans-serif; max-width: 620px; margin: 40px auto; padding: 24px; border: 1px solid #10b981; border-radius: 12px; background: #0a0f1d; color: #fff;">
      <h2 style="color: #10b981; margin-top: 0;">⚽ Shashikant Turf REST API is Running!</h2>
      <p style="color: #94a3b8;">Port: <strong>${PORT}</strong> | Database: ${dbStatus}</p>
      <hr style="border-color: rgba(255,255,255,0.1); margin: 16px 0;">
      <h4 style="margin-bottom: 8px;">Available Endpoints:</h4>
      <ul style="color: #cbd5e1; line-height: 1.8;">
        <li><code>GET /api/turfs</code> - List all sports turfs</li>
        <li><code>GET /api/bookings/slots?turfId=TRF-101&date=YYYY-MM-DD</code> - Live booked slots</li>
        <li><code>POST /api/bookings</code> - Reserve slot (Saves to MySQL)</li>
        <li><code>GET /api/bookings</code> - List all player bookings</li>
        <li><code>PATCH /api/bookings/:id/cancel</code> - Cancel booking (Logs to cancellations)</li>
        <li><code>GET /api/bookings/cancellations</code> - List of cancelled bookings</li>
        <li><code>POST /api/auth/login</code> - User/Admin login (Logs to login_logs)</li>
        <li><code>POST /api/auth/register</code> - Sign up (Saves to users)</li>
        <li><code>GET /api/auth/login-logs</code> - View login history</li>
        <li><code>GET /api/bookings/admin/stats</code> - Admin revenue KPIs</li>
      </ul>
    </div>
  `);
});

// 404 Handler
app.use((req, res) => {
  res.status(404).json({ success: false, message: `Route ${req.originalUrl} not found` });
});

// Global Error Handler
app.use((err, req, res, next) => {
  console.error('Unhandled server error:', err);
  res.status(500).json({ success: false, message: 'Internal Server Error' });
});

async function startServer() {
  await db.initDB();

  app.listen(PORT, () => {
    console.log(`\n==================================================`);
    console.log(`🚀 SHASHIKANT TURF BACKEND SERVER IS RUNNING`);
    console.log(`📡 URL: http://localhost:${PORT}`);
    console.log(`💾 Database: ${db.isUsingMySQL() ? '✅ MySQL Connected (shashikant_turf)' : '⚠️ Local File Fallback (db.json)'}`);
    console.log(`🌐 API Endpoints:`);
    console.log(`   - Auth:          http://localhost:${PORT}/api/auth`);
    console.log(`   - Login Logs:    http://localhost:${PORT}/api/auth/login-logs`);
    console.log(`   - Turfs:         http://localhost:${PORT}/api/turfs`);
    console.log(`   - Bookings:      http://localhost:${PORT}/api/bookings`);
    console.log(`   - Cancellations: http://localhost:${PORT}/api/bookings/cancellations`);
    console.log(`   - Health:        http://localhost:${PORT}/api/health`);
    console.log(`==================================================\n`);
  });
}

startServer();
