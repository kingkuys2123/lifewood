import ProfileForm from './components/ProfileForm';
import { useProfileForm } from './hooks/useProfileForm';
import './styles/ProfileEditPage.css';

export default function ProfileEditPage() {
  const { form, updateField } = useProfileForm();

  return (
    <section className="profile-edit-page portal-animate-in">
      <h1 className="portal-page-title">Edit Profile</h1>
      <p>Keep your account details updated for better collaboration.</p>
      <ProfileForm form={form} updateField={updateField} />
    </section>
  );
}
