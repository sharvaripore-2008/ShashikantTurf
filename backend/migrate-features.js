const mysql = require('mysql2/promise');
require('dotenv').config();

async function migrate() {
  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '';
  const port = parseInt(process.env.DB_PORT || '3306', 10);
  const database = process.env.DB_NAME || 'shashikant_turf';

  const conn = await mysql.createConnection({ host, user, password, port, database });

  async function addCol(table, col, def) {
    const [cols] = await conn.query(
      'SELECT COLUMN_NAME FROM information_schema.COLUMNS WHERE TABLE_SCHEMA = ? AND TABLE_NAME = ? AND COLUMN_NAME = ?',
      [database, table, col]
    );
    if (cols.length === 0) {
      await conn.query(`ALTER TABLE \`${table}\` ADD COLUMN \`${col}\` ${def}`);
      console.log(`Added column ${col} to ${table}`);
    } else {
      console.log(`Column ${col} already exists in ${table}`);
    }
  }

  await addCol('bookings', 'check_in_status', 'VARCHAR(20) DEFAULT "Pending"');
  await addCol('bookings', 'check_in_time', 'TIMESTAMP NULL');
  await addCol('bookings', 'is_open_match', 'TINYINT(1) DEFAULT 0');
  await addCol('bookings', 'match_type', 'VARCHAR(50) NULL');
  await addCol('bookings', 'match_note', 'VARCHAR(255) NULL');
  await addCol('bookings', 'slot_type', 'VARCHAR(30) DEFAULT "Standard"');
  await addCol('turfs', 'roof_type', 'VARCHAR(100) DEFAULT "Open Air Arena"');

  // Update sample data for demonstration
  try {
    await conn.query('UPDATE bookings SET is_open_match = 1, match_type = "Need Opponent Team", match_note = "Looking for friendly 7v7 football team for weekend match!", check_in_status = "Pending", slot_type = "Prime" WHERE id = "BK-8291";');
    await conn.query('UPDATE bookings SET is_open_match = 1, match_type = "Need 3 Players", match_note = "Box Cricket match - need 3 energetic players/batsmen!", check_in_status = "Checked-In", check_in_time = NOW(), slot_type = "Prime" WHERE id = "BK-8292";');
    await conn.query('UPDATE turfs SET roof_type = "Covered Arena (100% Rain Protected)" WHERE id IN ("TRF-102", "TRF-103");');
    await conn.query('UPDATE turfs SET roof_type = "Open Air Arena (All-Weather Drainage)" WHERE id IN ("TRF-101", "TRF-104");');
  } catch (err) {
    console.log('Sample update notice:', err.message);
  }

  console.log('✅ DATABASE COLUMNS AND MIGRATION VERIFIED SUCCESSFULLY');
  await conn.end();
}

migrate().catch(console.error);

