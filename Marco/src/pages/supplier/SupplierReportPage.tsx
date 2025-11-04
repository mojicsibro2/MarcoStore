import { useEffect, useState } from "react";
import { useSelector } from "react-redux";
import { reportService } from "../../api/reportService";
import type { RootState } from "../../app/store";
import Pagination from "../../components/Pagination";
import { BarChart, Bar, XAxis, YAxis, CartesianGrid, Tooltip, ResponsiveContainer } from "recharts";

export default function SupplierReportsPage() {
    const { user } = useSelector((state: RootState) => state.auth);
    const [totalReport, setTotalReport] = useState<{
        totalEarnings?: number;
        totalOrders?: number;
    }>({});

    // eslint-disable-next-line @typescript-eslint/no-explicit-any
    const [monthlyData, setMonthlyData] = useState<any[]>([]);
    const [year, setYear] = useState<number>(new Date().getFullYear());
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const loadReports = async () => {
            if (!user?.id) return;
            try {
                setLoading(true);
                const earnings = await reportService.getSupplierEarnings();
                setTotalReport(earnings);

                const monthly = await reportService.getSupplierMonthlyEarnings(year, page, 6);
                setMonthlyData(monthly.data);
                setTotalPages(monthly.meta.lastPage);
            } catch (err) {
                console.error("Error loading reports:", err);
            } finally {
                setLoading(false);
            }
        };
        loadReports();
    }, [user?.id, year, page]);

    if (loading) return <p>Loading report...</p>;

    return (
        <div className="report-page">
            <div className="report-header">
                <h2>Supplier Earnings Report</h2>
                <div className="report-summary">
                    <div className="summary-card">
                        <h4>Total Earnings</h4>
                        <p>€{(totalReport.totalEarnings ?? 0).toLocaleString()}</p>

                    </div>
                    <div className="summary-card">
                        <h4>Total Orders</h4>
                        <p>{totalReport.totalOrders ?? 0}</p>

                    </div>
                    <div className="summary-card">
                        <h4>Year</h4>
                        <select value={year} onChange={(e) => setYear(Number(e.target.value))}>
                            {[2025, 2024, 2023].map((y) => (
                                <option key={y} value={y}>
                                    {y}
                                </option>
                            ))}
                        </select>
                    </div>
                </div>
            </div>

            <div className="report-chart">
                <h3>Monthly Breakdown ({year})</h3>
                {monthlyData.length === 0 ? (
                    <p>No monthly earnings available</p>
                ) : (
                    <ResponsiveContainer width="100%" height={300}>
                        <BarChart data={monthlyData} margin={{ top: 20, right: 30, left: 0, bottom: 5 }}>
                            <CartesianGrid strokeDasharray="3 3" />
                            <XAxis dataKey="month" />
                            <YAxis />
                            <Tooltip />
                            <Bar dataKey="totalEarnings" fill="#4f46e5" name="Earnings (€)" />
                            <Bar dataKey="totalOrders" fill="#f59e0b" name="Orders" />
                        </BarChart>
                    </ResponsiveContainer>
                )}
            </div>

            {totalPages > 1 && (
                <Pagination currentPage={page} totalPages={totalPages} onPageChange={setPage} />
            )}
        </div>
    );
}
