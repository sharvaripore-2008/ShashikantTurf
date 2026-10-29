const express = require('express');
const router = express.Router();
const db = require('../config/db');

// @route   GET /api/turfs
// @desc    Get all turfs with optional query filters (sport, search, maxPrice)
router.get('/', async (req, res) => {
  try {
    let list = await db.getTurfs();
    const { sport, search, maxPrice } = req.query;

    if (search) {
      const q = search.toLowerCase();
      list = list.filter(t => t.name.toLowerCase().includes(q) || t.location.toLowerCase().includes(q));
    }

    if (sport && sport !== 'all') {
      const s = sport.toLowerCase();
      list = list.filter(t => (t.category || '').toLowerCase() === s || (t.sport || '').toLowerCase().includes(s));
    }

    if (maxPrice) {
      const limit = parseInt(maxPrice, 10);
      if (!isNaN(limit)) {
        list = list.filter(t => t.pricePerHour <= limit);
      }
    }

    res.json({ success: true, count: list.length, data: list });
  } catch (error) {
    console.error('Error fetching turfs:', error);
    res.status(500).json({ success: false, message: 'Failed to retrieve turfs' });
  }
});

// @route   GET /api/turfs/:id
// @desc    Get single turf by ID
router.get('/:id', async (req, res) => {
  try {
    const turf = await db.getTurfById(req.params.id);
    if (!turf) {
      return res.status(404).json({ success: false, message: 'Turf not found' });
    }
    res.json({ success: true, data: turf });
  } catch (error) {
    console.error('Error fetching turf by id:', error);
    res.status(500).json({ success: false, message: 'Server error' });
  }
});

// @route   POST /api/turfs
// @desc    Add a new turf arena (Admin)
router.post('/', async (req, res) => {
  try {
    const { name, sport, size, location, pricePerHour, image, description, amenities } = req.body;

    if (!name || !pricePerHour || !location) {
      return res.status(400).json({ success: false, message: 'Name, pricePerHour, and location are required' });
    }

    const newTurf = {
      id: 'TRF-' + Math.floor(100 + Math.random() * 900),
      name: name.trim(),
      sport: sport === 'football' ? 'Football' : (sport === 'cricket' ? 'Cricket' : 'Multisport'),
      category: (sport || 'football').toLowerCase(),
      size: size ? size.trim() : '7v7',
      location: location.trim(),
      pricePerHour: parseInt(pricePerHour, 10),
      rating: 5.0,
      image: image || 'https://images.unsplash.com/photo-1529900241929-5ed53a0f33dd?auto=format&fit=crop&w=800&q=80',
      description: description || 'Modern sports arena.',
      amenities: Array.isArray(amenities) && amenities.length ? amenities : ["Floodlights", "Locker Room", "Free Parking"]
    };

    await db.addTurf(newTurf);
    res.status(201).json({ success: true, message: 'Turf added successfully to database', data: newTurf });
  } catch (error) {
    console.error('Error adding turf:', error);
    res.status(500).json({ success: false, message: 'Failed to add turf' });
  }
});

// @route   DELETE /api/turfs/:id
// @desc    Delete turf venue (Admin)
router.delete('/:id', async (req, res) => {
  try {
    const turf = await db.getTurfById(req.params.id);
    if (!turf) {
      return res.status(404).json({ success: false, message: 'Turf not found' });
    }
    await db.deleteTurf(req.params.id);
    res.json({ success: true, message: 'Turf venue deleted successfully' });
  } catch (error) {
    console.error('Error deleting turf:', error);
    res.status(500).json({ success: false, message: 'Failed to delete turf' });
  }
});

module.exports = router;
