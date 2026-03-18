import { BrowserRouter, Routes, Route, Navigate } from "react-router-dom";
import Login from "./pages/Login.jsx";
import AdminIncidentReview from "./pages/AdminIncidentReview.jsx";
import AdminReportsAnalytics from "./pages/AdminReportsAnalytics.jsx";

export default function App() {
  return (
    <BrowserRouter>
      <Routes>
        <Route path="/" element={<Navigate to="/login" replace />} />
        <Route path="/login" element={<Login />} />
        <Route path="/admin/incidents" element={<AdminIncidentReview />} />
        <Route path="/admin/reports" element={<AdminReportsAnalytics />} />
      </Routes>
    </BrowserRouter>
  );
}