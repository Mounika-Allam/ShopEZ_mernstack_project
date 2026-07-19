import { useEffect, useState } from "react";
import { getProfile, updateProfile, getOrders } from "../services/api";
import { useAuth } from "../context/AuthContext";

const statusBadge = (status) => `badge status-badge-${status}`;

const Profile = () => {
  const { login } = useAuth();
  const [profile, setProfile] = useState(null);
  const [orders, setOrders] = useState([]);
  const [formData, setFormData] = useState({ name: "", address: "", phone: "", password: "" });
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    const fetchData = async () => {
      try {
        setLoading(true);
        const [profileRes, ordersRes] = await Promise.all([getProfile(), getOrders()]);
        setProfile(profileRes.data);
        setFormData({
          name: profileRes.data.name || "",
          address: profileRes.data.address || "",
          phone: profileRes.data.phone || "",
          password: "",
        });
        setOrders(ordersRes.data);
      } catch (err) {
        setError(err.response?.data?.message || "Failed to load profile");
      } finally {
        setLoading(false);
      }
    };
    fetchData();
  }, []);

  const handleChange = (e) => {
    setFormData({ ...formData, [e.target.name]: e.target.value });
  };

  const handleSubmit = async (e) => {
    e.preventDefault();
    setError("");
    setSuccess("");
    try {
      setSaving(true);
      const payload = { name: formData.name, address: formData.address, phone: formData.phone };
      if (formData.password) payload.password = formData.password;

      const { data } = await updateProfile(payload);
      setProfile(data);

      const storedUser = JSON.parse(localStorage.getItem("shopez_user"));
      login({ ...storedUser, name: data.name });

      setSuccess("Profile updated successfully");
      setFormData({ ...formData, password: "" });
    } catch (err) {
      setError(err.response?.data?.message || "Failed to update profile");
    } finally {
      setSaving(false);
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
    <div className="container my-5">
      <h2 className="mb-4">My Profile</h2>
      <div className="row g-4">
        <div className="col-md-5">
          <div className="card shadow-sm p-4">
            <h5 className="mb-3">Account Information</h5>
            {error && <div className="alert alert-danger">{error}</div>}
            {success && <div className="alert alert-success">{success}</div>}

            <form onSubmit={handleSubmit}>
              <div className="mb-3">
                <label className="form-label">Name</label>
                <input
                  type="text"
                  name="name"
                  className="form-control"
                  value={formData.name}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Email</label>
                <input type="email" className="form-control" value={profile.email} disabled />
              </div>
              <div className="mb-3">
                <label className="form-label">Phone</label>
                <input
                  type="text"
                  name="phone"
                  className="form-control"
                  value={formData.phone}
                  onChange={handleChange}
                />
              </div>
              <div className="mb-3">
                <label className="form-label">Address</label>
                <textarea
                  name="address"
                  className="form-control"
                  rows="2"
                  value={formData.address}
                  onChange={handleChange}
                ></textarea>
              </div>
              <div className="mb-3">
                <label className="form-label">New Password (optional)</label>
                <input
                  type="password"
                  name="password"
                  className="form-control"
                  placeholder="Leave blank to keep current password"
                  value={formData.password}
                  onChange={handleChange}
                  minLength={6}
                />
              </div>
              <button type="submit" className="btn btn-shopez w-100" disabled={saving}>
                {saving ? "Saving..." : "Save Changes"}
              </button>
            </form>
          </div>
        </div>

        <div className="col-md-7">
          <div className="card shadow-sm p-4">
            <h5 className="mb-3">Order History</h5>
            {orders.length === 0 ? (
              <p className="text-muted">You haven't placed any orders yet.</p>
            ) : (
              <div className="table-responsive">
                <table className="table align-middle">
                  <thead>
                    <tr>
                      <th>Order ID</th>
                      <th>Date</th>
                      <th>Total</th>
                      <th>Status</th>
                    </tr>
                  </thead>
                  <tbody>
                    {orders.map((order) => (
                      <tr key={order._id}>
                        <td className="small">{order._id.slice(-8)}</td>
                        <td className="small">{new Date(order.createdAt).toLocaleDateString()}</td>
                        <td>${order.totalAmount.toFixed(2)}</td>
                        <td>
                          <span className={statusBadge(order.status)}>{order.status}</span>
                        </td>
                      </tr>
                    ))}
                  </tbody>
                </table>
              </div>
            )}
          </div>
        </div>
      </div>
    </div>
  );
};

export default Profile;
