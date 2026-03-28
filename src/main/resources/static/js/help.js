// ============================================
// SIMAR — Help page (help.js)
// ============================================

document.addEventListener('DOMContentLoaded', () => {
  lucide.createIcons();
  initReveal();
});

// ── FAQ accordion ─────────────────────────
function toggleFaq(btn) {
  const item   = btn.parentElement;
  const answer = item.querySelector('.faq-answer');
  const icon   = btn.querySelector('[data-lucide]');
  const isOpen = item.classList.contains('open');

  // close all others first
  document.querySelectorAll('.faq-item.open').forEach(el => {
    el.classList.remove('open');
    el.querySelector('.faq-answer').style.maxHeight = '0';
    el.querySelector('.faq-answer').style.padding   = '0 1.5rem';
  });

  // toggle clicked one
  if (!isOpen) {
    item.classList.add('open');
    answer.style.maxHeight = answer.scrollHeight + 'px';
    answer.style.padding   = '0 1.5rem 1.2rem';
  }

  lucide.createIcons();
}

// ── Contact form ──────────────────────────
// EmailJS will be connected in Step 8 (before hosting)
// For now it shows a success message as placeholder
async function sendMessage() {
  const name    = document.getElementById('c-name').value.trim();
  const email   = document.getElementById('c-email').value.trim();
  const message = document.getElementById('c-message').value.trim();
  const btn     = document.getElementById('send-btn');
  const success = document.getElementById('form-success');
  const error   = document.getElementById('form-error');

  success.style.display = 'none';
  error.style.display   = 'none';

  if (!name || !email || !message) {
    error.textContent    = 'Please fill in all fields.';
    error.style.display  = 'block';
    return;
  }

  if (!email.includes('@')) {
    error.textContent   = 'Please enter a valid email address.';
    error.style.display = 'block';
    return;
  }

  btn.disabled    = true;
  btn.textContent = 'Sending...';

  // ── EmailJS integration point ──
  // When you set up EmailJS in Step 8, replace this
  // setTimeout with the actual emailjs.send() call
  setTimeout(() => {
    success.style.display = 'block';
    document.getElementById('c-name').value    = '';
    document.getElementById('c-email').value   = '';
    document.getElementById('c-message').value = '';
    btn.disabled    = false;
    btn.innerHTML =
      '<i data-lucide="send" width="15" height="15"></i> Send Message';
    lucide.createIcons();
  }, 800);
}