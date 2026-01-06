
import { Navigate } from "react-router-dom";
import { useAuth } from "../contexts/AuthContext";

const RoleRoute = ({ roles, children }) => {
  const { user } = useAuth();

  if (!user) return <Navigate to="/login" replace />;

  const hasAccess = roles.includes(user.role);  

  return hasAccess ? children : <Navigate to="/unauthorized" replace />;
};

export default RoleRoute;
