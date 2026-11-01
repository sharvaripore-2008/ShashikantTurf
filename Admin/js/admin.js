/**
 * Shashikant Turf - Admin Dashboard Controller
 * Synchronized with MySQL database tables and LocalStorage
 */

async function initAdminDashboard() {
  // 1. Fetch Backend status
  if (typeof API !== 'undefined') {
    const status = await API.isBackendLive();
    const pill = document.getElementById('backendStatusPill');
    if (pill) {
      if (status.online) {
        pill.innerText = `⚡ ${status.database}`;
        pill.style.background = 'rgba(16,185,129,0.15)';
        pill.style.color = '#10b981';
      } else {
        pill.innerText = '⚠️ Offline (LocalStorage Mode)';
        pill.style.background = 'rgba(245,158,11,0.15)';
        pill.style.color = '#f59e0b';
      }
    }
  }

  // 2. Fetch Real-time Stats
  let stats = { totalRevenue: 0, totalBookings: 0, todayBookings: 0, activeTurfs: 0, cancelledBookings: 0 };
  if (typeof API !== 'undefined') {
    stats = await API.getAdminStats();
  } else if (typeof DB !== 'undefined') {
    const b = DB.getBookings();
    stats = {
      totalRevenue: b.filter(x => x.status !== 'Cancelled').reduce((s, x) => s + (x.amount || 0), 0),
      totalBookings: b.length,
      todayBookings: b.filter(x => x.date === new Date().toISOString().split('T')[0]).length,
      activeTurfs: DB.getTurfs().length,
      cancelledBookings: b.filter(x => x.status === 'Cancelled').length
    };
  }

  document.getElementById('statTotalRevenue') && (document.getElementById('statTotalRevenue').innerText = formatCurrency(stats.totalRevenue));
  document.getElementById('statTotalBookings') && (document.getElementById('statTotalBookings').innerText = stats.totalBookings || 0);
  document.getElementById('statTodayBookings') && (document.getElementById('statTodayBookings').innerText = stats.todayBookings || 0);
  document.getElementById('statActiveTurfs') && (document.getElementById('statActiveTurfs').innerText = stats.activeTurfs || 0);
  document.getElementById('statCancelledBookings') && (document.getElementById('statCancelledBookings').innerText = stats.cancelledBookings || 0);

  // 3. Render Bookings Table (Kisne kisne booking ki hai)
  let bookings = [];
  if (typeof API !== 'undefined') {
    bookings = await API.getBookings();
  } else if (typeof DB !== 'undefined') {
    bookings = DB.getBookings();
  }

  document.getElementById('countBookings') && (document.getElementById('countBookings').innerText = bookings.length);
  const bookingsTable = document.getElementById('adminBookingsTable');
  if (bookingsTable) {
    if (bookings.length === 0) {
      bookingsTable.innerHTML = `<tr><td colspan="8" style="text-align:center; padding:30px; color:var(--text-muted);">No reservations recorded yet.</td></tr>`;
    } else {
      bookingsTable.innerHTML = bookings.map(b => {
        const isCancelled = b.status === 'Cancelled';
        return `
          <tr>
            <td><strong>#${b.id}</strong></td>
            <td><strong>${b.turfName}</strong></td>
            <td><strong>${b.userName || 'Player'}</strong></td>
            <td><small style="color:var(--text-muted);">${b.userEmail || ''}<br>${b.userPhone || ''}</small></td>
            <td>${b.date}<br><small style="color:var(--primary); font-weight:600;">${b.slot}</small></td>
            <td><strong style="color:var(--primary);">${formatCurrency(b.amount)}</strong><br><small style="color:var(--text-muted);">${b.paymentMethod || 'UPI'}</small></td>
            <td><span class="badge ${isCancelled ? 'badge-danger' : 'badge-success'}">${b.status}</span></td>
            <td>
              ${!isCancelled ? `<button onclick="adminCancel('${b.id}')" class="btn btn-danger btn-sm">Cancel</button>` : `<small style="color:#f87171;">Cancelled</small>`}
            </td>
          </tr>
        `;
      }).join('');
    }
  }

  // 4. Render Cancellations Table (Kisne kisne cancel ki hai)
  let cancellations = [];
  if (typeof API !== 'undefined') {
    cancellations = await API.getCancellations();
  }
  document.getElementById('countCancellations') && (document.getElementById('countCancellations').innerText = cancellations.length);
  const cancelTable = document.getElementById('adminCancellationsTable');
  if (cancelTable) {
    if (cancellations.length === 0) {
      cancelTable.innerHTML = `<tr><td colspan="9" style="text-align:center; padding:30px; color:var(--text-muted);">No cancellation logs recorded yet.</td></tr>`;
    } else {
      cancelTable.innerHTML = cancellations.map(c => `
        <tr>
          <td>#LOG-${c.id}</td>
          <td><strong style="color:var(--primary);">#${c.booking_id || c.bookingId}</strong></td>
          <td><strong>${c.user_name || c.userName || 'Customer'}</strong></td>
          <td>${c.user_email || c.userEmail || '—'}</td>
          <td>${c.turf_name || c.turfName || '—'}</td>
          <td>${c.booking_date ? new Date(c.booking_date).toISOString().split('T')[0] : (c.bookingDate || '')}<br><small style="color:var(--text-muted);">${c.slot || ''}</small></td>
          <td><strong style="color:#f87171;">₹${c.refund_amount || c.refundAmount || 0}</strong></td>
          <td><small>${c.cancelled_at ? new Date(c.cancelled_at).toLocaleString('en-IN') : (c.cancelledAt || '')}</small></td>
          <td><small style="color:var(--text-muted);">${c.reason || 'User requested'}</small></td>
        </tr>
      `).join('');
    }
  }

  // 5. Render Login Activity Logs (Kisne kisne login kiya hai)
  let loginLogs = [];
  if (typeof API !== 'undefined') {
    loginLogs = await API.getLoginLogs();
  }
  document.getElementById('countLogins') && (document.getElementById('countLogins').innerText = loginLogs.length);
  const loginsTable = document.getElementById('adminLoginLogsTable');
  if (loginsTable) {
    if (loginLogs.length === 0) {
      loginsTable.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:30px; color:var(--text-muted);">No login logs available yet.</td></tr>`;
    } else {
      loginsTable.innerHTML = loginLogs.map(l => {
        const isSuccess = (l.status || '').includes('SUCCESS');
        return `
          <tr>
            <td>#${l.id}</td>
            <td><strong>${l.name || 'Anonymous User'}</strong></td>
            <td><code>${l.email}</code></td>
            <td><span class="badge ${l.role === 'admin' ? 'badge-danger' : 'badge-info'}">${l.role || 'user'}</span></td>
            <td><span class="badge-log ${isSuccess ? 'badge-success' : 'badge-danger'}">${l.status}</span></td>
            <td><small>${l.ip_address || l.ipAddress || '127.0.0.1'}</small></td>
            <td><small>${l.login_time ? new Date(l.login_time).toLocaleString('en-IN') : 'Just now'}</small></td>
          </tr>
        `;
      }).join('');
    }
  }

  // 6. Render Users / Signups Table (Kisne kisne sign up kiya hai)
  let users = [];
  if (typeof API !== 'undefined') {
    users = await API.getUsers();
  }
  document.getElementById('countUsers') && (document.getElementById('countUsers').innerText = users.length);
  const usersTable = document.getElementById('adminUsersTable');
  if (usersTable) {
    if (users.length === 0) {
      usersTable.innerHTML = `<tr><td colspan="7" style="text-align:center; padding:30px; color:var(--text-muted);">No registered users yet.</td></tr>`;
    } else {
      usersTable.innerHTML = users.map(u => `
        <tr>
          <td><strong>${u.id}</strong></td>
          <td><strong>${u.name}</strong></td>
          <td><code>${u.email}</code></td>
          <td>${u.phone || '—'}</td>
          <td><span class="badge ${u.role === 'admin' ? 'badge-danger' : 'badge-info'}">${u.role}</span></td>
          <td><small>${u.created_at ? new Date(u.created_at).toLocaleString('en-IN') : '—'}</small></td>
          <td><small style="color:var(--primary);">${u.last_login ? new Date(u.last_login).toLocaleString('en-IN') : '—'}</small></td>
        </tr>
      `).join('');
    }
  }
}

