import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
  wsConnected: false,
  totalUnreadCount: 0,
  wsError: null,
  loading: false,
};

const normalizeId = (id) => {
  if (id === null || id === undefined) return null;
  return Number(id);
};

const calculateUnreadCount = (notifications) => {
  return notifications.filter((notification) => !notification.is_read).length;
};

const normalizeNotification = (notification) => {
  if (!notification) return null;

  return {
    id: notification.id || notification.notification_id,
    sender: notification.sender || null,
    recipient: notification.recipient || null,
    content_type: notification.content_type || notification.type || "info",
    object_id: notification.object_id || null,
    message: notification.message || notification.text || notification.body || "",
    created_at: notification.created_at || new Date().toISOString(),
    is_read: Boolean(notification.is_read),
  };
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    wsConnected: (state) => {
      state.wsConnected = true;
      state.wsError = null;
      state.loading = false;
    },

    wsDisconnected: (state, action) => {
      state.wsConnected = false;
      state.wsError = action.payload || null;
      state.loading = false;

      // MUHIM:
      // Bu yerda notifications tozalanmaydi.
      // Chunki websocket vaqtincha uzilsa eski notificationlar o‘chib ketmasin.
      // Logout bo‘lsa clearNotifications ishlatiladi.
    },

    setNotifications: (state, action) => {
      const payload = Array.isArray(action.payload) ? action.payload : [];

      const normalized = payload
        .map(normalizeNotification)
        .filter(Boolean)
        .filter((item) => item.id);

      const uniqueMap = new Map();

      normalized.forEach((item) => {
        uniqueMap.set(Number(item.id), item);
      });

      state.notifications = Array.from(uniqueMap.values()).sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });

      state.totalUnreadCount = calculateUnreadCount(state.notifications);
      state.loading = false;
      state.wsError = null;
    },

    addNotification: (state, action) => {
      const newNotification = normalizeNotification(action.payload);

      if (!newNotification || !newNotification.id) return;

      const newId = Number(newNotification.id);

      const existsIndex = state.notifications.findIndex((notification) => {
        return Number(notification.id) === newId;
      });

      if (existsIndex !== -1) {
        state.notifications[existsIndex] = {
          ...state.notifications[existsIndex],
          ...newNotification,
        };
      } else {
        state.notifications.unshift(newNotification);
      }

      state.notifications.sort((a, b) => {
        return new Date(b.created_at) - new Date(a.created_at);
      });

      state.totalUnreadCount = calculateUnreadCount(state.notifications);
    },

    markNotificationAsReadLocally: (state, action) => {
      const notificationId = normalizeId(action.payload);

      if (!notificationId) return;

      const notification = state.notifications.find((item) => {
        return Number(item.id) === notificationId;
      });

      if (notification && !notification.is_read) {
        notification.is_read = true;
      }

      state.totalUnreadCount = calculateUnreadCount(state.notifications);
    },

    markAllNotificationsAsReadLocally: (state) => {
      state.notifications.forEach((notification) => {
        notification.is_read = true;
      });

      state.totalUnreadCount = 0;
    },

    setTotalUnreadCount: (state, action) => {
      state.totalUnreadCount = Number(action.payload || 0);
    },

    clearNotifications: (state) => {
      state.notifications = [];
      state.totalUnreadCount = 0;
      state.loading = false;
      state.wsError = null;
    },

    setLoading: (state, action) => {
      state.loading = Boolean(action.payload);
    },
  },
});

export const {
  wsConnected,
  wsDisconnected,
  setNotifications,
  addNotification,
  markNotificationAsReadLocally,
  markAllNotificationsAsReadLocally,
  setTotalUnreadCount,
  clearNotifications,
  setLoading,
} = notificationSlice.actions;

export default notificationSlice.reducer;