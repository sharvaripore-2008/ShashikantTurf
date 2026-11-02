/**
 * ==========================================================================
 * SHASHIKANT TURF - CORE APPLICATION & DATABASE LAYER (V2)
 * Features 10 Full-Featured Arenas, HD Imagery, 21-Day Slot Engine,
 * Instant Gmail Confirmation with QR Gate Pass, and Interactive Matchmaking.
 * ==========================================================================
 */

// 10 OFFICIAL SHASHIKANT SPORTS ARENAS (MUMBAI)
const DEFAULT_TURFS = [
  {
    id: 'TRF-101',
    name: "Shashikant Football Grand Arena",
    sport: "Football",
    category: "football",
    size: "7v7 FIFA Pro Synthetic Grass",
    location: "Andheri West (Near Sports Complex), Mumbai",
    pricePerHour: 699,
    rating: 4.9,
    reviewsCount: 240,
    roofType: "Open-Air Stadium (All-Weather Drainage)",
    image: "https://images.unsplash.com/photo-1529900241451-b84742a174f8?w=1200&auto=format&fit=crop&q=80",
    fallbackImage: "assets/images/shashikant-turf-day.jpg",
    description: "Our flagship 7-a-side FIFA Pro certified synthetic turf. Engineered with shock-absorption rubber infill, 800W Phillips stadium floodlights, dugout seating, and full rain-drainage.",
    amenities: ["FIFA Pro 50mm Grass", "Stadium Floodlights", "Dugout Canopies", "Shower Rooms", "Free Valet Parking", "Chilled RO Water"],
    isFloodlit: true,
    isPopular: true
  },
  {
    id: 'TRF-102',
    name: "Shashikant Pro Box Cricket Arena",
    sport: "Cricket",
    category: "cricket",
    size: "6v6 Box Cricket Pitch & Cage",
    location: "Bandra Kurla Complex (BKC), Mumbai",
    pricePerHour: 699,
    rating: 4.9,
    reviewsCount: 310,
    roofType: "Covered Arena (100% Monsoon Protected)",
    image: "https://images.unsplash.com/photo-1531415074968-036ba1b575da?w=1200&auto=format&fit=crop&q=80",
    fallbackImage: "assets/images/shashikant-turf-night.jpg",
    description: "Premium high-bounce synthetic pitch with heavy-duty 35ft overhead safety netting. Equipped with ultra-bright non-glare LED lighting, digital scoreboard, and quality gear.",
    amenities: ["High-Bounce Pitch", "35ft Heavy Netting", "Digital Scoreboard", "Bat & Ball Rental", "Covered Roof Protection", "Surround Sound"],
    isFloodlit: true,
    isPopular: true
  },
  {
    id: 'TRF-103',
    name: "Shashikant Multisport 6v6 Arena",
    sport: "Multisport",
    category: "multisport",
    size: "Dual Football (6v6) & Box Cricket",
    location: "Juhu Tara Road (Near Beach), Mumbai",
    pricePerHour: 699,
    rating: 4.8,
    reviewsCount: 195,
    roofType: "Hybrid Covered Arena",
    image: "https://images.unsplash.com/photo-1574629810360-7efbbe195018?w=1200&auto=format&fit=crop&q=80",
    fallbackImage: "assets/images/shashikant-turf-day.jpg",
    description: "Versatile dual-marked arena that converts between 6v6 Football and Box Cricket in minutes. Ideal for corporate leagues, weekend friendlies, and group tournaments.",
    amenities: ["Dual Line Markings", "Quick-Switch Stumps & Goals", "Spectator Bleachers", "First Aid Station", "Refreshment Kiosk"],
    isFloodlit: true,
    isPopular: false
  },
  {
    id: 'TRF-104',
    name: "Shashikant Stadium Night Floodlit Ground",
    sport: "Football",
    category: "football",
    size: "8v8 Championship Turf",
    location: "Goregaon East (Off Western Express Highway), Mumbai",
    pricePerHour: 699,
    rating: 5.0,
    reviewsCount: 420,
    roofType: "Full Stadium Scale Open Arena",
    image: "https://images.unsplash.com/photo-1508098682722-e99c43a406b2?w=1200&auto=format&fit=crop&q=80",
    fallbackImage: "assets/images/shashikant-turf-night.jpg",
    description: "Massive 8-a-side championship arena equipped with eight 1000W high-mast LED towers. Includes official commentary gantry, electronic timer, referee suite, and ice bath.",
    amenities: ["High Mast Towers", "Live Commentary Desk", "Video Camera Gantry", "Ice Bath Recovery", "VIP Dugout", "Referee Suite"],
    isFloodlit: true,
    isPopular: true
  },
  {
    id: 'TRF-105',
    name: "Shashikant Rooftop SkyTurf Arena",
    sport: "Cricket",
    category: "cricket",
    size: "6v6 Rooftop Box Cricket Pitch",
    location: "Lower Parel (Skyline View), Mumbai",
    pricePerHour: 699,
    rating: 4.9,
    reviewsCount: 185,
    roofType: "14th Floor Rooftop 360° Net Cage",
    image: "https://images.unsplash.com/photo-1577223625816-7546f13df25d?w=1200&auto=format&fit=crop&q=80",
    fallbackImage: "assets/images/shashikant-turf-night.jpg",
    description: "Breathtaking 14th-floor rooftop sports experience with sea breeze and Mumbai skyline view. Features full perimeter shock netting, neon mood lighting, and rooftop cafe.",
    amenities: ["Panoramic Skyline", "Neon Night Lights", "Rooftop Juice Bar", "Acoustic Music System", "Lounge Seating"],
    isFloodlit: true,
    isPopular: true
  },
  {
    id: 'TRF-106',
    name: "Shashikant Premier League Box Cage",
    sport: "Cricket",
    category: "cricket",
    size: "Tournament Box Cricket Pitch",
    location: "Borivali West (Link Road), Mumbai",
    pricePerHour: 699,
    rating: 4.8,
    reviewsCount: 160,
    roofType: "Weather-Shielded Arena",
    image: "https://images.unsplash.com/photo-1624880357913-a8539238245b?w=1200&auto=format&fit=crop&q=80",
    fallbackImage: "assets/images/shashikant-turf-day.jpg",
    description: "Built specifically for high-intensity box cricket leagues. Features laser-measured crease lines, speed radar bowling gun, automated scoreboard, and mist cooling fans.",
    amenities: ["Bowling Speed Radar", "Laser Line Crease", "Mist Cooling Fans", "LED Scoreboard", "Tournament Trophy Stage"],
    isFloodlit: true,
    isPopular: false
  },
  {
    id: 'TRF-107',
    name: "Shashikant 5v5 Futsal Fast Track",
    sport: "Football",
    category: "football",
    size: "5v5 Speed Futsal Arena",
    location: "Powai Lakefront (Hiranandani), Mumbai",
    pricePerHour: 699,
    rating: 4.9,
    reviewsCount: 210,
    roofType: "Open-Air Lakeside Turf",
    image: "https://images.unsplash.com/photo-1518091043644-c1d4457512c6?w=1200&auto=format&fit=crop&q=80",
    fallbackImage: "assets/images/shashikant-turf-day.jpg",
    description: "Specialized low-friction non-abrasive turf designed for rapid futsal passing, tiki-taka, and Brazilian cage football. Rebound side boards for uninterrupted gameplay.",
    amenities: ["Rebound Side Boards", "FIFA Size 4 Balls", "High Action LED", "Locker Room", "Electrolyte Station"],
    isFloodlit: true,
    isPopular: false
  },
  {
    id: 'TRF-108',
    name: "Shashikant Champions Cricket Enclosure",
    sport: "Cricket",
    category: "cricket",
    size: "Automated Bowling Machine & 2 Nets",
    location: "Thane West (Ghodbunder Road), Mumbai",
    pricePerHour: 699,
    rating: 4.9,
    reviewsCount: 175,
    roofType: "Semi-Covered Practice Complex",
    image: "https://images.unsplash.com/photo-1540747913346-19e32dc3e97e?w=1200&auto=format&fit=crop&q=80",
    fallbackImage: "assets/images/shashikant-turf-night.jpg",
    description: "Professional batting and bowling simulator hub equipped with programmable bowling machine capable of 60 to 140 km/h with spin, swing, and bouncer variations.",
    amenities: ["Robo-Arm Machine (140 km/h)", "Dual Practice Nets", "Slow-Mo Video Cam", "Equipment Storage", "Coach Analysis Desk"],
    isFloodlit: true,
    isPopular: false
  },
  {
    id: 'TRF-109',
    name: "Shashikant All-Weather Indoor Dome Turf",
    sport: "Multisport",
    category: "multisport",
    size: "Geodesic Climate Dome (Football & Cricket)",
    location: "Malad West (Mindspace Tech Hub), Mumbai",
    pricePerHour: 699,
    rating: 5.0,
    reviewsCount: 340,
    roofType: "100% Monsoon & Heat Proof Dome",
    image: "https://images.unsplash.com/photo-1517649763962-0c623266ddc0?w=1200&auto=format&fit=crop&q=80",
    fallbackImage: "assets/images/shashikant-turf-day.jpg",
    description: "Mumbai's premier air-conditioned sports dome. Play without worrying about heavy rains, extreme summer heat, or mud. Temperature maintained at comfortable 24°C.",
    amenities: ["100% Monsoon Proof", "Air-Conditioned Dome", "Ultra HD Lighting", "Café Lounge & Wi-Fi", "Full Audio Rig"],
    isFloodlit: true,
    isPopular: true
  },
  {
    id: 'TRF-110',
    name: "Shashikant Elite Night Thunder Arena",
    sport: "Football",
    category: "football",
    size: "8v8 Tournament Scale Arena",
    location: "Navi Mumbai (Sector 19, Vashi), Mumbai",
    pricePerHour: 699,
    rating: 4.9,
    reviewsCount: 290,
    roofType: "Open-Air Pro Tournament Ground",
    image: "https://images.unsplash.com/photo-1431324155629-1a6deb1dec8d?w=1200&auto=format&fit=crop&q=80",
    fallbackImage: "assets/images/shashikant-turf-night.jpg",
    description: "Designed for nocturnal sports enthusiasts. Equipped with crystal-clear 1000 lux illumination, spectator stands for 150 fans, DJ match booth, and medical assistance.",
    amenities: ["1000 Lux Night Rig", "Match DJ Booth", "Spectator Stand (150)", "Certified Referees", "Physio First-Aid"],
    isFloodlit: true,
    isPopular: true
  }
];

