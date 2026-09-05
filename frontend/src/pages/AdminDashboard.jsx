import { useEffect, useState } from "react";
import { useNavigate } from "react-router-dom";
import AdminSidebar from "../components/AdminSidebar";
import StatCard from "../components/StatCard";
import BugTable from "../components/BugTable";
import { useBugs } from "../context/BugContext";
import { useAuth } from "../context/AuthContext";
import DashboardTopbar from "../components/DashboardTopbar";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function AdminDashboard() {
  const { bugs } = useBugs();
  const { token } = useAuth();
  const navigate = useNavigate();
  const [userCount, setUserCount] = useState(0);

  useEffect(() => {
    fetch(`${API_URL}/users`, { headers: { Authorization: `Bearer ${token}` } })
      .then((response) => response.ok ? response.json() : [])
      .then((users) => setUserCount(users.length))
      .catch(() => setUserCount(0));
  }, [token]);

  return <div className="app admin-app">
    <AdminSidebar />
    <main className="main-content">
      <DashboardTopbar admin />
      <header><div><span className="eyebrow">Administration / 2026</span><h1>Admin Dashboard</h1><p>Manage the complete BugTrack system</p></div><button className="create-btn" onClick={() => navigate("/bugs")}>Manage Bugs</button></header>
      <section className="stats">
        <StatCard title="Total Bugs" value={bugs.length} icon="◈" type="total" />
        <StatCard title="Open" value={bugs.filter((bug) => bug.status === "Open").length} icon="⌁" type="open" />
        <StatCard title="In Progress" value={bugs.filter((bug) => bug.status === "In Progress").length} icon="◌" type="progress" />
        <StatCard title="Resolved" value={bugs.filter((bug) => bug.status === "Resolved").length} icon="✓" type="resolved" />
        <StatCard title="Total Users" value={userCount} icon="◉" type="users" />
      </section>
      <BugTable />
    </main>
  </div>;
}

export default AdminDashboard;
