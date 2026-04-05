// ── State ─────────────────────────────────────────────────────
const DEFAULT_STATE = () => ({
  size: 'small',
  wrapColors: ['#f2c8d8', '#e8b0c8', '#d898b4'],
  wrapName: 'Blush Pink',
  mode: 'single',
  type: 'rose',
  fc: '#cc3055',
  fcName: 'Red',
  qty: 9,
  mixed: [],
  xPrice: 0
});

let S = DEFAULT_STATE();
const WP = { small: 5, medium: 8, large: 12 };
const STEM_PRICE = 1.5;

// ── Seeded random (stable jitter per flower index) ────────────
function rnd(s) {
  const x = Math.sin(s + 1) * 10000;
  return x - Math.floor(x);
}

// ── Hex color darkening/lightening helper ─────────────────────
function sh(hex, a) {
  if (!hex || hex[0] !== '#' || hex.length < 7) return hex;
  const r = parseInt(hex.slice(1, 3), 16);
  const g = parseInt(hex.slice(3, 5), 16);
  const b = parseInt(hex.slice(5, 7), 16);
  return `rgb(${Math.max(0, Math.min(255, r + a))},${Math.max(0, Math.min(255, g + a))},${Math.max(0, Math.min(255, b + a))})`;
}

// ── Get canvas context (single place, no double-declare) ──────
function getCtx() {
  return document.getElementById('bc').getContext('2d');
}

// ── UI Handlers ───────────────────────────────────────────────
function setSize(s, btn) {
  S.size = s;
  btn.closest('.og').querySelectorAll('.ob').forEach(x => x.classList.remove('active'));
  btn.classList.add('active');
  draw(); updatePrice();
}

function setWrap(colors, name, dot) {
  S.wrapColors = colors;
  S.wrapName = name;
  document.querySelectorAll('#wrapColors .cdot').forEach(x => x.classList.remove('active'));
  dot.classList.add('active');
  document.getElementById('wrapName').textContent = name;
  draw();
}

function setMode(m, btn) {
  S.mode = m;
  btn.closest('.og').querySelectorAll('.ob').forEach(x => x.classList.remove('active'));
  btn.classList.add('active');
  document.getElementById('singleSec').style.display = m === 'single' ? 'block' : 'none';
  document.getElementById('mixedSec').style.display = m === 'mixed' ? 'block' : 'none';
  draw(); updatePrice(); updateLabel();
}

function setType(t, btn) {
  S.type = t;
  document.getElementById('typeGrid').querySelectorAll('.ob').forEach(x => x.classList.remove('active'));
  btn.classList.add('active');
  draw(); updateLabel();
}

function setSColor(c, n, dot) {
  S.fc = c;
  S.fcName = n;
  document.querySelectorAll('#flowerColors .cdot').forEach(x => x.classList.remove('active'));
  dot.classList.add('active');
  draw(); updateLabel();
}

function changeQty(d) {
  S.qty = Math.max(1, Math.min(40, S.qty + d));
  document.getElementById('qtyD').textContent = S.qty;
  draw(); updatePrice(); updateLabel();
}

// ── Mixed flower handlers (fixed) ─────────────────────────────
function addMix() {
  const fEl = document.getElementById('mxF');
  const cEl = document.getElementById('mxC');
  const qEl = document.getElementById('mxQ');
  const flower = fEl.value;
  const color = cEl.value;
  const colorName = cEl.options[cEl.selectedIndex].text;
  const qty = parseInt(qEl.value) || 5;
  S.mixed.push({ flower, color, colorName, qty });
  renderTags();
  draw();
  updatePrice();
  updateLabel();
}

function removeMix(i) {
  S.mixed.splice(i, 1);
  renderTags();
  draw();
  updatePrice();
  updateLabel();
}

