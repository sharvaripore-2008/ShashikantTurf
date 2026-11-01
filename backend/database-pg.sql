-- ========================================================
-- ⚽ SHASHIKANT TURF - POSTGRESQL DATABASE SCHEMA & SEED
-- Compatible with pgAdmin 4 & PostgreSQL 14 / 15 / 16 / 17
-- ========================================================

-- 1. Users Table (Signups & Authentication)
CREATE TABLE IF NOT EXISTS users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) DEFAULT '+91 98765 00000',
    password VARCHAR(255) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);

-- 2. Login Logs Table (Audit Trail)
CREATE TABLE IF NOT EXISTS login_logs (
    id SERIAL PRIMARY KEY,
    user_id VARCHAR(50),
    name VARCHAR(100),
    email VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(50) DEFAULT '127.0.0.1',
    status VARCHAR(20) DEFAULT 'SUCCESS'
);

-- 3. Turfs Table (Venues with Flat ₹699/hr Rate)
CREATE TABLE IF NOT EXISTS turfs (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(150) NOT NULL,
    sport VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    size VARCHAR(50) NOT NULL,
    location VARCHAR(200) NOT NULL,
    price_per_hour NUMERIC(10, 2) NOT NULL DEFAULT 699.00,
    rating NUMERIC(2, 1) DEFAULT 4.9,
    roof_type VARCHAR(100) DEFAULT 'Covered Arena (100% Rain Protected)',
    image VARCHAR(255),
    description TEXT,
    amenities JSONB,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. Bookings Table (Reservations & QR Gate Passes)
CREATE TABLE IF NOT EXISTS bookings (
    id VARCHAR(50) PRIMARY KEY,
    turf_id VARCHAR(50) NOT NULL,
    turf_name VARCHAR(150) NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    user_email VARCHAR(100) NOT NULL,
    user_phone VARCHAR(20) DEFAULT '+91 98765 43210',
    booking_date DATE NOT NULL,
    slot VARCHAR(50) NOT NULL,
    base_price NUMERIC(10, 2) NOT NULL DEFAULT 699.00,
    gst NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    platform_fee NUMERIC(10, 2) NOT NULL DEFAULT 0.00,
    total_amount NUMERIC(10, 2) NOT NULL DEFAULT 699.00,
    amount NUMERIC(10, 2) NOT NULL DEFAULT 699.00,
    payment_method VARCHAR(50) DEFAULT 'UPI',
    status VARCHAR(50) DEFAULT 'Confirmed',
    slot_type VARCHAR(50) DEFAULT 'Standard',
    check_in_status VARCHAR(50) DEFAULT 'Pending',
    check_in_time TIMESTAMP NULL,
    is_open_match BOOLEAN DEFAULT FALSE,
    match_type VARCHAR(100) NULL,
    match_note VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cancelled_at TIMESTAMP NULL
);

-- 5. Cancellations Table (Refund Records)
CREATE TABLE IF NOT EXISTS cancellations (
    id SERIAL PRIMARY KEY,
    booking_id VARCHAR(50) NOT NULL,
    user_name VARCHAR(100),
    user_email VARCHAR(100),
    turf_name VARCHAR(150),
    booking_date DATE,
    slot VARCHAR(50),
    refund_amount NUMERIC(10, 2) DEFAULT 699.00,
    reason TEXT DEFAULT 'Player requested cancellation',
    cancelled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- ========================================================
-- SEED DATA
-- ========================================================

-- Seed Admin & Default Users
INSERT INTO users (id, name, email, phone, password, role) VALUES
('ADM-01', 'Admin Manager', 'admin@shashikantturf.com', '+91 98765 00000', 'admin123', 'admin'),
('ADM-02', 'Admin Sharvari', 'admin@turf.com', '+91 98765 00000', 'admin', 'admin'),
('USR-1001', 'Rahul Sharma', 'rahul@example.com', '+91 98200 11223', 'password123', 'user'),
('USR-1002', 'Aditya Patil', 'aditya@patil.com', '+91 98190 44556', 'password123', 'user'),
('USR-1003', 'Gaurav Mehta', 'rohan@gmail.com', '+91 98111 22334', '123', 'user')
ON CONFLICT (id) DO NOTHING;

-- Seed Shashikant Turf Arenas
INSERT INTO turfs (id, name, sport, category, size, location, price_per_hour, rating, roof_type, image, description, amenities) VALUES
('TRF-101', 'Shashikant Football Grand Arena', 'Football', 'football', '7v7 FIFA Standard Turf', 'Andheri West, Mumbai', 699.00, 4.9, 
 'Open-Air Arena (All-Weather Drainage)', 'assets/images/shashikant-turf-day.jpg',
 'Official Shashikant Turf FIFA standard 7-a-side football ground equipped with ultra-bright floodlights, dugout player seating, clean shower changing rooms, and free parking.',
 '["Stadium Floodlights", "Changing Rooms", "Free Parking", "Chilled Water", "Dugout Seating"]'),

('TRF-102', 'Shashikant Box Cricket Stadium', 'Cricket', 'cricket', '6v6 Box Cricket Pitch', 'Bandra West, Mumbai', 699.00, 4.9,
 'Covered Arena (100% Rain Protected)', 'assets/images/shashikant-turf-night.jpg',
 'High-voltage box cricket arena with professional turf pitch, high-bounce safety netting, night match LED floodlights, sound system, and tournament score desk.',
 '["Night Floodlights", "Box Netting", "Equipment Rental", "Tournament Desk", "Cafeteria"]'),

('TRF-103', 'Shashikant Multisport Arena', 'Multisport', 'multisport', '6v6 Dual Football & Box Cricket', 'Powai, Mumbai', 699.00, 4.8,
 'Covered Arena (100% Rain Protected)', 'assets/images/shashikant-turf-day.jpg',
 'Versatile dual-purpose sports turf tailored for weekend matches, corporate leagues, football shootouts, and box cricket tournaments.',
 '["Electronic Scoreboard", "First Aid", "Locker Room", "Spectator Stand", "CCTV Security"]'),

('TRF-104', 'Shashikant Night Floodlit Stadium', 'Football', 'football', '8v8 Full Scale Arena', 'Kandivali East, Mumbai', 699.00, 5.0,
 'Open-Air Arena (All-Weather Drainage)', 'assets/images/shashikant-turf-night.jpg',
 'Full-scale night match arena with imported monofilament grass, high mast lighting towers, warm-up track, and spectator gallery.',
 '["High Mast Lights", "Warmup Track", "Shower Rooms", "VIP Lounge", "Referee Room"]')
ON CONFLICT (id) DO NOTHING;

-- Seed Sample Bookings with QR Passes
INSERT INTO bookings (id, turf_id, turf_name, user_name, user_email, user_phone, booking_date, slot, base_price, gst, platform_fee, total_amount, amount, payment_method, status, check_in_status) VALUES
('BK-1024', 'TRF-101', 'Shashikant Football Grand Arena', 'Rahul Sharma', 'rahul@example.com', '+91 98200 11223', CURRENT_DATE, '07:00 PM - 08:00 PM', 699.00, 0.00, 0.00, 699.00, 699.00, 'UPI (Google Pay)', 'Confirmed', 'Pending'),
('BK-1025', 'TRF-102', 'Shashikant Box Cricket Stadium', 'Aditya Patil', 'aditya@patil.com', '+91 98190 44556', CURRENT_DATE, '08:00 PM - 09:00 PM', 699.00, 0.00, 0.00, 699.00, 699.00, 'UPI (PhonePe)', 'Confirmed', 'Checked-In'),
('BK-1026', 'TRF-104', 'Shashikant Night Floodlit Stadium', 'Gaurav Mehta', 'rohan@gmail.com', '+91 98111 22334', CURRENT_DATE + INTERVAL '1 day', '09:00 PM - 10:00 PM', 699.00, 0.00, 0.00, 699.00, 699.00, 'UPI (Paytm)', 'Confirmed', 'Pending')
ON CONFLICT (id) DO NOTHING;

