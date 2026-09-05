import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthBackground from "../components/AuthBackground";
import { useAuth } from "../context/AuthContext";

function AdminLogin() {
  const { adminLogin } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await adminLogin(form);
      navigate("/admin/dashboard", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return <AuthBackground message="Welcome Admin" submessage="Keep quality moving forward.">
    <form className="auth-card" onSubmit={handleSubmit}>
      <div className="auth-card-heading"><span className="brand-orb">B</span><div><h2>Admin Login</h2><p>Access system controls</p></div></div>
      {error && <p className="auth-error">{error}</p>}
      <label>Admin Email<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></label>
      <label>Password<input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required /></label>
      <button className="create-btn auth-submit" type="submit" disabled={loading}>{loading ? "Signing in..." : "Login"}</button>
      <p className="auth-link"><Link to="/login">Normal User Login</Link></p>
    </form>
  </AuthBackground>;
}

export default AdminLogin;