// DEFAULT COMMUNITY MATCHES
const DEFAULT_MATCHES = [
  {
    id: "MCH-501",
    turfName: "Shashikant Football Grand Arena",
    location: "Andheri West, Mumbai",
    sport: "Football 7v7",
    date: "Today",
    time: "08:00 PM - 09:00 PM",
    organizer: "Aryan & Mumbai Strikers",
    goal: "Need Opponent Team",
    note: "Friendly 7-a-side match. Both teams split ₹699 fee equally. Bibs and water provided!",
    phone: "+91 90827 98970"
  },
  {
    id: "MCH-502",
    turfName: "Shashikant Pro Box Cricket Arena",
    location: "BKC, Mumbai",
    sport: "Box Cricket",
    date: "Tomorrow",
    time: "07:00 PM - 08:00 PM",
    organizer: "Sharvari & Squad",
    goal: "Need 2-3 Players (Batsmen / Bowlers)",
    note: "Short on 2 players for high voltage tennis-ball match! All skill levels welcome.",
    phone: "+91 90827 98970"
  },
  {
    id: "MCH-503",
    turfName: "Shashikant Stadium Night Floodlit Ground",
    location: "Goregaon East, Mumbai",
    sport: "Football 8v8",
    date: "This Weekend",
    time: "09:00 PM - 10:00 PM",
    organizer: "Vikram Football Club",
    goal: "Challenger Trophy Match",
    note: "Looking for competitive 8v8 squad. Referee and digital scoreboard active.",
    phone: "+91 98200 88776"
  }
];

