import React from "react";
import { Navigate } from "react-router-dom";
import { useSelector } from "react-redux";

function AdminProtectedRoute({ children }) {
  const { admin, isAdminAuthenticated } = useSelector(
    (state) => state.adminAuth
  );


  // Admin is not logged in
  if (!isAdminAuthenticated) {
    return <Navigate to="/login" replace />;
  }

  // Logged-in account is not an admin
  if (admin?.role !== "admin") {
    return <Navigate to="/" replace />;
  }

  // Admin is authenticated
  return children;
}

export default AdminProtectedRoute;