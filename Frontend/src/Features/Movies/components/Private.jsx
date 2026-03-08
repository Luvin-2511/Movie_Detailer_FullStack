import { Navigate } from "react-router-dom";
import useAuth from "../../Auth/hooks/useAuth";

// Redirects unauthenticated users to /login
const Private = ({ children }) => {
  const { isAuthenticated, loading } = useAuth();

  // Wait for session restore before deciding
  if (loading) {
    return (
      <div className="private-loading">
        <span />
      </div>
    );
  }

  return isAuthenticated ? children : <Navigate to="/login" replace />;
};

export default Private;