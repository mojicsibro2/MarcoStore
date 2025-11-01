// src/layouts/AdminLayout.tsx
import { Outlet, useNavigate } from 'react-router-dom';
import { logout } from '../auth/authSlice';
import { useAppDispatch, useAppSelector } from '../app/hooks';

export default function AdminLayout() {
    const { user } = useAppSelector((state) => state.auth);
    const navigate = useNavigate();
    const dispatch = useAppDispatch();

    const handleLogout = () => {
        dispatch(logout());
        navigate('/login');
    };

    return (
        <div className="admin-layout">
            <header className="navbar">
                <div className="logo">Marco Admin</div>
                <nav>
                    <ul>
                        <li><a href="/admin/users">Users</a></li>
                        <li><a href="/admin/reports">Reports</a></li>
                    </ul>
                </nav>
                <div className="admin-info">
                    <span>{user?.name}</span>
                    <button className="btn" onClick={handleLogout}>Logout</button>
                </div>
            </header>
            <main style={{ padding: '20px' }}>
                <Outlet />
            </main>
        </div>
    );
}
