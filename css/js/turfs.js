let allTurfs = [];

function renderTurfCard(turf) {
  return `
    <div class="turf-card">
      <div class="turf-img-wrapper">
        <img src="${turf.image}" alt="${turf.name}">
        <span class="turf-badge-sport">${turf.sport}</span>
        <span class="turf-rating">★ ${turf.rating}</span>
      </div>
      <div class="turf-body">
        <div class="turf-location">📍 ${turf.location}</div>
        <h3 class="turf-title">${turf.name}</h3>
        <div class="turf-amenities">
          ${turf.amenities.slice(0, 3).map(a => `<span class="amenity-chip">✓ ${a}</span>`).join('')}
        </div>
        <div class="turf-footer">
          <div class="turf-price">
            <span>Starting at</span>
            <strong>${formatCurrency(turf.pricePerHour)}/hr</strong>
          </div>
          <a href="turf-details.html?id=${turf.id}" class="btn btn-primary btn-sm">Book Slot ➔</a>
        </div>
      </div>
    </div>
  `;
}

function applyFilters() {
  const searchInput = document.getElementById('turfSearchInput')?.value.toLowerCase() || '';
  const sportFilter = document.getElementById('sportFilter')?.value || 'all';
  const priceFilter = parseInt(document.getElementById('priceFilter')?.value || '5000', 10);

  const filtered = allTurfs.filter(turf => {
    const matchesSearch = turf.name.toLowerCase().includes(searchInput) || turf.location.toLowerCase().includes(searchInput);
    const matchesSport = (sportFilter === 'all') || (turf.category === sportFilter) || turf.sport.toLowerCase().includes(sportFilter);
    const matchesPrice = turf.pricePerHour <= priceFilter;
    return matchesSearch && matchesSport && matchesPrice;
  });

  const container = document.getElementById('turfsContainer');
  const countEl = document.getElementById('turfsCount');
  if (container) {
    container.innerHTML = filtered.length > 0 ? filtered.map(renderTurfCard).join('') : '<p style="grid-column:1/-1; text-align:center;">No turfs matched your filters.</p>';
  }
  if (countEl) countEl.innerText = `Showing ${filtered.length} turfs`;
}

document.addEventListener('DOMContentLoaded', () => {
  allTurfs = DB.getTurfs();
  applyFilters();
  document.getElementById('turfSearchInput')?.addEventListener('input', applyFilters);
  document.getElementById('sportFilter')?.addEventListener('change', applyFilters);
  document.getElementById('priceFilter')?.addEventListener('input', (e) => {
    document.getElementById('priceValue').innerText = `₹${e.target.value}`;
    applyFilters();
  });
});
