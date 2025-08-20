import { useEffect, useMemo, useState } from 'react';
import styles from './Products.module.css';
import api from '../services/api.js';
import ProductCard from '../components/ProductCard.jsx';
import SearchBar from '../components/SearchBar.jsx';
import Pagination from '../components/Pagination.jsx';
import Loader from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';

export default function Products() {
  const [products, setProducts] = useState([]);
  const [page, setPage] = useState(1);
  const [limit] = useState(8);
  const [search, setSearch] = useState('');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');
  const [totalPages, setTotalPages] = useState(1);

  // Track cart quantities keyed by productId
  const [cartQty, setCartQty] = useState({});

  const debouncedSearch = useDebounce(search, 300);

  useEffect(() => {
    let ignore = false;
    async function fetchProducts() {
      setLoading(true);
      setError('');
      try {
        const res = await api.getProducts({ page, limit, search: debouncedSearch });
        const items = Array.isArray(res.data) ? res.data : Array.isArray(res.products) ? res.products : res;
        const total = res.totalPages || Math.ceil((res.total || items.length) / limit) || 1;
        if (!ignore) {
          setProducts(items);
          setTotalPages(total);
        }
      } catch (err) {
        if (!ignore) setError(err.message || 'Failed to load products');
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    fetchProducts();
    return () => { ignore = true; };
  }, [page, limit, debouncedSearch]);

  // Fetch cart one time (and after cart operations) to render qty controls
  const refreshCartQty = async () => {
    try {
      const res = await api.getCart();
      const items = Array.isArray(res?.items) ? res.items : Array.isArray(res?.data) ? res.data : Array.isArray(res) ? res : Array.isArray(res?.cart?.items) ? res.cart.items : [];
      const map = {};
      for (const it of items) {
        const p = it.product || it;
        const id = p._id || it.productId || p.id;
        if (!id) continue;
        map[id] = (map[id] || 0) + (it.quantity || 0);
      }
      setCartQty(map);
    } catch (_) {
      // no-op: keep previous qty
    }
  };

  useEffect(() => {
    refreshCartQty();
  }, []);

  const onAddToCart = async (product) => {
    try {
      const id = product._id || product.id;
      await api.addToCart({ productId: id, quantity: 1 });
      setCartQty((prev) => ({ ...prev, [id]: (prev[id] || 0) + 1 }));
    } catch (err) {
      alert(err.message || 'Failed to add to cart');
    }
  };

  const onIncrease = async (product) => {
    try {
      const id = product._id || product.id;
      const next = (cartQty[id] || 0) + 1;
      await api.updateCartItem({ productId: id, quantity: next });
      setCartQty((prev) => ({ ...prev, [id]: next }));
    } catch (err) {
      alert(err.message || 'Failed to update cart');
    }
  };

  const onDecrease = async (product) => {
    try {
      const id = product._id || product.id;
      const next = Math.max(0, (cartQty[id] || 0) - 1);
      if (next === 0) {
        await api.removeCartItem(id);
      } else {
        await api.updateCartItem({ productId: id, quantity: next });
      }
      setCartQty((prev) => {
        const copy = { ...prev };
        if (next === 0) delete copy[id]; else copy[id] = next;
        return copy;
      });
    } catch (err) {
      alert(err.message || 'Failed to update cart');
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <div className={styles.controls}>
        <SearchBar value={search} onChange={(v) => { setPage(1); setSearch(v); }} placeholder="Search by name or category" />
      </div>
      {products.length === 0 ? (
        <EmptyState title="No products found" />
      ) : (
        <div className={styles.grid}>
          {products.map((p) => {
            const id = p._id || p.id;
            const qty = cartQty[id] || 0;
            return (
              <ProductCard
                key={id}
                product={p}
                quantity={qty}
                onAddToCart={onAddToCart}
                onIncrease={onIncrease}
                onDecrease={onDecrease}
              />
            );
          })}
        </div>
      )}
      <Pagination page={page} totalPages={totalPages} onPrev={() => setPage((p) => Math.max(1, p - 1))} onNext={() => setPage((p) => Math.min(totalPages, p + 1))} />
    </div>
  );
}

function useDebounce(value, delay) {
  const [debounced, setDebounced] = useState(value);
  useEffect(() => {
    const id = setTimeout(() => setDebounced(value), delay);
    return () => clearTimeout(id);
  }, [value, delay]);
  return debounced;
}
