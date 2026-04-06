import { useState } from "react";
import { Users, Stethoscope, Package, Clock } from "lucide-react";
import { useQuery } from "@tanstack/react-query";
import { useAppApi } from "../../hooks/useAppApi";
import Loader from "../../components/Loader";
import { HashLoader } from "react-spinners";
import { getInitials } from "../../lib/utils";
import UserStats from "./components/UserManagement/UserStats";
import UserTable from "./components/UserManagement/UserTable";
import type { UserEntry } from "./components/UserManagement/types";

export default function UserManagement() {
  const { admin } = useAppApi();

  const { data: rawUsers = [], isLoading: isUsersLoading } = useQuery({
    queryKey: ["admin", "users"],
    queryFn: () => admin.getUsers(),
  });

  const { data: analyticsData, isLoading: isAnalyticsLoading } = useQuery({
    queryKey: ["admin", "analytics"],
    queryFn: () => admin.getAnalytics(),
  });

  const [roleFilter, setRoleFilter] = useState("all");
  const [currentPage, setCurrentPage] = useState(1);
  const itemsPerPage = 8;

  if (isUsersLoading || isAnalyticsLoading) {
    return (
      <div className="flex h-full items-center justify-center">
        <Loader isFullPage={false}>
          <HashLoader size={30} color="#166534" />
        </Loader>
      </div>
    );
  }
console.log(rawUsers)
  const users: UserEntry[] = rawUsers.map((u: any) => ({
    id: u.clerkId || u._id || Math.random().toString(),
    name: u.name || "Unknown User",
    role: u.role || "patient",
    dateJoined: new Date(u.createdAt).toLocaleDateString("en-US", { year: "numeric", month: "short", day: "numeric" }),
    initials: getInitials(u.name || "Unknown"),
    profilePicture: u.imageUrl,
    status: u.isVerified ? "active" : "pending",
  }));

  const filteredUsers = roleFilter === "all" 
    ? users 
    : users.filter((u) => u.role === roleFilter);

  const totalPages = Math.ceil(filteredUsers.length / itemsPerPage) || 1;
  const paginatedUsers = filteredUsers.slice((currentPage - 1) * itemsPerPage, currentPage * itemsPerPage);

  const handleRoleFilter = (value: string) => {
    setRoleFilter(value);
    setCurrentPage(1);
  };

  const totalSuppliers = rawUsers.filter((u: any) => u.role === "supplier").length;

  const stats = [
    { label: "Total Members", value: analyticsData?.totalUsers?.toString() || "0", icon: Users },
    { label: "Practitioners", value: analyticsData?.totalPractitioners?.toString() || "0", icon: Stethoscope },
    { label: "Suppliers", value: totalSuppliers.toString(), icon: Package },
    { 
      label: "Pending Approvals", 
      value: ((analyticsData?.pendingPractitioners || 0) + (analyticsData?.pendingProducts || 0)).toString(), 
      icon: Clock, 
      sub: "Requires admin approval" 
    },
  ];

  return (
    <div className="mx-auto max-w-6xl space-y-8">
      {/* Header */}
      <div>
        <p className="text-xs font-medium uppercase tracking-widest text-muted-foreground">
          Portal / User Management
        </p>
        <h1 className="mt-1 font-display text-3xl font-bold text-foreground">Users</h1>
        <p className="mt-1 text-sm text-muted-foreground">
          Oversee and manage the diverse ecosystem of practitioners, patients, and herbal suppliers.
        </p>
      </div>

      <UserStats stats={stats} />

      <UserTable 
        paginatedUsers={paginatedUsers}
        filteredUsersLength={filteredUsers.length}
        currentPage={currentPage}
        totalPages={totalPages}
        itemsPerPage={itemsPerPage}
        roleFilter={roleFilter}
        onRoleFilterChange={handleRoleFilter}
        onPageChange={setCurrentPage}
      />
    </div>
  );
}
