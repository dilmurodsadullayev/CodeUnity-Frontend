// src/features/notificationSlice.js
import { createSlice } from "@reduxjs/toolkit";

const initialState = {
  notifications: [],
  wsConnected: false,
  totalUnreadCount: 0,
  wsError: null,
  loading: true, // Bildirishnomalarni yuklash holatini ko'rsatish uchun
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
      state.notifications = [];
      state.totalUnreadCount = 0;
      state.loading = false;
    },
    setNotifications: (state, action) => {
      state.notifications = action.payload;
      state.totalUnreadCount = action.payload.filter(notif => !notif.is_read).length;
      state.loading = false;
    },
    addNotification: (state, action) => {
      const newNotification = action.payload;
      state.notifications.unshift(newNotification);
      if (!newNotification.is_read) {
        state.totalUnreadCount += 1;
      }
    },
    // Mark Notification as Read Locally funksiyasi
    markNotificationAsReadLocally: (state, action) => {
      // action.payload bu yerda faqat notificationId bo'lishi kutiladi
      const notificationId = action.payload; 
      const notif = state.notifications.find(n => n.id === notificationId);
      if (notif && !notif.is_read) {
        notif.is_read = true;
        state.totalUnreadCount -= 1;
      }
    },
    // Barcha bildirishnomalarni o'qildi deb belgilash funksiyasi
    markAllNotificationsAsReadLocally: (state) => {
      state.notifications.forEach(notif => {
        if (!notif.is_read) {
          notif.is_read = true;
        }
      });
      state.totalUnreadCount = 0;
    },
    setTotalUnreadCount: (state, action) => {
      state.totalUnreadCount = action.payload;
    },
    clearNotifications: (state) => {
      state.notifications = [];
      state.totalUnreadCount = 0;
      state.loading = false;
    },
    setLoading: (state, action) => {
      state.loading = action.payload;
    },
  },
});

export const {
  wsConnected,
  wsDisconnected,
  setNotifications,
  addNotification,
  markNotificationAsReadLocally,
  markAllNotificationsAsReadLocally, // <-- Yangi action export qilindi
  setTotalUnreadCount,
  clearNotifications,
  setLoading,
} = notificationSlice.actions;

export default notificationSlice.reducer;