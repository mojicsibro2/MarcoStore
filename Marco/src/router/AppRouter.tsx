import { BrowserRouter, Route, Routes } from 'react-router-dom';
import HomePage from '../pages/Home';
import AboutPage from '../pages/About';
import ContactPage from '../pages/Contact';
import ProductListPage from '../pages/ProductList';
import ProductDetailsPage from '../pages/ProductDetails';
import CartPage from '../pages/Carts';
import AccountPage from '../pages/Account';
import AdminLayout from '../layouts/AdminLayout';
import ProtectedRoute from '../components/ProtectedRoutes';
import SupplierProductDetailsPage from '../pages/supplier/ProductDetailsPage';
import AddProductPage from '../pages/supplier/AddProductPage';
import SupplierDashboard from '../pages/supplier/SupplierDashboard';
import SupplierLayout from '../layouts/SupplierLayout';
import SupplierProductsPage from '../pages/supplier/SupplierProducts';
import SupplierReportsPage from '../pages/supplier/SupplierReportPage';
import EditProductPage from '../pages/supplier/SupplierEditProductPage';
import AdminDashboardPage from '../pages/admin/AdminDashboardPage';
import AdminUsersPage from '../pages/admin/AdminUsersPage';
import AdminProductsPage from '../pages/admin/AdminProductsPage';
import AdminCategoriesPage from '../pages/admin/AdminCategoriesPage';
import AdminDeliveryModesPage from '../pages/admin/AdminDeliveryModesPage';
import AdminReportsPage from '../pages/admin/AdminReportsPage';
import AdminCreateUserPage from '../pages/admin/AdminCreateUserPage';

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


        {/* Supplier Protected Area */}
        <Route element={<ProtectedRoute roles={['supplier']} />}>
          <Route element={<SupplierLayout />}>
            <Route path="/supplier/dashboard" element={<SupplierDashboard />} />
            <Route path="/supplier/add-product" element={<AddProductPage />} />
            <Route path="/supplier/products" element={<SupplierProductsPage />} />
            <Route path="/supplier/reports" element={<SupplierReportsPage />} />
            <Route
              path="/supplier/products/:id"
              element={<SupplierProductDetailsPage />}
            />
            <Route
              path="/supplier/products/:id/edit"
              element={<EditProductPage />}
            />
          </Route>
        </Route>


        {/* ----------------------------- */}
        {/* 🔹 ADMIN ROUTES */}
        {/* ----------------------------- */}

        {/* Admin protected area */}
        <Route element={<ProtectedRoute roles={['admin', 'employee']} />}>
          <Route path="/admin" element={<AdminLayout />}>
            <Route path="dashboard" element={<AdminDashboardPage />} />
            <Route path="users" element={<AdminUsersPage />} />
            <Route path="products" element={<AdminProductsPage />} />
            <Route path="categories" element={<AdminCategoriesPage />} />
            <Route path="delivery-modes" element={<AdminDeliveryModesPage />} />
            <Route path="reports" element={<AdminReportsPage />} />
            <Route path="users/create" element={<AdminCreateUserPage />} />
          </Route>
        </Route>


      </Routes>
    </BrowserRouter>
  );
}
