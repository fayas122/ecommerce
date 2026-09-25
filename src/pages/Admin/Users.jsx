import React, { useState } from "react";
import {
  useMutation,
  useQuery,
  useQueryClient,
} from "@tanstack/react-query";

import {
  Users as UsersIcon,
  Search,
  Mail,
  User,
  Ban,
  CheckCircle,
  UserCheck,
  UserX,
} from "lucide-react";

import {
  getUsers,
  updateUser,
} from "../../services/userApi";

function Users() {
  const [search, setSearch] = useState("");
  const [statusFilter, setStatusFilter] = useState("all");

  const queryClient = useQueryClient();

  // ================= GET USERS =================

  const {
    data: users = [],
    isLoading,
    isError,
  } = useQuery({
    queryKey: ["users"],
    queryFn: getUsers,
  });

  // ================= BLOCK / UNBLOCK =================

  const updateUserMutation = useMutation({
    mutationFn: ({ id, data }) => updateUser(id, data),

    onSuccess: () => {
      queryClient.invalidateQueries({
        queryKey: ["users"],
      });
    },

    onError: (error) => {
      console.error("Failed to update user:", error);
    },
  });

  // ================= REMOVE ADMIN =================

  const customerUsers = users.filter(
    (user) => user.role !== "admin"
  );

  // ================= COUNTS =================

  const totalUsers = customerUsers.length;

  const blockedUsers = customerUsers.filter(
    (user) => user.blocked === true
  ).length;

  const activeUsers = totalUsers - blockedUsers;

  // ================= SEARCH + FILTER =================

  const filteredUsers = customerUsers.filter((user) => {
    const searchText = search.toLowerCase().trim();

    const matchesSearch =
      user.name?.toLowerCase().includes(searchText) ||
      user.email?.toLowerCase().includes(searchText) ||
      String(user.id)
        .toLowerCase()
        .includes(searchText);

    const matchesStatus =
      statusFilter === "all" ||
      (statusFilter === "active" &&
        user.blocked !== true) ||
      (statusFilter === "blocked" &&
        user.blocked === true);

    return matchesSearch && matchesStatus;
  });

  // ================= BLOCK / UNBLOCK FUNCTION =================

  const handleToggleBlock = (user) => {
    updateUserMutation.mutate({
      id: user.id,
      data: {
        blocked: user.blocked !== true,
      },
    });
  };

  // ================= LOADING =================

  if (isLoading) {
    return (
      <div className="flex min-h-screen items-center justify-center bg-[#f8f5ee]">
        <p className="text-sm text-stone-500">
          Loading users...
        </p>
      </div>
    );
  }

  // ================= ERROR =================

  if (isError) {
    return (
      <div className="flex min-h-screen flex-col items-center justify-center bg-[#f8f5ee]">
        <UsersIcon
          size={45}
          className="mb-4 text-stone-400"
        />

        <h2 className="text-xl font-semibold text-[#173d20]">
          Failed to load users
        </h2>

        <p className="mt-2 text-sm text-stone-500">
          Please check your JSON Server.
        </p>
      </div>
    );
  }

  return (
    <div className="min-h-screen bg-[#f8f5ee] p-6 md:p-8">
      <div className="mx-auto max-w-7xl">

        {/* ================= HEADER ================= */}

        <div className="mb-8">
          <div className="flex flex-col gap-5 md:flex-row md:items-center md:justify-between">

            {/* TITLE */}

            <div className="flex items-center gap-3">
              <div className="flex h-11 w-11 items-center justify-center rounded-full bg-[#244228] text-white">
                <UsersIcon size={21} />
              </div>

              <div>
                <h1 className="text-2xl font-semibold text-[#173d20]">
                  Users
                </h1>

                <p className="text-sm text-stone-500">
                  Manage registered customers
                </p>
              </div>
            </div>

            {/* SEARCH */}

            <div className="relative w-full md:w-80">
              <Search
                size={18}
                className="absolute left-3 top-1/2 -translate-y-1/2 text-stone-400"
              />

              <input
                type="text"
                value={search}
                onChange={(e) =>
                  setSearch(e.target.value)
                }
                placeholder="Search users..."
                className="w-full rounded-lg border border-stone-300 bg-white py-3 pl-10 pr-4 text-sm outline-none transition focus:border-[#315c35]"
              />
            </div>
          </div>
        </div>

        {/* ================= STATS ================= */}

        <div className="mb-6 grid grid-cols-1 gap-4 sm:grid-cols-3">

          {/* TOTAL USERS */}

          <div className="rounded-xl border border-stone-200 bg-white p-5">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs uppercase tracking-wide text-stone-400">
                  Total Users
                </p>

                <p className="mt-2 text-2xl font-semibold text-[#173d20]">
                  {totalUsers}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-[#eef3ed] text-[#244228]">
                <UsersIcon size={20} />
              </div>

            </div>
          </div>

          {/* ACTIVE USERS */}

          <div className="rounded-xl border border-stone-200 bg-white p-5">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs uppercase tracking-wide text-stone-400">
                  Active Users
                </p>

                <p className="mt-2 text-2xl font-semibold text-green-700">
                  {activeUsers}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-green-50 text-green-700">
                <UserCheck size={20} />
              </div>

            </div>
          </div>

          {/* BLOCKED USERS */}

          <div className="rounded-xl border border-stone-200 bg-white p-5">
            <div className="flex items-center justify-between">

              <div>
                <p className="text-xs uppercase tracking-wide text-stone-400">
                  Blocked Users
                </p>

                <p className="mt-2 text-2xl font-semibold text-red-600">
                  {blockedUsers}
                </p>
              </div>

              <div className="flex h-10 w-10 items-center justify-center rounded-full bg-red-50 text-red-600">
                <UserX size={20} />
              </div>

            </div>
          </div>

        </div>

        {/* ================= FILTER ================= */}

        <div className="mb-4 flex flex-col gap-3 sm:flex-row sm:items-center sm:justify-between">

          <p className="text-sm text-stone-500">
            Showing {filteredUsers.length} users
          </p>

          <div className="flex rounded-lg border border-stone-300 bg-white p-1">

            <button
              onClick={() => setStatusFilter("all")}
              className={`rounded-md px-4 py-2 text-xs font-medium transition ${
                statusFilter === "all"
                  ? "bg-[#244228] text-white"
                  : "text-stone-500 hover:bg-stone-100"
              }`}
            >
              All
            </button>

            <button
              onClick={() => setStatusFilter("active")}
              className={`rounded-md px-4 py-2 text-xs font-medium transition ${
                statusFilter === "active"
                  ? "bg-[#244228] text-white"
                  : "text-stone-500 hover:bg-stone-100"
              }`}
            >
              Active
            </button>

            <button
              onClick={() => setStatusFilter("blocked")}
              className={`rounded-md px-4 py-2 text-xs font-medium transition ${
                statusFilter === "blocked"
                  ? "bg-[#244228] text-white"
                  : "text-stone-500 hover:bg-stone-100"
              }`}
            >
              Blocked
            </button>

          </div>
        </div>

        {/* ================= USERS TABLE ================= */}

        <div className="overflow-hidden rounded-xl border border-stone-200 bg-white">

          {/* ================= DESKTOP ================= */}

          <div className="hidden overflow-x-auto md:block">

            <table className="w-full">

              <thead>
                <tr className="border-b border-stone-200 bg-stone-50">

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">
                    User
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">
                    Email
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">
                    User ID
                  </th>

                  <th className="px-6 py-4 text-left text-xs font-semibold uppercase tracking-wide text-stone-500">
                    Status
                  </th>

                  <th className="px-6 py-4 text-right text-xs font-semibold uppercase tracking-wide text-stone-500">
                    Action
                  </th>

                </tr>
              </thead>

              <tbody>

                {filteredUsers.map((user) => {

                  const isBlocked =
                    user.blocked === true;

                  return (
                    <tr
                      key={user.id}
                      className="border-b border-stone-100 last:border-b-0 hover:bg-stone-50"
                    >

                      {/* USER */}

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-3">

                          <div
                            className={`flex h-10 w-10 shrink-0 items-center justify-center rounded-full ${
                              isBlocked
                                ? "bg-red-50 text-red-500"
                                : "bg-[#e8eee7] text-[#244228]"
                            }`}
                          >
                            <User size={18} />
                          </div>

                          <div>

                            <p className="font-medium text-[#173d20]">
                              {user.name ||
                                "Unnamed User"}
                            </p>

                            <p className="text-xs text-stone-400">
                              Customer
                            </p>

                          </div>

                        </div>

                      </td>

                      {/* EMAIL */}

                      <td className="px-6 py-5">

                        <div className="flex items-center gap-2 text-sm text-stone-600">

                          <Mail
                            size={15}
                            className="text-stone-400"
                          />

                          {user.email}

                        </div>

                      </td>

                      {/* USER ID */}

                      <td className="px-6 py-5">

                        <span className="rounded-md bg-stone-100 px-2.5 py-1 text-xs text-stone-600">
                          #{user.id}
                        </span>

                      </td>

                      {/* STATUS */}

                      <td className="px-6 py-5">

                        {isBlocked ? (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-red-50 px-3 py-1 text-xs font-medium text-red-600">
                            <Ban size={13} />
                            Blocked
                          </span>
                        ) : (
                          <span className="inline-flex items-center gap-1.5 rounded-full bg-green-50 px-3 py-1 text-xs font-medium text-green-700">
                            <CheckCircle
                              size={13}
                            />
                            Active
                          </span>
                        )}

                      </td>

                      {/* ACTION */}

                      <td className="px-6 py-5 text-right">

                        <button
                          onClick={() =>
                            handleToggleBlock(user)
                          }
                          disabled={
                            updateUserMutation.isPending
                          }
                          className={`inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition ${
                            isBlocked
                              ? "bg-green-50 text-green-700 hover:bg-green-100"
                              : "bg-red-50 text-red-600 hover:bg-red-100"
                          }`}
                        >

                          {isBlocked ? (
                            <>
                              <CheckCircle
                                size={15}
                              />
                              Unblock
                            </>
                          ) : (
                            <>
                              <Ban size={15} />
                              Block
                            </>
                          )}

                        </button>

                      </td>

                    </tr>
                  );
                })}

              </tbody>

            </table>

          </div>

          {/* ================= MOBILE ================= */}

          <div className="divide-y divide-stone-200 md:hidden">

            {filteredUsers.map((user) => {

              const isBlocked =
                user.blocked === true;

              return (
                <div
                  key={user.id}
                  className="p-5"
                >

                  <div className="flex items-start gap-3">

                    <div
                      className={`flex h-11 w-11 shrink-0 items-center justify-center rounded-full ${
                        isBlocked
                          ? "bg-red-50 text-red-500"
                          : "bg-[#e8eee7] text-[#244228]"
                      }`}
                    >
                      <User size={19} />
                    </div>

                    <div className="min-w-0 flex-1">

                      <div className="flex items-start justify-between gap-3">

                        <div>

                          <p className="font-medium text-[#173d20]">
                            {user.name ||
                              "Unnamed User"}
                          </p>

                          <p className="mt-1 flex items-center gap-1.5 text-xs text-stone-500">
                            <Mail size={13} />
                            {user.email}
                          </p>

                        </div>

                        {/* MOBILE STATUS */}

                        {isBlocked ? (
                          <span className="rounded-full bg-red-50 px-2.5 py-1 text-[10px] font-medium text-red-600">
                            Blocked
                          </span>
                        ) : (
                          <span className="rounded-full bg-green-50 px-2.5 py-1 text-[10px] font-medium text-green-700">
                            Active
                          </span>
                        )}

                      </div>

                      <p className="mt-3 text-xs text-stone-400">
                        User ID: #{user.id}
                      </p>

                      {/* MOBILE ACTION */}

                      <button
                        onClick={() =>
                          handleToggleBlock(user)
                        }
                        disabled={
                          updateUserMutation.isPending
                        }
                        className={`mt-4 inline-flex items-center gap-2 rounded-lg px-3 py-2 text-xs font-medium transition ${
                          isBlocked
                            ? "bg-green-50 text-green-700 hover:bg-green-100"
                            : "bg-red-50 text-red-600 hover:bg-red-100"
                        }`}
                      >

                        {isBlocked ? (
                          <>
                            <CheckCircle
                              size={14}
                            />
                            Unblock
                          </>
                        ) : (
                          <>
                            <Ban size={14} />
                            Block 
                          </>
                        )}

                      </button>

                    </div>

                  </div>

                </div>
              );
            })}

          </div>

          {/* ================= NO RESULTS ================= */}

          {filteredUsers.length === 0 && (
            <div className="px-6 py-16 text-center">

              <UsersIcon
                size={40}
                className="mx-auto mb-4 text-stone-300"
              />

              <h3 className="text-lg font-semibold text-[#173d20]">
                No users found
              </h3>

              <p className="mt-1 text-sm text-stone-500">
                Try changing your search or filter.
              </p>

            </div>
          )}

        </div>
      </div>
    </div>
  );
}

export default Users;