import { useEffect, useState } from "react";
import AdminSidebar from "../components/AdminSidebar";
import { useAuth } from "../context/AuthContext";

const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

function Users() {
  const { token } = useAuth();
  const [users, setUsers] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");

  useEffect(() => {
    fetch(`${API_URL}/users`, { headers: { Authorization: `Bearer ${token}` } })
      .then(async (response) => {
        const data = await response.json();
        if (!response.ok) throw new Error(data.message || "Unable to load users");
        return data;
      })
      .then(setUsers)
      .catch((requestError) => setError(requestError.message))
      .finally(() => setLoading(false));
  }, [token]);

  return <div className="app admin-app"><AdminSidebar /><main className="page">
    <div className="page-top"><div><span className="eyebrow">Administration</span><h1>Users</h1><p>Registered BugTrack users</p></div></div>
    <div className="bugs-section user-table-section">
      {loading && <p className="no-bugs">Loading users...</p>}
      {error && <p className="no-bugs">Unable to load users: {error}</p>}
      {!loading && !error && <table><thead><tr><th>User ID</th><th>Name</th><th>Email</th><th>Bugs Reported</th><th>Created Date</th></tr></thead><tbody>
        {users.map((user) => <tr key={user._id}><td>#{user._id.slice(-6)}</td><td>{user.name}</td><td>{user.email}</td><td>{user.bugCount}</td><td>{new Date(user.createdAt).toLocaleDateString()}</td></tr>)}
      </tbody></table>}
      {!loading && !error && users.length === 0 && <p className="no-bugs">No registered users found.</p>}
    </div>
  </main></div>;
}

export default Users;
