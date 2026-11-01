const mysql = require('mysql2/promise');
const { Pool: PgPool, Client: PgClient } = require('pg');
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

let activeDB = 'none'; // 'postgres', 'mysql', or 'json'
let pgPool = null;
let mysqlPool = null;

// Initialize Database connection & auto-create tables
async function initDB() {
  const preferredDB = (process.env.DB_TYPE || 'postgres').toLowerCase();

  // ================= TRY POSTGRESQL FIRST IF CONFIGURED =================
  if (preferredDB === 'postgres') {
    const pgHost = process.env.PG_HOST || 'localhost';
    const pgPort = parseInt(process.env.PG_PORT || '5432', 10);
    const pgUser = process.env.PG_USER || 'postgres';
    const pgPassword = process.env.PG_PASSWORD || process.env.DB_PASSWORD || 'Sharvari@267890';
    const pgDatabase = process.env.PG_DATABASE || 'shashikant_turf';

    try {
      console.log(`Connecting to PostgreSQL Server on ${pgHost}:${pgPort} as '${pgUser}'...`);
      // 1. Ensure database exists
      const rootClient = new PgClient({ host: pgHost, port: pgPort, user: pgUser, password: pgPassword, database: 'postgres' });
      await rootClient.connect();
      const checkDb = await rootClient.query("SELECT 1 FROM pg_database WHERE datname = $1", [pgDatabase]);
      if (checkDb.rowCount === 0) {
        await rootClient.query(`CREATE DATABASE "${pgDatabase}";`);
        console.log(`✅ PostgreSQL: Database "${pgDatabase}" created`);
      }
      await rootClient.end();

      // 2. Connect pool
      pgPool = new PgPool({
        host: pgHost,
        port: pgPort,
        user: pgUser,
        password: pgPassword,
        database: pgDatabase,
        max: 10
      });

      // 3. Run schema if needed
      const sqlFile = path.join(__dirname, '..', 'database-pg.sql');
      if (fs.existsSync(sqlFile)) {
        const sql = fs.readFileSync(sqlFile, 'utf8');
        await pgPool.query(sql);
      }

      activeDB = 'postgres';
      console.log('==================================================');
      console.log(`✅ CONNECTED TO POSTGRESQL DATABASE: "${pgDatabase}"`);
      console.log('   pgAdmin 4 tables: users, login_logs, turfs, bookings, cancellations');
      console.log('==================================================');
      return;
    } catch (pgErr) {
      console.warn('\n⚠️  PostgreSQL Note:', pgErr.message);
      console.warn('   (Will attempt MySQL fallback or JSON mode)\n');
    }
  }

  // ================= TRY MYSQL =================
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : 'Sharvari@267890';
  const port = parseInt(process.env.DB_PORT || '3306', 10);
  const database = process.env.DB_NAME || 'shashikant_turf';

  try {
    const rootConn = await mysql.createConnection({ host, user, password, port });
    await rootConn.query(`CREATE DATABASE IF NOT EXISTS \`${database}\`;`);
    await rootConn.end();

    mysqlPool = mysql.createPool({
      host,
      user,
      password,
      port,
      database,
      waitForConnections: true,
      connectionLimit: 10
    });

    activeDB = 'mysql';
    console.log('==================================================');
    console.log(`✅ CONNECTED TO MYSQL DATABASE: "${database}"`);
    console.log('==================================================');
  } catch (err) {
    activeDB = 'json';
    console.warn('\n⚠️  Database Note: Neither PostgreSQL nor MySQL is running.');
    console.warn('   Falling back seamlessly to local data/db.json storage.\n');
  }
}

