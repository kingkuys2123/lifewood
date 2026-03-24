import { useMemo, useRef, useState } from 'react';
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
import PasswordStrengthIndicator from '../../components/shared/password/PasswordStrengthIndicator';
import { validatePasswordStrength } from '../auth/utils/passwordValidation';
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
  const profileImageInputRef = useRef(null);
  const [pageSize, setPageSize] = useState(5);
  const [modalState, setModalState] = useState({ open: false, action: '', row: null });
  const [loadingAction, setLoadingAction] = useState(false);
  const [userDetail, setUserDetail] = useState(null);
  const [form, setForm] = useState(INITIAL_USER_FORM);
  const [resetPasswordModalOpen, setResetPasswordModalOpen] = useState(false);
  const [newPassword, setNewPassword] = useState('');
  const [showCreatePassword, setShowCreatePassword] = useState(false);
  const [showResetPassword, setShowResetPassword] = useState(false);
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

  const handleProfilePictureUpload = async (file) => {
    if (!file) {
      return;
    }

    try {
      const nextValue = await new Promise((resolve, reject) => {
        const reader = new FileReader();
        reader.onload = () => resolve(typeof reader.result === 'string' ? reader.result : '');
        reader.onerror = () => reject(new Error('Unable to read selected image.'));
        reader.readAsDataURL(file);
      });
      setForm((prev) => ({ ...prev, profilePicture: nextValue || '' }));
    } catch (err) {
      toast.error(err?.message || 'Unable to process selected image.');
    }
  };

  const handleRemoveProfilePicture = () => {
    setForm((prev) => ({ ...prev, profilePicture: '' }));
    if (profileImageInputRef.current) {
      profileImageInputRef.current.value = '';
    }
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
        const createPasswordError = validatePasswordStrength(form.password);
        if (createPasswordError) {
          toast.error(createPasswordError);
          return;
        }

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
        toast.success('User updated successfully.');
      }

      if (modalState.action === 'delete' && modalState.row) {
        await deleteUser(modalState.row.id);
        toast.success('User deleted successfully.');
      }

      setModalState({ open: false, action: '', row: null });
      setUserDetail(null);
      setNewPassword('');
      setResetPasswordModalOpen(false);
      await reload();
    } catch (err) {
      toast.error(err?.message || 'Unable to process user action.');
    } finally {
      setLoadingAction(false);
    }
  };

  const handleResetPasswordConfirm = async () => {
    if (!modalState.row?.id) {
      toast.error('Unable to identify selected user.');
      return;
    }

    const candidate = newPassword.trim();
    const resetPasswordError = validatePasswordStrength(candidate);
    if (resetPasswordError) {
      toast.error(resetPasswordError);
      return;
    }

    try {
      setLoadingAction(true);
      await resetUserPassword(modalState.row.id, { newPassword: candidate });
      setNewPassword('');
      setResetPasswordModalOpen(false);
      toast.success('User password reset successfully.');
    } catch (err) {
      toast.error(err?.message || 'Unable to reset user password.');
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
        onClose={() => {
          setModalState({ open: false, action: '', row: null });
          setResetPasswordModalOpen(false);
          setNewPassword('');
        }}
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
              <p className="action-modal-meta-email-row">
                <strong>Email</strong>
                <span>{userDetail?.email || modalState.row.email}</span>
                <button type="button" className="btn btn-ghost action-modal-inline-btn" onClick={handleCopyEmail}>
                  Copy Email
                </button>
              </p>
              <p><strong>Role</strong><span>{userDetail?.role || modalState.row.role}</span></p>
              <p><strong>Phone Number</strong><span>{userDetail?.phoneNumber || '-'}</span></p>
              <p><strong>Profile Image</strong><span>{userDetail?.profilePicture ? 'Configured' : 'Not set'}</span></p>
            </div>
            {userDetail?.profilePicture ? (
              <div className="action-modal-user-image-wrap">
                <img
                  src={userDetail.profilePicture}
                  alt="User profile"
                  className="action-modal-user-image-preview"
                />
              </div>
            ) : null}
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
              <label>Profile Picture</label>
              <div className="users-profile-picture-row">
                <div className="users-profile-picture-preview-wrap">
                  {form.profilePicture ? (
                    <img src={form.profilePicture} alt="Profile preview" className="users-profile-picture-preview" />
                  ) : (
                    <span className="users-profile-picture-fallback">No image</span>
                  )}
                </div>
                <div className="users-profile-picture-actions">
                  <button
                    type="button"
                    className="btn btn-ghost"
                    onClick={() => profileImageInputRef.current?.click()}
                  >
                    {form.profilePicture ? 'Change Image' : 'Upload Image'}
                  </button>
                  {form.profilePicture ? (
                    <button type="button" className="btn btn-ghost" onClick={handleRemoveProfilePicture}>
                      Delete
                    </button>
                  ) : null}
                  <input
                    ref={profileImageInputRef}
                    id="usr-avatar-upload"
                    type="file"
                    accept="image/*"
                    className="users-profile-picture-file-input"
                    onChange={(event) => handleProfilePictureUpload(event.target.files?.[0])}
                  />
                </div>
              </div>
            </div>
            {modalState.action === 'create' ? (
              <div className="action-modal-field" style={{ gridColumn: '1 / -1' }}>
                <label htmlFor="usr-password">Password</label>
                <div className="password-input-wrap">
                  <input
                    id="usr-password"
                    type={showCreatePassword ? 'text' : 'password'}
                    value={form.password}
                    onChange={(event) => setForm((prev) => ({ ...prev, password: event.target.value }))}
                    placeholder="At least 8 characters"
                  />
                  <button
                    type="button"
                    className="password-toggle-btn"
                    aria-label={showCreatePassword ? 'Hide password' : 'Show password'}
                    aria-pressed={showCreatePassword}
                    onClick={() => setShowCreatePassword((prev) => !prev)}
                  >
                    {showCreatePassword ? '🙈' : '👁'}
                  </button>
                </div>
                <PasswordStrengthIndicator password={form.password} idPrefix="create-user-password" />
              </div>
            ) : (
              <div className="action-modal-field" style={{ gridColumn: '1 / -1' }}>
                <label>Password Management</label>
                <button
                  type="button"
                  className="btn btn-ghost"
                  onClick={() => setResetPasswordModalOpen(true)}
                >
                  Reset Password
                </button>
              </div>
            )}
          </div>
        ) : null}
      </ActionModal>

      <ActionModal
        isOpen={resetPasswordModalOpen && modalState.action === 'edit'}
        title="Reset user password"
        message={`Set a new password for ${form.firstName || modalState.row?.firstName || 'this user'}.`}
        confirmLabel="Reset Password"
        loading={loadingAction}
        onClose={() => {
          setResetPasswordModalOpen(false);
          setNewPassword('');
        }}
        onConfirm={handleResetPasswordConfirm}
      >
        <div className="action-modal-field">
          <label htmlFor="usr-new-password">New Password</label>
          <div className="password-input-wrap">
            <input
              id="usr-new-password"
              type={showResetPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="At least 8 characters"
            />
            <button
              type="button"
              className="password-toggle-btn"
              aria-label={showResetPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showResetPassword}
              onClick={() => setShowResetPassword((prev) => !prev)}
            >
              {showResetPassword ? '🙈' : '👁'}
            </button>
          </div>
          <PasswordStrengthIndicator password={newPassword} idPrefix="reset-user-password" />
        </div>
      </ActionModal>
    </section>
  );
}
