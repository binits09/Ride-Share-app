import { Navigate, Outlet } from "react-router-dom";
import { useAuth } from "../context/AuthContext";

const PrivateRoute = ({ role }) => {
  const { token, user, authLoading } = useAuth();

  // ⏳ wait until auth is ready
  if (authLoading) {
    return null; // or loader
  }

  if (!token || !user) {
    return <Navigate to="/login" replace />;
  }

  if (role && user.role !== role) {
    return <Navigate to="/" replace />;
  }

  return <Outlet />;
};

export default PrivateRoute;
