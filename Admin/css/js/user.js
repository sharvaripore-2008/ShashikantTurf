function renderUserBookings() {
  const container = document.getElementById('userBookingsList');
  const user = DB.getCurrentUser();
  if (!container || !user) return;

  const bookings = DB.getBookings().filter(b => b.userEmail === user.email || !b.userEmail);

  if (bookings.length === 0) {
    container.innerHTML = `
      <div style="text-align:center; padding:60px 20px; background:var(--bg-card); border-radius:var(--radius-lg);">
        <div style="font-size:3rem; margin-bottom:12px;">⚽</div>
        <h3>No reservations found</h3>
        <p style="color:var(--text-muted); margin:10px 0 20px;">You haven't booked any slots yet.</p>
        <a href="turfs.html" class="btn btn-primary">Find a Turf & Book</a>
      </div>
    `;
    return;
  }

  container.innerHTML = bookings.map(b => {
    const isCancelled = b.status === 'Cancelled';
    return `
      <div class="checkout-card" style="margin-bottom:20px; display:flex; justify-content:space-between; align-items:center; flex-wrap:wrap; gap:20px;">
        <div>
          <div style="display:flex; align-items:center; gap:12px; margin-bottom:8px;">
            <span class="badge ${isCancelled ? 'badge-danger' : 'badge-success'}">${b.status}</span>
            <span style="font-size:0.85rem; color:var(--text-muted);">Booking ID: <strong>#${b.id}</strong></span>
          </div>
          <h3 style="margin-bottom:6px;">${b.turfName}</h3>
          <p style="color:var(--text-muted); font-size:0.95rem;">📅 <strong>${b.date}</strong> &nbsp;|&nbsp; ⏰ <strong>${b.slot}</strong></p>
          <p style="font-size:0.9rem; color:var(--text-muted); margin-top:4px;">
            Paid: <strong style="color:var(--primary);">${formatCurrency(b.amount)}</strong> via ${b.paymentMethod || 'UPI'}
          </p>
        </div>
        <div style="display:flex; gap:12px; align-items:center;">
          <button onclick="window.print()" class="btn btn-outline btn-sm">🖨️ Receipt</button>
          ${!isCancelled ? `<button onclick="cancelUserBooking('${b.id}')" class="btn btn-danger btn-sm">Cancel Slot</button>` : `<span style="color:#f87171; font-size:0.85rem;">Cancelled & Refunded</span>`}
        </div>
      </div>
    `;
  }).join('');
}

function cancelUserBooking(id) {
  if (confirm(`Are you sure you want to cancel booking #${id}? 100% refund will be processed within 24 hours.`)) {
    DB.cancelBooking(id);
    showToast(`Booking #${id} cancelled. Refund initiated!`, 'info');
    renderUserBookings();
  }
}

document.addEventListener('DOMContentLoaded', renderUserBookings);
