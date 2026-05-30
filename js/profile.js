document.addEventListener('DOMContentLoaded', async () => {
  const user = await getCurrentUser();
  if (!user) { window.location.href = 'auth.php'; return; }

  document.getElementById('profile-email').textContent = user.email;

  // Cargar perfil y wishlist en paralelo
  const [profile, wishlistProducts, orders] = await Promise.all([
    getProfile(),
    getWishlist(),
    getUserOrders(),
  ]);

  // ── Datos personales ────────────────────────────────────────────────────
  if (profile) {
    document.getElementById('profile-name').value    = profile.full_name || '';
    document.getElementById('profile-phone').value   = profile.phone    || '';
    document.getElementById('profile-address').value = profile.address  || '';
  }

  document.getElementById('profile-form').addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn      = e.target.querySelector('button[type="submit"]');
    const statusEl = document.getElementById('profile-status');
    btn.disabled = true; btn.textContent = 'Guardando…'; statusEl.textContent = '';

    const ok = await updateProfile({
      full_name: document.getElementById('profile-name').value.trim(),
      phone:     document.getElementById('profile-phone').value.trim(),
      address:   document.getElementById('profile-address').value.trim(),
    });

    statusEl.textContent = ok ? '✓ Perfil actualizado.' : 'Error al guardar.';
    statusEl.style.color = ok ? '#276749' : '#e53e3e';
    btn.disabled = false; btn.textContent = 'Guardar cambios';
  });

  // ── Favoritos ────────────────────────────────────────────────────────────
  const wishEl = document.getElementById('wishlist-grid');
  if (wishlistProducts.length === 0) {
    wishEl.innerHTML = '<p class="empty-message">No tienes favoritos aún. <a href="catalog.php">Ver productos</a></p>';
  } else {
    wishEl.innerHTML = wishlistProducts.map(p => `
      <div class="wish-card">
        <a href="product.php?id=${p.id}">
          <img src="${p.image_url}" alt="${p.name}">
          <p class="wish-name">${p.name}</p>
          <p class="wish-price">${formatPrice(p.price)}</p>
        </a>
        <button class="btn-remove-wish" data-id="${p.id}">× Quitar</button>
      </div>
    `).join('');

    wishEl.querySelectorAll('.btn-remove-wish').forEach(btn => {
      btn.addEventListener('click', async () => {
        await toggleWishlist(Number(btn.dataset.id));
        btn.closest('.wish-card').remove();
        if (!wishEl.querySelector('.wish-card'))
          wishEl.innerHTML = '<p class="empty-message">No tienes favoritos aún.</p>';
      });
    });
  }

  // ── Historial de pedidos ─────────────────────────────────────────────────
  const ordersEl = document.getElementById('orders-list');
  if (orders.length === 0) {
    ordersEl.innerHTML = '<p class="empty-message">Aún no tienes pedidos. <a href="catalog.php">Ver productos</a></p>';
  } else {
    const statusLabels = {
      received: 'Recibido', processing: 'Procesando',
      shipped: 'Enviado', delivered: 'Entregado', cancelled: 'Cancelado',
    };
    const statusColors = {
      received: '#3182ce', processing: '#d97706',
      shipped: '#7c3aed', delivered: '#16a34a', cancelled: '#dc2626',
    };
    ordersEl.innerHTML = orders.map(o => {
      const color = statusColors[o.status] || '#888';
      const label = statusLabels[o.status] || o.status;
      return `
        <div class="order-card">
          <div class="order-card-header">
            <span class="order-card-id">#${o.id.slice(0,8).toUpperCase()}</span>
            <span>${new Date(o.created_at).toLocaleDateString('es-CO')}</span>
            <span class="order-status" style="background:${color}20;color:${color}">${label}</span>
            <strong>${formatPrice(o.total)}</strong>
          </div>
          <ul class="order-card-items">
            ${(o.order_items || []).map(i => {
              const v = [i.color, i.size ? `T.${i.size}` : ''].filter(Boolean).join(' ');
              return `<li>${i.product_name}${v ? ` (${v})` : ''} × ${i.quantity}</li>`;
            }).join('')}
          </ul>
        </div>
      `;
    }).join('');
  }

  // ── Cambiar contraseña ────────────────────────────────────────────────────
  document.getElementById('form-change-password')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn      = e.target.querySelector('button[type="submit"]');
    const statusEl = document.getElementById('password-status');
    const newPwd   = document.getElementById('new-pwd').value;
    const confirm  = document.getElementById('confirm-pwd').value;
    statusEl.textContent = '';

    if (newPwd.length < 6) { statusEl.style.color = '#e53e3e'; statusEl.textContent = 'Mínimo 6 caracteres.'; return; }
    if (newPwd !== confirm) { statusEl.style.color = '#e53e3e'; statusEl.textContent = 'Las contraseñas no coinciden.'; return; }

    btn.disabled = true; btn.textContent = 'Guardando…';
    const ok = await updatePassword(newPwd);
    statusEl.style.color = ok ? '#276749' : '#e53e3e';
    statusEl.textContent = ok ? '✓ Contraseña actualizada.' : 'Error al actualizar.';
    btn.disabled = false; btn.textContent = 'Actualizar contraseña';
    if (ok) e.target.reset();
  });

  // ── Cerrar sesión ─────────────────────────────────────────────────────────
  document.getElementById('btn-signout').addEventListener('click', async () => {
    await signOut();
    window.location.href = 'index.php';
  });
});
