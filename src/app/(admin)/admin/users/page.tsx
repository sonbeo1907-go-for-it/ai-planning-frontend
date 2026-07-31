"use client";

import { useState } from "react";
import {
  useUsers,
  UserFilterBar,
  UserTable,
  UserFormModal,
  UserDeactivateModal,
  User,
} from "@/features/user";

export default function AdminUsersPage() {
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
    createUser,
    updateUser,
    deactivateUser,
  } = useUsers();

  const [isFormModalOpen, setIsFormModalOpen] = useState(false);
  const [selectedUser, setSelectedUser] = useState<User | null>(null);

  const [isDeactivateModalOpen, setIsDeactivateModalOpen] = useState(false);
  const [userToDeactivate, setUserToDeactivate] = useState<User | null>(null);

  const handleOpenCreateModal = () => {
    setSelectedUser(null);
    setIsFormModalOpen(true);
  };

  const handleOpenEditModal = (user: User) => {
    setSelectedUser(user);
    setIsFormModalOpen(true);
  };

  const handleOpenDeactivateModal = (user: User) => {
    setUserToDeactivate(user);
    setIsDeactivateModalOpen(true);
  };

  return (
    <div className="p-6 max-w-7xl mx-auto space-y-6">
      {/* Header Page */}
      <div className="flex flex-col sm:flex-row sm:items-center sm:justify-between gap-4 border-b border-slate-200/80 pb-5">
        <div>
          <h1 className="text-2xl font-bold text-slate-900 tracking-tight">
            Quản Lý Người Dùng
          </h1>
          <p className="text-sm text-slate-500 mt-1">
            Quản lý tài khoản Học viên, Giảng viên và Quản trị viên theo US-ADM-01.
          </p>
        </div>
      </div>

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
        onCreateClick={handleOpenCreateModal}
      />

      {/* Table */}
      <UserTable
        users={users}
        pagination={pagination}
        loading={loading}
        onPageChange={handlePageChange}
        onEdit={handleOpenEditModal}
        onDeactivate={handleOpenDeactivateModal}
      />

      {/* Modals */}
      <UserFormModal
        isOpen={isFormModalOpen}
        user={selectedUser}
        onClose={() => setIsFormModalOpen(false)}
        onSubmitCreate={async (payload) => {
          await createUser(payload);
        }}
        onSubmitUpdate={async (id, payload) => {
          await updateUser(id, payload);
        }}
      />

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
