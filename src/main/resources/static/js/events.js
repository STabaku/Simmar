// ============================================
// SIMAR — Events page (events.js)
// ============================================

document.addEventListener('DOMContentLoaded', async () => {
  lucide.createIcons();
  initReveal();
  await loadEvents();
});

async function loadEvents() {
  try {
    const categories = await simarAPI('/api/events');
    renderEvents(categories);
  } catch {
    // show placeholder events if API not ready yet
    renderEvents(getPlaceholderEvents());
  }
}

function renderEvents(categories) {
  const container = document.getElementById('events-container');

  if (!categories || categories.length === 0) {
    renderEvents(getPlaceholderEvents());
    return;
  }

  container.innerHTML = categories.map((cat, index) => {
    const isReverse = index % 2 !== 0;
    const photos    = cat.photos || [];
    const imgHTML   = photos.length > 0
      ? `<img src="${photos[0].imageUrl}" alt="${cat.name}"
              onerror="this.style.display='none'"/>`
      : cat.emoji || '🌸';

    return `
      <div class="event-row ${isReverse ? 'reverse' : ''} reveal">

        <div class="event-image-wrap">
          ${typeof imgHTML === 'string' && imgHTML.startsWith('<img')
            ? imgHTML
            : imgHTML
          }
        </div>

        <div class="event-info">
          <span class="event-tag">
            <i data-lucide="calendar" width="11" height="11"></i>
            ${cat.name}
          </span>
          <h2 class="event-title">${cat.name}</h2>
          <p class="event-desc">
            ${cat.description || 'Beautiful handmade pipe cleaner arrangements perfect for this special occasion. Contact us to discuss your vision and we will bring it to life.'}
          </p>
          <a href="mailto:hello@simar.al" class="btn btn-outline">
            <i data-lucide="mail" width="15" height="15"></i>
            Get in touch
          </a>
        </div>

      </div>`;
  }).join('');

  lucide.createIcons();
  initReveal();
}

// placeholder content shown before admin adds real events
function getPlaceholderEvents() {
  return [
    {
      name: 'Weddings & Ceremonies',
      description: 'Make your wedding day unforgettable with handmade pipe cleaner bouquets that last forever — unlike real flowers. We create bridal bouquets, table arrangements and decorative pieces tailored to your theme.',
      emoji: '💍',
    },
    {
      name: 'Birthday Celebrations',
      description: 'Surprise someone special with a custom birthday bouquet. Choose their favourite colors, add a personal note and we will craft something truly one of a kind just for them.',
      emoji: '🎂',
    },
    {
      name: 'Proposals',
      description: 'A forever bouquet for a forever moment. Our pipe cleaner roses never wilt — just like your love. Perfect for that special question you have been planning.',
      emoji: '💝',
    },
    {
      name: 'Pop-up Events',
      description: 'Planning a pop-up market, corporate event or themed party? We provide custom floral decorations and bouquet arrangements in bulk. Contact us for special event pricing.',
      emoji: '🎪',
    },
  ];
}