// LOCAL DATABASE HELPER
const DB = {
  getTurfs() {
    const stored = localStorage.getItem('SHASHIKANT_TURFS');
    if (!stored) {
      localStorage.setItem('SHASHIKANT_TURFS', JSON.stringify(DEFAULT_TURFS));
      return DEFAULT_TURFS;
    }
    try {
      const parsed = JSON.parse(stored);
      // Ensure we always have at least 10 turfs
      if (parsed.length < 10) {
        localStorage.setItem('SHASHIKANT_TURFS', JSON.stringify(DEFAULT_TURFS));
        return DEFAULT_TURFS;
      }
      return parsed;
    } catch (e) {
      return DEFAULT_TURFS;
    }
  },

  getTurfById(id) {
    const list = this.getTurfs();
    return list.find(t => t.id === id) || list[0];
  },

  getBookings() {
    const stored = localStorage.getItem('SHASHIKANT_BOOKINGS');
    if (!stored) {
      const init = [
        {
          id: "BK-9821",
          turfId: "TRF-101",
          turfName: "Shashikant Football Grand Arena",
          sport: "Football",
          userName: "Sharvari Pore",
          userEmail: "sharvaripore11@gmail.com",
          userPhone: "+91 90827 98970",
          date: new Date().toISOString().split('T')[0],
          slot: "07:00 PM - 08:00 PM",
          amount: 699,
          paymentMethod: "UPI (Google Pay)",
          status: "Confirmed",
          checkInStatus: "Pending"
        }
      ];
      localStorage.setItem('SHASHIKANT_BOOKINGS', JSON.stringify(init));
      return init;
    }
    try {
      return JSON.parse(stored);
    } catch (e) {
      return [];
    }
  },

  saveBooking(booking) {
    const list = this.getBookings();
    list.unshift(booking);
    localStorage.setItem('SHASHIKANT_BOOKINGS', JSON.stringify(list));
    return booking;
  }
};

