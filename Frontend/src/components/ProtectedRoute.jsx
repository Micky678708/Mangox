import { Navigate, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

export default function ProtectedRoute({ children }) {
  const { isAuthed, loading } = useAuth();
  const loc = useLocation();

  if (loading) return <div>Loading...</div>;
  if (!isAuthed) return <Navigate to="/login" replace state={{ from: loc.pathname }} />;

  return children;
}