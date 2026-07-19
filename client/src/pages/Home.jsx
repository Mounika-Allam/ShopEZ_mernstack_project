import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts } from "../services/api";
import ProductCard from "../components/ProductCard";

const Home = () => {
  const [featured, setFeatured] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchFeatured = async () => {
      try {
        setLoading(true);
        const { data } = await getProducts();
        setFeatured(data.slice(0, 8));
      } catch (err) {
        setError("Unable to load featured products right now.");
      } finally {
        setLoading(false);
      }
    };
    fetchFeatured();
  }, []);

  return (
    <div>
      <section className="hero-section text-center">
        <div className="container">
          <h1 className="display-5 fw-bold">Welcome to ShopEZ</h1>
          <p className="lead mb-4">
            Everything you need, delivered easy. Discover great deals on quality products.
          </p>
          <Link to="/products" className="btn btn-shopez btn-lg">
            Shop Now
          </Link>
        </div>
      </section>

      <section className="container my-5">
        <div className="d-flex justify-content-between align-items-center mb-4">
          <h3 className="mb-0">Featured Products</h3>
          <Link to="/products" className="text-decoration-none">View all &rarr;</Link>
        </div>

        {loading && (
          <div className="spinner-wrap">
            <div className="spinner-border text-warning" role="status">
              <span className="visually-hidden">Loading...</span>
            </div>
          </div>
        )}

        {error && <div className="alert alert-danger">{error}</div>}

        {!loading && !error && featured.length === 0 && (
          <div className="alert alert-info">
            No products available yet. Check back soon, or log in as an admin to add some!
          </div>
        )}

        <div className="row g-4">
          {featured.map((product) => (
            <div className="col-6 col-md-4 col-lg-3" key={product._id}>
              <ProductCard product={product} />
            </div>
          ))}
        </div>
      </section>

      <section className="container my-5">
        <div className="row text-center g-4">
          <div className="col-md-4">
            <div className="p-4 bg-white rounded shadow-sm h-100">
              <h5>🚚 Fast Delivery</h5>
              <p className="text-muted mb-0">Get your orders delivered quickly and reliably.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-4 bg-white rounded shadow-sm h-100">
              <h5>🔒 Secure Payments</h5>
              <p className="text-muted mb-0">Your transactions and data are always protected.</p>
            </div>
          </div>
          <div className="col-md-4">
            <div className="p-4 bg-white rounded shadow-sm h-100">
              <h5>↩️ Easy Returns</h5>
              <p className="text-muted mb-0">Not satisfied? Return it hassle-free.</p>
            </div>
          </div>
        </div>
      </section>
    </div>
  );
};

export default Home;