function renderTags() {
  const container = document.getElementById('mixTags');
  if (!container) return;
  container.innerHTML = S.mixed.map((f, i) =>
    `<span class="ftag" style="background:${f.color}22;border-color:${f.color}88;color:#333">
      ${f.qty} ${f.colorName} ${f.flower}s
      <span class="rtag" onclick="removeMix(${i})">×</span>
    </span>`
  ).join('');
}

function togX(n, p, cb) {
  if (cb.checked) S.xPrice += p;
  else S.xPrice -= p;
  updatePrice();
}


// ── Clear / Reset ─────────────────────────────────────────────
function clearAll() {
  S = DEFAULT_STATE();
  document.querySelectorAll('.size-grid .ob').forEach((b, i) => b.classList.toggle('active', i === 0));
  document.querySelectorAll('#wrapColors .cdot').forEach((d, i) => d.classList.toggle('active', i === 0));
  document.getElementById('wrapName').textContent = 'Blush Pink';
  document.querySelectorAll('.mode-grid .ob').forEach((b, i) => b.classList.toggle('active', i === 0));
  document.getElementById('singleSec').style.display = 'block';
  document.getElementById('mixedSec').style.display = 'none';
  document.getElementById('typeGrid').querySelectorAll('.ob').forEach((b, i) => b.classList.toggle('active', i === 0));
  document.querySelectorAll('#flowerColors .cdot').forEach((d, i) => d.classList.toggle('active', i === 0));
  document.getElementById('qtyD').textContent = S.qty;
  renderTags();
  document.querySelectorAll('.xchk input[type=checkbox]').forEach(cb => { cb.checked = false; });
  draw(); updatePrice(); updateLabel();
}

// ── Replace these two functions in your build bouquet JS ──────

async function placeCustomOrder() {
  const token = localStorage.getItem('simar_token');
  if (!token) {
    showToast('Please login to place an order', 'error');
    setTimeout(() => window.location.href = '/pages/login.html', 1000);
    return;
  }

  const hasFlowers = S.mode === 'single'
    ? S.qty > 0
    : S.mixed.length > 0;

  if (!hasFlowers) {
    showToast('Please add flowers first', 'error');
    return;
  }

  const btn = document.querySelector('.obtn');
  btn.disabled = true;
  btn.textContent = 'Placing order...';

  const wp = WP[S.size];
  const fp = S.mode === 'single'
    ? Math.round(S.qty * STEM_PRICE)
    : Math.round(S.mixed.reduce((a, f) => a + f.qty * STEM_PRICE, 0));
  const totalPrice = wp + fp + S.xPrice;

  const totalFlowers = S.mode === 'single'
    ? S.qty
    : S.mixed.reduce((a, f) => a + f.qty, 0);

  try {
    await simarAPI('/api/orders', {
      method: 'POST',
      body: JSON.stringify({
        bouquetId:     null,
        giftItemId:    null,
        selectedCount: totalFlowers,
        selectedColor: 'Custom',
        totalPrice:    totalPrice,
        notes:         buildSummary(),
      }),
    });

    showToast('Custom order placed! 🌸', 'success');
    setTimeout(() => window.location.href = '/pages/my-orders.html', 1200);

  } catch (err) {
    showToast(err.message || 'Order failed', 'error');
    btn.disabled = false;
    btn.textContent = 'Place Order ↗';
  }
}

function buildSummary() {
  const parts = [];

  // wrapper size + color name
  const sizeName = S.size.charAt(0).toUpperCase() + S.size.slice(1);
  parts.push(`Wrapper: ${sizeName} ${S.wrapName}`);

  // flowers
  if (S.mode === 'single') {
    parts.push(`Flowers: ${S.qty} ${S.fcName} ${S.type}s`);
  } else if (S.mixed.length > 0) {
    const flowerList = S.mixed
      .map(f => `${f.qty} ${f.colorName} ${f.flower}s`)
      .join(', ');
    parts.push(`Flowers: ${flowerList}`);
  }

  // extras (read checked checkboxes)
  const checkedExtras = [];
  document.querySelectorAll('.xchk input[type=checkbox]').forEach(cb => {
    if (cb.checked) {
      // get the label text next to the checkbox
      const label = cb.closest('.xchk');
      if (label) {
        const text = label.textContent.trim();
        checkedExtras.push(text);
      }
    }
  });
  if (checkedExtras.length > 0) {
    parts.push(`Extras: ${checkedExtras.join(', ')}`);
  }

  return parts.join(' | ');
}



