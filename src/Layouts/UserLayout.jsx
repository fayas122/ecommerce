import React from "react";
import { Outlet } from "react-router-dom";

import Navbar from "../components/navbar";

function UserLayout() {
  return (
    <div className="min-h-screen bg-[#f8f5ee]">
      {/* User Navbar */}
      <Navbar />

      {/* User Pages */}
      <main>
        <Outlet />
      </main>

      
    </div>
  );
}

export default UserLayout;