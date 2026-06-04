// ─── Utilidades ──────────────────────────────────────────────────────────────
function getQueryParam(name) {
  return new URLSearchParams(window.location.search).get(name);
}

function formatPrice(amount) {
  return new Intl.NumberFormat('es-CO', { style: 'currency', currency: 'COP', minimumFractionDigits: 0 }).format(amount);
}

// ─── Auth de usuario ──────────────────────────────────────────────────────────
async function signUp(email, password, fullName) {
  return sb.auth.signUp({ email, password, options: { data: { full_name: fullName } } });
}
async function signIn(email, password) {
  return sb.auth.signInWithPassword({ email, password });
}
async function signOut() { await sb.auth.signOut(); }
async function getCurrentUser() {
  const { data } = await sb.auth.getUser();
  return data.user || null;
}
async function getSession() {
  const { data } = await sb.auth.getSession();
  return data.session || null;
}

// ─── Perfil ───────────────────────────────────────────────────────────────────
async function getProfile() {
  const user = await getCurrentUser();
  if (!user) return null;
  const { data } = await sb.from('profiles').select('*').eq('id', user.id).single();
  return data;
}
async function updateProfile(fields) {
  const user = await getCurrentUser();
  if (!user) return false;
  const { error } = await sb.from('profiles').upsert({ id: user.id, ...fields, updated_at: new Date().toISOString() });
  return !error;
}

// ─── Auth Admin ───────────────────────────────────────────────────────────────
const ADMIN_EMAIL = 'admin@tienda.com';
async function adminLogin(email, password) {
  const { error } = await sb.auth.signInWithPassword({ email, password });
  return !error;
}
async function adminLogout() { await sb.auth.signOut(); }
async function getAdminSession() {
  const session = await getSession();
  if (!session) return null;
  const user = await getCurrentUser();
  return user?.email === ADMIN_EMAIL ? session : null;
}

// ─── Productos ────────────────────────────────────────────────────────────────
async function getProducts(filters = {}) {
  let query = sb.from('products').select('*');
  if (filters.gender && filters.gender !== '')
    query = query.in('gender', [filters.gender, 'unisex']);
  if (filters.search)
    query = query.ilike('name', `%${filters.search}%`);
  const sort = filters.sort || 'newest';
  if (sort === 'price-asc')        query = query.order('price', { ascending: true });
  else if (sort === 'price-desc')  query = query.order('price', { ascending: false });
  else                             query = query.order('created_at', { ascending: false });
  const { data, error } = await query;
  if (error) { console.error(error); return []; }
  return data;
}
async function getProductById(id) {
  const { data, error } = await sb.from('products').select('*').eq('id', id).single();
  if (error) return null;
  return data;
}
async function getCategories() {
  const { data } = await sb.from('products').select('category');
  return [...new Set((data || []).map(p => p.category))].sort();
}
async function addProduct(product) {
  const { data, error } = await sb.from('products').insert(product).select().single();
  if (error) { console.error(error); return null; }
  return data;
}
async function updateProduct(product) {
  const { id, ...fields } = product;
  const { error } = await sb.from('products').update(fields).eq('id', id);
  if (error) console.error(error);
}
async function deleteProduct(id) {
  const { error } = await sb.from('products').delete().eq('id', id);
  if (error) console.error(error);
}
async function toggleIsNew(id, value) {
  const { error } = await sb.from('products').update({ is_new: value }).eq('id', id);
  if (error) { console.error(error); return false; }
  return true;
}
async function getNewProducts() {
  const { data, error } = await sb.from('products').select('*').eq('is_new', true);
  if (error) { console.error(error); return []; }
  return data;
}
async function getRelatedProducts(productId, category, limit = 4) {
  const { data, error } = await sb
    .from('products').select('*')
    .eq('category', category)
    .neq('id', productId)
    .limit(limit);
  if (error) return [];
  return data;
}
async function uploadProductImage(file) {
  const ext  = file.name.split('.').pop().toLowerCase();
  const path = `${Date.now()}-${Math.random().toString(36).slice(2)}.${ext}`;
  const { error } = await sb.storage.from('products').upload(path, file, { cacheControl: '3600' });
  if (error) { console.error(error); return null; }
  const { data } = sb.storage.from('products').getPublicUrl(path);
  return data.publicUrl;
}

// ─── Variantes ────────────────────────────────────────────────────────────────
async function getVariants(productId) {
  const { data, error } = await sb
    .from('product_variants')
    .select('*')
    .eq('product_id', productId)
    .order('id');
  if (error) { console.error(error); return []; }
  return data;
}
async function upsertVariant(variant) {
  const { error } = await sb.from('product_variants').upsert(variant);
  if (error) console.error(error);
  return !error;
}
async function deleteVariant(id) {
  const { error } = await sb.from('product_variants').delete().eq('id', id);
  if (error) console.error(error);
}