// ── Price & Label ─────────────────────────────────────────────
function updatePrice() {
  const wp = WP[S.size];
  const fp = S.mode === 'single'
    ? Math.round(S.qty * STEM_PRICE)
    : Math.round(S.mixed.reduce((a, f) => a + f.qty * STEM_PRICE, 0));
  document.getElementById('pW').textContent = '€' + wp;
  document.getElementById('pF').textContent = '€' + fp;
  document.getElementById('pX').textContent = '€' + S.xPrice;
  document.getElementById('pT').textContent = '€' + (wp + fp + S.xPrice);
}

function updateLabel() {
  const sl = S.size[0].toUpperCase() + S.size.slice(1);
  const totalMixed = S.mixed.reduce((a, f) => a + f.qty, 0);
  const l = S.mode === 'single'
    ? `${sl} ${S.wrapName} · ${S.qty} ${S.fcName} ${S.type}s`
    : `${sl} ${S.wrapName} · ${totalMixed} mixed stems`;
  document.getElementById('plbl').textContent = l;
}

// ── Flower positions: compact ellipse grid ────────────────────
function getPositions(total, cx, centerY, radius) {
  if (total === 0) return [];
  if (total === 1) return [{ x: cx, y: centerY }];

  const cols = Math.ceil(Math.sqrt(total * 1.5));
  const spacingX = Math.min(38, (radius * 1.9) / cols);
  const spacingY = Math.min(34, spacingX * 0.88);

  const candidates = [];
  for (let row = -8; row <= 8; row++) {
    for (let col = -8; col <= 8; col++) {
      const x = cx + col * spacingX + (row % 2 === 0 ? 0 : spacingX * 0.5);
      const y = centerY + row * spacingY;
      const nx = (x - cx) / (radius * 1.05);
      const ny = (y - centerY) / (radius * 0.9);
      if (nx * nx + ny * ny <= 1.0) {
        candidates.push({ x, y, dist: nx * nx + ny * ny });
      }
    }
  }

  candidates.sort((a, b) => a.dist - b.dist);

  const used = [];
  for (const c of candidates) {
    let ok = true;
    for (const u of used) {
      if (Math.hypot(c.x - u.x, c.y - u.y) < spacingX * 0.7) { ok = false; break; }
    }
    if (ok) used.push(c);
    if (used.length >= total) break;
  }

  let idx = 0;
  while (used.length < total) {
    used.push({
      x: cx + (rnd(idx * 7 + 1) - 0.5) * radius * 1.8,
      y: centerY + (rnd(idx * 13 + 2) - 0.5) * radius * 1.4
    });
    idx++;
  }

  return used.slice(0, total).map((p, i) => ({
    x: p.x + (rnd(i * 11 + 3) - 0.5) * 5,
    y: p.y + (rnd(i * 17 + 5) - 0.5) * 4
  }));
}

