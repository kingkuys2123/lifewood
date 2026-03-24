import { useState } from 'react';
import ActionModal from '../../components/shared/portal-modal/ActionModal';
import PasswordStrengthIndicator from '../../components/shared/password/PasswordStrengthIndicator';
import ProfileForm from './components/ProfileForm';
import { useProfileForm } from './hooks/useProfileForm';
import { useToast } from '../../app/providers/useToast';
import './styles/ProfileEditPage.css';

export default function ProfileEditPage() {
  const [passwordModalOpen, setPasswordModalOpen] = useState(false);
  const [passwordForm, setPasswordForm] = useState({
    oldPassword: '',
    newPassword: '',
    confirmPassword: '',
  });
  const [showPassword, setShowPassword] = useState({ old: false, next: false, confirm: false });
  const [isChangingPassword, setIsChangingPassword] = useState(false);
  const toast = useToast();
  const {
    form,
    updateField,
    updateProfilePicture,
    avatarPreview,
    saveProfile,
    changePassword,
    saveState,
    loading,
    error,
  } = useProfileForm();

  const handleChangePassword = async (payload) => {
    if (isChangingPassword) {
      return;
    }

    setIsChangingPassword(true);
    try {
      await changePassword(payload);
      toast.success('Password changed successfully.');
      setPasswordModalOpen(false);
      setPasswordForm({ oldPassword: '', newPassword: '', confirmPassword: '' });
    } catch (err) {
      toast.error(err?.message || 'Unable to change password.');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <section className="profile-edit-page portal-animate-in">
      <header className="profile-edit-header">
        <h1 className="portal-page-title">Edit Profile</h1>
        <p>Keep your account details updated for better collaboration.</p>
      </header>

      {error ? <p className="portal-page-error">{error}</p> : null}

      {loading ? (
        <div className="portal-table-loading">Loading profile...</div>
      ) : (
        <ProfileForm
          form={form}
          updateField={updateField}
          updateProfilePicture={updateProfilePicture}
          avatarPreview={avatarPreview}
          onSaveProfile={saveProfile}
          saveState={saveState}
        />
      )}

      {!loading ? (
        <section className="profile-security-section">
          <div className="profile-security-head">
            <h2>Security</h2>
            <p>Manage your account credentials separately from profile details.</p>
          </div>
          <button
            type="button"
            className="btn btn-ghost"
            onClick={() => setPasswordModalOpen(true)}
          >
            Change Password
          </button>
        </section>
      ) : null}

      <ActionModal
        isOpen={passwordModalOpen}
        title="Change Password"
        message="Use a strong password and keep it private."
        confirmLabel="Update Password"
        loading={isChangingPassword}
        onClose={() => setPasswordModalOpen(false)}
        onConfirm={() => handleChangePassword(passwordForm)}
      >
        <div className="action-modal-field">
          <label htmlFor="profile-old-password">Current Password</label>
          <div className="password-input-wrap">
            <input
              id="profile-old-password"
              type={showPassword.old ? 'text' : 'password'}
              value={passwordForm.oldPassword}
              onChange={(event) => setPasswordForm((prev) => ({ ...prev, oldPassword: event.target.value }))}
              placeholder="Enter current password"
            />
            <button
              type="button"
              className="password-toggle-btn"
              aria-label={showPassword.old ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword.old}
              onClick={() => setShowPassword((prev) => ({ ...prev, old: !prev.old }))}
            >
              {showPassword.old ? '🙈' : '👁'}
            </button>
          </div>
        </div>

        <div className="action-modal-field">
          <label htmlFor="profile-new-password">New Password</label>
          <div className="password-input-wrap">
            <input
              id="profile-new-password"
              type={showPassword.next ? 'text' : 'password'}
              value={passwordForm.newPassword}
              onChange={(event) => setPasswordForm((prev) => ({ ...prev, newPassword: event.target.value }))}
              placeholder="At least 8 characters"
            />
            <button
              type="button"
              className="password-toggle-btn"
              aria-label={showPassword.next ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword.next}
              onClick={() => setShowPassword((prev) => ({ ...prev, next: !prev.next }))}
            >
              {showPassword.next ? '🙈' : '👁'}
            </button>
          </div>
          <PasswordStrengthIndicator password={passwordForm.newPassword} idPrefix="profile-new-password" />
        </div>

        <div className="action-modal-field">
          <label htmlFor="profile-confirm-password">Confirm New Password</label>
          <div className="password-input-wrap">
            <input
              id="profile-confirm-password"
              type={showPassword.confirm ? 'text' : 'password'}
              value={passwordForm.confirmPassword}
              onChange={(event) => setPasswordForm((prev) => ({ ...prev, confirmPassword: event.target.value }))}
              placeholder="Re-enter new password"
            />
            <button
              type="button"
              className="password-toggle-btn"
              aria-label={showPassword.confirm ? 'Hide password' : 'Show password'}
              aria-pressed={showPassword.confirm}
              onClick={() => setShowPassword((prev) => ({ ...prev, confirm: !prev.confirm }))}
            >
              {showPassword.confirm ? '🙈' : '👁'}
            </button>
          </div>
        </div>
      </ActionModal>
    </section>
  );
}
