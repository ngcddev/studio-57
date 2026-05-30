<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mi perfil – Studio 57</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/global.css">
  <link rel="stylesheet" href="css/catalog.css">
  <link rel="stylesheet" href="css/profile.css">
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
      <a href="cart.php" class="icon-btn" aria-label="Carrito">
        <svg width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24"><path d="M6 7h12l-1 13H7L6 7z"/><path d="M9 7a3 3 0 016 0"/></svg>
        <span class="cart-badge" id="cart-badge"></span>
      </a>
      <a href="profile.php" class="icon-btn" aria-label="Mi perfil">
        <svg width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24"><circle cx="12" cy="8" r="4"/><path d="M4 21c1.5-4 5-6 8-6s6.5 2 8 6"/></svg>
      </a>
    </div>
  </header>

  <main class="container">
    <div class="profile-page">
      <h1>Mi perfil</h1>
      <p class="profile-greeting" id="profile-email"></p>

      <!-- Información personal -->
      <div class="profile-section">
        <h2>Información personal</h2>
        <form id="profile-form">
          <div class="form-group">
            <label for="profile-name">Nombre completo</label>
            <input type="text" id="profile-name">
          </div>
          <div class="form-group">
            <label for="profile-phone">Teléfono</label>
            <input type="tel" id="profile-phone">
          </div>
          <div class="form-group">
            <label for="profile-address">Dirección de envío</label>
            <textarea id="profile-address"></textarea>
          </div>
          <button type="submit" class="btn-primary">Guardar cambios</button>
          <p class="profile-status" id="profile-status"></p>
        </form>
      </div>

      <!-- Cambiar contraseña -->
      <div class="profile-section">
        <h2>Cambiar contraseña</h2>
        <form id="form-change-password">
          <div class="form-group">
            <label for="new-pwd">Nueva contraseña</label>
            <input type="password" id="new-pwd" minlength="6" required>
          </div>
          <div class="form-group">
            <label for="confirm-pwd">Confirmar contraseña</label>
            <input type="password" id="confirm-pwd" required>
          </div>
          <button type="submit" class="btn-primary">Actualizar contraseña</button>
          <p class="profile-status" id="password-status"></p>
        </form>
      </div>

      <!-- Favoritos -->
      <div class="profile-section">
        <h2>Mis favoritos</h2>
        <div class="wishlist-grid" id="wishlist-grid">
          <p class="profile-empty">No tienes favoritos guardados.</p>
        </div>
      </div>

      <!-- Historial de pedidos -->
      <div class="profile-section">
        <h2>Mis pedidos</h2>
        <div id="orders-list">
          <p class="profile-empty">Aún no tienes pedidos.</p>
        </div>
      </div>

      <button id="btn-signout" class="btn-secondary">Cerrar sesión</button>
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
  <script src="js/profile.js"></script>
</body>
</html>