// ==========================================================================
// TOAST NOTIFICATIONS
// ==========================================================================
function showToast(message, icon = "⚡") {
  let container = document.getElementById('toastContainer');
  if (!container) {
    container = document.createElement('div');
    container.id = 'toastContainer';
    container.className = 'toast-container';
    document.body.appendChild(container);
  }

  const toast = document.createElement('div');
  toast.className = 'toast';
  toast.innerHTML = `
    <span style="font-size:1.3rem;">${icon}</span>
    <div style="font-size:0.9rem; font-weight:600; color:#fff;">${message}</div>
  `;

  container.appendChild(toast);
  setTimeout(() => {
    toast.style.opacity = '0';
    toast.style.transform = 'translateY(10px)';
    setTimeout(() => toast.remove(), 300);
  }, 3500);
}

// ==========================================================================
// DAY / NIGHT STADIUM SWITCHER
// ==========================================================================
function switchStadiumMode(mode) {
  const heroImg = document.getElementById('stadiumHeroImg');
  const btnDay = document.getElementById('btnDayMode');
  const btnNight = document.getElementById('btnNightMode');
  const modeTitle = document.getElementById('stadiumModeTitle');

  if (!heroImg) return;

  if (mode === 'night') {
    heroImg.src = 'assets/images/shashikant-turf-night.jpg';
    if (btnDay) btnDay.classList.remove('active');
    if (btnNight) btnNight.classList.add('active');
    if (modeTitle) {
      modeTitle.innerHTML = '🌙 Shashikant Night Floodlights Arena • 1000W LED Match Experience';
    }
    showToast("Switched to Night Floodlight Stadium Mode! 🌙", "💡");
  } else {
    heroImg.src = 'assets/images/shashikant-turf-day.jpg';
    if (btnDay) btnDay.classList.add('active');
    if (btnNight) btnNight.classList.remove('active');
    if (modeTitle) {
      modeTitle.innerHTML = '☀️ Shashikant Turf Daytime View • FIFA Pro Turfgrass';
    }
    showToast("Switched to Natural Daytime View! ☀️", "☀️");
  }
}

