import { Link } from "react-router-dom";
import { useCart } from "../context/CartContext";

const FALLBACK_IMAGE = "https://via.placeholder.com/300x300.png?text=ShopEZ";

const ProductCard = ({ product }) => {
  const { addToCart } = useCart();

  const imageSrc = product.image ? product.image : FALLBACK_IMAGE;

  return (
    <div className="card product-card shadow-sm">
      <Link to={`/products/${product._id}`}>
        <img src={imageSrc} alt={product.name} className="card-img-top" />
      </Link>
      <div className="card-body d-flex flex-column">
        <span className="badge bg-secondary align-self-start mb-2">{product.category}</span>
        <h6 className="card-title">
          <Link to={`/products/${product._id}`} className="text-decoration-none text-dark">
            {product.name}
          </Link>
        </h6>
        <p className="card-text text-muted small flex-grow-1">
          {product.description?.slice(0, 70)}
          {product.description?.length > 70 ? "..." : ""}
        </p>
        <div className="d-flex justify-content-between align-items-center mt-2">
          <span className="fw-bold fs-5">${Number(product.price).toFixed(2)}</span>
          {product.stock > 0 ? (
            <span className="text-success small">In Stock</span>
          ) : (
            <span className="text-danger small">Out of Stock</span>
          )}
        </div>
        <button
          className="btn btn-shopez mt-3"
          disabled={product.stock <= 0}
          onClick={() => addToCart(product, 1)}
        >
          Add to Cart
        </button>
      </div>
    </div>
  );
};

export default ProductCard;
