import { useState } from "react";
import { Link, useLocation, useNavigate } from "react-router-dom";
import AuthBackground from "../components/AuthBackground";
import { useAuth } from "../context/AuthContext";

function Login() {
  const { login } = useAuth();
  const navigate = useNavigate();
  const location = useLocation();
  const [form, setForm] = useState({ email: "", password: "" });
  const [error, setError] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    setLoading(true);
    try {
      await login(form);
      navigate(location.state?.from?.pathname || "/dashboard", { replace: true });
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return <AuthBackground message="Welcome Back" submessage="Ready to squash some bugs?">
    <form className="auth-card" onSubmit={handleSubmit}>
      <div className="auth-card-heading"><span className="brand-orb">B</span><div><h2>Login</h2><p>Sign in to your workspace</p></div></div>
      {error && <p className="auth-error">{error}</p>}
      <label>Email<input type="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></label>
      <label>Password<input type="password" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required /></label>
      <button className="create-btn auth-submit" type="submit" disabled={loading}>{loading ? "Signing in..." : "Login"}</button>
      <p className="auth-link">New to BugTrack? <Link to="/signup">Create Account</Link></p>
      <p className="auth-link"><Link to="/admin/login">Admin Login</Link></p>
    </form>
  </AuthBackground>;
}

export default Login;
