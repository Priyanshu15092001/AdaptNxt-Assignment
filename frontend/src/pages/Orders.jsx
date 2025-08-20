import { useEffect, useState } from 'react';
import styles from './Orders.module.css';
import api from '../services/api.js';
import Loader from '../components/Loader.jsx';
import EmptyState from '../components/EmptyState.jsx';

// Normalize various possible backend orders response shapes into an array
function normalizeOrders(res) {
  if (!res) return [];
  if (Array.isArray(res)) return res;
  if (Array.isArray(res.orders)) return res.orders;
  if (Array.isArray(res.data)) return res.data;
  if (res.data) {
    if (Array.isArray(res.data.orders)) return res.data.orders;
    if (Array.isArray(res.data.docs)) return res.data.docs;
    if (Array.isArray(res.data.items)) return res.data.items;
  }
  if (Array.isArray(res.docs)) return res.docs;
  if (Array.isArray(res.items)) return res.items;
  if (Array.isArray(res.list)) return res.list;
  if (Array.isArray(res.results)) return res.results;
  if (res.allOrders && Array.isArray(res.allOrders)) return res.allOrders;
  return [];
}

export default function Orders() {
  const [orders, setOrders] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  useEffect(() => {
    let ignore = false;
    async function fetchOrders() {
      setLoading(true);
      setError('');
      try {
        const res = await api.getOrders();
        const items = normalizeOrders(res);
        if (!ignore) setOrders(items);
      } catch (err) {
        if (!ignore) setError(err.message || 'Failed to load orders');
      } finally {
        if (!ignore) setLoading(false);
      }
    }
    fetchOrders();
    return () => { ignore = true; };
  }, []);

  if (loading) return <Loader />;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <h2>Orders</h2>
      {orders.length === 0 ? (
        <EmptyState title="No orders yet" />
      ) : (
        <div className={styles.list}>
          {orders.map((o) => {
            const id = o._id || o.id;
            const status = o.status || 'pending';
            const orderItems = o.items || [];
            const total = o.total || orderItems.reduce((sum, i) => sum + (i.quantity || 0) * (i.product?.price || i.price || 0), 0);
            return (
              <div className={styles.order} key={id}>
                <div className={styles.header}>
                  <div className={styles.orderId}>Order #{String(id).slice(-6)}</div>
                  <div className={styles.status}>{status}</div>
                </div>
                <ul className={styles.items}>
                  {orderItems.map((it, idx) => (
                    <li key={idx}>
                      <span>{it.product?.name || it.name}</span>
                      <span>x{it.quantity}</span>
                      <span>${Number(it.product?.price || it.price || 0).toFixed(2)}</span>
                    </li>
                  ))}
                </ul>
                <div className={styles.total}>Total: ${Number(total).toFixed(2)}</div>
              </div>
            );
          })}
        </div>
      )}
    </div>
  );
}
