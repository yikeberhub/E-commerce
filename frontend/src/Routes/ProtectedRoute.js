import { Navigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import Spinner from "../common/Spinner";

const ProtectedRoute = ({ element, role }) => {
  const { user, loading } = useAuth();

  if (loading) return <Spinner fullScreen />;

  if (!user) return <Navigate to="/login" replace />;
  if (role && user.role !== role) return <Navigate to="/" replace />;

  return element;
};
export default ProtectedRoute;
