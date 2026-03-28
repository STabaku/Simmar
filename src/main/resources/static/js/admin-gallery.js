// ============================================
// admin-gallery.js
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  loadGallery();
});

async function loadGallery() {
  try {
    const photos = await simarAPI('/api/admin/gallery');
    const grid   = document.getElementById('gallery-grid');

    if (!photos || photos.length === 0) {
      grid.innerHTML =
        `<div class="empty-state">
           <i data-lucide="image" width="48" height="48" class="empty-state-icon"></i>
           <p>No client photos yet. Add your first one!</p>
         </div>`;
      lucide.createIcons();
      return;
    }

    grid.innerHTML = photos.map(p => `
      <div class="bouquet-card">
        <div class="bouquet-card-image-wrap">
          <img class="bouquet-card-image" src="${p.imageUrl}"
               alt="${p.caption || 'Client photo'}"
               onerror="this.style.display='none'"/>
          <div class="bouquet-card-overlay">
            <button class="bouquet-card-overlay-btn"
                    onclick="deletePhoto(${p.id})">
              Delete
            </button>
          </div>
        </div>
        <div class="bouquet-card-body">
          <div class="bouquet-card-name"
               style="font-size:0.88rem;">
            ${p.caption || 'No caption'}
          </div>
          <div style="font-size:0.78rem;color:var(--text-light);">
            ${new Date(p.uploadedAt).toLocaleDateString('en-GB')}
          </div>
        </div>
      </div>`).join('');
    lucide.createIcons();
  } catch {
    showToast('Could not load gallery', 'error');
  }
}

async function addPhoto() {
  const url     = document.getElementById('g-url').value.trim();
  const caption = document.getElementById('g-caption').value.trim();

  if (!url) {
    showToast('Image URL is required', 'error');
    return;
  }

  try {
    await simarAPI('/api/admin/gallery', {
      method: 'POST',
      body: JSON.stringify({ imageUrl: url, caption }),
    });
    showToast('Photo added! 📸', 'success');
    document.getElementById('g-url').value     = '';
    document.getElementById('g-caption').value = '';
    loadGallery();
  } catch (e) {
    showToast(e.message, 'error');
  }
}

async function deletePhoto(id) {
  if (!confirm('Delete this photo?')) return;
  try {
    await simarAPI(`/api/admin/gallery/${id}`, { method: 'DELETE' });
    showToast('Photo deleted.', 'success');
    loadGallery();
  } catch (e) {
    showToast(e.message, 'error');
  }
}