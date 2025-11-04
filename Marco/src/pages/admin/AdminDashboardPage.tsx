import { useEffect, useState } from "react";
import { reportService } from "../../api/reportService";

export default function AdminDashboardPage() {
    const [stats, setStats] = useState({
        totalUsers: 0,
        pendingUsers: 0,
        totalProducts: 0,
        pendingProducts: 0,
        totalOrders: 0,
        deliveredOrders: 0,
    });
    const [loading, setLoading] = useState(true);

    // ✅ Fetch dashboard stats
    useEffect(() => {
        const fetchStats = async () => {
            try {
                const res = await reportService.getOverview() // Make sure backend provides this route
                setStats(res);
            } catch (error) {
                console.error(error);
                alert("Failed to load dashboard stats.");
            } finally {
                setLoading(false);
            }
        };
        fetchStats();
    }, []);

    if (loading) return <p className="loading-text">Loading dashboard...</p>;

    return (
        <div className="admin-dashboard">
            <h2>📊 Admin Dashboard</h2>
            <p className="sub-text">Platform performance summary</p>

            <div className="stats-grid">
                <div className="stat-card users">
                    <h3>Total Users</h3>
                    <p>{stats.totalUsers.toLocaleString()}</p>
                </div>

                <div className="stat-card pending-users">
                    <h3>Pending Users</h3>
                    <p>{stats.pendingUsers.toLocaleString()}</p>
                </div>

                <div className="stat-card products">
                    <h3>Total Products</h3>
                    <p>{stats.totalProducts.toLocaleString()}</p>
                </div>

                <div className="stat-card pending-products">
                    <h3>Pending Products</h3>
                    <p>{stats.pendingProducts.toLocaleString()}</p>
                </div>

                <div className="stat-card orders">
                    <h3>Total Orders</h3>
                    <p>{stats.totalOrders.toLocaleString()}</p>
                </div>

                <div className="stat-card delivered">
                    <h3>Delivered Orders</h3>
                    <p>{stats.deliveredOrders.toLocaleString()}</p>
                </div>
            </div>
        </div>
    );
}
