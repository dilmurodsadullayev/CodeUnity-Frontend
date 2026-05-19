import {
  addNotification,
  markNotificationAsReadLocally,
  setNotifications,
  wsConnected,
  wsDisconnected,
  setLoading,
  clearNotifications,
} from "../features/notificationSlice";

import { WS_URL } from "../services/config";

let currentWebSocket = null;
let reconnectTimer = null;
let reconnectAttempts = 0;
let manuallyClosed = false;

const MAX_RECONNECT_ATTEMPTS = 8;

const getWebSocketUrl = () => {
  if (WS_URL) return WS_URL;

  const wsProtocol = window.location.protocol === "https:" ? "wss:" : "ws:";
  return `${wsProtocol}//${window.location.host}/ws/notifications/`;
};

const safeJsonParse = (value) => {
  try {
    return JSON.parse(value);
  } catch (error) {
    console.error("WebSocket JSON parse xatosi:", error);
    return null;
  }
};

const normalizeNotification = (payload) => {
  if (!payload) return null;

  // Backend ba’zan { notification: {...} } qilib yuborishi mumkin
  const raw = payload.notification || payload.data || payload;

  if (!raw) return null;

  return {
    id: raw.id || raw.notification_id,
    sender: raw.sender || null,
    recipient: raw.recipient || null,

    // MUHIM: backend modelda content_type bor
    content_type: raw.content_type || raw.type || "info",

    object_id: raw.object_id || null,
    message: raw.message || raw.text || raw.body || "",
    created_at: raw.created_at || new Date().toISOString(),

    is_read: Boolean(raw.is_read),
  };
};

const isSocketOpen = () => {
  return currentWebSocket && currentWebSocket.readyState === WebSocket.OPEN;
};

const isSocketConnecting = () => {
  return currentWebSocket && currentWebSocket.readyState === WebSocket.CONNECTING;
};

const clearReconnectTimer = () => {
  if (reconnectTimer) {
    clearTimeout(reconnectTimer);
    reconnectTimer = null;
  }
};

export const initWebSocket = (dispatch, isAuthenticated) => {
  if (!isAuthenticated) {
    console.log("Foydalanuvchi login qilmagan, WebSocket ulanmaydi.");
    return null;
  }

  if (isSocketOpen() || isSocketConnecting()) {
    console.log("WebSocket allaqachon ulangan yoki ulanmoqda.");
    return currentWebSocket;
  }

  manuallyClosed = false;
  clearReconnectTimer();

  dispatch(setLoading(true));

  const wsUrl = getWebSocketUrl();

  try {
    currentWebSocket = new WebSocket(wsUrl);
  } catch (error) {
    console.error("WebSocket yaratishda xato:", error);
    dispatch(wsDisconnected("WebSocket yaratishda xato."));
    return null;
  }

  currentWebSocket.onopen = () => {
    console.log("✅ WebSocket connected:", wsUrl);

    reconnectAttempts = 0;
    dispatch(wsConnected());

    sendWebSocketMessage({
      command: "fetch_unread_notifications",
    });
  };

  currentWebSocket.onmessage = (event) => {
    const data = safeJsonParse(event.data);

    if (!data) return;

    console.log("WebSocket message received:", data);

    if (data.command === "unread_notifications") {
      const notifications = Array.isArray(data.notifications)
        ? data.notifications.map(normalizeNotification).filter(Boolean)
        : [];

      dispatch(setNotifications(notifications));
      return;
    }

    if (data.command === "mark_as_read" && data.status === "success") {
      const notificationId = data.notification_id || data.id;

      if (notificationId) {
        dispatch(markNotificationAsReadLocally(notificationId));
      }

      return;
    }

    if (data.command === "mark_all_as_read" && data.status === "success") {
      dispatch({
        type: "notifications/markAllNotificationsAsReadLocally",
      });
      return;
    }

    // Yangi real-time notification:
    // backenddan {content_type: "coin", ...} yoki {type: "coin", ...} kelishi mumkin
    const notification = normalizeNotification(data);

    if (notification && notification.message) {
      dispatch(addNotification(notification));
    }
  };

  currentWebSocket.onclose = (event) => {
    console.log(
      `❌ WebSocket disconnected! Code: ${event.code}, Reason: ${event.reason}`
    );

    currentWebSocket = null;

    dispatch(wsDisconnected(event.reason || `Code: ${event.code}`));

    const normalClose = event.code === 1000 || event.code === 1001;

    if (
      isAuthenticated &&
      !manuallyClosed &&
      !normalClose &&
      reconnectAttempts < MAX_RECONNECT_ATTEMPTS
    ) {
      reconnectAttempts += 1;

      const delay = Math.min(3000 * reconnectAttempts, 15000);

      console.log(`WebSocket ${delay}ms dan keyin qayta ulanadi...`);

      reconnectTimer = setTimeout(() => {
        initWebSocket(dispatch, isAuthenticated);
      }, delay);
    }
  };

  currentWebSocket.onerror = (error) => {
    console.error("⛔ WebSocket error:", error);

    dispatch(wsDisconnected("WebSocket ulanishida xatolik yuz berdi."));

    if (currentWebSocket) {
      currentWebSocket.close();
    }
  };

  return currentWebSocket;
};

export const closeWebSocket = (dispatch = null, shouldClear = false) => {
  manuallyClosed = true;
  clearReconnectTimer();

  if (currentWebSocket) {
    console.log("WebSocket ulanishi yopilmoqda.");

    currentWebSocket.close(1000, "Client explicitly closing connection");
    currentWebSocket = null;
  }

  reconnectAttempts = 0;

  if (dispatch) {
    dispatch(wsDisconnected("Client disconnected"));

    if (shouldClear) {
      dispatch(clearNotifications());
    }
  }
};

export const sendWebSocketMessage = (message) => {
  if (isSocketOpen()) {
    currentWebSocket.send(JSON.stringify(message));
    return true;
  }

  console.warn("WebSocket ulangan emas yoki yuborishga tayyor emas.");
  return false;
};

export const markNotificationAsRead = (notificationId) => {
  return sendWebSocketMessage({
    command: "mark_as_read",
    notification_id: notificationId,
  });
};

export const markAllNotificationsAsRead = () => {
  return sendWebSocketMessage({
    command: "mark_all_as_read",
  });
};

// App.js ichida dispatch(connectWebSocket()) ishlatish uchun
export const connectWebSocket = () => {
  return (dispatch, getState) => {
    const isAuthenticated = Boolean(getState()?.auth?.isLoggedIn);
    return initWebSocket(dispatch, isAuthenticated);
  };
};

// App.js ichida dispatch(disconnectWebSocket()) ishlatish uchun
export const disconnectWebSocket = (shouldClear = false) => {
  return (dispatch) => {
    closeWebSocket(dispatch, shouldClear);
  };
};