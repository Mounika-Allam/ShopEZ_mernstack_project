import { useState, useEffect } from "react";
import { useNavigate, useParams } from "react-router-dom";
import { addProduct, updateProduct, getProductById } from "../services/api";

const CATEGORY_OPTIONS = ["Electronics", "Fashion", "Home & Kitchen", "Books", "Toys", "Sports", "Beauty", "Other"];

const AddProduct = () => {
  const navigate = useNavigate();
  const { id } = useParams();
  const isEditMode = Boolean(id);

  const [formData, setFormData] = useState({
    name: "",
    description: "",
    price: "",
    category: CATEGORY_OPTIONS[0],
    stock: "",
  });
  const [imageFile, setImageFile] = useState(null);
  const [existingImage, setExistingImage] = useState("");
  const [loading, setLoading] = useState(isEditMode);
  const [submitting, setSubmitting] = useState(false);
  const [error, setError] = useState("");

  useEffect(() => {
    if (!isEditMode) return;
    const fetchProduct = async () => {
      try {
        setLoading(true);
        const { data } = await getProductById(id);
        setFormData({
          name: data.name,
          description: data.description,
          price: data.price,
          category: data.category,
          stock: data.stock,
        });
        setExistingImage(data.image);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load product");
      } finally {
        setLoading(false);
      }
    };
    fetchProduct();
  }, [id, isEditMode]);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");

    if (!formData.name || !formData.description || !formData.price || !formData.category) {
      setError("Please fill in all required fields");
      return;
    }

    const payload = new FormData();
    payload.append("name", formData.name);
    payload.append("description", formData.description);
    payload.append("price", formData.price);
    payload.append("category", formData.category);
    payload.append("stock", formData.stock || 0);
    if (imageFile) payload.append("image", imageFile);

    try {
      setSubmitting(true);
      if (isEditMode) {
        await updateProduct(id, payload);
      } else {
        await addProduct(payload);
      }
      navigate("/admin/products");
    } catch (err) {
      setError(err.response?.data?.message || "Failed to save product");
    } finally {
      setSubmitting(false);
    }
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

  return (
    <div className="container my-5" style={{ maxWidth: "650px" }}>
      <h2 className="mb-4">{isEditMode ? "Edit Product" : "Add New Product"}</h2>

      <div className="card shadow-sm p-4">
        {error && <div className="alert alert-danger">{error}</div>}

        <form onSubmit={handleSubmit}>
          <div className="mb-3">
            <label className="form-label">Product Name *</label>
            <input
              type="text"
              name="name"
              className="form-control"
              value={formData.name}
              onChange={handleChange}
              required
            />
          </div>

          <div className="mb-3">
            <label className="form-label">Description *</label>
            <textarea
              name="description"
              className="form-control"
              rows="3"
              value={formData.description}
              onChange={handleChange}
              required
            ></textarea>
          </div>

          <div className="row">
            <div className="col-md-6 mb-3">
              <label className="form-label">Price ($) *</label>
              <input
                type="number"
                name="price"
                step="0.01"
                min="0"
                className="form-control"
                value={formData.price}
                onChange={handleChange}
                required
              />
            </div>
            <div className="col-md-6 mb-3">
              <label className="form-label">Stock Quantity</label>
              <input
                type="number"
                name="stock"
                min="0"
                className="form-control"
                value={formData.stock}
                onChange={handleChange}
              />
            </div>
          </div>

          <div className="mb-3">
            <label className="form-label">Category *</label>
            <select name="category" className="form-select" value={formData.category} onChange={handleChange}>
              {CATEGORY_OPTIONS.map((cat) => (
                <option key={cat} value={cat}>{cat}</option>
              ))}
            </select>
          </div>

          <div className="mb-3">
            <label className="form-label">Product Image {isEditMode ? "(leave blank to keep current)" : ""}</label>
            <input
              type="file"
              accept="image/*"
              className="form-control"
              onChange={(e) => setImageFile(e.target.files[0])}
            />
            {existingImage && !imageFile && (
              <img
                src={existingImage}
                alt="Current product"
                className="mt-2 rounded"
                style={{ width: "100px", height: "100px", objectFit: "contain" }}
              />
            )}
          </div>

          <button type="submit" className="btn btn-shopez w-100" disabled={submitting}>
            {submitting ? "Saving..." : isEditMode ? "Update Product" : "Add Product"}
          </button>
        </form>
      </div>
    </div>
  );
};

export default AddProduct;
