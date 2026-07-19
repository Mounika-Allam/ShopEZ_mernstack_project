import { Link, useNavigate } from "react-router-dom";
import { useState } from "react";
import { useCart } from "../context/CartContext";
import { useAuth } from "../context/AuthContext";
import { placeOrder } from "../services/api";

const FALLBACK_IMAGE = "https://via.placeholder.com/100x100.png?text=ShopEZ";

const Cart = () => {
  const { cartItems, removeFromCart, updateQuantity, clearCart, totalPrice } = useCart();
  const { user } = useAuth();
  const navigate = useNavigate();

  const [shippingAddress, setShippingAddress] = useState("");
  const [placing, setPlacing] = useState(false);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");

  const handleCheckout = async () => {
    if (!user) {
      navigate("/login", { state: { from: "/cart" } });
      return;
    }
    if (cartItems.length === 0) return;

    setError("");
    setSuccess("");
    try {
      setPlacing(true);
      await placeOrder({
        products: cartItems.map((item) => ({ productId: item._id, quantity: item.quantity })),
        shippingAddress,
      });
      clearCart();
      setSuccess("Order placed successfully! You can view it in your profile.");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to place order");
    } finally {
      setPlacing(false);
    }
  };

  if (cartItems.length === 0 && !success) {
    return (
      <div className="container my-5 text-center">
        <h3>Your cart is empty</h3>
        <p className="text-muted">Browse our products and add something you love!</p>
        <Link to="/products" className="btn btn-shopez">Shop Now</Link>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <h2 className="mb-4">Your Cart</h2>

      {error && <div className="alert alert-danger">{error}</div>}
      {success && (
        <div className="alert alert-success">
          {success} <Link to="/products">Continue shopping</Link>
        </div>
      )}

      {cartItems.length > 0 && (
        <div className="row g-4">
          <div className="col-md-8">
            {cartItems.map((item) => (
              <div className="card mb-3 shadow-sm" key={item._id}>
                <div className="row g-0 align-items-center p-2">
                  <div className="col-3 col-md-2">
                    <img
                      src={item.image || FALLBACK_IMAGE}
                      alt={item.name}
                      className="img-fluid rounded"
                      style={{ maxHeight: "80px", objectFit: "contain" }}
                    />
                  </div>
                  <div className="col-5 col-md-6">
                    <p className="mb-0 fw-semibold">{item.name}</p>
                    <p className="mb-0 text-muted small">${item.price.toFixed(2)} each</p>
                  </div>
                  <div className="col-2 col-md-2">
                    <input
                      type="number"
                      min="1"
                      max={item.stock || 99}
                      className="form-control form-control-sm"
                      value={item.quantity}
                      onChange={(e) => updateQuantity(item._id, Number(e.target.value))}
                    />
                  </div>
                  <div className="col-2 col-md-2 text-end">
                    <p className="mb-1 fw-bold">${(item.price * item.quantity).toFixed(2)}</p>
                    <button
                      className="btn btn-sm btn-outline-danger"
                      onClick={() => removeFromCart(item._id)}
                    >
                      Remove
                    </button>
                  </div>
                </div>
              </div>
            ))}
          </div>

          <div className="col-md-4">
            <div className="card shadow-sm p-3">
              <h5>Order Summary</h5>
              <div className="d-flex justify-content-between mb-2">
                <span>Subtotal</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>
              <div className="d-flex justify-content-between mb-2">
                <span>Shipping</span>
                <span className="text-success">Free</span>
              </div>
              <hr />
              <div className="d-flex justify-content-between fw-bold mb-3">
                <span>Total</span>
                <span>${totalPrice.toFixed(2)}</span>
              </div>

              <label className="form-label">Shipping Address</label>
              <textarea
                className="form-control mb-3"
                rows="2"
                placeholder="Enter your delivery address"
                value={shippingAddress}
                onChange={(e) => setShippingAddress(e.target.value)}
              ></textarea>

              <button className="btn btn-shopez w-100" onClick={handleCheckout} disabled={placing}>
                {placing ? "Placing order..." : "Checkout"}
              </button>
            </div>
          </div>
        </div>
      )}
    </div>
  );
};

export default Cart;