// ─── Carrito (localStorage) ───────────────────────────────────────────────────
const CART_KEY = 'tp_cart';
function getCart() { return JSON.parse(localStorage.getItem(CART_KEY) || '[]'); }
function saveCart(cart) { localStorage.setItem(CART_KEY, JSON.stringify(cart)); }

function addToCart(product, variant) {
  const cart = getCart();
  // Clave única: producto + variante
  const key = variant ? `${product.id}-${variant.id}` : `${product.id}`;
  const existing = cart.find(i => i.key === key);
  if (existing) {
    existing.quantity += 1;
  } else {
    cart.push({
      key,
      productId: product.id,
      variantId: variant?.id || null,
      size:      variant?.size  || null,
      color:     variant?.color || null,
      name:      product.name,
      price:     product.price,
      image_url: product.image_url,
      quantity:  1,
    });
  }
  saveCart(cart);
}

function removeFromCart(key) {
  saveCart(getCart().filter(i => i.key !== key));
}
function updateQty(key, qty) {
  const q = parseInt(qty, 10);
  if (q <= 0) { removeFromCart(key); return; }
  saveCart(getCart().map(i => i.key === key ? { ...i, quantity: q } : i));
}
function clearCart() { localStorage.removeItem(CART_KEY); }
function getCartTotal() { return getCart().reduce((sum, i) => sum + i.price * i.quantity, 0); }
function getCartCount() { return getCart().reduce((sum, i) => sum + i.quantity, 0); }

// ─── Pedidos ──────────────────────────────────────────────────────────────────
async function saveOrder(order) {
  const user = await getCurrentUser();
  const { data: newOrder, error: orderErr } = await sb.from('orders').insert({
    customer_name:    order.customer.name,
    customer_email:   order.customer.email,
    customer_address: order.customer.address,
    total:            order.total,
    user_id:          user?.id || null,
    status:           'received',
  }).select().single();

  if (orderErr) { console.error(orderErr); return null; }

  const items = order.items.map(i => ({
    order_id:     newOrder.id,
    product_id:   i.productId,
    variant_id:   i.variantId || null,
    size:         i.size  || null,
    color:        i.color || null,
    product_name: i.name,
    price:        i.price,
    quantity:     i.quantity,
  }));

  const { error: itemsErr } = await sb.from('order_items').insert(items);
  if (itemsErr) console.error(itemsErr);
  return newOrder;
}

async function getOrders() {
  const { data, error } = await sb.from('orders')
    .select('*, order_items(*)')
    .order('created_at', { ascending: false });
  if (error) { console.error(error); return []; }
  return data;
}

async function getUserOrders() {
  const user = await getCurrentUser();
  if (!user) return [];
  const { data, error } = await sb.from('orders')
    .select('*, order_items(*)')
    .eq('user_id', user.id)
    .order('created_at', { ascending: false });
  if (error) { console.error(error); return []; }
  return data;
}

async function updateOrderStatus(orderId, status) {
  const { error } = await sb.from('orders').update({ status }).eq('id', orderId);
  if (error) console.error(error);
  return !error;
}

// ─── Wishlist ─────────────────────────────────────────────────────────────────
async function getWishlist() {
  const user = await getCurrentUser();
  if (!user) return [];
  const { data, error } = await sb
    .from('wishlists')
    .select('product_id, products(*)')
    .eq('user_id', user.id);
  if (error) { console.error(error); return []; }
  return data.map(w => w.products);
}

async function getWishlistIds() {
  const user = await getCurrentUser();
  if (!user) return new Set();
  const { data } = await sb.from('wishlists').select('product_id').eq('user_id', user.id);
  return new Set((data || []).map(w => w.product_id));
}

async function toggleWishlist(productId) {
  const user = await getCurrentUser();
  if (!user) return { needsLogin: true };
  const ids = await getWishlistIds();
  if (ids.has(productId)) {
    await sb.from('wishlists').delete().eq('user_id', user.id).eq('product_id', productId);
    return { added: false };
  } else {
    await sb.from('wishlists').insert({ user_id: user.id, product_id: productId });
    return { added: true };
  }
}

// ─── Contraseña ───────────────────────────────────────────────────────────────
async function sendPasswordReset(email) {
  const redirectTo = window.location.origin + '/reset-password.php';
  const { error } = await sb.auth.resetPasswordForEmail(email, { redirectTo });
  return !error;
}

async function updatePassword(newPassword) {
  const { error } = await sb.auth.updateUser({ password: newPassword });
  return !error;
}

