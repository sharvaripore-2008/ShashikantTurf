// Shashikant Turf - Core DB & State Layer (Synchronized at ₹699/hr)
const DEFAULT_TURFS = [
  {
    id: 'TRF-101',
    name: "Shashikant Football Grand Arena",
    sport: "Football",
    category: "football",
    size: "7v7 FIFA Artificial Turf",
    location: "Andheri West, Mumbai",
    pricePerHour: 699,
    rating: 4.9,
    roofType: "Open-Air Arena (All-Weather Drainage)",
    image: "assets/images/shashikant-turf-day.jpg",
    description: "Official Shashikant Turf FIFA standard 7-a-side football ground equipped with stadium floodlights, dugout seating, clean shower changing rooms, and free player parking.",
    amenities: ["Stadium Floodlights", "Changing Rooms", "Free Parking", "Drinking Water", "Dugout Seating"]
  },
  {
    id: 'TRF-102',
    name: "Shashikant Box Cricket Stadium",
    sport: "Cricket",
    category: "cricket",
    size: "6v6 Box Cricket Pitch",
    location: "Bandra West, Mumbai",
    pricePerHour: 699,
    rating: 4.9,
    roofType: "Covered Arena (100% Rain Protected)",
    image: "assets/images/shashikant-turf-night.jpg",
    description: "High-voltage box cricket arena in Mumbai with high bounce safety netting, ultra-bright LED match floodlights, equipment rental, and live scoreboard.",
    amenities: ["Night Floodlights", "Box Netting", "Cafeteria", "Equipment Rental", "Music System"]
  },
  {
    id: 'TRF-103',
    name: "Shashikant Multisport Arena",
    sport: "Multisport",
    category: "multisport",
    size: "6v6 Dual Football & Cricket",
    location: "Powai, Mumbai",
    pricePerHour: 699,
    rating: 4.8,
    roofType: "Covered Arena (100% Rain Protected)",
    image: "assets/images/shashikant-turf-day.jpg",
    description: "Versatile indoor/outdoor arena suited for corporate leagues, weekend football matches, and tennis ball box cricket tournaments.",
    amenities: ["Scoreboard", "First Aid", "Locker Room", "Spectator Stand", "CCTV Security"]
  },
  {
    id: 'TRF-104',
    name: "Shashikant Night Floodlit Stadium",
    sport: "Football",
    category: "football",
    size: "8v8 Full Turf",
    location: "Kandivali East, Mumbai",
    pricePerHour: 699,
    rating: 5.0,
    roofType: "Open-Air Arena (All-Weather Drainage)",
    image: "assets/images/shashikant-turf-night.jpg",
    description: "Full-scale 8-a-side professional arena featuring imported Dutch synthetic grass, high mast lighting, tournament commentary desk, and referee lounge.",
    amenities: ["Tournament Ready", "Warmup Track", "Shower Rooms", "Cafeteria", "VIP Lounge"]
  }
];

const DEFAULT_BOOKINGS = [
  {
    id: "BK-8291",
    turfId: "TRF-101",
    turfName: "Shashikant Football Grand Arena",
    userName: "Rahul Sharma",
    userEmail: "rahul@gmail.com",
    userPhone: "+91 98200 11223",
    date: new Date().toISOString().split('T')[0],
    slot: "07:00 PM - 08:00 PM",
    amount: 699,
    paymentMethod: "UPI (Google Pay)",
    status: "Confirmed",
    checkInStatus: "Pending",
    isOpenMatch: true,
    matchType: "Need Opponent Team",
    matchNote: "Looking for friendly 7v7 football team for weekend match!"
  },
  {
    id: "BK-8292",
    turfId: "TRF-102",
    turfName: "Shashikant Box Cricket Stadium",
    userName: "Aditya Patil",
    userEmail: "aditya@patil.com",
    userPhone: "+91 98190 44556",
    date: new Date().toISOString().split('T')[0],
    slot: "08:00 PM - 09:00 PM",
    amount: 699,
    paymentMethod: "Credit Card",
    status: "Confirmed",
    checkInStatus: "Checked-In",
    isOpenMatch: true,
    matchType: "Need 3 Players",
    matchNote: "Box Cricket match - need 3 players/batsmen!"
  }
];

