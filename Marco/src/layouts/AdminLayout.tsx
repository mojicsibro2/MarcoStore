import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import type { RootState, AppDispatch } from "../app/store";
import { logout } from "../auth/authSlice";
import "./admin.css";
import Navbar from "../components/Navbar";
import Footer from "../components/Footer";

export default function AdminLayout() {
  const dispatch = useDispatch<AppDispatch>();
  const navigate = useNavigate();
  const { user } = useSelector((state: RootState) => state.auth);

  // ✅ Handle Logout
  const handleLogout = () => {
    dispatch(logout());
    navigate("/account");
  };

  // ✅ Route Protection
  if (!user || (user.role !== "admin" && user.role !== "employee")) {
    navigate("/account");
    return null;
  }

  return (
    <div className="admin-layout">
      <Navbar />

      <div className="admin-body">
        {/* Sidebar */}
        <aside className="admin-sidebar">
          <h2 className="sidebar-title">Admin Panel</h2>
          <ul className="sidebar-links">
            <li>
              <NavLink
                to="/admin/dashboard"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                📊 Dashboard
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/users/create"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                👤 Create Users
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/users"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                👤 Users
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/products"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                🛒 Products
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/delivery-modes"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                🛒 Delivery Modes
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/categories"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                📁 Categories
              </NavLink>
            </li>
            <li>
              <NavLink
                to="/admin/reports"
                className={({ isActive }) => (isActive ? "active" : "")}
              >
                📈 Reports
              </NavLink>
            </li>
          </ul>

          <button onClick={handleLogout} className="llogout-btn">
            Logout
          </button>
        </aside>

        {/* Main Content */}
        <main className="admin-main">
          <Outlet />
        </main>
      </div>

      <Footer />
    </div>
  );
}