function mapBooking(r) {
  return {
    id: r.id,
    turfId: r.turf_id,
    turfName: r.turf_name,
    userName: r.user_name,
    userEmail: r.user_email,
    userPhone: r.user_phone,
    date: r.booking_date ? new Date(r.booking_date).toISOString().split('T')[0] : '',
    slot: r.slot,
    basePrice: Number(r.base_price || 699),
    gst: Number(r.gst || 0),
    platformFee: Number(r.platform_fee || 0),
    amount: Number(r.total_amount || r.amount || 699),
    paymentMethod: r.payment_method || 'UPI',
    status: r.status || 'Confirmed',
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

let initPromise = null;
function startInit() {
  if (!initPromise) initPromise = initDB();
  return initPromise;
}

startInit();

module.exports = {
  initDB: startInit,
  getActiveDB: () => activeDB,
  isUsingMySQL: () => activeDB === 'mysql',
  isUsingPostgres: () => activeDB === 'postgres',
  getPool: () => (activeDB === 'postgres' ? pgPool : mysqlPool),

  // ================= USERS & SIGN UP =================
  async getUsers() {
    if (activeDB === 'postgres') {
      const res = await pgPool.query('SELECT id, name, email, phone, role, created_at, last_login FROM users ORDER BY created_at DESC');
      return res.rows;
    }
    if (activeDB === 'mysql') {
      const [rows] = await mysqlPool.query('SELECT id, name, email, phone, role, created_at, last_login FROM users ORDER BY created_at DESC');
      return rows;
    }
    return (readJsonData().users || []).map(({ password, ...u }) => u);
  },

  async getUserById(id) {
    if (activeDB === 'postgres') {
      const res = await pgPool.query('SELECT * FROM users WHERE id = $1', [id]);
      return res.rows[0] || null;
    }
    if (activeDB === 'mysql') {
      const [rows] = await mysqlPool.query('SELECT * FROM users WHERE id = ?', [id]);
      return rows[0] || null;
    }
    return (readJsonData().users || []).find(u => u.id === id) || null;
  },

  async getUserByEmail(email) {
    if (!email) return null;
    const clean = email.trim().toLowerCase();
    if (activeDB === 'postgres') {
      const res = await pgPool.query('SELECT * FROM users WHERE LOWER(email) = $1', [clean]);
      return res.rows[0] || null;
    }
    if (activeDB === 'mysql') {
      const [rows] = await mysqlPool.query('SELECT * FROM users WHERE LOWER(email) = ?', [clean]);
      return rows[0] || null;
    }
    return (readJsonData().users || []).find(u => (u.email || '').toLowerCase() === clean) || null;
  },

  async addUser(user) {
    if (activeDB === 'postgres') {
      await pgPool.query(
        'INSERT INTO users (id, name, email, phone, password, role, created_at) VALUES ($1, $2, $3, $4, $5, $6, NOW())',
        [user.id, user.name, user.email.toLowerCase(), user.phone || '+91 98765 00000', user.password, user.role || 'user']
      );
      return user;
    }
    if (activeDB === 'mysql') {
      await mysqlPool.query(
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
    if (activeDB === 'postgres') {
      await pgPool.query(
        'INSERT INTO login_logs (user_id, name, email, role, ip_address, status, login_time) VALUES ($1, $2, $3, $4, $5, $6, NOW())',
        [userId || null, name || null, email.toLowerCase(), role || 'user', ipAddress || '127.0.0.1', status || 'SUCCESS']
      );
      if (userId) {
        await pgPool.query('UPDATE users SET last_login = NOW() WHERE id = $1', [userId]);
      }
      return true;
    }
    if (activeDB === 'mysql') {
      await mysqlPool.query(
        'INSERT INTO login_logs (user_id, name, email, role, ip_address, status, login_time) VALUES (?, ?, ?, ?, ?, ?, NOW())',
        [userId || null, name || null, email.toLowerCase(), role || 'user', ipAddress || '127.0.0.1', status || 'SUCCESS']
      );
      if (userId) {
        await mysqlPool.query('UPDATE users SET last_login = NOW() WHERE id = ?', [userId]);
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
    if (activeDB === 'postgres') {
      const res = await pgPool.query('SELECT * FROM login_logs ORDER BY login_time DESC LIMIT $1', [limit]);
      return res.rows;
    }
    if (activeDB === 'mysql') {
      const [rows] = await mysqlPool.query('SELECT * FROM login_logs ORDER BY login_time DESC LIMIT ?', [limit]);
      return rows;
    }
    return (readJsonData().login_logs || []).slice(0, limit);
  },

  // ================= TURFS =================
  async getTurfs() {
    if (activeDB === 'postgres') {
      const res = await pgPool.query('SELECT * FROM turfs ORDER BY rating DESC');
      return res.rows.map(r => ({
        ...r,
        pricePerHour: Number(r.price_per_hour),
        roofType: r.roof_type || 'Covered Arena',
        amenities: typeof r.amenities === 'string' ? JSON.parse(r.amenities) : (r.amenities || [])
      }));
    }
    if (activeDB === 'mysql') {
      const [rows] = await mysqlPool.query('SELECT * FROM turfs ORDER BY rating DESC');
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
    if (activeDB === 'postgres') {
      const res = await pgPool.query('SELECT * FROM turfs WHERE id = $1', [id]);
      if (!res.rows[0]) return null;
      const r = res.rows[0];
      return {
        ...r,
        pricePerHour: Number(r.price_per_hour),
        roofType: r.roof_type || 'Covered Arena',
        amenities: typeof r.amenities === 'string' ? JSON.parse(r.amenities) : (r.amenities || [])
      };
    }
    if (activeDB === 'mysql') {
      const [rows] = await mysqlPool.query('SELECT * FROM turfs WHERE id = ?', [id]);
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
    if (activeDB === 'postgres') {
      await pgPool.query(
        'INSERT INTO turfs (id, name, sport, category, size, location, price_per_hour, rating, roof_type, image, description, amenities) VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12)',
        [turf.id, turf.name, turf.sport, turf.category, turf.size, turf.location, turf.pricePerHour || 699, turf.rating || 5.0, turf.roofType || 'Covered Arena', turf.image, turf.description, JSON.stringify(turf.amenities || [])]
      );
      return turf;
    }
    if (activeDB === 'mysql') {
      await mysqlPool.query(
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
    if (activeDB === 'postgres') {
      await pgPool.query('DELETE FROM turfs WHERE id = $1', [id]);
      return true;
    }
    if (activeDB === 'mysql') {
      await mysqlPool.query('DELETE FROM turfs WHERE id = ?', [id]);
      return true;
    }
    const data = readJsonData();
    data.turfs = (data.turfs || []).filter(t => t.id !== id);
    writeJsonData(data);
    return true;
  },

  // ================= BOOKINGS =================
  async getBookings(userEmail = null) {
    if (activeDB === 'postgres') {
      let query = 'SELECT * FROM bookings';
      const params = [];
      if (userEmail) {
        query += ' WHERE LOWER(user_email) = $1';
        params.push(userEmail.trim().toLowerCase());
      }
      query += ' ORDER BY created_at DESC';
      const res = await pgPool.query(query, params);
      return res.rows.map(mapBooking);
    }
    if (activeDB === 'mysql') {
      let query = 'SELECT * FROM bookings';
      const params = [];
      if (userEmail) {
        query += ' WHERE LOWER(user_email) = ?';
        params.push(userEmail.trim().toLowerCase());
      }
      query += ' ORDER BY created_at DESC';
      const [rows] = await mysqlPool.query(query, params);
      return rows.map(mapBooking);
    }
    let list = readJsonData().bookings || [];
    if (userEmail) {
      list = list.filter(b => (b.userEmail || '').toLowerCase() === userEmail.toLowerCase());
    }
    return list;
  },

  async getBookingById(id) {
    if (activeDB === 'postgres') {
      const res = await pgPool.query('SELECT * FROM bookings WHERE id = $1', [id]);
      return res.rows[0] ? mapBooking(res.rows[0]) : null;
    }
    if (activeDB === 'mysql') {
      const [rows] = await mysqlPool.query('SELECT * FROM bookings WHERE id = ?', [id]);
      return rows[0] ? mapBooking(rows[0]) : null;
    }
    return (readJsonData().bookings || []).find(b => b.id === id) || null;
  },

  async addBooking(booking) {
    if (activeDB === 'postgres') {
      await pgPool.query(
        `INSERT INTO bookings (id, turf_id, turf_name, user_name, user_email, user_phone, booking_date, slot, base_price, gst, platform_fee, total_amount, amount, payment_method, status, slot_type, check_in_status, is_open_match, match_type, match_note, created_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, $9, $10, $11, $12, $13, $14, $15, $16, $17, $18, $19, $20, NOW())`,
        [
          booking.id,
          booking.turfId,
          booking.turfName,
          booking.userName,
          (booking.userEmail || '').toLowerCase(),
          booking.userPhone,
          booking.date,
          booking.slot,
          booking.basePrice || 699,
          booking.gst || 0,
          booking.platformFee || 0,
          booking.amount || 699,
          booking.amount || 699,
          booking.paymentMethod || 'UPI',
          booking.status || 'Confirmed',
          booking.slotType || 'Standard',
          booking.checkInStatus || 'Pending',
          booking.isOpenMatch ? true : false,
          booking.matchType || null,
          booking.matchNote || null
        ]
      );
      return booking;
    }
    if (activeDB === 'mysql') {
      await mysqlPool.query(
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
    if (activeDB === 'postgres') {
      const res = await pgPool.query("UPDATE bookings SET check_in_status = 'Checked-In', check_in_time = NOW() WHERE id = $1", [id]);
      if (res.rowCount === 0) return null;
      return await this.getBookingById(id);
    }
    if (activeDB === 'mysql') {
      const [res] = await mysqlPool.query('UPDATE bookings SET check_in_status = "Checked-In", check_in_time = NOW() WHERE id = ?', [id]);
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
    if (activeDB === 'postgres') {
      const res = await pgPool.query("SELECT * FROM bookings WHERE is_open_match = true AND status != 'Cancelled' ORDER BY booking_date ASC, created_at DESC");
      return res.rows.map(mapBooking);
    }
    if (activeDB === 'mysql') {
      const [rows] = await mysqlPool.query('SELECT * FROM bookings WHERE is_open_match = 1 AND status != "Cancelled" ORDER BY booking_date ASC, created_at DESC');
      return rows.map(mapBooking);
    }
    return (readJsonData().bookings || []).filter(b => b.isOpenMatch && b.status !== 'Cancelled');
  },

  // ================= CANCELLATIONS =================
  async cancelBooking(id, reason = 'Player requested cancellation') {
    const b = await this.getBookingById(id);
    if (!b) return null;

    if (activeDB === 'postgres') {
      await pgPool.query("UPDATE bookings SET status = 'Cancelled', cancelled_at = NOW() WHERE id = $1", [id]);
      await pgPool.query(
        `INSERT INTO cancellations (booking_id, user_name, user_email, turf_name, booking_date, slot, refund_amount, reason, cancelled_at)
         VALUES ($1, $2, $3, $4, $5, $6, $7, $8, NOW())`,
        [b.id, b.userName, b.userEmail, b.turfName, b.date, b.slot, b.amount, reason]
      );
      return { ...b, status: 'Cancelled', cancelledAt: new Date() };
    }

    if (activeDB === 'mysql') {
      await mysqlPool.query('UPDATE bookings SET status = "Cancelled", cancelled_at = NOW() WHERE id = ?', [id]);
      await mysqlPool.query(
        `INSERT INTO cancellations (booking_id, user_name, user_email, turf_name, booking_date, slot, refund_amount, reason, cancelled_at)
         VALUES (?, ?, ?, ?, ?, ?, ?, ?, NOW())`,
        [b.id, b.userName, b.userEmail, b.turfName, b.date, b.slot, b.amount, reason]
      );
      return { ...b, status: 'Cancelled', cancelled_at: new Date() };
    }

    const data = readJsonData();
    const item = (data.bookings || []).find(x => x.id === id);
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
    if (activeDB === 'postgres') {
      const res = await pgPool.query('SELECT * FROM cancellations ORDER BY cancelled_at DESC LIMIT $1', [limit]);
      return res.rows;
    }
    if (activeDB === 'mysql') {
      const [rows] = await mysqlPool.query('SELECT * FROM cancellations ORDER BY cancelled_at DESC LIMIT ?', [limit]);
      return rows;
    }
    return (readJsonData().cancellations || []).slice(0, limit);
  },

  async getBookedSlots(turfId, date) {
    if (activeDB === 'postgres') {
      const res = await pgPool.query("SELECT slot FROM bookings WHERE turf_id = $1 AND booking_date = $2 AND status != 'Cancelled'", [turfId, date]);
      return res.rows.map(r => r.slot);
    }
    if (activeDB === 'mysql') {
      const [rows] = await mysqlPool.query('SELECT slot FROM bookings WHERE turf_id = ? AND booking_date = ? AND status != "Cancelled"', [turfId, date]);
      return rows.map(r => r.slot);
    }
    return (readJsonData().bookings || [])
      .filter(b => b.turfId === turfId && b.date === date && b.status !== 'Cancelled')
      .map(b => b.slot);
  },

  async getAdminStats() {
    if (activeDB === 'postgres') {
      const rev = await pgPool.query("SELECT COALESCE(SUM(total_amount), 0) as totalrevenue FROM bookings WHERE status != 'Cancelled'");
      const totalB = await pgPool.query("SELECT COUNT(*) as totalbookings FROM bookings");
      const todayB = await pgPool.query("SELECT COUNT(*) as todaybookings FROM bookings WHERE booking_date = CURRENT_DATE");
      const turfC = await pgPool.query("SELECT COUNT(*) as activeturfs FROM turfs");
      const cancelC = await pgPool.query("SELECT COUNT(*) as cancelledbookings FROM bookings WHERE status = 'Cancelled'");
      const userC = await pgPool.query("SELECT COUNT(*) as totalusers FROM users WHERE role = 'user'");

      return {
        totalRevenue: Number(rev.rows[0].totalrevenue || 0),
        totalBookings: parseInt(totalB.rows[0].totalbookings, 10),
        todayBookings: parseInt(todayB.rows[0].todaybookings, 10),
        activeTurfs: parseInt(turfC.rows[0].activeturfs, 10),
        cancelledBookings: parseInt(cancelC.rows[0].cancelledbookings, 10),
        totalUsers: parseInt(userC.rows[0].totalusers, 10)
      };
    }

    if (activeDB === 'mysql') {
      const [rev] = await mysqlPool.query('SELECT COALESCE(SUM(total_amount), 0) as totalRevenue FROM bookings WHERE status != "Cancelled"');
      const [totalB] = await mysqlPool.query('SELECT COUNT(*) as totalBookings FROM bookings');
      const [todayB] = await mysqlPool.query('SELECT COUNT(*) as todayBookings FROM bookings WHERE booking_date = CURDATE()');
      const [turfC] = await mysqlPool.query('SELECT COUNT(*) as activeTurfs FROM turfs');
      const [cancelC] = await mysqlPool.query('SELECT COUNT(*) as cancelledBookings FROM bookings WHERE status = "Cancelled"');
      const [userC] = await mysqlPool.query('SELECT COUNT(*) as totalUsers FROM users WHERE role = "user"');

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
