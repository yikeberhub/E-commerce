import { Navigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
import Spinner from "../common/Spinner";
const ProtectedRoute = ({ element }) => {
  const { user, loading } = useAuth();

  if (loading) return <Spinner fullScreen />;

  return user ? element : <Navigate to="/login" replace />;
};
export default ProtectedRoute;
