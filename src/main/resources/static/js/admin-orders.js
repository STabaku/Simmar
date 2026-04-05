// ============================================
// SIMAR — Admin Orders (admin-orders.js)
// ============================================

let searchTerm = '';
const PAGE_SIZE = 10;


let allOrders   = [];
let filtered    = [];
let currentPage = 1;
let currentFilter = 'ALL';

// ── Boot ─────────────────────────────────────
document.addEventListener('DOMContentLoaded', loadOrders);

async function loadOrders() {
  try {
    allOrders = await simarAPI('/api/admin/orders');
window.applyFilter = function (status) {
  filtered = allOrders
    .filter(o => status === 'ALL' || o.status === status)
    .filter(o => {
      if (!searchTerm) return true;
      return (o.userName  || '').toLowerCase().includes(searchTerm) ||
             (o.userEmail || '').toLowerCase().includes(searchTerm);
    });
  renderTable();
  renderPagination();
};
  } catch (err) {
    document.getElementById('orders-tbody').innerHTML =
      `<tr><td colspan="8" style="text-align:center;padding:2rem;color:#842029;">
        Failed to load orders: ${err.message}
       </td></tr>`;
  }
}

// ── Filter ────────────────────────────────────
window.setFilter = function (status, btn) {
  currentFilter = status;
  currentPage   = 1;
  document.querySelectorAll('.filter-btn').forEach(b => b.classList.remove('active'));
  btn.classList.add('active');
  window.applyFilter(status);
};

window.applyFilter = function (status) {
  filtered = status === 'ALL'
    ? [...allOrders]
    : allOrders.filter(o => o.status === status);
  renderTable();
  renderPagination();
}

// ── Render table ──────────────────────────────
function renderTable() {
  const tbody = document.getElementById('orders-tbody');
  const start = (currentPage - 1) * PAGE_SIZE;
  const page  = filtered.slice(start, start + PAGE_SIZE);

  if (page.length === 0) {
    tbody.innerHTML = `<tr><td colspan="8" style="text-align:center;padding:2rem;color:var(--text-light);">
      No orders found.
    </td></tr>`;
    return;
  }

  tbody.innerHTML = page.map(o => {
    const itemName = o.bouquetName || o.giftItemName || '—';
    const details  = [
      o.selectedColor ? `Color: ${o.selectedColor}` : '',
      o.selectedCount ? `Qty: ${o.selectedCount}`   : '',
    ].filter(Boolean).join(' · ') || '—';

    const date = o.createdAt
      ? new Date(o.createdAt).toLocaleDateString('en-GB', { day:'2-digit', month:'short', year:'numeric' })
      : '—';

    const actions = o.status === 'PENDING'
      ? `<button class="action-btn btn-accept"  onclick="acceptOrder(${o.id})">Accept</button>
         <button class="action-btn btn-cancel"  onclick="cancelOrder(${o.id})">Cancel</button>`
      : o.status === 'ACCEPTED'
      ? `<button class="action-btn btn-cancel"  onclick="cancelOrder(${o.id})" disabled style="opacity:0.4;cursor:not-allowed;">Cancel</button>`
      : `<span style="color:var(--text-light);font-size:0.8rem;">—</span>`;

    const notesBtn = o.notes
      ? `<button class="action-btn btn-notes" onclick="showNotes(${JSON.stringify(o.notes).replace(/'/g,"&#39;")})">Notes</button>`
      : '';

    return `<tr>
      <td style="color:var(--text-light);font-size:0.8rem;">#${o.id}</td>
      <td>
        <div style="font-weight:500;color:var(--brown);">${o.userName || '—'}</div>
        <div style="font-size:0.78rem;color:var(--text-light);">${o.userEmail || ''}</div>
      </td>
      <td style="font-weight:500;">${itemName}</td>
      <td style="font-size:0.82rem;color:var(--text-light);">${details}</td>
      <td style="font-weight:600;color:var(--brown);">€${o.totalPrice ?? '0'}</td>
      <td style="font-size:0.82rem;">${date}</td>
      <td><span class="status-badge status-${o.status}">${o.status}</span></td>
      <td style="display:flex;gap:0.4rem;flex-wrap:wrap;align-items:center;">
        ${actions}
        ${notesBtn}
      </td>
    </tr>`;
  }).join('');
}

// ── Pagination ────────────────────────────────
function renderPagination() {
  const total = Math.ceil(filtered.length / PAGE_SIZE);
  const el    = document.getElementById('pagination');

  if (total <= 1) { el.innerHTML = ''; return; }

  let html = '';
  for (let i = 1; i <= total; i++) {
    html += `<button class="page-btn ${i === currentPage ? 'active' : ''}"
               onclick="goPage(${i})">${i}</button>`;
  }
  el.innerHTML = html;
}

window.goPage = function (p) {
  currentPage = p;
  renderTable();
  renderPagination();
  window.scrollTo({ top: 0, behavior: 'smooth' });
};

// ── Actions ───────────────────────────────────
window.acceptOrder = async function (id) {
  try {
    const updated = await simarAPI(`/api/admin/orders/${id}/accept`, { method: 'PUT' });
    updateLocal(updated);
    showToast('Order accepted ✓', 'success');
  } catch (err) {
    showToast(err.message || 'Failed to accept', 'error');
  }
};

window.cancelOrder = async function (id) {
  if (!confirm('Cancel this order?')) return;
  try {
    const updated = await simarAPI(`/api/admin/orders/${id}/cancel`, { method: 'PUT' });
    updateLocal(updated);
    showToast('Order cancelled', 'success');
  } catch (err) {
    showToast(err.message || 'Failed to cancel', 'error');
  }
};

window.updateLocal = function (updated) {
  const idx = allOrders.findIndex(o => o.id === updated.id);
  if (idx !== -1) allOrders[idx] = updated;
  window.applyFilter(currentFilter);
}

// ── Notes modal ───────────────────────────────
window.showNotes = function (notes) {
  document.getElementById('modal-notes-text').textContent = notes;
  document.getElementById('notes-modal').classList.add('open');
};

window.closeModal = function () {
  document.getElementById('notes-modal').classList.remove('open');
};



window.applySearch = function (val) {
  searchTerm = val.toLowerCase().trim();
  currentPage = 1;
  window.applyFilter(currentFilter);
};