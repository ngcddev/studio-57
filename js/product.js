function _updateProductMeta(product) {
  const url = window.location.origin + '/product.php?id=' + product.id;
  const desc = (product.short_desc || product.description || '').slice(0, 160);
  const title = product.name + ' — Studio 57';

  document.title = title;
  document.getElementById('canonical-url')?.setAttribute('href', url);
  document.getElementById('meta-description')?.setAttribute('content', desc);
  document.getElementById('og-url')?.setAttribute('content', url);
  document.getElementById('og-title')?.setAttribute('content', title);
  document.getElementById('og-description')?.setAttribute('content', desc);
  document.getElementById('twitter-title')?.setAttribute('content', title);
  if (product.image_url) {
    document.getElementById('og-image')?.setAttribute('content', product.image_url);
    document.getElementById('twitter-image')?.setAttribute('content', product.image_url);
  }
}

function _injectProductSchema(product, variants) {
  const url  = window.location.origin + '/product.php?id=' + product.id;
  const inStock = product.stock > 0 || variants.some(v => v.stock > 0);

  const schema = {
    '@context': 'https://schema.org',
    '@graph': [
      {
        '@type': 'Product',
        name: product.name,
        description: product.description || product.short_desc || '',
        image: product.image_url || '',
        sku: String(product.id),
        brand: { '@type': 'Brand', name: 'Studio 57' },
        category: product.category || '',
        offers: {
          '@type': 'Offer',
          url,
          priceCurrency: 'COP',
          price: product.price,
          availability: inStock
            ? 'https://schema.org/InStock'
            : 'https://schema.org/OutOfStock',
          seller: { '@type': 'Organization', name: 'Studio 57' },
        },
      },
      {
        '@type': 'BreadcrumbList',
        itemListElement: [
          { '@type': 'ListItem', position: 1, name: 'Inicio',   item: window.location.origin + '/index.php' },
          { '@type': 'ListItem', position: 2, name: 'Catálogo', item: window.location.origin + '/catalog.php' },
          { '@type': 'ListItem', position: 3, name: product.category, item: window.location.origin + '/catalog.php?gender=' + (product.gender || '') },
          { '@type': 'ListItem', position: 4, name: product.name, item: url },
        ],
      },
    ],
  };

  const script = document.createElement('script');
  script.type = 'application/ld+json';
  script.textContent = JSON.stringify(schema);
  document.head.appendChild(script);
}

