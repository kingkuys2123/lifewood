import { cacheUserId, getCachedUserId } from './authSession';
import { fetchUsers } from '../users/usersService';

export async function resolveCurrentUserId(username) {
  const cachedId = getCachedUserId();
  if (cachedId) {
    return cachedId;
  }

  if (!username) {
    return null;
  }

  const page = await fetchUsers({ keyword: username, pageIndex: 0, pageSize: 50 });
  const match = page?.content?.find((item) => item.username === username);

  if (match?.id) {
    cacheUserId(match.id);
    return match.id;
  }

  return null;
}
