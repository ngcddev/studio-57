<!DOCTYPE html>
<html lang="es">
<head>
    <meta name="google-site-verification" content="Uki3-zqQG_Qh86pj_dZ_4OLN7j06DCONZnkcgio12OU" />
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Pedidos – Admin</title>
  <link rel="preload" href="../css/fonts/horizon.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/global.css">
  <link rel="stylesheet" href="../css/admin.css">
</head>
<body data-page="admin-orders">

  <div class="admin-layout">
    <aside class="admin-sidebar">
      <a href="../index.php" class="sidebar-brand">Studio 57</a>
      <a href="dashboard.php">Dashboard</a>
      <a href="orders.php" class="active">Pedidos</a>
      <a href="products.php">Productos</a>
      <a href="../index.php">Ver tienda</a>
      <button class="btn-logout" id="btn-logout">Cerrar sesión</button>
    </aside>

    <main class="admin-content">
      <h1>Pedidos</h1>
      <p class="admin-sub">Gestiona y actualiza el estado de los pedidos</p>
      <table class="data-table">
        <thead>
          <tr>
            <th>ID</th>
            <th>Fecha</th>
            <th>Cliente</th>
            <th>Total</th>
            <th>Estado</th>
            <th></th>
          </tr>
        </thead>
        <tbody id="orders-tbody"></tbody>
      </table>
      <div id="order-detail" style="display:none;" class="order-detail"></div>
    </main>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="../js/supabase-client.js"></script>
  <script src="../js/store.js"></script>
  <script src="../js/admin.js"></script>
</body>
</html>
