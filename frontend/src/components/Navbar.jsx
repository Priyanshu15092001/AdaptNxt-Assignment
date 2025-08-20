import { Link, useNavigate } from 'react-router-dom';
import { useAuth } from '../context/AuthContext.jsx';
import styles from './Navbar.module.css';

export default function Navbar() {
  const { isAuthenticated, role, logout } = useAuth();
  const navigate = useNavigate();

  const handleLogout = () => {
    logout();
    navigate('/login');
  };

  return (
    <nav className={styles.nav}>
      <div className={styles.brand}>E-Shop</div>
      <div className={styles.links}>
        {!isAuthenticated && (
          <>
            <Link to="/login">Login</Link>
            <Link to="/register">Register</Link>
          </>
        )}
        {isAuthenticated && role === 'customer' && (
          <>
            <Link to="/products">Products</Link>
            <Link to="/cart">Cart</Link>
            <Link to="/orders">Orders</Link>
          </>
        )}
        {isAuthenticated && role === 'admin' && (
          <>
            <Link to="/admin/products">Manage Products</Link>
          </>
        )}
        {isAuthenticated && (
          <button className={styles.logoutBtn} onClick={handleLogout}>Logout</button>
        )}
      </div>
    </nav>
  );
}
