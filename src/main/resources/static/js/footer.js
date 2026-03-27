// ============================================
// SIMAR — Reusable Footer Component
// Include in every page with:
// <script src="/js/footer.js"></script>
// ============================================

(function () {
  function buildFooter() {
    return `
      <footer class="footer">
        <div class="container">
          <div class="footer-grid">

            <!-- Brand -->
            <div>
              <div class="footer-brand-name">SIMAR</div>
              <p class="footer-brand-desc">
                Handmade pipe cleaner flowers crafted with love in Albania.
                Each bouquet is unique — just like the person receiving it.
              </p>
              <div class="footer-social">
                <a href="#" class="social-btn" aria-label="Instagram">
                  <i data-lucide="instagram" width="16" height="16"></i>
                </a>
                <a href="#" class="social-btn" aria-label="Facebook">
                  <i data-lucide="facebook" width="16" height="16"></i>
                </a>
                <a href="#" class="social-btn" aria-label="TikTok">
                  <i data-lucide="music" width="16" height="16"></i>
                </a>
              </div>
            </div>

            <!-- Shop links -->
            <div>
              <div class="footer-col-title">Shop</div>
              <nav class="footer-links">
                <a href="/pages/bouquets.html">Bouquets</a>
                <a href="/pages/build-bouquet.html">Build a Bouquet</a>
                <a href="/pages/gifts.html">Gifts</a>
                <a href="/pages/events.html">Events</a>
              </nav>
            </div>

            <!-- Info links -->
            <div>
              <div class="footer-col-title">Info</div>
              <nav class="footer-links">
                <a href="/pages/help.html">Help & FAQ</a>
                <a href="/pages/help.html#contact">Contact Us</a>
                <a href="/pages/help.html#shipping">Delivery Info</a>
                <a href="/pages/help.html#care">Care Guide</a>
              </nav>
            </div>

            <!-- Contact -->
            <div>
              <div class="footer-col-title">Contact</div>
              <div class="footer-contact-item">
                <i data-lucide="map-pin" width="15" height="15"></i>
                Albania
              </div>
              <div class="footer-contact-item">
                <i data-lucide="mail" width="15" height="15"></i>
                <!-- replace with your email -->
                hello@simar.al
              </div>
              <div class="footer-contact-item">
                <i data-lucide="phone" width="15" height="15"></i>
                <!-- replace with your number -->
                +355 6X XXX XXXX
              </div>
            </div>

          </div>

          <div class="footer-bottom">
            <span>&copy; ${new Date().getFullYear()} SIMAR. All rights reserved.</span>
            <span>Made with 🌸 in Albania</span>
          </div>
        </div>
      </footer>`;
  }

  function mountFooter() {
    const container = document.createElement('div');
    container.innerHTML = buildFooter();
    document.body.appendChild(container);
    if (window.lucide) lucide.createIcons();
  }

  if (document.readyState === 'loading') {
    document.addEventListener('DOMContentLoaded', mountFooter);
  } else {
    mountFooter();
  }
})();