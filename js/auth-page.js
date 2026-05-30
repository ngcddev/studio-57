document.addEventListener('DOMContentLoaded', async () => {
  // Si ya hay sesión activa, redirigir a perfil
  const user = await getCurrentUser();
  if (user) { window.location.href = getQueryParam('redirect') || 'profile.php'; return; }

  const tabLogin     = document.getElementById('tab-login');
  const tabRegister  = document.getElementById('tab-register');
  const formLogin    = document.getElementById('form-login');
  const formRegister = document.getElementById('form-register');
  const sectionForgot = document.getElementById('section-forgot');

  function showTab(tab) {
    tabLogin.classList.toggle('active', tab === 'login');
    tabRegister.classList.toggle('active', tab === 'register');
    formLogin.style.display     = tab === 'login'    ? 'block' : 'none';
    formRegister.style.display  = tab === 'register' ? 'block' : 'none';
    sectionForgot.style.display = tab === 'forgot'   ? 'block' : 'none';
  }

  tabLogin.addEventListener('click', () => showTab('login'));
  tabRegister.addEventListener('click', () => showTab('register'));
  document.getElementById('link-forgot')?.addEventListener('click', (e) => {
    e.preventDefault();
    showTab('forgot');
  });
  document.getElementById('link-back-login')?.addEventListener('click', (e) => {
    e.preventDefault();
    showTab('login');
  });

  if (getQueryParam('tab') === 'register') showTab('register');
  else showTab('login');

  // ── Iniciar sesión ────────────────────────────────────────────────────────
  formLogin.addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorEl = document.getElementById('login-error');
    const btn     = formLogin.querySelector('button[type="submit"]');
    errorEl.textContent = ''; btn.disabled = true; btn.textContent = 'Ingresando…';

    const { error } = await signIn(
      document.getElementById('login-email').value,
      document.getElementById('login-password').value
    );

    if (error) {
      errorEl.textContent = 'Credenciales incorrectas.';
      btn.disabled = false; btn.textContent = 'Iniciar sesión';
    } else {
      const redirect = getQueryParam('redirect') || 'profile.php';
      window.location.href = redirect;
    }
  });

  // ── Crear cuenta ──────────────────────────────────────────────────────────
  formRegister.addEventListener('submit', async (e) => {
    e.preventDefault();
    const errorEl  = document.getElementById('register-error');
    const btn      = formRegister.querySelector('button[type="submit"]');
    errorEl.textContent = '';

    const fullName = document.getElementById('register-name').value.trim();
    const email    = document.getElementById('register-email').value.trim();
    const password = document.getElementById('register-password').value;
    const confirm  = document.getElementById('register-confirm').value;

    if (!fullName)          { errorEl.textContent = 'El nombre es obligatorio.'; return; }
    if (password.length < 6){ errorEl.textContent = 'Mínimo 6 caracteres.'; return; }
    if (password !== confirm){ errorEl.textContent = 'Las contraseñas no coinciden.'; return; }

    btn.disabled = true; btn.textContent = 'Creando cuenta…';
    const { error } = await signUp(email, password, fullName);

    if (error) {
      errorEl.textContent = error.message.includes('already registered')
        ? 'Este email ya está registrado.'
        : 'Error al crear la cuenta.';
      btn.disabled = false; btn.textContent = 'Crear cuenta';
    } else {
      formRegister.innerHTML = `<div class="auth-success">
        <p>✅ Cuenta creada. Revisa tu correo para confirmarla y luego
        <a href="auth.php">inicia sesión</a>.</p>
      </div>`;
    }
  });

  // ── Recuperar contraseña ──────────────────────────────────────────────────
  document.getElementById('form-forgot')?.addEventListener('submit', async (e) => {
    e.preventDefault();
    const email   = document.getElementById('forgot-email').value.trim();
    const btn     = e.target.querySelector('button[type="submit"]');
    const statusEl = document.getElementById('forgot-status');
    btn.disabled = true; btn.textContent = 'Enviando…'; statusEl.textContent = '';

    const ok = await sendPasswordReset(email);

    if (ok) {
      statusEl.style.color = '#276749';
      statusEl.textContent = '✓ Revisa tu correo para el enlace de recuperación.';
    } else {
      statusEl.style.color = '#e53e3e';
      statusEl.textContent = 'No se pudo enviar el correo. Verifica el email.';
      btn.disabled = false; btn.textContent = 'Enviar enlace';
    }
  });
});
