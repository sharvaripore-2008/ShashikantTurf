const express = require('express');
const router = express.Router();
const db = require('../config/db');
const emailService = require('../utils/emailService');

// @route   GET /api/bookings/slots
// @desc    Get all booked slots for a specific turf and date (Prevents double bookings!)
router.get('/slots', async (req, res) => {
  try {
    const { turfId, date } = req.query;
    if (!turfId || !date) {
      return res.status(400).json({ success: false, message: 'turfId and date query parameters are required' });
    }

    const bookedSlots = await db.getBookedSlots(turfId, date);
    res.json({ success: true, turfId, date, bookedSlots });
  } catch (error) {
    console.error('Error fetching booked slots:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   GET /api/bookings/admin/stats
// @desc    Calculate real-time KPI stats for Admin Dashboard
router.get('/admin/stats', async (req, res) => {
  try {
    const stats = await db.getAdminStats();
    res.json({ success: true, stats });
  } catch (error) {
    console.error('Stats calculation error:', error);
    res.status(500).json({ success: false, message: 'Failed to calculate stats' });
  }
});

// @route   GET /api/bookings/cancellations
// @desc    Get all cancelled bookings log (Kisne kisne cancel ki hai)
router.get('/cancellations', async (req, res) => {
  try {
    const cancellations = await db.getCancellations(50);
    res.json({ success: true, count: cancellations.length, data: cancellations });
  } catch (error) {
    console.error('Error fetching cancellations:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve cancellations' });
  }
});

// @route   GET /api/bookings
// @desc    Get all bookings (or filter by userEmail) - (Kisne kisne booking ki hai)
router.get('/', async (req, res) => {
  try {
    const { userEmail } = req.query;
    const list = await db.getBookings(userEmail);
    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    console.error('Error retrieving bookings:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve bookings' });
  }
});

// @route   GET /api/bookings/open-matches
// @desc    Get all community open matches looking for opponents or players
router.get('/open-matches', async (req, res) => {
  try {
    const list = await db.getOpenMatches();
    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    console.error('Error fetching open matches:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve open matches' });
  }
});

// @route   GET /api/bookings/verify/:id
// @desc    Verify QR Code / Match Ticket for venue manager
router.get('/verify/:id', async (req, res) => {
  try {
    const booking = await db.getBookingById(req.params.id);
    if (!booking) {
      return res.status(404).json({ success: false, message: 'Invalid Ticket: Booking ID not found in database' });
    }
    res.json({ success: true, valid: true, data: booking });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Verification failed' });
  }
});

// @route   PATCH /api/bookings/:id/checkin
// @desc    Mark ticket as Checked-In at venue
router.patch('/:id/checkin', async (req, res) => {
  try {
    const updated = await db.checkInBooking(req.params.id);
    if (!updated) {
      return res.status(404).json({ success: false, message: 'Booking ID not found' });
    }
    res.json({
      success: true,
      message: 'Match Ticket verified! Customer successfully marked as Checked-In.',
      booking: updated
    });
  } catch (error) {
    res.status(500).json({ success: false, message: 'Failed to check-in ticket' });
  }
});

// @route   POST /api/bookings
// @desc    Reserve a new slot (Saves into MySQL 'bookings' table)
router.post('/', async (req, res) => {
  try {
    const {
      turfId, date, slot, userName, userEmail, userPhone,
      paymentMethod, customBasePrice, slotType, isOpenMatch, matchType, matchNote
    } = req.body;

    if (!turfId || !date || !slot) {
      return res.status(400).json({ success: false, message: 'turfId, date and slot are required' });
    }

    const turf = await db.getTurfById(turfId);
    if (!turf) {
      return res.status(404).json({ success: false, message: 'Turf venue not found' });
    }

    // 1. Check double booking in MySQL
    const bookedSlots = await db.getBookedSlots(turfId, date);
    if (bookedSlots.includes(slot)) {
      return res.status(409).json({
        success: false,
        message: `This slot (${slot}) is already booked on ${date}. Please choose another slot!`
      });
    }

    // 2. Fixed 1 Hour rate = ₹699
    const base = Number(customBasePrice) > 0 ? Number(customBasePrice) : 699;
    const gst = 0; // Flat ₹699 inclusive or transparent
    const platformFee = 0;
    const totalAmount = base;

    const newBooking = {
      id: 'BK-' + Math.floor(1000 + Math.random() * 9000),
      turfId: turf.id,
      turfName: turf.name,
      userName: userName ? userName.trim() : 'Player',
      userEmail: userEmail ? userEmail.trim().toLowerCase() : 'player@gmail.com',
      userPhone: userPhone ? userPhone.trim() : '+91 98765 43210',
      date: date,
      slot: slot,
      basePrice: base,
      gst: gst,
      platformFee: platformFee,
      amount: totalAmount,
      paymentMethod: paymentMethod || 'UPI (Google Pay / PhonePe)',
      status: 'Confirmed',
      slotType: slotType || 'Standard',
      checkInStatus: 'Pending',
      isOpenMatch: isOpenMatch ? 1 : 0,
      matchType: matchType || null,
      matchNote: matchNote || null
    };

    await db.addBooking(newBooking);

    // Send confirmation to user's Gmail
    let emailStatus = null;
    try {
      emailStatus = await emailService.sendBookingConfirmationEmail(newBooking);
    } catch (mailErr) {
      console.warn('Email dispatch notice:', mailErr.message);
    }

    res.status(201).json({
      success: true,
      message: `Slot booked successfully! Confirmation receipt sent to ${newBooking.userEmail}`,
      booking: newBooking,
      emailNotification: emailStatus
    });
  } catch (error) {
    console.error('Booking error:', error);
    res.status(500).json({ success: false, message: 'Internal server error while reserving slot' });
  }
});

// @route   PATCH /api/bookings/:id/cancel
// @desc    Cancel an existing reservation (Updates MySQL 'bookings' & logs into 'cancellations')
router.patch('/:id/cancel', async (req, res) => {
  try {
    const reason = req.body && req.body.reason ? req.body.reason : 'Player requested cancellation';
    const updated = await db.cancelBooking(req.params.id, reason);

    if (!updated) {
      return res.status(404).json({ success: false, message: 'Booking ID not found' });
    }

    res.json({
      success: true,
      message: 'Booking cancelled successfully. Refund initiated and logged to cancellations table.',
      booking: updated
    });
  } catch (error) {
    console.error('Cancel booking error:', error);
    res.status(500).json({ success: false, message: 'Failed to cancel booking' });
  }
});

module.exports = router;
