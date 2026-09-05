import { NavLink, useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import ThemeToggle from "./ThemeToggle";

function Sidebar() {
  const { logout } = useAuth();
  const navigate = useNavigate();
  const handleLogout = () => { logout(); navigate("/login", { replace: true }); };
  return (
    <aside className="sidebar">
      <div className="brand-lockup">
        <span className="brand-orb">B</span>
        <div><h2>BugTrack</h2><span>QA command center</span></div>
      </div>

      <nav>
        <NavLink to="/dashboard"><span className="nav-icon">▦</span>Dashboard</NavLink>
        <NavLink to="/bugs"><span className="nav-icon">≡</span>All Bugs</NavLink>
        <NavLink to="/create-bug"><span className="nav-icon">＋</span>Create Bug</NavLink>
      </nav>

      <div className="sidebar-footer">
      <ThemeToggle /><span></span>
      <button className="logout-btn" onClick={handleLogout}>Log out</button></div>
    </aside>
  );
}

export default Sidebar;