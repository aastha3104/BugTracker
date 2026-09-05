import { useState } from "react";
import { useBugs } from "../context/BugContext";
import { useNavigate } from "react-router-dom";
import Sidebar from "../components/Sidebar";
import AdminSidebar from "../components/AdminSidebar";
import { useAuth } from "../context/AuthContext";

function AllBugs() {
  const { bugs, updateBug, deleteBug, loading, saving, error } = useBugs();
  const navigate = useNavigate();
  const { role } = useAuth();

  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("All");
  const [priorityFilter, setPriorityFilter] = useState("All");
  const [editingBug, setEditingBug] = useState(null);

  const filteredBugs = bugs.filter((bug) => {
    const matchesSearch = (bug.title || "")
      .toLowerCase()
      .includes(search.toLowerCase());

    const matchesStatus =
      statusFilter === "All" || bug.status === statusFilter;

    const matchesPriority =
      priorityFilter === "All" || bug.priority === priorityFilter;

    return matchesSearch && matchesStatus && matchesPriority;
  });

  const handleDelete = async (id) => {
    const confirmDelete = window.confirm(
      "Are you sure you want to delete this bug?"
    );

    if (confirmDelete) {
      try {
        await deleteBug(id);
      } catch {
        // The context retains the API error for display below.
      }
    }
  };

  const handleUpdate = async (e) => {
    e.preventDefault();

    try {
      await updateBug(editingBug.id, {
        title: editingBug.title,
        priority: editingBug.priority,
        severity: editingBug.severity,
        status: editingBug.status,
      });
      setEditingBug(null);
    } catch {
      // The context retains the API error for display below.
    }
  };

  const dashboardPath = role === "admin" ? "/admin/dashboard" : "/dashboard";

  return (
    <div className="app">{role === "admin" ? <AdminSidebar /> : <Sidebar />}<main className="page">

      {/* PAGE HEADER */}
      <div className="page-top">
        <div>
          <h1>All Bugs</h1>
          <p>View and manage all reported bugs</p>
        </div>

        <div className="page-actions">
          <button
            className="secondary-btn"
            onClick={() => navigate(dashboardPath)}
          >
            Dashboard
          </button>

          <button
            className="create-btn"
            onClick={() => navigate("/create-bug")}
          >
            + Create Bug
          </button>
        </div>
      </div>

      {/* FILTERS */}
      <div className="filters">
        <input
          type="text"
          placeholder="Search bugs..."
          value={search}
          onChange={(e) => setSearch(e.target.value)}
        />

        <select
          value={statusFilter}
          onChange={(e) => setStatusFilter(e.target.value)}
        >
          <option value="All">All Status</option>
          <option value="Open">Open</option>
          <option value="In Progress">In Progress</option>
          <option value="Resolved">Resolved</option>
        </select>

        <select
          value={priorityFilter}
          onChange={(e) => setPriorityFilter(e.target.value)}
        >
          <option value="All">All Priority</option>
          <option value="Low">Low</option>
          <option value="Medium">Medium</option>
          <option value="High">High</option>
          <option value="Critical">Critical</option>
        </select>
      </div>
      {error && <p className="no-bugs">API error: {error}</p>}

      {/* BUG TABLE */}
      <div className="bugs-section">
        <table>
          <thead>
            <tr>
              <th>ID</th>
              <th>Bug</th>
              <th>Priority</th>
              <th>Severity</th>
              <th>Status</th>
              {role === "admin" && <th>Reported By</th>}
              <th>Actions</th>
            </tr>
          </thead>

          <tbody>
            {!loading && filteredBugs.map((bug) => {
              const priority = bug.priority || "Low";
              const severity = bug.severity || "Minor";
              const status = bug.status || "Open";

              return (
                <tr key={bug.id}>
                  <td>#{bug.id}</td>

                  <td>{bug.title}</td>

                  <td>
                    <span
                      className={`badge priority-${priority.toLowerCase()}`}
                    >
                      {priority}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`badge severity-${severity.toLowerCase()}`}
                    >
                      {severity}
                    </span>
                  </td>

                  <td>
                    <span
                      className={`badge status-${status
                        .toLowerCase()
                        .replace(/\s+/g, "-")}`}
                    >
                      {status}
                    </span>
                  </td>

                  {role === "admin" && <td>{bug.reportedBy?.name || "Legacy record"}</td>}

                  <td className="bug-actions">
                    <button
                      className="edit-btn"
                      onClick={() => setEditingBug({ ...bug })}
                    >
                      Edit
                    </button>

                    <button
                      className="delete-btn"
                      onClick={() => handleDelete(bug.id)}
                    >
                      Delete
                    </button>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>

        {loading && <p className="no-bugs">Loading bugs...</p>}
        {!loading && filteredBugs.length === 0 && <p className="no-bugs">No bugs found.</p>}
      </div>

      {/* EDIT MODAL */}
      {editingBug && (
        <div className="modal-overlay">
          <div className="edit-modal">
            <h2>Edit Bug</h2>

            <form onSubmit={handleUpdate}>
              <div className="form-group">
                <label>Bug Title</label>

                <input
                  type="text"
                  value={editingBug.title}
                  onChange={(e) =>
                    setEditingBug({
                      ...editingBug,
                      title: e.target.value,
                    })
                  }
                />
              </div>

              <div className="form-row">
                <div className="form-group">
                  <label>Priority</label>

                  <select
                    value={editingBug.priority}
                    onChange={(e) =>
                      setEditingBug({
                        ...editingBug,
                        priority: e.target.value,
                      })
                    }
                  >
                    <option>Low</option>
                    <option>Medium</option>
                    <option>High</option>
                    <option>Critical</option>
                  </select>
                </div>

                <div className="form-group">
                  <label>Severity</label>

                  <select
                    value={editingBug.severity}
                    onChange={(e) =>
                      setEditingBug({
                        ...editingBug,
                        severity: e.target.value,
                      })
                    }
                  >
                    <option>Minor</option>
                    <option>Major</option>
                    <option>Critical</option>
                  </select>
                </div>
              </div>

              <div className="form-group">
                <label>Status</label>

                <select
                  value={editingBug.status}
                  onChange={(e) =>
                    setEditingBug({
                      ...editingBug,
                      status: e.target.value,
                    })
                  }
                >
                  <option>Open</option>
                  <option>In Progress</option>
                  <option>Resolved</option>
                </select>
              </div>

              <div className="edit-actions">
                <button
                  type="button"
                  className="cancel-btn"
                  onClick={() => setEditingBug(null)}
                >
                  Cancel
                </button>

                <button type="submit" className="save-btn" disabled={saving}>
                  {saving ? "Saving..." : "Save Changes"}
                </button>
              </div>
            </form>
          </div>
        </div>
      )}
    </main></div>
  );
}

export default AllBugs;