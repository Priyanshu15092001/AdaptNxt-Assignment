// Centralized API client using fetch with JWT support
// Base URL can be configured with VITE_API_BASE_URL; defaults to same origin
const BASE_URL = import.meta.env.VITE_API_BASE || '';

function getToken() {
  try {
    return localStorage.getItem('token');
  } catch (_) {
    return null;
  }
}

async function request(path, { method = 'GET', body, headers = {}, query } = {}) {
  const url = new URL(`${BASE_URL}${path}`, window.location.origin);
  if (query && typeof query === 'object') {
    Object.entries(query).forEach(([k, v]) => {
      if (v !== undefined && v !== null && v !== '') url.searchParams.set(k, String(v));
    });
  }

  const token = getToken();
  const resp = await fetch(url.toString(), {
    method,
    headers: {
      'Content-Type': 'application/json',
      ...(token ? { Authorization: `${token}` } : {}),
      ...headers,
    },
    body: body ? JSON.stringify(body) : undefined,
  });

  const contentType = resp.headers.get('content-type') || '';
  const isJSON = contentType.includes('application/json');
  const data = isJSON ? await resp.json().catch(() => ({})) : await resp.text();

  if (!resp.ok) {
    const message = (isJSON && data && (data.message || data.error)) || resp.statusText || 'Request failed';
    const error = new Error(message);
    error.status = resp.status;
    error.data = data;
    throw error;
  }
  return data;
}

// Auth
export const api = {
  // Auth
  login: (email, password) => request('/api/auth/login', { method: 'POST', body: { email, password } }),
  register: (payload) => request('/api/auth/register', { method: 'POST', body: payload }),

  // Products
  getProducts: ({ page = 1, limit = 8, search } = {}) =>
    request('/api/products', { method: 'GET', query: { page, limit, search } }),
  createProduct: (product) => request('/api/products', { method: 'POST', body: product }),
  updateProduct: (id, product) => request(`/api/products/${id}`, { method: 'PUT', body: product }),
  deleteProduct: (id) => request(`/api/products/${id}`, { method: 'DELETE' }),

  // Cart
  getCart: () => request('/api/cart', { method: 'GET' }),
  addToCart: ({ productId}) => request('/api/cart', { method: 'POST', body: { productId} }),
  updateCartItem: ({ productId, action }) => request(`/api/cart/${productId}`, { method: 'PATCH', body: { action } }),
  removeCartItem: (productId) => request(`/api/cart/${productId}`, { method: 'DELETE' }),

  // Orders
  placeOrder: (payload) => request('/api/orders', { method: 'POST', body: payload || {} }),
  getOrders: () => request('/api/orders', { method: 'GET' }),
};

export default api;
