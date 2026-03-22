import { cacheUserId, getCachedUserId } from './authSession';
import { fetchMyProfile } from '../users/usersService';

export async function resolveCurrentUserId() {
  const cachedId = getCachedUserId();
  if (cachedId) {
    return cachedId;
  }

  const me = await fetchMyProfile();
  if (me?.id) {
    cacheUserId(me.id);
    return me.id;
  }

  return null;
}