// ── MAIN DRAW ─────────────────────────────────────────────────
function draw() {
  const ctx = getCtx();
  ctx.clearRect(0, 0, 340, 500);

  const cx = 170;
  const conf = {
    small:  { topW: 120, botW: 54, topY: 280, h: 185, r: 58 },
    medium: { topW: 148, botW: 68, topY: 262, h: 200, r: 70 },
    large:  { topW: 174, botW: 82, topY: 245, h: 215, r: 83 }
  }[S.size];
  const { topW, botW, topY, h, r } = conf;

  // flowers cluster center: just inside/above wrapper opening
  const bouquetCY = topY - r * 0.35;

  // build flower list
  const flowers = [];
  if (S.mode === 'single') {
    for (let i = 0; i < S.qty; i++) {
      flowers.push({ color: S.fc, type: S.type, id: i });
    }
  } else {
    let id = 0;
    S.mixed.forEach(f => {
      for (let i = 0; i < f.qty; i++) {
        flowers.push({ color: f.color, type: f.flower, id: id++ });
      }
    });
  }

  const positions = getPositions(flowers.length, cx, bouquetCY, r);

  // Draw order:
  // 1. wrapper back (rectangular paper sheets + cone)
  // 2. stems
  // 3. flowers (fully visible)
  // 4. wrapper front (semi-transparent side flaps only)
  // 5. ribbon & bow (always on top)
  drawWrapperBack(ctx, cx, topY, topW, botW, h);
  drawStems(ctx, cx, topY, positions, flowers);
  drawFlowers(ctx, positions, flowers);
  drawWrapperFront(ctx, cx, topY, topW);
  drawRibbon(ctx, cx, topY, topW, h);
}

// ── WRAPPER BACK ──────────────────────────────────────────────
// Flat rectangular paper sheets fanning out behind flowers
function drawWrapperBack(ctx, cx, topY, topW, botW, h) {
  const [c1, c2, c3] = S.wrapColors;
  const botY = topY + h;

  // Back sheet 1 — tilted left
  ctx.save();
  ctx.translate(cx, topY);
  ctx.rotate(-0.2);
  ctx.beginPath();
  ctx.moveTo(-8, 5);
  ctx.lineTo(62, 5);
  ctx.lineTo(50, -158);
  ctx.lineTo(-16, -158);
  ctx.closePath();
  ctx.fillStyle = c1;
  ctx.fill();
  ctx.restore();

  // Back sheet 2 — tilted right
  ctx.save();
  ctx.translate(cx, topY);
  ctx.rotate(0.2);
  ctx.beginPath();
  ctx.moveTo(8, 5);
  ctx.lineTo(-62, 5);
  ctx.lineTo(-50, -158);
  ctx.lineTo(16, -158);
  ctx.closePath();
  ctx.fillStyle = c2;
  ctx.fill();
  ctx.restore();

  // Back center sheet — straight up, slightly lighter
  ctx.save();
  ctx.translate(cx, topY);
  ctx.beginPath();
  ctx.moveTo(-22, 5);
  ctx.lineTo(22, 5);
  ctx.lineTo(16, -172);
  ctx.lineTo(-16, -172);
  ctx.closePath();
  ctx.fillStyle = sh(c1, 20);
  ctx.fill();
  ctx.restore();

  // Main cone body
  ctx.beginPath();
  ctx.moveTo(cx - topW / 2, topY);
  ctx.lineTo(cx + topW / 2, topY);
  ctx.lineTo(cx + botW / 2, botY);
  ctx.lineTo(cx - botW / 2, botY);
  ctx.closePath();
  ctx.fillStyle = c2;
  ctx.fill();

  // Left darker face (shadow)
  ctx.beginPath();
  ctx.moveTo(cx - topW / 2, topY);
  ctx.lineTo(cx - topW * 0.08, topY);
  ctx.lineTo(cx - botW * 0.1, botY);
  ctx.lineTo(cx - botW / 2, botY);
  ctx.closePath();
  ctx.fillStyle = c3;
  ctx.fill();

  // Subtle fold lines
  ctx.strokeStyle = sh(c3, -10);
  ctx.lineWidth = 0.8;
  ctx.beginPath();
  ctx.moveTo(cx - topW * 0.15, topY);
  ctx.lineTo(cx - botW * 0.28, botY);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + topW * 0.15, topY);
  ctx.lineTo(cx + botW * 0.28, botY);
  ctx.stroke();
}

