import { useEffect, useState } from 'react';
import styles from './Cart.module.css';
import api from '../services/api.js';
import Loader from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';

// Normalize various possible backend cart response shapes into a flat items array
function normalizeCartItems(res) {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (Array.isArray(res.items)) return res.items;
  if (res.data) {
    if (Array.isArray(res.data)) return res.data;
    if (Array.isArray(res.data.items)) return res.data.items;
  }
  if (res.cart) {
    if (Array.isArray(res.cart)) return res.cart;
    if (Array.isArray(res.cart.items)) return res.cart.items;
  }
  return [];
}

export default function Cart() {
  const [items, setItems] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const fetchCart = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getCart();
      const cartItems = normalizeCartItems(res);
      setItems(cartItems);
    } catch (err) {
      setError(err.message || 'Failed to load cart');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchCart();
  }, []);

  const increase = async (productId) => {
    const item = items.find((i) => (i.product?._id || i.productId) === productId);
    const qty = (item?.quantity || 0) + 1;
    await api.updateCartItem({ productId, action:"increase"});
    fetchCart();
  };
  const decrease = async (productId) => {
    const item = items.find((i) => (i.product?._id || i.productId) === productId);
    const qty = Math.max(1, (item?.quantity || 1) - 1);
    await api.updateCartItem({ productId, action:"decrease"});
    fetchCart();
  };
  const remove = async (productId) => {
    await api.removeCartItem(productId);
    fetchCart();
  };

  const total = items.reduce((sum, i) => sum + (i.quantity || 0) * (i.product?.price || i.price || 0), 0);

  const placeOrder = async () => {
    try {
      await api.placeOrder({});
      alert('Order placed');
      fetchCart();
    } catch (err) {
      alert(err.message || 'Failed to place order');
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <h2>Your Cart</h2>
      {items.length === 0 ? (
        <EmptyState title="Cart is empty" />
      ) : (
        <div className={styles.cart}>
          {items.map((i) => {
            const product = i.product || i;
            const productId = product._id || i.productId || product.id;
            return (
              <div className={styles.item} key={productId}>
                <div className={styles.info}>
                  <div className={styles.name}>{product.name}</div>
                  <div className={styles.meta}>${Number(product.price || 0).toFixed(2)} · {product.category}</div>
                </div>
                <div className={styles.qty}>
                  <button onClick={() => decrease(productId)}>-</button>
                  <span>{i.quantity}</span>
                  <button onClick={() => increase(productId)}>+</button>
                </div>
                <div className={styles.subtotal}>${(Number(product.price || 0) * Number(i.quantity || 0)).toFixed(2)}</div>
                <button className={styles.remove} onClick={() => remove(productId)}>Remove</button>
              </div>
            );
          })}
          <div className={styles.footer}>
            <div className={styles.total}>Total: ${total.toFixed(2)}</div>
            <button className={styles.placeBtn} onClick={placeOrder}>Place Order</button>
          </div>
        </div>
      )}
    </div>
  );
}
