import ProfileForm from './components/ProfileForm';
import { useProfileForm } from './hooks/useProfileForm';
import './styles/ProfileEditPage.css';

export default function ProfileEditPage() {
  const {
    form,
    updateField,
    updateProfilePicture,
    avatarPreview,
    saveProfile,
    saveState,
    loading,
    error,
  } = useProfileForm();

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
    </section>
  );
}
