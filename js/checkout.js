document.addEventListener('DOMContentLoaded', async () => {
  const stepShipping = document.getElementById('step-shipping');
  const stepPayment  = document.getElementById('step-payment');
  const stepConfirm  = document.getElementById('step-confirm');
  const formShipping = document.getElementById('form-shipping');
  const formPayment  = document.getElementById('form-payment');
  const cartBadge    = document.getElementById('cart-badge');

  function updateCartBadge() {
    if (cartBadge) cartBadge.textContent = getCartCount() || '';
  }

  if (getCart().length === 0) {
    window.location.href = 'cart.php';
    return;
  }

  // Requiere sesión activa
  const _checkoutUser = await getCurrentUser();
  if (!_checkoutUser) {
    window.location.href = 'auth.php?tab=login&redirect=checkout.php';
    return;
  }

  function renderSummary(containerId, totalId) {
    const container = document.getElementById(containerId);
    const totalEl   = document.getElementById(totalId);
    if (!container) return;
    container.innerHTML = getCart().map(i => {
      const v = [i.color, i.size ? `T. ${i.size}` : ''].filter(Boolean).join(' · ');
      return `<div class="summary-item">
        <span>${i.name}${v ? ` <small>(${v})</small>` : ''} × ${i.quantity}</span>
        <span>${formatPrice(i.price * i.quantity)}</span>
      </div>`;
    }).join('');
    if (totalEl) totalEl.textContent = formatPrice(getCartTotal());
  }

  renderSummary('order-summary-items', 'order-summary-total');

  let shippingData = {};

  // ── Pre-rellenar desde perfil ─────────────────────────────────────────────
  (async () => {
    const [profile, user] = await Promise.all([getProfile(), getCurrentUser()]);
    if (user?.email)      document.getElementById('customer-email').value   = user.email;
    if (profile?.full_name) document.getElementById('customer-name').value  = profile.full_name;
    if (profile?.address)   document.getElementById('customer-address').value = profile.address;

    if (profile?.full_name || profile?.address) {
      const hint = document.getElementById('prefill-hint');
      if (hint) hint.style.display = 'block';
    }
  })();

  // ── Paso 1: envío ────────────────────────────────────────────────────────
  formShipping.addEventListener('submit', (e) => {
    e.preventDefault();
    const errorEl = document.getElementById('shipping-errors');
    errorEl.innerHTML = '';

    const name    = document.getElementById('customer-name').value.trim();
    const email   = document.getElementById('customer-email').value.trim();
    const address = document.getElementById('customer-address').value.trim();
    const errors  = [];

    if (!name)    errors.push('El nombre es obligatorio.');
    if (!email || !/^[^\s@]+@[^\s@]+\.[^\s@]+$/.test(email)) errors.push('Email inválido.');
    if (!address) errors.push('La dirección es obligatoria.');

    if (errors.length > 0) { errorEl.innerHTML = errors.map(e => `<p>${e}</p>`).join(''); return; }

    shippingData = { name, email, address,
      saveAddress: document.getElementById('save-address')?.checked };

    stepShipping.style.display = 'none';
    stepPayment.style.display  = 'block';
    document.getElementById('indicator-1').classList.remove('active');
    document.getElementById('indicator-2').classList.add('active');

    renderSummary('order-summary-items-2', 'order-summary-total-2');
    const payTotalEl = document.getElementById('pay-total');
    if (payTotalEl) payTotalEl.textContent = formatPrice(getCartTotal());
  });

  // ── Formato de tarjeta ────────────────────────────────────────────────────
  document.getElementById('card-number')?.addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '').slice(0, 16);
    this.value = v.match(/.{1,4}/g)?.join(' ') || v;
  });
  document.getElementById('card-expiry')?.addEventListener('input', function () {
    let v = this.value.replace(/\D/g, '').slice(0, 4);
    if (v.length > 2) v = v.slice(0, 2) + '/' + v.slice(2);
    this.value = v;
  });

  // ── Paso 2: pago ─────────────────────────────────────────────────────────
  formPayment.addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorEl = document.getElementById('payment-errors');
    const btn     = formPayment.querySelector('button[type="submit"]');
    errorEl.innerHTML = '';

    const errors = validateCard({
      number: document.getElementById('card-number').value,
      expiry: document.getElementById('card-expiry').value,
      cvv:    document.getElementById('card-cvv').value,
      name:   document.getElementById('card-name').value,
    });
    if (errors.length > 0) { errorEl.innerHTML = errors.map(e => `<p>${e}</p>`).join(''); return; }

    btn.disabled = true; btn.textContent = 'Verificando stock…';

    const stockIssues = await checkStock(getCart());
    if (stockIssues.length > 0) {
      errorEl.innerHTML = '<p><strong>Algunos productos ya no tienen suficiente stock:</strong></p>' +
        stockIssues.map(msg => `<p>· ${msg}</p>`).join('');
      btn.disabled = false; btn.textContent = `Pagar ${formatPrice(getCartTotal())}`;
      return;
    }

    btn.textContent = 'Procesando pago…';
    const paymentOk = await simulatePayment();
    if (!paymentOk) {
      errorEl.innerHTML = '<p>Pago rechazado. Verifica los datos.</p>';
      btn.disabled = false; btn.textContent = `Pagar ${formatPrice(getCartTotal())}`;
      return;
    }

    // Guardar dirección en perfil si el usuario lo indicó
    if (shippingData.saveAddress) {
      updateProfile({ address: shippingData.address }).catch(() => {});
    }

    const order = await saveOrder({ customer: shippingData, items: getCart(), total: getCartTotal() });

    if (!order) {
      errorEl.innerHTML = '<p>Error al guardar el pedido. Intenta de nuevo.</p>';
      btn.disabled = false; btn.textContent = `Pagar ${formatPrice(getCartTotal())}`;
      return;
    }

    clearCart();
    updateCartBadge();

    // ── Paso 3: confirmación ──────────────────────────────────────────────
    stepPayment.style.display = 'none';
    stepConfirm.style.display = 'block';
    document.getElementById('indicator-2').classList.remove('active');
    document.getElementById('indicator-3').classList.add('active');

    document.getElementById('confirm-order-id').textContent = order.id.slice(0,8).toUpperCase();
    document.getElementById('confirm-name').textContent     = shippingData.name;
    document.getElementById('confirm-email').textContent    = shippingData.email;
    document.getElementById('confirm-total').textContent    = formatPrice(order.total);
    document.getElementById('confirm-items').innerHTML = (order.order_items || [])
      .map(i => `<li>${i.product_name} × ${i.quantity}</li>`).join('');
  });

  document.getElementById('btn-back-shipping')?.addEventListener('click', () => {
    stepPayment.style.display  = 'none';
    stepShipping.style.display = 'block';
    document.getElementById('indicator-2').classList.remove('active');
    document.getElementById('indicator-1').classList.add('active');
  });
});
