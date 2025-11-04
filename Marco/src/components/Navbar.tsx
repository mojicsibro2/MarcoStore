import React, { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import { useSelector, useDispatch } from "react-redux";
import type { RootState } from "../app/store";
import { logout } from "../auth/authSlice";

const Navbar: React.FC = () => {
  const [menuOpen, setMenuOpen] = useState(false);
  const { user } = useSelector((state: RootState) => state.auth);
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const handleLogout = () => {
    dispatch(logout());
    localStorage.removeItem("token");
    navigate("/account");
  };

  return (
    <div className="container">
      <div className="navbar">
        {/* --- Logo --- */}
        <div className="logo">
          <Link to="/">
            <img src="/images/logo2.png" width="100px" alt="logo" />
          </Link>
        </div>

        {/* --- Navigation Menu --- */}
        <nav className="nav">
          <ul id="MenuItems" className={`menu ${menuOpen ? "open" : ""}`}>
            <li>
              <Link to="/">Home</Link>
            </li>
            <li>
              <Link to="/products">Products</Link>
            </li>
            <li>
              <Link to="/about">About</Link>
            </li>
            <li>
              <Link to="/contact">Contact</Link>
            </li>

            {user ? (
              <>
                {/* ✅ Admin Section */}
                {user.role === "admin" && (
                  <li>
                    <Link to="/admin/users">Admin Dashboard</Link>
                  </li>
                )}

                {/* ✅ Supplier Section */}
                {user.role === "supplier" && (
                  <li>
                    <Link to="/supplier/dashboard">Supplier Dashboard</Link>
                  </li>
                )}

                {/* ✅ Logout Button */}
                <li>
                  <button onClick={handleLogout} className="logout-btn">
                    Logout
                  </button>
                </li>
              </>
            ) : (
              <>
                <li>
                  <Link to="/account">Signup/Login</Link>
                </li>
              </>
            )}
          </ul>
        </nav>

        {/* --- Cart Icon (only for logged-in users) --- */}
        {user && user.role === "customer" && (
          <Link to="/cart">
            <img src="/images/cart.png" width="20px" height="20px" alt="cart" />
          </Link>
        )}

        {/* --- Menu Icon --- */}
        <img
          src="/images/menu.png"
          className="menu-icon"
          alt="menu"
          onClick={() => setMenuOpen(!menuOpen)}
        />
      </div>
    </div>
  );
};

export default Navbar;
