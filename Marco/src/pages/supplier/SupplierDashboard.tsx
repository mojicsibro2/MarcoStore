import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { productService, type Product } from "../../api/productService";
import { useSelector } from "react-redux";
import type { RootState } from "../../app/store";

export default function SupplierDashboard() {
    const [products, setProducts] = useState<Product[]>([]);
    const [loading, setLoading] = useState(true);
    const auth = useSelector((state: RootState) => state.auth);

    useEffect(() => {
        const fetchSupplierProducts = async () => {
            try {
                const res = await productService.getSupplierProducts(1, 20);
                setProducts(res.data);
            } catch (error) {
                console.error("Failed to load supplier products:", error);
            } finally {
                setLoading(false);
            }
        };
        fetchSupplierProducts();
    }, []);

    if (loading) return <p>Loading your products...</p>;

    return (
        <div className="add-categories">
            {/* Top profile section */}
            <div className="add-top">
                <div className="profile-image">
                    <img src="/images/logo.png" alt="supplier" />
                </div>
                <div className="username">
                    <p>{auth.user?.name || "Supplier"}</p>
                </div>
            </div>

            {products.length === 0 ? (
                <>
                    <div className="add-illustration">
                        <div className="opa">
                            <img src="/images/logo 1.png" alt="empty" />
                        </div>
                        <div className="t">
                            <h3>You have not added any products yet</h3>
                            <h1>Add your first product</h1>
                        </div>
                    </div>

                    <div className="add-product">
                        <Link to="/supplier/add-product">
                            <p>Add Product</p>
                        </Link>
                    </div>
                </>
            ) : (
                <>
                    <div className="select">
                        {products.map((product) => (
                            <div className="col2" key={product.id}>
                                <Link to={`/supplier/products/${product.id}`}>
                                    <img
                                        src={
                                            product.image?.imageUrl ||
                                            "/images/placeholder.png"
                                        }
                                        alt={product.name}
                                    />
                                </Link>

                                <p
                                    className={
                                        product.status === "ACTIVE" ? "approved" : "pending"
                                    }
                                >
                                    {product.status === "ACTIVE"
                                        ? "Approved"
                                        : "Pending Approval"}
                                </p>

                                <h3>{product.name}</h3>
                                <p>€{product.finalPrice ?? product.basePrice}</p>
                            </div>
                        ))}

                        {/* Add Product Button */}
                        <div className="col2">
                            <div className="add-product">
                                <Link to="/supplier/add-product">
                                    <p>Add Product</p>
                                </Link>
                            </div>
                        </div>
                    </div>
                </>
            )}
        </div>
    );
}
