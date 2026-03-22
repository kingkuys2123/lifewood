import { useEffect, useState } from 'react';
import { getProfile } from '../services/profileService';

export function useProfileForm() {
  const [form, setForm] = useState(getProfile);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [saveState, setSaveState] = useState('idle');

  const updateField = (field, value) => {
    setForm((prev) => ({ ...prev, [field]: value }));
    if (saveState !== 'idle') {
      setSaveState('idle');
    }
  };

  const updateProfilePicture = (file) => {
    if (!file) {
      return;
    }

    const previewUrl = URL.createObjectURL(file);
    setAvatarPreview((previous) => {
      if (previous.startsWith('blob:')) {
        URL.revokeObjectURL(previous);
      }
      return previewUrl;
    });
    updateField('profilePicture', file.name);
  };

  const saveProfile = () => {
    setSaveState('saving');
    window.setTimeout(() => {
      setSaveState('saved');
    }, 620);
  };

  useEffect(() => {
    if (saveState !== 'saved') {
      return;
    }

    const timer = window.setTimeout(() => {
      setSaveState('idle');
    }, 2200);
    return () => window.clearTimeout(timer);
  }, [saveState]);

  useEffect(
    () => () => {
      if (avatarPreview.startsWith('blob:')) {
        URL.revokeObjectURL(avatarPreview);
      }
    },
    [avatarPreview],
  );

  return { form, updateField, updateProfilePicture, avatarPreview, saveProfile, saveState };
}
