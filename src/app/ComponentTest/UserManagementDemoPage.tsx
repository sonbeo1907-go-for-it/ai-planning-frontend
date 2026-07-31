"use client";

import { useState } from "react";
import { User } from "@/features/user/user.types";
import { UserFilterBar } from "@/features/user/components/UserFilterBar";
import { UserTable } from "@/features/user/components/UserTable";
import { UserFormModal } from "@/features/user/components/UserFormModal";
import { UserDeactivateModal } from "@/features/user/components/UserDeactivateModal";
import { PageResponse } from "@/types/pagination";

const mockUsers: User[] = [
  {
    id: "a8c6cae3-cd19-425c-a4c1-a2ed63290854",
    username: "student01",
    fullName: "Nguyễn Văn Học Viên",
    email: "student01@codegym.vn",
    role: "STUDENT",
    status: "ACTIVE",
    createdAt: "2026-07-28T08:00:00Z",
  },
  {
    id: "b7d5bae2-bd18-314b-b3b0-b1dc52180743",
    username: "instructor01",
    fullName: "Trần Thị Giảng Viên",
    email: "instructor01@codegym.vn",
    role: "INSTRUCTOR",
    status: "ACTIVE",
    createdAt: "2026-07-29T09:30:00Z",
  },
  {
    id: "c6e4abd1-ac17-203a-a2a0-a0cb41070632",
    username: "admin01",
    fullName: "Lê Quản Trị Viên",
    email: "admin01@codegym.vn",
    role: "ADMIN",
    status: "ACTIVE",
    createdAt: "2026-07-25T10:15:00Z",
  },
  {
    id: "d5d3zac0-zb16-102a-z1z0-z0ba30060521",
    username: "student_inactive",
    fullName: "Phạm Văn Ngưng Học",
    email: "inactive_student@codegym.vn",
    role: "STUDENT",
    status: "INACTIVE",
    createdAt: "2026-07-20T14:20:00Z",
  },
];

export function UserManagementDemoPage() {
  const [users, setUsers] = useState<User[]>(mockUsers);
  const [keyword, setKeyword] = useState("");
  const [role, setRole] = useState<"" | "STUDENT" | "INSTRUCTOR" | "ADMIN">("");
  const [status, setStatus] = useState<"" | "ACTIVE" | "INACTIVE" | "LOCKED">("");
  const [page, setPage] = useState(0);

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [userToDeactivate, setUserToDeactivate] = useState<User | null>(null);

  // Filtering mock data
  const filteredUsers = users.filter((u) => {
    const matchKeyword =
      !keyword ||
      u.username.toLowerCase().includes(keyword.toLowerCase()) ||
      u.fullName.toLowerCase().includes(keyword.toLowerCase());
    const matchRole = !role || u.role === role;
    const matchStatus = !status || u.status === status;
    return matchKeyword && matchRole && matchStatus;
  });

  const pagination: PageResponse<User> = {
    content: filteredUsers,
    page,
    size: 10,
    totalElements: filteredUsers.length,
    totalPages: 1,
    first: true,
    last: true,
  };

  const handleCreate = async (payload: any) => {
    const newUser: User = {
      id: crypto.randomUUID(),
      username: payload.username,
      fullName: payload.fullName,
      email: payload.email,
      role: payload.role,
      status: "ACTIVE",
      createdAt: new Date().toISOString(),
    };
    setUsers([newUser, ...users]);
  };

  const handleUpdate = async (id: string, payload: any) => {
    setUsers(
      users.map((u) =>
        u.id === id
          ? {
              ...u,
              fullName: payload.fullName ?? u.fullName,
              email: payload.email ?? u.email,
              role: payload.role ?? u.role,
              status: payload.status ?? u.status,
            }
          : u
      )
    );
  };

  const handleDeactivate = async (id: string) => {
    setUsers(
      users.map((u) => (u.id === id ? { ...u, status: "INACTIVE" } : u))
    );
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      <div className="bg-indigo-900 text-white p-4 rounded-xl shadow-md flex items-center justify-between">
        <div>
          <span className="inline-block px-2.5 py-1 bg-indigo-700 text-indigo-100 rounded-md text-xs font-mono font-bold uppercase tracking-wider mr-2">
            Demo Mode (No Backend Required)
          </span>
          <h2 className="text-lg font-bold mt-1">Giao diện Quản lý Người Dùng US-ADM-01</h2>
        </div>
      </div>

      <UserFilterBar
        params={{ keyword, role, status }}
        onSearchChange={setKeyword}
        onRoleChange={(r) => setRole(r as any)}
        onStatusChange={(s) => setStatus(s as any)}
        onCreateClick={() => {
          setSelectedUser(null);
          setIsFormModalOpen(true);
        }}
      />

      <UserTable
        users={filteredUsers}
        pagination={pagination}
        loading={false}
        onPageChange={setPage}
        onEdit={(u) => {
          setSelectedUser(u);
          setIsFormModalOpen(true);
        }}
        onDeactivate={(u) => {
          setUserToDeactivate(u);
          setIsDeactivateModalOpen(true);
        }}
      />

      <UserFormModal
        isOpen={isFormModalOpen}
        user={selectedUser}
        onClose={() => setIsFormModalOpen(false)}
        onSubmitCreate={handleCreate}
        onSubmitUpdate={handleUpdate}
      />

      <UserDeactivateModal
        isOpen={isDeactivateModalOpen}
        user={userToDeactivate}
        onClose={() => setIsDeactivateModalOpen(false)}
        onConfirm={handleDeactivate}
      />
    </div>
  );
}
