// Inicializar header en todas las páginas públicas
document.addEventListener('DOMContentLoaded', async () => {
  // Badge del carrito
  const badge = document.getElementById('cart-badge');
  if (badge) {
    const count = getCartCount();
    badge.textContent = count > 0 ? count : '';
  }

  // Marcar categoría activa en la nav
  const gender = getQueryParam('gender') || '';
  document.querySelectorAll('.nav-cat').forEach(link => {
    const lg = link.dataset.gender;
    link.classList.toggle('active', lg === gender);
  });

  // Ícono de usuario: perfil si hay sesión, auth.php si no
  const userLink = document.getElementById('user-icon-link');
  if (userLink) {
    const user = await getCurrentUser();
    if (user) {
      // Determinar path relativo según carpeta actual
      const isAdmin = window.location.pathname.includes('/admin/');
      userLink.href = isAdmin ? '../profile.php' : 'profile.php';
    }
    // Si no hay sesión, href ya apunta a auth.php (default en el HTML)
  }

  // Toggle de búsqueda
  const btnSearch = document.getElementById('btn-search');
  const searchBar = document.getElementById('search-bar');
  const searchInput = document.getElementById('search-input-header');
  const btnClose = document.getElementById('btn-search-close');

  if (btnSearch && searchBar) {
    btnSearch.addEventListener('click', () => {
      const isOpen = searchBar.style.display !== 'none';
      searchBar.style.display = isOpen ? 'none' : 'block';
      if (!isOpen && searchInput) searchInput.focus();
    });
  }

  if (btnClose && searchBar) {
    btnClose.addEventListener('click', () => {
      searchBar.style.display = 'none';
    });
  }

  if (searchInput) {
    searchInput.addEventListener('keydown', (e) => {
      if (e.key === 'Enter' && searchInput.value.trim()) {
        const isAdmin = window.location.pathname.includes('/admin/');
        const base = isAdmin ? '../catalog.php' : 'catalog.php';
        window.location.href = `${base}?search=${encodeURIComponent(searchInput.value.trim())}`;
      }
    });
  }
});
