import { addNotification, markNotificationAsReadLocally, setNotifications, wsConnected, wsDisconnected } from "../features/notificationSlice";


// WebSocket obyektini tashqarida saqlash (state'da emas)
let currentWebSocket = null;

export const initWebSocket = (dispatch, isAuthenticated) => {
  // Agar allaqachon ulangan bo'lsa yoki avtorizatsiya bo'lmasa, hech narsa qilmaymiz
  if (currentWebSocket && currentWebSocket.readyState === WebSocket.OPEN) {
    console.log("WebSocket allaqachon ulangan.");
    return;
  }
  if (!isAuthenticated) {
    console.log("Foydalanuvchi avtorizatsiyadan o'tmagan, WebSocket ulanmaydi.");
    return;
  }

  const wsProtocol = window.location.protocol === 'https:' ? 'wss:' : 'ws:';
  const wsUrl = `${wsProtocol}//${window.location.host}/ws/notifications/`;
  
  currentWebSocket = new WebSocket(wsUrl);

  currentWebSocket.onopen = () => {
    console.log("✅ WebSocket connected!");
    dispatch(wsConnected());
    // Ulanish paytida o'qilmagan notificationlarni so'rash
    currentWebSocket.send(JSON.stringify({
      'command': 'fetch_unread_notifications'
    }));
  };

  currentWebSocket.onmessage = (event) => {
    const data = JSON.parse(event.data);
    console.log("WebSocket message received:", data);

    if (data.command === "unread_notifications") {
      // Dastlabki o'qilmagan notificationlarni yuklash
      dispatch(setNotifications(data.notifications));
    } else if (data.type) { // Bu yangi real-time notification
      dispatch(addNotification(data));
    } else if (data.command === 'mark_as_read' && data.status === 'success') {
      // Backenddan notificationni o'qilgan deb belgilash tasdiqlansa
      dispatch(markNotificationAsReadLocally(data.notification_id));
    }
  };

  currentWebSocket.onclose = (event) => {
    console.log(`❌ WebSocket disconnected! Code: ${event.code}, Reason: ${event.reason}`);
    dispatch(wsDisconnected(event.reason || `Code: ${event.code}`));
    // Kutilmagan uzilish bo'lsa, qayta ulanishga urinishimiz mumkin
    if (isAuthenticated && event.code !== 1000 && event.code !== 1001) { // 1000 - normal closure, 1001 - going away
      console.log("WebSocket qayta ulanishga urinmoqda...");
      setTimeout(() => initWebSocket(dispatch, isAuthenticated), 3000); // 3 soniyadan keyin qayta ulanish
    }
  };

  currentWebSocket.onerror = (error) => {
    console.error("⛔ WebSocket error:", error);
    dispatch(wsDisconnected(error.message || "Unknown WebSocket error"));
    currentWebSocket.close(); // Xato bo'lganda ulanishni yopish
  };

  return currentWebSocket; // Socket obyektini qaytaramiz (agar uni boshqa joydan boshqarish kerak bo'lsa)
};

export const closeWebSocket = () => {
  if (currentWebSocket) {
    console.log("WebSocket ulanishi yopilmoqda.");
    currentWebSocket.close(1000, 'Client explicitly closing connection');
    currentWebSocket = null;
  }
};

export const sendWebSocketMessage = (message) => {
  if (currentWebSocket && currentWebSocket.readyState === WebSocket.OPEN) {
    currentWebSocket.send(JSON.stringify(message));
    return true;
  } else {
    console.warn("WebSocket ulangan emas yoki yuborishga tayyor emas.");
    return false;
  }
};