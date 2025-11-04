// src/modules/home/HomePage.tsx
import { useEffect, useState } from 'react';
import { Link } from 'react-router-dom';
import { productService, type Product } from '../api/productService';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';
import Pagination from '../components/Pagination';

export default function HomePage() {
    const [products, setProducts] = useState<Product[]>([]);
    const [page, setPage] = useState(1);
    const [totalPages, setTotalPages] = useState(1);
    const [loading, setLoading] = useState(true);

    useEffect(() => {
        const fetchProducts = async () => {
            try {
                const res = await productService.getAll({ page, limit: 3 });
                setProducts(res.data);
                setTotalPages(res.meta.lastPage);
            } catch (err) {
                console.error('Failed to load products:', err);
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

            {/* Hero Section */}
            <div className="row head container">
                <div className="col-2">
                    <h1>Welcome to Marco Store</h1>
                    <p>Your one-stop shop for the best quality products.</p>
                    <Link to="/products" className="btn">
                        Shop Now →
                    </Link>
                </div>
                <div className="col-2">
                    <img src="images/logo.png" alt="Banner" />
                </div>
            </div>

            {/* Featured Products */}
            <div className="small-container">
                <h2 className="title">Featured Products</h2>
                <div className="row">
                    {products.map((product) => (
                        <div className="col-4" key={product.id}>
                            <Link to={`/products/${product.id}`}>
                                <img
                                    src={product.image?.imageUrl}
                                    alt={product.name}
                                />
                            </Link>
                            <h4>{product.name}</h4>
                            <p>€{product.finalPrice ?? product.basePrice}</p>
                        </div>
                    ))}
                </div>
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
