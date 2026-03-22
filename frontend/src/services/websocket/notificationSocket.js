import { Client } from '@stomp/stompjs';
import SockJS from 'sockjs-client/dist/sockjs';
import { getAccessToken } from '../auth/tokenStorage';

const WS_BASE_URL = import.meta.env.VITE_WS_URL || 'http://localhost:8080';

export function createNotificationSocket(onMessage) {
  const token = getAccessToken();

  const client = new Client({
    reconnectDelay: 5000,
    connectHeaders: token ? { Authorization: `Bearer ${token}` } : {},
    webSocketFactory: () => new SockJS(`${WS_BASE_URL}/ws`),
    onConnect: () => {
      client.subscribe('/user/queue/notifications', (frame) => {
        if (!frame.body) {
          return;
        }

        try {
          onMessage(JSON.parse(frame.body));
        } catch {
          onMessage(null);
        }
      });
    },
    debug: () => {},
  });

  client.activate();
  return client;
}
