import { io, Socket } from "socket.io-client";
import { HEALTH_BASE } from "./api";

// Backend Socket.IO namespace'i /v1/notifications/stream (notifications.gateway.ts) --
// HEALTH_BASE zaten prefix'siz kök origin, namespace burada elle ekleniyor (API_BASE
// kullanılırsa /v1 iki kez eklenmiş olurdu). Kimlik doğrulama handshake.auth.token
// üzerinden (bkz. gateway#extractToken), header değil -- socket.io bağlantısında
// Authorization header taşınamıyor.
export interface NotificationSocketEvent {
  id: string;
  type: string;
  title: string;
  body: string | null;
  payload: Record<string, unknown> | null;
  created_at: string;
}

let socket: Socket | null = null;

export function connectNotificationsSocket(
  token: string,
  onNotification: (n: NotificationSocketEvent) => void,
  onUnreadCount: (count: number) => void
): Socket {
  if (socket) {
    socket.disconnect();
  }

  socket = io(`${HEALTH_BASE}/v1/notifications/stream`, {
    auth: { token },
    transports: ["websocket"],
  });

  socket.on("notification:new", (msg: { type: string; data: NotificationSocketEvent }) => {
    onNotification(msg.data);
  });

  socket.on("notification:unread_count", (msg: { type: string; data: { count: number } }) => {
    onUnreadCount(msg.data.count);
  });

  return socket;
}

export function markNotificationReadOverSocket(id: string) {
  socket?.emit("notification:mark_read", { data: { id } });
}

export function disconnectNotificationsSocket() {
  socket?.disconnect();
  socket = null;
}
