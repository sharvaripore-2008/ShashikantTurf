let currentTurf = null;
let selectedDate = new Date().toISOString().split('T')[0];
let selectedSlot = null;

const TIME_SLOTS = [
  { time: "06:00 AM - 07:00 AM", category: "morning" },
  { time: "07:00 AM - 08:00 AM", category: "morning" },
  { time: "08:00 AM - 09:00 AM", category: "morning" },
  { time: "09:00 AM - 10:00 AM", category: "morning" },
  { time: "10:00 AM - 11:00 AM", category: "morning" },
  { time: "11:00 AM - 12:00 PM", category: "morning" },
  { time: "12:00 PM - 01:00 PM", category: "afternoon" },
  { time: "01:00 PM - 02:00 PM", category: "afternoon" },
  { time: "02:00 PM - 03:00 PM", category: "afternoon" },
  { time: "03:00 PM - 04:00 PM", category: "afternoon" },
  { time: "04:00 PM - 05:00 PM", category: "evening" },
  { time: "05:00 PM - 06:00 PM", category: "evening" },
  { time: "06:00 PM - 07:00 PM", category: "evening" },
  { time: "07:00 PM - 08:00 PM", category: "evening" },
  { time: "08:00 PM - 09:00 PM", category: "night" },
  { time: "09:00 PM - 10:00 PM", category: "night" },
  { time: "10:00 PM - 11:00 PM", category: "night" },
  { time: "11:00 PM - 12:00 AM", category: "night" }
];

function initDateRibbon() {
  const ribbon = document.getElementById('dateRibbon');
  if (!ribbon) return;
  const days = ['Sun', 'Mon', 'Tue', 'Wed', 'Thu', 'Fri', 'Sat'];
  const months = ['Jan', 'Feb', 'Mar', 'Apr', 'May', 'Jun', 'Jul', 'Aug', 'Sep', 'Oct', 'Nov', 'Dec'];
  let html = '';
  const today = new Date();

  for (let i = 0; i < 7; i++) {
    const d = new Date();
    d.setDate(today.getDate() + i);
    const dateStr = d.toISOString().split('T')[0];
    const isSelected = dateStr === selectedDate;
    html += `
      <div class="date-btn ${isSelected ? 'active' : ''}" onclick="selectDate('${dateStr}')">
        <span class="day-name">${i === 0 ? 'Today' : days[d.getDay()]}</span>
        <span class="day-num">${d.getDate()}</span>
        <span class="month-name">${months[d.getMonth()]}</span>
      </div>
    `;
  }
  ribbon.innerHTML = html;
}

function selectDate(dateStr) {
  selectedDate = dateStr;
  selectedSlot = null;
  initDateRibbon();
  renderSlots();
  updateSummarySidebar();
}

function renderSlots() {
  const bookedSlots = DB.getBookings()
    .filter(b => b.turfId === currentTurf.id && b.date === selectedDate && b.status !== 'Cancelled')
    .map(b => b.slot);

  const renderCat = (cat) => TIME_SLOTS.filter(s => s.category === cat).map(s => {
    const isBooked = bookedSlots.includes(s.time);
    const isSelected = selectedSlot === s.time;
    return `
      <div class="slot-pill ${isBooked ? 'booked' : ''} ${isSelected ? 'selected' : ''}" 
           onclick="${isBooked ? '' : `chooseSlot('${s.time}')`}">
        <span class="slot-time">${s.time}</span>
        <span class="slot-price">${formatCurrency(currentTurf.pricePerHour)}</span>
      </div>
    `;
  }).join('');

  document.getElementById('morningSlots').innerHTML = renderCat('morning');
  document.getElementById('afternoonSlots').innerHTML = renderCat('afternoon');
  document.getElementById('eveningSlots').innerHTML = renderCat('evening');
  document.getElementById('nightSlots').innerHTML = renderCat('night');
}

function chooseSlot(time) {
  selectedSlot = time;
  renderSlots();
  updateSummarySidebar();
}

function updateSummarySidebar() {
  const btn = document.getElementById('btnProceedBooking');
  document.getElementById('summaryDate').innerText = selectedDate;

  if (selectedSlot) {
    document.getElementById('summarySlot').innerText = selectedSlot;
    const base = currentTurf.pricePerHour;
    const gst = Math.round(base * 0.18);
    const total = base + gst + 50;

    document.getElementById('summaryBasePrice').innerText = formatCurrency(base);
    document.getElementById('summaryGst').innerText = formatCurrency(gst);
    document.getElementById('summaryTotal').innerText = formatCurrency(total);
    btn.disabled = false;
    btn.classList.add('btn-primary');
    btn.innerText = "Proceed to Checkout ➔";
  } else {
    document.getElementById('summarySlot').innerText = "Select a slot";
    document.getElementById('summaryBasePrice').innerText = "₹0";
    document.getElementById('summaryGst').innerText = "₹0";
    document.getElementById('summaryTotal').innerText = "₹0";
    btn.disabled = true;
    btn.innerText = "Select Slot to Continue";
  }
}

function proceedToCheckout() {
  if (!selectedSlot) return showToast('Please select a time slot!', 'warning');
  const base = currentTurf.pricePerHour;
  const total = base + Math.round(base * 0.18) + 50;

  sessionStorage.setItem('current_checkout', JSON.stringify({
    turfId: currentTurf.id,
    turfName: currentTurf.name,
    turfLocation: currentTurf.location,
    date: selectedDate,
    slot: selectedSlot,
    basePrice: base,
    gst: Math.round(base * 0.18),
    totalAmount: total
  }));
  window.location.href = 'checkout.html';
}

document.addEventListener('DOMContentLoaded', () => {
  const params = new URLSearchParams(window.location.search);
  const id = params.get('id') || 'TRF-101';
  currentTurf = DB.getTurfById(id) || DB.getTurfs()[0];

  document.getElementById('turfDetailTitle').innerText = currentTurf.name;
  document.getElementById('turfDetailLocation').innerHTML = `📍 ${currentTurf.location} • <strong style="color:var(--primary);">${currentTurf.size}</strong>`;
  document.getElementById('turfDetailDesc').innerText = currentTurf.description;
  document.getElementById('turfDetailImg').src = currentTurf.image;
  document.getElementById('turfDetailAmenities').innerHTML = currentTurf.amenities.map(a => `<span class="amenity-chip">✓ ${a}</span>`).join('');

  initDateRibbon();
  renderSlots();
  updateSummarySidebar();
});
