import { useAuth } from "./contexts/AuthContext";
import { Navigate } from "react-router-dom";

const RoleRedirect = () => {
  const { user } = useAuth();
  console.log("RoleRedirect user:" + user);
  if (!user) return <Navigate to="/auth" replace />;
  if (user.role === "admin") return <Navigate to="/admin" replace />;
  if (user.role === "teacher") return <Navigate to="/teacher" replace />;
  return <Navigate to="/dashboard" replace />;
};

export default RoleRedirect;
