import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector } from 'react-redux';
import { productService, type Product } from '../api/productService';
import type { RootState } from '../app/store';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ProductDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const auth = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();

    useEffect(() => {
        const fetchProduct = async () => {
            try {
                if (id) {
                    const res = await productService.getById(id);
                    setProduct(res);
                }
            } catch (err) {
                console.error('Failed to load product:', err);
            } finally {
                setLoading(false);
            }
        };
        fetchProduct();
    }, [id]);

    const handleCartAction = () => {
        if (!auth.token) {
            navigate('/login');
        } else {
            // TODO: integrate addToCart backend
            console.log(`Add ${product?.name} to cart`);
        }
    };

    if (loading) return <p>Loading product details...</p>;
    if (!product) return <p>Product not found.</p>;

    return (
        <div>
            {/* Navbar */}
            <Navbar />

            {/* Product Details Section */}
            <div className="small-container single-product">
                <div className="row">
                    <div className="col-2">
                        <img
                            src={product['image'] || '/images/placeholder.png'}
                            width="100%"
                            id="ProductImg"
                            alt={product.name}
                        />
                    </div>
                    <div className="col-2">
                        <p>
                            <Link to="/products">Home</Link> / {product.category?.name}
                        </p>
                        <h1>{product.name}</h1>
                        <h4>${product.finalPrice ?? product.basePrice}</h4>
                        <select>
                            <option>Select Size</option>
                            <option>XXL</option>
                            <option>XL</option>
                            <option>Large</option>
                            <option>Medium</option>
                            <option>Small</option>
                        </select>
                        <input type="number" defaultValue={1} />

                        {auth.token ? (
                            <button className="btn" onClick={handleCartAction}>
                                Add to Cart
                            </button>
                        ) : (
                            <button className="btn" onClick={() => navigate('/login')}>
                                Login to Add to Cart
                            </button>
                        )}

                        <h3>
                            Product Details <i className="fa fa-indent"></i>
                        </h3>
                        <br />
                        <p>{product.description || 'No description available.'}</p>
                        {product.supplier && (
                            <p>
                                <strong>Supplier:</strong> {product.supplier.name}
                            </p>
                        )}
                    </div>
                </div>
            </div>

            {/* Footer */}
            <Footer />
        </div>
    );
}
