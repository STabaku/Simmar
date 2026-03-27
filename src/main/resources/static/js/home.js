// ============================================
// SIMAR — Homepage Logic (home.js)
// ============================================

const BOUQUETS_PER_PAGE = 8;
let currentPage = 1;
let allBouquets = [];
let carouselIndex = 0;
let carouselSlides = [];

document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  initReveal();
  spawnPetals();
  loadBouquets();
  loadGallery();
});

// ── Falling petals ────────────────────────
function spawnPetals() {
  const container = document.getElementById('petals-container');
  if (!container) return;
  const emojis = ['🌸', '🌺', '💮', '🌷', '✿'];
  for (let i = 0; i < 12; i++) {
    const p = document.createElement('div');
    p.className = 'petal';
    p.textContent = emojis[Math.floor(Math.random() * emojis.length)];
    p.style.left = Math.random() * 100 + 'vw';
    p.style.animationDuration = (6 + Math.random() * 8) + 's';
    p.style.animationDelay = (Math.random() * 10) + 's';
    p.style.fontSize = (0.9 + Math.random() * 0.8) + 'rem';
    container.appendChild(p);
  }
}

// ── Bouquets ──────────────────────────────
async function loadBouquets() {
  try {
    allBouquets = await simarAPI('/api/bouquets');
    renderBouquets();
  } catch (e) {
    document.getElementById('bouquets-grid').innerHTML =
      `<div class="empty-state">
         <i data-lucide="flower-2" width="48" height="48" class="empty-state-icon"></i>
         <p>Could not load bouquets. Please try again.</p>
       </div>`;
    lucide.createIcons();
  }
}

function renderBouquets() {
  const grid = document.getElementById('bouquets-grid');
  const start = (currentPage - 1) * BOUQUETS_PER_PAGE;
  const pageBouquets = allBouquets.slice(start, start + BOUQUETS_PER_PAGE);

  if (allBouquets.length === 0) {
    grid.innerHTML =
      `<div class="empty-state">
         <i data-lucide="flower-2" width="48" height="48" class="empty-state-icon"></i>
         <p>No bouquets yet. Check back soon!</p>
       </div>`;
    lucide.createIcons();
    return;
  }

  grid.innerHTML = pageBouquets.map(b => buildBouquetCard(b)).join('');
  renderPagination();
  lucide.createIcons();
  initReveal();
}

function buildBouquetCard(b) {
  const img = b.imageUrl
    ? `<img class="bouquet-card-image" src="${b.imageUrl}" alt="${b.name}"
            onerror="this.classList.add('hidden')"/>`
    : `<div class="img-placeholder">
         <i data-lucide="flower-2" width="48" height="48"></i>
       </div>`;

  return `
    <div class="bouquet-card reveal" onclick="window.location='/pages/bouquet-detail.html?id=${b.id}'">
      <div class="bouquet-card-image-wrap">
        ${img}
        <div class="bouquet-card-overlay">
          <button class="bouquet-card-overlay-btn">View Details</button>
        </div>
        <span class="bouquet-card-badge">Handmade</span>
      </div>
      <div class="bouquet-card-body">
        <div class="bouquet-card-name">${b.name}</div>
        <div class="bouquet-card-price">${b.basePrice} ALL</div>
      </div>
    </div>`;
}

function renderPagination() {
  const total = Math.ceil(allBouquets.length / BOUQUETS_PER_PAGE);
  const container = document.getElementById('pagination');
  if (total <= 1) { container.innerHTML = ''; return; }

  let html = '';
  for (let i = 1; i <= total; i++) {
    html += `<button class="page-btn ${i === currentPage ? 'active' : ''}"
               onclick="goToPage(${i})">${i}</button>`;
  }
  container.innerHTML = html;
}

function goToPage(page) {
  currentPage = page;
  renderBouquets();
  document.querySelector('.bouquets-section').scrollIntoView({ behavior: 'smooth' });
}

// ── Gallery carousel ─────────────────────
async function loadGallery() {
  try {
    const photos = await simarAPI('/api/gallery');
    renderCarousel(photos);
  } catch {
    // silently fail — gallery is optional
    renderCarousel([]);
  }
}

function renderCarousel(photos) {
  const track = document.getElementById('gallery-track');
  const dotsEl = document.getElementById('carousel-dots');

  if (!photos || photos.length === 0) {
    track.innerHTML =
      `<div class="carousel-placeholder">
         <i data-lucide="camera" width="36" height="36"></i>
         <p>Client photos coming soon!</p>
       </div>
       <div class="carousel-placeholder">
         <i data-lucide="heart" width="36" height="36"></i>
         <p>Share your bouquet with us</p>
       </div>
       <div class="carousel-placeholder">
         <i data-lucide="flower-2" width="36" height="36"></i>
         <p>Tag us on Instagram</p>
       </div>`;
    lucide.createIcons();
    return;
  }

  carouselSlides = photos;
  track.innerHTML = photos.map(p =>
    `<div class="carousel-slide">
       <img src="${p.imageUrl}" alt="${p.caption || 'Customer photo'}"
            onerror="this.src='/images/placeholder.jpg'"/>
     </div>`
  ).join('');

  dotsEl.innerHTML = photos.map((_, i) =>
    `<button class="carousel-dot ${i === 0 ? 'active' : ''}"
              onclick="goToSlide(${i})"></button>`
  ).join('');

  document.getElementById('carousel-prev').addEventListener('click', () => {
    goToSlide(carouselIndex === 0 ? carouselSlides.length - 1 : carouselIndex - 1);
  });
  document.getElementById('carousel-next').addEventListener('click', () => {
    goToSlide(carouselIndex === carouselSlides.length - 1 ? 0 : carouselIndex + 1);
  });

  // auto-advance every 4 seconds
  setInterval(() => {
    goToSlide(carouselIndex === carouselSlides.length - 1 ? 0 : carouselIndex + 1);
  }, 4000);
}

function goToSlide(index) {
  carouselIndex = index;
  const track = document.getElementById('gallery-track');
  const slideWidth = 300 + 19.2; // slide width + gap
  track.style.transform = `translateX(-${index * slideWidth}px)`;

  document.querySelectorAll('.carousel-dot').forEach((d, i) => {
    d.classList.toggle('active', i === index);
  });
}