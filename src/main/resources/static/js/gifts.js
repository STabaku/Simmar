// ============================================
// SIMAR — Gifts page (gifts.js)
// ============================================

let currentGift = null;

document.addEventListener('DOMContentLoaded', async () => {
  lucide.createIcons();
  initReveal();
  await loadGifts();

  // close modal on overlay click
  document.getElementById('gift-modal')
    .addEventListener('click', e => {
      if (e.target === e.currentTarget) closeModal();
    });

  // close on Escape key
  document.addEventListener('keydown', e => {
    if (e.key === 'Escape') closeModal();
  });
});

async function loadGifts() {
  try {
    const gifts = await simarAPI('/api/gift-items');
    renderGifts(gifts);
  } catch {
    document.getElementById('gifts-grid').innerHTML =
      `<div class="empty-state">
         <i data-lucide="gift" width="48" height="48" class="empty-state-icon"></i>
         <p>No gift items available yet. Check back soon!</p>
       </div>`;
    lucide.createIcons();
  }
}

function renderGifts(gifts) {
  const grid = document.getElementById('gifts-grid');

  if (!gifts || gifts.length === 0) {
    grid.innerHTML =
      `<div class="empty-state">
         <i data-lucide="gift" width="48" height="48" class="empty-state-icon"></i>
         <p>No gift items available yet. Check back soon!</p>
       </div>`;
    lucide.createIcons();
    return;
  }

  grid.innerHTML = gifts.map(g => `
    <div class="bouquet-card reveal" onclick="openModal(${g.id})">
      <div class="bouquet-card-image-wrap">
        ${g.imageUrl
          ? `<img class="bouquet-card-image" src="${g.imageUrl}" alt="${g.name}"
                  onerror="this.style.display='none'"/>`
          : `<div class="img-placeholder">
               <i data-lucide="gift" width="48" height="48"></i>
             </div>`
        }
        <div class="bouquet-card-overlay">
          <button class="bouquet-card-overlay-btn">View Details</button>
        </div>
      </div>
      <div class="bouquet-card-body">
        <div class="bouquet-card-name">${g.name}</div>
        <div class="bouquet-card-price">${g.price} ALL</div>
      </div>
    </div>
  `).join('');

  lucide.createIcons();
  initReveal();

  // store gifts globally so modal can access them
  window._gifts = gifts;
}

function openModal(id) {
  const gift = window._gifts.find(g => g.id === id);
  if (!gift) return;
  currentGift = gift;

  // fill modal
  const imgEl = document.getElementById('modal-img');
  if (gift.imageUrl) {
    imgEl.innerHTML =
      `<img src="${gift.imageUrl}" alt="${gift.name}"
            onerror="this.parentElement.textContent='🎁'"/>`;
  } else {
    imgEl.textContent = '🎁';
  }

  document.getElementById('modal-name').textContent  = gift.name;
  document.getElementById('modal-price').textContent = `${gift.price} ALL`;
  document.getElementById('modal-desc').textContent  =
    gift.description || 'A beautiful complementary gift item.';

  // size / color tags
  const details = [];
  if (gift.size)  details.push(gift.size);
  if (gift.color) details.push(gift.color);
  document.getElementById('modal-details').innerHTML =
    details.map(d => `<span class="modal-detail-tag">${d}</span>`).join('');

  document.getElementById('modal-order-btn').onclick = orderGift;

  document.getElementById('gift-modal').classList.add('open');
  lucide.createIcons();
}

function closeModal() {
  document.getElementById('gift-modal').classList.remove('open');
  currentGift = null;
}

async function orderGift() {
  if (!localStorage.getItem('simar_token')) {
    showToast('Please login to place an order', 'error');
    setTimeout(() => window.location.href = '/pages/login.html', 1000);
    return;
  }

  const btn = document.getElementById('modal-order-btn');
  btn.disabled = true;
  btn.textContent = 'Placing order...';

  try {
    await simarAPI('/api/orders', {
      method: 'POST',
      body: JSON.stringify({
        giftItemId: currentGift.id,
      }),
    });

    showToast('Order placed! 🎁', 'success');
    closeModal();
    setTimeout(() => window.location.href = '/pages/my-orders.html', 1000);

  } catch (err) {
    showToast(err.message || 'Could not place order. Try again.', 'error');
    btn.disabled = false;
    btn.innerHTML =
      '<i data-lucide="shopping-bag" width="16" height="16"></i> Add to Order';
    lucide.createIcons();
  }
}