import { createContext, useContext, useState } from "react";

const AuthContext = createContext(null);
const API_URL = import.meta.env.VITE_API_URL || "http://localhost:5000/api";

async function authRequest(endpoint, data) {
  const response = await fetch(`${API_URL}/auth/${endpoint}`, {
    method: "POST",
    headers: { "Content-Type": "application/json" },
    body: JSON.stringify(data),
  });
  const payload = await response.json().catch(() => ({}));
  if (!response.ok) throw new Error(payload.message || "Authentication request failed");
  return payload;
}

export function AuthProvider({ children }) {
  const [token, setToken] = useState(() => localStorage.getItem("bugtracker_token"));
  const [user, setUser] = useState(() => {
    const savedUser = localStorage.getItem("bugtracker_user");
    return savedUser ? JSON.parse(savedUser) : null;
  });

  const establishSession = (result) => {
    localStorage.setItem("bugtracker_token", result.token);
    localStorage.setItem("bugtracker_user", JSON.stringify(result.user));
    setToken(result.token);
    setUser(result.user);
  };

  const login = async (credentials) => {
    const result = await authRequest("login", credentials);
    establishSession(result);
    return result;
  };

  const adminLogin = async (credentials) => {
    const result = await authRequest("admin-login", credentials);
    establishSession(result);
    return result;
  };

  const signup = (details) => authRequest("signup", details);

  const logout = () => {
    localStorage.removeItem("bugtracker_token");
    localStorage.removeItem("bugtracker_user");
    setToken(null);
    setUser(null);
  };

  return <AuthContext.Provider value={{ token, user, role: user?.role, isAuthenticated: Boolean(token && user?.role), login, adminLogin, signup, logout }}>{children}</AuthContext.Provider>;
}

// eslint-disable-next-line react-refresh/only-export-components
export function useAuth() {
  return useContext(AuthContext);
}
