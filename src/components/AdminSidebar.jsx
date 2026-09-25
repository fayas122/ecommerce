import React, { useState } from "react";
import { NavLink, useNavigate } from "react-router-dom";
import { useDispatch } from "react-redux";

import { adminLogout } from "../features/auth/adminAuthSlice";
import LogoutModal from "./LogoutModel";

import {
  LayoutDashboard,
  Package,
  Users,
  ShoppingBag,
  LogOut,
} from "lucide-react";

function AdminSidebar() {
  const dispatch = useDispatch();
  const navigate = useNavigate();

  const [showLogoutModal, setShowLogoutModal] = useState(false);
  const [isLoggingOut, setIsLoggingOut] = useState(false);

  // ================= LOGOUT =================
  const handleLogout = () => {
    setIsLoggingOut(true);

    // Clear Redux admin authentication
    dispatch(adminLogout());

    // Clear admin authentication
    localStorage.removeItem("adminId");
    localStorage.removeItem("adminUser");

    // Clear normal user authentication
    localStorage.removeItem("userId");
    localStorage.removeItem("loggedInUser");

    // Go to login
    navigate("/login", { replace: true });
  };

  // ================= NAVIGATION =================
  const navItems = [
    {
      name: "Dashboard",
      path: "/admin",
      icon: LayoutDashboard,
      end: true,
    },
    {
      name: "Orders",
      path: "/admin/adminorders",
      icon: ShoppingBag,
      end: true,
    },
    {
      name: "Products",
      path: "/admin/products",
      icon: Package,
      end: true,
    },
    {
      name: "Users",
      path: "/admin/users",
      icon: Users,
      end: true,
    },
  ];

  return (
    <aside className="fixed left-0 top-0 z-50 flex h-screen w-[240px] flex-col border-r border-[#dedbd2] bg-[#173D20] text-white">

      {/* ================= LOGO ================= */}
      <div className="border-b border-white/10 px-6 py-6">
        <h1 className="text-2xl font-semibold tracking-[0.2em]">
          WESTEROS
        </h1>

        <p className="mt-1 text-[10px] uppercase tracking-[0.25em] text-white/60">
          Admin Panel
        </p>
      </div>

      {/* ================= NAVIGATION ================= */}
      <nav className="flex-1 px-4 py-4">
        <p className="mb-2 px-3 text-[10px] font-semibold uppercase tracking-[0.2em] text-white/40">
          Management
        </p>

        <div className="space-y-0.5">
          {navItems.map((item) => {
            const Icon = item.icon;

            return (
              <NavLink
                key={item.path}
                to={item.path}
                end={item.end}
                className={({ isActive }) =>
                  `group flex items-center gap-3 rounded-lg px-3 py-2.5 text-sm transition-all ${
                    isActive
                      ? "bg-[#f8f5ee] font-medium text-[#173D20]"
                      : "text-white/70 hover:bg-white/10 hover:text-white"
                  }`
                }
              >
                <Icon size={18} strokeWidth={1.8} />

                <span>{item.name}</span>
              </NavLink>
            );
          })}
        </div>
      </nav>

      {/* ================= LOGOUT ================= */}
      <div className="border-t border-white/10 p-4">
        <button
          type="button"
          onClick={() => setShowLogoutModal(true)}
          className="flex w-full items-center gap-3 rounded-lg px-3 py-2.5 text-sm text-white/70 transition hover:bg-red-500/10 hover:text-red-300"
        >
          <LogOut size={18} strokeWidth={1.8} />

          <span>Logout</span>
        </button>
      </div>

      {/* ================= LOGOUT MODAL ================= */}
      {showLogoutModal && (
        <LogoutModal
          onClose={() => setShowLogoutModal(false)}
          onConfirm={handleLogout}
          isLoggingOut={isLoggingOut}
        />
      )}

    </aside>
  );
}

export default AdminSidebar;