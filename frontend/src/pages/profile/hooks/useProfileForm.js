import { useEffect, useState } from 'react';
import { useAuth } from '../../../app/providers/useAuth';
import { getProfile, saveProfile as saveProfileRequest } from '../services/profileService';

const EMPTY_FORM = {
  id: null,
  firstName: '',
  lastName: '',
  email: '',
  phoneNumber: '',
  school: '',
  profilePicture: '',
  role: 'USER',
};

export function useProfileForm() {
  const { user } = useAuth();
  const [form, setForm] = useState(EMPTY_FORM);
  const [avatarPreview, setAvatarPreview] = useState('');
  const [saveState, setSaveState] = useState('idle');
  const [loading, setLoading] = useState(true);
  const [error, setError] = useState('');

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

  const saveProfile = async () => {
    setSaveState('saving');
    setError('');

    try {
      const saved = await saveProfileRequest(form);
      setForm(saved);
      setSaveState('saved');
    } catch (err) {
      setSaveState('idle');
      setError(err?.message || 'Unable to save profile.');
    }
  };

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError('');

      try {
        const profile = await getProfile(user?.username);
        if (mounted) {
          setForm(profile);
        }
      } catch (err) {
        if (mounted) {
          setError(err?.message || 'Unable to load profile.');
        }
      } finally {
        if (mounted) {
          setLoading(false);
        }
      }
    };

    load();

    return () => {
      mounted = false;
    };
  }, [user?.username]);

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

  return {
    form,
    updateField,
    updateProfilePicture,
    avatarPreview,
    saveProfile,
    saveState,
    loading,
    error,
  };
}
