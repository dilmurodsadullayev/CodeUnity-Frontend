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

// Action type constants
const CONNECT_WS = "notifications/connectWebSocket";
const DISCONNECT_WS = "notifications/disconnectWebSocket";
const MARK_NOTIFICATION_AS_READ = "notifications/markNotificationAsRead";
const MARK_ALL_NOTIFICATIONS_AS_READ = "notifications/markAllNotificationsAsRead";

// WS orqali yuborish uchun action creators
export const markNotificationAsRead = (id) => ({
  type: MARK_NOTIFICATION_AS_READ,
  payload: { notification_id: id },
});

export const markAllNotificationsAsRead = () => ({
  type: MARK_ALL_NOTIFICATIONS_AS_READ,
});

export const connectWebSocket = () => ({
  type: CONNECT_WS,
});

export const disconnectWebSocket = () => ({
  type: DISCONNECT_WS,
});

const getWebSocketUrl = () => {
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

const notificationMiddleware = (store) => {
  let websocket = null;
  let reconnectInterval = null;

  const clearReconnectInterval = () => {
    if (reconnectInterval) {
      clearInterval(reconnectInterval);
      reconnectInterval = null;
      console.log("DEBUG [WS]: Reconnect interval cleared.");
    }
  };

  const sendMessage = (message) => {
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      websocket.send(JSON.stringify(message));
      console.log("DEBUG [WS]: Sent message:", message);
      return true;
    }

    console.warn("DEBUG [WS]: WebSocket is not open. Message not sent:", message);
    return false;
  };

  const normalizeNotificationMessage = (message) => {
    // Backend Channels ba'zan shunday yuboradi:
    // { type: "notification.message", notification_data: {...} }
    if (message?.notification_data) {
      return message.notification_data;
    }

    // Ba'zan:
    // { type: "notification_message", notification: {...} }
    if (message?.notification) {
      return message.notification;
    }

    // Agar to'g'ridan-to'g'ri notification object kelsa
    if (message?.id && message?.message) {
      return message;
    }

    return null;
  };

  const onOpen = () => {
    store.dispatch(wsConnected());
    store.dispatch(setLoading(false));

    console.log("DEBUG [WS]: WebSocket Connected!");
    clearReconnectInterval();
  };

  const onClose = (event) => {
    console.log(
      `DEBUG [WS]: WebSocket Disconnected: ${event.code} - ${event.reason}`
    );

    store.dispatch(wsDisconnected(`Disconnected: ${event.code} - ${event.reason}`));
    store.dispatch(setLoading(false));

    const shouldReconnect =
      event.code !== 1000 &&
      event.code !== 1001 &&
      event.code !== 4000 &&
      !reconnectInterval;

    if (!shouldReconnect) {
      return;
    }

    const { isLoggedIn } = store.getState().auth;

    if (!isLoggedIn) {
      console.log("DEBUG [WS]: User not logged in, no reconnection attempt.");
      return;
    }

    console.log("DEBUG [WS]: User is logged in. Attempting to reconnect...");

    reconnectInterval = setInterval(() => {
      const currentIsLoggedIn = store.getState().auth.isLoggedIn;

      if (!currentIsLoggedIn) {
        clearReconnectInterval();
        store.dispatch(wsDisconnected("Authentication required after disconnect."));
        console.log("DEBUG [WS]: Reconnection stopped: User logged out.");
        return;
      }

      if (!websocket || websocket.readyState === WebSocket.CLOSED) {
        console.log("DEBUG [WS]: Reconnecting WebSocket...");
        connectWebSocketInternal();
      }

      if (websocket?.readyState === WebSocket.CONNECTING) {
        console.log("DEBUG [WS]: WebSocket is still connecting. Skipping...");
      }
    }, 5000);
  };

  const onError = (error) => {
    console.error("DEBUG [WS]: WebSocket Error:", error);
    store.dispatch(setLoading(false));
    store.dispatch(wsDisconnected("WebSocket Error: Connection refused or failed."));
  };

  const onMessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      console.log("DEBUG [WS]: Received message from WebSocket:", message);

      // 1. Boshlang'ich notificationlar
      if (message.type === "initial_notifications") {
        const notifications = Array.isArray(message.notifications)
          ? message.notifications
          : [];

        store.dispatch(setNotifications(notifications));
        store.dispatch(setLoading(false));
        return;
      }

      // 2. Bitta notification o'qildi degan javob kelsa
      if (
        message.type === "notification_marked_as_read" ||
        message.type === "mark_as_read_success"
      ) {
        const notificationId =
          message.notification_id || message.id || message?.notification?.id;

        if (notificationId) {
          store.dispatch(markNotificationAsReadLocally({ id: notificationId }));
        }

        return;
      }

      // 3. Hammasi o'qildi degan javob kelsa
      if (
        message.type === "all_notifications_marked_as_read" ||
        message.type === "mark_all_as_read_success"
      ) {
        store.dispatch(markAllNotificationsAsReadLocally());
        return;
      }

      // 4. Yangi notification
      const notification = normalizeNotificationMessage(message);

      if (notification) {
        store.dispatch(addNotification(notification));
        return;
      }

      console.warn("DEBUG [WS]: Unknown message format:", message);
    } catch (error) {
      console.error("DEBUG [WS]: Failed to parse WebSocket message:", error);
    }
  };

  function connectWebSocketInternal() {
    const { isLoggedIn } = store.getState().auth;

    if (!isLoggedIn) {
      console.warn("DEBUG [WS]: User not logged in. WebSocket not started.");
      store.dispatch(wsDisconnected("Authentication required."));
      store.dispatch(setLoading(false));
      return;
    }

    const currentState = websocket?.readyState;

    if (currentState === WebSocket.OPEN) {
      console.log("DEBUG [WS]: WebSocket already OPEN. Skipping connection.");
      return;
    }

    if (currentState === WebSocket.CONNECTING) {
      console.log("DEBUG [WS]: WebSocket already CONNECTING. Skipping connection.");
      return;
    }

    store.dispatch(setLoading(true));

    const wsUrl = getWebSocketUrl();

    console.log(`DEBUG [WS]: Attempting to connect to ${wsUrl}`);

    websocket = new WebSocket(wsUrl);
    websocket.onopen = onOpen;
    websocket.onclose = onClose;
    websocket.onmessage = onMessage;
    websocket.onerror = onError;
  }

  return (next) => (action) => {
    switch (action.type) {
      case CONNECT_WS: {
        const { isLoggedIn } = store.getState().auth;
        const wsState = websocket ? websocket.readyState : WebSocket.CLOSED;

        console.log(
          `DEBUG [Connect Action]: isLoggedIn: ${isLoggedIn}, WS State: ${wsState}`
        );

        if (!isLoggedIn) {
          console.log("DEBUG [Connect Action]: User not logged in. Skip WS.");
          store.dispatch(wsDisconnected("Authentication required."));
          break;
        }

        if (wsState === WebSocket.OPEN) {
          console.log("DEBUG [Connect Action]: WS already OPEN. Skip.");
          break;
        }

        if (wsState === WebSocket.CONNECTING) {
          console.log("DEBUG [Connect Action]: WS already CONNECTING. Skip.");
          break;
        }

        connectWebSocketInternal();
        break;
      }

      case DISCONNECT_WS: {
        console.log("DEBUG [Disconnect Action]: Initiated disconnection.");

        clearReconnectInterval();

        if (
          websocket &&
          (websocket.readyState === WebSocket.OPEN ||
            websocket.readyState === WebSocket.CONNECTING)
        ) {
          websocket.close(1000, "User logged out or manually disconnected.");
        }

        websocket = null;

        store.dispatch(clearNotifications());
        store.dispatch(wsDisconnected("Disconnected manually."));
        store.dispatch(setLoading(false));

        break;
      }

      case MARK_NOTIFICATION_AS_READ: {
        const notifId = action.payload?.notification_id;

        if (!notifId) {
          console.warn("DEBUG [WS]: notification_id not found.");
          break;
        }

        const success = sendMessage({
          action: "mark_as_read",
          notification_id: notifId,
        });

        // Offline yoki WS ishlamay qolsa ham UI yangilansin
        if (success) {
          store.dispatch(markNotificationAsReadLocally({ id: notifId }));
        }

        break;
      }

      case MARK_ALL_NOTIFICATIONS_AS_READ: {
        const success = sendMessage({
          action: "mark_all_as_read",
        });

        // Offline yoki WS ishlamay qolsa ham UI yangilansin
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