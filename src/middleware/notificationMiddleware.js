// src/middleware/notificationMiddleware.js

import {
  wsConnected,
  wsDisconnected,
  setNotifications,
  addNotification,
  setLoading,
  clearNotifications,
  // Lokal Redux stateni yangilash uchun yangi actions
  markNotificationAsReadLocally, 
  markAllNotificationsAsReadLocally
} from "../features/notificationSlice"; // Bu actions notificationSlice.js dan import qilinishi shart

// NEW: WS orqali yuborish uchun action creators
export const markNotificationAsRead = (id) => ({
  type: "notifications/markNotificationAsRead",
  payload: { notification_id: id }
});

export const markAllNotificationsAsRead = () => ({
  type: "notifications/markAllNotificationsAsRead"
});

export const connectWebSocket = () => ({ type: "notifications/connectWebSocket" });
export const disconnectWebSocket = () => ({ type: "notifications/disconnectWebSocket" });


const notificationMiddleware = (store) => {
  let websocket = null;
  let reconnectInterval = null;

  const onOpen = () => {
    store.dispatch(wsConnected());
    console.log("DEBUG [WS]: WebSocket Connected!");
    if (reconnectInterval) {
      clearInterval(reconnectInterval);
      reconnectInterval = null;
      console.log("DEBUG [WS]: Reconnect interval cleared.");
    }
  };

  const onClose = (event) => {
    console.log(`DEBUG [WS]: WebSocket Disconnected: ${event.code} - ${event.reason}`);
    
    store.dispatch(wsDisconnected(`Disconnected: ${event.code} - ${event.reason}`));
    
    // Agar normal yoki 'going away' yoki serverning maxsus yopish kodi bo'lmasa
    if (event.code !== 1000 && event.code !== 1001 && event.code !== 4000 && !reconnectInterval) {
        const { isLoggedIn } = store.getState().auth;
        
        console.log(`DEBUG [WS]: Disconnect code is ${event.code}. Checking for reconnection logic.`);

        if (isLoggedIn) {
            console.log("DEBUG [WS]: User is logged in. Attempting to reconnect in 5 seconds...");
            reconnectInterval = setInterval(() => {
                const currentIsLoggedIn = store.getState().auth.isLoggedIn;
                if (!currentIsLoggedIn) {
                    clearInterval(reconnectInterval);
                    reconnectInterval = null;
                    store.dispatch(wsDisconnected("Authentication required after disconnect attempt."));
                    console.log("DEBUG [WS]: Reconnection stopped: User logged out during interval.");
                    return;
                }
                
                if (!websocket || websocket.readyState === WebSocket.CLOSED) {
                    console.log("DEBUG [WS]: Reconnecting WebSocket... (from interval)");
                    connectWebSocketInternal();
                } else if (websocket.readyState === WebSocket.CONNECTING) {
                    console.log("DEBUG [WS]: WebSocket is still connecting. Skipping reconnection attempt.");
                }
            }, 5000);
        } else {
            console.log("DEBUG [WS]: User not logged in, no reconnection attempt.");
        }
    }
  };

  const onError = (error) => {
    console.error("DEBUG [WS]: WebSocket Error:", error);
    store.dispatch(wsDisconnected("WebSocket Error: Connection Refused or Failed."));
  };

  const onMessage = (event) => {
    try {
      const message = JSON.parse(event.data);
      console.log("DEBUG [WS]: Received message from WebSocket:", message);

      if (message.type === "initial_notifications") {
        store.dispatch(setNotifications(message.notifications));
        console.log(`DEBUG [WS]: Dispatching setNotifications with ${message.notifications.length} items.`);
      } else {
         // Real-time bildirishnoma kelganda
         store.dispatch(addNotification(message));
         console.log("DEBUG [WS]: Dispatching addNotification.");
      }

    } catch (e) {
      console.error("DEBUG [WS]: Failed to parse WebSocket message:", e);
    }
  };
  
  // NEW: Xabar yuborish funksiyasi
  const sendMessage = (message) => {
    if (websocket && websocket.readyState === WebSocket.OPEN) {
      websocket.send(JSON.stringify(message));
      console.log("DEBUG [WS]: Sent message:", message);
      return true;
    }
    console.warn("DEBUG [WS]: WebSocket is not open. Message not sent:", message);
    return false;
  };

  const connectWebSocketInternal = () => {
    const { isLoggedIn } = store.getState().auth;

    if (!isLoggedIn) {
        console.warn("DEBUG [WS]: User not logged in. WebSocket connection not attempted.");
        store.dispatch(wsDisconnected("Authentication required."));
        return;
    }

    store.dispatch(setLoading(true));
    
    // Brauzer hozirda qaysi host/portdan yuklangan bo'lsa, o'sha manzilni ishlatamiz.
    const currentHost = window.location.host.split(':')[0]; 
    const wsUrl = `ws://${currentHost}:8000/ws/notifications/`; // Portni 8000 qilib belgilash
    
    console.log(`DEBUG [WS]: Attempting to connect to ${wsUrl}`);
    
    websocket = new WebSocket(wsUrl);
    websocket.onopen = onOpen;
    websocket.onclose = onClose;
    websocket.onmessage = onMessage;
    websocket.onerror = onError;
  };

  return (next) => (action) => {
    // console.log(`DEBUG [Redux Action]: Handling action: ${action.type}`);

    switch (action.type) {
      case connectWebSocket().type:
        const { isLoggedIn } = store.getState().auth;
        const wsState = websocket ? websocket.readyState : WebSocket.CLOSED;

        console.log(`DEBUG [Connect Action]: isLoggedIn: ${isLoggedIn}, WS State: ${wsState}`);

        if (isLoggedIn && (wsState === WebSocket.CLOSED || !websocket)) {
          console.log("DEBUG [Connect Action]: User logged in and WS is closed/null. Starting connection.");
          connectWebSocketInternal();
        } else if (!isLoggedIn && wsState === WebSocket.OPEN) {
          console.log("DEBUG [Connect Action]: User logged out, but WS is open. Closing WS.");
          websocket.close(1000, "User logged out.");
        } else if (isLoggedIn && wsState === WebSocket.OPEN) {
            console.log("DEBUG [Connect Action]: User logged in and WS is already OPEN. Skipping connection.");
        }
        break;
      case disconnectWebSocket().type:
        console.log("DEBUG [Disconnect Action]: Initiated disconnection.");
        if (websocket && websocket.readyState === WebSocket.OPEN) {
          websocket.close(1000, "User logged out or manually disconnected.");
        }
        if (reconnectInterval) {
            clearInterval(reconnectInterval);
            reconnectInterval = null;
            console.log("DEBUG [Disconnect Action]: Reconnect interval cleared.");
        }
        store.dispatch(clearNotifications());
        break;
      
      // NEW: Yakka bildirishnomani o'qildi deb belgilash
      case markNotificationAsRead().type:
        const notifId = action.payload.notification_id;
        const success = sendMessage({
          action: "mark_as_read",
          notification_id: notifId
        });
        
        // Agar xabar yuborish muvaffaqiyatli bo'lsa, Redux stateni yangilash
        if (success) {
           store.dispatch(markNotificationAsReadLocally({ id: notifId }));
        }
        break;

      // NEW: Barcha bildirishnomalarni o'qildi deb belgilash
      case markAllNotificationsAsRead().type:
        const allSuccess = sendMessage({
          action: "mark_all_as_read"
        });
        
        // Agar xabar yuborish muvaffaqiyatli bo'lsa, Redux stateni yangilash
        if (allSuccess) {
            store.dispatch(markAllNotificationsAsReadLocally());
        }
        break;

      default:
        break;
    }
    return next(action);
  };
};

export default notificationMiddleware;