const DB = {
  getTurfs() {
    const raw = localStorage.getItem('SHASHIKANT_TURFS');
    if (!raw) {
      localStorage.setItem('SHASHIKANT_TURFS', JSON.stringify(DEFAULT_TURFS));
      return DEFAULT_TURFS;
    }
    try {
      const parsed = JSON.parse(raw);
      // Auto-upgrade price to 699 if older cache found
      if (parsed.length && parsed[0].pricePerHour !== 699) {
        localStorage.setItem('SHASHIKANT_TURFS', JSON.stringify(DEFAULT_TURFS));
        return DEFAULT_TURFS;
      }
      return parsed;
    } catch (e) {
      return DEFAULT_TURFS;
    }
  },
  saveTurfs(turfs) {
    localStorage.setItem('SHASHIKANT_TURFS', JSON.stringify(turfs));
  },
  getTurfById(id) {
    return this.getTurfs().find(t => t.id === id);
  },
  getBookings() {
    const raw = localStorage.getItem('SHASHIKANT_BOOKINGS');
    if (!raw) {
      localStorage.setItem('SHASHIKANT_BOOKINGS', JSON.stringify(DEFAULT_BOOKINGS));
      return DEFAULT_BOOKINGS;
    }
    try { return JSON.parse(raw); } catch (e) { return DEFAULT_BOOKINGS; }
  },
  saveBookings(bookings) {
    localStorage.setItem('SHASHIKANT_BOOKINGS', JSON.stringify(bookings));
    localStorage.setItem('booking_data', JSON.stringify(bookings));
  },
  addBooking(booking) {
    const list = this.getBookings();
    list.unshift(booking);
    this.saveBookings(list);
  },
  cancelBooking(id) {
    const list = this.getBookings();
    const item = list.find(b => b.id === id);
    if (item) {
      item.status = 'Cancelled';
      this.saveBookings(list);
    }
  },
  getCurrentUser() {
    const raw = localStorage.getItem('SHASHIKANT_USER') || localStorage.getItem('current_user');
    if (!raw) return { name: "Guest Player", email: "player@gmail.com", role: "user" };
    try { return JSON.parse(raw); } catch (e) { return null; }
  },
  setCurrentUser(user) {
    localStorage.setItem('SHASHIKANT_USER', JSON.stringify(user));
    localStorage.setItem('current_user', JSON.stringify(user));
  },
  logout() {
    localStorage.removeItem('SHASHIKANT_USER');
    localStorage.removeItem('current_user');
    window.location.href = window.location.pathname.includes('/Admin/') ? '../index.html' : 'index.html';
  }
};

function formatCurrency(amount) {
  return '₹' + (amount || 699).toLocaleString('en-IN');
}

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.style.position = 'fixed';
  toast.style.bottom = '24px';
  toast.style.right = '24px';
  toast.style.padding = '14px 22px';
  toast.style.borderRadius = '10px';
  toast.style.zIndex = '99999';
  toast.style.color = '#fff';
  toast.style.fontFamily = 'Outfit, sans-serif';
  toast.style.fontWeight = '600';
  toast.style.fontSize = '0.95rem';
  toast.style.boxShadow = '0 10px 30px rgba(0,0,0,0.5)';
  toast.style.display = 'flex';
  toast.style.alignItems = 'center';
  toast.style.gap = '10px';
  toast.style.animation = 'slideUpToast 0.3s cubic-bezier(0.16, 1, 0.3, 1)';

  if (type === 'success') toast.style.background = 'linear-gradient(135deg, #10b981, #059669)';
  else if (type === 'error') toast.style.background = 'linear-gradient(135deg, #ef4444, #dc2626)';
  else if (type === 'warning') toast.style.background = 'linear-gradient(135deg, #f59e0b, #d97706)';
  else toast.style.background = 'linear-gradient(135deg, #3b82f6, #2563eb)';

  toast.innerHTML = `<span>${type === 'success' ? '✅' : (type === 'error' ? '⚠️' : 'ℹ️')}</span> <span>${message}</span>`;
  document.body.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    toast.style.transition = 'all 0.3s ease';
    setTimeout(() => toast.remove(), 350);
  }, 3400);
}
