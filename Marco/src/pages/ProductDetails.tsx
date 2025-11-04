import { useEffect, useState } from 'react';
import { useParams, Link, useNavigate } from 'react-router-dom';
import { useSelector, useDispatch } from 'react-redux';
import { productService, type Product } from '../api/productService';
import { cartService, type PaginatedCartResponse } from '../api/cartService';
import { setCart } from '../cart/cartSlice';
import type { RootState } from '../app/store';
import Navbar from '../components/Navbar';
import Footer from '../components/Footer';

export default function ProductDetailsPage() {
    const { id } = useParams<{ id: string }>();
    const [product, setProduct] = useState<Product | null>(null);
    const [loading, setLoading] = useState(true);
    const [quantity, setQuantity] = useState(1);
    const [adding, setAdding] = useState(false);

    const auth = useSelector((state: RootState) => state.auth);
    const navigate = useNavigate();
    const dispatch = useDispatch();

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

    const handleCartAction = async () => {
        if (!auth.token) {
            navigate('/account');
            return;
        }

        if (!product) return;

        try {
            setAdding(true);
            const updatedCart: PaginatedCartResponse = await cartService.addItem(product.id, quantity);
            dispatch(setCart(updatedCart));
            alert(`${product.name} added to cart successfully!`);
        } catch (err) {
            console.error('Failed to add to cart:', err);
            alert('Failed to add item to cart. Please try again.');
        } finally {
            setAdding(false);
        }
    };

    if (loading) return <p>Loading product details...</p>;
    if (!product) return <p>Product not found.</p>;

    return (
        <div>
            <Navbar />

            <div className="small-container single-product">
                <div className="row">
                    <div className="col-2">
                        <img
                            src={product.image?.imageUrl || '/images/wristwatch.jpeg'}
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
                        <h4>€{product.finalPrice ?? product.basePrice}</h4>

                        <select>
                            <option>Select Size</option>
                            <option>XXL</option>
                            <option>XL</option>
                            <option>Large</option>
                            <option>Medium</option>
                            <option>Small</option>
                        </select>

                        {/* Quantity input */}
                        <input
                            type="number"
                            min={1}
                            value={quantity}
                            onChange={(e) => setQuantity(parseInt(e.target.value) || 1)}
                        />

                        <button
                            className="btn"
                            onClick={handleCartAction}
                            disabled={adding}
                        >
                            {adding ? 'Adding...' : 'Add to Cart'}
                        </button>

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

            <Footer />
        </div>
    );
}
