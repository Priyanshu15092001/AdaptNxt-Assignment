import { useEffect, useState } from 'react';
import styles from './ManageProducts.module.css';
import api from '../services/api.js';
import Loader from '../components/Loader.jsx';

export default function ManageProducts() {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

  const [form, setForm] = useState({ name: '', category: '', price: '', stock: '' });
  const [editingId, setEditingId] = useState(null);

  const fetchProducts = async () => {
    setLoading(true);
    setError('');
    try {
      const res = await api.getProducts({ page: 1, limit: 100 });
      const items = Array.isArray(res.data) ? res.data : Array.isArray(res.products) ? res.products : res;
      setProducts(items);
    } catch (err) {
      setError(err.message || 'Failed to load products');
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const submit = async (e) => {
    e.preventDefault();
    try {
      const payload = {
        name: form.name,
        category: form.category,
        price: Number(form.price),
        stock: Number(form.stock),
      };
      if (editingId) {
        await api.updateProduct(editingId, payload);
      } else {
        await api.createProduct(payload);
      }
      setForm({ name: '', category: '', price: '', stock: '' });
      setEditingId(null);
      fetchProducts();
    } catch (err) {
      alert(err.message || 'Failed to save product');
    }
  };

  const edit = (p) => {
    setEditingId(p._id || p.id);
    setForm({ name: p.name, category: p.category, price: p.price, stock: p.stock });
  };

  const remove = async (p) => {
    if (!confirm('Delete this product?')) return;
    try {
      await api.deleteProduct(p._id || p.id);
      fetchProducts();
    } catch (err) {
      alert(err.message || 'Failed to delete');
    }
  };

  if (loading) return <Loader />;
  if (error) return <div className={styles.error}>{error}</div>;

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={submit}>
        <h3>{editingId ? 'Edit Product' : 'Add Product'}</h3>
        <div className={styles.row}>
          <input placeholder="Name" value={form.name} onChange={(e) => setForm({ ...form, name: e.target.value })} required />
          <input placeholder="Category" value={form.category} onChange={(e) => setForm({ ...form, category: e.target.value })} required />
        </div>
        <div className={styles.row}>
          <input type="number" step="0.01" placeholder="Price" value={form.price} onChange={(e) => setForm({ ...form, price: e.target.value })} required />
          <input type="number" placeholder="Stock" value={form.stock} onChange={(e) => setForm({ ...form, stock: e.target.value })} required />
        </div>
        <div className={styles.actions}>
          <button type="submit">{editingId ? 'Update' : 'Create'}</button>
          {editingId && <button type="button" className={styles.secondary} onClick={() => { setEditingId(null); setForm({ name: '', category: '', price: '', stock: '' }); }}>Cancel</button>}
        </div>
      </form>

      <div className={styles.list}>
        {products.map((p) => (
          <div className={styles.item} key={p._id || p.id}>
            <div className={styles.info}>
              <div className={styles.name}>{p.name}</div>
              <div className={styles.meta}>${Number(p.price).toFixed(2)} · {p.category} · Stock: {p.stock}</div>
            </div>
            <div className={styles.itemActions}>
              <button onClick={() => edit(p)}>Edit</button>
              <button className={styles.danger} onClick={() => remove(p)}>Delete</button>
            </div>
          </div>
        ))}
      </div>
    </div>
  );
}
