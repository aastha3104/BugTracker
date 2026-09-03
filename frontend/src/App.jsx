import "./App.css";
import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Dashboard from "./pages/Dashboard";
import CreateBug from "./pages/CreateBug";
import AllBugs from "./pages/AllBugs";
import { BugProvider } from "./context/BugContext";


function App() {
  return (
    <BugProvider>
      <BrowserRouter>
        <Routes>
          <Route path="/" element={<Navigate to="/dashboard" />} />
          <Route path="/dashboard" element={<Dashboard />} />
          <Route path="/bugs" element={<AllBugs />} />
          <Route path="/create-bug" element={<CreateBug />} />
        </Routes>
      </BrowserRouter>
    </BugProvider>
  );
}

export default App;