document.addEventListener('DOMContentLoaded', async () => {
  const container = document.getElementById('product-detail');
  const id        = getQueryParam('id');

  if (!id) {
    container.innerHTML = '<p>Producto no encontrado. <a href="catalog.php">Volver</a></p>';
    return;
  }

  container.innerHTML = '<p class="empty-message">Cargando…</p>';

  const [product, variants, wishedIds] = await Promise.all([
    getProductById(id),
    getVariants(id),
    getWishlistIds(),
  ]);

  if (!product) {
    container.innerHTML = '<p>Producto no encontrado. <a href="catalog.php">Volver</a></p>';
    return;
  }

  _updateProductMeta(product);
  _injectProductSchema(product, variants);

  const breadcrumb = document.getElementById('product-breadcrumb');
  if (breadcrumb) {
    const catUrl = 'catalog.php' + (product.gender ? '?gender=' + encodeURIComponent(product.gender) : '');
    breadcrumb.innerHTML =
      `<a href="index.php">Inicio</a> › ` +
      `<a href="catalog.php">Catálogo</a> › ` +
      `<a href="${catUrl}">${product.category}</a> › ` +
      `<span>${product.name}</span>`;
  }

  const colors = [...new Set(variants.filter(v => v.color).map(v => v.color))];
  const sizes  = [...new Set(variants.filter(v => v.size).map(v => v.size))];
  let inWish   = wishedIds.has(product.id);

  function heartIcon(filled) {
    return filled
      ? `<svg width="18" height="18" viewBox="0 0 24 24" fill="#e53e3e" stroke="#e53e3e" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`
      : `<svg width="18" height="18" viewBox="0 0 24 24" fill="none" stroke="currentColor" stroke-width="2"><path d="M20.84 4.61a5.5 5.5 0 0 0-7.78 0L12 5.67l-1.06-1.06a5.5 5.5 0 0 0-7.78 7.78l1.06 1.06L12 21.23l7.78-7.78 1.06-1.06a5.5 5.5 0 0 0 0-7.78z"/></svg>`;
  }

  function buildSelectors() {
    let html = '';
    if (colors.length > 0) {
      html += `<div class="variant-group">
        <label class="variant-label">Color: <span id="color-chosen"></span></label>
        <div class="color-swatches">
          ${colors.map(c => `<button class="swatch" data-color="${c}">${c}</button>`).join('')}
        </div>
      </div>`;
    }
    if (sizes.length > 0) {
      html += `<div class="variant-group">
        <label class="variant-label">Talla: <span id="size-chosen"></span></label>
        <div class="size-swatches">
          ${sizes.map(s => `<button class="swatch size-swatch" data-size="${s}">${s}</button>`).join('')}
        </div>
      </div>`;
    }
    return html;
  }

  container.innerHTML = `
    <div class="detail-image">
      <img src="${product.image_url}" alt="${product.name}" width="600" height="750" fetchpriority="high">
    </div>
    <div class="detail-info">
      <span class="category-tag">${product.category}</span>
      <h1>${product.name}</h1>
      <p class="detail-short">${product.short_desc}</p>
      <p class="detail-price">${formatPrice(product.price)}</p>
      ${buildSelectors()}
      <p class="detail-stock" id="stock-info"></p>
      <p class="detail-description">${product.description}</p>
      <div class="detail-actions">
        <button id="btn-add-cart" class="btn-primary" ${variants.length > 0 ? 'disabled' : ''}>
          ${variants.length > 0 ? 'Selecciona una opción' : 'Agregar al carrito'}
        </button>
        <button id="btn-wish" class="btn-wish-detail icon-btn ${inWish ? 'wished' : ''}" title="${inWish ? 'Quitar de favoritos' : 'Agregar a favoritos'}">
          ${heartIcon(inWish)}
        </button>
      </div>
      <a href="catalog.php" class="btn-secondary">← Volver al catálogo</a>
    </div>
  `;

  const addBtn    = document.getElementById('btn-add-cart');
  const wishBtn   = document.getElementById('btn-wish');
  const stockInfo = document.getElementById('stock-info');

  let selectedColor = colors.length === 1 ? colors[0] : null;
  let selectedSize  = sizes.length  === 1 ? sizes[0]  : null;

  if (variants.length === 0) {
    addBtn.disabled = false;
    addBtn.textContent = 'Agregar al carrito';
  }

  function getActiveVariant() {
    return variants.find(v =>
      (colors.length === 0 || v.color === selectedColor) &&
      (sizes.length  === 0 || v.size  === selectedSize)
    ) || null;
  }

  function updateUI() {
    const variant = getActiveVariant();
    if (variant) {
      stockInfo.textContent = variant.stock > 0 ? `${variant.stock} disponibles` : 'Sin stock';
      stockInfo.style.color = variant.stock > 0 ? '#4a7c59' : '#e53e3e';
      addBtn.disabled   = variant.stock <= 0;
      addBtn.textContent = variant.stock > 0 ? 'Agregar al carrito' : 'Sin stock';
    } else if (variants.length > 0) {
      stockInfo.textContent = '';
      addBtn.disabled = true;
      addBtn.textContent = (!selectedColor && colors.length > 0) ? 'Selecciona un color'
        : (!selectedSize && sizes.length > 0) ? 'Selecciona una talla' : 'Sin stock';
    }

    document.querySelectorAll('.swatch[data-color]').forEach(s =>
      s.classList.toggle('selected', s.dataset.color === selectedColor));
    document.querySelectorAll('.swatch[data-size]').forEach(s =>
      s.classList.toggle('selected', s.dataset.size === selectedSize));

    const cl = document.getElementById('color-chosen');
    const sl = document.getElementById('size-chosen');
    if (cl) cl.textContent = selectedColor ? `— ${selectedColor}` : '';
    if (sl) sl.textContent = selectedSize  ? `— ${selectedSize}`  : '';
  }

  container.addEventListener('click', (e) => {
    const s = e.target.closest('.swatch');
    if (!s) return;
    if (s.dataset.color !== undefined) selectedColor = s.dataset.color;
    if (s.dataset.size  !== undefined) selectedSize  = s.dataset.size;
    updateUI();
  });

  updateUI();

  addBtn.addEventListener('click', () => {
    const variant = variants.length > 0 ? getActiveVariant() : null;
    addToCart(product, variant);
    const badge = document.getElementById('cart-badge');
    if (badge) badge.textContent = getCartCount();
    addBtn.textContent = '✓ Agregado';
    setTimeout(() => updateUI(), 1500);
  });

  // Wishlist
  wishBtn.addEventListener('click', async () => {
    const result = await toggleWishlist(product.id);
    if (result.needsLogin) { window.location.href = 'auth.php?tab=login&redirect=' + encodeURIComponent(window.location.href); return; }
    inWish = result.added;
    wishBtn.innerHTML = heartIcon(inWish);
    wishBtn.title = inWish ? 'Quitar de favoritos' : 'Agregar a favoritos';
    wishBtn.classList.toggle('wished', inWish);
  });

  // Productos relacionados
  const related = await getRelatedProducts(id, product.category);
  if (related.length > 0) {
    const section = document.getElementById('related-section');
    const relGrid = document.getElementById('related-grid');
    if (section && relGrid) {
      section.style.display = 'block';
      relGrid.innerHTML = related.map(p => {
        const imgHtml = p.image_url
          ? `<img src="${p.image_url}" alt="${p.name}" loading="lazy">`
          : `<div class="card-img-placeholder">${p.category || ''}</div>`;
        return `
          <div class="product-card">
            <a href="product.php?id=${p.id}">
              <div class="card-image-wrap">${imgHtml}</div>
              <div class="card-body">
                <span class="category-tag">${p.category}</span>
                <h3>${p.name}</h3>
                <p>${p.short_desc || ''}</p>
                <strong>${formatPrice(p.price)}</strong>
              </div>
            </a>
          </div>
        `;
      }).join('');
    }
  }
});
