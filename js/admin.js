const ORDER_STATUSES = [
  { value: 'received',   label: 'Recibido',   color: '#3182ce' },
  { value: 'processing', label: 'Procesando', color: '#d97706' },
  { value: 'shipped',    label: 'Enviado',    color: '#7c3aed' },
  { value: 'delivered',  label: 'Entregado',  color: '#16a34a' },
  { value: 'cancelled',  label: 'Cancelado',  color: '#dc2626' },
];

function statusBadge(status) {
  const s = ORDER_STATUSES.find(x => x.value === status) || { label: status, color: '#888' };
  return `<span class="status-badge" style="background:${s.color}20;color:${s.color}">${s.label}</span>`;
}

document.addEventListener('DOMContentLoaded', async () => {
  const page = document.body.dataset.page;

  // ── Login ─────────────────────────────────────────────────────────────────
  if (page === 'admin-login') {
    const session = await getAdminSession();
    if (session) { window.location.href = 'dashboard.php'; return; }

    document.getElementById('login-form').addEventListener('submit', async (e) => {
      e.preventDefault();
      const btn     = e.target.querySelector('button[type="submit"]');
      const errorEl = document.getElementById('login-error');
      btn.disabled = true; btn.textContent = 'Ingresando…'; errorEl.textContent = '';

      const ok = await adminLogin(
        document.getElementById('admin-email').value,
        document.getElementById('admin-password').value
      );
      if (ok) { window.location.href = 'dashboard.php'; }
      else { errorEl.textContent = 'Credenciales incorrectas.'; btn.disabled = false; btn.textContent = 'Ingresar'; }
    });
    return;
  }

  // Guard
  const session = await getAdminSession();
  if (!session) { window.location.href = 'login.php'; return; }

  document.getElementById('btn-logout').addEventListener('click', async () => {
    await adminLogout();
    window.location.href = 'login.php';
  });

  // ── Dashboard ─────────────────────────────────────────────────────────────
  if (page === 'admin-dashboard') {
    const metricsEl = document.getElementById('dash-metrics');
    const tbody     = document.getElementById('recent-tbody');

    const stats = await getDashboardStats();

    const cards = [
      { label: 'Ventas totales',   value: formatPrice(stats.totalSales),  icon: '💰', color: '#16a34a' },
      { label: 'Pedidos totales',  value: stats.totalOrders,              icon: '📦', color: '#3182ce' },
      { label: 'Pedidos hoy',      value: stats.todayOrders,              icon: '🕐', color: '#7c3aed' },
      { label: 'Sin stock',        value: stats.noStock,                  icon: '⚠️', color: stats.noStock > 0 ? '#dc2626' : '#16a34a' },
    ];

    metricsEl.innerHTML = cards.map(c => `
      <div class="metric-card">
        <div class="metric-icon">${c.icon}</div>
        <div class="metric-body">
          <p class="metric-label">${c.label}</p>
          <p class="metric-value" style="color:${c.color}">${c.value}</p>
        </div>
      </div>
    `).join('');

    if (stats.recentOrders.length === 0) {
      tbody.innerHTML = '<tr><td colspan="5">No hay pedidos aún.</td></tr>';
    } else {
      tbody.innerHTML = stats.recentOrders.map(o => `
        <tr>
          <td style="font-family:monospace;font-size:.8rem">${o.id.slice(0,8).toUpperCase()}</td>
          <td>${new Date(o.created_at).toLocaleString('es-CO')}</td>
          <td>${o.customer_name}</td>
          <td>${formatPrice(o.total)}</td>
          <td>${statusBadge(o.status)}</td>
        </tr>
      `).join('');
    }
    return;
  }

  // ── Pedidos ───────────────────────────────────────────────────────────────
  if (page === 'admin-orders') {
    const tbody    = document.getElementById('orders-tbody');
    const detailEl = document.getElementById('order-detail');
    let orders     = [];

    async function loadOrders() {
      tbody.innerHTML = '<tr><td colspan="6">Cargando…</td></tr>';
      orders = await getOrders();
      renderOrders();
    }

    function renderOrders() {
      if (orders.length === 0) {
        tbody.innerHTML = '<tr><td colspan="6">No hay pedidos aún.</td></tr>';
        return;
      }
      tbody.innerHTML = orders.map(o => `
        <tr>
          <td style="font-family:monospace;font-size:.8rem">${o.id.slice(0,8).toUpperCase()}</td>
          <td>${new Date(o.created_at).toLocaleString('es-CO')}</td>
          <td>${o.customer_name}</td>
          <td>${formatPrice(o.total)}</td>
          <td>
            <select class="status-select" data-id="${o.id}">
              ${ORDER_STATUSES.map(s =>
                `<option value="${s.value}" ${o.status === s.value ? 'selected' : ''}>${s.label}</option>`
              ).join('')}
            </select>
          </td>
          <td><button class="btn-view-order" data-id="${o.id}">Ver</button></td>
        </tr>
      `).join('');

      tbody.querySelectorAll('.status-select').forEach(sel => {
        sel.addEventListener('change', async () => {
          const ok = await updateOrderStatus(sel.dataset.id, sel.value);
          if (ok) {
            const o = orders.find(x => x.id === sel.dataset.id);
            if (o) o.status = sel.value;
          } else {
            alert('Error al actualizar estado.');
          }
        });
      });

      tbody.querySelectorAll('.btn-view-order').forEach(btn => {
        btn.addEventListener('click', () => {
          const order = orders.find(o => o.id === btn.dataset.id);
          if (!order) return;
          detailEl.style.display = 'block';
          detailEl.innerHTML = `
            <h3>Pedido #${order.id.slice(0,8).toUpperCase()} ${statusBadge(order.status)}</h3>
            <p><strong>Fecha:</strong> ${new Date(order.created_at).toLocaleString('es-CO')}</p>
            <p><strong>Cliente:</strong> ${order.customer_name}</p>
            <p><strong>Email:</strong> ${order.customer_email}</p>
            <p><strong>Dirección:</strong> ${order.customer_address}</p>
            <table>
              <thead><tr><th>Producto</th><th>Variante</th><th>Cant.</th><th>Precio</th><th>Subtotal</th></tr></thead>
              <tbody>
                ${(order.order_items || []).map(i => `
                  <tr>
                    <td>${i.product_name}</td>
                    <td>${[i.color, i.size ? `T.${i.size}` : ''].filter(Boolean).join(' ')  || '—'}</td>
                    <td>${i.quantity}</td>
                    <td>${formatPrice(i.price)}</td>
                    <td>${formatPrice(i.price * i.quantity)}</td>
                  </tr>
                `).join('')}
              </tbody>
              <tfoot><tr><td colspan="4"><strong>Total</strong></td><td><strong>${formatPrice(order.total)}</strong></td></tr></tfoot>
            </table>
            <button id="close-detail">Cerrar</button>
          `;
          document.getElementById('close-detail').addEventListener('click', () => {
            detailEl.style.display = 'none';
          });
        });
      });
    }

    loadOrders();
  }

  // ── Productos ─────────────────────────────────────────────────────────────
  if (page === 'admin-products') {
    const tbody    = document.getElementById('products-tbody');
    const modal    = document.getElementById('product-modal');
    const pForm    = document.getElementById('product-form');
    const btnNew   = document.getElementById('btn-new-product');
    const varModal = document.getElementById('variant-modal');
    const varForm  = document.getElementById('variant-form');

    async function renderProducts() {
      tbody.innerHTML = '<tr><td colspan="6">Cargando…</td></tr>';
      const products = await getProducts();
      tbody.innerHTML = products.map(p => `
        <tr>
          <td>${p.id}</td>
          <td>${p.name}</td>
          <td>${p.category}</td>
          <td>${formatPrice(p.price)}</td>
          <td>${p.stock ?? '—'}</td>
          <td>
            <button class="btn-edit"     data-id="${p.id}">Editar</button>
            <button class="btn-variants" data-id="${p.id}" data-name="${p.name}">Variantes</button>
            <button class="btn-delete"   data-id="${p.id}">Eliminar</button>
          </td>
        </tr>
      `).join('');

      tbody.querySelectorAll('.btn-edit').forEach(btn => {
        btn.addEventListener('click', () => openProductModal(Number(btn.dataset.id), products));
      });
      tbody.querySelectorAll('.btn-variants').forEach(btn => {
        btn.addEventListener('click', () => openVariantModal(Number(btn.dataset.id), btn.dataset.name));
      });
      tbody.querySelectorAll('.btn-delete').forEach(btn => {
        btn.addEventListener('click', async () => {
          if (confirm('¿Eliminar este producto?')) {
            await deleteProduct(Number(btn.dataset.id));
            renderProducts();
          }
        });
      });
    }

    // ── Upload de imagen ────────────────────────────────────────────────────
    const fileInput   = document.getElementById('product-image-file');
    const imgPreview  = document.getElementById('product-image-preview');
    const uploadStatus = document.getElementById('upload-status');

    fileInput.addEventListener('change', async () => {
      const file = fileInput.files[0];
      if (!file) return;
      uploadStatus.textContent = 'Subiendo imagen…';
      imgPreview.style.display = 'none';
      const url = await uploadProductImage(file);
      if (url) {
        document.getElementById('product-imageurl').value = url;
        imgPreview.src = url;
        imgPreview.style.display = 'block';
        uploadStatus.textContent = '✓ Imagen subida';
      } else {
        uploadStatus.textContent = 'Error al subir imagen. Pega una URL manualmente.';
      }
    });

    // ── Modal producto ──────────────────────────────────────────────────────
    function openProductModal(id = null, products = []) {
      pForm.reset();
      fileInput.value = '';
      imgPreview.style.display = 'none';
      uploadStatus.textContent = '';
      document.getElementById('product-id').value = '';
      document.getElementById('modal-title').textContent = id ? 'Editar producto' : 'Nuevo producto';
      if (id) {
        const p = products.find(x => x.id === id);
        if (!p) return;
        document.getElementById('product-id').value          = p.id;
        document.getElementById('product-name').value        = p.name;
        document.getElementById('product-shortdesc').value   = p.short_desc || '';
        document.getElementById('product-description').value = p.description || '';
        document.getElementById('product-price').value       = p.price;
        document.getElementById('product-category').value    = p.category;
        document.getElementById('product-gender').value      = p.gender || 'unisex';
        document.getElementById('product-imageurl').value    = p.image_url || '';
        document.getElementById('product-stock').value       = p.stock ?? 0;
        if (p.image_url) {
          imgPreview.src = p.image_url;
          imgPreview.style.display = 'block';
        }
      }
      modal.style.display = 'flex';
    }

    btnNew.addEventListener('click', () => openProductModal());
    document.getElementById('btn-cancel-modal').addEventListener('click', () => { modal.style.display = 'none'; });

    pForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      const id   = document.getElementById('product-id').value;
      const data = {
        name:        document.getElementById('product-name').value,
        short_desc:  document.getElementById('product-shortdesc').value,
        description: document.getElementById('product-description').value,
        price:       parseFloat(document.getElementById('product-price').value),
        category:    document.getElementById('product-category').value,
        gender:      document.getElementById('product-gender').value,
        image_url:   document.getElementById('product-imageurl').value,
        stock:       parseInt(document.getElementById('product-stock').value, 10),
      };
      if (id) { await updateProduct({ id: Number(id), ...data }); }
      else    { await addProduct(data); }
      modal.style.display = 'none';
      renderProducts();
    });

    // ── Modal variantes ─────────────────────────────────────────────────────
    let currentProductId = null;

    async function openVariantModal(productId, productName) {
      currentProductId = productId;
      document.getElementById('variant-modal-title').textContent = `Variantes — ${productName}`;
      varModal.style.display = 'flex';
      varForm.reset();
      await renderVariantsList();
    }

    async function renderVariantsList() {
      const varList = document.getElementById('variants-list');
      const variants = await getVariants(currentProductId);
      if (variants.length === 0) {
        varList.innerHTML = '<p style="color:#888;font-size:.85rem">Sin variantes aún.</p>';
        return;
      }
      varList.innerHTML = `<table class="data-table">
        <thead><tr><th>Talla</th><th>Color</th><th>Stock</th><th></th></tr></thead>
        <tbody>
          ${variants.map(v => `
            <tr>
              <td>${v.size  || '—'}</td>
              <td>${v.color || '—'}</td>
              <td>${v.stock}</td>
              <td><button class="btn-delete btn-del-variant" data-id="${v.id}">×</button></td>
            </tr>
          `).join('')}
        </tbody>
      </table>`;

      varList.querySelectorAll('.btn-del-variant').forEach(btn => {
        btn.addEventListener('click', async () => {
          await deleteVariant(Number(btn.dataset.id));
          renderVariantsList();
        });
      });
    }

    varForm.addEventListener('submit', async (e) => {
      e.preventDefault();
      await upsertVariant({
        product_id: currentProductId,
        size:  document.getElementById('var-size').value.trim()  || null,
        color: document.getElementById('var-color').value.trim() || null,
        stock: parseInt(document.getElementById('var-stock').value, 10),
      });
      varForm.reset();
      renderVariantsList();
    });

    document.getElementById('btn-cancel-variant').addEventListener('click', () => {
      varModal.style.display = 'none';
    });

    renderProducts();
  }
});
