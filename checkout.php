<?php
$protocol = (!empty($_SERVER['HTTPS']) && $_SERVER['HTTPS'] !== 'off') ? 'https' : 'http';
$base_url = $protocol . '://' . $_SERVER['HTTP_HOST'];
?>
<!DOCTYPE html>
<html lang="es">
<head>
  <meta charset="UTF-8">
  <meta name="viewport" content="width=device-width, initial-scale=1.0">
  <title>Finalizar compra — Studio 57</title>
  <meta name="robots" content="noindex, nofollow">
  <link rel="canonical" href="<?= $base_url ?>/checkout.php">
  <link rel="icon" type="image/x-icon" href="assets/favicon.ico">
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
      <a href="cart.php" class="icon-btn" aria-label="Carrito">
        <svg width="19" height="19" fill="none" stroke="currentColor" stroke-width="1.6" viewBox="0 0 24 24"><path d="M6 7h12l-1 13H7L6 7z"/><path d="M9 7a3 3 0 016 0"/></svg>
        <span class="cart-badge" id="cart-badge"></span>
      </a>
    </div>
  </header>

  <main class="container checkout-section">
    <div class="page-header">
      <h1>Finalizar compra</h1>
    </div>

    <div class="checkout-steps">
      <div class="step active" id="indicator-1">
        <span class="step-num">1</span> Envío
      </div>
      <div class="step-sep">›</div>
      <div class="step" id="indicator-2">
        <span class="step-num">2</span> Pago
      </div>
      <div class="step-sep">›</div>
      <div class="step" id="indicator-3">
        <span class="step-num">3</span> Confirmación
      </div>
    </div>

    <!-- Paso 1: Envío -->
    <div id="step-shipping">
      <div class="checkout-layout">
        <div class="form-box">
          <h2>Datos de envío</h2>
          <p id="prefill-hint" class="prefill-hint" style="display:none">
            ✓ Datos cargados desde tu perfil. Puedes modificarlos.
          </p>
          <div id="shipping-errors" class="form-errors"></div>
          <form id="form-shipping">
            <div class="form-group">
              <label for="customer-name">Nombre completo</label>
              <input type="text" id="customer-name" required>
            </div>
            <div class="form-group">
              <label for="customer-email">Correo electrónico</label>
              <input type="email" id="customer-email" required>
            </div>
            <div class="form-group">
              <label for="customer-address">Dirección de envío</label>
              <textarea id="customer-address" required></textarea>
            </div>
            <label class="checkbox-label">
              <input type="checkbox" id="save-address"> Guardar esta dirección en mi perfil
            </label>
            <button type="submit" class="btn-primary" style="width:100%;margin-top:8px">
              Continuar al pago →
            </button>
          </form>
        </div>
        <div class="co-summary">
          <h2>Tu pedido</h2>
          <div id="order-summary-items"></div>
          <div class="summary-total-row">
            <span>Total</span>
            <strong id="order-summary-total"></strong>
          </div>
        </div>
      </div>
    </div>

    <!-- Paso 2: Pago -->
    <div id="step-payment" style="display:none">
      <div class="checkout-layout">
        <div class="form-box">
          <h2>Datos de pago</h2>
          <p class="test-card-hint">Tarjeta de prueba: <code>4242 4242 4242 4242</code> · 12/29 · 123</p>
          <div id="payment-errors" class="form-errors"></div>
          <form id="form-payment">
            <div class="form-group">
              <label for="card-name">Nombre en la tarjeta</label>
              <input type="text" id="card-name" placeholder="JUAN PÉREZ" required>
            </div>
            <div class="form-group">
              <label for="card-number">Número de tarjeta</label>
              <input type="text" id="card-number" placeholder="1234 5678 9012 3456" maxlength="19" required>
            </div>
            <div class="card-row">
              <div class="form-group">
                <label for="card-expiry">Vencimiento</label>
                <input type="text" id="card-expiry" placeholder="MM/AA" maxlength="5" required>
              </div>
              <div class="form-group">
                <label for="card-cvv">CVV</label>
                <input type="text" id="card-cvv" placeholder="123" maxlength="4" required>
              </div>
            </div>
            <button type="submit" class="btn-primary" style="width:100%">
              Pagar <span id="pay-total"></span>
            </button>
            <button type="button" id="btn-back-shipping" class="btn-secondary" style="width:100%;margin-top:10px">
              ← Volver
            </button>
          </form>
        </div>
        <div class="co-summary">
          <h2>Tu pedido</h2>
          <div id="order-summary-items-2"></div>
          <div class="summary-total-row">
            <span>Total</span>
            <strong id="order-summary-total-2"></strong>
          </div>
        </div>
      </div>
    </div>

    <!-- Paso 3: Confirmación -->
    <div id="step-confirm" style="display:none">
      <div class="confirmation-box">
        <h2>¡Pago confirmado!</h2>
        <p>Gracias, <strong id="confirm-name"></strong>.</p>
        <p>Confirmación enviada a <strong id="confirm-email"></strong></p>
        <p class="order-id">Pedido: <b id="confirm-order-id"></b></p>
        <ul class="confirmed-items" id="confirm-items"></ul>
        <p><strong>Total: <span id="confirm-total"></span></strong></p>
        <div class="confirmation-actions">
          <a href="catalog.php" class="btn-primary">Seguir comprando</a>
          <a href="profile.php" class="btn-secondary">Ver mis pedidos</a>
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
  <script src="js/checkout.js"></script>
</body>
</html>
