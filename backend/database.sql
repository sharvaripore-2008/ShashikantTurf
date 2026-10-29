-- ==========================================================
-- SHASHIKANT TURF BOOKING SYSTEM - DATABASE SCHEMA
-- Database: shashikant_turf
-- ==========================================================

CREATE DATABASE IF NOT EXISTS shashikant_turf;
USE shashikant_turf;

-- 1. USERS TABLE (Tracks who has signed up)
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

-- 2. LOGIN LOGS TABLE (Tracks who has logged in, when, and login status)
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

-- 3. TURFS TABLE (Turf grounds and arenas)
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
    roof_type VARCHAR(100) DEFAULT 'Open Air Arena',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);

-- 4. BOOKINGS TABLE (Tracks who has booked turf slots)
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
    slot_type VARCHAR(30) DEFAULT 'Standard',
    check_in_status VARCHAR(20) DEFAULT 'Pending',
    check_in_time TIMESTAMP NULL,
    is_open_match TINYINT(1) DEFAULT 0,
    match_type VARCHAR(50) NULL,
    match_note VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cancelled_at TIMESTAMP NULL
);

-- 5. CANCELLATIONS TABLE (Tracks who cancelled bookings, when, and refund details)
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

-- ==========================================================
-- SEED DATA (Initial Records)
-- ==========================================================

-- Default Admin and Test Users
INSERT IGNORE INTO users (id, name, email, phone, password, role, created_at) VALUES
('ADM-01', 'Admin Manager', 'admin@shashikantturf.com', '+91 98765 00000', 'admin123', 'admin', NOW()),
('USR-1001', 'Rahul Sharma', 'rahul@example.com', '+91 98200 11223', 'password123', 'user', NOW()),
('USR-1002', 'Aditya Patil', 'aditya@patil.com', '+91 98190 44556', 'password123', 'user', NOW()),
('USR-1003', 'Gaurav Mehta', 'gaurav@mehta.com', '+91 98920 66778', 'password123', 'user', NOW());

-- Seed Turfs
INSERT IGNORE INTO turfs (id, name, sport, category, size, location, price_per_hour, rating, image, description, amenities) VALUES
('TRF-101', 'KickOff Grand Arena', 'Football', 'football', '7v7 FIFA Artificial Turf', 'Andheri West, Mumbai', 1200.00, 4.9, 
 'https://images.unsplash.com/photo-1529900241929-5ed53a0f33dd?auto=format&fit=crop&w=800&q=80',
 'Premium FIFA standard 7-a-side artificial turf equipped with stadium floodlights, dugout seating, clean shower changing rooms, and free player parking.',
 '["Floodlights", "Changing Rooms", "Free Parking", "Drinking Water", "Dugout Seating"]'),

('TRF-102', 'Skyline Rooftop Turf', 'Cricket', 'cricket', '5v5 Box Cricket Pitch', 'Bandra West, Mumbai', 1500.00, 4.8,
 'https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80',
 'Spectacular rooftop box cricket turf in the heart of Bandra with high bounce safety netting, ultra-bright LED match floodlights, and refreshment lounge.',
 '["Night Floodlights", "Box Netting", "Cafeteria", "Equipment Rental", "Music System"]'),

('TRF-103', 'Striker\'s Hub Multisport', 'Multisport', 'multisport', '6v6 Dual Football & Cricket', 'Powai, Mumbai', 1000.00, 4.7,
 'https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=800&q=80',
 'Versatile indoor/outdoor arena suited for corporate leagues, weekend football matches, and tennis ball box cricket tournaments.',
 '["Scoreboard", "First Aid", "Locker Room", "Spectator Stand", "CCTV Security"]'),

('TRF-104', 'Apex International Arena', 'Football', 'football', '8v8 Full Turf', 'Kandivali East, Mumbai', 1800.00, 5.0,
 'https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80',
 'Full-scale 8-a-side professional arena featuring imported Dutch synthetic grass, high mast lighting, tournament commentary desk, and referee lounge.',
 '["Tournament Ready", "Warmup Track", "Shower Rooms", "Cafeteria", "VIP Lounge"]');

-- Seed Bookings (Active & Cancelled)
INSERT IGNORE INTO bookings (id, turf_id, turf_name, user_name, user_email, user_phone, booking_date, slot, base_price, gst, platform_fee, total_amount, payment_method, status, created_at, cancelled_at) VALUES
('BK-8291', 'TRF-101', 'KickOff Grand Arena', 'Rahul Sharma', 'rahul@example.com', '+91 98200 11223', CURDATE(), '07:00 PM - 08:00 PM', 1200.00, 216.00, 50.00, 1466.00, 'UPI (Google Pay)', 'Confirmed', NOW(), NULL),
('BK-8292', 'TRF-102', 'Skyline Rooftop Turf', 'Aditya Patil', 'aditya@patil.com', '+91 98190 44556', CURDATE(), '08:00 PM - 09:00 PM', 1500.00, 270.00, 50.00, 1820.00, 'Credit Card', 'Confirmed', NOW(), NULL),
('BK-8280', 'TRF-101', 'KickOff Grand Arena', 'Gaurav Mehta', 'gaurav@mehta.com', '+91 98920 66778', DATE_SUB(CURDATE(), INTERVAL 2 DAY), '05:00 PM - 06:00 PM', 1200.00, 216.00, 50.00, 1466.00, 'Net Banking', 'Cancelled', DATE_SUB(NOW(), INTERVAL 2 DAY), NOW());

-- Seed Cancellations Log
INSERT IGNORE INTO cancellations (id, booking_id, user_name, user_email, turf_name, booking_date, slot, refund_amount, reason, cancelled_at) VALUES
(1, 'BK-8280', 'Gaurav Mehta', 'gaurav@mehta.com', 'KickOff Grand Arena', DATE_SUB(CURDATE(), INTERVAL 2 DAY), '05:00 PM - 06:00 PM', 1466.00, 'Change of schedule by player', NOW());

-- Seed Initial Login Log
INSERT IGNORE INTO login_logs (user_id, name, email, role, login_time, ip_address, status) VALUES
('ADM-01', 'Admin Manager', 'admin@shashikantturf.com', 'admin', NOW(), '127.0.0.1', 'SUCCESS'),
('USR-1001', 'Rahul Sharma', 'rahul@example.com', 'user', NOW(), '127.0.0.1', 'SUCCESS');

