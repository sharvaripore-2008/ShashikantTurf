const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '..', '.env') });
require('dotenv').config();

const DB_FILE = path.join(__dirname, '..', 'data', 'db.json');
const SEED_FILE = path.join(__dirname, '..', 'data', 'seed.json');

// In-memory or JSON fallback helpers
function readJsonData() {
  try {
    if (!fs.existsSync(DB_FILE)) {
      if (fs.existsSync(SEED_FILE)) {
        fs.copyFileSync(SEED_FILE, DB_FILE);
      } else {
        const initial = { users: [], turfs: [], bookings: [], login_logs: [], cancellations: [] };
        fs.writeFileSync(DB_FILE, JSON.stringify(initial, null, 2));
      }
    }
    const raw = fs.readFileSync(DB_FILE, 'utf-8');
    return JSON.parse(raw);
  } catch (err) {
    return { users: [], turfs: [], bookings: [], login_logs: [], cancellations: [] };
  }
}

function writeJsonData(data) {
  try {
    fs.writeFileSync(DB_FILE, JSON.stringify(data, null, 2), 'utf-8');
    return true;
  } catch (err) {
    return false;
  }
}

let pool = null;
let useMySQL = false;

// Initialize Database connection & auto-create tables
async function initDB() {
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '';
  const port = parseInt(process.env.DB_PORT || '3306', 10);
  const database = process.env.DB_NAME || 'shashikant_turf';

  try {
    // 1. Connect without database first to ensure DB exists
    const rootConn = await mysql.createConnection({ host, user, password, port });
    await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    await rootConn.end();

    // 2. Create connection pool for shashikant_turf
    pool = mysql.createPool({
      host,
      user,
      password,
      port,
      database,
      waitForConnections: true,
      connectionLimit: 10,
      queueLimit: 0
    });

    // 3. Create Tables
    await pool.query(`
      CREATE TABLE IF NOT EXISTS users (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(100) NOT NULL,
        email VARCHAR(100) NOT NULL UNIQUE,
        phone VARCHAR(20) DEFAULT '+91 98765 00000',
        password VARCHAR(255) NOT NULL,
        role ENUM('user', 'admin') DEFAULT 'user',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        last_login TIMESTAMP NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS login_logs (
        id INT AUTO_INCREMENT PRIMARY KEY,
        user_id VARCHAR(50),
        name VARCHAR(100),
        email VARCHAR(100) NOT NULL,
        role VARCHAR(20) DEFAULT 'user',
        login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        ip_address VARCHAR(50) DEFAULT '127.0.0.1',
        status VARCHAR(20) DEFAULT 'SUCCESS'
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS turfs (
        id VARCHAR(50) PRIMARY KEY,
        name VARCHAR(150) NOT NULL,
        sport VARCHAR(50) NOT NULL,
        category VARCHAR(50) NOT NULL,
        size VARCHAR(50) NOT NULL,
        location VARCHAR(200) NOT NULL,
        price_per_hour DECIMAL(10,2) NOT NULL,
        rating DECIMAL(2,1) DEFAULT 4.8,
        image TEXT,
        description TEXT,
        amenities JSON,
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS bookings (
        id VARCHAR(50) PRIMARY KEY,
        turf_id VARCHAR(50) NOT NULL,
        turf_name VARCHAR(150) NOT NULL,
        user_name VARCHAR(100) NOT NULL,
        user_email VARCHAR(100) NOT NULL,
        user_phone VARCHAR(20),
        booking_date DATE NOT NULL,
        slot VARCHAR(50) NOT NULL,
        base_price DECIMAL(10,2) NOT NULL,
        gst DECIMAL(10,2) NOT NULL,
        platform_fee DECIMAL(10,2) DEFAULT 50.00,
        total_amount DECIMAL(10,2) NOT NULL,
        payment_method VARCHAR(50) DEFAULT 'UPI',
        status ENUM('Confirmed', 'Cancelled') DEFAULT 'Confirmed',
        created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
        cancelled_at TIMESTAMP NULL
      );
    `);

    await pool.query(`
      CREATE TABLE IF NOT EXISTS cancellations (
        id INT AUTO_INCREMENT PRIMARY KEY,
        booking_id VARCHAR(50) NOT NULL,
        user_name VARCHAR(100),
        user_email VARCHAR(100),
        turf_name VARCHAR(150),
        booking_date DATE,
        slot VARCHAR(50),
        refund_amount DECIMAL(10,2),
        reason VARCHAR(255) DEFAULT 'Player requested cancellation',
        cancelled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
      );
    `);

    // 4. Seed initial data if tables are empty
    const [turfCount] = await pool.query('SELECT COUNT(*) as count FROM turfs');
    if (turfCount[0].count === 0) {
      await pool.query(`
        INSERT INTO turfs (id, name, sport, category, size, location, price_per_hour, rating, image, description, amenities) VALUES
        ('TRF-101', 'KickOff Grand Arena', 'Football', 'football', '7v7 FIFA Artificial Turf', 'Andheri West, Mumbai', 1200.00, 4.9, 
         'https://images.unsplash.com/photo-1529900241929-5ed53a0f33dd?auto=format&fit=crop&w=800&q=80',
         'Premium FIFA standard 7-a-side artificial turf equipped with stadium floodlights, dugout seating, clean shower changing rooms, and free player parking.',
         '["Floodlights", "Changing Rooms", "Free Parking", "Drinking Water", "Dugout Seating"]'),
        ('TRF-102', 'Skyline Rooftop Turf', 'Cricket', 'cricket', '5v5 Box Cricket Pitch', 'Bandra West, Mumbai', 1500.00, 4.8,
         'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
         'Spectacular rooftop box cricket turf in the heart of Bandra with high bounce safety netting, ultra-bright LED match floodlights, and refreshment lounge.',
         '["Night Floodlights", "Box Netting", "Cafeteria", "Equipment Rental", "Music System"]'),
        ('TRF-103', 'Striker\\'s Hub Multisport', 'Multisport', 'multisport', '6v6 Dual Football & Cricket', 'Powai, Mumbai', 1000.00, 4.7,
         'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=800&q=80',
         'Versatile indoor/outdoor arena suited for corporate leagues, weekend football matches, and tennis ball box cricket tournaments.',
         '["Scoreboard", "First Aid", "Locker Room", "Spectator Stand", "CCTV Security"]'),
        ('TRF-104', 'Apex International Arena', 'Football', 'football', '8v8 Full Turf', 'Kandivali East, Mumbai', 1800.00, 5.0,
         'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
         'Full-scale 8-a-side professional arena featuring imported Dutch synthetic grass, high mast lighting, tournament commentary desk, and referee lounge.',
         '["Tournament Ready", "Warmup Track", "Shower Rooms", "Cafeteria", "VIP Lounge"]');
      `);
      console.log('✅ MySQL: Initial Turfs seeded successfully');
    }

    const [userCount] = await pool.query('SELECT COUNT(*) as count FROM users');
    if (userCount[0].count === 0) {
      await pool.query(`
        INSERT INTO users (id, name, email, phone, password, role) VALUES
        ('ADM-01', 'Admin Manager', 'admin@shashikantturf.com', '+91 98765 00000', 'admin123', 'admin'),
        ('USR-1001', 'Rahul Sharma', 'rahul@example.com', '+91 98200 11223', 'password123', 'user'),
        ('USR-1002', 'Aditya Patil', 'aditya@patil.com', '+91 98190 44556', 'password123', 'user');
      `);
      console.log('✅ MySQL: Initial Users seeded successfully');
    }

    const [bkgCount] = await pool.query('SELECT COUNT(*) as count FROM bookings');
    if (bkgCount[0].count === 0) {
      await pool.query(`
        INSERT INTO bookings (id, turf_id, turf_name, user_name, user_email, user_phone, booking_date, slot, base_price, gst, platform_fee, total_amount, payment_method, status) VALUES
        ('BK-8291', 'TRF-101', 'KickOff Grand Arena', 'Rahul Sharma', 'rahul@example.com', '+91 98200 11223', CURDATE(), '07:00 PM - 08:00 PM', 1200.00, 216.00, 50.00, 1466.00, 'UPI (Google Pay)', 'Confirmed'),
        ('BK-8292', 'TRF-102', 'Skyline Rooftop Turf', 'Aditya Patil', 'aditya@patil.com', '+91 98190 44556', CURDATE(), '08:00 PM - 09:00 PM', 1500.00, 270.00, 50.00, 1820.00, 'Credit Card', 'Confirmed');
      `);
      console.log('✅ MySQL: Initial Bookings seeded successfully');
    }

    useMySQL = true;
    console.log('==================================================');
    console.log(`✅ CONNECTED TO MYSQL DATABASE: "${database}"`);
    console.log('   Tables verified: users, login_logs, turfs, bookings, cancellations');
    console.log('==================================================');
  } catch (err) {
    useMySQL = false;
    console.warn('\n⚠️  MySQL Connection Note:');
    console.warn(`   Could not connect to MySQL: ${err.message}`);
    console.warn('   Ensure MySQL service is running and update backend/.env with your MySQL credentials.');
    console.warn('   (Falling back to local data/db.json storage seamlessly)\n');
  }
}

