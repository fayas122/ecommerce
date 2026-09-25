import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function AuthProtectedRoute({ children }) {
  const { isAuthenticated } = useSelector(
    (state) => state.auth
  );

  const { admin, isAdminAuthenticated } = useSelector(
    (state) => state.adminAuth
  );

  if (isAdminAuthenticated && admin?.role === "admin") {
    return <Navigate to="/admin" replace />;
  }

  if (isAuthenticated) {
    return <Navigate to="/" replace />;
  }

  return children;
}

export default AuthProtectedRoute;