import { useBugs } from "../context/BugContext";
import { useNavigate } from "react-router-dom";

function BugTable() {
  const { bugs } = useBugs();
  const navigate = useNavigate();

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
          </tr>
        </thead>

        <tbody>
          {bugs.map((bug) => {
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
              </tr>
            );
          })}
        </tbody>
      </table>
    </section>
  );
}

export default BugTable;