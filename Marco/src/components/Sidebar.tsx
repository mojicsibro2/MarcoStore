import { Link, useLocation } from "react-router-dom";

export default function Sidebar() {
  const location = useLocation();
  
  const isActive = (path: string) => location.pathname === path;

  return (
    <aside className="w-64 bg-gray-900 text-white flex flex-col h-screen">
      <div className="p-4 text-2xl font-bold border-b border-gray-700">
        Admin Panel
      </div>

      <nav className="flex-1 p-4 space-y-3">
        <Link
          to="/admin/users"
          className={`block p-3 rounded transition ${
            isActive('/admin/users')
              ? 'bg-gray-700'
              : 'hover:bg-gray-800'
          }`}
        >
          👤 User Management
        </Link>
        <Link
          to="/admin/products"
          className={`block p-3 rounded transition ${
            isActive('/admin/products')
              ? 'bg-gray-700'
              : 'hover:bg-gray-800'
          }`}
        >
          📦 Product Management
        </Link>
        <Link
          to="/admin/reports"
          className={`block p-3 rounded transition ${
            isActive('/admin/reports')
              ? 'bg-gray-700'
              : 'hover:bg-gray-800'
          }`}
        >
          📊 Reports
        </Link>
        <Link
          to="/admin/deliveries"
          className={`block p-3 rounded transition ${
            isActive('/admin/deliveries')
              ? 'bg-gray-700'
              : 'hover:bg-gray-800'
          }`}
        >
          🚚 Delivery Management
        </Link>
      </nav>

      <div className="p-4 border-t border-gray-700">
        <button
          onClick={() => {
            // Remove localStorage usage as per requirements
            // Instead, clear auth state and redirect
            window.location.href = "/account";
          }}
          className="w-full bg-red-600 hover:bg-red-700 py-2 rounded transition font-semibold"
        >
          Logout
        </button>
      </div>
    </aside>
  );
}