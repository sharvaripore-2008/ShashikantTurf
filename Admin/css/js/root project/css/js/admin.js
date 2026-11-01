function initAdminDashboard() {
  const turfs = DB.getTurfs();
  const bookings = DB.getBookings();

  const totalRevenue = bookings.filter(b => b.status !== 'Cancelled').reduce((sum, b) => sum + (b.amount || 0), 0);
  const todayStr = new Date().toISOString().split('T')[0];
  const todayBookings = bookings.filter(b => b.date === todayStr);

  document.getElementById('statTotalRevenue') && (document.getElementById('statTotalRevenue').innerText = formatCurrency(totalRevenue));
  document.getElementById('statTotalBookings') && (document.getElementById('statTotalBookings').innerText = bookings.length);
  document.getElementById('statActiveTurfs') && (document.getElementById('statActiveTurfs').innerText = turfs.length);
  document.getElementById('statTodayBookings') && (document.getElementById('statTodayBookings').innerText = todayBookings.length);

  const tableBody = document.getElementById('adminBookingsTable');
  if (tableBody) {
    tableBody.innerHTML = bookings.map(b => {
      const isCancelled = b.status === 'Cancelled';
      return `
        <tr>
          <td><strong>#${b.id}</strong></td>
          <td>${b.turfName}</td>
          <td><strong>${b.userName || 'Player'}</strong><br><small style="color:var(--text-muted);">${b.userPhone || ''}</small></td>
          <td>${b.date}<br><small style="color:var(--text-muted);">${b.slot}</small></td>
          <td><strong style="color:var(--primary);">${formatCurrency(b.amount)}</strong></td>
          <td><span class="badge ${isCancelled ? 'badge-danger' : 'badge-success'}">${b.status}</span></td>
          <td>
            ${!isCancelled ? `<button onclick="adminCancel('${b.id}')" class="btn btn-danger btn-sm">Cancel</button>` : `<small>No Action</small>`}
          </td>
        </tr>
      `;
    }).join('');
  }
}

function adminCancel(id) {
  if (confirm(`Cancel reservation #${id}?`)) {
    DB.cancelBooking(id);
    showToast('Booking cancelled by admin', 'info');
    initAdminDashboard();
  }
}

function initManageTurfs() {
  const t = document.getElementById('adminTurfsTable');
  if (!t) return;
  t.innerHTML = DB.getTurfs().map(x => `
    <tr>
      <td><img src="${x.image}" style="width:60px; height:40px; object-fit:cover; border-radius:6px;"></td>
      <td><strong>${x.name}</strong><br><small style="color:var(--text-muted);">${x.size}</small></td>
      <td>${x.location}</td>
      <td><strong>${formatCurrency(x.pricePerHour)}/hr</strong></td>
      <td>★ ${x.rating}</td>
      <td><button onclick="deleteTurf('${x.id}')" class="btn btn-danger btn-sm">Delete</button></td>
    </tr>
  `).join('');
}

function handleAddTurf(e) {
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

  const list = DB.getTurfs();
  list.unshift(newTurf);
  DB.saveTurfs(list);
  showToast('Turf added successfully!', 'success');
  closeModal('addTurfModal');
  initManageTurfs();
}

function deleteTurf(id) {
  if (confirm('Delete this turf?')) {
    DB.saveTurfs(DB.getTurfs().filter(x => x.id !== id));
    showToast('Turf removed', 'info');
    initManageTurfs();
  }
}

function openModal(id) { document.getElementById(id)?.classList.add('active'); }
function closeModal(id) { document.getElementById(id)?.classList.remove('active'); }

function initAdminCalendar() {
  const turfSelect = document.getElementById('calTurfSelect');
  const dateInput = document.getElementById('calDateInput');
  const grid = document.getElementById('calSlotsGrid');
  if (!turfSelect || !grid) return;

  turfSelect.innerHTML = DB.getTurfs().map(t => `<option value="${t.id}">${t.name}</option>`).join('');
  dateInput.value = new Date().toISOString().split('T')[0];

  function renderCal() {
    const booked = DB.getBookings()
      .filter(b => b.turfId === turfSelect.value && b.date === dateInput.value && b.status !== 'Cancelled')
      .map(b => b.slot);

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
  renderCal();
}

function adminLockSlot(turfId, date, slot) {
  const t = DB.getTurfById(turfId);
  DB.addBooking({
    id: 'BLK-' + Math.floor(1000 + Math.random() * 9000),
    turfId, turfName: t ? t.name : 'Turf',
    userName: 'Admin Maintenance Block',
    date, slot, amount: 0, paymentMethod: 'Offline', status: 'Confirmed'
  });
  showToast(`Slot blocked`, 'info');
  initAdminCalendar();
}

function adminFreeSlot(turfId, date, slot) {
  const match = DB.getBookings().find(b => b.turfId === turfId && b.date === date && b.slot === slot && b.status !== 'Cancelled');
  if (match) {
    DB.cancelBooking(match.id);
    showToast(`Slot unlocked`, 'success');
    initAdminCalendar();
  }
}

document.addEventListener('DOMContentLoaded', () => {
  initAdminDashboard();
  initManageTurfs();
  initAdminCalendar();
});
