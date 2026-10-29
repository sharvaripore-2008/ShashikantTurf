/**
 * Turf Schema Definition
 * Represents sports arenas & pitch configurations
 */
const TurfSchema = {
  id: { type: String, required: true, unique: true },
  name: { type: String, required: true },
  sport: { type: String, required: true }, // e.g. Football, Cricket, Multisport
  category: { type: String, required: true }, // e.g. football, cricket, multisport
  size: { type: String, default: '7v7' }, // e.g. 5v5, 7v7, 8v8 FIFA
  location: { type: String, required: true },
  pricePerHour: { type: Number, required: true },
  rating: { type: Number, default: 5.0 },
  image: { type: String, required: true },
  description: { type: String, default: '' },
  amenities: { type: [String], default: ["Floodlights", "Locker Room", "Free Parking"] },
  createdAt: { type: Date, default: Date.now }
};

module.exports = TurfSchema;