// ── WRAPPER FRONT ─────────────────────────────────────────────
// Two semi-transparent rectangular flaps in front of flowers
function drawWrapperFront(ctx, cx, topY, topW) {
  const [c1, c2] = S.wrapColors;

  ctx.save();
  ctx.globalAlpha = 0.48;

  // Front-left flap
  ctx.save();
  ctx.translate(cx, topY);
  ctx.rotate(-0.13);
  ctx.beginPath();
  ctx.moveTo(-topW * 0.46, 8);
  ctx.lineTo(-topW * 0.04, 8);
  ctx.lineTo(-topW * 0.02, -105);
  ctx.lineTo(-topW * 0.4, -105);
  ctx.closePath();
  ctx.fillStyle = c1;
  ctx.fill();
  ctx.restore();

  // Front-right flap
  ctx.save();
  ctx.translate(cx, topY);
  ctx.rotate(0.13);
  ctx.beginPath();
  ctx.moveTo(topW * 0.46, 8);
  ctx.lineTo(topW * 0.04, 8);
  ctx.lineTo(topW * 0.02, -105);
  ctx.lineTo(topW * 0.4, -105);
  ctx.closePath();
  ctx.fillStyle = c2;
  ctx.fill();
  ctx.restore();

  ctx.globalAlpha = 1.0;
  ctx.restore();
}

// ── RIBBON & BOW ──────────────────────────────────────────────
function drawRibbon(ctx, cx, topY, topW, h) {
  const c3 = S.wrapColors[2];
  const ribY = topY + h * 0.16;

  // Ribbon band
  ctx.beginPath();
  ctx.moveTo(cx - topW * 0.43, ribY - 5);
  ctx.lineTo(cx + topW * 0.43, ribY - 5);
  ctx.lineTo(cx + topW * 0.40, ribY + 6);
  ctx.lineTo(cx - topW * 0.40, ribY + 6);
  ctx.closePath();
  ctx.fillStyle = sh(c3, -15);
  ctx.fill();

  // Bow loops
  drawBowLoop(ctx, cx - 14, ribY, 36, 19, c3, -1);
  drawBowLoop(ctx, cx + 14, ribY, 36, 19, c3, 1);

  // Center knot
  ctx.beginPath();
  ctx.ellipse(cx, ribY, 8, 8, 0, 0, Math.PI * 2);
  ctx.fillStyle = sh(c3, -25);
  ctx.fill();

  // Ribbon tails
  ctx.lineWidth = 6;
  ctx.lineCap = 'round';
  ctx.strokeStyle = sh(c3, -12);
  ctx.beginPath();
  ctx.moveTo(cx - 8, ribY + 6);
  ctx.bezierCurveTo(cx - 20, ribY + 38, cx - 26, ribY + 68, cx - 14, ribY + 100);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + 8, ribY + 6);
  ctx.bezierCurveTo(cx + 20, ribY + 38, cx + 26, ribY + 68, cx + 14, ribY + 100);
  ctx.stroke();

  ctx.lineWidth = 3;
  ctx.strokeStyle = sh(c3, -38);
  ctx.beginPath();
  ctx.moveTo(cx - 2, ribY + 7);
  ctx.bezierCurveTo(cx - 6, ribY + 40, cx - 3, ribY + 70, cx, ribY + 100);
  ctx.stroke();
  ctx.beginPath();
  ctx.moveTo(cx + 2, ribY + 7);
  ctx.bezierCurveTo(cx + 6, ribY + 40, cx + 3, ribY + 70, cx, ribY + 100);
  ctx.stroke();
}

function drawBowLoop(ctx, x, y, w, h, c, dir) {
  ctx.save();
  ctx.beginPath();
  ctx.moveTo(x, y);
  ctx.bezierCurveTo(x + dir * w * 0.3, y - h, x + dir * w, y - h * 0.35, x + dir * w * 0.88, y + h * 0.18);
  ctx.bezierCurveTo(x + dir * w * 0.62, y + h * 0.72, x + dir * w * 0.08, y + h * 0.28, x, y);
  ctx.fillStyle = sh(c, -5);
  ctx.fill();
  ctx.strokeStyle = sh(c, -30);
  ctx.lineWidth = 0.8;
  ctx.stroke();
  ctx.restore();
}

