import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

function AdminSidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate("/admin/login", { replace: true }); };

  return <aside className="sidebar admin-sidebar">
    <div className="brand-lockup"><span className="brand-orb">B</span><div><h2>BugTrack Admin</h2><span>System control</span></div></div>
    <nav>
      <NavLink to="/admin/dashboard"><span className="nav-icon">▦</span>Dashboard</NavLink>
      <NavLink to="/bugs"><span className="nav-icon">≡</span>All Bugs</NavLink>
      <NavLink to="/admin/users"><span className="nav-icon">◉</span>Users</NavLink>
    </nav>
    <div className="sidebar-footer"><ThemeToggle /><button className="logout-btn" onClick={handleLogout}><span></span>Log out</button></div>
  </aside>;
}

export default AdminSidebar;