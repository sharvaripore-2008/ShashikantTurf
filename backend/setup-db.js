const fs = require('fs');
const path = require('path');
const mysql = require('mysql2/promise');
require('dotenv').config();

async function runSetup() {
  console.log('\n======================================================');
  console.log('⚽ SHASHIKANT TURF - MYSQL DATABASE SETUP & MIGRATION');
  console.log('======================================================\n');

  const host = process.env.DB_HOST || 'localhost';
  const user = process.env.DB_USER || 'root';
  const password = process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '';
  const port = parseInt(process.env.DB_PORT || '3306', 10);
  const database = process.env.DB_NAME || 'shashikant_turf';

  console.log(`Connecting to MySQL Server on ${host}:${port} as '${user}'...`);

  let connection;
  try {
    connection = await mysql.createConnection({ host, user, password, port, multipleStatements: true });
    console.log('✅ Connection to MySQL Server established successfully!');
  } catch (err) {
    console.error('\n❌ Could not connect to MySQL server:');
    console.error(`   ${err.message}`);
    console.error('\n👉 Solution: Open backend/.env and set your MySQL password:');
    console.error('   DB_PASSWORD=your_actual_mysql_password\n');
    process.exit(1);
  }

  try {
    const sqlFile = path.join(__dirname, 'database.sql');
    if (!fs.existsSync(sqlFile)) {
      console.error(`❌ SQL schema file not found at: ${sqlFile}`);
      process.exit(1);
    }

    const sql = fs.readFileSync(sqlFile, 'utf8');
    console.log(`Executing database migration from database.sql...`);

    await connection.query(sql);

    console.log('\n✅ Database and tables created successfully:');
    console.log(`   - Database:      ${database}`);
    console.log('   - Tables:        users, login_logs, turfs, bookings, cancellations');
    console.log('   - Seed data:     Default turfs, admin/user accounts, sample bookings added.');
    console.log('\n🎉 Setup Completed! You can now run "npm start" or double-click "run-backend.bat".');
    console.log('======================================================\n');
  } catch (err) {
    console.error('❌ Error executing SQL script:', err.message);
  } finally {
    if (connection) await connection.end();
  }
}

runSetup();

