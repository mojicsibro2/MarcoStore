import { Outlet, NavLink, useNavigate } from "react-router-dom";
import { useDispatch, useSelector } from "react-redux";
import "./supplier.css"; // optional — for supplier-specific styles
import Footer from "../components/Footer";
import Navbar from "../components/Navbar";
import type { AppDispatch, RootState } from "../app/store";
import { logout } from "../auth/authSlice";


export default function SupplierLayout() {
    const { user } = useSelector((state: RootState) => state.auth);
    const dispatch = useDispatch<AppDispatch>();
    const navigate = useNavigate();

    const handleLogout = () => {
        dispatch(logout());
        navigate("/account");
    };

    return (
        <>
            {/* Shared Navbar */}
            <Navbar />

            <div className="supplier-layout container">
                <div className="supplier-sidebar">
                    <div className="supplier-profile">
                        <img
                            src="/images/logo.png"
                            alt="profile"
                            className="supplier-avatar"
                        />
                        <p className="supplier-name">{user?.name || "Supplier"}</p>
                    </div>

                    <nav className="supplier-nav">
                        <ul>
                            <li>
                                <NavLink
                                    to="/supplier/dashboard"
                                    className={({ isActive }) =>
                                        isActive ? "active-link" : undefined
                                    }
                                >
                                    Dashboard
                                </NavLink>
                            </li>


                            <li>
                                <NavLink
                                    to="/supplier/products"
                                    className={({ isActive }) =>
                                        isActive ? "active-link" : undefined
                                    }
                                >
                                    My Products
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/supplier/add-product"
                                    className={({ isActive }) =>
                                        isActive ? "active-link" : undefined
                                    }
                                >
                                    Add Product
                                </NavLink>
                            </li>
                            <li>
                                <NavLink
                                    to="/supplier/reports"
                                    className={({ isActive }) =>
                                        isActive ? "active-link" : undefined
                                    }
                                >
                                    Reports
                                </NavLink>
                            </li>
                        </ul>
                    </nav>

                    <button className="btn llogout-btn" onClick={handleLogout}>
                        Logout
                    </button>
                </div>

                {/* Render child pages here */}
                <div className="supplier-content">
                    <Outlet />
                </div>
            </div>

            <Footer />
        </>
    );
}
