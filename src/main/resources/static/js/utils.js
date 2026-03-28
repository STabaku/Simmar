// ============================================
// SIMAR — Shared Utilities (utils.js)
// Include in every page that needs toasts or API
// ============================================

// ── Toast notification ────────────────────
window.showToast = function (message, type = 'success') {
  let toast = document.getElementById('simarToast');
  if (!toast) {
    toast = document.createElement('div');
    toast.id = 'simarToast';
    toast.className = 'toast';
    document.body.appendChild(toast);
  }
  toast.className = `toast ${type}`;
  toast.textContent = message;
  toast.classList.add('show');
  setTimeout(() => toast.classList.remove('show'), 3500);
};

// ── API helper ────────────────────────────
window.simarAPI = async function (endpoint, options = {}) {
  const token = localStorage.getItem('simar_token');
  const headers = { 'Content-Type': 'application/json', ...options.headers };
  if (token) headers['Authorization'] = `Bearer ${token}`;

  const res = await fetch(`http://localhost:8080${endpoint}`, {
    ...options,
    headers,
  });

  if (res.status === 401) {
    localStorage.removeItem('simar_token');
    localStorage.removeItem('simar_user');
    window.location.href = '/pages/login.html';
    return;
  }

  const data = await res.json().catch(() => ({}));
  if (!res.ok) throw new Error(data.message || 'Something went wrong');
  return data;
};

// ── Scroll reveal ─────────────────────────
window.initReveal = function () {
  const observer = new IntersectionObserver((entries) => {
    entries.forEach(e => {
      if (e.isIntersecting) {
        e.target.classList.add('visible');
        observer.unobserve(e.target);
      }
    });
  }, { threshold: 0.12 });
  document.querySelectorAll('.reveal').forEach(el => observer.observe(el));
};