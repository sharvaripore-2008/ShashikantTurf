/**
 * Shashikant Turf - Central API Client & LocalStorage Sync Layer
 * Connects Frontend directly to Node.js Backend & MySQL,
 * and maintains seamless synchronization with browser LocalStorage.
 */

const API_BASE_URL = (typeof window !== 'undefined')
  ? (window.location.port === '5000' 
      ? '/api' 
      : `${window.location.protocol}//${window.location.hostname || 'localhost'}:5000/api`)
  : 'http://localhost:5000/api';

const API = {
  // Check if backend is alive
  async isBackendLive() {
    try {
      const res = await fetch(`${API_BASE_URL}/health`, { signal: AbortSignal.timeout(2000) });
      const data = await res.json();
      return { online: res.ok, database: data.database || 'Unknown' };
    } catch (e) {
      return { online: false, database: 'Offline' };
    }
  },

  // ================= AUTHENTICATION (MySQL 'users' & 'login_logs') =================
  async login(email, password, role = 'user') {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ email, password, role })
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Login failed');

      // Sync user session to localStorage
      if (data.user) {
        localStorage.setItem('current_user', JSON.stringify(data.user));
        localStorage.setItem('SHASHIKANT_USER', JSON.stringify(data.user));
      }
      return data;
    } catch (err) {
      console.warn('Backend login fallback to localStorage:', err.message);
      // Fallback local user object
      const fallbackUser = {
        id: role === 'admin' ? 'ADM-01' : 'USR-101',
        name: role === 'admin' ? 'Admin Manager' : email.split('@')[0],
        email: email,
        role: role
      };
      localStorage.setItem('current_user', JSON.stringify(fallbackUser));
      localStorage.setItem('SHASHIKANT_USER', JSON.stringify(fallbackUser));
      return { success: true, message: `Welcome back, ${fallbackUser.name}! (Offline mode)`, user: fallbackUser };
    }
  },

  async register(userData) {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/register`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(userData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Registration failed');

      // Sync user session to localStorage
      if (data.user) {
        localStorage.setItem('current_user', JSON.stringify(data.user));
        localStorage.setItem('SHASHIKANT_USER', JSON.stringify(data.user));
      }
      return data;
    } catch (err) {
      console.warn('Backend register fallback to localStorage:', err.message);
      const fallbackUser = {
        id: 'USR-' + Math.floor(1000 + Math.random() * 9000),
        name: userData.name,
        email: userData.email,
        phone: userData.phone || '+91 98765 00000',
        role: userData.role || 'user'
      };
      localStorage.setItem('current_user', JSON.stringify(fallbackUser));
      localStorage.setItem('SHASHIKANT_USER', JSON.stringify(fallbackUser));
      return { success: true, message: 'Registered locally (Offline mode)', user: fallbackUser };
    }
  },

  getCurrentUser() {
    const raw = localStorage.getItem('current_user') || localStorage.getItem('SHASHIKANT_USER');
    if (raw) {
      try { return JSON.parse(raw); } catch (e) { return null; }
    }
    return null;
  },

  logout() {
    localStorage.removeItem('current_user');
    localStorage.removeItem('SHASHIKANT_USER');
    window.location.href = window.location.pathname.includes('/Admin/') ? '../index.html' : 'index.html';
  },

  async getLoginLogs() {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/login-logs`);
      const data = await res.json();
      if (data.success) return data.data;
      return [];
    } catch (e) {
      return [];
    }
  },

  async getUsers() {
    try {
      const res = await fetch(`${API_BASE_URL}/auth/users`);
      const data = await res.json();
      if (data.success) return data.data;
      return [];
    } catch (e) {
      return [];
    }
  },

  // ================= TURFS =================
  async getTurfs(filters = {}) {
    try {
      const query = new URLSearchParams(filters).toString();
      const res = await fetch(`${API_BASE_URL}/turfs?${query}`);
      const data = await res.json();
      if (data.success) {
        localStorage.setItem('SHASHIKANT_TURFS', JSON.stringify(data.data));
        return data.data;
      }
      throw new Error(data.message);
    } catch (err) {
      console.warn('Using LocalStorage turfs fallback:', err.message);
      if (typeof DB !== 'undefined') return DB.getTurfs();
      const local = localStorage.getItem('SHASHIKANT_TURFS');
      return local ? JSON.parse(local) : [];
    }
  },

  async getTurfById(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/turfs/${id}`);
      const data = await res.json();
      if (data.success) return data.data;
      throw new Error(data.message);
    } catch (err) {
      if (typeof DB !== 'undefined') return DB.getTurfById(id);
      const turfs = await this.getTurfs();
      return turfs.find(t => t.id === id) || null;
    }
  },

  async addTurf(turfData) {
    try {
      const res = await fetch(`${API_BASE_URL}/turfs`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(turfData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Failed to add turf');
      return data;
    } catch (err) {
      if (typeof DB !== 'undefined') {
        const list = DB.getTurfs();
        list.unshift(turfData);
        DB.saveTurfs(list);
        return { success: true, data: turfData };
      }
      return { success: false, message: err.message };
    }
  },

  async deleteTurf(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/turfs/${id}`, { method: 'DELETE' });
      const data = await res.json();
      return data;
    } catch (err) {
      if (typeof DB !== 'undefined') {
        DB.saveTurfs(DB.getTurfs().filter(t => t.id !== id));
        return { success: true };
      }
      return { success: false, message: err.message };
    }
  },

  // ================= BOOKINGS (MySQL 'bookings' & 'cancellations') =================
  async getBookedSlots(turfId, date) {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings/slots?turfId=${turfId}&date=${date}`);
      const data = await res.json();
      if (data.success) return data.bookedSlots || [];
      return [];
    } catch (err) {
      if (typeof DB !== 'undefined') {
        return DB.getBookings()
          .filter(b => b.turfId === turfId && b.date === date && b.status !== 'Cancelled')
          .map(b => b.slot);
      }
      return [];
    }
  },

  async createBooking(bookingData) {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings`, {
        method: 'POST',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify(bookingData)
      });
      const data = await res.json();
      if (!res.ok) throw new Error(data.message || 'Slot booking failed');

      // Sync with localStorage
      const saved = data.booking || bookingData;
      let existing = JSON.parse(localStorage.getItem('booking_data') || '[]');
      existing.unshift(saved);
      localStorage.setItem('booking_data', JSON.stringify(existing));
      localStorage.setItem('SHASHIKANT_BOOKINGS', JSON.stringify(existing));

      // Sync to Firebase Cloud Firestore if active
      if (typeof FirebaseService !== 'undefined' && FirebaseService.isReady()) {
        FirebaseService.saveBooking(saved).catch(console.warn);
      }

      return data;
    } catch (err) {
      console.warn('Backend booking failed, syncing to local storage & Firebase:', err.message);
      // Fallback save to localStorage
      let existing = JSON.parse(localStorage.getItem('booking_data') || '[]');
      existing.unshift(bookingData);
      localStorage.setItem('booking_data', JSON.stringify(existing));
      localStorage.setItem('SHASHIKANT_BOOKINGS', JSON.stringify(existing));

      // Sync to Firebase Cloud Firestore
      if (typeof FirebaseService !== 'undefined' && FirebaseService.isReady()) {
        FirebaseService.saveBooking(bookingData).catch(console.warn);
      }

      return { success: true, booking: bookingData, isLocalFallback: true };
    }
  },

  async getBookings(userEmail = null) {
    try {
      const query = userEmail ? `?userEmail=${encodeURIComponent(userEmail)}` : '';
      const res = await fetch(`${API_BASE_URL}/bookings${query}`);
      const data = await res.json();
      if (data.success) {
        // Sync to localStorage
        localStorage.setItem('booking_data', JSON.stringify(data.data));
        localStorage.setItem('SHASHIKANT_BOOKINGS', JSON.stringify(data.data));
        return data.data;
      }
      throw new Error(data.message);
    } catch (err) {
      console.warn('Backend unavailable, checking Firebase or LocalStorage:', err.message);
      // Try Cloud Firestore first
      if (typeof FirebaseService !== 'undefined' && FirebaseService.isReady()) {
        try {
          const cloudBookings = await FirebaseService.getBookings();
          if (cloudBookings && cloudBookings.length > 0) {
            return userEmail
              ? cloudBookings.filter(b => (b.userEmail || '').toLowerCase() === userEmail.toLowerCase())
              : cloudBookings;
          }
        } catch (fbErr) {
          console.warn('Firebase getBookings fallback:', fbErr.message);
        }
      }

      let local = JSON.parse(localStorage.getItem('booking_data') || localStorage.getItem('SHASHIKANT_BOOKINGS') || '[]');
      if (userEmail) {
        local = local.filter(b => (b.userEmail || '').toLowerCase() === userEmail.toLowerCase());
      }
      return local;
    }
  },

  async cancelBooking(id, reason = 'Player requested cancellation') {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings/${id}/cancel`, {
        method: 'PATCH',
        headers: { 'Content-Type': 'application/json' },
        body: JSON.stringify({ reason })
      });
      const data = await res.json();

      // Sync status to localStorage
      let list = JSON.parse(localStorage.getItem('booking_data') || '[]');
      const item = list.find(b => b.id === id);
      if (item) {
        item.status = 'Cancelled';
        localStorage.setItem('booking_data', JSON.stringify(list));
        localStorage.setItem('SHASHIKANT_BOOKINGS', JSON.stringify(list));
      }

      // Sync status to Firebase Cloud Firestore
      if (typeof FirebaseService !== 'undefined' && FirebaseService.isReady()) {
        FirebaseService.cancelBooking(id).catch(console.warn);
      }

      return data;
    } catch (err) {
      console.warn('Backend cancel failed, updating locally & Firebase:', err.message);
      let list = JSON.parse(localStorage.getItem('booking_data') || '[]');
      const item = list.find(b => b.id === id);
      if (item) {
        item.status = 'Cancelled';
        localStorage.setItem('booking_data', JSON.stringify(list));
        localStorage.setItem('SHASHIKANT_BOOKINGS', JSON.stringify(list));

        if (typeof FirebaseService !== 'undefined' && FirebaseService.isReady()) {
          FirebaseService.cancelBooking(id).catch(console.warn);
        }

        return { success: true, message: 'Cancelled in local storage & Firebase' };
      }
      return { success: false, message: 'Booking ID not found' };
    }
  },

  async getCancellations() {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings/cancellations`);
      const data = await res.json();
      if (data.success) return data.data;
      return [];
    } catch (e) {
      return [];
    }
  },

  // ================= MATCHMAKING & CHECK-IN VERIFICATION =================
  async getOpenMatches() {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings/open-matches`);
      const data = await res.json();
      if (data.success) return data.data || [];
      return [];
    } catch (e) {
      // Local fallback
      const list = JSON.parse(localStorage.getItem('booking_data') || '[]');
      return list.filter(b => b.isOpenMatch && b.status !== 'Cancelled');
    }
  },

  async verifyTicket(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings/verify/${id}`);
      return await res.json();
    } catch (e) {
      const list = JSON.parse(localStorage.getItem('booking_data') || '[]');
      const match = list.find(b => b.id === id);
      if (match) return { success: true, valid: true, data: match };
      return { success: false, message: 'Ticket ID not found' };
    }
  },

  async checkInTicket(id) {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings/${id}/checkin`, { method: 'PATCH' });
      const data = await res.json();
      // Update local storage
      const list = JSON.parse(localStorage.getItem('booking_data') || '[]');
      const item = list.find(b => b.id === id);
      if (item) {
        item.checkInStatus = 'Checked-In';
        item.checkInTime = new Date().toISOString();
        localStorage.setItem('booking_data', JSON.stringify(list));
      }
      return data;
    } catch (e) {
      const list = JSON.parse(localStorage.getItem('booking_data') || '[]');
      const item = list.find(b => b.id === id);
      if (item) {
        item.checkInStatus = 'Checked-In';
        item.checkInTime = new Date().toISOString();
        localStorage.setItem('booking_data', JSON.stringify(list));
        return { success: true, message: 'Checked-in locally' };
      }
      return { success: false, message: 'Ticket not found' };
    }
  },

  async getAdminStats() {
    try {
      const res = await fetch(`${API_BASE_URL}/bookings/admin/stats`);
      const data = await res.json();
      if (data.success) return data.stats;
      throw new Error(data.message);
    } catch (err) {
      let bookings = JSON.parse(localStorage.getItem('booking_data') || '[]');
      let turfs = JSON.parse(localStorage.getItem('SHASHIKANT_TURFS') || '[]');
      return {
        totalRevenue: bookings.filter(b => b.status !== 'Cancelled').reduce((s, b) => s + (Number(b.amount) || 0), 0),
        totalBookings: bookings.length,
        todayBookings: bookings.filter(b => b.date === new Date().toISOString().split('T')[0]).length,
        activeTurfs: turfs.length,
        cancelledBookings: bookings.filter(b => b.status === 'Cancelled').length
      };
    }
  }
};

window.API = API;
