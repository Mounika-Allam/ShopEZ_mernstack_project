import { useEffect, useState } from "react";
import { useParams, useNavigate, Link } from "react-router-dom";
import { getProductById } from "../services/api";
import { useCart } from "../context/CartContext";

const FALLBACK_IMAGE = "https://via.placeholder.com/500x500.png?text=ShopEZ";

const ProductDetails = () => {
  const { id } = useParams();
  const navigate = useNavigate();
  const { addToCart } = useCart();

  const [product, setProduct] = useState(null);
  const [quantity, setQuantity] = useState(1);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [added, setAdded] = useState(false);

  useEffect(() => {
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await getProductById(id);
        setProduct(data);
      } catch (err) {
        setError(err.response?.data?.message || "Product not found");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id]);

  const handleAddToCart = () => {
    addToCart(product, quantity);
    setAdded(true);
    setTimeout(() => setAdded(false), 2000);
  };

  const handleBuyNow = () => {
    addToCart(product, quantity);
    navigate("/cart");
  };

  if (loading) {
    return (
      <div className="spinner-wrap">
        <div className="spinner-border text-warning" role="status">
          <span className="visually-hidden">Loading...</span>
        </div>
      </div>
    );
  }

  if (error) {
    return (
      <div className="container my-5">
        <div className="alert alert-danger">{error}</div>
        <Link to="/products" className="btn btn-shopez">Back to Products</Link>
      </div>
    );
  }

  return (
    <div className="container my-5">
      <nav aria-label="breadcrumb">
        <ol className="breadcrumb">
          <li className="breadcrumb-item"><Link to="/">Home</Link></li>
          <li className="breadcrumb-item"><Link to="/products">Products</Link></li>
          <li className="breadcrumb-item active">{product.name}</li>
        </ol>
      </nav>

      <div className="row g-5">
        <div className="col-md-5">
          <img
            src={product.image || FALLBACK_IMAGE}
            alt={product.name}
            className="img-fluid rounded shadow-sm bg-white p-3"
          />
        </div>
        <div className="col-md-7">
          <span className="badge bg-secondary mb-2">{product.category}</span>
          <h2>{product.name}</h2>
          <p className="text-muted">{product.description}</p>
          <h3 className="fw-bold my-3">${Number(product.price).toFixed(2)}</h3>

          {product.stock > 0 ? (
            <p className="text-success">In Stock ({product.stock} available)</p>
          ) : (
            <p className="text-danger">Out of Stock</p>
          )}

          {product.stock > 0 && (
            <div className="d-flex align-items-center gap-3 mb-3">
              <label className="fw-semibold mb-0">Quantity:</label>
              <input
                type="number"
                min="1"
                max={product.stock}
                className="form-control"
                style={{ width: "90px" }}
                value={quantity}
                onChange={(e) =>
                  setQuantity(Math.max(1, Math.min(product.stock, Number(e.target.value))))
                }
              />
            </div>
          )}

          <div className="d-flex gap-2">
            <button
              className="btn btn-shopez px-4"
              disabled={product.stock <= 0}
              onClick={handleAddToCart}
            >
              {added ? "Added ✓" : "Add to Cart"}
            </button>
            <button
              className="btn btn-outline-dark px-4"
              disabled={product.stock <= 0}
              onClick={handleBuyNow}
            >
              Buy Now
            </button>
          </div>
        </div>
      </div>
    </div>
  );
};

export default ProductDetails;
