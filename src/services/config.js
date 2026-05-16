// src/config.js yoki sendagi config fayl

const env = process.env;

const isLocalHost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const removeLastSlash = (url) => {
  if (!url) return "";
  return String(url).replace(/\/+$/, "");
};

const maskValue = (value) => {
  if (!value) return "❌ TOPILMADI";
  if (value.length <= 18) return value;
  return `${value.slice(0, 14)}...${value.slice(-12)}`;
};

const getEnv = (key, fallback = "") => {
  const value = env[key];

  if (value === undefined || value === null || value === "") {
    return fallback;
  }

  return value;
};

export const FRONTEND_URL = removeLastSlash(
  getEnv("REACT_APP_FRONTEND_URL", window.location.origin)
);

export const BACKEND_URL = removeLastSlash(
  getEnv(
    "REACT_APP_BACKEND_URL",
    isLocalHost ? "http://localhost:8000" : window.location.origin
  )
);

export const API_URL = removeLastSlash(
  getEnv("REACT_APP_API_URL", `${BACKEND_URL}/api`)
);

export const WS_URL = getEnv(
  "REACT_APP_WS_URL",
  isLocalHost
    ? "ws://localhost:8000/ws/notifications/"
    : `${window.location.protocol === "https:" ? "wss" : "ws"}://${window.location.host}/ws/notifications/`
);

const GOOGLE_CLIENT_ID = getEnv("REACT_APP_GOOGLE_CLIENT_ID", "");
const GITHUB_CLIENT_ID = getEnv("REACT_APP_GITHUB_CLIENT_ID", "");

export const GOOGLE_REDIRECT_URI = `${FRONTEND_URL}/callback/google`;
export const GITHUB_REDIRECT_URI = `${FRONTEND_URL}/callback/github`;

export const GOOGLE_AUTH_URL =
  `https://accounts.google.com/o/oauth2/v2/auth?` +
  `client_id=${encodeURIComponent(GOOGLE_CLIENT_ID)}` +
  `&redirect_uri=${encodeURIComponent(GOOGLE_REDIRECT_URI)}` +
  `&response_type=code` +
  `&scope=${encodeURIComponent("openid email profile")}` +
  `&prompt=select_account`;

export const GITHUB_AUTH_URL =
  `https://github.com/login/oauth/authorize?` +
  `client_id=${encodeURIComponent(GITHUB_CLIENT_ID)}` +
  `&redirect_uri=${encodeURIComponent(GITHUB_REDIRECT_URI)}` +
  `&scope=${encodeURIComponent("read:user user:email")}`;

export const GOOGLE_LOGIN_API = `${API_URL}/users/auth/google/`;
export const GITHUB_LOGIN_API = `${API_URL}/users/auth/github/`;

// ===============================
// DEBUG
// ===============================
// console.group("🔐 FSociety AUTH CONFIG DEBUG");

// console.table({
//   NODE_ENV: env.NODE_ENV,

//   REACT_APP_FRONTEND_URL: env.REACT_APP_FRONTEND_URL || "❌ TOPILMADI",
//   REACT_APP_BACKEND_URL: env.REACT_APP_BACKEND_URL || "❌ TOPILMADI",
//   REACT_APP_API_URL: env.REACT_APP_API_URL || "❌ TOPILMADI",
//   REACT_APP_WS_URL: env.REACT_APP_WS_URL || "❌ TOPILMADI",

//   FRONTEND_URL,
//   BACKEND_URL,
//   API_URL,
//   WS_URL,

//   GOOGLE_CLIENT_ID_EXISTS: Boolean(GOOGLE_CLIENT_ID),
//   GOOGLE_CLIENT_ID_PREVIEW: maskValue(GOOGLE_CLIENT_ID),
//   GOOGLE_REDIRECT_URI,

//   GITHUB_CLIENT_ID_EXISTS: Boolean(GITHUB_CLIENT_ID),
//   GITHUB_CLIENT_ID_PREVIEW: maskValue(GITHUB_CLIENT_ID),
//   GITHUB_REDIRECT_URI,
// });

if (!GOOGLE_CLIENT_ID) {
  console.error(
    "❌ REACT_APP_GOOGLE_CLIENT_ID topilmadi. frontend/.env ichida REACT_APP_GOOGLE_CLIENT_ID borligini tekshir va npm run dev ni qayta ishga tushir."
  );
}

if (!GITHUB_CLIENT_ID) {
  console.error(
    "❌ REACT_APP_GITHUB_CLIENT_ID topilmadi. frontend/.env ichida REACT_APP_GITHUB_CLIENT_ID borligini tekshir."
  );
}

// console.log("GOOGLE_AUTH_URL:", GOOGLE_AUTH_URL);
// console.log("GOOGLE_LOGIN_API:", GOOGLE_LOGIN_API);
// console.groupEnd();

// window.__FSOCIETY_AUTH_DEBUG__ = {
//   FRONTEND_URL,
//   BACKEND_URL,
//   API_URL,
//   WS_URL,
//   GOOGLE_CLIENT_ID,
//   GOOGLE_REDIRECT_URI,
//   GOOGLE_AUTH_URL,
//   GOOGLE_LOGIN_API,
//   GITHUB_CLIENT_ID,
//   GITHUB_REDIRECT_URI,
//   GITHUB_AUTH_URL,
//   GITHUB_LOGIN_API,
// };