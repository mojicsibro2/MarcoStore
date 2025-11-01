import React, { useEffect, useState } from 'react';
import { logout } from '../../auth/authSlice';
import { useAppDispatch } from '../../app/hooks';
import { userService, type User } from '../../api/userServices';

const UsersPage: React.FC = () => {
    const [users, setUsers] = useState<User[]>([]);
    const [loading, setLoading] = useState(false);
    const [page, setPage] = useState(1);
    const [total, setTotal] = useState(0);
    const [search, setSearch] = useState('');

    const dispatch = useAppDispatch();

    useEffect(() => {
        const fetchUsers = async () => {
            try {
                setLoading(true);
                const res = await userService.getUsers(page, 10, search);
                setUsers(res.data);
                setTotal(res.total);
            // eslint-disable-next-line @typescript-eslint/no-explicit-any
            } catch (err: any) {
                if (err.response?.status === 401) {
                    dispatch(logout());
                }
            } finally {
                setLoading(false);
            }
        };

        fetchUsers();
    }, [page, search, dispatch]);

    const handleDelete = async (id: string) => {
        if (!confirm('Are you sure you want to delete this user?')) return;
        try {
            await userService.deleteUser(id);
            setUsers((prev) => prev.filter((u) => u.id !== id));
        } catch (err) {
            console.error('Error deleting user', err);
        }
    };

    return (
        <div className="admin-container">
            {/* ===== Top Section ===== */}
            <div className="top">
                <div className="topfirst">
                    <a href="#"><p>Admin-Dashboard</p></a>
                    <a href="#"><p>Logout</p></a>
                </div>
                <div className="topfirst">
                    <input
                        type="search"
                        placeholder="Search users..."
                        value={search}
                        onChange={(e) => setSearch(e.target.value)}
                    />
                    <a href="#"><p>Add User</p></a>
                </div>
            </div>

            {/* ===== Navigation ===== */}
            <div className="nav-bar">
                <ul>
                    <li><a href="/admin/dashboard">Dashboard</a></li>
                    <li><a href="/admin/users" className="active">Users</a></li>
                    <li><a href="/admin/products">Products</a></li>
                    <li><a href="/admin/reports">Reports</a></li>
                    <li><a href="/admin/delivery">Delivery</a></li>
                </ul>
            </div>

            {/* ===== Main User Table ===== */}
            <div className="detail-container">
                <div className="top-selling-Product topselling">
                    <div className="toprow mainbox">
                        <h1>All Users</h1>
                        <div className="firstrow">
                            <p>Name</p><p>Email</p><p>Role</p><p>Action</p>
                        </div>

                        {loading ? (
                            <div className="firstrow"><p>Loading users...</p></div>
                        ) : users.length > 0 ? (
                            users.map((user) => (
                                <div className="firstrow" key={user.id}>
                                    <p>{user.name}</p>
                                    <p>{user.email}</p>
                                    <p>{user.role}</p>
                                    <div className="edit-delete">
                                        <a href="#" className="edit">Edit</a>
                                        <a href="#" onClick={() => handleDelete(user.id)} className="delete">Delete</a>
                                    </div>
                                </div>
                            ))
                        ) : (
                            <div className="firstrow"><p>No users found</p></div>
                        )}
                    </div>
                </div>

                {/* ===== Pagination ===== */}
                <div className="page-btn admin-user-nxt-btn">
                    {Array.from({ length: Math.ceil(total / 10) || 1 }, (_, i) => (
                        <span
                            key={i}
                            onClick={() => setPage(i + 1)}
                            className={page === i + 1 ? 'active' : ''}
                            style={{ cursor: 'pointer' }}
                        >
                            {i + 1}
                        </span>
                    ))}
                </div>
            </div>
        </div>
    );
};

export default UsersPage;
