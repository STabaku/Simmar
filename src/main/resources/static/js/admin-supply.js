// ============================================
// admin-supply.js
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  // default date to today
  document.getElementById('s-date').value =
    new Date().toISOString().split('T')[0];
  loadSupplies();
});

async function loadSupplies() {
  try {
    const supplies = await simarAPI('/api/admin/supply');
    const tbody    = document.getElementById('supply-tbody');

    if (!supplies || supplies.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="5" style="text-align:center;padding:2rem;color:var(--text-light);">No purchases logged yet.</td></tr>';
      document.getElementById('total-spent').textContent = '0';
      return;
    }

    // calculate total
    const total = supplies.reduce((sum, s) => sum + s.pricePaid, 0);
    document.getElementById('total-spent').textContent =
      total.toLocaleString() + ' ALL';

    tbody.innerHTML = supplies.map(s => `
      <tr>
        <td><strong>${s.productName}</strong></td>
        <td>${s.quantity} ${s.unit}</td>
        <td>${s.pricePaid} ALL</td>
        <td style="font-size:0.83rem;color:var(--text-light);">${s.datePurchased}</td>
        <td style="font-size:0.85rem;color:var(--text-light);">${s.notes || '—'}</td>
      </tr>`).join('');
  } catch {
    showToast('Could not load supplies', 'error');
  }
}

async function addSupply() {
  const name  = document.getElementById('s-name').value.trim();
  const qty   = document.getElementById('s-qty').value;
  const unit  = document.getElementById('s-unit').value.trim();
  const price = document.getElementById('s-price').value;
  const date  = document.getElementById('s-date').value;

  if (!name || !qty || !unit || !price || !date) {
    showToast('Please fill in all required fields', 'error');
    return;
  }

  try {
    await simarAPI('/api/admin/supply', {
      method: 'POST',
      body: JSON.stringify({
        productName:   name,
        quantity:      parseInt(qty),
        unit,
        pricePaid:     parseFloat(price),
        datePurchased: date,
        notes:         document.getElementById('s-notes').value,
      }),
    });
    showToast('Purchase logged! ✅', 'success');
    document.getElementById('s-name').value  = '';
    document.getElementById('s-qty').value   = '';
    document.getElementById('s-unit').value  = '';
    document.getElementById('s-price').value = '';
    document.getElementById('s-notes').value = '';
    loadSupplies();
  } catch (e) {
    showToast(e.message, 'error');
  }
}