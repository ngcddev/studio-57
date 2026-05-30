/* home.js — novedades en la home + reveal animations */

/* ── Reveal al scroll ───────────────────────────────────────── */
function initReveal() {
  const items = document.querySelectorAll('.rv');
  if (!items.length) return;

  const check = () => {
    const vh = window.innerHeight || document.documentElement.clientHeight;
    items.forEach(el => {
      if (el.classList.contains('in')) return;
      const r = el.getBoundingClientRect();
      if (r.top < vh * 0.88 && r.bottom > 0) el.classList.add('in');
    });
  };

  check();
  window.addEventListener('scroll', check, { passive: true });
  window.addEventListener('resize', check);
}

/* ── Hero type entrance ─────────────────────────────────────── */
function initHero() {
  const heroType = document.getElementById('hero-type');
  if (heroType) {
    setTimeout(() => heroType.classList.add('in'), 80);
  }
}

/* ── Card HTML (design system) ──────────────────────────────── */
function renderHomeCard(product) {
  const imgSrc = product.image_url
    ? `<img src="${product.image_url}" alt="${product.name}" loading="lazy">`
    : `<div class="card-img-placeholder">${product.category || ''}</div>`;

  return `
    <div class="product-card">
      <a href="product.php?id=${product.id}">
        <div class="card-image-wrap">
          ${imgSrc}
        </div>
        <div class="card-body">
          <span class="category-tag">${product.category || ''}</span>
          <h3>${product.name}</h3>
          <p>${product.short_desc || ''}</p>
          <strong>${formatPrice(product.price)}</strong>
        </div>
      </a>
    </div>
  `;
}

/* ── Init ───────────────────────────────────────────────────── */
document.addEventListener('DOMContentLoaded', async () => {
  initHero();
  initReveal();

  const grid = document.getElementById('home-new-grid');
  if (!grid) return;

  try {
    const products = await getProducts({ sort: 'newest' });
    const newest   = products.slice(0, 4);
    if (!newest.length) {
      grid.closest('section')?.remove();
      return;
    }
    grid.innerHTML = newest.map(renderHomeCard).join('');
    grid.classList.add('in'); // already in viewport
  } catch (e) {
    console.error('home.js:', e);
    grid.closest('section')?.remove();
  }
});
