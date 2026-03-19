const FIELDS = [
  { key: 'firstName', label: 'First Name' },
  { key: 'lastName', label: 'Last Name' },
  { key: 'email', label: 'Email', type: 'email' },
  { key: 'phoneNumber', label: 'Phone Number' },
  { key: 'school', label: 'School/University' },
];

export default function ProfileForm({ form, updateField }) {
  return (
    <form className="profile-form" onSubmit={(event) => event.preventDefault()}>
      <div className="profile-picture-row">
        <div className="profile-avatar">SC</div>
        <label className="profile-picture-upload">
          Profile Picture
          <input
            type="file"
            accept="image/*"
            onChange={(event) =>
              updateField('profilePicture', event.target.files?.[0]?.name ?? '')
            }
          />
        </label>
      </div>

      <div className="profile-form-grid">
        {FIELDS.map((field) => (
          <label key={field.key}>
            {field.label}
            <input
              type={field.type || 'text'}
              value={form[field.key]}
              onChange={(event) => updateField(field.key, event.target.value)}
            />
          </label>
        ))}
      </div>

      <button type="submit" className="btn btn-forest">
        Save Profile
      </button>
    </form>
  );
}
