import { Navigate } from "react-router-dom";
import useAuth from "../../Auth/hooks/useAuth";

// Only allows users with role === "admin"
const AdminOnly = ({ children }) => {
  const { isAuthenticated, isAdmin, loading } = useAuth();

  if (loading) return (
    <div className="private-loading"><span /></div>
  );

  if (!isAuthenticated) return <Navigate to="/login"  replace />;
  if (!isAdmin)         return <Navigate to="/browse" replace />;

  return children;
};

export default AdminOnly;