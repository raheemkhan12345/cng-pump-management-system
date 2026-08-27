import { Navigate, Outlet, useLocation } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const RoleRoute = ({ allowedRoles = [] }) => {
  const { user } = useAuth();
  const location = useLocation();

  // =========================================================
  // USER NOT LOGGED IN
  // =========================================================

  if (!user) {
    return <Navigate to="/login" replace state={{ from: location }} />;
  }

  // =========================================================
  // ROLE NOT ALLOWED
  // =========================================================

  if (!allowedRoles.includes(user.role)) {
    return <Navigate to="/login" replace />;
  }

  // =========================================================
  // AUTHORIZED
  // =========================================================

  return <Outlet />;
};

export default RoleRoute;
