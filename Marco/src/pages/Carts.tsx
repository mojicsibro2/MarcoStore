/* eslint-disable @typescript-eslint/no-explicit-any */
import { useEffect, useState } from "react";
import { cartService } from "../api/cartService";
import { deliveryService } from "../api/deliveryService";
import { paymentService } from "../api/paymentService";

export default function CartPage() {
    const [carts, setCart] = useState<any | null>(null);
    const [loading, setLoading] = useState(true);
    const [checkingOut, setCheckingOut] = useState(false);
    const [updating, setUpdating] = useState(false);
    const [deliveryModes, setDeliveryModes] = useState<any[]>([]);
    const [selectedDeliveryMode, setSelectedDeliveryMode] = useState("");

    // Load cart data
    const loadCart = async () => {
        try {
            const res = await cartService.getCart();
            setCart((prev: any) => ({ ...prev, ...res }));
        } catch (err) {
            console.error("Failed to load cart:", err);
        } finally {
            setLoading(false);
        }
    };

    // Load available delivery modes
    const loadDeliveryModes = async () => {
        try {
            const data = await deliveryService.getAll(true);
            setDeliveryModes(data || []);
        } catch (err) {
            console.error("Failed to load delivery modes:", err);
        }
    };

    useEffect(() => {
        loadCart();
        loadDeliveryModes();
    }, []);

    // ✅ Remove a single item
    const handleRemoveItem = async (itemId: string) => {
        if (!confirm("Remove this item from your cart?")) return;
        try {
            setUpdating(true);
            const res = await cartService.removeItem(itemId);
            setCart((prev: any) => ({ ...prev, ...res }));
        } catch (err) {
            console.error("Failed to remove item:", err);
            alert("❌ Failed to remove item.");
        } finally {
            setUpdating(false);
        }
    };

    // ✅ Clear the entire cart
    const handleClearCart = async () => {
        if (!confirm("Are you sure you want to clear your cart?")) return;
        try {
            setUpdating(true);
            await cartService.clearCart();
            setCart(null);
        } catch (err) {
            console.error("Failed to clear cart:", err);
            alert("❌ Failed to clear cart.");
        } finally {
            setUpdating(false);
        }
    };

    // ✅ Optional: Update quantity (+/-)
    const handleQuantityChange = async (itemId: string, quantity: number) => {
        if (quantity <= 0) return handleRemoveItem(itemId);
        try {
            setUpdating(true);
            const res = await cartService.updateItem(itemId, quantity);
            setCart((prev: any) => ({ ...prev, ...res }));
        } catch (err) {
            console.error("Failed to update quantity:", err);
            alert("❌ Failed to update quantity.");
        } finally {
            setUpdating(false);
        }
    };

    // ✅ Checkout
    const handleCheckout = async () => {
        if (!carts || !selectedDeliveryMode) {
            alert("Please select a delivery mode before checkout.");
            return;
        }

        try {
            setCheckingOut(true);
            const payment = await paymentService.simulatePayment(selectedDeliveryMode);
            alert(`✅ Checkout successful!\nOrder ID: ${payment.orderId}\nAmount: €${payment.amount}`);
            setCart(null);
        } catch (err) {
            console.error("Checkout failed:", err);
            alert("❌ Checkout failed. Please try again.");
        } finally {
            setCheckingOut(false);
        }
    };

    if (loading) return <p>Loading...</p>;
    if (!carts || !carts.data?.length) return <p>Your cart is empty.</p>;

    return (
        <div className="small-container cart-page">
            <h2>Your Shopping Cart</h2>

            <table>
                <thead>
                    <tr>
                        <th style={{ textAlign: "left" }}>Product</th>
                        <th>Quantity</th>
                        <th>Subtotal</th>
                        <th>Action</th>
                    </tr>
                </thead>
                <tbody>
                    {carts.data.map((item: any) => (
                        <tr key={item.id}>
                            <td>{item.product.name}</td>
                            <td>
                                <button
                                    onClick={() =>
                                        handleQuantityChange(item.id, Number(item.quantity) - 1)
                                    }
                                    disabled={updating}
                                >
                                    −
                                </button>
                                <span style={{ margin: "0 10px" }}>{item.quantity}</span>
                                <button
                                    onClick={() =>
                                        handleQuantityChange(item.id, Number(item.quantity) + 1)
                                    }
                                    disabled={updating}
                                >
                                    +
                                </button>
                            </td>
                            <td>€{parseFloat(item.subtotal).toFixed(2)}</td>
                            <td>
                                <button
                                    onClick={() => handleRemoveItem(item.id)}
                                    disabled={updating}
                                    style={{
                                        background: "red",
                                        color: "white",
                                        border: "none",
                                        padding: "5px 10px",
                                        borderRadius: "4px",
                                        cursor: "pointer",
                                    }}
                                >
                                    Remove
                                </button>
                            </td>
                        </tr>
                    ))}
                </tbody>
            </table>

            {/* Total Summary */}
            <div
                style={{
                    textAlign: "right",
                    marginTop: "20px",
                    fontSize: "1.1rem",
                    fontWeight: "bold",
                }}
            >
                Total: €{parseFloat(carts.totalPrice).toFixed(2)}
            </div>

            {/* Delivery Mode Selector */}
            <div style={{ textAlign: "right", marginTop: "20px" }}>
                <label htmlFor="deliveryMode" style={{ marginRight: "10px" }}>
                    Choose Delivery Mode:
                </label>
                <select
                    id="deliveryMode"
                    value={selectedDeliveryMode}
                    onChange={(e) => setSelectedDeliveryMode(e.target.value)}
                >
                    <option value="">-- Select Delivery Mode --</option>
                    {deliveryModes.map((mode) => (
                        <option key={mode.id} value={mode.id}>
                            {mode.name} (€{parseFloat(mode.fee).toFixed(2)})
                        </option>
                    ))}
                </select>
            </div>

            {/* Action Buttons */}
            <div style={{ textAlign: "right", marginTop: "20px" }}>
                <button
                    onClick={handleClearCart}
                    disabled={updating || checkingOut}
                    style={{
                        background: "gray",
                        color: "white",
                        border: "none",
                        padding: "10px 15px",
                        marginRight: "10px",
                        borderRadius: "4px",
                        cursor: "pointer",
                    }}
                >
                    Clear Cart
                </button>

                <button
                    className="btn"
                    onClick={handleCheckout}
                    disabled={checkingOut || updating}
                >
                    {checkingOut ? "Processing..." : "Checkout"}
                </button>
            </div>
        </div>
    );
}
