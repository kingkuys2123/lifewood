let errorListener = null;

export function setGlobalApiErrorListener(listener) {
  errorListener = listener;
}

export function emitGlobalApiError(error) {
  if (!error) {
	return;
  }

  errorListener?.(error);
}

