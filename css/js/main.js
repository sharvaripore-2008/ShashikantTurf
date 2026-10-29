// Shashikant Turf - Core DB & State Layer
const DEFAULT_TURFS = [
  {
    id: 'TRF-101',
    name: "KickOff Grand Arena",
    sport: "Football",
    category: "football",
    size: "7v7 FIFA Artificial Turf",
    location: "Andheri West, Mumbai",
    pricePerHour: 1200,
    rating: 4.9,
    image: "https://images.unsplash.com/photo-1529900241929-5ed53a0f33dd?auto=format&fit=crop&w=800&q=80",
    description: "Premium FIFA standard 7-a-side artificial turf equipped with stadium floodlights, dugout seating, clean shower changing rooms, and free player parking.",
    amenities: ["Floodlights", "Changing Rooms", "Free Parking", "Drinking Water", "Dugout Seating"]
  },
  {
    id: 'TRF-102',
    name: "Skyline Rooftop Turf",
    sport: "Cricket",
    category: "cricket",
    size: "5v5 Box Cricket Pitch",
    location: "Bandra West, Mumbai",
    pricePerHour: 1500,
    rating: 4.8,
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?auto=format&fit=crop&w=800&q=80",
    description: "Spectacular rooftop box cricket turf in the heart of Bandra with high bounce safety netting, ultra-bright LED match floodlights, and refreshment lounge.",
    amenities: ["Night Floodlights", "Box Netting", "Cafeteria", "Equipment Rental", "Music System"]
  },
  {
    id: 'TRF-103',
    name: "Striker's Hub Multisport",
    sport: "Multisport",
    category: "multisport",
    size: "6v6 Dual Football & Cricket",
    location: "Powai, Mumbai",
    pricePerHour: 1000,
    rating: 4.7,
    image: "https://images.unsplash.com/photo-1551958219-acbc608c6377?auto=format&fit=crop&w=800&q=80",
    description: "Versatile indoor/outdoor arena suited for corporate leagues, weekend football matches, and tennis ball box cricket tournaments.",
    amenities: ["Scoreboard", "First Aid", "Locker Room", "Spectator Stand", "CCTV Security"]
  },
  {
    id: 'TRF-104',
    name: "Apex International Arena",
    sport: "Football",
    category: "football",
    size: "8v8 Full Turf",
    location: "Kandivali East, Mumbai",
    pricePerHour: 1800,
    rating: 5.0,
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?auto=format&fit=crop&w=800&q=80",
    description: "Full-scale 8-a-side professional arena featuring imported Dutch synthetic grass, high mast lighting, tournament commentary desk, and referee lounge.",
    amenities: ["Tournament Ready", "Warmup Track", "Shower Rooms", "Cafeteria", "VIP Lounge"]
  }
];

const DEFAULT_BOOKINGS = [
  {
    id: "BK-8291",
    turfId: "TRF-101",
    turfName: "KickOff Grand Arena",
    userName: "Rohan Sharma",
    userEmail: "rohan@gmail.com",
    userPhone: "+91 98200 11223",
    date: new Date().toISOString().split('T')[0],
    slot: "07:00 PM - 08:00 PM",
    amount: 1466,
    paymentMethod: "UPI (Google Pay)",
    status: "Confirmed"
  },
  {
    id: "BK-8292",
    turfId: "TRF-102",
    turfName: "Skyline Rooftop Turf",
    userName: "Aditya Patil",
    userEmail: "aditya@patil.com",
    userPhone: "+91 98190 44556",
    date: new Date().toISOString().split('T')[0],
    slot: "08:00 PM - 09:00 PM",
    amount: 1820,
    paymentMethod: "Credit Card",
    status: "Confirmed"
  },
  {
    id: "BK-8293",
    turfId: "TRF-103",
    turfName: "Striker's Hub Multisport",
    userName: "Siddhesh Kadam",
    userEmail: "siddhesh@kadam.com",
    userPhone: "+91 97680 99881",
    date: new Date().toISOString().split('T')[0],
    slot: "06:00 AM - 07:00 AM",
    amount: 1230,
    paymentMethod: "Pay at Venue",
    status: "Confirmed"
  },
  {
    id: "BK-8289",
    turfId: "TRF-104",
    turfName: "Apex International Arena",
    userName: "Vikram Rathi",
    userEmail: "vikram@rathi.com",
    userPhone: "+91 99200 33441",
    date: new Date(Date.now() - 86400000).toISOString().split('T')[0],
    slot: "09:00 PM - 10:00 PM",
    amount: 2174,
    paymentMethod: "UPI (PhonePe)",
    status: "Confirmed"
  },
  {
    id: "BK-8280",
    turfId: "TRF-101",
    turfName: "KickOff Grand Arena",
    userName: "Gaurav Mehta",
    userEmail: "gaurav@mehta.com",
    userPhone: "+91 98920 66778",
    date: new Date(Date.now() - 172800000).toISOString().split('T')[0],
    slot: "05:00 PM - 06:00 PM",
    amount: 1466,
    paymentMethod: "Net Banking",
    status: "Cancelled"
  }
];

const DB = {
  getTurfs() {
    const raw = localStorage.getItem('SHASHIKANT_TURFS');
    if (!raw) {
      localStorage.setItem('SHASHIKANT_TURFS', JSON.stringify(DEFAULT_TURFS));
      return DEFAULT_TURFS;
    }
    try { return JSON.parse(raw); } catch (e) { return DEFAULT_TURFS; }
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
    const raw = localStorage.getItem('SHASHIKANT_USER');
    if (!raw) return { name: "Guest Player", email: "player@turfarena.com", role: "user" };
    try { return JSON.parse(raw); } catch (e) { return null; }
  },
  setCurrentUser(user) {
    localStorage.setItem('SHASHIKANT_USER', JSON.stringify(user));
  },
  logout() {
    localStorage.removeItem('SHASHIKANT_USER');
    window.location.href = '../index.html';
  }
};

function formatCurrency(amount) {
  return '₹' + (amount || 0).toLocaleString('en-IN');
}

function showToast(message, type = 'info') {
  const toast = document.createElement('div');
  toast.style.position = 'fixed';
  toast.style.bottom = '24px';
  toast.style.right = '24px';
  toast.style.padding = '12px 20px';
  toast.style.borderRadius = '8px';
  toast.style.zIndex = '9999';
  toast.style.color = '#fff';
  toast.style.fontFamily = 'Outfit, sans-serif';
  toast.style.fontWeight = '600';
  toast.style.boxShadow = '0 8px 24px rgba(0,0,0,0.4)';
  toast.style.transition = 'all 0.3s ease';

  if (type === 'success') toast.style.background = '#10b981';
  else if (type === 'error') toast.style.background = '#ef4444';
  else if (type === 'warning') toast.style.background = '#f59e0b';
  else toast.style.background = '#3b82f6';

  toast.innerText = message;
  document.body.appendChild(toast);
  setTimeout(() => toast.remove(), 3200);
}
