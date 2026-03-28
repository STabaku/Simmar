// ============================================
// SIMAR — My Orders (my-orders.js)
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
  lucide.createIcons();

  // must be logged in
  if (!localStorage.getItem('simar_token')) {
    window.location.href = '/pages/login.html';
    return;
  }

  await loadOrders();
});

async function loadOrders() {
  try {
    const orders = await simarAPI('/api/orders/my');
    renderOrders(orders);
  } catch {
    document.getElementById('orders-list').innerHTML =
      `<div class="empty-state">
         <p>Could not load orders. Please try again.</p>
       </div>`;
  }
}

function renderOrders(orders) {
  const container = document.getElementById('orders-list');

  if (!orders || orders.length === 0) {
    container.innerHTML = `
      <div class="orders-empty">
        <div class="orders-empty-icon">
          <i data-lucide="package-open" width="64" height="64"></i>
        </div>
        <h3 style="font-family:var(--font-heading); color:var(--brown);
                   margin-bottom:0.5rem;">No orders yet</h3>
        <p>When you place an order it will appear here.</p>
        <a href="/pages/bouquets.html" class="btn btn-primary"
           style="margin-top:1.5rem;">
          Browse Bouquets
        </a>
      </div>`;
    lucide.createIcons();
    return;
  }

  container.innerHTML = `
    <div class="orders-list">
      ${orders.map(o => buildOrderCard(o)).join('')}
    </div>`;
  lucide.createIcons();
}

function buildOrderCard(order) {
  const name  = order.bouquetName || order.giftItemName || 'Custom order';
  const date  = new Date(order.createdAt).toLocaleDateString('en-GB', {
    day: 'numeric', month: 'long', year: 'numeric'
  });

  const imgHTML = order.bouquetImageUrl
    ? `<img src="${order.bouquetImageUrl}" alt="${name}"/>`
    : `<i data-lucide="flower-2" width="32" height="32"></i>`;

  return `
    <div class="order-card">
      <div class="order-card-img">${imgHTML}</div>
      <div>
        <div class="order-card-name">${name}</div>
        <div class="order-card-date">
          <i data-lucide="calendar" width="13" height="13"></i>
          ${date}
        </div>
      </div>
      <div class="order-card-price">${order.totalPrice} ALL</div>
    </div>`;
}