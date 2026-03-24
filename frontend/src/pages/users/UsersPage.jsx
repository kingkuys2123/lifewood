import { useMemo, useState } from 'react';
import AdminDataTable from '../../components/shared/admin-table/AdminDataTable';
import ActionModal from '../../components/shared/portal-modal/ActionModal';
import {
  createUser,
  deleteUser,
  fetchUserById,
  resetUserPassword,
  updateUser,
} from './services/usersService';
import UsersSummary from './components/UsersSummary';
import { useUsersTable } from './hooks/useUsersTable';
import { useToast } from '../../app/providers/useToast';
import './styles/UsersPage.css';

const INITIAL_USER_FORM = {
  username: '',
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  profilePicture: '',
  role: 'USER',
  password: '',
};

export default function UsersPage() {
  const [pageSize, setPageSize] = useState(5);
  const [modalState, setModalState] = useState({ open: false, action: '', row: null });
  const [loadingAction, setLoadingAction] = useState(false);
  const [userDetail, setUserDetail] = useState(null);
  const [form, setForm] = useState(INITIAL_USER_FORM);
  const [newPassword, setNewPassword] = useState('');
  const toast = useToast();

  const handleCopyEmail = async () => {
    const email = userDetail?.email || modalState.row?.email;
    if (!email) {
      return;
    }

    try {
      await navigator.clipboard.writeText(email);
      toast.success('Email copied to clipboard.');
    } catch {
      toast.error('Unable to copy email.');
    }
  };

  const handleAction = (action, row) => {
    if (action === 'create') {
      setForm(INITIAL_USER_FORM);
      setUserDetail(null);
    }

    if (row?.id && ['view', 'edit'].includes(action)) {
      fetchUserById(row.id)
        .then((payload) => {
          setUserDetail(payload);
          setForm({
            username: payload.username || '',
            firstName: payload.firstName || '',
            lastName: payload.lastName || '',
            email: payload.email || '',
            phoneNumber: payload.phoneNumber || '',
            profilePicture: payload.profilePicture || '',
            role: payload.role || 'USER',
            password: '',
          });
        })
        .catch((err) => toast.error(err?.message || 'Unable to load user details.'));
    }

    setModalState({ open: true, action, row });
  };

  const { table, globalFilter, setGlobalFilter, loading, error, reload } = useUsersTable({
    pageSize,
    onAction: handleAction,
  });

  const modalContent = useMemo(() => {
    if (modalState.action === 'create') {
      return {
        title: 'Create user',
        message: 'Create a new portal user and assign role-based access.',
        confirmLabel: 'Create User',
      };
    }

    if (!modalState.row) {
      return null;
    }

    const fullName = `${modalState.row.firstName} ${modalState.row.lastName}`;
    const map = {
      view: {
        title: 'View user details',
        message: `Preview ${fullName} (${modalState.row.email}) profile information.`,
        confirmLabel: 'Close',
      },
      edit: {
        title: 'Edit user',
        message: `Update profile fields and role for ${fullName}.`,
        confirmLabel: 'Save Changes',
      },
      delete: {
        title: 'Delete user?',
        message: `Remove ${fullName} from the admin portal access list.`,
        confirmLabel: 'Delete User',
        tone: 'danger',
      },
    };

    return map[modalState.action] ?? null;
  }, [modalState.action, modalState.row]);

  const onConfirm = async () => {
    if (modalState.action === 'view') {
      setModalState({ open: false, action: '', row: null });
      setUserDetail(null);
      return;
    }

    try {
      setLoadingAction(true);

      if (modalState.action === 'create') {
        await createUser({
          username: form.username.trim(),
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          phoneNumber: form.phoneNumber.trim(),
          profilePicture: form.profilePicture.trim(),
          role: form.role,
          password: form.password,
        });
        toast.success('User created successfully.');
      }

      if (modalState.action === 'edit' && modalState.row) {
        await updateUser(modalState.row.id, {
          firstName: form.firstName.trim(),
          lastName: form.lastName.trim(),
          email: form.email.trim(),
          phoneNumber: form.phoneNumber.trim(),
          profilePicture: form.profilePicture.trim(),
          role: form.role,
        });
        if (newPassword.trim()) {
          await resetUserPassword(modalState.row.id, { newPassword: newPassword.trim() });
        }
        toast.success('User updated successfully.');
      }

      if (modalState.action === 'delete' && modalState.row) {
        await deleteUser(modalState.row.id);
        toast.success('User deleted successfully.');
      }

      setModalState({ open: false, action: '', row: null });
      setUserDetail(null);
      setNewPassword('');
      await reload();
    } catch (err) {
      toast.error(err?.message || 'Unable to process user action.');
    } finally {
      setLoadingAction(false);
    }
  };

  return (
    <section className="portal-page">
      <UsersSummary />

      {error ? <p className="portal-page-error">{error}</p> : null}

      {loading ? (
        <div className="portal-table-loading">Loading users...</div>
      ) : (
        <AdminDataTable
          title="Users"
          table={table}
          globalFilter={globalFilter}
          onGlobalFilterChange={setGlobalFilter}
          createButtonLabel="Create User"
          onCreate={() => handleAction('create', null)}
          pageSize={pageSize}
          onPageSizeChange={setPageSize}
        />
      )}

      <ActionModal
        isOpen={modalState.open && Boolean(modalContent)}
        title={modalContent?.title ?? ''}
        message={modalContent?.message ?? ''}
        confirmLabel={modalContent?.confirmLabel ?? 'Confirm'}
        tone={modalContent?.tone ?? 'default'}
        loading={loadingAction}
        hideCancel={modalState.action === 'view'}
        onClose={() => setModalState({ open: false, action: '', row: null })}
        onConfirm={onConfirm}
      >
        {modalState.action === 'view' && modalState.row ? (
          <>
            <div className="action-modal-meta action-modal-meta--view">
              <p><strong>Username</strong><span>{userDetail?.username || modalState.row.username}</span></p>
              <p>
                <strong>Full Name</strong>
                <span>{`${userDetail?.firstName || modalState.row.firstName} ${userDetail?.lastName || modalState.row.lastName}`}</span>
              </p>
              <p><strong>Email</strong><span>{userDetail?.email || modalState.row.email}</span></p>
              <p><strong>Role</strong><span>{userDetail?.role || modalState.row.role}</span></p>
              <p><strong>Phone Number</strong><span>{userDetail?.phoneNumber || '-'}</span></p>
              <p><strong>Profile Image</strong><span>{userDetail?.profilePicture ? 'Configured' : 'Not set'}</span></p>
            </div>
            <div className="action-modal-resume-actions">
              <button type="button" className="btn btn-ghost" onClick={handleCopyEmail}>
                Copy Email
              </button>
              {userDetail?.profilePicture ? (
                <a className="btn btn-forest" href={userDetail.profilePicture} target="_blank" rel="noreferrer">
                  Open Profile Image
                </a>
              ) : null}
            </div>
          </>
        ) : null}

        {(modalState.action === 'create' || modalState.action === 'edit') ? (
          <div className="action-modal-grid">
            <div className="action-modal-field">
              <label htmlFor="usr-username">Username</label>
              <input
                id="usr-username"
                value={form.username}
                disabled={modalState.action === 'edit'}
                onChange={(event) => setForm((prev) => ({ ...prev, username: event.target.value }))}
              />
            </div>
            <div className="action-modal-field">
              <label htmlFor="usr-role">Role</label>
              <select
                id="usr-role"
                value={form.role}
                onChange={(event) => setForm((prev) => ({ ...prev, role: event.target.value }))}
              >
                <option value="USER">USER</option>
                <option value="ADMIN">ADMIN</option>
              </select>
            </div>
            <div className="action-modal-field">
              <label htmlFor="usr-first">First Name</label>
              <input
                id="usr-first"
                value={form.firstName}
                onChange={(event) => setForm((prev) => ({ ...prev, firstName: event.target.value }))}
              />
            </div>
            <div className="action-modal-field">
              <label htmlFor="usr-last">Last Name</label>
              <input
                id="usr-last"
                value={form.lastName}
                onChange={(event) => setForm((prev) => ({ ...prev, lastName: event.target.value }))}
              />
            </div>
            <div className="action-modal-field">
              <label htmlFor="usr-email">Email</label>
              <input
                id="usr-email"
                type="email"
                value={form.email}
                onChange={(event) => setForm((prev) => ({ ...prev, email: event.target.value }))}
              />
            </div>
            <div className="action-modal-field">
              <label htmlFor="usr-phone">Phone Number</label>
              <input
                id="usr-phone"
                value={form.phoneNumber}
                onChange={(event) => setForm((prev) => ({ ...prev, phoneNumber: event.target.value }))}
              />
            </div>
            <div className="action-modal-field" style={{ gridColumn: '1 / -1' }}>
              <label htmlFor="usr-avatar">Profile Picture URL</label>
              <input
                id="usr-avatar"
                value={form.profilePicture}
                onChange={(event) => setForm((prev) => ({ ...prev, profilePicture: event.target.value }))}
              />
            </div>
            {modalState.action === 'create' ? (
              <div className="action-modal-field" style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="usr-password">Password</label>
                <input
                  id="usr-password"
                  type="password"
                  value={form.password}
                  onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                  placeholder="At least 8 characters"
                />
              </div>
            ) : (
              <div className="action-modal-field" style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="usr-new-password">Reset Password (optional)</label>
                <input
                  id="usr-new-password"
                  type="password"
                  value={newPassword}
                  onChange={(event) => setNewPassword(event.target.value)}
                  placeholder="Leave blank to keep existing password"
                />
              </div>
            )}
          </div>
        ) : null}
      </ActionModal>
    </section>
  );
}
