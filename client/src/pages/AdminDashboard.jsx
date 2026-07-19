import { useEffect, useState } from "react";
import { Link } from "react-router-dom";
import { getProducts, getOrders } from "../services/api";

const AdminDashboard = () => {
  const [stats, setStats] = useState({ productCount: 0, orderCount: 0, revenue: 0, pendingOrders: 0 });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    const fetchStats = async () => {
      try {
        setLoading(true);
        const [productsRes, ordersRes] = await Promise.all([getProducts(), getOrders()]);
        const revenue = ordersRes.data.reduce((sum, o) => sum + (Number(o.totalAmount) || 0), 0);
        const pendingOrders = ordersRes.data.filter((o) => o.status === "PENDING").length;
        setStats({
          productCount: productsRes.data.length,
          orderCount: ordersRes.data.length,
          revenue,
          pendingOrders,
        });
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load dashboard data");
      } finally {
        setLoading(false);
      }
    };
    fetchStats();
  }, []);

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
    <div className="container my-5">
      <h2 className="mb-4">Admin Dashboard</h2>
      {error && <div className="alert alert-danger">{error}</div>}

      <div className="row g-4 mb-4">
        <div className="col-md-3 col-6">
          <div className="card dashboard-card p-3 text-center">
            <h6 className="text-muted">Total Products</h6>
            <h3>{stats.productCount}</h3>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card dashboard-card p-3 text-center">
            <h6 className="text-muted">Total Orders</h6>
            <h3>{stats.orderCount}</h3>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card dashboard-card p-3 text-center">
            <h6 className="text-muted">Pending Orders</h6>
            <h3>{stats.pendingOrders}</h3>
          </div>
        </div>
        <div className="col-md-3 col-6">
          <div className="card dashboard-card p-3 text-center">
            <h6 className="text-muted">Total Revenue</h6>
            <h3>${stats.revenue.toFixed(2)}</h3>
          </div>
        </div>
      </div>

      <div className="row g-4">
        <div className="col-md-4">
          <div className="card dashboard-card p-4 text-center h-100">
            <h5>Manage Products</h5>
            <p className="text-muted">View, edit, or delete existing products.</p>
            <Link to="/admin/products" className="btn btn-shopez mt-auto">Go to Products</Link>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card dashboard-card p-4 text-center h-100">
            <h5>Add New Product</h5>
            <p className="text-muted">Create a new listing with images.</p>
            <Link to="/admin/products/add" className="btn btn-shopez mt-auto">Add Product</Link>
          </div>
        </div>
        <div className="col-md-4">
          <div className="card dashboard-card p-4 text-center h-100">
            <h5>Manage Orders</h5>
            <p className="text-muted">View all orders and update their status.</p>
            <Link to="/admin/orders" className="btn btn-shopez mt-auto">Go to Orders</Link>
          </div>
        </div>
      </div>
    </div>
  );
};

export default AdminDashboard;
