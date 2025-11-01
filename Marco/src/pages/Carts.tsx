import { useEffect, useState } from 'react';
import { cartService, type PaginatedCartResponse } from '../api/cartService';

export default function CartPage() {
    const [cart, setCart] = useState<PaginatedCartResponse | null>(null);
    const [page, setPage] = useState(1);
    const pageSize = 5;

    const loadCart = async (pageNum: number) => {
        const data = await cartService.getCart(pageNum, pageSize);
        setCart(data);
    };

    useEffect(() => {
        loadCart(page);
    }, [page]);

    if (!cart) return <p>Loading...</p>;

    return (
        <div className="small-container cart-page">
            <table>
                <thead>
                    <tr>
                        <th>Product</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                    </tr>
                </thead>
                <tbody>
                    {cart.data.map((item) => (
                        <tr key={item.product.id}>
                            <td>{item.product.name}</td>
                            <td>{item.quantity}</td>
                            <td>${item.totalPrice}</td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Pagination Controls */}
            <div className="page-btn">
                {Array.from({ length: cart.totalPages }, (_, i) => i + 1).map((num) => (
                    <span
                        key={num}
                        onClick={() => setPage(num)}
                        className={page === num ? 'active' : ''}
                    >
                        {num}
                    </span>
                ))}
            </div>
        </div>
    );
}
