<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Carrito – Studio 57</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/global.css">
  <link rel="stylesheet" href="css/cart.css">
</head>
<body>

  <header class="site-header">
    <nav class="header-left">
      <a href="catalog.php"               class="nav-cat" data-gender="">Todo</a>
      <a href="catalog.php?gender=hombre" class="nav-cat" data-gender="hombre">Hombre</a>
      <a href="catalog.php?gender=mujer"  class="nav-cat" data-gender="mujer">Mujer</a>
    </nav>
    <a href="index.php" class="header-brand">Studio 57</a>
    <div class="header-right">
      <button class="icon-btn" id="btn-search" aria-label="Buscar">
        <svg width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
      </button>
      <a href="cart.php" class="icon-btn" aria-label="Carrito">
        <svg width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24"><path d="M6 7h12l-1 13H7L6 7z"/><path d="M9 7a3 3 0 016 0"/></svg>
        <span class="cart-badge" id="cart-badge"></span>
      </a>
      <a href="auth.php" class="icon-btn" id="user-icon-link" aria-label="Mi cuenta">
        <svg width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6"/></svg>
      </a>
    </div>
  </header>

  <div class="search-bar" id="search-bar" style="display:none;">
    <div class="container">
      <svg width="22" height="22" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24" style="color:var(--ink-3);flex-shrink:0"><circle cx="11" cy="11" r="7"/><path d="M21 21l-4.3-4.3"/></svg>
      <input type="text" id="search-input-header" placeholder="Buscar prendas, categorías…">
      <button id="btn-search-close">×</button>
    </div>
  </div>

  <main class="container cart-section">
    <div class="page-header">
      <p class="breadcrumb"><a href="index.php">Inicio</a> › Carrito</p>
      <h1 class="cart-page-title">Mi carrito</h1>
    </div>
    <div class="cart-layout">
      <div>
        <div id="cart-items"></div>
      </div>
      <div id="cart-summary" style="display:none;">
        <div class="cart-summary-box">
          <h3>Resumen</h3>
          <div class="summary-total">
            <span>Total</span>
            <span class="summary-total-value" id="cart-total"></span>
          </div>
          <a href="checkout.php" class="btn-primary">Ir a pagar →</a>
          <a href="catalog.php"  class="btn-secondary">Seguir comprando</a>
          <p class="cart-note">Envío calculado en el checkout</p>
        </div>
      </div>
    </div>
  </main>

  <footer>
    <div class="container">
      <span class="footer-brand">Studio 57</span>
      <span>© 2026 Studio 57 — Popayán, Colombia</span>
    </div>
  </footer>

  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="js/supabase-client.js"></script>
  <script src="js/store.js"></script>
  <script src="js/header.js"></script>
  <script src="js/cart.js"></script>
</body>
</html>
