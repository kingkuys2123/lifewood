import { useEffect, useState } from 'react';
import {
  changeMyPassword as changeMyPasswordRequest,
  getProfile,
  saveProfile as saveProfileRequest,
} from '../services/profileService';
import { validatePasswordStrength } from '../../auth/utils/passwordValidation';

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

  const changePassword = async ({ oldPassword, newPassword, confirmPassword }) => {
    const trimmedOldPassword = (oldPassword || '').trim();
    const trimmedNewPassword = (newPassword || '').trim();

    if (!trimmedOldPassword) {
      throw new Error('Current password is required.');
    }

    const passwordError = validatePasswordStrength(trimmedNewPassword);
    if (passwordError) {
      throw new Error(passwordError);
    }

    if (trimmedNewPassword !== (confirmPassword || '').trim()) {
      throw new Error('New password and confirmation do not match.');
    }

    await changeMyPasswordRequest({
      oldPassword: trimmedOldPassword,
      newPassword: trimmedNewPassword,
    });
  };

  useEffect(() => {
    let mounted = true;

    const load = async () => {
      setLoading(true);
      setError('');

      try {
        const profile = await getProfile();
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
  }, []);

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
    changePassword,
    saveState,
    loading,
    error,
  };
}
