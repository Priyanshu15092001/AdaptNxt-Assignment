
import { BrowserRouter, Routes, Route, Navigate } from 'react-router-dom';
import { AuthProvider, ProtectedRoute } from './context/AuthContext.jsx';
import Navbar from './components/Navbar.jsx';

import Login from './pages/Login.jsx';
import Register from './pages/Register.jsx';
import Products from './pages/Products.jsx';
import Cart from './pages/Cart.jsx';
import Orders from './pages/Orders.jsx';
import ManageProducts from './pages/ManageProducts.jsx';

function App() {
  return (
    <BrowserRouter>
      <AuthProvider>
        <Navbar />
        <Routes>
          <Route path="/" element={<Navigate to="/login" replace />} />
          <Route path="/login" element={<Login />} />
          <Route path="/register" element={<Register />} />

          {/* Customer protected routes */}
          <Route element={<ProtectedRoute allowRoles={["customer", "admin"]} />}>
            <Route path="/products" element={<Products />} />
          </Route>
          <Route element={<ProtectedRoute allowRoles={["customer"]} />}>
            <Route path="/cart" element={<Cart />} />
            <Route path="/orders" element={<Orders />} />
          </Route>

          {/* Admin protected routes */}
          <Route element={<ProtectedRoute allowRoles={["admin"]} />}>
            <Route path="/admin/products" element={<ManageProducts />} />
          </Route>

          <Route path="*" element={<div style={{ padding: 16 }}>Not Found</div>} />
        </Routes>
      </AuthProvider>
    </BrowserRouter>
  );
}

export default App;
