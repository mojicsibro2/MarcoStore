import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService, type Product } from '../../api/productService';
import Pagination from '../../components/Pagination';

export default function SupplierProductsPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchSupplierProducts = async () => {
            try {
                setLoading(true);
                const res = await productService.getSupplierProducts(page, 8);
                setProducts(res.data);
                setTotalPages(res.meta.lastPage);
            } catch (err) {
                console.error('Error loading supplier products:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchSupplierProducts();
    }, [page]);

    if (loading) return <p>Loading products...</p>;

    return (
        <div className="select-categories">
            <div className="coltop">
                <h6>My Products</h6>
            </div>

            {products.length === 0 ? (
                <div className="add-illustration">
                    <div className="opa">
                        <img src="/images/logo 1.png" alt="no products" />
                    </div>
                    <div className="t">
                        <h3>No products listed yet</h3>
                        <h1>Add your first product</h1>
                    </div>
                    <div className="add-product">
                        <Link to="/supplier/add-product">
                            <p>Add Product</p>
                        </Link>
                    </div>
                </div>
            ) : (
                <>
                    <div className="select">
                        {products.map((product) => (
                            <div className="col2" key={product.id}>
                                <Link to={`/supplier/products/${product.id}`}>
                                    <img
                                        src={product.image?.imageUrl || '/images/placeholder.png'}
                                        alt={product.name}
                                    />
                                </Link>

                                <p
                                    className={
                                        product.status === 'ACTIVE' ? 'approved' : 'pending'
                                    }
                                >
                                    {product.status === 'ACTIVE'
                                        ? 'Approved'
                                        : 'Pending Approval'}
                                </p>

                                <h3>{product.name}</h3>
                                <p>€{product.finalPrice ?? product.basePrice}</p>
                            </div>
                        ))}

                        {/* Add Product Card */}
                        <div className="col2">
                            <div className="add-product">
                                <Link to="/supplier/products/add">
                                    <p>Add Product</p>
                                </Link>
                            </div>
                        </div>
                    </div>

                    <Pagination
                        currentPage={page}
                        totalPages={totalPages}
                        onPageChange={setPage}
                    />
                </>
            )}
        </div>
    );
}
