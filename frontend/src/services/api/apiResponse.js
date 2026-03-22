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
  const messageFromApi = error?.response?.data?.message;
  const fallback = error?.message || 'Something went wrong. Please try again.';

  return {
    status: error?.response?.status,
    message: messageFromApi || fallback,
  };
}