// ── STEMS ─────────────────────────────────────────────────────
function drawStems(ctx, cx, topY, positions, flowers) {
  if (!positions.length) return;
  ctx.lineWidth = 1.8;
  ctx.lineCap = 'round';
  positions.forEach((p, i) => {
    if (!flowers[i]) return;
    const destX = cx + (p.x - cx) * 0.18;
    const destY = topY + 22;
    ctx.strokeStyle = '#4a7038';
    ctx.beginPath();
    ctx.moveTo(destX, destY);
    ctx.bezierCurveTo(destX, destY - 20, p.x, p.y + 20, p.x, p.y + 6);
    ctx.stroke();
  });
}

// ── FLOWERS ──────────────────────────────────────────────────
function drawFlowers(ctx, positions, flowers) {
  if (!flowers.length) {
    ctx.font = '13px Jost, sans-serif';
    ctx.fillStyle = 'rgba(120,100,85,0.45)';
    ctx.textAlign = 'center';
    ctx.fillText('Add flowers to see your bouquet', 170, 210);
    return;
  }
  // Sort back-to-front by y (painter's algorithm)
  const sorted = positions.map((p, i) => ({ ...p, fi: i })).sort((a, b) => a.y - b.y);
  sorted.forEach(p => {
    const fl = flowers[p.fi];
    if (!fl) return;
    drawFlowerAt(ctx, p.x, p.y, fl.color, fl.type, 1.0, fl.id);
  });
}

function drawFlowerAt(ctx, x, y, color, type, scale, seed) {
  ctx.save();
  ctx.translate(x, y);
  ctx.scale(scale, scale);
  if (type === 'rose')       drawRose(ctx, color, seed);
  else if (type === 'tulip') drawTulip(ctx, color, seed);
  else if (type === 'peony') drawPeony(ctx, color, seed);
  else if (type === 'daisy') drawDaisy(ctx, color, seed);
  ctx.restore();
}

// ── FLOWER SHAPES ─────────────────────────────────────────────
function drawRose(ctx, c, s) {
  const rot = (rnd(s * 11) - 0.5) * 0.9;
  ctx.save();
  ctx.rotate(rot);
  for (let i = 0; i < 5; i++) {
    ctx.save();
    ctx.rotate(i * Math.PI * 2 / 5 + 0.2);
    ctx.beginPath();
    ctx.moveTo(0, 2);
    ctx.bezierCurveTo(8, 0, 12, -12, 4, -19);
    ctx.bezierCurveTo(-2, -22, -10, -14, -8, -6);
    ctx.bezierCurveTo(-7, -2, 0, 2, 0, 2);
    ctx.fillStyle = i % 2 === 0 ? sh(c, -14) : sh(c, -4);
    ctx.fill();
    ctx.restore();
  }
  for (let i = 0; i < 4; i++) {
    ctx.save();
    ctx.rotate(i * Math.PI * 2 / 4 + 0.6);
    ctx.beginPath();
    ctx.moveTo(0, 1);
    ctx.bezierCurveTo(6, 0, 8, -8, 2, -12);
    ctx.bezierCurveTo(-3, -13, -7, -8, -5, -3);
    ctx.bezierCurveTo(-4, -1, 0, 1, 0, 1);
    ctx.fillStyle = sh(c, -26);
    ctx.fill();
    ctx.restore();
  }
  ctx.beginPath(); ctx.ellipse(0, -5, 5, 6, 0, 0, Math.PI * 2); ctx.fillStyle = sh(c, -42); ctx.fill();
  ctx.beginPath(); ctx.ellipse(0, -6, 3, 3.5, 0, 0, Math.PI * 2); ctx.fillStyle = sh(c, -62); ctx.fill();
  ctx.restore();
}

