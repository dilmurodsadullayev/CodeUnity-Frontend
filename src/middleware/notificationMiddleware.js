// src/middleware/notificationMiddleware.js

import {
  wsConnected,
  wsDisconnected,
  setNotifications,
  addNotification,
  setLoading,
  clearNotifications,
  markNotificationAsReadLocally,
  markAllNotificationsAsReadLocally,
} from "../features/notificationSlice";

import { WS_URL } from "../services/config";

// ===============================
// ACTION TYPES
// ===============================

const CONNECT_WS = "notifications/connectWebSocket";
const DISCONNECT_WS = "notifications/disconnectWebSocket";
const MARK_NOTIFICATION_AS_READ = "notifications/markNotificationAsRead";
const MARK_ALL_NOTIFICATIONS_AS_READ = "notifications/markAllNotificationsAsRead";

// ===============================
// ACTION CREATORS
// ===============================

export const connectWebSocket = () => ({
  type: CONNECT_WS,
});

export const disconnectWebSocket = (shouldClear = false) => ({
  type: DISCONNECT_WS,
  payload: {
    shouldClear,
  },
});

export const markNotificationAsRead = (id) => ({
  type: MARK_NOTIFICATION_AS_READ,
  payload: {
    notification_id: id,
  },
});

export const markAllNotificationsAsRead = () => ({
  type: MARK_ALL_NOTIFICATIONS_AS_READ,
});

// ===============================
// HELPERS
// ===============================

const getWebSocketUrl = () => {
  if (WS_URL) {
    return WS_URL;
  }

  if (import.meta.env?.VITE_WS_URL) {
    return import.meta.env.VITE_WS_URL;
  }

  const protocol = window.location.protocol === "https:" ? "wss" : "ws";

  const isLocal =
    window.location.hostname === "localhost" ||
    window.location.hostname === "127.0.0.1";

  const backendHost = isLocal ? "localhost:8000" : window.location.host;

  return `${protocol}://${backendHost}/ws/notifications/`;
};

const safeJsonParse = (value) => {
  try {
    return JSON.parse(value);
  } catch (error) {
    console.error("DEBUG [WS]: JSON parse xatosi:", error);
    return null;
  }
};

const normalizeNotification = (payload) => {
  if (!payload) return null;

  const raw =
    payload.notification_data ||
    payload.notification ||
    payload.data ||
    payload;

  if (!raw) return null;

  const id = raw.id || raw.notification_id;

  if (!id) return null;

  return {
    id,
    sender: raw.sender || null,
    recipient: raw.recipient || null,

    // Backend modelda content_type bor, eski WSlarda type kelishi ham mumkin.
    content_type: raw.content_type || raw.type || "info",

    object_id: raw.object_id || null,
    message: raw.message || raw.text || raw.body || "",
    created_at: raw.created_at || new Date().toISOString(),
    is_read: Boolean(raw.is_read),
  };
};

const normalizeNotifications = (notifications) => {
  if (!Array.isArray(notifications)) return [];

  return notifications.map(normalizeNotification).filter(Boolean);
};

const isSocketOpen = (websocket) => {
  return websocket && websocket.readyState === WebSocket.OPEN;
};

const isSocketConnecting = (websocket) => {
  return websocket && websocket.readyState === WebSocket.CONNECTING;
};

// ===============================
// MIDDLEWARE
// ===============================

