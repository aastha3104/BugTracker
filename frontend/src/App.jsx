import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CreateBug from "./pages/CreateBug";
import AllBugs from "./pages/AllBugs";
import { BugProvider } from "./context/BugContext";
import { AuthProvider } from "./context/AuthContext";
import ProtectedRoute from "./components/ProtectedRoute";
import RoleProtectedRoute from "./components/RoleProtectedRoute";
import Login from "./pages/Login";
import Signup from "./pages/Signup";
import { ThemeProvider } from "./context/ThemeContext";
import AdminLogin from "./pages/AdminLogin";
import AdminDashboard from "./pages/AdminDashboard";
import Users from "./pages/Users";


function App() {
  return (
    <ThemeProvider>
      <AuthProvider>
      <BrowserRouter>
        <BugProvider>
          <Routes>
            <Route path="/" element={<Navigate to="/login" replace />} />
            <Route path="/login" element={<Login />} />
            <Route path="/signup" element={<Signup />} />
            <Route path="/admin/login" element={<AdminLogin />} />
            <Route element={<ProtectedRoute />}>
              <Route path="/bugs" element={<AllBugs />} />
              <Route element={<RoleProtectedRoute role="user" redirectTo="/admin/dashboard" />}>
                <Route path="/dashboard" element={<Dashboard />} />
              </Route>
              <Route path="/create-bug" element={<CreateBug />} />
              <Route element={<RoleProtectedRoute role="admin" redirectTo="/dashboard" />}>
                <Route path="/admin/dashboard" element={<AdminDashboard />} />
                <Route path="/admin/users" element={<Users />} />
              </Route>
            </Route>
          </Routes>
        </BugProvider>
      </BrowserRouter>
      </AuthProvider>
    </ThemeProvider>
  );
}

export default App;