// ==========================================================================
// MOBILE MENU TOGGLE
// ==========================================================================
function toggleMobileNav() {
  const navLinks = document.getElementById('navLinks');
  if (navLinks) {
    navLinks.classList.toggle('active');
  }
}

// ==========================================================================
// DYNAMIC 21-DAY CALENDAR GENERATOR
// ==========================================================================
function generateDateRibbon(containerId, onSelectCallback) {
  const container = document.getElementById(containerId);
  if (!container) return;

  container.innerHTML = '';
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];

  const today = new Date();

  for (let i = 0; i < 21; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);

    const dateStr = d.toISOString().split('T')[0];
    const dayName = (i === 0) ? 'Today' : (i === 1 ? 'Tmrw' : days[d.getDay()]);
    const dayNum = d.getDate();
    const monthName = months[d.getMonth()];

    const pill = document.createElement('div');
    pill.className = `date-pill ${i === 0 ? 'active' : ''}`;
    pill.dataset.date = dateStr;
    pill.innerHTML = `
      <div class="day-name">${dayName}</div>
      <div class="day-num">${dayNum}</div>
      <div class="month-name">${monthName}</div>
    `;

    pill.onclick = () => {
      document.querySelectorAll(`#${containerId} .date-pill`).forEach(p => p.classList.remove('active'));
      pill.classList.add('active');
      if (typeof onSelectCallback === 'function') {
        onSelectCallback(dateStr);
      }
    };

    container.appendChild(pill);
  }
}

// ==========================================================================
// TURF CARDS RENDERER (RENDERS ALL 10 TURFS WITH FILTERS)
// ==========================================================================
function renderTurfsGrid(targetElementId, categoryFilter = 'all', searchQuery = '') {
  const container = document.getElementById(targetElementId);
  if (!container) return;

  const allTurfs = DB.getTurfs();
  let filtered = allTurfs;

  if (categoryFilter !== 'all') {
    filtered = filtered.filter(t => t.category.toLowerCase() === categoryFilter.toLowerCase());
  }

  if (searchQuery.trim() !== '') {
    const q = searchQuery.toLowerCase();
    filtered = filtered.filter(t =>
      t.name.toLowerCase().includes(q) ||
      t.location.toLowerCase().includes(q) ||
      t.sport.toLowerCase().includes(q) ||
      t.description.toLowerCase().includes(q)
    );
  }

  if (filtered.length === 0) {
    container.innerHTML = `
      <div style="grid-column: 1 / -1; text-align: center; padding: 60px 20px; background: #111a2e; border-radius: 20px; border: 1.5px dashed rgba(255,255,255,0.15);">
        <div style="font-size: 3rem; margin-bottom: 12px;">🔍</div>
        <h3 style="font-size: 1.4rem; color: #fff; margin-bottom: 8px;">No turfs found matching "${searchQuery}"</h3>
        <p style="color: #94a3b8; margin-bottom: 20px;">Try clearing filters or search for 'Football', 'Cricket', or 'Andheri'.</p>
        <button onclick="clearTurfFilters()" class="btn btn-primary btn-sm">Reset Filters</button>
      </div>
    `;
    return;
  }

  container.innerHTML = filtered.map(turf => `
    <div class="arena-card" data-sport="${turf.category}">
      <div class="arena-img-wrapper">
        <img src="${turf.image}" 
             alt="${turf.name}" 
             class="arena-img"
             loading="lazy"
             onerror="this.src='${turf.fallbackImage}'">
        <span class="arena-badge-sport">${turf.sport === 'Football' ? '⚽' : (turf.sport === 'Cricket' ? '🏏' : '⚡')} ${turf.sport}</span>
        <span class="arena-badge-rating">★ ${turf.rating} (${turf.reviewsCount || 150}+)</span>
      </div>

      <div class="arena-card-body">
        <div class="arena-location">
          <span>📍</span>
          <span>${turf.location}</span>
        </div>
        <h3 class="arena-title">${turf.name}</h3>
        <p class="arena-desc">${turf.description}</p>

        <div class="arena-chips">
          ${turf.amenities.slice(0, 3).map(a => `<span class="amenity-tag">✓ ${a}</span>`).join('')}
          ${turf.amenities.length > 3 ? `<span class="amenity-tag">+${turf.amenities.length - 3} More</span>` : ''}
        </div>

        <div class="arena-card-footer">
          <div>
            <div style="font-size:0.75rem; color:#94a3b8; font-weight:700; text-transform:uppercase;">Fixed Rate</div>
            <div class="arena-price">₹${turf.pricePerHour} <span>/ hour</span></div>
          </div>
          <div style="display:flex; gap:8px;">
            <a href="turf-details.html?id=${turf.id}" class="btn btn-outline btn-sm">Details</a>
            <a href="checkout.html?turfId=${turf.id}" class="btn btn-primary btn-sm">Book ➔</a>
          </div>
        </div>
      </div>
    </div>
  `).join('');
}

