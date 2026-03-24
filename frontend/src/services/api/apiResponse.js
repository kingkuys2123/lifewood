export function unwrapApiResponse(response) {
  const payload = response?.data;

  if (!payload || typeof payload.status !== 'boolean') {
    throw new Error('Unexpected API response format.');
  }

  if (!payload.status) {
    throw new Error(payload.message || 'Request failed.');
  }

  return payload.data;
}

export function normalizeApiError(error) {
  const isTimeout = error?.code === 'ECONNABORTED' || error?.name === 'TimeoutError';
  const messageFromApi = error?.response?.data?.message;
  const retryAfterHeader = error?.response?.headers?.['retry-after'];
  const retryAfterSeconds = Number.parseInt(retryAfterHeader, 10);
  const fallback = isTimeout
    ? 'Request timed out. Please try again.'
    : (error?.message || 'Something went wrong. Please try again.');

  return {
    status: error?.response?.status,
    message: messageFromApi || fallback,
    retryAfterSeconds: Number.isFinite(retryAfterSeconds) ? retryAfterSeconds : null,
    isTimeout,
  };
}
