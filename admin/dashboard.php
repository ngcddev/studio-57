<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Dashboard — Admin | Studio 57</title>
  <meta name="robots" content="noindex, nofollow">
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/global.css">
  <link rel="stylesheet" href="../css/admin.css">
</head>
<body data-page="admin-dashboard">

  <div class="admin-layout">
    <aside class="admin-sidebar">
      <a href="../index.php" class="sidebar-brand">Studio 57</a>
      <a href="dashboard.php" class="active">Dashboard</a>
      <a href="orders.php">Pedidos</a>
      <a href="products.php">Productos</a>
      <a href="../index.php">Ver tienda</a>
      <button class="btn-logout" id="btn-logout">Cerrar sesión</button>
    </aside>

    <main class="admin-content">
      <h1>Dashboard</h1>
      <p class="admin-sub">Resumen de actividad de la tienda</p>

      <div class="dash-metrics" id="dash-metrics">
        <div class="metric-card skeleton"></div>
        <div class="metric-card skeleton"></div>
        <div class="metric-card skeleton"></div>
        <div class="metric-card skeleton"></div>
      </div>

      <div class="dash-recent">
        <h2>Pedidos recientes</h2>
        <table class="data-table">
          <thead>
            <tr>
              <th>ID</th>
              <th>Fecha</th>
              <th>Cliente</th>
              <th>Total</th>
              <th>Estado</th>
            </tr>
          </thead>
          <tbody id="recent-tbody">
            <tr><td colspan="5" style="text-align:center;color:var(--a-dim);padding:24px">Cargando…</td></tr>
          </tbody>
        </table>
      </div>
    </main>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="../js/supabase-client.js"></script>
  <script src="../js/store.js"></script>
  <script src="../js/admin.js"></script>
</body>
</html>
