export function trackEvent(eventName, payload = {}) {
  const eventPayload = {
    event: eventName,
    ts: Date.now(),
    ...payload,
  };

  if (typeof window === 'undefined') {
    return eventPayload;
  }

  window.dispatchEvent(new CustomEvent('lifewood:analytics', { detail: eventPayload }));

  if (Array.isArray(window.dataLayer)) {
    window.dataLayer.push(eventPayload);
  }

  return eventPayload;
}

