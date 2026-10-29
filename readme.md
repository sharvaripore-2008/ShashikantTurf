# ⚽ 🏏 Shashikant Turf Booking System — Full Stack & MySQL

A modern, high-conversion full-stack turf booking and matchmaking platform built for **Shashikant Turf (Mumbai)**. Supports Football and Box Cricket bookings, flat **₹699 / hour** pricing, instant Gmail confirmation tickets with scannable QR Gate Passes, interactive Day/Night floodlights preview, community matchmaking lobby, and live synchronization with **MySQL 8.4** & browser **LocalStorage**.

---

## 🌟 Key Features

1. **🏏 Cricket & ⚽ Football Specialized Arenas:**
   - **Shashikant Football Grand Arena**: 7v7 FIFA Pro synthetic turf, all-weather rain drainage, and dugout seating.
   - **Shashikant Box Cricket Stadium**: High-bounce synthetic pitch, heavy boundary safety nets, and sound system.
   - **Shashikant Multisport Arena**: 6v6 dual Football & Box Cricket ground with covered roof protection.
   - **Shashikant Night Floodlit Stadium**: 8v8 stadium-scale arena with high mast LED lighting towers.

2. **⚡ Flat ₹699 / Hour Pricing:**
   - 100% transparent pricing across all arenas with zero hidden booking commissions.

3. **📧 Instant Gmail Confirmation & QR Gate Pass:**
   - Real-time branded HTML Matchday Ticket dispatched automatically to the player's Gmail upon booking.
   - Contains official booking reference (`#BK-xxxx`), arena details, date/time, and a high-resolution scannable QR Gate Pass.
   - In-app Gmail preview popup to view the dispatched ticket instantly.

4. **☀️ Day View & 🌙 Night Floodlights Interactive Switcher:**
   - Hero banner featuring real facility images (`assets/images/shashikant-turf-day.jpg` and `assets/images/shashikant-turf-night.jpg`) with smooth interactive lighting toggle.

5. **📅 21-Day Dynamic Ribbon & Calendar Picker:**
   - Instant date selection for up to 3 weeks ahead, plus `<input type="date">` for any future matchday up to 90 days.

6. **🤝 Community Matchmaking Lobby ("Find Opponent / Need Players"):**
   - Players can list their match as an open challenge or recruit missing players.
   - 1-click WhatsApp connect button for fast squad coordination.

7. **🎟️ Venue Gate Pass Scanner & Check-In Verification:**
   - Admin security staff can scan or enter a Booking ID to verify tickets in MySQL.
   - 1-click "Confirm & Check-In Player" button updates `check_in_status` in real time.

---

## 🗄️ MySQL Database Architecture (`shashikant_turf`)

The database is structured to track all player activity and administrative logs:

### 1. `users` Table (Signups)
```sql
CREATE TABLE users (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    email VARCHAR(100) NOT NULL UNIQUE,
    phone VARCHAR(20) DEFAULT '+91 98765 00000',
    password VARCHAR(255) NOT NULL,
    role ENUM('user', 'admin') DEFAULT 'user',
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    last_login TIMESTAMP NULL
);
```

### 2. `turfs` Table (Venues)
```sql
CREATE TABLE turfs (
    id VARCHAR(50) PRIMARY KEY,
    name VARCHAR(100) NOT NULL,
    sport VARCHAR(50) NOT NULL,
    category VARCHAR(50) NOT NULL,
    size VARCHAR(50) NOT NULL,
    location VARCHAR(100) NOT NULL,
    price_per_hour DECIMAL(10, 2) NOT NULL DEFAULT 699.00,
    rating DECIMAL(2, 1) DEFAULT 4.9,
    roof_type VARCHAR(100) DEFAULT 'Covered Arena (100% Rain Protected)',
    image VARCHAR(255),
    description TEXT,
    amenities JSON,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 3. `bookings` Table (Reservations & QR Passes)
```sql
CREATE TABLE bookings (
    id VARCHAR(50) PRIMARY KEY,
    turf_id VARCHAR(50) NOT NULL,
    turf_name VARCHAR(100) NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    user_email VARCHAR(100) NOT NULL,
    user_phone VARCHAR(20) DEFAULT '+91 98765 43210',
    booking_date DATE NOT NULL,
    slot VARCHAR(50) NOT NULL,
    base_price DECIMAL(10, 2) NOT NULL DEFAULT 699.00,
    gst DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    platform_fee DECIMAL(10, 2) NOT NULL DEFAULT 0.00,
    amount DECIMAL(10, 2) NOT NULL DEFAULT 699.00,
    payment_method VARCHAR(50) DEFAULT 'UPI',
    status ENUM('Confirmed', 'Cancelled') DEFAULT 'Confirmed',
    slot_type VARCHAR(50) DEFAULT 'Standard',
    check_in_status ENUM('Pending', 'Checked-In') DEFAULT 'Pending',
    check_in_time TIMESTAMP NULL,
    is_open_match BOOLEAN DEFAULT FALSE,
    match_type VARCHAR(100) NULL,
    match_note VARCHAR(255) NULL,
    created_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    cancelled_at TIMESTAMP NULL
);
```

### 4. `cancellations` Table (Audit & Refunds)
```sql
CREATE TABLE cancellations (
    id INT AUTO_INCREMENT PRIMARY KEY,
    booking_id VARCHAR(50) NOT NULL,
    user_name VARCHAR(100) NOT NULL,
    user_email VARCHAR(100) NOT NULL,
    turf_name VARCHAR(100) NOT NULL,
    booking_date DATE NOT NULL,
    slot VARCHAR(50) NOT NULL,
    refund_amount DECIMAL(10, 2) NOT NULL DEFAULT 699.00,
    reason TEXT,
    cancelled_at TIMESTAMP DEFAULT CURRENT_TIMESTAMP
);
```

### 5. `login_logs` Table (Auth Activity)
```sql
CREATE TABLE login_logs (
    id INT AUTO_INCREMENT PRIMARY KEY,
    user_id VARCHAR(50),
    name VARCHAR(100),
    email VARCHAR(100) NOT NULL,
    role VARCHAR(20) DEFAULT 'user',
    login_time TIMESTAMP DEFAULT CURRENT_TIMESTAMP,
    ip_address VARCHAR(50) DEFAULT '127.0.0.1',
    status VARCHAR(20) DEFAULT 'SUCCESS'
);
```

---

## 🚀 How to Run

### Step 1: Start Backend Server
Double-click `run-backend.bat` or run in terminal:
```bash
node backend/server.js
```
The server will start on `http://localhost:5000` and automatically connect to MySQL `shashikant_turf`.

### Step 2: Open Frontend
Open `index.html` directly in your browser or serve it via Live Server:
- **Home**: `http://localhost:5000/` or `index.html`
- **Explore Turfs**: `turfs.html`
- **Book Slot**: `turf-details.html?id=TRF-101`
- **Checkout & Payment**: `checkout.html`
- **My Bookings & QR Gate Pass**: `my-bookings.html`
- **Admin Dashboard & Scanner**: `Admin/dashboard.html`

---

## 👥 Default Accounts

- **Admin Manager**: `admin@turf.com` / `admin`
- **Player**: `rohan@gmail.com` / `123`
