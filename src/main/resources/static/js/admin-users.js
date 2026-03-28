// ============================================
// admin-users.js
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  loadUsers();
});

async function loadUsers() {
  try {
    const users = await simarAPI('/api/admin/users');
    const tbody = document.getElementById('users-tbody');

    if (!users || users.length === 0) {
      tbody.innerHTML =
        '<tr><td colspan="6" style="text-align:center;padding:2rem;color:var(--text-light);">No users yet</td></tr>';
      return;
    }

    tbody.innerHTML = users.map(u => `
      <tr>
        <td><strong>${u.name}</strong></td>
        <td>${u.email}</td>
        <td><span class="badge ${u.role === 'ADMIN' ? 'badge-accepted' : 'badge-pending'}">${u.role}</span></td>
        <td style="font-size:0.83rem;color:var(--text-light);">
          ${new Date(u.createdAt).toLocaleDateString('en-GB')}
        </td>
        <td>
          <span class="badge ${u.isActive ? 'badge-accepted' : 'badge-cancelled'}">
            ${u.isActive ? 'Active' : 'Inactive'}
          </span>
        </td>
        <td>
          ${u.isActive && u.role !== 'ADMIN' ? `
            <button class="btn btn-outline"
                    style="padding:0.3rem 0.8rem;font-size:0.8rem;
                           border-color:#e05c5c;color:#e05c5c;"
                    onclick="deactivateUser(${u.id}, '${u.name}')">
              Deactivate
            </button>` : '—'}
        </td>
      </tr>`).join('');
    lucide.createIcons();
  } catch {
    showToast('Could not load users', 'error');
  }
}

async function deactivateUser(id, name) {
  if (!confirm(`Deactivate user "${name}"?`)) return;
  try {
    await simarAPI(`/api/admin/users/${id}/deactivate`, { method: 'PUT' });
    showToast('User deactivated.', 'success');
    loadUsers();
  } catch (e) {
    showToast(e.message, 'error');
  }
}