const notificationMiddleware = (store) => {
  let websocket = null;
  let reconnectTimeout = null;
  let reconnectAttempts = 0;
  let manuallyClosed = false;

  const MAX_RECONNECT_ATTEMPTS = 8;

  const clearReconnectTimeout = () => {
    if (reconnectTimeout) {
      clearTimeout(reconnectTimeout);
      reconnectTimeout = null;
    }
  };

  const sendMessage = (message) => {
    if (isSocketOpen(websocket)) {
      websocket.send(JSON.stringify(message));
      console.log("DEBUG [WS]: Sent message:", message);
      return true;
    }

    console.warn("DEBUG [WS]: WebSocket open emas. Message yuborilmadi:", message);
    return false;
  };

  const requestUnreadNotifications = () => {
    sendMessage({
      command: "fetch_unread_notifications",
      action: "fetch_unread_notifications",
    });
  };

  const scheduleReconnect = () => {
    clearReconnectTimeout();

    const { isLoggedIn } = store.getState().auth || {};

    if (!isLoggedIn) {
      console.log("DEBUG [WS]: User logout bo‘lgan. Reconnect qilinmaydi.");
      return;
    }

    if (manuallyClosed) {
      console.log("DEBUG [WS]: Manual close. Reconnect qilinmaydi.");
      return;
    }

    if (reconnectAttempts >= MAX_RECONNECT_ATTEMPTS) {
      console.warn("DEBUG [WS]: Reconnect limit tugadi.");
      return;
    }

    reconnectAttempts += 1;

    const delay = Math.min(3000 * reconnectAttempts, 15000);

    console.log(`DEBUG [WS]: ${delay}ms dan keyin reconnect qilinadi...`);

    reconnectTimeout = setTimeout(() => {
      connectWebSocketInternal();
    }, delay);
  };

  const handleInitialNotifications = (message) => {
    const notifications = normalizeNotifications(message.notifications);
    store.dispatch(setNotifications(notifications));
    store.dispatch(setLoading(false));
  };

  const handleMarkAsReadSuccess = (message) => {
    const notificationId =
      message.notification_id ||
      message.id ||
      message?.notification?.id ||
      message?.data?.id;

    if (notificationId) {
      // MUHIM: object emas, to‘g‘ridan-to‘g‘ri id yuboramiz.
      store.dispatch(markNotificationAsReadLocally(notificationId));
    }
  };

  const handleNewNotification = (message) => {
    const notification = normalizeNotification(message);

    if (!notification) {
      console.warn("DEBUG [WS]: Notification format tanilmadi:", message);
      return;
    }

    store.dispatch(addNotification(notification));
  };

  const onOpen = () => {
    console.log("DEBUG [WS]: WebSocket connected.");

    reconnectAttempts = 0;
    manuallyClosed = false;

    clearReconnectTimeout();

    store.dispatch(wsConnected());
    store.dispatch(setLoading(false));

    requestUnreadNotifications();
  };

  const onClose = (event) => {
    console.log(
      `DEBUG [WS]: WebSocket disconnected. Code: ${event.code}, Reason: ${event.reason}`
    );

    websocket = null;

    store.dispatch(
      wsDisconnected(event.reason || `Disconnected: ${event.code}`)
    );

    store.dispatch(setLoading(false));

    const normalClose =
      event.code === 1000 ||
      event.code === 1001 ||
      event.code === 4000;

    if (!normalClose && !manuallyClosed) {
      scheduleReconnect();
    }
  };

  const onError = (error) => {
    console.error("DEBUG [WS]: WebSocket error:", error);

    store.dispatch(setLoading(false));
    store.dispatch(wsDisconnected("WebSocket ulanishida xatolik yuz berdi."));

    if (websocket) {
      websocket.close();
    }
  };

  const onMessage = (event) => {
    const message = safeJsonParse(event.data);

    if (!message) return;

    console.log("DEBUG [WS]: Message received:", message);

    // 1. Boshlang‘ich notificationlar
    if (
      message.type === "initial_notifications" ||
      message.command === "unread_notifications" ||
      message.type === "unread_notifications"
    ) {
      handleInitialNotifications(message);
      return;
    }

    // 2. Bitta notification o‘qildi
    if (
      message.type === "notification_marked_as_read" ||
      message.type === "mark_as_read_success" ||
      message.command === "mark_as_read_success" ||
      (message.command === "mark_as_read" && message.status === "success")
    ) {
      handleMarkAsReadSuccess(message);
      return;
    }

    // 3. Barcha notificationlar o‘qildi
    if (
      message.type === "all_notifications_marked_as_read" ||
      message.type === "mark_all_as_read_success" ||
      message.command === "mark_all_as_read_success" ||
      (message.command === "mark_all_as_read" && message.status === "success")
    ) {
      store.dispatch(markAllNotificationsAsReadLocally());
      return;
    }

    // 4. Yangi real-time notification
    // Backenddan:
    // {content_type:"coin", message:"..."}
    // yoki Channels formatida:
    // {type:"notification.message", notification_data:{...}}
    if (
      message.notification_data ||
      message.notification ||
      message.content_type ||
      message.type
    ) {
      handleNewNotification(message);
      return;
    }

    console.warn("DEBUG [WS]: Unknown message format:", message);
  };

  function connectWebSocketInternal() {
    const { isLoggedIn } = store.getState().auth || {};

    if (!isLoggedIn) {
      console.warn("DEBUG [WS]: User login qilmagan. WS ulanmaydi.");
      store.dispatch(wsDisconnected("Authentication required."));
      store.dispatch(setLoading(false));
      return;
    }

    if (isSocketOpen(websocket)) {
      console.log("DEBUG [WS]: WebSocket already OPEN.");
      return;
    }

    if (isSocketConnecting(websocket)) {
      console.log("DEBUG [WS]: WebSocket already CONNECTING.");
      return;
    }

    manuallyClosed = false;
    store.dispatch(setLoading(true));

    const wsUrl = getWebSocketUrl();

    console.log(`DEBUG [WS]: Connecting to ${wsUrl}`);

    try {
      websocket = new WebSocket(wsUrl);

      websocket.onopen = onOpen;
      websocket.onclose = onClose;
      websocket.onerror = onError;
      websocket.onmessage = onMessage;
    } catch (error) {
      console.error("DEBUG [WS]: WebSocket yaratishda xato:", error);

      store.dispatch(setLoading(false));
      store.dispatch(wsDisconnected("WebSocket yaratishda xato."));
      scheduleReconnect();
    }
  }

  return (next) => (action) => {
    switch (action.type) {
      case CONNECT_WS: {
        const { isLoggedIn } = store.getState().auth || {};
        const wsState = websocket ? websocket.readyState : WebSocket.CLOSED;

        console.log(
          `DEBUG [WS CONNECT]: isLoggedIn=${isLoggedIn}, wsState=${wsState}`
        );

        if (!isLoggedIn) {
          store.dispatch(wsDisconnected("Authentication required."));
          store.dispatch(setLoading(false));
          break;
        }

        if (isSocketOpen(websocket) || isSocketConnecting(websocket)) {
          console.log("DEBUG [WS CONNECT]: WS already active.");
          break;
        }

        connectWebSocketInternal();
        break;
      }

      case DISCONNECT_WS: {
        console.log("DEBUG [WS DISCONNECT]: Manual disconnect.");

        manuallyClosed = true;
        clearReconnectTimeout();

        if (
          websocket &&
          (websocket.readyState === WebSocket.OPEN ||
            websocket.readyState === WebSocket.CONNECTING)
        ) {
          websocket.close(1000, "Client manually disconnected.");
        }

        websocket = null;
        reconnectAttempts = 0;

        const shouldClear = Boolean(action.payload?.shouldClear);

        if (shouldClear) {
          store.dispatch(clearNotifications());
        }

        store.dispatch(wsDisconnected("Disconnected manually."));
        store.dispatch(setLoading(false));
        break;
      }

      case MARK_NOTIFICATION_AS_READ: {
        const notificationId = action.payload?.notification_id;

        if (!notificationId) {
          console.warn("DEBUG [WS]: notification_id topilmadi.");
          break;
        }

        const success = sendMessage({
          command: "mark_as_read",
          action: "mark_as_read",
          notification_id: notificationId,
        });

        // UI tezroq yangilanishi uchun lokal ham o‘qilgan qilamiz.
        if (success) {
          store.dispatch(markNotificationAsReadLocally(notificationId));
        }

        break;
      }

      case MARK_ALL_NOTIFICATIONS_AS_READ: {
        const success = sendMessage({
          command: "mark_all_as_read",
          action: "mark_all_as_read",
        });

        if (success) {
          store.dispatch(markAllNotificationsAsReadLocally());
        }

        break;
      }

      default:
        break;
    }

    return next(action);
  };
};

export default notificationMiddleware;