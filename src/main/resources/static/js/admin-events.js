// ============================================
// SIMAR — Admin Events (admin-events.js)
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  loadEvents();
});

async function loadEvents() {
  try {
    const events  = await simarAPI('/api/events');
    const container = document.getElementById('events-list');

    if (!events || events.length === 0) {
      container.innerHTML =
        `<div class="empty-state">
           <i data-lucide="calendar-heart" width="48" height="48"
              class="empty-state-icon"></i>
           <p>No event categories yet. Add your first one!</p>
         </div>`;
      lucide.createIcons();
      return;
    }

    container.innerHTML = events.map(e => `
      <div class="admin-form-card" style="margin-bottom:1rem;">
        <div style="display:flex;align-items:center;
                    justify-content:space-between;gap:1rem;flex-wrap:wrap;">
          <div>
            <strong style="font-family:var(--font-heading);
                           font-size:1.1rem;color:var(--brown);">
              ${e.name}
            </strong>
            <p style="font-size:0.88rem;color:var(--text-light);margin-top:0.3rem;">
              ${e.description || 'No description'}
            </p>
            <p style="font-size:0.82rem;color:var(--pink);margin-top:0.3rem;">
              ${e.photos ? e.photos.length : 0} photo(s)
            </p>
          </div>
          <div style="display:flex;gap:0.6rem;flex-wrap:wrap;">
            <button class="btn btn-outline"
                    style="padding:0.3rem 0.8rem;font-size:0.8rem;"
                    onclick="toggleAddPhoto(${e.id})">
              <i data-lucide="image-plus" width="13" height="13"></i>
              Add Photo
            </button>
            <button class="btn btn-outline"
                    style="padding:0.3rem 0.8rem;font-size:0.8rem;
                           border-color:#e05c5c;color:#e05c5c;"
                    onclick="deleteEvent(${e.id}, '${e.name}')">
              <i data-lucide="trash-2" width="13" height="13"></i>
              Delete
            </button>
          </div>
        </div>

        <!-- inline add photo form (hidden by default) -->
        <div id="photo-form-${e.id}"
             style="display:none;margin-top:1rem;padding-top:1rem;
                    border-top:1px solid var(--pink-light);">
          <div style="display:flex;gap:0.8rem;align-items:flex-end;flex-wrap:wrap;">
            <div class="form-group" style="flex:1;margin-bottom:0;">
              <label class="form-label">Photo URL</label>
              <input class="form-input" id="photo-url-${e.id}"
                     placeholder="https://... (Cloudinary URL)"/>
            </div>
            <div class="form-group" style="flex:1;margin-bottom:0;">
              <label class="form-label">Caption (optional)</label>
              <input class="form-input" id="photo-caption-${e.id}"
                     placeholder="e.g. Wedding at Tirana"/>
            </div>
            <button class="btn btn-primary"
                    style="margin-bottom:0;"
                    onclick="addPhoto(${e.id})">
              Save
            </button>
          </div>
        </div>

      </div>`).join('');

    lucide.createIcons();
  } catch {
    showToast('Could not load events', 'error');
  }
}

function toggleAddPhoto(id) {
  const form = document.getElementById(`photo-form-${id}`);
  form.style.display = form.style.display === 'none' ? 'block' : 'none';
}

async function addEvent() {
  const name  = document.getElementById('e-name').value.trim();
  const desc  = document.getElementById('e-desc').value.trim();
  const photo = document.getElementById('e-photo').value.trim();

  if (!name) {
    showToast('Category name is required', 'error');
    return;
  }

  try {
    const created = await simarAPI('/api/admin/events', {
      method: 'POST',
      body: JSON.stringify({ name, description: desc }),
    });

    // add first photo if provided
    if (photo && created.id) {
      await simarAPI(`/api/admin/events/${created.id}/photos`, {
        method: 'POST',
        body: JSON.stringify({ imageUrl: photo }),
      });
    }

    showToast('Event category added! ✅', 'success');
    document.getElementById('e-name').value  = '';
    document.getElementById('e-desc').value  = '';
    document.getElementById('e-photo').value = '';
    loadEvents();
  } catch (e) {
    showToast(e.message, 'error');
  }
}

async function addPhoto(eventId) {
  const url     = document.getElementById(`photo-url-${eventId}`).value.trim();
  const caption = document.getElementById(`photo-caption-${eventId}`).value.trim();

  if (!url) {
    showToast('Photo URL is required', 'error');
    return;
  }

  try {
    await simarAPI(`/api/admin/events/${eventId}/photos`, {
      method: 'POST',
      body: JSON.stringify({ imageUrl: url, caption }),
    });
    showToast('Photo added! 📸', 'success');
    loadEvents();
  } catch (e) {
    showToast(e.message, 'error');
  }
}

async function deleteEvent(id, name) {
  if (!confirm(`Delete "${name}" and all its photos?`)) return;
  try {
    await simarAPI(`/api/admin/events/${id}`, { method: 'DELETE' });
    showToast('Event deleted.', 'success');
    loadEvents();
  } catch (e) {
    showToast(e.message, 'error');
  }
}