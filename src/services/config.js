const GOOGLE_CLIENT_ID = process.env.REACT_APP_GOOGLE_CLIENT_ID;
const GITHUB_CLIENT_ID = process.env.REACT_APP_GITHUB_CLIENT_ID;

const FRONTEND_URL =
  process.env.REACT_APP_FRONTEND_URL || window.location.origin;

export const API_URL =
  process.env.REACT_APP_API_URL || "http://127.0.0.1:8000/api";

export const GOOGLE_AUTH_URL =
  `https://accounts.google.com/o/oauth2/v2/auth?` +
  `client_id=${GOOGLE_CLIENT_ID}` +
  `&redirect_uri=${encodeURIComponent(`${FRONTEND_URL}/callback/google`)}` +
  `&response_type=code` +
  `&scope=${encodeURIComponent("openid email profile")}` +
  `&prompt=select_account`;

export const GITHUB_AUTH_URL =
  `https://github.com/login/oauth/authorize?` +
  `client_id=${GITHUB_CLIENT_ID}` +
  `&redirect_uri=${encodeURIComponent(`${FRONTEND_URL}/callback/github`)}` +
  `&scope=${encodeURIComponent("read:user user:email")}`;

export const GOOGLE_LOGIN_API = `${API_URL}/users/auth/google/`;
export const GITHUB_LOGIN_API = `${API_URL}/users/auth/github/`;