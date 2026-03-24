import { motion } from 'framer-motion';

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
  saveState,
}) {
  const initials = getInitials(form.firstName, form.lastName);

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
    </MotionForm>
  );
}
