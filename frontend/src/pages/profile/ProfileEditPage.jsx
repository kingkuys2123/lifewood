import ProfileForm from './components/ProfileForm';
import { useProfileForm } from './hooks/useProfileForm';
import './styles/ProfileEditPage.css';

export default function ProfileEditPage() {
  const { form, updateField } = useProfileForm();

  return (
    <section className="profile-edit-page">
      <h1>Edit Profile</h1>
      <p>Keep your account details updated for better collaboration.</p>
      <ProfileForm form={form} updateField={updateField} />
    </section>
  );
}
