// ============================================
// SIMAR — Reusable Navbar Component
// Include this in every page with:
// <script src="/js/navbar.js"></script>
// ============================================

(function () {
  // ── helpers ──────────────────────────────
  const getToken = () => localStorage.getItem('simar_token');
  const getUser  = () => {
    try { return JSON.parse(localStorage.getItem('simar_user')); }
    catch { return null; }
  };
  const isLoggedIn = () => !!getToken();
  const isAdmin    = () => { const u = getUser(); return u && u.role === 'ADMIN'; };

  // ── build HTML ───────────────────────────
  function buildNavbar() {
    const currentPage = window.location.pathname;

    const links = [
      { href: '/',                        label: 'Home' },
      { href: '/pages/bouquets.html',     label: 'Bouquets' },
      { href: '/pages/build-bouquet.html',label: 'Build a Bouquet' },
      { href: '/pages/events.html',       label: 'Events' },
      { href: '/pages/gifts.html',        label: 'Gifts' },
      { href: '/pages/help.html',         label: 'Help' },
    ];

    const navLinks = links.map(l => `
      <a href="${l.href}" class="${currentPage === l.href ? 'active' : ''}">
        ${l.label}
      </a>
    `).join('');

    const mobileLinks = links.map(l => `
      <a href="${l.href}">${l.label}</a>
    `).join('');

    // account button changes based on login state
    let accountHTML = '';
    if (isLoggedIn()) {
      const user = getUser();
      const adminLink = isAdmin()
        ? `<a href="/pages/admin/dashboard.html">
             <i data-lucide="layout-dashboard" width="15" height="15"></i>
             Admin Dashboard
           </a>`
        : '';
      accountHTML = `
        <div class="navbar-account">
          <button class="account-btn" id="accountBtn">
            <i data-lucide="user" width="15" height="15"></i>
            ${user ? user.name.split(' ')[0] : 'Account'}
          </button>
          <div class="account-dropdown" id="accountDropdown">
            <a href="/pages/my-orders.html">
              <i data-lucide="package" width="15" height="15"></i>
              My Orders
            </a>
            ${adminLink}
            <button onclick="simarLogout()">
              <i data-lucide="log-out" width="15" height="15"></i>
              Logout
            </button>
          </div>
        </div>`;
    } else {
      accountHTML = `
        <a href="/pages/login.html" class="btn btn-primary" style="padding:0.5rem 1.4rem;font-size:0.88rem;">
          Login
        </a>`;
    }

    return `
      <nav class="navbar" id="simarNavbar">
        <div class="navbar-inner">

          <!-- Logo -->
          <a href="/" class="navbar-logo">
            <div class="logo-placeholder">
              <i data-lucide="flower-2" width="20" height="20"></i>
            </div>
            SIMAAR
          </a>

          <!-- Desktop links -->
          <div class="navbar-links">
            ${navLinks}
          </div>

          <!-- Right side -->
          <div style="display:flex;align-items:center;gap:1rem;">
            ${accountHTML}
            <!-- Hamburger (mobile) -->
            <button class="hamburger" id="hamburgerBtn" aria-label="Menu">
              <span></span><span></span><span></span>
            </button>
          </div>

        </div>
      </nav>

      <!-- Mobile menu -->
      <div class="mobile-menu" id="mobileMenu">
        ${mobileLinks}
        ${isLoggedIn()
          ? `<a href="/pages/my-orders.html">My Orders</a>
             ${isAdmin() ? '<a href="/pages/admin/dashboard.html">Admin Dashboard</a>' : ''}
             <a href="#" onclick="simarLogout()">Logout</a>`
          : `<a href="/pages/login.html">Login</a>
             <a href="/pages/register.html">Sign Up</a>`
        }
      </div>
    `;
  }

  // ── inject into page ─────────────────────
  function mountNavbar() {
    const container = document.createElement('div');
    container.innerHTML = buildNavbar();
    document.body.insertBefore(container, document.body.firstChild);

    // push page content down by navbar height
    document.body.style.paddingTop = 'var(--nav-height)';

    initNavbarBehavior();
  }

  // ── behavior ─────────────────────────────
  function initNavbarBehavior() {
    const navbar    = document.getElementById('simarNavbar');
    const hamburger = document.getElementById('hamburgerBtn');
    const mobileMenu= document.getElementById('mobileMenu');
    const accountBtn= document.getElementById('accountBtn');
    const dropdown  = document.getElementById('accountDropdown');

    // scroll shadow
    window.addEventListener('scroll', () => {
      navbar.classList.toggle('scrolled', window.scrollY > 20);
    });

    // hamburger toggle
    if (hamburger && mobileMenu) {
      hamburger.addEventListener('click', () => {
        mobileMenu.classList.toggle('open');
      });
    }

    // account dropdown toggle
    if (accountBtn && dropdown) {
      accountBtn.addEventListener('click', (e) => {
        e.stopPropagation();
        dropdown.classList.toggle('open');
      });

      document.addEventListener('click', () => {
        dropdown.classList.remove('open');
      });
    }

    // init lucide icons
    if (window.lucide) lucide.createIcons();
  }

  // ── logout ───────────────────────────────
  window.simarLogout = function () {
    localStorage.removeItem('simar_token');
    localStorage.removeItem('simar_user');
    window.location.href = '/';
  };

  // ── toast helper (available globally) ────


  // ── API helper (available globally) ──────
 
  // ── scroll reveal helper ──────────────────
 

  // ── run on DOM ready ──────────────────────
  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountNavbar);
  } else {
    mountNavbar();
  }
})();