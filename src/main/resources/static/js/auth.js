// ============================================
// SIMAR — Auth Logic (auth.js)
// Used by both login.html and register.html
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();

  // redirect if already logged in
  const token = localStorage.getItem('simar_token');
  if (token) window.location.href = '/';

  const page = document.getElementById('login-btn')
    ? 'login'
    : 'register';

  if (page === 'login') initLogin();
  else initRegister();

  // show/hide password toggle
  const toggleBtn = document.getElementById('toggle-password');
  const passInput = document.getElementById('password');
  if (toggleBtn && passInput) {
    toggleBtn.addEventListener('click', () => {
      const isText = passInput.type === 'text';
      passInput.type = isText ? 'password' : 'text';
      toggleBtn.innerHTML = isText
        ? '<i data-lucide="eye" width="16" height="16"></i>'
        : '<i data-lucide="eye-off" width="16" height="16"></i>';
      lucide.createIcons();
    });
  }
});

// ── Login ─────────────────────────────────
function initLogin() {
  const btn      = document.getElementById('login-btn');
  const errorEl  = document.getElementById('login-error');

  // allow Enter key to submit
  document.addEventListener('keydown', e => {
    if (e.key === 'Enter') btn.click();
  });

  btn.addEventListener('click', async () => {
    const email    = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    hideAlert(errorEl);

    if (!email || !password) {
      showAlert(errorEl, 'Please fill in all fields.');
      return;
    }

    setLoading(btn, true);

    try {
      const data = await simarAPI('/api/auth/login', {
        method: 'POST',
        body: JSON.stringify({ email, password }),
      });

      // save token and user info
      localStorage.setItem('simar_token', data.token);
      localStorage.setItem('simar_user', JSON.stringify({
        name: data.name,
        role: data.role,
      }));

      showToast('Welcome back, ' + data.name + '! 🌸', 'success');

      // redirect admin to dashboard, users to homepage
      setTimeout(() => {
        window.location.href = data.role === 'ADMIN'
          ? '/pages/admin/dashboard.html'
          : '/';
      }, 800);

    } catch (err) {
      showAlert(errorEl, 'Incorrect email or password. Please try again.');
    } finally {
      setLoading(btn, false);
    }
  });
}

// ── Register ──────────────────────────────
function initRegister() {
  const btn       = document.getElementById('register-btn');
  const errorEl   = document.getElementById('register-error');
  const successEl = document.getElementById('register-success');

  document.addEventListener('keydown', e => {
    if (e.key === 'Enter') btn.click();
  });

  btn.addEventListener('click', async () => {
    const name     = document.getElementById('name').value.trim();
    const email    = document.getElementById('email').value.trim();
    const password = document.getElementById('password').value;

    hideAlert(errorEl);
    hideAlert(successEl);

    // basic validation
    if (!name || !email || !password) {
      showAlert(errorEl, 'Please fill in all fields.');
      return;
    }
    if (password.length < 6) {
      showAlert(errorEl, 'Password must be at least 6 characters.');
      return;
    }
    if (!email.includes('@')) {
      showAlert(errorEl, 'Please enter a valid email address.');
      return;
    }

    setLoading(btn, true);

    try {
      await simarAPI('/api/auth/register', {
        method: 'POST',
        body: JSON.stringify({ name, email, password }),
      });

      showAlert(successEl, 'Account created! Redirecting to login...');
      setTimeout(() => {
        window.location.href = '/pages/login.html';
      }, 1500);

    } catch (err) {
      showAlert(errorEl, err.message || 'Registration failed. Try again.');
    } finally {
      setLoading(btn, false);
    }
  });
}

// ── Helpers ───────────────────────────────
function showAlert(el, message) {
  el.textContent = message;
  el.style.display = 'block';
}

function hideAlert(el) {
  el.style.display = 'none';
  el.textContent = '';
}

function setLoading(btn, loading) {
  btn.disabled = loading;
  btn.style.opacity = loading ? '0.7' : '1';
  btn.textContent = loading ? 'Please wait...' : btn.dataset.label || btn.textContent;
}