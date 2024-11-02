import { Navigate } from "react-router-dom";

import { useAuth } from "../contexts/AuthContext";
const ProtectedRoute = ({ element }) => {
  const { user, loading } = useAuth();

  if (loading) return <p>Loading...</p>; // Show loading while fetching

  return user ? element : <Navigate to="/login" replace />;
};
export default ProtectedRoute;
