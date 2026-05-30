<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Admin – Iniciar sesión</title>
  <link rel="preconnect" href="https://fonts.googleapis.com">
  <link rel="preconnect" href="https://fonts.gstatic.com" crossorigin>
  <link href="https://fonts.googleapis.com/css2?family=Poppins:wght@300;400;500;600;700&display=swap" rel="stylesheet">
  <link rel="stylesheet" href="../css/global.css">
  <link rel="stylesheet" href="../css/admin.css">
</head>
<body data-page="admin-login">

  <div class="login-page">
    <div class="login-box">
      <h1>Studio 57</h1>
      <p class="login-sub">Panel de administración</p>
      <form id="login-form">
        <div class="form-group">
          <label for="admin-email">Correo</label>
          <input type="email" id="admin-email" required autocomplete="email">
        </div>
        <div class="form-group">
          <label for="admin-password">Contraseña</label>
          <input type="password" id="admin-password" required autocomplete="current-password">
        </div>
        <button type="submit" class="btn-primary" style="width:100%;margin-top:8px">Ingresar</button>
        <p class="login-error" id="login-error"></p>
      </form>
      <p style="text-align:center;margin-top:1.25rem;font-size:.85rem;">
        <a href="../index.php">← Volver a la tienda</a>
      </p>
    </div>
  </div>

  <script src="https://cdn.jsdelivr.net/npm/@supabase/supabase-js@2"></script>
  <script src="../js/supabase-client.js"></script>
  <script src="../js/store.js"></script>
  <script src="../js/admin.js"></script>
</body>
</html>
