import { useState } from "react";
import { Link, useNavigate } from "react-router-dom";
import AuthBackground from "../components/AuthBackground";
import { useAuth } from "../context/AuthContext";

function Signup() {
  const { signup } = useAuth();
  const navigate = useNavigate();
  const [form, setForm] = useState({ name: "", email: "", password: "", confirmPassword: "" });
  const [error, setError] = useState("");
  const [success, setSuccess] = useState("");
  const [loading, setLoading] = useState(false);

  const handleSubmit = async (event) => {
    event.preventDefault();
    setError("");
    if (form.password !== form.confirmPassword) {
      setError("Passwords do not match");
      return;
    }
    setLoading(true);
    try {
      await signup({ name: form.name, email: form.email, password: form.password });
      setSuccess("Account created. Redirecting to login...");
      setTimeout(() => navigate("/login"), 700);
    } catch (requestError) {
      setError(requestError.message);
    } finally {
      setLoading(false);
    }
  };

  return <AuthBackground message="Hi, Welcome to BugTracker" submessage="Let's build better software, one bug at a time.">
    <form className="auth-card" onSubmit={handleSubmit}>
      <div className="auth-card-heading"><span className="brand-orb">B</span><div><h2>Create Account</h2><p>Set up your BugTrack workspace</p></div></div>
      {error && <p className="auth-error">{error}</p>}
      {success && <p className="auth-success">{success}</p>}
      <label>Full Name<input type="text" value={form.name} onChange={(event) => setForm({ ...form, name: event.target.value })} required /></label>
      <label>Email<input type="email" inputMode="email" autoComplete="email" value={form.email} onChange={(event) => setForm({ ...form, email: event.target.value })} required /></label>
      <label>Password<input type="password" minLength="8" value={form.password} onChange={(event) => setForm({ ...form, password: event.target.value })} required /></label>
      <label>Confirm Password<input type="password" minLength="8" value={form.confirmPassword} onChange={(event) => setForm({ ...form, confirmPassword: event.target.value })} required /></label>
      <button className="create-btn auth-submit" type="submit" disabled={loading}>{loading ? "Creating..." : "Create Account"}</button>
      <p className="auth-link">Already have an account? <Link to="/login">Login</Link></p>
    </form>
  </AuthBackground>;
}

export default Signup;
