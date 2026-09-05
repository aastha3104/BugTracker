import { useBugs } from "../context/BugContext";
import { useNavigate } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function BugTable() {
  const { bugs, loading, error } = useBugs();
  const navigate = useNavigate();
  const { role } = useAuth();

  return (
    <section className="bugs-section">
      <div className="section-header">
        <h2>Recent Bugs</h2>

        <button onClick={() => navigate("/bugs")}>
          View All
        </button>
      </div>

      <table>
        <thead>
          <tr>
            <th>ID</th>
            <th>Bug</th>
            <th>Priority</th>
            <th>Severity</th>
            <th>Status</th>
            {role === "admin" && <th>Reported By</th>}
          </tr>
        </thead>

        <tbody>
          {!loading && !error && bugs.map((bug) => {
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

                {role === "admin" && <td>{bug.reportedBy?.name || "Legacy record"}</td>}

                <td>
                  <span
                    className={`badge status-${status
                      .toLowerCase()
                      .replace(/\s+/g, "-")}`}
                  >
                    {status}
                  </span>
                </td>
              </tr>
            );
          })}
        </tbody>
      </table>
      {loading && <p className="no-bugs">Loading bugs...</p>}
      {!loading && error && <p className="no-bugs">Unable to load bugs: {error}</p>}
      {!loading && !error && bugs.length === 0 && <p className="no-bugs">No bugs found.</p>}
    </section>
  );
}

export default BugTable;