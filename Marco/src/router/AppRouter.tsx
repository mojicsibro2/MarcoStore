import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from '../pages/Home';
import AboutPage from '../pages/About';
import ContactPage from '../pages/Contact';
import ProductListPage from '../pages/ProductList';
import ProductDetailsPage from '../pages/ProductDetails';
import CartPage from '../pages/Carts';
import AccountPage from '../pages/Account';
import AdminLayout from '../layouts/AdminLayout';
import UsersPage from '../pages/admin/UsersPage';
import ProtectedRoute from '../components/ProtectedRoutes';

export default function AppRouter() {
  return (
    <BrowserRouter>
      <Routes>


        {/* Public pages */}
        <Route path="/" element={<HomePage />} />
        <Route path="/products" element={<ProductListPage />} />
        <Route path="/products/:id" element={<ProductDetailsPage />} />
        <Route path="/about" element={<AboutPage />} />
        <Route path="/contact" element={<ContactPage />} />

        {/* Auth pages */}
        <Route path="/account" element={<AccountPage />} />

        {/* User protected area */}
        <Route element={<ProtectedRoute />}>
          <Route path="/cart" element={<CartPage />} />
        </Route>
  


        {/* Admin protected area */}
        <Route element={<ProtectedRoute roles={['admin', 'employee']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/users" element={<UsersPage />} />
            {/* <Route path="/admin/reports" element={<ReportsPage />} /> */}
          </Route>
        </Route>
        {/* Admin protected area */}
        {/* <Route element={<ProtectedRoute roles={['admin', 'employee']} />}>
          <Route element={<AdminLayout />}>
            <Route path="/admin/users" element={<UsersPage />} />
            <Route path="/admin/reports" element={<ReportsPage />} />
          </Route>
        </Route> */}
      </Routes>
    </BrowserRouter>
  );
}
