import { useState } from 'react';
import type { FormEvent } from 'react';
import { useAuth } from '../../context/AuthContext';
import { useToast } from '../../context/ToastContext';
import Modal from '../../components/common/Modal';
import { COUNTRIES } from '../../data/countries';
import type { PublicUser, Role } from '../../types/auth';

interface UserFormState {
  firstName: string;
  lastName: string;
  country: string;
  phone: string;
  email: string;
  role: Role;
}

const EMPTY_FORM: UserFormState = {
  firstName: '',
  lastName: '',
  country: '',
  phone: '',
  email: '',
  role: 'user',
};

const inputClass =
  'rounded-lg border border-white/40 bg-white/70 px-3 py-2 text-slate-900 outline-none backdrop-blur-sm focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/30 dark:border-white/10 dark:bg-emerald-950/30 dark:text-white';
const labelClass = 'text-sm font-medium text-slate-700 dark:text-slate-300';

const Admin = () => {
  const {
    currentUser,
    users,
    updateUserRole,
    adminCreateUser,
    adminUpdateUser,
    adminDeleteUser,
    adminUnlockUser,
    adminResetPassword,
  } = useAuth();
  const { showToast } = useToast();

  const [error, setError] = useState<string | null>(null);
  const [notice, setNotice] = useState<string | null>(null);
  const [showAddModal, setShowAddModal] = useState(false);
  const [addForm, setAddForm] = useState<UserFormState>(EMPTY_FORM);
  const [addSubmitting, setAddSubmitting] = useState(false);

  const [editingUser, setEditingUser] = useState<PublicUser | null>(null);
  const [editForm, setEditForm] = useState<UserFormState>(EMPTY_FORM);
  const [editSubmitting, setEditSubmitting] = useState(false);

  const clearMessages = () => {
    setError(null);
    setNotice(null);
  };

  const handleRoleChange = (userId: string, role: Role) => {
    clearMessages();
    const result = updateUserRole(userId, role);
    if (!result.success) {
      setError(result.error ?? 'Unable to update role.');
    } else {
      showToast('User role updated.', 'success');
    }
  };

  const openAddModal = () => {
    clearMessages();
    setAddForm(EMPTY_FORM);
    setShowAddModal(true);
  };

  const submitAddUser = async (event: FormEvent) => {
    event.preventDefault();
    setAddSubmitting(true);
    try {
      const result = await adminCreateUser(addForm);
      if (!result.success) {
        setError(result.error ?? 'Unable to add user.');
        return;
      }
      setShowAddModal(false);
      setNotice(
        `Account created for ${addForm.email}. Temporary password: ${result.tempPassword} — share this with the user securely.`
      );
      showToast('User created successfully.', 'success');
    } finally {
      setAddSubmitting(false);
    }
  };

  const openEditModal = (user: PublicUser) => {
    clearMessages();
    setEditForm({
      firstName: user.firstName,
      lastName: user.lastName,
      country: user.country,
      phone: user.phone,
      email: user.email,
      role: user.role,
    });
    setEditingUser(user);
  };

  const submitEditUser = async (event: FormEvent) => {
    event.preventDefault();
    if (!editingUser) return;
    setEditSubmitting(true);
    try {
      const result = adminUpdateUser(editingUser.id, editForm);
      if (!result.success) {
        setError(result.error ?? 'Unable to update user.');
        return;
      }
      setEditingUser(null);
      setNotice(`Updated details for ${editForm.email}.`);
      showToast('User updated successfully.', 'success');
    } finally {
      setEditSubmitting(false);
    }
  };

  const handleDelete = (user: PublicUser) => {
    clearMessages();
    if (!window.confirm(`Delete ${user.firstName} ${user.lastName}? This cannot be undone.`)) {
      return;
    }
    const result = adminDeleteUser(user.id);
    if (!result.success) {
      setError(result.error ?? 'Unable to delete user.');
    } else {
      setNotice(`${user.email} has been deleted.`);
      showToast('User deleted successfully.', 'success');
    }
  };

  const handleUnlock = (user: PublicUser) => {
    clearMessages();
    const result = adminUnlockUser(user.id);
    if (!result.success) {
      setError(result.error ?? 'Unable to unlock account.');
    } else {
      setNotice(`${user.email} has been unlocked.`);
      showToast('Account unlocked.', 'success');
    }
  };

  const handleResetPassword = async (user: PublicUser) => {
    clearMessages();
    const result = await adminResetPassword(user.id);
    if (!result.success) {
      setError(result.error ?? 'Unable to reset password.');
    } else {
      setNotice(
        `Password reset for ${user.email}. Temporary password: ${result.tempPassword} — share this with the user securely.`
      );
      showToast('Password reset successfully.', 'success');
    }
  };

  return (
    <div className="flex flex-col gap-6">
      <header className="flex flex-wrap items-center justify-between gap-4">
        <div>
          <h1 className="text-3xl font-bold text-slate-900 dark:text-white">Admin dashboard</h1>
          <p className="mt-1 text-slate-500 dark:text-slate-400">
            Welcome, {currentUser?.firstName}. Add, update, and manage registered users below.
          </p>
        </div>
        <button
          type="button"
          onClick={openAddModal}
          className="rounded-lg bg-emerald-700 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-emerald-600"
        >
          Add user
        </button>
      </header>

      {notice && (
        <p className="rounded-lg bg-emerald-50 px-4 py-3 text-center text-sm text-emerald-700 dark:bg-emerald-950/40 dark:text-emerald-300">
          {notice}
        </p>
      )}
      {error && (
        <p className="rounded-lg bg-rose-50 px-4 py-3 text-center text-sm text-rose-600 dark:bg-rose-950/40">
          {error}
        </p>
      )}

      <div className="glass-panel overflow-x-auto rounded-2xl shadow-sm">
        <table className="w-full min-w-[920px] text-left text-sm">
          <thead className="bg-white/30 text-xs uppercase tracking-wide text-slate-600 dark:bg-black/20 dark:text-slate-400">
            <tr>
              <th className="px-4 py-3">Name</th>
              <th className="px-4 py-3">Email</th>
              <th className="px-4 py-3">Country</th>
              <th className="px-4 py-3">Phone</th>
              <th className="px-4 py-3">Status</th>
              <th className="px-4 py-3">Role</th>
              <th className="px-4 py-3">Actions</th>
            </tr>
          </thead>
          <tbody className="divide-y divide-white/30 dark:divide-white/10">
            {users.map((user) => {
              const isSelf = user.id === currentUser?.id;
              return (
                <tr key={user.id}>
                  <td className="px-4 py-3 font-medium text-slate-900 dark:text-white">
                    {user.firstName} {user.lastName}
                    {isSelf && (
                      <span className="ml-2 rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                        You
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{user.email}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{user.country}</td>
                  <td className="px-4 py-3 text-slate-600 dark:text-slate-300">{user.phone}</td>
                  <td className="px-4 py-3">
                    {user.isLocked ? (
                      <span className="rounded-full bg-rose-100 px-2 py-0.5 text-xs font-semibold text-rose-700 dark:bg-rose-950/60 dark:text-rose-300">
                        Locked
                      </span>
                    ) : (
                      <span className="rounded-full bg-emerald-100 px-2 py-0.5 text-xs font-semibold text-emerald-700 dark:bg-emerald-950/60 dark:text-emerald-300">
                        Active
                      </span>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    {isSelf ? (
                      <span className="capitalize text-slate-600 dark:text-slate-300">{user.role}</span>
                    ) : (
                      <select
                        value={user.role}
                        onChange={(e) => handleRoleChange(user.id, e.target.value as Role)}
                        className="rounded-lg border border-white/40 bg-white/70 px-2 py-1.5 text-slate-900 outline-none focus:border-emerald-600 focus:ring-2 focus:ring-emerald-600/30 dark:border-white/10 dark:bg-emerald-950/30 dark:text-white"
                      >
                        <option value="user">user</option>
                        <option value="admin">admin</option>
                      </select>
                    )}
                  </td>
                  <td className="px-4 py-3">
                    <div className="flex flex-wrap gap-2">
                      <button
                        type="button"
                        onClick={() => openEditModal(user)}
                        className="rounded-lg border border-slate-300/60 px-2.5 py-1 text-xs font-semibold text-slate-600 transition-colors hover:bg-white/40 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10"
                      >
                        Edit
                      </button>
                      {user.isLocked && (
                        <button
                          type="button"
                          onClick={() => handleUnlock(user)}
                          className="rounded-lg border border-amber-300 px-2.5 py-1 text-xs font-semibold text-amber-700 transition-colors hover:bg-amber-50 dark:border-amber-700 dark:text-amber-300 dark:hover:bg-amber-950/40"
                        >
                          Unlock
                        </button>
                      )}
                      <button
                        type="button"
                        onClick={() => handleResetPassword(user)}
                        className="rounded-lg border border-slate-300/60 px-2.5 py-1 text-xs font-semibold text-slate-600 transition-colors hover:bg-white/40 dark:border-white/10 dark:text-slate-300 dark:hover:bg-white/10"
                      >
                        Reset password
                      </button>
                      {!isSelf && (
                        <button
                          type="button"
                          onClick={() => handleDelete(user)}
                          className="rounded-lg border border-rose-300 px-2.5 py-1 text-xs font-semibold text-rose-600 transition-colors hover:bg-rose-50 dark:border-rose-800 dark:text-rose-400 dark:hover:bg-rose-950/40"
                        >
                          Delete
                        </button>
                      )}
                    </div>
                  </td>
                </tr>
              );
            })}
          </tbody>
        </table>
      </div>

      {showAddModal && (
        <Modal title="Add user" onClose={() => setShowAddModal(false)}>
          <form onSubmit={submitAddUser} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>First name</label>
                <input
                  required
                  value={addForm.firstName}
                  onChange={(e) => setAddForm({ ...addForm, firstName: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Last name</label>
                <input
                  required
                  value={addForm.lastName}
                  onChange={(e) => setAddForm({ ...addForm, lastName: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Country</label>
              <select
                required
                value={addForm.country}
                onChange={(e) => setAddForm({ ...addForm, country: e.target.value })}
                className={inputClass}
              >
                <option value="" disabled>
                  Select a country
                </option>
                {COUNTRIES.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Phone number</label>
              <input
                type="tel"
                required
                value={addForm.phone}
                onChange={(e) => setAddForm({ ...addForm, phone: e.target.value })}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Email</label>
              <input
                type="email"
                required
                value={addForm.email}
                onChange={(e) => setAddForm({ ...addForm, email: e.target.value })}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Role</label>
              <select
                value={addForm.role}
                onChange={(e) => setAddForm({ ...addForm, role: e.target.value as Role })}
                className={inputClass}
              >
                <option value="user">user</option>
                <option value="admin">admin</option>
              </select>
            </div>

            <p className="text-xs text-slate-500 dark:text-slate-400">
              A temporary password will be generated automatically once the account is created.
            </p>

            <button
              type="submit"
              disabled={addSubmitting}
              className="mt-2 rounded-lg bg-emerald-700 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {addSubmitting ? 'Adding…' : 'Add user'}
            </button>
          </form>
        </Modal>
      )}

      {editingUser && (
        <Modal title={`Edit ${editingUser.firstName} ${editingUser.lastName}`} onClose={() => setEditingUser(null)}>
          <form onSubmit={submitEditUser} className="flex flex-col gap-4">
            <div className="grid grid-cols-1 gap-4 sm:grid-cols-2">
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>First name</label>
                <input
                  required
                  value={editForm.firstName}
                  onChange={(e) => setEditForm({ ...editForm, firstName: e.target.value })}
                  className={inputClass}
                />
              </div>
              <div className="flex flex-col gap-1.5">
                <label className={labelClass}>Last name</label>
                <input
                  required
                  value={editForm.lastName}
                  onChange={(e) => setEditForm({ ...editForm, lastName: e.target.value })}
                  className={inputClass}
                />
              </div>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Country</label>
              <select
                required
                value={editForm.country}
                onChange={(e) => setEditForm({ ...editForm, country: e.target.value })}
                className={inputClass}
              >
                {COUNTRIES.map((name) => (
                  <option key={name} value={name}>
                    {name}
                  </option>
                ))}
              </select>
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Phone number</label>
              <input
                type="tel"
                required
                value={editForm.phone}
                onChange={(e) => setEditForm({ ...editForm, phone: e.target.value })}
                className={inputClass}
              />
            </div>

            <div className="flex flex-col gap-1.5">
              <label className={labelClass}>Email</label>
              <input
                type="email"
                required
                value={editForm.email}
                onChange={(e) => setEditForm({ ...editForm, email: e.target.value })}
                className={inputClass}
              />
            </div>

            <button
              type="submit"
              disabled={editSubmitting}
              className="mt-2 rounded-lg bg-emerald-700 px-5 py-2.5 font-semibold text-white transition-colors hover:bg-emerald-600 disabled:cursor-not-allowed disabled:opacity-60"
            >
              {editSubmitting ? 'Saving…' : 'Save changes'}
            </button>
          </form>
        </Modal>
      )}
    </div>
  );
};

export default Admin;
