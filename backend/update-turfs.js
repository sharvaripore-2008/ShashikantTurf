const mysql = require('mysql2/promise');
const fs = require('fs');
const path = require('path');
require('dotenv').config({ path: path.join(__dirname, '.env') });

const NEW_TURFS = [
  {
    id: "TRF-101",
    name: "Shashikant Football Grand Arena",
    sport: "Football",
    category: "football",
    size: "7v7 FIFA Standard Turf",
    location: "Andheri West, Mumbai",
    pricePerHour: 699,
    rating: 4.9,
    roofType: "Open-Air Arena (All-Weather Drainage)",
    image: "assets/images/shashikant-turf-day.jpg",
    description: "Official Shashikant Turf FIFA standard 7-a-side football ground equipped with ultra-bright floodlights, dugout player seating, clean shower changing rooms, and free parking.",
    amenities: ["Stadium Floodlights", "Changing Rooms", "Free Parking", "Chilled Water", "Dugout Seating"]
  },
  {
    id: "TRF-102",
    name: "Shashikant Box Cricket Stadium",
    sport: "Cricket",
    category: "cricket",
    size: "6v6 Box Cricket Pitch",
    location: "Bandra West, Mumbai",
    pricePerHour: 699,
    rating: 4.9,
    roofType: "Covered Arena (100% Rain Protected)",
    image: "assets/images/shashikant-turf-night.jpg",
    description: "High-voltage box cricket arena with professional turf pitch, high-bounce safety netting, night match LED floodlights, sound system, and tournament score desk.",
    amenities: ["Night Floodlights", "Box Netting", "Equipment Rental", "Tournament Desk", "Cafeteria"]
  },
  {
    id: "TRF-103",
    name: "Shashikant Multisport Arena",
    sport: "Multisport",
    category: "multisport",
    size: "6v6 Dual Football & Box Cricket",
    location: "Powai, Mumbai",
    pricePerHour: 699,
    rating: 4.8,
    roofType: "Covered Arena (100% Rain Protected)",
    image: "assets/images/shashikant-turf-day.jpg",
    description: "Versatile dual-purpose sports turf tailored for weekend matches, corporate leagues, football shootouts, and box cricket tournaments.",
    amenities: ["Electronic Scoreboard", "First Aid", "Locker Room", "Spectator Stand", "CCTV Security"]
  },
  {
    id: "TRF-104",
    name: "Shashikant Night Floodlit Stadium",
    sport: "Football",
    category: "football",
    size: "8v8 Full Scale Arena",
    location: "Kandivali East, Mumbai",
    pricePerHour: 699,
    rating: 5.0,
    roofType: "Open-Air Arena (All-Weather Drainage)",
    image: "assets/images/shashikant-turf-night.jpg",
    description: "Full-scale night match arena with imported monofilament grass, high mast lighting towers, warm-up track, and spectator gallery.",
    amenities: ["High Mast Lights", "Warmup Track", "Shower Rooms", "VIP Lounge", "Referee Room"]
  }
];

async function updateTurfsAndPrices() {
  console.log('Updating Turfs with ₹699/hr and uploaded images...');

  // 1. Update MySQL
  try {
    const conn = await mysql.createConnection({
      host: process.env.DB_HOST || 'localhost',
      user: process.env.DB_USER || 'root',
      password: process.env.DB_PASSWORD !== undefined ? process.env.DB_PASSWORD : '',
      database: process.env.DB_NAME || 'shashikant_turf'
    });

    await conn.query('DELETE FROM turfs');

    for (const t of NEW_TURFS) {
      await conn.query(
        'INSERT INTO turfs (id, name, sport, category, size, location, price_per_hour, rating, roof_type, image, description, amenities) VALUES (?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?, ?)',
        [t.id, t.name, t.sport, t.category, t.size, t.location, t.pricePerHour, t.rating, t.roofType, t.image, t.description, JSON.stringify(t.amenities)]
      );
    }
    console.log('✅ MySQL Turfs updated successfully to ₹699/hr with new images');
    await conn.end();
  } catch (err) {
    console.warn('MySQL update notice:', err.message);
  }

  // 2. Update JSON files
  const dbPath = path.join(__dirname, 'data', 'db.json');
  const seedPath = path.join(__dirname, 'data', 'seed.json');

  [dbPath, seedPath].forEach(filePath => {
    try {
      if (fs.existsSync(filePath)) {
        const data = JSON.parse(fs.readFileSync(filePath, 'utf-8'));
        data.turfs = NEW_TURFS;
        fs.writeFileSync(filePath, JSON.stringify(data, null, 2), 'utf-8');
        console.log(`✅ Updated ${filePath}`);
      }
    } catch (e) {}
  });

  console.log('ALL TURF DATA SYNCHRONIZED AT ₹699/hr');
}

updateTurfsAndPrices();