// ─── Stock helpers ────────────────────────────────────────────────────────────
async function getStockForCartItems(cartItems) {
  const map          = {};
  const variantItems = cartItems.filter(i => i.variantId);
  const simpleItems  = cartItems.filter(i => !i.variantId);

  if (variantItems.length > 0) {
    const ids = variantItems.map(i => i.variantId);
    const { data } = await sb.from('product_variants').select('id, stock').in('id', ids);
    (data || []).forEach(v => {
      variantItems.filter(i => i.variantId === v.id).forEach(i => { map[i.key] = v.stock; });
    });
  }
  if (simpleItems.length > 0) {
    const ids = simpleItems.map(i => i.productId);
    const { data } = await sb.from('products').select('id, stock').in('id', ids);
    (data || []).forEach(p => {
      simpleItems.filter(i => i.productId === p.id).forEach(i => { map[i.key] = p.stock; });
    });
  }
  return map;
}

async function getVariantProductIds(productIds) {
  if (!productIds.length) return new Set();
  const { data } = await sb.from('product_variants').select('product_id').in('product_id', productIds);
  return new Set((data || []).map(v => v.product_id));
}

// ─── Validación de stock ──────────────────────────────────────────────────────
async function checkStock(cartItems) {
  const issues       = [];
  const variantItems = cartItems.filter(i => i.variantId);
  const simpleItems  = cartItems.filter(i => !i.variantId);

  if (variantItems.length > 0) {
    const ids = variantItems.map(i => i.variantId);
    const { data } = await sb.from('product_variants').select('id, stock, size, color').in('id', ids);
    (data || []).forEach(v => {
      const item = variantItems.find(i => i.variantId === v.id);
      if (item && v.stock < item.quantity) {
        const label = [v.color, v.size].filter(Boolean).join(' ');
        issues.push(`"${item.name}"${label ? ` (${label})` : ''} — solo quedan ${v.stock} en stock.`);
      }
    });
  }

  if (simpleItems.length > 0) {
    const ids = simpleItems.map(i => i.productId);
    const { data } = await sb.from('products').select('id, stock').in('id', ids);
    (data || []).forEach(p => {
      const item = simpleItems.find(i => i.productId === p.id);
      if (item && p.stock < item.quantity) {
        issues.push(`"${item.name}" — solo quedan ${p.stock} en stock.`);
      }
    });
  }

  return issues;
}

// ─── Dashboard ───────────────────────────────────────────────────────────────
async function getDashboardStats() {
  const today = new Date().toISOString().slice(0, 10);
  const [{ data: orders }, { data: products }] = await Promise.all([
    sb.from('orders').select('id, total, status, created_at, customer_name').order('created_at', { ascending: false }),
    sb.from('products').select('id, name, stock'),
  ]);
  const allOrders = orders || [];
  const active    = allOrders.filter(o => o.status !== 'cancelled');
  return {
    totalSales:   active.reduce((s, o) => s + (o.total || 0), 0),
    totalOrders:  allOrders.length,
    todayOrders:  allOrders.filter(o => o.created_at.startsWith(today)).length,
    noStock:      (products || []).filter(p => (p.stock ?? 0) <= 0).length,
    recentOrders: allOrders.slice(0, 5),
  };
}

// ─── Pago simulado ────────────────────────────────────────────────────────────
// Para integrar Wompi: https://docs.wompi.co/docs/en/widget
// Para integrar Stripe: necesita Supabase Edge Function para crear PaymentIntent

function luhnCheck(num) {
  const digits = num.replace(/\D/g, '');
  let sum = 0;
  let alt = false;
  for (let i = digits.length - 1; i >= 0; i--) {
    let n = parseInt(digits[i], 10);
    if (alt) { n *= 2; if (n > 9) n -= 9; }
    sum += n;
    alt = !alt;
  }
  return sum % 10 === 0;
}

function validateCard(data) {
  const errors = [];
  const cardNum = data.number.replace(/\s/g, '');
  if (cardNum.length < 13 || !luhnCheck(cardNum))
    errors.push('Número de tarjeta inválido.');
  const [mm, yy] = (data.expiry || '').split('/');
  const now = new Date();
  const expMonth = parseInt(mm, 10);
  const expYear  = parseInt('20' + yy, 10);
  if (!mm || !yy || expMonth < 1 || expMonth > 12 ||
      new Date(expYear, expMonth - 1) < new Date(now.getFullYear(), now.getMonth()))
    errors.push('Fecha de vencimiento inválida.');
  if (!/^\d{3,4}$/.test(data.cvv))
    errors.push('CVV inválido.');
  if (!data.name.trim())
    errors.push('El nombre en la tarjeta es obligatorio.');
  return errors;
}

function simulatePayment() {
  // Simula un tiempo de procesamiento. Retorna true (éxito) siempre en modo test.
  return new Promise(resolve => setTimeout(() => resolve(true), 1800));
}
