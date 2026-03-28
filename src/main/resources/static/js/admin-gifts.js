// ============================================
// SIMAR — Admin Gifts (admin-gifts.js)
// ============================================

let editingId = null;

document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  loadGifts();
});

async function loadGifts() {
  try {
    const gifts = await simarAPI('/api/gift-items');
    const tbody = document.getElementById('gifts-tbody');

    if (!gifts || gifts.length === 0) {
      tbody.innerHTML =
        `<tr><td colspan="7"
               style="text-align:center;padding:2rem;color:var(--text-light);">
           No gift items yet. Add your first one!
         </td></tr>`;
      return;
    }

    tbody.innerHTML = gifts.map(g => `
      <tr>
        <td>
          ${g.imageUrl
            ? `<img src="${g.imageUrl}" alt="${g.name}"
                    style="width:52px;height:52px;object-fit:cover;
                           border-radius:8px;"/>`
            : `<div style="width:52px;height:52px;border-radius:8px;
                           background:var(--pink-pale);display:flex;
                           align-items:center;justify-content:center;
                           color:var(--pink);">
                 <i data-lucide="gift" width="20" height="20"></i>
               </div>`
          }
        </td>
        <td><strong>${g.name}</strong></td>
        <td>${g.price} ALL</td>
        <td>${g.size || '—'}</td>
        <td>${g.color || '—'}</td>
        <td>
          <span class="badge ${g.isAvailable
            ? 'badge-accepted'
            : 'badge-cancelled'}">
            ${g.isAvailable ? 'Yes' : 'No'}
          </span>
        </td>
        <td>
          <button class="btn btn-outline"
                  style="padding:0.3rem 0.8rem;font-size:0.8rem;"
                  onclick="editGift(${g.id})">
            <i data-lucide="pencil" width="13" height="13"></i> Edit
          </button>
          <button class="btn btn-outline"
                  style="padding:0.3rem 0.8rem;font-size:0.8rem;
                         margin-left:0.4rem;border-color:#e05c5c;color:#e05c5c;"
                  onclick="deleteGift(${g.id}, '${g.name}')">
            <i data-lucide="trash-2" width="13" height="13"></i> Delete
          </button>
        </td>
      </tr>`).join('');

    lucide.createIcons();
  } catch {
    showToast('Could not load gift items', 'error');
  }
}

function openForm() {
  editingId = null;
  document.getElementById('form-title').textContent = 'Add Gift Item';
  document.getElementById('g-name').value      = '';
  document.getElementById('g-price').value     = '';
  document.getElementById('g-size').value      = '';
  document.getElementById('g-color').value     = '';
  document.getElementById('g-desc').value      = '';
  document.getElementById('g-image').value     = '';
  document.getElementById('g-available').checked = true;
  document.getElementById('gift-form').style.display = 'block';
  document.getElementById('gift-form')
    .scrollIntoView({ behavior: 'smooth' });
}

function closeForm() {
  document.getElementById('gift-form').style.display = 'none';
  editingId = null;
}

async function editGift(id) {
  try {
    const g = await simarAPI(`/api/gift-items/${id}`);
    editingId = id;
    document.getElementById('form-title').textContent = 'Edit Gift Item';
    document.getElementById('g-name').value      = g.name;
    document.getElementById('g-price').value     = g.price;
    document.getElementById('g-size').value      = g.size || '';
    document.getElementById('g-color').value     = g.color || '';
    document.getElementById('g-desc').value      = g.description || '';
    document.getElementById('g-image').value     = g.imageUrl || '';
    document.getElementById('g-available').checked = g.isAvailable;
    document.getElementById('gift-form').style.display = 'block';
    document.getElementById('gift-form')
      .scrollIntoView({ behavior: 'smooth' });
  } catch {
    showToast('Could not load gift item', 'error');
  }
}

async function saveGift() {
  const name  = document.getElementById('g-name').value.trim();
  const price = document.getElementById('g-price').value;

  if (!name || !price) {
    showToast('Name and price are required', 'error');
    return;
  }

  const body = {
    name,
    price:       parseFloat(price),
    size:        document.getElementById('g-size').value.trim(),
    color:       document.getElementById('g-color').value.trim(),
    description: document.getElementById('g-desc').value.trim(),
    imageUrl:    document.getElementById('g-image').value.trim(),
    isAvailable: document.getElementById('g-available').checked,
  };

  try {
    const endpoint = editingId
      ? `/api/admin/gift-items/${editingId}`
      : '/api/admin/gift-items';
    const method = editingId ? 'PUT' : 'POST';

    await simarAPI(endpoint, { method, body: JSON.stringify(body) });
    showToast(editingId ? 'Gift updated! ✅' : 'Gift added! 🎁', 'success');
    closeForm();
    loadGifts();
  } catch (e) {
    showToast(e.message || 'Could not save gift item', 'error');
  }
}

async function deleteGift(id, name) {
  if (!confirm(`Delete "${name}"?`)) return;
  try {
    await simarAPI(`/api/admin/gift-items/${id}`, { method: 'DELETE' });
    showToast('Gift item deleted.', 'success');
    loadGifts();
  } catch (e) {
    showToast(e.message, 'error');
  }
}