let initPromise = null;
function startInit() {
  if (!initPromise) initPromise = initDB();
  return initPromise;
}

// Start DB connection
startInit();

module.exports = {
  initDB: startInit,
  isUsingMySQL: () => useMySQL,
  getPool: () => pool,

  // ================= USERS & SIGN UP =================
  async getUsers() {
    if (useMySQL) {
      const [rows] = await pool.query('SELECT id, name, email, phone, role, created_at, last_login FROM users ORDER BY created_at DESC');
      return rows;
    }
    return (readJsonData().users || []).map(({ password, ...u }) => u);
  },

  async getUserById(id) {
    if (useMySQL) {
      const [rows] = await pool.query('SELECT * FROM users WHERE id = ?', [id]);
      return rows[0] || null;
    }
    return (readJsonData().users || []).find(u => u.id === id) || null;
  },

  async getUserByEmail(email) {
    if (!email) return null;
    const clean = email.trim().toLowerCase();
    if (useMySQL) {
      const [rows] = await pool.query('SELECT * FROM users WHERE LOWER(email) = ?', [clean]);
      return rows[0] || null;
    }
    return (readJsonData().users || []).find(u => (u.email || '').toLowerCase() === clean) || null;
  },

  async addUser(user) {
    if (useMySQL) {
      await pool.query(
        'INSERT INTO users (id, name, email, phone, password, role, created_at) VALUES (?, ?, ?, ?, ?, ?, NOW())',
        [user.id, user.name, user.email.toLowerCase(), user.phone || '+91 98765 00000', user.password, user.role || 'user']
      );
      return user;
    }
    const data = readJsonData();
    data.users = data.users || [];
    data.users.push(user);
    writeJsonData(data);
    return user;
  },

  // ================= LOGIN LOGS =================
  async recordLogin({ userId, name, email, role, ipAddress, status }) {
    if (useMySQL) {
      await pool.query(
        'INSERT INTO login_logs (user_id, name, email, role, ip_address, status, login_time) VALUES (?, ?, ?, ?, ?, ?, NOW())',
        [userId || null, name || null, email.toLowerCase(), role || 'user', ipAddress || '127.0.0.1', status || 'SUCCESS']
      );
      if (userId) {
        await pool.query('UPDATE users SET last_login = NOW() WHERE id = ?', [userId]);
      }
      return true;
    }
    const data = readJsonData();
    data.login_logs = data.login_logs || [];
    data.login_logs.unshift({
      id: Date.now(),
      userId, name, email, role, ipAddress, status, login_time: new Date().toISOString()
    });
    writeJsonData(data);
    return true;
  },

  async getLoginLogs(limit = 100) {
    if (useMySQL) {
      const [rows] = await pool.query('SELECT * FROM login_logs ORDER BY login_time DESC LIMIT ?', [limit]);
      return rows;
    }
    return (readJsonData().login_logs || []).slice(0, limit);
  },

  // ================= TURFS =================
  async getTurfs() {
    if (useMySQL) {
      const [rows] = await pool.query('SELECT * FROM turfs ORDER BY rating DESC');
      return rows.map(r => ({
        ...r,
        pricePerHour: Number(r.price_per_hour),
        roofType: r.roof_type || 'Open Air Arena',
        amenities: typeof r.amenities === 'string' ? JSON.parse(r.amenities) : (r.amenities || [])
      }));
    }
    return readJsonData().turfs || [];
  },

  async getTurfById(id) {
    if (useMySQL) {
      const [rows] = await pool.query('SELECT * FROM turfs WHERE id = ?', [id]);
      if (!rows[0]) return null;
      const r = rows[0];
      return {
        ...r,
        pricePerHour: Number(r.price_per_hour),
        roofType: r.roof_type || 'Open Air Arena',
        amenities: typeof r.amenities === 'string' ? JSON.parse(r.amenities) : (r.amenities || [])
      };
    }
    return (readJsonData().turfs || []).find(t => t.id === id) || null;
  },

  async addTurf(turf) {
    if (useMySQL) {
      await pool.query(
        'INSERT INTO turfs (id, name, sport, category, size, location, price_per_hour, rating, image, description, amenities) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [turf.id, turf.name, turf.sport, turf.category, turf.size, turf.location, turf.pricePerHour, turf.rating || 5.0, turf.image, turf.description, JSON.stringify(turf.amenities || [])]
      );
      return turf;
    }
    const data = readJsonData();
    data.turfs = data.turfs || [];
    data.turfs.unshift(turf);
    writeJsonData(data);
    return turf;
  },

  async deleteTurf(id) {
    if (useMySQL) {
      await pool.query('DELETE FROM turfs WHERE id = ?', [id]);
      return true;
    }
    const data = readJsonData();
    data.turfs = (data.turfs || []).filter(t => t.id !== id);
    writeJsonData(data);
    return true;
  },

  // ================= BOOKINGS =================
  async getBookings(userEmail = null) {
    if (useMySQL) {
      let query = 'SELECT * FROM bookings';
      const params = [];
      if (userEmail) {
        query += ' WHERE LOWER(user_email) = ?';
        params.push(userEmail.trim().toLowerCase());
      }
      query += ' ORDER BY created_at DESC';
      const [rows] = await pool.query(query, params);
      return rows.map(r => ({
        id: r.id,
        turfId: r.turf_id,
        turfName: r.turf_name,
        userName: r.user_name,
        userEmail: r.user_email,
        userPhone: r.user_phone,
        date: r.booking_date ? new Date(r.booking_date).toISOString().split('T')[0] : '',
        slot: r.slot,
        basePrice: Number(r.base_price),
        gst: Number(r.gst),
        platformFee: Number(r.platform_fee),
        amount: Number(r.total_amount),
        paymentMethod: r.payment_method,
        status: r.status,
        slotType: r.slot_type || 'Standard',
        checkInStatus: r.check_in_status || 'Pending',
        checkInTime: r.check_in_time,
        isOpenMatch: r.is_open_match === 1 || r.is_open_match === true,
        matchType: r.match_type || '',
        matchNote: r.match_note || '',
        createdAt: r.created_at,
        cancelledAt: r.cancelled_at
      }));
    }
    let list = readJsonData().bookings || [];
    if (userEmail) {
      list = list.filter(b => (b.userEmail || '').toLowerCase() === userEmail.toLowerCase());
    }
    return list;
  },

  async getBookingById(id) {
    if (useMySQL) {
      const [rows] = await pool.query('SELECT * FROM bookings WHERE id = ?', [id]);
      if (!rows[0]) return null;
      const r = rows[0];
      return {
        id: r.id,
        turfId: r.turf_id,
        turfName: r.turf_name,
        userName: r.user_name,
        userEmail: r.user_email,
        userPhone: r.user_phone,
        date: r.booking_date ? new Date(r.booking_date).toISOString().split('T')[0] : '',
        slot: r.slot,
        basePrice: Number(r.base_price),
        gst: Number(r.gst),
        platformFee: Number(r.platform_fee),
        amount: Number(r.total_amount),
        paymentMethod: r.payment_method,
        status: r.status,
        slotType: r.slot_type || 'Standard',
        checkInStatus: r.check_in_status || 'Pending',
        checkInTime: r.check_in_time,
        isOpenMatch: r.is_open_match === 1 || r.is_open_match === true,
        matchType: r.match_type || '',
        matchNote: r.match_note || '',
        createdAt: r.created_at,
        cancelledAt: r.cancelled_at
      };
    }
    return (readJsonData().bookings || []).find(b => b.id === id) || null;
  },

  async addBooking(booking) {
    if (useMySQL) {
      await pool.query(
        `INSERT INTO bookings (id, turf_id, turf_name, user_name, user_email, user_phone, booking_date, slot, base_price, gst, platform_fee, total_amount, payment_method, status, slot_type, check_in_status, is_open_match, match_type, match_note, created_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [
          booking.id,
          booking.turfId,
          booking.turfName,
          booking.userName,
          (booking.userEmail || '').toLowerCase(),
          booking.userPhone,
          booking.date,
          booking.slot,
          booking.basePrice,
          booking.gst,
          booking.platformFee,
          booking.amount,
          booking.paymentMethod || 'UPI',
          booking.status || 'Confirmed',
          booking.slotType || 'Standard',
          booking.checkInStatus || 'Pending',
          booking.isOpenMatch ? 1 : 0,
          booking.matchType || null,
          booking.matchNote || null
        ]
      );
      return booking;
    }
    const data = readJsonData();
    data.bookings = data.bookings || [];
    data.bookings.unshift(booking);
    writeJsonData(data);
    return booking;
  },

  async checkInBooking(id) {
    if (useMySQL) {
      const [res] = await pool.query('UPDATE bookings SET check_in_status = "Checked-In", check_in_time = NOW() WHERE id = ?', [id]);
      if (res.affectedRows === 0) return null;
      return await this.getBookingById(id);
    }
    const data = readJsonData();
    const item = (data.bookings || []).find(b => b.id === id);
    if (item) {
      item.checkInStatus = 'Checked-In';
      item.checkInTime = new Date().toISOString();
      writeJsonData(data);
      return item;
    }
    return null;
  },

  async getOpenMatches() {
    if (useMySQL) {
      const [rows] = await pool.query('SELECT * FROM bookings WHERE is_open_match = 1 AND status != "Cancelled" ORDER BY booking_date ASC, created_at DESC');
      return rows.map(r => ({
        id: r.id,
        turfId: r.turf_id,
        turfName: r.turf_name,
        userName: r.user_name,
        userEmail: r.user_email,
        userPhone: r.user_phone,
        date: r.booking_date ? new Date(r.booking_date).toISOString().split('T')[0] : '',
        slot: r.slot,
        amount: Number(r.total_amount),
        matchType: r.match_type || 'Need Opponent',
        matchNote: r.match_note || '',
        createdAt: r.created_at
      }));
    }
    return (readJsonData().bookings || []).filter(b => b.isOpenMatch && b.status !== 'Cancelled');
  },

  // ================= CANCELLATIONS =================
  async cancelBooking(id, reason = 'Player requested cancellation') {
    if (useMySQL) {
      const [rows] = await pool.query('SELECT * FROM bookings WHERE id = ?', [id]);
      if (!rows[0]) return null;
      const b = rows[0];

      await pool.query('UPDATE bookings SET status = "Cancelled", cancelled_at = NOW() WHERE id = ?', [id]);

      await pool.query(
        `INSERT INTO cancellations (booking_id, user_name, user_email, turf_name, booking_date, slot, refund_amount, reason, cancelled_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [b.id, b.user_name, b.user_email, b.turf_name, b.booking_date, b.slot, b.total_amount, reason]
      );

      return { ...b, status: 'Cancelled', cancelled_at: new Date() };
    }

    const data = readJsonData();
    const item = (data.bookings || []).find(b => b.id === id);
    if (item) {
      item.status = 'Cancelled';
      item.cancelledAt = new Date().toISOString();
      data.cancellations = data.cancellations || [];
      data.cancellations.unshift({
        id: Date.now(),
        bookingId: item.id,
        userName: item.userName,
        userEmail: item.userEmail,
        turfName: item.turfName,
        bookingDate: item.date,
        slot: item.slot,
        refundAmount: item.amount,
        reason,
        cancelledAt: new Date().toISOString()
      });
      writeJsonData(data);
      return item;
    }
    return null;
  },

  async getCancellations(limit = 100) {
    if (useMySQL) {
      const [rows] = await pool.query('SELECT * FROM cancellations ORDER BY cancelled_at DESC LIMIT ?', [limit]);
      return rows;
    }
    return (readJsonData().cancellations || []).slice(0, limit);
  },

  async getBookedSlots(turfId, date) {
    if (useMySQL) {
      const [rows] = await pool.query(
        'SELECT slot FROM bookings WHERE turf_id = ? AND booking_date = ? AND status != "Cancelled"',
        [turfId, date]
      );
      return rows.map(r => r.slot);
    }
    return (readJsonData().bookings || [])
      .filter(b => b.turfId === turfId && b.date === date && b.status !== 'Cancelled')
      .map(b => b.slot);
  },

  async getAdminStats() {
    if (useMySQL) {
      const [rev] = await pool.query('SELECT COALESCE(SUM(total_amount), 0) as totalRevenue FROM bookings WHERE status != "Cancelled"');
      const [totalB] = await pool.query('SELECT COUNT(*) as totalBookings FROM bookings');
      const [todayB] = await pool.query('SELECT COUNT(*) as todayBookings FROM bookings WHERE booking_date = CURDATE()');
      const [turfC] = await pool.query('SELECT COUNT(*) as activeTurfs FROM turfs');
      const [cancelC] = await pool.query('SELECT COUNT(*) as cancelledBookings FROM bookings WHERE status = "Cancelled"');
      const [userC] = await pool.query('SELECT COUNT(*) as totalUsers FROM users WHERE role = "user"');

      return {
        totalRevenue: Number(rev[0].totalRevenue || 0),
        totalBookings: totalB[0].totalBookings,
        todayBookings: todayB[0].todayBookings,
        activeTurfs: turfC[0].activeTurfs,
        cancelledBookings: cancelC[0].cancelledBookings,
        totalUsers: userC[0].totalUsers
      };
    }

    const bookings = readJsonData().bookings || [];
    const turfs = readJsonData().turfs || [];
    const users = readJsonData().users || [];
    const todayStr = new Date().toISOString().split('T')[0];

    return {
      totalRevenue: bookings.filter(b => b.status !== 'Cancelled').reduce((sum, b) => sum + (Number(b.amount) || 0), 0),
      totalBookings: bookings.length,
      todayBookings: bookings.filter(b => b.date === todayStr).length,
      activeTurfs: turfs.length,
      cancelledBookings: bookings.filter(b => b.status === 'Cancelled').length,
      totalUsers: users.filter(u => u.role !== 'admin').length
    };
  }
};
