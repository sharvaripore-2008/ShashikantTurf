const fs = require('fs');
const path = require('path');
const { Client, Pool } = require('pg');
require('dotenv').config({ path: path.join(__dirname, '.env') });
require('dotenv').config();

async function runPgSetup() {
  console.log('\n======================================================');
  console.log('🐘 SHASHIKANT TURF - POSTGRESQL & PGADMIN 4 SETUP');
  console.log('======================================================\n');

  const host = process.env.PG_HOST || 'localhost';
  const port = parseInt(process.env.PG_PORT || '5432', 10);
  const user = process.env.PG_USER || 'postgres';
  const password = process.env.PG_PASSWORD || process.env.DB_PASSWORD || 'Sharvari@267890';
  const database = process.env.PG_DATABASE || 'shashikant_turf';

  console.log(`Connecting to PostgreSQL Server on ${host}:${port} as '${user}'...`);

  // 1. Connect to default 'postgres' database to create 'shashikant_turf' if needed
  let rootClient;
  try {
    rootClient = new Client({ host, port, user, password, database: 'postgres' });
    await rootClient.connect();
    console.log('✅ Connected to PostgreSQL root server successfully!');

    // Check if database exists
    const checkDb = await rootClient.query(
      "SELECT 1 FROM pg_database WHERE datname = $1",
      [database]
    );

    if (checkDb.rowCount === 0) {
      console.log(`Creating database "${database}"...`);
      await rootClient.query(`CREATE DATABASE "${database}";`);
      console.log(`✅ Database "${database}" created successfully!`);
    } else {
      console.log(`ℹ️ Database "${database}" already exists.`);
    }
  } catch (err) {
    console.error('\n❌ Could not connect to PostgreSQL Server:');
    console.error(`   ${err.message}`);
    console.error('\n👉 Ensure PostgreSQL is running on port 5432 and password matches in backend/.env:');
    console.error(`   PG_PASSWORD=${password}\n`);
    if (rootClient) await rootClient.end();
    return false;
  } finally {
    if (rootClient) await rootClient.end();
  }

  // 2. Connect to 'shashikant_turf' database and run migration
  let dbClient;
  try {
    console.log(`\nConnecting to target database "${database}"...`);
    dbClient = new Client({ host, port, user, password, database });
    await dbClient.connect();

    const sqlFile = path.join(__dirname, 'database-pg.sql');
    if (!fs.existsSync(sqlFile)) {
      console.error(`❌ SQL schema file not found at: ${sqlFile}`);
      return false;
    }

    const sql = fs.readFileSync(sqlFile, 'utf8');
    console.log(`Executing PostgreSQL schema & seed migration from database-pg.sql...`);

    await dbClient.query(sql);

    console.log('\n======================================================');
    console.log('🎉 POSTGRESQL & PGADMIN 4 MIGRATION COMPLETED!');
    console.log('======================================================');
    console.log(`✅ Database:   "${database}"`);
    console.log('✅ Tables:     users, login_logs, turfs, bookings, cancellations');
    console.log('✅ Seed Data:  Default arenas (₹699/hr), Admin/User logins, QR gate passes');
    console.log('\n📱 You can now open pgAdmin 4:');
    console.log('   1. Open pgAdmin 4 -> Enter your Master Password');
    console.log(`   2. Expand Servers -> Databases -> "${database}" -> Schemas -> public -> Tables`);
    console.log('   3. Right-click any table -> "View/Edit Data" -> "All Rows" to see your data!');
    console.log('======================================================\n');
    return true;
  } catch (err) {
    console.error('❌ Error executing PostgreSQL migration:', err.message);
    return false;
  } finally {
    if (dbClient) await dbClient.end();
  }
}

if (require.main === module) {
  runPgSetup();
}

module.exports = runPgSetup;

