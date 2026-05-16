const env = import.meta.env || {};

const isLocalHost =
  window.location.hostname === "localhost" ||
  window.location.hostname === "127.0.0.1";

const getEnv = (viteKey, reactKey, fallback = "") => {
  return env[viteKey] || env[reactKey] || fallback;
};

export const FRONTEND_URL = getEnv(
  "VITE_FRONTEND_URL",
  "REACT_APP_FRONTEND_URL",
  window.location.origin
);

export const BACKEND_URL = getEnv(
  "VITE_BACKEND_URL",
  "REACT_APP_BACKEND_URL",
  isLocalHost ? "http://localhost:8000" : window.location.origin
);

export const API_URL = getEnv(
  "VITE_API_URL",
  "REACT_APP_API_URL",
  `${BACKEND_URL}/api`
);

export const WS_URL = getEnv(
  "VITE_WS_URL",
  "REACT_APP_WS_URL",
  isLocalHost
    ? "ws://localhost:8000/ws/notifications/"
    : `${window.location.protocol === "https:" ? "wss" : "ws"}://${
        window.location.host
      }/ws/notifications/`
);

const GOOGLE_CLIENT_ID = getEnv(
  "VITE_GOOGLE_CLIENT_ID",
  "REACT_APP_GOOGLE_CLIENT_ID"
);

const GITHUB_CLIENT_ID = getEnv(
  "VITE_GITHUB_CLIENT_ID",
  "REACT_APP_GITHUB_CLIENT_ID"
);

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