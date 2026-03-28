// ============================================
// SIMAR — Bouquet Detail (bouquet-detail.js)
// ============================================

let bouquet       = null;
let selectedColor = null;
let selectedCount = null;

document.addEventListener('DOMContentLoaded', async () => {
  lucide.createIcons();
  const id = new URLSearchParams(window.location.search).get('id');
  if (!id) {
    window.location.href = '/pages/bouquets.html';
    return;
  }
  await loadBouquet(id);
});

async function loadBouquet(id) {
  try {
    bouquet = await simarAPI(`/api/bouquets/${id}`);
    renderDetail();
  } catch {
    document.getElementById('detail-content').innerHTML =
      `<div class="empty-state">
         <p>Bouquet not found.</p>
         <a href="/pages/bouquets.html" class="btn btn-primary" style="margin-top:1rem;">
           Back to bouquets
         </a>
       </div>`;
    lucide.createIcons();
  }
}

function renderDetail() {
  document.title = `${bouquet.name} — SIMAR`;

  const imgHTML = bouquet.imageUrl
    ? `<img src="${bouquet.imageUrl}" alt="${bouquet.name}"
            onerror="this.style.display='none'"/>`
    : `<i data-lucide="flower-2" width="80" height="80"></i>`;

  const colorsHTML = bouquet.options && bouquet.options.length > 0
    ? [...new Set(bouquet.options.map(o => o.color))].map(c => `
        <button class="color-chip" data-color="${c}"
                onclick="selectColor('${c}', this)">${c}</button>
      `).join('')
    : '<p style="color:var(--text-light);font-size:0.9rem;">No color options available</p>';

  const countsHTML = bouquet.options && bouquet.options.length > 0
    ? [...new Set(bouquet.options.map(o => o.flowerCount))].map(n => `
        <button class="count-chip" data-count="${n}"
                onclick="selectCount(${n}, this)">${n}</button>
      `).join('')
    : '';

  document.getElementById('detail-content').innerHTML = `

    <!-- Left: image -->
    <div class="detail-image-wrap">${imgHTML}</div>

    <!-- Right: info -->
    <div class="detail-info">

      <span class="detail-badge">
        <i data-lucide="check-circle" width="12" height="12"></i>
        Handmade &amp; ready to order
      </span>

      <h1 class="detail-name">${bouquet.name}</h1>
      <div class="detail-price">${bouquet.basePrice} ALL</div>

      <p class="detail-description">
        ${bouquet.description || 'A beautiful handmade pipe cleaner bouquet crafted with love.'}
      </p>

      <!-- Color picker -->
      <div class="detail-option-title">Choose a color</div>
      <div class="color-options">${colorsHTML}</div>

      <!-- Flower count picker -->
      ${countsHTML ? `
        <div class="detail-option-title">Number of flowers</div>
        <div class="count-options">${countsHTML}</div>
      ` : ''}

      <!-- Live total -->
      <div class="detail-total" id="total-display" style="display:none;">
        Total: <span id="total-price">0 ALL</span>
      </div>

      <!-- Note -->
      <textarea class="detail-note" id="order-note"
                placeholder="Any special requests? (optional)"></textarea>

      <!-- Order button -->
      <button class="btn btn-primary btn-full" id="order-btn" onclick="placeOrder()">
        <i data-lucide="shopping-bag" width="16" height="16"></i>
        Order Now
      </button>

      <p style="font-size:0.8rem; color:var(--text-light);
                text-align:center; margin-top:0.8rem;">
        Payment is made hand to hand upon delivery
      </p>

    </div>
  `;

  lucide.createIcons();
}

function selectColor(color, btn) {
  selectedColor = color;
  document.querySelectorAll('.color-chip')
    .forEach(c => c.classList.remove('selected'));
  btn.classList.add('selected');
  updateTotal();
}

function selectCount(count, btn) {
  selectedCount = count;
  document.querySelectorAll('.count-chip')
    .forEach(c => c.classList.remove('selected'));
  btn.classList.add('selected');
  updateTotal();
}

function updateTotal() {
  if (!selectedCount) return;
  const total = bouquet.basePrice * selectedCount;
  document.getElementById('total-display').style.display = 'block';
  document.getElementById('total-price').textContent = `${total} ALL`;
}

async function placeOrder() {
  // redirect to login if not logged in
  const token = localStorage.getItem('simar_token');
  if (!token) {
    showToast('Please login to place an order', 'error');
    setTimeout(() => {
      window.location.href = '/pages/login.html';
    }, 1000);
    return;
  }

  if (!selectedColor) {
    showToast('Please select a color', 'error');
    return;
  }
  if (!selectedCount) {
    showToast('Please select number of flowers', 'error');
    return;
  }

  const btn = document.getElementById('order-btn');
  btn.disabled = true;
  btn.textContent = 'Placing order...';

  try {
    await simarAPI('/api/orders', {
      method: 'POST',
      body: JSON.stringify({
        bouquetId:     bouquet.id,
        selectedColor: selectedColor,
        selectedCount: selectedCount,
        notes:         document.getElementById('order-note').value,
      }),
    });

    showToast('Order placed successfully! 🌸', 'success');
    setTimeout(() => {
      window.location.href = '/pages/my-orders.html';
    }, 1200);

  } catch (err) {
    showToast(err.message || 'Could not place order. Try again.', 'error');
    btn.disabled = false;
    btn.innerHTML =
      '<i data-lucide="shopping-bag" width="16" height="16"></i> Order Now';
    lucide.createIcons();
  }
}