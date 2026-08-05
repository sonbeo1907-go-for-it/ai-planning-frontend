"use client";

import { useState } from "react";
import { AuthenticatedShell } from "@/features/auth";
import {
  useUsers,
  UserFilterBar,
  UserTable,
  UserRoleModal,
  UserActivateModal,
  UserDeactivateModal,
  User,
} from "@/features/user";

export default function AdminUsersPage() {
  return (
    <AuthenticatedShell
      allowedRoles={["ADMIN"]}
      title="Quản lý người dùng"
      description="Quản lý tài khoản học viên, giảng viên và quản trị viên."
    >
      <AdminUsersContent />
    </AuthenticatedShell>
  );
}

function AdminUsersContent() {
  const {
    users,
    pagination,
    params,
    loading,
    error,
    handleSearchChange,
    handleRoleFilter,
    handleStatusFilter,
    handlePageChange,
    updateUserRole,
    activateUser,
    deactivateUser,
  } = useUsers();

  const [isRoleModalOpen, setIsRoleModalOpen] = useState(false);
  const [userToChangeRole, setUserToChangeRole] = useState<User | null>(null);

  const [isActivateModalOpen, setIsActivateModalOpen] = useState(false);
  const [userToActivate, setUserToActivate] = useState<User | null>(null);

  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [userToDeactivate, setUserToDeactivate] = useState<User | null>(null);

  const handleOpenRoleModal = (user: User) => {
    setUserToChangeRole(user);
    setIsRoleModalOpen(true);
  };

  const handleOpenActivateModal = (user: User) => {
    setUserToActivate(user);
    setIsActivateModalOpen(true);
  };

  const handleOpenDeactivateModal = (user: User) => {
    setUserToDeactivate(user);
    setIsDeactivateModalOpen(true);
  };

  return (
    <div className="mx-auto max-w-7xl space-y-6">
      {/* Thông báo lỗi nếu có */}
      {error && (
        <div className="p-4 bg-rose-50 border border-rose-200 text-rose-700 text-sm rounded-xl flex items-center justify-between">
          <div className="flex items-center gap-2">
            <svg className="w-5 h-5 shrink-0" fill="none" viewBox="0 0 24 24" stroke="currentColor">
              <path strokeLinecap="round" strokeLinejoin="round" strokeWidth={2} d="M12 8v4m0 4h.01M21 12a9 9 0 11-18 0 9 9 0 0118 0z" />
            </svg>
            <span>{error}</span>
          </div>
        </div>
      )}

      {/* Filter Bar */}
      <UserFilterBar
        params={params}
        onSearchChange={handleSearchChange}
        onRoleChange={handleRoleFilter}
        onStatusChange={handleStatusFilter}
      />

      {/* Table */}
      <UserTable
        users={users}
        pagination={pagination}
        loading={loading}
        onPageChange={handlePageChange}
        onChangeRole={handleOpenRoleModal}
        onActivate={handleOpenActivateModal}
        onDeactivate={handleOpenDeactivateModal}
      />

      {/* Role Change Modal */}
      <UserRoleModal
        isOpen={isRoleModalOpen}
        user={userToChangeRole}
        onClose={() => setIsRoleModalOpen(false)}
        onConfirm={async (id, role) => {
          await updateUserRole(id, role);
        }}
      />

      {/* Activate Modal */}
      <UserActivateModal
        isOpen={isActivateModalOpen}
        user={userToActivate}
        onClose={() => setIsActivateModalOpen(false)}
        onConfirm={async (id) => {
          await activateUser(id);
        }}
      />

      {/* Deactivate Modal */}
      <UserDeactivateModal
        isOpen={isDeactivateModalOpen}
        user={userToDeactivate}
        onClose={() => setIsDeactivateModalOpen(false)}
        onConfirm={async (id) => {
          await deactivateUser(id);
        }}
      />
    </div>
  );
}
