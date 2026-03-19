export function authenticateUser(payload) {
  return {
    ok: Boolean(payload?.username && payload?.password),
    token: 'static-token-for-ui-demo',
  };
}

