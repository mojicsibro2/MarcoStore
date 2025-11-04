import { useCallback, useEffect, useState } from "react";
import { productService, type ProductStatus } from "../../api/productService";
import Pagination from "../../components/Pagination";

interface Product {
  id: string;
  name: string;
  description?: string;
  basePrice: number;
  finalPrice: number;
  stock: number;
  status: ProductStatus;
  supplier?: {
    id: string;
    name: string;
  };
  category?: {
    id: string;
    name: string;
  };
  createdAt: string;
}

export default function AdminProductsPage() {
  const [products, setProducts] = useState<Product[]>([]);
  const [statusFilter, setStatusFilter] = useState<string>(""); // always "" if not selected
  const [loading, setLoading] = useState(true);
  const [percentage, setPercentage] = useState<Record<string, string>>({});
  const [page, setPage] = useState(1);
  const [totalPages, setTotalPages] = useState(1);
  const [meta, setMeta] = useState<{ total?: number; lastPage?: number }>({});

  // ✅ Fetch products (memoized)
  const fetchProducts = useCallback(
    async (status: string = "", pageNumber = page) => {
      setLoading(true);
      try {
        const res = await productService.adminGetAll({ page: pageNumber, limit: 5, status: status as ProductStatus });
        setProducts(res.data || []);
        setMeta(res.meta || {});
        setTotalPages(res.meta.lastPage || 1);
      } catch (error) {
        console.error("Error fetching products:", error);
        alert("Failed to load products.");
      } finally {
        setLoading(false);
      }
    },
    [page]
  );

  // ✅ Refetch when `page` or `statusFilter` changes
  useEffect(() => {
    fetchProducts(statusFilter, page);
  }, [fetchProducts, statusFilter, page]);

  // ✅ Handle filter change (reset page)
  const handleFilterChange = (e: React.ChangeEvent<HTMLSelectElement>) => {
    const newStatus = e.target.value;
    setStatusFilter(newStatus);
    setPage(1); // reset page to first
  };

  // ✅ Handle pagination click
  const handlePageChange = (newPage: number) => {
    setPage(newPage);
  };

  // ✅ Handle approval with profit %
  const handleApprove = async (id: string) => {
    const value = percentage[id];
    if (!value || Number(value) <= 0) {
      alert("Please enter a valid profit percentage before approving.");
      return;
    }

    if (!confirm(`Approve this product with ${value}% profit?`)) return;

    try {
      await productService.approve(id, Number(value));
      alert("Product approved successfully!");
      fetchProducts(statusFilter, page);
    } catch (error) {
      console.error(error);
      alert("Failed to approve product.");
    }
  };

  // ✅ Handle deactivation
  const handleDeactivate = async (id: string) => {
    if (!confirm("Are you sure you want to deactivate this product?")) return;

    try {
      await productService.deapprove(id);
      alert("Product deactivated successfully!");
      fetchProducts(statusFilter, page);
    } catch (error) {
      console.error(error);
      alert("Failed to deactivate product.");
    }
  };

  if (loading) return <p className="loading-text">Loading products...</p>;

  return (
    <div className="admin-products">
      <h2>🛍️ Manage Products</h2>

      {/* ✅ Filter Bar */}
      <div className="filter-bar">
        <label>Status Filter:</label>
        <select value={statusFilter} onChange={handleFilterChange}>
          <option value="">All</option>
          <option value="PENDING">Pending</option>
          <option value="ACTIVE">Active</option>
          <option value="INACTIVE">Inactive</option>
        </select>
      </div>

      {products.length === 0 ? (
        <p className="no-products">No products found.</p>
      ) : (
        <>
          <table className="products-table">
            <thead>
              <tr>
                <th>Name</th>
                <th>Supplier</th>
                <th>Category</th>
                <th>Base Price</th>
                <th>Final Price</th>
                <th>Status</th>
                <th>Stock</th>
                <th>Created</th>
                <th>Action</th>
              </tr>
            </thead>
            <tbody>
              {products.map((p) => (
                <tr key={p.id}>
                  <td>{p.name}</td>
                  <td>{p.supplier?.name || "Unknown"}</td>
                  <td>{p.category?.name || "Uncategorized"}</td>
                  <td>€{p.basePrice ?? 0}</td>
                  <td>€{p.finalPrice ?? 0}</td>
                  <td>
                    <span className={`status ${p.status.toLowerCase()}`}>
                      {p.status}
                    </span>
                  </td>
                  <td>{p.stock}</td>
                  <td>{new Date(p.createdAt).toLocaleDateString()}</td>
                  <td>
                    {p.status === "PENDING" || p.status === "INACTIVE" ? (
                      <div className="approve-box">
                        <input
                          type="number"
                          placeholder="% profit"
                          value={percentage[p.id] || ""}
                          onChange={(e) =>
                            setPercentage({
                              ...percentage,
                              [p.id]: e.target.value,
                            })
                          }
                        />
                        <button
                          className="btn-approve"
                          onClick={() => handleApprove(p.id)}
                        >
                          Approve
                        </button>
                      </div>
                    ) : (
                      <button
                        className="btn-deactivate"
                        onClick={() => handleDeactivate(p.id)}
                      >
                        Deactivate
                      </button>
                    )}
                  </td>
                </tr>
              ))}
            </tbody>
          </table>

          {/* ✅ Pagination (only shows when multiple pages exist) */}
          {meta.lastPage && meta.lastPage > 1 && (
            <Pagination
              currentPage={page}
              totalPages={totalPages}
              onPageChange={handlePageChange}
            />
          )}
        </>
      )}
    </div>
  );
}
