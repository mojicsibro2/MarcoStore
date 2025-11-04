/* eslint-disable @typescript-eslint/no-explicit-any */
/* AdminReportsPage.tsx */
import { useCallback, useEffect, useState } from "react";
import Pagination from "../../components/Pagination";
import { reportService } from "../../api/reportService";

type TopProduct = {
  id: string;
  name: string;
  totalSold: number;
  totalRevenue: number;
};

type BestSupplier = {
  id: string;
  name: string;
  totalRevenue: number;
  totalProfit: number;
};

export default function AdminReportsPage() {
  const [overview, setOverview] = useState<{
    totalUsers: number;
    pendingUsers: number;
    totalProducts: number;
    pendingProducts: number;
    totalOrders: number;
    deliveredOrders: number;
  } | null>(null);

  const [totals, setTotals] = useState<{ totalRevenue: number; totalProfit: number } | null>(null);

  const [monthly, setMonthly] = useState<any | null>(null); // MonthlyReport shape from backend
  const [monthlyPage, setMonthlyPage] = useState<number>(1);

  const [topProducts, setTopProducts] = useState<TopProduct[]>([]);
  const [topProductsMeta, setTopProductsMeta] = useState<{ total?: number; lastPage?: number; currentPage?: number }>({});

  const [bestSuppliers, setBestSuppliers] = useState<BestSupplier[]>([]);
  const [bestSuppliersMeta, setBestSuppliersMeta] = useState<{ total?: number; lastPage?: number; currentPage?: number }>({});

  const [loading, setLoading] = useState<boolean>(true);
  const [year, setYear] = useState<number>(new Date().getFullYear());
  const [month, setMonth] = useState<number>(new Date().getMonth() + 1);

  // page used for topProducts & bestSuppliers (shared)
  const [page, setPage] = useState<number>(1);
  const pageSize = 5;

  // Helper to normalize responses (handles both res.data and res.data.data shapes)
  const normalizePaginated = (resp: any) => {
    if (!resp) return { data: [], meta: {} };
    // if resp has data property and meta -> use that; else assume resp is already {data,meta}
    if (resp.data && resp.meta) return { data: resp.data, meta: resp.meta };
    if (resp.data && resp.data.data && resp.data.meta) return { data: resp.data.data, meta: resp.data.meta };
    // fallback: maybe resp is { data: [...] } or just [...]
    if (Array.isArray(resp)) return { data: resp, meta: {} };
    if (resp.data && Array.isArray(resp.data)) return { data: resp.data, meta: resp.meta || {} };
    return { data: [], meta: {} };
  };

  const loadOverview = useCallback(async () => {
    try {
      const res = await reportService.getOverview();
      // service returns res.data.data according to your service file; be defensive
      setOverview(res ?? null);
    } catch (err) {
      console.error("Failed to load overview", err);
      setOverview(null);
    }
  }, []);

  const loadTotals = useCallback(async () => {
    try {
      const res = await reportService.getTotal();
      // your reportService.getTotal returns res.data — sometimes nested; normalize
      const payload = res;
      setTotals(payload ?? null);
    } catch (err) {
      console.error("Failed to load totals", err);
      setTotals(null);
    }
  }, []);

  const loadMonthly = useCallback(
    async (y = year, m = month, pageNumber = monthlyPage) => {
      try {
        const res = await reportService.getMonthly(y, m, pageNumber);
        // res may be { data: { ... } } or direct object
        const payload = res?.data ?? res;
        setMonthly(payload ?? null);
      } catch (err) {
        console.error("Failed to load monthly report", err);
        setMonthly(null);
      }
    },
    [year, month, monthlyPage]
  );

  const loadTopProducts = useCallback(
    async (pageNumber = page) => {
      try {
        const resp = await reportService.getTopProducts(pageNumber, pageSize);
        const { data, meta } = normalizePaginated(resp);
        setTopProducts(data ?? []);
        setTopProductsMeta(meta ?? {});
      } catch (err) {
        console.error("Failed to load top products", err);
        setTopProducts([]);
        setTopProductsMeta({});
      }
    },
    [page]
  );

  const loadBestSuppliers = useCallback(
    async (pageNumber = page) => {
      try {
        const resp = await reportService.getBestSuppliers(pageNumber, pageSize);
        const { data, meta } = normalizePaginated(resp);
        setBestSuppliers(data ?? []);
        setBestSuppliersMeta(meta ?? {});
      } catch (err) {
        console.error("Failed to load best suppliers", err);
        setBestSuppliers([]);
        setBestSuppliersMeta({});
      }
    },
    [page]
  );

  const loadAll = useCallback(async () => {
    setLoading(true);
    try {
      await Promise.all([loadOverview(), loadTotals(), loadMonthly(year, month, monthlyPage), loadTopProducts(page), loadBestSuppliers(page)]);
    } finally {
      setLoading(false);
    }
  }, [loadOverview, loadTotals, loadMonthly, loadTopProducts, loadBestSuppliers, year, month, page, monthlyPage]);

  useEffect(() => {
    loadAll();
  }, [loadAll]);

  // handlers
  const handleRefresh = () => {
    loadAll();
  };

  const handleMonthlyPageChange = (newPage: number) => {
    setMonthlyPage(newPage);
    loadMonthly(year, month, newPage);
  };

  const handleListPageChange = (newPage: number) => {
    setPage(newPage);
    loadTopProducts(newPage);
    loadBestSuppliers(newPage);
  };

  if (loading) return <p className="loading-text">Loading reports...</p>;

  return (
    <div className="admin-reports-container">
      <h2>📊 Admin Reports Dashboard</h2>

      {/* Overview counts */}
      {overview && (
        <div className="summary-cards-overview" style={{ display: "flex", gap: 16, marginBottom: 20 }}>
          <div className="card">
            <h4>Total Users</h4>
            <p>{overview.totalUsers}</p>
          </div>
          <div className="card">
            <h4>Pending Users</h4>
            <p>{overview.pendingUsers}</p>
          </div>
          <div className="card">
            <h4>Total Products</h4>
            <p>{overview.totalProducts}</p>
          </div>
          <div className="card">
            <h4>Pending Products</h4>
            <p>{overview.pendingProducts}</p>
          </div>
          <div className="card">
            <h4>Total Orders</h4>
            <p>{overview.totalOrders}</p>
          </div>
          <div className="card">
            <h4>Delivered Orders</h4>
            <p>{overview.deliveredOrders}</p>
          </div>
        </div>
      )}

      {/* Totals */}
      {totals && (
        <div className="summary-cards" style={{ display: "flex", gap: 16, marginBottom: 20 }}>
          <div className="card revenue">
            <h3>Total Revenue</h3>
            <p>€{totals.totalRevenue.toLocaleString()}</p>
          </div>
          <div className="card profit">
            <h3>Total Profit</h3>
            <p>€{totals.totalProfit.toLocaleString()}</p>
          </div>
        </div>
      )}

      {/* Month/Year selector */}
      <div className="filters" style={{ display: "flex", gap: 8, alignItems: "center", marginBottom: 12 }}>
        <label>
          Year:
          <input type="number" value={year} onChange={(e) => setYear(Number(e.target.value))} style={{ marginLeft: 6 }} />
        </label>
        <label>
          Month:
          <input type="number" min={1} max={12} value={month} onChange={(e) => setMonth(Number(e.target.value))} style={{ marginLeft: 6, width: 80 }} />
        </label>
        <button className="btn-refresh" onClick={handleRefresh}>
          Refresh
        </button>
      </div>

      {/* Monthly */}
      {monthly && (
        <div className="report-section" style={{ marginBottom: 20 }}>
          <h3>📅 Monthly Report — {monthly.month}/{monthly.year}</h3>
          <p>Revenue: €{Number(monthly.monthlyRevenue).toLocaleString()}</p>
          <p>Profit: €{Number(monthly.monthlyProfit).toLocaleString()}</p>

          {monthly.meta && monthly.meta.lastPage > 1 && (
            <Pagination currentPage={monthly.meta.currentPage || 1} totalPages={monthly.meta.lastPage} onPageChange={handleMonthlyPageChange} />
          )}
        </div>
      )}

      {/* Top products */}
      <div className="report-section" style={{ marginBottom: 20 }}>
        <h3>🔥 Top Selling Products</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>#</th>
              <th style={{ textAlign: "left" }}>Product</th>
              <th style={{ textAlign: "right" }}>Total Sold</th>
              <th style={{ textAlign: "right" }}>Total Revenue</th>
            </tr>
          </thead>
          <tbody>
            {topProducts.length > 0 ? (
              topProducts.map((p, i) => (
                <tr key={p.id}>
                  <td>{(topProductsMeta.currentPage ? (topProductsMeta.currentPage - 1) * pageSize : 0) + (i + 1)}</td>
                  <td>{p.name}</td>
                  <td style={{ textAlign: "right" }}>{p.totalSold}</td>
                  <td style={{ textAlign: "right" }}>€{Number(p.totalRevenue).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>No data available</td>
              </tr>
            )}
          </tbody>
        </table>

        {topProductsMeta.lastPage && topProductsMeta.lastPage > 1 && (
          <Pagination currentPage={topProductsMeta.currentPage || 1} totalPages={topProductsMeta.lastPage} onPageChange={handleListPageChange} />
        )}
      </div>

      {/* Best suppliers */}
      <div className="report-section">
        <h3>🏆 Best Suppliers</h3>
        <table style={{ width: "100%", borderCollapse: "collapse" }}>
          <thead>
            <tr>
              <th style={{ textAlign: "left" }}>#</th>
              <th style={{ textAlign: "left" }}>Supplier</th>
              <th style={{ textAlign: "right" }}>Total Revenue</th>
              <th style={{ textAlign: "right" }}>Total Profit</th>
            </tr>
          </thead>
          <tbody>
            {bestSuppliers.length > 0 ? (
              bestSuppliers.map((s, i) => (
                <tr key={s.id}>
                  <td>{(bestSuppliersMeta.currentPage ? (bestSuppliersMeta.currentPage - 1) * pageSize : 0) + (i + 1)}</td>
                  <td>{s.name}</td>
                  <td style={{ textAlign: "right" }}>€{Number(s.totalRevenue).toLocaleString()}</td>
                  <td style={{ textAlign: "right" }}>€{Number(s.totalProfit).toLocaleString()}</td>
                </tr>
              ))
            ) : (
              <tr>
                <td colSpan={4}>No data available</td>
              </tr>
            )}
          </tbody>
        </table>

        {bestSuppliersMeta.lastPage && bestSuppliersMeta.lastPage > 1 && (
          <Pagination currentPage={bestSuppliersMeta.currentPage || 1} totalPages={bestSuppliersMeta.lastPage} onPageChange={handleListPageChange} />
        )}
      </div>
    </div>
  );
}
