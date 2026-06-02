<?php
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$base_url = $protocol . '://' . $_SERVER['HTTP_HOST'];
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
    <meta name="google-site-verification" content="Uki3-zqQG_Qh86pj_dZ_4OLN7j06DCONZnkcgio12OU" />
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Mi cuenta — Studio 57</title>
  <meta name="robots" content="noindex, nofollow">
  <link rel="canonical" href="<?= $base_url ?>/auth.php">
  <link rel="icon" type="image/x-icon" href="assets/favicon.ico">
  <link rel="preload" href="css/fonts/horizon.woff2" as="font" type="font/woff2" crossorigin>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="css/global.css">
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
    </div>
  </header>

  <div class="auth-page">
    <div class="auth-box">
      <p class="auth-box-brand">Studio 57</p>
      <p class="auth-box-tag">Tu cuenta</p>

      <div class="auth-tabs">
        <button class="auth-tab active" id="tab-login">Iniciar sesión</button>
        <button class="auth-tab" id="tab-register">Crear cuenta</button>
      </div>

      <!-- Login -->
      <form id="form-login">
        <div class="form-group">
          <label for="login-email">Correo</label>
          <input type="email" id="login-email" required autocomplete="email">
        </div>
        <div class="form-group">
          <label for="login-password">Contraseña</label>
          <input type="password" id="login-password" required autocomplete="current-password">
        </div>
        <button type="submit" class="btn-primary" style="width:100%;margin-top:8px">Iniciar sesión</button>
        <p class="auth-error" id="login-error"></p>
        <p class="auth-foot">
          <button type="button" class="auth-link" id="link-forgot">¿Olvidaste tu contraseña?</button>
        </p>
      </form>

      <!-- Registro -->
      <form id="form-register" style="display:none">
        <div class="form-group">
          <label for="register-name">Nombre completo</label>
          <input type="text" id="register-name" required autocomplete="name">
        </div>
        <div class="form-group">
          <label for="register-email">Correo</label>
          <input type="email" id="register-email" required autocomplete="email">
        </div>
        <div class="form-group">
          <label for="register-password">Contraseña</label>
          <input type="password" id="register-password" required minlength="6" autocomplete="new-password">
        </div>
        <div class="form-group">
          <label for="register-confirm">Confirmar contraseña</label>
          <input type="password" id="register-confirm" required autocomplete="new-password">
        </div>
        <button type="submit" class="btn-primary" style="width:100%;margin-top:8px">Crear cuenta</button>
        <p class="auth-error" id="register-error"></p>
      </form>

      <!-- Recuperar contraseña -->
      <div id="section-forgot" style="display:none">
        <p style="font-size:.9rem;margin-bottom:1rem;color:var(--ink-2)">
          Ingresa tu correo y te enviaremos un enlace para restablecer tu contraseña.
        </p>
        <form id="form-forgot">
          <div class="form-group">
            <label for="forgot-email">Correo</label>
            <input type="email" id="forgot-email" required>
          </div>
          <button type="submit" class="btn-primary" style="width:100%;margin-top:8px">Enviar enlace</button>
          <p class="auth-error" id="forgot-status" style="margin-top:.5rem"></p>
        </form>
        <p class="auth-foot">
          <button type="button" class="auth-link" id="link-back-login">← Volver al login</button>
        </p>
      </div>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="js/supabase-client.js"></script>
  <script src="js/store.js"></script>
  <script src="js/header.js"></script>
  <script src="js/auth-page.js"></script>
</body>
</html>
