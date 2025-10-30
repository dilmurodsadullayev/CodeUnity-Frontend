// src/features/notificationSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
  wsConnected: false,
  totalUnreadCount: 0,
  wsError: null,
};

const notificationSlice = createSlice({
  name: "notifications",
  initialState,
  reducers: {
    wsConnected: (state) => {
      state.wsConnected = true;
      state.wsError = null;
    },
    wsDisconnected: (state, action) => {
      state.wsConnected = false;
      state.wsError = action.payload || null;
      state.notifications = [];
      state.totalUnreadCount = 0;
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
      state.totalUnreadCount = action.payload.filter(notif => !notif.is_read).length;
    },
    addNotification: (state, action) => {
      const newNotification = action.payload;
      state.notifications.unshift(newNotification);
      if (!newNotification.is_read) {
        state.totalUnreadCount += 1;
      }
    },
    markNotificationAsReadLocally: (state, action) => {
      const notificationId = action.payload;
      const notif = state.notifications.find(n => n.id === notificationId);
      if (notif && !notif.is_read) {
        notif.is_read = true;
        state.totalUnreadCount -= 1;
      }
    },
    setTotalUnreadCount: (state, action) => {
      state.totalUnreadCount = action.payload;
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.totalUnreadCount = 0;
    }
  },
});

export const {
  wsConnected,
  wsDisconnected,
  setNotifications,
  addNotification,
  markNotificationAsReadLocally,
  setTotalUnreadCount,
  clearNotifications,
} = notificationSlice.actions;

export default notificationSlice.reducer;