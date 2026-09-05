import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

function RoleProtectedRoute({ role, redirectTo }) {
  const { isAuthenticated, role: currentRole } = useAuth();
  if (!isAuthenticated) return <Navigate to="/login" replace />;
  return currentRole === role ? <Outlet /> : <Navigate to={redirectTo} replace />;
}

export default RoleProtectedRoute;