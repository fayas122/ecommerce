import { Navigate, Outlet } from "react-router-dom";
import { useSelector } from "react-redux";

const UserProtectedRoute = () => {
  const { isAdminAuthenticated } = useSelector(
    (state) => state.adminAuth
  );

  // Admin is logged in → don't allow user pages
  if (isAdminAuthenticated) {
    return <Navigate to="/admin" replace />;
  }

  return <Outlet />;
};

export default UserProtectedRoute;