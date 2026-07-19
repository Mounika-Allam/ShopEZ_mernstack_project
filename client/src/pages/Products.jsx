import { useEffect, useState } from "react";
import { getProducts } from "../services/api";
import ProductCard from "../components/ProductCard";

const Products = () => {
  const [products, setProducts] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [search, setSearch] = useState("");
  const [category, setCategory] = useState("all");
  const [categories, setCategories] = useState([]);

  const fetchProducts = async (params = {}) => {
    try {
      setLoading(true);
      setError("");
      const { data } = await getProducts(params);
      setProducts(data);
      if (!params.search && !params.category) {
        setCategories([...new Set(data.map((p) => p.category))]);
      }
    } catch (err) {
      setError(err.response?.data?.message || "Failed to load products");
    } finally {
      setLoading(false);
    }
  };

  useEffect(() => {
    fetchProducts();
  }, []);

  const handleSearch = (e) => {
    e.preventDefault();
    fetchProducts({ search, category: category !== "all" ? category : undefined });
  };

  const handleCategoryChange = (e) => {
    const value = e.target.value;
    setCategory(value);
    fetchProducts({ search: search || undefined, category: value !== "all" ? value : undefined });
  };

  return (
    <div className="container my-5">
      <h2 className="mb-4">All Products</h2>

      <form className="row g-2 mb-4" onSubmit={handleSearch}>
        <div className="col-md-6">
          <input
            type="text"
            className="form-control"
            placeholder="Search products by name..."
            value={search}
            onChange={(e) => setSearch(e.target.value)}
          />
        </div>
        <div className="col-md-3">
          <select className="form-select" value={category} onChange={handleCategoryChange}>
            <option value="all">All Categories</option>
            {categories.map((cat) => (
              <option key={cat} value={cat}>{cat}</option>
            ))}
          </select>
        </div>
        <div className="col-md-3">
          <button type="submit" className="btn btn-shopez w-100">Search</button>
        </div>
      </form>

      {loading && (
        <div className="spinner-wrap">
          <div className="spinner-border text-warning" role="status">
            <span className="visually-hidden">Loading...</span>
          </div>
        </div>
      )}

      {error && <div className="alert alert-danger">{error}</div>}

      {!loading && !error && products.length === 0 && (
        <div className="alert alert-info">No products found matching your criteria.</div>
      )}

      <div className="row g-4">
        {products.map((product) => (
          <div className="col-6 col-md-4 col-lg-3" key={product._id}>
            <ProductCard product={product} />
          </div>
        ))}
      </div>
    </div>
  );
};

export default Products;
