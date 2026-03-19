import { useState } from 'react';
import { getProfile } from '../services/profileService';

export function useProfileForm() {
  const [form, setForm] = useState(getProfile);

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
  };

  return { form, updateField };
}
