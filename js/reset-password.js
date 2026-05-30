document.addEventListener('DOMContentLoaded', async () => {
  const form     = document.getElementById('form-reset');
  const errorEl  = document.getElementById('reset-error');
  const statusEl = document.getElementById('reset-status');

  // Supabase detecta el token en el hash de la URL automáticamente al inicializar
  // y establece la sesión. Solo necesitamos verificar que haya sesión activa.
  const session = await getSession();

  if (!session) {
    errorEl.textContent = 'El enlace no es válido o ya expiró. Solicita uno nuevo.';
    form.style.display  = 'none';
    return;
  }

  form.addEventListener('submit', async (e) => {
    e.preventDefault();
    const btn      = form.querySelector('button[type="submit"]');
    const password = document.getElementById('new-password').value;
    const confirm  = document.getElementById('confirm-password').value;
    errorEl.textContent = ''; statusEl.textContent = '';

    if (password.length < 6) { errorEl.textContent = 'Mínimo 6 caracteres.'; return; }
    if (password !== confirm) { errorEl.textContent = 'Las contraseñas no coinciden.'; return; }

    btn.disabled = true; btn.textContent = 'Guardando…';
    const ok = await updatePassword(password);

    if (ok) {
      form.style.display = 'none';
      statusEl.style.color = '#276749';
      statusEl.textContent = '✅ Contraseña actualizada. Redirigiendo…';
      setTimeout(() => { window.location.href = 'profile.php'; }, 2000);
    } else {
      errorEl.textContent = 'Error al actualizar la contraseña. Intenta de nuevo.';
      btn.disabled = false; btn.textContent = 'Guardar nueva contraseña';
    }
  });
});
