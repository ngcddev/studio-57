<?php
$protocol   = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$base_url   = $protocol . '://' . $_SERVER['HTTP_HOST'];
$product_id = preg_replace('/[^a-zA-Z0-9\-]/', '', $_GET['id'] ?? '');
$canonical  = $base_url . '/product.php' . ($product_id ? '?id=' . $product_id : '');
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
    <meta name="google-site-verification" content="Uki3-zqQG_Qh86pj_dZ_4OLN7j06DCONZnkcgio12OU" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <!-- JS actualiza title, description y OG una vez que carga el producto desde Supabase -->
  <title>Producto — Studio 57</title>
  <meta name="description" id="meta-description" content="Ropa de autor Studio 57 hecha en Colombia. Prendas de carácter, series cortas, tejidas en Popayán.">
  <meta name="robots" content="index, follow">
  <link rel="canonical" id="canonical-url" href="<?= $canonical ?>">
  <link rel="icon" type="image/x-icon" href="assets/favicon.ico">

  <!-- Open Graph (valores actualizados por JS) -->
  <meta property="og:type"         content="product">
  <meta property="og:site_name"    content="Studio 57">
  <meta property="og:url"          id="og-url"         content="<?= $canonical ?>">
  <meta property="og:title"        id="og-title"        content="Producto — Studio 57">
  <meta property="og:description"  id="og-description"  content="Ropa de autor Studio 57 hecha en Colombia.">
  <meta property="og:image"        id="og-image"        content="">
  <!-- Twitter Card -->
  <meta name="twitter:card"        content="summary_large_image">
  <meta name="twitter:title"       id="twitter-title"   content="Producto — Studio 57">
  <meta name="twitter:image"       id="twitter-image"   content="">

  <link rel="preload" href="css/fonts/horizon.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/global.css">
  <link rel="stylesheet" href="css/catalog.css">
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

  <main class="container">
    <nav class="breadcrumb" id="product-breadcrumb" aria-label="Ruta de navegación"></nav>
    <div id="product-detail" class="product-detail"></div>
  </main>

  <section class="container related-section" id="related-section" style="display:none">
    <h2 class="related-title">También te puede gustar</h2>
    <div class="products-grid" id="related-grid"></div>
  </section>

  <footer>
    <div class="footer-main">
      <div class="container footer-main-inner">
        <div class="footer-brand-col">
          <div class="footer-brand">
            <span class="footer-brand-studio">Studio</span>
            <span class="footer-brand-57">57</span>
          </div>
        </div>
        <nav class="footer-col">
          <span class="footer-col-title">Tienda</span>
          <a href="catalog.php">Todo</a>
          <a href="catalog.php?gender=hombre">Hombre</a>
          <a href="catalog.php?gender=mujer">Mujer</a>
          <a href="catalog.php?sort=newest">Novedades</a>
        </nav>
        <nav class="footer-col">
          <span class="footer-col-title">Casa</span>
          <a href="#">Sobre Studio 57</a>
          <a href="#">Envíos y cambios</a>
          <a href="#">Guía de tallas</a>
          <a href="#">Contacto</a>
        </nav>
      </div>
    </div>
    <div class="footer-bottom">
      <div class="container footer-bottom-inner">
        <span>© 2026 Studio 57 · Bogotá, Colombia</span>
        <span class="footer-tagline">Conectamos dos mundos, una moda</span>
      </div>
    </div>
  </footer>

  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="js/supabase-client.js"></script>
  <script src="js/store.js"></script>
  <script src="js/header.js"></script>
  <script src="js/product.js"></script>
</body>
</html>
