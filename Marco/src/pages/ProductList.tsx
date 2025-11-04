import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService, type Product } from '../api/productService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Pagination from '../components/Pagination';

export default function ProductListPage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await productService.getAll({ page, limit: 4 });
                setProducts(res.data);
                setTotalPages(res.meta.lastPage);
            } catch (err) {
                console.error('Error loading products:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProducts();
    }, [page]);

    if (loading) return <p>Loading products...</p>;

    return (
        <div>
            {/* Navbar */}
            <Navbar />

            {/* All Products Section */}
            <div className="small-container">
                <div className="row row-2">
                    <h2>All Products</h2>
                </div>

                <div className="row">
                    {products.map((product) => (
                        <div className="col-4" key={product.id}>
                            <Link to={`/products/${product.id}`}>
                                <img
                                    src={product.image?.imageUrl || '/images/wristwatch.jpeg'}
                                    alt={product.name}
                                />
                            </Link>
                            <h4>{product.name}</h4>
                            <p>€{product.finalPrice ?? product.basePrice}</p>
                        </div>
                    ))}
                </div>

                {/* Pagination */}
                {/* <div className="page-btn">
                    {[...Array(totalPages)].map((_, index) => (
                        <span
                            key={index}
                            onClick={() => setPage(index + 1)}
                            style={{
                                background: page === index + 1 ? '#ff523b' : '',
                                color: page === index + 1 ? '#fff' : '',
                                cursor: 'pointer',
                            }}
                        >
                            {index + 1}
                        </span>
                    ))}
                </div> */}
                <Pagination
                    currentPage={page}
                    totalPages={totalPages}
                    onPageChange={(p) => setPage(p)}
                />
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}
