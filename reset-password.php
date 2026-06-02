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
  <title>Nueva contraseña — Studio 57</title>
  <meta name="robots" content="noindex, nofollow">
  <link rel="canonical" href="<?= $base_url ?>/reset-password.php">
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
    <nav class="header-left"></nav>
    <a href="index.php" class="header-brand">Studio 57</a>
    <div class="header-right"></div>
  </header>

  <div class="auth-page">
    <div class="auth-box">
      <p class="auth-box-brand">Studio 57</p>
      <p class="auth-box-tag">Nueva contraseña</p>
      <p class="auth-error" id="reset-error"></p>
      <p class="auth-success" id="reset-status"></p>

      <form id="form-reset">
        <div class="form-group">
          <label for="new-password">Nueva contraseña</label>
          <input type="password" id="new-password" required minlength="6" autocomplete="new-password">
        </div>
        <div class="form-group">
          <label for="confirm-password">Confirmar contraseña</label>
          <input type="password" id="confirm-password" required autocomplete="new-password">
        </div>
        <button type="submit" class="btn-primary" style="width:100%;margin-top:8px">
          Guardar nueva contraseña
        </button>
      </form>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="js/supabase-client.js"></script>
  <script src="js/store.js"></script>
  <script src="js/reset-password.js"></script>
</body>
</html>
