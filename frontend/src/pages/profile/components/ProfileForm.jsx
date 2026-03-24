import { motion } from 'framer-motion';
import { useState } from 'react';
import PasswordStrengthIndicator from '../../../components/shared/password/PasswordStrengthIndicator';

const MotionDiv = motion.div;
const MotionLabel = motion.label;
const MotionParagraph = motion.p;
const MotionForm = motion.form;

const FIELDS = [
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'phoneNumber', label: 'Phone Number' },
  { key: 'school', label: 'School/University' },
];

function getInitials(firstName, lastName) {
  return `${firstName?.[0] ?? ''}${lastName?.[0] ?? ''}`.toUpperCase() || 'LW';
}

export default function ProfileForm({
  form,
  updateField,
  updateProfilePicture,
  avatarPreview,
  onSaveProfile,
  onChangePassword,
  saveState,
}) {
  const initials = getInitials(form.firstName, form.lastName);
  const [oldPassword, setOldPassword] = useState('');
  const [newPassword, setNewPassword] = useState('');
  const [confirmPassword, setConfirmPassword] = useState('');
  const [showOldPassword, setShowOldPassword] = useState(false);
  const [showNewPassword, setShowNewPassword] = useState(false);
  const [showConfirmPassword, setShowConfirmPassword] = useState(false);
  const [isChangingPassword, setIsChangingPassword] = useState(false);

  const handlePasswordSubmit = async (event) => {
    event.preventDefault();
    if (!onChangePassword || isChangingPassword) {
      return;
    }

    setIsChangingPassword(true);
    try {
      await onChangePassword({ oldPassword, newPassword, confirmPassword });
      setOldPassword('');
      setNewPassword('');
      setConfirmPassword('');
    } finally {
      setIsChangingPassword(false);
    }
  };

  return (
    <MotionForm
      className="profile-form"
      initial={{ opacity: 0, y: 8 }}
      animate={{ opacity: 1, y: 0 }}
      transition={{ duration: 0.26 }}
      onSubmit={(event) => {
        event.preventDefault();
        onSaveProfile();
      }}
    >
      <MotionDiv
        className="profile-picture-row"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
      >
        <div className="profile-avatar-wrap">
          <div className="profile-avatar">
            {avatarPreview ? (
              <img src={avatarPreview} alt="Profile preview" className="profile-avatar-image" />
            ) : (
              initials
            )}
          </div>
          <span className="profile-avatar-overlay">Update</span>
        </div>
        <div className="profile-picture-upload">
          <span>Profile Picture</span>
          <span className="profile-picture-upload-meta">
            PNG or JPG up to 5MB. Ideal ratio: 1:1.
          </span>
          <div className="profile-picture-upload-control">
            <span className="profile-file-btn">Choose File</span>
            <span className="profile-file-name">{form.profilePicture || 'No file chosen'}</span>
            <input
              type="file"
              accept="image/*"
              onChange={(event) => updateProfilePicture(event.target.files?.[0])}
            />
          </div>
        </div>
      </MotionDiv>

      <div className="profile-form-grid">
        {FIELDS.map((field, index) => (
          <MotionLabel
            className="profile-field"
            key={field.key}
            initial={{ opacity: 0, y: 8 }}
            animate={{ opacity: 1, y: 0 }}
            transition={{ delay: 0.05 + index * 0.04 }}
          >
            {field.label}
            <input
              className="profile-field-input"
              type={field.type || 'text'}
              value={form[field.key]}
              onChange={(event) => updateField(field.key, event.target.value)}
            />
          </MotionLabel>
        ))}
      </div>

      <div className="profile-form-footer">
        <button
          type="submit"
          className="btn btn-forest profile-save-btn"
          disabled={saveState === 'saving'}
        >
          <span>{saveState === 'saving' ? 'Saving...' : 'Save Profile'}</span>
          <span className="profile-save-btn-icon" aria-hidden="true">
            {'->'}
          </span>
        </button>
        {saveState === 'saved' ? (
          <MotionParagraph
            className="profile-save-feedback"
            initial={{ opacity: 0, y: 4 }}
            animate={{ opacity: 1, y: 0 }}
          >
            Profile updated successfully.
          </MotionParagraph>
        ) : null}
      </div>

      <MotionDiv
        className="profile-password-card"
        initial={{ opacity: 0, y: 8 }}
        animate={{ opacity: 1, y: 0 }}
        transition={{ delay: 0.12 }}
      >
        <h3>Change Password</h3>
        <p>Keep your account secure with a fresh, strong password.</p>

        <div className="profile-password-grid">
          <label htmlFor="profile-old-password">Current Password</label>
          <div className="profile-password-input-wrap">
            <input
              id="profile-old-password"
              type={showOldPassword ? 'text' : 'password'}
              value={oldPassword}
              onChange={(event) => setOldPassword(event.target.value)}
              placeholder="Enter current password"
              required
            />
            <button
              type="button"
              className="profile-password-toggle"
              aria-label={showOldPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showOldPassword}
              onClick={() => setShowOldPassword((prev) => !prev)}
            >
              {showOldPassword ? '🙈' : '👁'}
            </button>
          </div>

          <label htmlFor="profile-new-password">New Password</label>
          <div className="profile-password-input-wrap">
            <input
              id="profile-new-password"
              type={showNewPassword ? 'text' : 'password'}
              value={newPassword}
              onChange={(event) => setNewPassword(event.target.value)}
              placeholder="At least 8 characters"
              required
            />
            <button
              type="button"
              className="profile-password-toggle"
              aria-label={showNewPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showNewPassword}
              onClick={() => setShowNewPassword((prev) => !prev)}
            >
              {showNewPassword ? '🙈' : '👁'}
            </button>
          </div>
          <PasswordStrengthIndicator password={newPassword} idPrefix="profile-new-password" />

          <label htmlFor="profile-confirm-password">Confirm New Password</label>
          <div className="profile-password-input-wrap">
            <input
              id="profile-confirm-password"
              type={showConfirmPassword ? 'text' : 'password'}
              value={confirmPassword}
              onChange={(event) => setConfirmPassword(event.target.value)}
              placeholder="Re-enter new password"
              required
            />
            <button
              type="button"
              className="profile-password-toggle"
              aria-label={showConfirmPassword ? 'Hide password' : 'Show password'}
              aria-pressed={showConfirmPassword}
              onClick={() => setShowConfirmPassword((prev) => !prev)}
            >
              {showConfirmPassword ? '🙈' : '👁'}
            </button>
          </div>

          <button
            type="button"
            className="btn btn-forest profile-password-btn"
            disabled={isChangingPassword}
            onClick={handlePasswordSubmit}
          >
            {isChangingPassword ? 'Updating...' : 'Update Password'}
          </button>
        </div>
      </MotionDiv>
    </MotionForm>
  );
}
