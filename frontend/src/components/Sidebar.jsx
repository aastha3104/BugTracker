import { NavLink } from "react-router-dom";

function Sidebar() {
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

      <div className="sidebar-footer"><span className="pulse-dot" />System operational</div>
    </aside>
  );
}

export default Sidebar;