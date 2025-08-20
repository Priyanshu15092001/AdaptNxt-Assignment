import { useEffect, useState } from 'react';
import { useLocation, useNavigate, Link } from 'react-router-dom';
import styles from './Login.module.css';
import api from '../services/api.js';
import { useAuth } from '../context/AuthContext.jsx';

export default function Login() {
  const { isAuthenticated, role, login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [email, setEmail] = useState('');
  const [password, setPassword] = useState('');
  const [loading, setLoading] = useState(false);
  const [error, setError] = useState('');

  useEffect(() => {
    if (isAuthenticated) {
      navigate(role === 'admin' ? '/admin/products' : '/products', { replace: true });
    }
  }, [isAuthenticated, role, navigate]);

  const handleSubmit = async (e) => {
    e.preventDefault();
    setLoading(true);
    setError('');
    try {
      const res = await api.login(email, password);
      // Expect backend to return { token, user: { name, email, role, ... } }
      const token = res.token;
      const user = res.user || {};
      const userRole = user.role || res.role || 'customer';
      login({ token, role: userRole, user });
      const redirect = (location.state && location.state.from && location.state.from.pathname) || (userRole === 'admin' ? '/admin/products' : '/products');
      navigate(redirect, { replace: true });
    } catch (err) {
      setError(err.message || 'Failed to login');
    } finally {
      setLoading(false);
    }
  };

  return (
    <div className={styles.container}>
      <form className={styles.form} onSubmit={handleSubmit}>
        <h2>Login</h2>
        {error && <div className={styles.error}>{error}</div>}
        <label>
          Email
          <input type="email" value={email} onChange={(e) => setEmail(e.target.value)} required />
        </label>
        <label>
          Password
          <input type="password" value={password} onChange={(e) => setPassword(e.target.value)} required />
        </label>
        <button disabled={loading} type="submit">{loading ? 'Logging in...' : 'Login'}</button>
        <div className={styles.alt}>No account? <Link to="/register">Register</Link></div>
      </form>
    </div>
  );
}
