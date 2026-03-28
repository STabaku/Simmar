// ============================================
// SIMAR — Bouquets Catalog (bouquets.js)
// ============================================

const PER_PAGE = 12;
let allBouquets  = [];
let filtered     = [];
let currentPage  = 1;
let activeColor  = 'all';

document.addEventListener('DOMContentLoaded', async () => {
  lucide.createIcons();
  initReveal();
  await loadBouquets();

  document.getElementById('price-sort')
    .addEventListener('change', e => {
      sortBouquets(e.target.value);
    });
});

async function loadBouquets() {
  try {
    allBouquets = await simarAPI('/api/bouquets');
    filtered = [...allBouquets];
    buildColorFilters();
    renderGrid();
  } catch {
    document.getElementById('bouquets-grid').innerHTML =
      `<div class="empty-state">
         <i data-lucide="flower-2" width="48" height="48" class="empty-state-icon"></i>
         <p>Could not load bouquets. Please try again.</p>
       </div>`;
    lucide.createIcons();
  }
}

// extract unique colors from all bouquet options
function buildColorFilters() {
  const colors = new Set();
  allBouquets.forEach(b => {
    if (b.options) b.options.forEach(o => colors.add(o.color));
  });

  const container = document.getElementById('color-filters');
  colors.forEach(color => {
    const btn = document.createElement('button');
    btn.className = 'filter-chip';
    btn.dataset.color = color;
    btn.textContent = color;
    btn.addEventListener('click', () => filterByColor(color, btn));
    container.appendChild(btn);
  });

  // all button click
  container.querySelector('[data-color="all"]')
    .addEventListener('click', (e) => filterByColor('all', e.target));
}

function filterByColor(color, btn) {
  activeColor = color;
  document.querySelectorAll('.filter-chip')
    .forEach(c => c.classList.remove('active'));
  btn.classList.add('active');

  filtered = color === 'all'
    ? [...allBouquets]
    : allBouquets.filter(b =>
        b.options && b.options.some(o => o.color === color)
      );

  currentPage = 1;
  renderGrid();
}

function sortBouquets(value) {
  if (value === 'asc') {
    filtered.sort((a, b) => a.basePrice - b.basePrice);
  } else if (value === 'desc') {
    filtered.sort((a, b) => b.basePrice - a.basePrice);
  } else {
    // restore original order
    filtered = activeColor === 'all'
      ? [...allBouquets]
      : allBouquets.filter(b =>
          b.options && b.options.some(o => o.color === activeColor)
        );
  }
  currentPage = 1;
  renderGrid();
}

function renderGrid() {
  const grid  = document.getElementById('bouquets-grid');
  const start = (currentPage - 1) * PER_PAGE;
  const page  = filtered.slice(start, start + PER_PAGE);

  if (filtered.length === 0) {
    grid.innerHTML =
      `<div class="empty-state">
         <i data-lucide="search-x" width="48" height="48" class="empty-state-icon"></i>
         <p>No bouquets found for this filter.</p>
       </div>`;
    document.getElementById('pagination').innerHTML = '';
    lucide.createIcons();
    return;
  }

  grid.innerHTML = page.map(b => `
    <div class="bouquet-card reveal"
         onclick="window.location='/pages/bouquet-detail.html?id=${b.id}'">
      <div class="bouquet-card-image-wrap">
        ${b.imageUrl
          ? `<img class="bouquet-card-image" src="${b.imageUrl}" alt="${b.name}"
                  onerror="this.style.display='none'"/>`
          : `<div class="img-placeholder">
               <i data-lucide="flower-2" width="48" height="48"></i>
             </div>`
        }
        <div class="bouquet-card-overlay">
          <button class="bouquet-card-overlay-btn">View Details</button>
        </div>
        <span class="bouquet-card-badge">Handmade</span>
      </div>
      <div class="bouquet-card-body">
        <div class="bouquet-card-name">${b.name}</div>
        <div class="bouquet-card-price">${b.basePrice} ALL</div>
      </div>
    </div>
  `).join('');

  renderPagination();
  lucide.createIcons();
  initReveal();
}

function renderPagination() {
  const total = Math.ceil(filtered.length / PER_PAGE);
  const el    = document.getElementById('pagination');
  if (total <= 1) { el.innerHTML = ''; return; }

  let html = '';
  for (let i = 1; i <= total; i++) {
    html += `<button class="page-btn ${i === currentPage ? 'active' : ''}"
               onclick="goToPage(${i})">${i}</button>`;
  }
  el.innerHTML = html;
}

function goToPage(page) {
  currentPage = page;
  renderGrid();
  window.scrollTo({ top: 0, behavior: 'smooth' });
}