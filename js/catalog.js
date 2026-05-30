const ITEMS_PER_PAGE = 12;

document.addEventListener('DOMContentLoaded', async () => {
  const grid      = document.getElementById('products-grid');
  const catSelect = document.getElementById('category-filter');
  const sortSel   = document.getElementById('sort-filter');
  const paginEl   = document.getElementById('pagination');

  const gender = getQueryParam('gender') || '';
  const search = getQueryParam('search') || '';

  const headerSearch = document.getElementById('search-input-header');
  if (headerSearch && search) headerSearch.value = search;

  const sectionTitle = document.getElementById('catalog-title');
  if (sectionTitle) {
    const titles = { hombre: 'Hombre', mujer: 'Mujer', '': 'Todo' };
    sectionTitle.textContent = titles[gender] ?? 'Catálogo';
  }

  async function populateCategories(products) {
    if (!catSelect) return;
    const categories = [...new Set(products.map(p => p.category))].sort();
    catSelect.innerHTML = '<option value="">Todas las categorías</option>';
    categories.forEach(cat => {
      const opt = document.createElement('option');
      opt.value = cat; opt.textContent = cat;
      catSelect.appendChild(opt);
    });
  }

  function heartIcon(filled) {
    return filled
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="#e53e3e" stroke="#e53e3e" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
  }

  function renderCard(product, wishedIds) {
    const inWish  = wishedIds.has(product.id);
    const hasVars = variantProductIds.has(product.id);
    const imgSrc  = product.image_url
      ? `<img src="${product.image_url}" alt="${product.name}" loading="lazy">`
      : `<div class="card-img-placeholder">${product.category || ''}</div>`;
    const cartBtn = hasVars
      ? `<a class="btn-add-cart btn-choose-variant" href="product.php?id=${product.id}">Elegir opciones →</a>`
      : `<button class="btn-add-cart" data-id="${product.id}">Agregar al carrito</button>`;
    return `
      <div class="product-card" data-id="${product.id}">
        <a href="product.php?id=${product.id}">
          <div class="card-image-wrap">
            ${imgSrc}
            <button class="btn-wish ${inWish ? 'wished' : ''}" data-id="${product.id}"
              title="${inWish ? 'Quitar de favoritos' : 'Agregar a favoritos'}">
              ${heartIcon(inWish)}
            </button>
          </div>
        </a>
        <div class="card-body">
          <span class="category-tag">${product.category}</span>
          <h3>${product.name}</h3>
          <p>${product.short_desc || ''}</p>
          <strong>${formatPrice(product.price)}</strong>
        </div>
        <div class="card-actions">
          ${cartBtn}
        </div>
      </div>
    `;
  }

  let allProducts       = [];
  let wishedIds         = new Set();
  let variantProductIds = new Set();
  let currentPage       = 1;

  function getFiltered() {
    const cat = catSelect?.value || '';
    return allProducts.filter(p => !cat || p.category === cat);
  }

  function renderPage(page) {
    const filtered = getFiltered();
    const total    = filtered.length;
    const pages    = Math.ceil(total / ITEMS_PER_PAGE);
    currentPage    = Math.max(1, Math.min(page, pages || 1));
    const countEl  = document.getElementById('catalog-count');
    if (countEl) countEl.textContent = total ? `${total} prenda${total !== 1 ? 's' : ''}` : '';

    const start = (currentPage - 1) * ITEMS_PER_PAGE;
    const slice = filtered.slice(start, start + ITEMS_PER_PAGE);

    if (total === 0) {
      grid.innerHTML = '<p class="empty-message">No se encontraron productos.</p>';
      if (paginEl) paginEl.innerHTML = '';
      return;
    }

    grid.innerHTML = slice.map(p => renderCard(p, wishedIds)).join('');
    renderPagination(pages);
    attachCardEvents();
  }

  function renderPagination(totalPages) {
    if (!paginEl) return;
    if (totalPages <= 1) { paginEl.innerHTML = ''; return; }

    let html = '';
    html += `<button class="page-btn" data-page="${currentPage - 1}" ${currentPage === 1 ? 'disabled' : ''}>‹</button>`;
    for (let i = 1; i <= totalPages; i++) {
      html += `<button class="page-btn ${i === currentPage ? 'active' : ''}" data-page="${i}">${i}</button>`;
    }
    html += `<button class="page-btn" data-page="${currentPage + 1}" ${currentPage === totalPages ? 'disabled' : ''}>›</button>`;
    paginEl.innerHTML = html;

    paginEl.querySelectorAll('.page-btn:not([disabled])').forEach(btn => {
      btn.addEventListener('click', () => {
        renderPage(Number(btn.dataset.page));
        window.scrollTo({ top: 0, behavior: 'smooth' });
      });
    });
  }

  function attachCardEvents() {
    grid.querySelectorAll('.btn-add-cart').forEach(btn => {
      btn.addEventListener('click', (e) => {
        e.preventDefault();
        const product = allProducts.find(p => p.id === Number(btn.dataset.id));
        if (!product) return;
        addToCart(product, null);
        const badge = document.getElementById('cart-badge');
        if (badge) badge.textContent = getCartCount();
        btn.textContent = '✓ Agregado';
        setTimeout(() => { btn.textContent = 'Agregar al carrito'; }, 1500);
      });
    });

    grid.querySelectorAll('.btn-wish').forEach(btn => {
      btn.addEventListener('click', async (e) => {
        e.preventDefault();
        e.stopPropagation();
        const productId = Number(btn.dataset.id);
        const result = await toggleWishlist(productId);
        if (result.needsLogin) { window.location.href = 'auth.php?tab=login&redirect=' + encodeURIComponent(window.location.href); return; }
        if (result.added) wishedIds.add(productId); else wishedIds.delete(productId);
        const filled = wishedIds.has(productId);
        btn.innerHTML = heartIcon(filled);
        btn.title = filled ? 'Quitar de favoritos' : 'Agregar a favoritos';
        btn.classList.toggle('wished', filled);
      });
    });
  }

  async function reload() {
    grid.innerHTML = '<p class="empty-message">Cargando…</p>';
    const sort = sortSel?.value || 'newest';
    allProducts = await getProducts({ gender, search, sort });

    const ids = allProducts.map(p => p.id);
    variantProductIds = await getVariantProductIds(ids);

    await populateCategories(allProducts);
    renderPage(1);
  }

  await Promise.all([
    reload(),
    getWishlistIds().then(ids => { wishedIds = ids; }),
  ]);

  catSelect?.addEventListener('change', () => renderPage(1));
  sortSel?.addEventListener('change', reload);
});
