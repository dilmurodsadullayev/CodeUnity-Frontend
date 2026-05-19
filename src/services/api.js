// src/services/api.js
import axios from "axios";
import { API_URL } from "../services/config";

const normalizeBaseURL = (url) => {
    if (!url) return "/api";
    return String(url).replace(/\/+$/, "");
};

const instance = axios.create({
    baseURL: normalizeBaseURL(API_URL),
    withCredentials: true,

    // Django CSRF cookie/header nomlari
    xsrfCookieName: "csrftoken",
    xsrfHeaderName: "X-CSRFToken",
});

// MUHIM: global Content-Type qo‘ymaymiz.
// Chunki FormData uploadlarda browser o‘zi multipart boundary qo‘yishi kerak.

let isRefreshing = false;
let failedQueue = [];

const isAuthEndpoint = (url = "") => {
    const path = String(url);

    return (
        path.includes("/users/login/") ||
        path.includes("/users/register/") ||
        path.includes("/users/logout/") ||
        path.includes("/users/token/refresh/") ||
        path.includes("/users/auth/google/") ||
        path.includes("/users/auth/github/")
    );
};

const shouldRedirectToLogin = () => {
    const pathname = window.location.pathname;

    return (
        !pathname.includes("/login") &&
        !pathname.includes("/register") &&
        !pathname.includes("/callback/google") &&
        !pathname.includes("/callback/github")
    );
};

const processQueue = (error) => {
    failedQueue.forEach(({ resolve, reject, config }) => {
        if (error) {
            reject(error);
        } else {
            resolve(instance(config));
        }
    });

    failedQueue = [];
};

instance.interceptors.response.use(
    (response) => response,

    async (error) => {
        const originalRequest = error.config;
        const status = error?.response?.status;
        const url = originalRequest?.url || "";

        if (
            status === 401 &&
            originalRequest &&
            !originalRequest._retry &&
            !isAuthEndpoint(url)
        ) {
            originalRequest._retry = true;

            if (isRefreshing) {
                return new Promise((resolve, reject) => {
                    failedQueue.push({
                        resolve,
                        reject,
                        config: originalRequest,
                    });
                });
            }

            isRefreshing = true;

            try {
                await instance.post("/users/token/refresh/");

                processQueue(null);

                return instance(originalRequest);
            } catch (refreshError) {
                processQueue(refreshError);

                try {
                    await instance.post("/users/logout/");
                } catch (_) {
                    // Logout xato bersa ham frontend state tozalanadi
                }

                localStorage.removeItem("user");
                localStorage.removeItem("isLoggedIn");
                sessionStorage.clear();

                window.dispatchEvent(new Event("auth:logout"));

                if (shouldRedirectToLogin()) {
                    window.location.href = "/login";
                }

                return Promise.reject(refreshError);
            } finally {
                isRefreshing = false;
            }
        }

        return Promise.reject(error);
    }
);

export default instance;