async function adminCancel(id) {
  if (confirm(`Cancel reservation #${id}? This will record the cancellation in MySQL and trigger refund.`)) {
    if (typeof API !== 'undefined') {
      await API.cancelBooking(id, 'Cancelled by Admin');
    } else if (typeof DB !== 'undefined') {
      DB.cancelBooking(id);
    }
    showToast('Booking cancelled by admin', 'info');
    await initAdminDashboard();
  }
}

async function initManageTurfs() {
  const t = document.getElementById('adminTurfsTable');
  if (!t) return;

  let turfs = [];
  if (typeof API !== 'undefined') {
    turfs = await API.getTurfs();
  } else if (typeof DB !== 'undefined') {
    turfs = DB.getTurfs();
  }

  t.innerHTML = turfs.map(x => {
    let imgPath = x.image || '';
    if (!imgPath) {
      imgPath = (x.category === 'cricket' || (x.name && x.name.toLowerCase().includes('cricket')))
        ? '../assets/images/shashikant-turf-night.jpg'
        : '../assets/images/shashikant-turf-day.jpg';
    } else if (!imgPath.startsWith('http') && !imgPath.startsWith('/') && !imgPath.startsWith('../')) {
      imgPath = '../' + imgPath;
    }

    return `
    <tr>
      <td>
        <img src="${imgPath}" 
             alt="${x.name}" 
             onerror="this.onerror=null; this.src='../assets/images/shashikant-turf-day.jpg';" 
             style="width:60px; height:40px; object-fit:cover; border-radius:6px; display:block; border:1px solid rgba(255,255,255,0.15);">
      </td>
      <td><strong>${x.name}</strong><br><small style="color:var(--text-muted);">${x.size}</small></td>
      <td>${x.location}</td>
      <td><strong>${formatCurrency(x.pricePerHour)}/hr</strong></td>
      <td>★ ${x.rating}</td>
      <td><button onclick="deleteTurf('${x.id}')" class="btn btn-danger btn-sm">Delete</button></td>
    </tr>
  `;
  }).join('');
}

