<?php
$protocol  = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$base_url  = $protocol . '://' . $_SERVER['HTTP_HOST'];
$canonical = $base_url . '/index.php';
$og_image  = $base_url . '/assets/og-cover.jpg'; // reemplaza con tu imagen 1200×630
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Studio 57 — Ropa hombre y mujer hecha en Colombia | Popayán</title>
  <meta name="description" content="Tienda de ropa Studio 57 en Popayán. Prendas de carácter para hombre y mujer: camisetas, denim, punto y sastre. Series cortas, tejidas en Colombia.">
  <meta name="robots" content="index, follow">
  <link rel="canonical" href="<?= $canonical ?>">
  <link rel="icon" type="image/x-icon" href="assets/favicon.ico">

  <!-- Open Graph -->
  <meta property="og:type"         content="website">
  <meta property="og:site_name"    content="Studio 57">
  <meta property="og:url"          content="<?= $canonical ?>">
  <meta property="og:title"        content="Studio 57 — Ropa hombre y mujer hecha en Colombia">
  <meta property="og:description"  content="Prendas de carácter para hombre y mujer. Series cortas, tejidas en Colombia, pensadas para durar.">
  <meta property="og:image"        content="<?= $og_image ?>">
  <meta property="og:image:width"  content="1200">
  <meta property="og:image:height" content="630">
  <!-- Twitter Card -->
  <meta name="twitter:card"        content="summary_large_image">
  <meta name="twitter:title"       content="Studio 57 — Ropa hecha en Colombia">
  <meta name="twitter:description" content="Prendas de carácter para hombre y mujer. Series cortas, tejidas en Colombia, pensadas para durar.">
  <meta name="twitter:image"       content="<?= $og_image ?>">

  <!-- Schema: WebSite + Organization -->
  <script type="application/ld+json">
  {
    "@context": "https://schema.org",
    "@graph": [
      {
        "@type": "WebSite",
        "name": "Studio 57",
        "url": "<?= $base_url ?>",
        "potentialAction": {
          "@type": "SearchAction",
          "target": "<?= $base_url ?>/catalog.php?search={search_term_string}",
          "query-input": "required name=search_term_string"
        }
      },
      {
        "@type": "Organization",
        "name": "Studio 57",
        "url": "<?= $base_url ?>",
        "logo": "<?= $og_image ?>",
        "address": {
          "@type": "PostalAddress",
          "addressLocality": "Popayán",
          "addressRegion": "Cauca",
          "addressCountry": "CO"
        }
      }
    ]
  }
  </script>

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

  <!-- Hero -->
  <section class="hero">
    <div class="container">
      <h1 class="hero-type" id="hero-type">
        <span class="hero-line">Conectamos</span>
        <span class="hero-line">dos mundos,</span>
        <span class="hero-line">una <em class="clay">moda</em>.</span>
      </h1>
      <div class="hero-sub">
        <p>Prendas de carácter para hombre y mujer. Series cortas, tejidas en Colombia, pensadas para durar.</p>
        <a href="catalog.php" class="hero-cta">
          Ver colección
          <svg width="16" height="16" fill="none" stroke="currentColor" stroke-width="1.7" viewBox="0 0 24 24"><path d="M5 12h14M13 6l6 6-6 6"/></svg>
        </a>
      </div>
      <div class="hero-strip rv" id="hero-strip">
        <span class="hero-strip-label">Lookbook SS 2026</span>
      </div>
    </div>
  </section>

  <!-- Novedades -->
  <section class="sec">
    <div class="container">
      <div class="sec-hd rv">
        <h2>Recién llegado</h2>
        <a href="catalog.php" class="sec-all">[ ver todo → ]</a>
      </div>
      <div class="products-grid rv" id="home-new-grid"></div>
    </div>
  </section>

  <!-- Editorial split -->
  <div class="container">
    <div class="hero-split rv">
      <div class="hero-split-img"></div>
      <div class="hero-split-body">
        <h3>Dos mundos,<br>una misma calle.</h3>
        <p>Studio 57 nace del cruce entre lo clásico y lo urbano. Cada prenda equilibra sastrería y comodidad, lo de siempre y lo que viene.</p>
        <a href="catalog.php" class="btn-secondary">Explorar la colección</a>
      </div>
    </div>
  </div>

  <!-- Géneros -->
  <div class="container">
    <div class="hero-genders rv">
      <a href="catalog.php?gender=hombre" class="hero-gender-item">
        <div class="hero-gender-img" style="background:linear-gradient(160deg,#c4b89a,#8a7e6a)"></div>
        <div class="hero-gender-label">
          <span>Hombre</span>
          <span>Camisetas, denim y abrigo</span>
        </div>
      </a>
      <a href="catalog.php?gender=mujer" class="hero-gender-item">
        <div class="hero-gender-img" style="background:linear-gradient(160deg,#d4c4b4,#a8907a)"></div>
        <div class="hero-gender-label">
          <span>Mujer</span>
          <span>Punto, sastre y vestidos</span>
        </div>
      </a>
    </div>
  </div>

  <!-- Manifiesto -->
  <section class="sec">
    <div class="container">
      <div class="rv" style="text-align:center;padding:20px 0">
        <p style="font-size:clamp(22px,3.4vw,40px);font-weight:600;letter-spacing:-0.02em;line-height:1.12;max-width:22ch;margin:0 auto;color:var(--ink)">
          Menos prendas, mejor hechas. Eso es Studio 57.
        </p>
      </div>
    </div>
  </section>

  <footer>
    <div class="container">
      <span class="footer-brand">Studio 57</span>
      <nav class="footer-nav" aria-label="Navegación del pie">
        <a href="catalog.php">Catálogo</a>
        <a href="catalog.php?gender=hombre">Hombre</a>
        <a href="catalog.php?gender=mujer">Mujer</a>
        <a href="cart.php">Carrito</a>
        <a href="auth.php">Mi cuenta</a>
      </nav>
      <span>© 2026 Studio 57 — Popayán, Colombia</span>
    </div>
  </footer>

  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="js/supabase-client.js"></script>
  <script src="js/store.js"></script>
  <script src="js/header.js"></script>
  <script src="js/home.js"></script>
</body>
</html>
