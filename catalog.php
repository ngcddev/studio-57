<?php
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$base_url = $protocol . '://' . $_SERVER['HTTP_HOST'];
$gender   = in_array($_GET['gender'] ?? '', ['hombre', 'mujer']) ? $_GET['gender'] : '';

$titles = [
  'hombre' => 'Ropa Hombre — Studio 57 | Camisetas, Denim y Abrigo Colombia',
  'mujer'  => 'Ropa Mujer — Studio 57 | Punto, Sastre y Vestidos Colombia',
  ''       => 'Catálogo — Studio 57 | Ropa hombre y mujer hecha en Colombia',
];
$descs = [
  'hombre' => 'Explora la colección de ropa para hombre de Studio 57. Camisetas, denim, abrigo y más, hechos en Colombia. Series cortas, prendas de carácter.',
  'mujer'  => 'Descubre la colección de ropa para mujer de Studio 57. Punto, sastre, vestidos y más, tejidos en Colombia. Series cortas, prendas de carácter.',
  ''       => 'Explora el catálogo completo de Studio 57. Ropa de autor para hombre y mujer hecha en Colombia. Denim, punto, camisetas y sastre de serie corta.',
];
$page_title = $titles[$gender];
$page_desc  = $descs[$gender];
$canonical  = $base_url . '/catalog.php' . ($gender ? '?gender=' . $gender : '');
$og_image   = $base_url . '/assets/og-cover.jpg';
?>
<!DOCTYPE html>
<html lang="es">
<head>
    <meta name="google-site-verification" content="Uki3-zqQG_Qh86pj_dZ_4OLN7j06DCONZnkcgio12OU" />
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title><?= htmlspecialchars($page_title) ?></title>
  <meta name="description" content="<?= htmlspecialchars($page_desc) ?>">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="<?= htmlspecialchars($canonical) ?>">
  <link rel="icon" type="image/x-icon" href="assets/favicon.ico">

  <!-- Open Graph -->
  <meta property="og:type"         content="website">
  <meta property="og:site_name"    content="Studio 57">
  <meta property="og:url"          content="<?= htmlspecialchars($canonical) ?>">
  <meta property="og:title"        content="<?= htmlspecialchars($page_title) ?>">
  <meta property="og:description"  content="<?= htmlspecialchars($page_desc) ?>">
  <meta property="og:image"        content="<?= $og_image ?>">
  <!-- Twitter Card -->
  <meta name="twitter:card"        content="summary_large_image">
  <meta name="twitter:title"       content="<?= htmlspecialchars($page_title) ?>">
  <meta name="twitter:image"       content="<?= $og_image ?>">

  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/global.css">
  <link rel="stylesheet" href="css/catalog.css">
</head>
<body>

  <header class="site-header">
    <meta name="google-site-verification" content="Uki3-zqQG_Qh86pj_dZ_4OLN7j06DCONZnkcgio12OU" />
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

  <main class="container catalog-section">
    <nav class="breadcrumb" aria-label="Ruta de navegación">
      <a href="index.php">Inicio</a> ›
      <a href="catalog.php">Catálogo</a><?php if ($gender): ?> ›
      <span><?= $gender === 'hombre' ? 'Hombre' : 'Mujer' ?></span><?php endif; ?>
    </nav>
    <div class="catalog-header">
      <h1 id="catalog-title"><?= $gender ? ($gender === 'hombre' ? 'Hombre' : 'Mujer') : 'Todo' ?></h1>
    </div>
    <div class="catalog-controls">
      <span id="catalog-count" class="catalog-count"></span>
      <div class="catalog-selects">
        <select id="category-filter"></select>
        <select id="sort-filter">
          <option value="newest">Más nuevos</option>
          <option value="price-asc">Precio: menor a mayor</option>
          <option value="price-desc">Precio: mayor a menor</option>
        </select>
      </div>
    </div>
    <div class="products-grid" id="products-grid"></div>
    <div class="pagination" id="pagination"></div>
  </main>

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
        <a href="admin/login.php" class="footer-admin">Panel Admin</a>
        <span class="footer-tagline">Conectamos dos mundos, una moda</span>
      </div>
    </div>
  </footer>

  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="js/supabase-client.js"></script>
  <script src="js/store.js"></script>
  <script src="js/header.js"></script>
  <script src="js/catalog.js"></script>
</body>
</html>
