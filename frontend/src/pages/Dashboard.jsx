import Sidebar from "../components/Sidebar";
import StatCard from "../components/StatCard";
import BugTable from "../components/BugTable";
import AnalyticsPanel from "../components/AnalyticsPanel";
import { useBugs } from "../context/BugContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";
import DashboardTopbar from "../components/DashboardTopbar";

function Dashboard() {
  const { bugs } = useBugs();
  const navigate = useNavigate();
  const { user } = useAuth();

  return (
    <div className="app">
      <Sidebar />

      <main className="main-content">
        <DashboardTopbar />
        <header>
          <div>
            <span className="eyebrow">Overview / 2026</span>
            <h1>Welcome, {user?.name}</h1>
            <p>Track and manage your reported issues</p>
          </div>

          <button className="create-btn" 
          onClick={() => navigate("/create-bug")}
          >
            + Create Bug</button>
        </header>

        <section className="stats">
            <StatCard title="Total Bugs" value={bugs.length} icon="◈" type="total" />

<StatCard
  title="Open"
  value={bugs.filter((bug) => bug.status === "Open").length} icon="⌁" type="open"
/>

<StatCard
  title="In Progress"
  value={bugs.filter((bug) => bug.status === "In Progress").length} icon="◌" type="progress"
/>

<StatCard
  title="Resolved"
  value={bugs.filter((bug) => bug.status === "Resolved").length} icon="✓" type="resolved"
/>
        </section>

        <AnalyticsPanel />

        <BugTable />
      </main>
    </div>
  );
}

export default Dashboard;