// ============================================
// SIMAR — Admin Sidebar (admin-sidebar.js)
// Reused across all admin pages
// ============================================

(function () {

  // guard — redirect non-admins
  function guardAdmin() {
    const token = localStorage.getItem('simar_token');
    const user  = JSON.parse(localStorage.getItem('simar_user') || '{}');
    if (!token || user.role !== 'ADMIN') {
      window.location.href = '/pages/login.html';
    }
  }

  function buildSidebar() {
    const path = window.location.pathname;

    const links = [
      { href: '/pages/admin/dashboard.html', icon: 'layout-dashboard', label: 'Dashboard' },
      { href: '/pages/admin/orders.html',    icon: 'package',           label: 'Orders' },
      { href: '/pages/admin/adminbouquets.html',  icon: 'flower-2',     label: 'Bouquets' },
      { href: '/pages/admin/events.html',    icon: 'calendar-heart',    label: 'Events' },
      { href: '/pages/admin/gifts.html',     icon: 'gift',              label: 'Gifts' },
      { href: '/pages/admin/gallery.html',   icon: 'image',             label: 'Gallery' },
      { href: '/pages/admin/users.html',     icon: 'users',             label: 'Users' },
      { href: '/pages/admin/supply.html',    icon: 'package-2',         label: 'Supply Tracker' },
    ];

    const linksHTML = links.map(l => `
      <a href="${l.href}"
         class="sidebar-link ${path === l.href ? 'active' : ''}">
        <i data-lucide="${l.icon}" width="16" height="16"></i>
        ${l.label}
      </a>
    `).join('');

    return `
      <aside class="admin-sidebar">
        <div class="admin-sidebar-title">Menu</div>
        ${linksHTML}
        <div class="admin-sidebar-title">Account</div>
        <a href="/" class="sidebar-link">
          <i data-lucide="home" width="16" height="16"></i>
          View Shop
        </a>
        <button class="sidebar-link" onclick="simarLogout()"
                style="width:100%;text-align:left;border:none;
                       background:none;cursor:pointer;font-family:var(--font-body);">
          <i data-lucide="log-out" width="16" height="16"></i>
          Logout
        </button>
      </aside>`;
  }

  function mount() {
    guardAdmin();
    const mount = document.getElementById('admin-sidebar-mount');
    if (mount) {
      mount.innerHTML = buildSidebar();
      if (window.lucide) lucide.createIcons();
    }
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mount);
  } else {
    mount();
  }
})();