// FILTER HANDLERS
function filterTurfs(sport, btnElement) {
  document.querySelectorAll('.filter-pill').forEach(btn => btn.classList.remove('active'));
  if (btnElement) btnElement.classList.add('active');

  const searchInput = document.getElementById('turfSearchInput');
  const query = searchInput ? searchInput.value : '';

  renderTurfsGrid('turfsShowcaseGrid', sport, query);
  renderTurfsGrid('turfsListPageGrid', sport, query);
}

function clearTurfFilters() {
  const searchInput = document.getElementById('turfSearchInput');
  if (searchInput) searchInput.value = '';
  const allBtn = document.querySelector('.filter-pill');
  filterTurfs('all', allBtn);
}

// QUICK BOOKING HANDLER
function handleQuickBooking(e) {
  e.preventDefault();
  const select = document.getElementById('quickTurfSelect');
  const dateInput = document.getElementById('quickDateInput');
  const timeSelect = document.getElementById('quickTimeWindow');

  const turfId = select ? select.value : 'TRF-101';
  const matchDate = (dateInput && dateInput.value) ? dateInput.value : new Date().toISOString().split('T')[0];
  const slot = timeSelect ? timeSelect.value : '07:00 PM - 08:00 PM';

  window.location.href = `checkout.html?turfId=${turfId}&date=${matchDate}&slot=${encodeURIComponent(slot)}`;
}