async function handleAddTurf(e) {
  e.preventDefault();
  const newTurf = {
    id: 'TRF-' + Math.floor(100 + Math.random() * 900),
    name: document.getElementById('newTurfName').value.trim(),
    sport: document.getElementById('newTurfSport').value === 'football' ? 'Football' : 'Cricket',
    category: document.getElementById('newTurfSport').value,
    size: document.getElementById('newTurfSize').value.trim() || '7v7',
    location: document.getElementById('newTurfLocation').value.trim(),
    pricePerHour: parseInt(document.getElementById('newTurfPrice').value, 10),
    rating: 5.0,
    image: document.getElementById('newTurfImage').value.trim() || 'https://images.unsplash.com/photo-1529900241929-5ed53a0f33dd?auto=format&fit=crop&w=800&q=80',
    description: document.getElementById('newTurfDesc').value.trim() || 'Modern sports arena.',
    amenities: ["Floodlights", "Locker Room", "Free Parking"]
  };

  if (typeof API !== 'undefined') {
    await API.addTurf(newTurf);
  } else if (typeof DB !== 'undefined') {
    const list = DB.getTurfs();
    list.unshift(newTurf);
    DB.saveTurfs(list);
  }

  showToast('Turf added successfully!', 'success');
  closeModal('addTurfModal');
  await initManageTurfs();
}

async function deleteTurf(id) {
  if (confirm('Delete this turf venue from database?')) {
    if (typeof API !== 'undefined') {
      await API.deleteTurf(id);
    } else if (typeof DB !== 'undefined') {
      DB.saveTurfs(DB.getTurfs().filter(x => x.id !== id));
    }
    showToast('Turf venue removed', 'info');
    await initManageTurfs();
  }
}

