import React from "react";
import { Outlet } from "react-router-dom";

import AdminSidebar from "../components/Adminsidebar";

function AdminLayout() {
  return (
    <div className="min-h-screen bg-[#f8f5ee]">
      {/* Admin Sidebar */}
      <AdminSidebar />

      {/* Admin Content */}
      <main className="ml-[240px] min-h-screen">
        <Outlet />
      </main>
    </div>
  );
}

export default AdminLayout;