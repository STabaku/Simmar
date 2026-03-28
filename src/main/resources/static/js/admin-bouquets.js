// ============================================
// SIMAR — Admin Bouquets (admin-bouquets.js)
// ============================================

let editingId   = null;
let optionCount = 0;

document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  loadBouquets();
});

async function loadBouquets() {
  try {
    const bouquets = await simarAPI('/api/admin/bouquets');
    const tbody    = document.getElementById('bouquets-tbody');

    if (!bouquets || bouquets.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="5" style="text-align:center;padding:2rem;color:var(--text-light);">No bouquets yet. Add your first one!</td></tr>';
      return;
    }

    tbody.innerHTML = bouquets.map(b => `
      <tr>
        <td>
          ${b.imageUrl
            ? `<img src="${b.imageUrl}" alt="${b.name}"
                    style="width:52px;height:52px;object-fit:cover;
                           border-radius:8px;"/>`
            : `<div style="width:52px;height:52px;border-radius:8px;
                           background:var(--pink-pale);display:flex;
                           align-items:center;justify-content:center;
                           color:var(--pink);">
                 <i data-lucide="flower-2" width="20" height="20"></i>
               </div>`
          }
        </td>
        <td><strong>${b.name}</strong></td>
        <td>${b.basePrice} ALL</td>
        <td>
          <span class="badge ${b.isAvailable ? 'badge-accepted' : 'badge-cancelled'}">
            ${b.isAvailable ? 'Yes' : 'No'}
          </span>
        </td>
        <td>
          <button class="btn btn-outline"
                  style="padding:0.3rem 0.8rem;font-size:0.8rem;"
                  onclick="editBouquet(${b.id})">
            <i data-lucide="pencil" width="13" height="13"></i> Edit
          </button>
          <button class="btn btn-outline"
                  style="padding:0.3rem 0.8rem;font-size:0.8rem;
                         margin-left:0.4rem;border-color:#e05c5c;color:#e05c5c;"
                  onclick="deleteBouquet(${b.id}, '${b.name}')">
            <i data-lucide="trash-2" width="13" height="13"></i> Delete
          </button>
        </td>
      </tr>`).join('');
    lucide.createIcons();
  } catch {
    showToast('Could not load bouquets', 'error');
  }
}

function openForm() {
  editingId = null;
  optionCount = 0;
  document.getElementById('form-title').textContent = 'Add New Bouquet';
  document.getElementById('f-name').value    = '';
  document.getElementById('f-price').value   = '';
  document.getElementById('f-desc').value    = '';
  document.getElementById('f-image').value   = '';
  document.getElementById('f-available').checked = true;
  document.getElementById('options-list').innerHTML = '';
  document.getElementById('bouquet-form').style.display = 'block';
  document.getElementById('bouquet-form')
    .scrollIntoView({ behavior: 'smooth' });
}

function closeForm() {
  document.getElementById('bouquet-form').style.display = 'none';
  editingId = null;
}

function addOptionRow(color = '', count = '') {
  const id  = optionCount++;
  const div = document.createElement('div');
  div.className = 'option-row';
  div.id = `option-${id}`;
  div.innerHTML = `
    <input class="form-input" placeholder="Color (e.g. Red)"
           id="opt-color-${id}" value="${color}"
           style="flex:1;"/>
    <input class="form-input" type="number" placeholder="Count (e.g. 12)"
           id="opt-count-${id}" value="${count}"
           style="width:120px;"/>
    <button type="button" class="btn btn-outline"
            style="padding:0.4rem 0.7rem;border-color:#e05c5c;color:#e05c5c;"
            onclick="document.getElementById('option-${id}').remove()">
      <i data-lucide="x" width="14" height="14"></i>
    </button>`;
  document.getElementById('options-list').appendChild(div);
  lucide.createIcons();
}

async function editBouquet(id) {
  try {
    const b = await simarAPI(`/api/bouquets/${id}`);
    editingId = id;
    document.getElementById('form-title').textContent = 'Edit Bouquet';
    document.getElementById('f-name').value    = b.name;
    document.getElementById('f-price').value   = b.basePrice;
    document.getElementById('f-desc').value    = b.description || '';
    document.getElementById('f-image').value   = b.imageUrl || '';
    document.getElementById('f-available').checked = b.isAvailable;

    // rebuild options
    optionCount = 0;
    document.getElementById('options-list').innerHTML = '';
    if (b.options) {
      b.options.forEach(o => addOptionRow(o.color, o.flowerCount));
    }

    document.getElementById('bouquet-form').style.display = 'block';
    document.getElementById('bouquet-form')
      .scrollIntoView({ behavior: 'smooth' });
  } catch {
    showToast('Could not load bouquet', 'error');
  }
}

async function saveBouquet() {
  const name  = document.getElementById('f-name').value.trim();
  const price = document.getElementById('f-price').value;

  if (!name || !price) {
    showToast('Name and price are required', 'error');
    return;
  }

  // collect options
  const options = [];
  document.querySelectorAll('.option-row').forEach(row => {
    const id    = row.id.replace('option-', '');
    const color = document.getElementById(`opt-color-${id}`)?.value.trim();
    const count = document.getElementById(`opt-count-${id}`)?.value;
    if (color && count) options.push({ color, flowerCount: parseInt(count) });
  });

  const body = {
    name,
    basePrice:   parseFloat(price),
    description: document.getElementById('f-desc').value,
    imageUrl:    document.getElementById('f-image').value,
    isAvailable: document.getElementById('f-available').checked,
    options,
  };

  try {
    if (editingId) {
      await simarAPI(`/api/admin/bouquets/${editingId}`, {
        method: 'PUT',
        body: JSON.stringify(body),
      });
      showToast('Bouquet updated! ✅', 'success');
    } else {
      await simarAPI('/api/admin/bouquets', {
        method: 'POST',
        body: JSON.stringify(body),
      });
      showToast('Bouquet added! 🌸', 'success');
    }
    closeForm();
    loadBouquets();
  } catch (e) {
    showToast(e.message || 'Could not save bouquet', 'error');
  }
}

async function deleteBouquet(id, name) {
  if (!confirm(`Delete "${name}"? This cannot be undone.`)) return;
  try {
    await simarAPI(`/api/admin/bouquets/${id}`, { method: 'DELETE' });
    showToast('Bouquet deleted.', 'success');
    loadBouquets();
  } catch (e) {
    showToast(e.message, 'error');
  }
}