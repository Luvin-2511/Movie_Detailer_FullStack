import { Navigate } from "react-router-dom";
import useAuth from "../hooks/useAuth";

// Redirects already-logged-in users away from auth pages (/login, /register)
const Public = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Wait for session restore before deciding — prevents flash redirect
  if (loading) return null;

  // If logged in, send to browse not "/" to avoid any loop
  return isAuthenticated ? <Navigate to="/browse" replace /> : children;
};

export default Public;