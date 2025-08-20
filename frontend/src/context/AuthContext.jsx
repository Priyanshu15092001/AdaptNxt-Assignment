import { createContext, useContext, useEffect, useMemo, useState } from 'react';
import { Navigate, Outlet, useLocation } from 'react-router-dom';

const AuthContext = createContext(null);

export const AuthProvider = ({ children }) => {
  const [token, setToken] = useState(() => {
    try {
      return localStorage.getItem('token');
    } catch {
      return null;
    }
  });
  const [role, setRole] = useState(() => {
    try {
      return localStorage.getItem('role');
    } catch {
      return null;
    }
  });
  const [user, setUser] = useState(() => {
    try {
      const raw = localStorage.getItem('user');
      return raw ? JSON.parse(raw) : null;
    } catch {
      return null;
    }
  });

  const isAuthenticated = Boolean(token);

  const login = ({ token: t, role: r, user: u }) => {
    setToken(t);
    setRole(r);
    setUser(u || null);
    try {
      localStorage.setItem('token', t);
      if (r) localStorage.setItem('role', r);
      if (u) localStorage.setItem('user', JSON.stringify(u));
    } catch {}
  };

  const logout = () => {
    setToken(null);
    setRole(null);
    setUser(null);
    try {
      localStorage.removeItem('token');
      localStorage.removeItem('role');
      localStorage.removeItem('user');
    } catch {}
  };

  const value = useMemo(
    () => ({ token, role, user, isAuthenticated, login, logout, setUser, setRole }),
    [token, role, user, isAuthenticated]
  );

  return <AuthContext.Provider value={value}>{children}</AuthContext.Provider>;
};

export const useAuth = () => {
  const ctx = useContext(AuthContext);
  if (!ctx) throw new Error('useAuth must be used within AuthProvider');
  return ctx;
};

// Route guard with optional role-based access
export const ProtectedRoute = ({ allowRoles }) => {
  const { isAuthenticated, role } = useAuth();
  const location = useLocation();

  if (!isAuthenticated) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (allowRoles && Array.isArray(allowRoles) && !allowRoles.includes(role)) {
    // Redirect to role home if role is unauthorized for this route
    const fallback = role === 'admin' ? '/admin/products' : '/products';
    return <Navigate to={fallback} replace />;
  }

  return <Outlet />;
};

export default AuthProvider;
