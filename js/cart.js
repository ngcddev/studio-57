document.addEventListener('DOMContentLoaded', async () => {
  const cartContainer  = document.getElementById('cart-items');
  const summarySection = document.getElementById('cart-summary');
  const totalEl        = document.getElementById('cart-total');
  const cartBadge      = document.getElementById('cart-badge');

  function updateCartBadge() {
    const count = getCartCount();
    if (cartBadge) cartBadge.textContent = count > 0 ? count : '';
  }

  function variantLabel(item) {
    const parts = [];
    if (item.color) parts.push(item.color);
    if (item.size)  parts.push(`Talla ${item.size}`);
    return parts.join(' · ');
  }

  async function renderCart() {
    const cart = getCart();
    updateCartBadge();

    if (cart.length === 0) {
      cartContainer.innerHTML = '<p class="empty-message">Tu carrito está vacío. <a href="catalog.php">Ver productos</a></p>';
      summarySection.style.display = 'none';
      return;
    }

    const stockMap = await getStockForCartItems(cart);

    cartContainer.innerHTML = cart.map(item => {
      const max   = stockMap[item.key] ?? 999;
      const atMax = item.quantity >= max;
      const label = variantLabel(item);
      const img   = item.image_url || 'https://placehold.co/80x80/f5f5f5/aaa?text=?';
      return `
        <div class="cart-item" data-key="${item.key}">
          <img src="${img}" alt="${item.name}">
          <div class="cart-item-info">
            <h3>${item.name}</h3>
            ${label ? `<p class="variant-label">${label}</p>` : ''}
            <p>${formatPrice(item.price)} c/u</p>
            ${max === 0 ? '<p class="stock-warning">Sin stock disponible</p>' : ''}
          </div>
          <div class="cart-item-qty">
            <button class="btn-qty btn-minus" data-key="${item.key}">−</button>
            <input type="number" class="qty-input" value="${item.quantity}" min="1" max="${max}" data-key="${item.key}">
            <button class="btn-qty btn-plus" data-key="${item.key}" ${atMax ? 'disabled title="Stock máximo"' : ''}>+</button>
          </div>
          <p class="cart-item-subtotal">${formatPrice(item.price * item.quantity)}</p>
          <button class="btn-remove" data-key="${item.key}">Quitar</button>
        </div>
      `;
    }).join('');

    totalEl.textContent = formatPrice(getCartTotal());
    summarySection.style.display = 'block';

    cartContainer.querySelectorAll('.btn-minus').forEach(btn => {
      btn.addEventListener('click', () => {
        const item = getCart().find(i => i.key === btn.dataset.key);
        if (item) updateQty(btn.dataset.key, item.quantity - 1);
        renderCart();
      });
    });
    cartContainer.querySelectorAll('.btn-plus').forEach(btn => {
      btn.addEventListener('click', () => {
        const key  = btn.dataset.key;
        const item = getCart().find(i => i.key === key);
        const max  = stockMap[key] ?? 999;
        if (item && item.quantity < max) { updateQty(key, item.quantity + 1); renderCart(); }
      });
    });
    cartContainer.querySelectorAll('.qty-input').forEach(input => {
      input.addEventListener('change', () => {
        const key = input.dataset.key;
        const max = stockMap[key] ?? 999;
        const val = Math.max(1, Math.min(parseInt(input.value, 10) || 1, max));
        updateQty(key, val);
        renderCart();
      });
    });
    cartContainer.querySelectorAll('.btn-remove').forEach(btn => {
      btn.addEventListener('click', () => {
        removeFromCart(btn.dataset.key);
        renderCart();
      });
    });
  }

  renderCart();

  // ── Requiere sesión para ir al checkout ───────────────────────────────────
  document.querySelector('a[href="checkout.php"]')?.addEventListener('click', async (e) => {
    e.preventDefault();
    const user = await getCurrentUser();
    if (user) {
      window.location.href = 'checkout.php';
    } else {
      window.location.href = 'auth.php?tab=login&redirect=checkout.php';
    }
  });
});
