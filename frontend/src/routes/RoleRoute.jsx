import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleRoute = ({ allowedRoles = [] }) => {
  const { user, loading } = useAuth();
  const location = useLocation();

  // MUST WAIT for auth to settle on refresh so components receive user props correctly on first mount
  if (loading) {
    return <div className="auth-loading-screen">Loading session...</div>;
  }

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  return <Outlet />;
};

export default RoleRoute;