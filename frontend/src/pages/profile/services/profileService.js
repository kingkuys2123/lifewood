import { resolveCurrentUserId } from '../../../services/auth/currentUserService';
import { fetchUserById, updateUser } from '../../../services/users/usersService';

function mapProfile(user) {
  return {
    id: user.id,
    firstName: user.firstName || '',
    lastName: user.lastName || '',
    email: user.email || '',
    phoneNumber: user.phoneNumber || '',
    school: '',
    profilePicture: user.profilePicture || '',
    role: user.role,
  };
}

export async function getProfile(username) {
  const userId = await resolveCurrentUserId(username);
  if (!userId) {
    throw new Error('Unable to resolve current user profile.');
  }

  const user = await fetchUserById(userId);
  return mapProfile(user);
}

export async function saveProfile(profile) {
  if (!profile?.id) {
    throw new Error('Missing profile user id.');
  }

  const payload = {
    email: profile.email,
    profilePicture: profile.profilePicture,
    firstName: profile.firstName,
    lastName: profile.lastName,
    phoneNumber: profile.phoneNumber,
    role: profile.role,
  };

  const user = await updateUser(profile.id, payload);
  return mapProfile(user);
}