function openModal(id) { document.getElementById(id)?.classList.add('active'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('active'); }

async function initAdminCalendar() {
  const turfSelect = document.getElementById('calTurfSelect');
  const dateInput = document.getElementById('calDateInput');
  const grid = document.getElementById('calSlotsGrid');
  if (!turfSelect || !grid) return;

  let turfs = [];
  if (typeof API !== 'undefined') turfs = await API.getTurfs();
  else if (typeof DB !== 'undefined') turfs = DB.getTurfs();

  turfSelect.innerHTML = turfs.map(t => `<option value="${t.id}">${t.name}</option>`).join('');
  dateInput.value = new Date().toISOString().split('T')[0];

  async function renderCal() {
    let booked = [];
    if (typeof API !== 'undefined') {
      booked = await API.getBookedSlots(turfSelect.value, dateInput.value);
    } else if (typeof DB !== 'undefined') {
      booked = DB.getBookings()
        .filter(b => b.turfId === turfSelect.value && b.date === dateInput.value && b.status !== 'Cancelled')
        .map(b => b.slot);
    }

    const times = ["06:00 AM - 07:00 AM", "07:00 AM - 08:00 AM", "08:00 AM - 09:00 AM", "09:00 AM - 10:00 AM", "05:00 PM - 06:00 PM", "06:00 PM - 07:00 PM", "07:00 PM - 08:00 PM", "08:00 PM - 09:00 PM", "09:00 PM - 10:00 PM"];

    grid.innerHTML = times.map(t => {
      const isBooked = booked.includes(t);
      return `
        <div class="stat-card" style="padding:14px; display:flex; justify-content:space-between; align-items:center;">
          <div>
            <strong>${t}</strong><br>
            <small style="color:${isBooked ? '#ef4444' : '#10b981'}; font-weight:600;">${isBooked ? '● Booked / Locked' : '○ Available'}</small>
          </div>
          <button onclick="${isBooked ? `adminFreeSlot('${turfSelect.value}','${dateInput.value}','${t}')` : `adminLockSlot('${turfSelect.value}','${dateInput.value}','${t}')`}" class="btn ${isBooked ? 'btn-outline' : 'btn-danger'} btn-sm">
            ${isBooked ? 'Unlock' : 'Block Slot'}
          </button>
        </div>
      `;
    }).join('');
  }

  turfSelect.addEventListener('change', renderCal);
  dateInput.addEventListener('change', renderCal);
  await renderCal();
}

async function adminLockSlot(turfId, date, slot) {
  let turf = null;
  if (typeof API !== 'undefined') turf = await API.getTurfById(turfId);
  else if (typeof DB !== 'undefined') turf = DB.getTurfById(turfId);

  const blockBooking = {
    id: 'BLK-' + Math.floor(1000 + Math.random() * 9000),
    turfId, turfName: turf ? turf.name : 'Turf',
    userName: 'Admin Maintenance Block',
    userEmail: 'admin@shashikantturf.com',
    userPhone: '+91 98765 00000',
    date, slot, amount: 0, paymentMethod: 'Offline Maintenance', status: 'Confirmed'
  };

  if (typeof API !== 'undefined') {
    await API.createBooking(blockBooking);
  } else if (typeof DB !== 'undefined') {
    DB.addBooking(blockBooking);
  }

  showToast(`Slot blocked`, 'info');
  await initAdminCalendar();
}

async function adminFreeSlot(turfId, date, slot) {
  let bookings = [];
  if (typeof API !== 'undefined') bookings = await API.getBookings();
  else if (typeof DB !== 'undefined') bookings = DB.getBookings();

  const match = bookings.find(b => b.turfId === turfId && b.date === date && b.slot === slot && b.status !== 'Cancelled');
  if (match) {
    if (typeof API !== 'undefined') await API.cancelBooking(match.id, 'Admin unblocked slot');
    else if (typeof DB !== 'undefined') DB.cancelBooking(match.id);
    showToast(`Slot unlocked`, 'success');
    await initAdminCalendar();
  }
}

document.addEventListener('DOMContentLoaded', async () => {
  await initAdminDashboard();
  await initManageTurfs();
  await initAdminCalendar();
});