// TICKET GENERATOR WITH QR GATE PASS & MODAL
function showConfirmedTicketModal(booking) {
  let modal = document.getElementById('matchTicketModal');
  if (!modal) {
    modal = document.createElement('div');
    modal.id = 'matchTicketModal';
    modal.className = 'modal-overlay';
    document.body.appendChild(modal);
  }

  const qrData = encodeURIComponent(`SHASHIKANT-TURF-PASS#${booking.id}|${booking.turfName}|${booking.date}|${booking.slot}|PAID-₹699`);
  const qrUrl = `https://api.qrserver.com/v1/create-qr-code/?size=160x160&data=${qrData}`;

  modal.innerHTML = `
    <div class="modal-dialog">
      <button class="modal-close-btn" onclick="closeTicketModal()">✕</button>

      <div style="text-align: center; margin-bottom: 20px;">
        <div style="font-size: 3rem;">🎉</div>
        <h2 style="font-size: 1.7rem; color: #fff; margin-bottom: 6px;">Booking Confirmed!</h2>
        <p style="color: var(--neon-green); font-weight: 700; font-size: 0.95rem;">
          📧 Matchday Ticket Dispatched to ${booking.userEmail}
        </p>
      </div>

      <!-- Official Pass Card -->
      <div class="ticket-card">
        <div class="ticket-header">
          <div>
            <div style="font-size: 0.75rem; text-transform: uppercase; letter-spacing: 1px; color: var(--neon-green); font-weight: 800;">
              Official Matchday Pass
            </div>
            <strong style="font-size: 1.15rem; color: #fff;">${booking.turfName}</strong>
          </div>
          <span style="background: rgba(16,185,129,0.25); border: 1px solid var(--neon-green); color: var(--neon-green); padding: 4px 10px; border-radius: 20px; font-size: 0.8rem; font-weight: 800;">
            PAID: ₹${booking.amount || 699}
          </span>
        </div>

        <div class="ticket-body">
          <div style="display: grid; grid-template-columns: 1fr 1fr; gap: 12px; margin-bottom: 16px; font-size: 0.88rem;">
            <div>
              <span style="color: #64748b; font-size: 0.75rem; text-transform: uppercase; font-weight: 700; display: block;">Booking Reference</span>
              <strong style="color: #0f172a; font-size: 1rem;">#${booking.id}</strong>
            </div>
            <div>
              <span style="color: #64748b; font-size: 0.75rem; text-transform: uppercase; font-weight: 700; display: block;">Player Name</span>
              <strong style="color: #0f172a;">${booking.userName}</strong>
            </div>
            <div>
              <span style="color: #64748b; font-size: 0.75rem; text-transform: uppercase; font-weight: 700; display: block;">Match Date</span>
              <strong style="color: #0f172a;">📅 ${booking.date}</strong>
            </div>
            <div>
              <span style="color: #64748b; font-size: 0.75rem; text-transform: uppercase; font-weight: 700; display: block;">Reserved Slot</span>
              <strong style="color: #10b981;">⏰ ${booking.slot}</strong>
            </div>
          </div>

          <div class="ticket-qr-wrap">
            <img src="${qrUrl}" alt="Matchday QR Gate Pass" class="ticket-qr-img" />
            <div style="font-size: 0.78rem; font-weight: 700; color: #334155;">
              🎟️ Scan at Venue Gate Scanner for Direct Pitch Entry
            </div>
            <div style="font-size: 0.72rem; color: #64748b;">
              Valid on ${booking.date} for 1 Hour Session
            </div>
          </div>

          <div style="background: #f1f5f9; border-radius: 8px; padding: 10px 14px; font-size: 0.78rem; color: #475569; display: flex; align-items: center; gap: 8px;">
            <span>ℹ️</span>
            <span>Please arrive 10 minutes prior to kickoff. Non-marking turf shoes recommended.</span>
          </div>
        </div>
      </div>

      <div style="display: flex; gap: 10px; margin-top: 18px;">
        <button onclick="window.print()" class="btn btn-outline" style="flex: 1;">🖨️ Print Ticket</button>
        <button onclick="window.location.href='my-bookings.html'" class="btn btn-primary" style="flex: 1;">View My Bookings ➔</button>
      </div>
    </div>
  `;

  modal.classList.add('active');
}

function closeTicketModal() {
  const modal = document.getElementById('matchTicketModal');
  if (modal) modal.classList.remove('active');
}

// SETUP QUICK BOOKING FORM DEFAULT DATE
document.addEventListener('DOMContentLoaded', () => {
  const dateInput = document.getElementById('quickDateInput');
  if (dateInput) {
    const today = new Date().toISOString().split('T')[0];
    dateInput.value = today;
    dateInput.min = today;
  }
});
