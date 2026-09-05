import { createContext, useContext, useEffect, useState } from "react";
import { useAuth } from "./AuthContext";

const BugContext = createContext();
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function request(endpoint, options = {}) {
  const response = await fetch(`${API_URL}${endpoint}`, {
    headers: { "Content-Type": "application/json" },
    ...options,
  });

  if (!response.ok) {
    const payload = await response.json().catch(() => ({}));
    throw new Error(payload.message || "The API request failed");
  }

  return response.status === 204 ? null : response.json();
}

export function BugProvider({ children }) {
  const { token } = useAuth();
  const [bugs, setBugs] = useState([]);
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState("");
  const [saving, setSaving] = useState(false);

  useEffect(() => {
    let active = true;

    if (!token) {
      return () => {
        active = false;
      };
    }

    request("/bugs", { headers: { Authorization: `Bearer ${token}` } })
      .then((data) => {
        if (active) setBugs(data);
      })
      .catch((requestError) => {
        if (active) setError(requestError.message);
      })
      .finally(() => {
        if (active) setLoading(false);
      });

    return () => {
      active = false;
    };
  }, [token]);

  // ADD BUG
  const addBug = async (newBug) => {
    setSaving(true);
    setError("");
    try {
      const createdBug = await request("/bugs", {
        method: "POST",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(newBug),
      });
      setBugs((currentBugs) => [...currentBugs, createdBug]);
      return createdBug;
    } catch (requestError) {
      setError(requestError.message);
      throw requestError;
    } finally {
      setSaving(false);
    }
  };

  // UPDATE BUG
  const updateBug = async (id, updatedData) => {
    setSaving(true);
    setError("");
    try {
      const updatedBug = await request(`/bugs/${id}`, {
        method: "PUT",
        headers: { Authorization: `Bearer ${token}` },
        body: JSON.stringify(updatedData),
      });
      setBugs((currentBugs) =>
        currentBugs.map((bug) => (bug.id === id ? updatedBug : bug))
      );
      return updatedBug;
    } catch (requestError) {
      setError(requestError.message);
      throw requestError;
    } finally {
      setSaving(false);
    }
  };

  // DELETE BUG
  const deleteBug = async (id) => {
    setSaving(true);
    setError("");
    try {
      await request(`/bugs/${id}`, { method: "DELETE", headers: { Authorization: `Bearer ${token}` } });
      setBugs((currentBugs) => currentBugs.filter((bug) => bug.id !== id));
    } catch (requestError) {
      setError(requestError.message);
      throw requestError;
    } finally {
      setSaving(false);
    }
  };

  return (
    <BugContext.Provider
      value={{
        bugs,
        loading,
        saving,
        error,
        addBug,
        updateBug,
        deleteBug,
      }}
    >
      {children}
    </BugContext.Provider>
  );
}

// This context module intentionally exports both its provider and consumer hook.
// eslint-disable-next-line react-refresh/only-export-components
export function useBugs() {
  return useContext(BugContext);
}