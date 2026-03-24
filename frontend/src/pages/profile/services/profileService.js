import {
  changeMyPassword as changeMyPasswordRequest,
  fetchMyProfile,
  updateMyProfile,
} from '../../../services/users/usersService';

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

export async function getProfile() {
  const user = await fetchMyProfile();
  return mapProfile(user);
}

export async function saveProfile(profile) {
  const payload = {
    email: profile.email,
    profilePicture: profile.profilePicture,
    firstName: profile.firstName,
    lastName: profile.lastName,
    phoneNumber: profile.phoneNumber,
  };

  const user = await updateMyProfile(payload);
  return mapProfile(user);
}

export async function changeMyPassword(payload) {
  await changeMyPasswordRequest(payload);
}

