// ============================================
// SIMAR — Admin Dashboard (admin-dashboard.js)
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
  lucide.createIcons();
  await Promise.all([loadStats(), loadOrders()]);
});

async function loadStats() {
  try {
    const d = await simarAPI('/api/admin/dashboard');
    document.getElementById('stat-cards').innerHTML = `
      <div class="stat-card">
        <div class="stat-icon pink">
          <i data-lucide="package" width="22" height="22"></i>
        </div>
        <div>
          <div class="stat-value">${d.totalOrders}</div>
          <div class="stat-label">Total Orders</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon peach">
          <i data-lucide="clock" width="22" height="22"></i>
        </div>
        <div>
          <div class="stat-value">${d.pendingOrders}</div>
          <div class="stat-label">Pending</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon green">
          <i data-lucide="check-circle" width="22" height="22"></i>
        </div>
        <div>
          <div class="stat-value">${d.acceptedOrders}</div>
          <div class="stat-label">Accepted</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon purple">
          <i data-lucide="x-circle" width="22" height="22"></i>
        </div>
        <div>
          <div class="stat-value">${d.cancelledOrders}</div>
          <div class="stat-label">Cancelled</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon pink">
          <i data-lucide="users" width="22" height="22"></i>
        </div>
        <div>
          <div class="stat-value">${d.totalUsers}</div>
          <div class="stat-label">Total Users</div>
        </div>
      </div>
      <div class="stat-card">
        <div class="stat-icon green">
          <i data-lucide="flower-2" width="22" height="22"></i>
        </div>
        <div>
          <div class="stat-value">${d.totalBouquets}</div>
          <div class="stat-label">Bouquets</div>
        </div>
      </div>`;
    lucide.createIcons();
  } catch {
    document.getElementById('stat-cards').innerHTML =
      '<p style="color:var(--text-light)">Could not load stats.</p>';
  }
}

async function loadOrders() {
  try {
    const orders = await simarAPI('/api/admin/orders');
    const tbody  = document.getElementById('orders-tbody');

    if (!orders || orders.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="6" style="text-align:center;padding:2rem;color:var(--text-light);">No orders yet</td></tr>';
      return;
    }

    tbody.innerHTML = orders.map(o => `
      <tr>
        <td>
          <strong>${o.userName}</strong><br/>
          <span style="font-size:0.8rem;color:var(--text-light);">${o.userEmail}</span>
        </td>
        <td>${o.bouquetName || o.giftItemName || '—'}</td>
        <td><strong>${o.totalPrice} ALL</strong></td>
        <td style="font-size:0.85rem;color:var(--text-light);">
          ${new Date(o.createdAt).toLocaleDateString('en-GB')}
        </td>
        <td><span class="badge badge-${o.status.toLowerCase()}">${o.status}</span></td>
        <td>
          ${o.status === 'PENDING' ? `
            <button class="btn btn-dark"
                    style="padding:0.3rem 0.8rem;font-size:0.8rem;"
                    onclick="acceptOrder(${o.id})">
              Accept
            </button>
            <button class="btn btn-outline"
                    style="padding:0.3rem 0.8rem;font-size:0.8rem;margin-left:0.4rem;"
                    onclick="cancelOrder(${o.id})">
              Cancel
            </button>` : '—'}
        </td>
      </tr>`).join('');
    lucide.createIcons();
  } catch {
    document.getElementById('orders-tbody').innerHTML =
      '<tr><td colspan="6" style="text-align:center;padding:2rem;">Could not load orders.</td></tr>';
  }
}

async function acceptOrder(id) {
  try {
    await simarAPI(`/api/admin/orders/${id}/accept`, { method: 'PUT' });
    showToast('Order accepted! ✅', 'success');
    loadOrders();
    loadStats();
  } catch (e) {
    showToast(e.message, 'error');
  }
}

async function cancelOrder(id) {
  try {
    await simarAPI(`/api/admin/orders/${id}/cancel`, { method: 'PUT' });
    showToast('Order cancelled.', 'success');
    loadOrders();
    loadStats();
  } catch (e) {
    showToast(e.message, 'error');
  }
}
