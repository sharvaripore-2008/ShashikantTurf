/**
 * Booking Schema Definition
 * Stores time slot reservations, tax breakdown & payment state
 */
const BookingSchema = {
  id: { type: String, required: true, unique: true }, // e.g. BK-8291
  turfId: { type: String, required: true },
  turfName: { type: String, required: true },
  userName: { type: String, required: true },
  userEmail: { type: String, required: true },
  userPhone: { type: String, required: true },
  date: { type: String, required: true }, // YYYY-MM-DD
  slot: { type: String, required: true }, // e.g. "07:00 PM - 08:00 PM"
  basePrice: { type: Number, required: true },
  gst: { type: Number, required: true }, // 18% GST
  platformFee: { type: Number, default: 50 },
  amount: { type: Number, required: true }, // Total = base + gst + platformFee
  paymentMethod: { type: String, default: 'UPI' },
  status: { type: String, enum: ['Confirmed', 'Cancelled'], default: 'Confirmed' },
  createdAt: { type: Date, default: Date.now }
};

module.exports = BookingSchema;

