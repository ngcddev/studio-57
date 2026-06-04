<!DOCTYPE html>
<html lang="es">
<head>
    <meta name="google-site-verification" content="Uki3-zqQG_Qh86pj_dZ_4OLN7j06DCONZnkcgio12OU" />
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Productos – Admin</title>
  <link rel="preload" href="../css/fonts/horizon.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/global.css">
  <link rel="stylesheet" href="../css/admin.css">
</head>
<body data-page="admin-products">

  <div class="admin-layout">
    <aside class="admin-sidebar">
      <a href="../index.php" class="sidebar-brand">Studio 57</a>
      <a href="dashboard.php">Dashboard</a>
      <a href="orders.php">Pedidos</a>
      <a href="products.php" class="active">Productos</a>
      <a href="../index.php">Ver tienda</a>
      <button class="btn-logout" id="btn-logout">Cerrar sesión</button>
    </aside>

    <main class="admin-content">
      <h1>Productos</h1>
      <p class="admin-sub">Catálogo de prendas disponibles en la tienda</p>
      <button class="btn-primary" id="btn-new-product" style="margin-bottom:1.25rem">+ Nuevo producto</button>
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Nombre</th>
            <th>Categoría</th>
            <th>Precio</th>
            <th>Stock</th>
            <th>Novedad</th>
            <th>Acciones</th>
          </tr>
        </thead>
        <tbody id="products-tbody"></tbody>
      </table>
    </main>
  </div>

  <!-- Modal: producto -->
  <div class="modal-overlay" id="product-modal">
    <div class="modal-box">
      <h2 id="modal-title">Nuevo producto</h2>
      <form id="product-form">
        <input type="hidden" id="product-id">
        <div class="form-group">
          <label for="product-name">Nombre</label>
          <input type="text" id="product-name" required>
        </div>
        <div class="form-group">
          <label for="product-shortdesc">Descripción corta</label>
          <input type="text" id="product-shortdesc" required>
        </div>
        <div class="form-group">
          <label for="product-description">Descripción completa</label>
          <textarea id="product-description" required></textarea>
        </div>
        <div class="form-group">
          <label for="product-price">Precio (COP)</label>
          <input type="number" id="product-price" min="0" step="100" required>
        </div>
        <div class="form-group">
          <label for="product-category">Categoría</label>
          <input type="text" id="product-category" required>
        </div>
        <div class="form-group">
          <label for="product-gender">Género</label>
          <select id="product-gender">
            <option value="unisex">Unisex</option>
            <option value="hombre">Hombre</option>
            <option value="mujer">Mujer</option>
          </select>
        </div>
        <div class="form-group">
          <label>Imagen del producto</label>
          <input type="file" id="product-image-file" accept="image/jpeg,image/png,image/webp,image/gif">
          <img id="product-image-preview" style="display:none;max-height:90px;margin-top:.5rem;border-radius:4px;object-fit:cover">
          <p id="upload-status" style="font-size:.78rem;color:var(--a-dim);margin-top:.25rem"></p>
          <input type="text" id="product-imageurl" placeholder="O pega una URL directamente" style="margin-top:.4rem">
        </div>
        <div class="form-group">
          <label for="product-stock">Stock base</label>
          <input type="number" id="product-stock" min="0" value="0" required>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn-cancel" id="btn-cancel-modal">Cancelar</button>
          <button type="submit" class="btn-primary">Guardar</button>
        </div>
      </form>
    </div>
  </div>

  <!-- Modal: variantes -->
  <div class="modal-overlay" id="variant-modal">
    <div class="modal-box">
      <h2 id="variant-modal-title">Variantes</h2>
      <div id="variants-list" style="margin-bottom:1rem"></div>
      <hr style="margin-bottom:1rem;border-color:var(--a-line)">
      <p style="font-size:.85rem;margin-bottom:.75rem;font-weight:600;color:var(--a-txt)">Agregar variante</p>
      <form id="variant-form">
        <div class="card-row">
          <div class="form-group">
            <label for="var-size">Talla</label>
            <input type="text" id="var-size" placeholder="M, L, XL…">
          </div>
          <div class="form-group">
            <label for="var-color">Color</label>
            <input type="text" id="var-color" placeholder="Negro, Azul…">
          </div>
          <div class="form-group">
            <label for="var-stock">Stock</label>
            <input type="number" id="var-stock" min="0" value="0" required>
          </div>
        </div>
        <div class="modal-actions">
          <button type="button" class="btn-cancel" id="btn-cancel-variant">Cerrar</button>
          <button type="submit" class="btn-primary">Agregar</button>
        </div>
      </form>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="../js/supabase-client.js"></script>
  <script src="../js/store.js"></script>
  <script src="../js/admin.js"></script>
</body>
</html>