function drawTulip(ctx, c, s) {
  const rot = (rnd(s * 9) - 0.5) * 0.6;
  ctx.save();
  ctx.rotate(rot);
  ctx.beginPath();
  ctx.moveTo(0, 4);
  ctx.bezierCurveTo(-14, 2, -16, -10, -9, -20);
  ctx.bezierCurveTo(-4, -26, 0, -18, 0, -8);
  ctx.fillStyle = sh(c, -20); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(0, 4);
  ctx.bezierCurveTo(14, 2, 16, -10, 9, -20);
  ctx.bezierCurveTo(4, -26, 0, -18, 0, -8);
  ctx.fillStyle = sh(c, 10); ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-5, 2);
  ctx.bezierCurveTo(-7, -4, -6, -18, 0, -24);
  ctx.bezierCurveTo(6, -18, 7, -4, 5, 2);
  ctx.closePath();
  ctx.fillStyle = c; ctx.fill();
  ctx.beginPath();
  ctx.moveTo(-2, -10);
  ctx.bezierCurveTo(-3, -15, -1, -21, 0, -23);
  ctx.strokeStyle = 'rgba(255,255,255,0.3)';
  ctx.lineWidth = 2; ctx.lineCap = 'round'; ctx.stroke();
  ctx.restore();
}

function drawPeony(ctx, c, s) {
  const rot = (rnd(s * 7) - 0.5) * 1.2;
  ctx.save();
  ctx.rotate(rot);
  for (let i = 0; i < 8; i++) {
    ctx.save(); ctx.rotate(i * Math.PI * 2 / 8);
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.bezierCurveTo(9, -2, 11, -14, 0, -19);
    ctx.bezierCurveTo(-11, -14, -9, -2, 0, 0);
    ctx.fillStyle = i % 2 === 0 ? sh(c, -10) : sh(c, 6); ctx.fill();
    ctx.restore();
  }
  for (let i = 0; i < 6; i++) {
    ctx.save(); ctx.rotate(i * Math.PI * 2 / 6 + 0.4);
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.bezierCurveTo(6, -1, 7, -9, 0, -12);
    ctx.bezierCurveTo(-7, -9, -6, -1, 0, 0);
    ctx.fillStyle = sh(c, -22); ctx.fill();
    ctx.restore();
  }
  for (let i = 0; i < 4; i++) {
    ctx.save(); ctx.rotate(i * Math.PI * 2 / 4 + 0.9);
    ctx.beginPath();
    ctx.moveTo(0, 0); ctx.bezierCurveTo(3, -1, 4, -6, 0, -8);
    ctx.bezierCurveTo(-4, -6, -3, -1, 0, 0);
    ctx.fillStyle = sh(c, 16); ctx.fill();
    ctx.restore();
  }
  ctx.beginPath(); ctx.arc(0, 0, 3.5, 0, Math.PI * 2); ctx.fillStyle = '#f5e070'; ctx.fill();
  ctx.restore();
}

function drawDaisy(ctx, c, s) {
  const rot = (rnd(s * 13) - 0.5) * 1.0;
  ctx.save();
  ctx.rotate(rot);
  for (let i = 0; i < 12; i++) {
    ctx.save(); ctx.rotate(i * Math.PI * 2 / 12);
    ctx.beginPath(); ctx.ellipse(0, -11, 3.5, 7, 0, 0, Math.PI * 2);
    ctx.fillStyle = i % 2 === 0 ? c : sh(c, -14); ctx.fill();
    ctx.strokeStyle = 'rgba(0,0,0,0.05)'; ctx.lineWidth = 0.5; ctx.stroke();
    ctx.restore();
  }
  ctx.beginPath(); ctx.arc(0, 0, 5.5, 0, Math.PI * 2); ctx.fillStyle = '#f5c030'; ctx.fill();
  ctx.beginPath(); ctx.arc(0, 0, 3.5, 0, Math.PI * 2); ctx.fillStyle = '#d09010'; ctx.fill();
  ctx.restore();
}

// ── Init ──────────────────────────────────────────────────────
draw();
updatePrice();
updateLabel();


// ── PROVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVVV──────────────────────────────────────────────────────
