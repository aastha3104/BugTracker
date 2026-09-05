import { useAuth } from "../context/AuthContext";

function DashboardTopbar({ admin = false }) {
  const { user } = useAuth();

  return (
    <div className="dashboard-topbar">
      <label className="dashboard-search">
        <span aria-hidden="true">⌕</span>
        <input type="search" placeholder="Search bugs, projects..." aria-label="Search bugs and projects" />
      </label>
      <div className="topbar-actions">
        <button className="icon-button" type="button" aria-label="Messages">□</button>
        <button className="icon-button" type="button" aria-label="Notifications">♧</button>
        <div className="topbar-profile">
          <span className="topbar-avatar">{user?.name?.charAt(0).toUpperCase()}</span>
          <div><strong>{user?.name}</strong><small>{user?.email}</small></div>
          <span className={`role-badge topbar-role-badge ${admin ? "admin-badge" : "user-badge"}`}>{admin ? "ADMIN" : "USER"}</span>
        </div>
      </div>
    </div>
  );
}

export default DashboardTopbar;
