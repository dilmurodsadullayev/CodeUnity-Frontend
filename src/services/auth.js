// src/services/auth.js

import axios from "./api";

const getErrorMessage = (error, fallback = "Kutilmagan xatolik yuz berdi.") => {
    const data = error?.response?.data;

    if (!data) return error?.message || fallback;

    if (typeof data === "string") return data;

    if (data.detail) return data.detail;
    if (data.msg) return data.msg;
    if (data.error) return data.error;

    if (Array.isArray(data.non_field_errors) && data.non_field_errors.length > 0) {
        return data.non_field_errors[0];
    }

    return fallback;
};

const AuthService = {
    async userLogin({ username, password }) {
        try {
            const response = await axios.post(
                "/users/login/",
                {
                    username,
                    password,
                },
                {
                    withCredentials: true,
                }
            );

            return response.data;
        } catch (error) {
            console.error("Login xatosi:", error.response?.data || error.message);
            throw error;
        }
    },

    async socialLogin(provider, code) {
        try {
            if (!provider || !["google", "github"].includes(provider)) {
                throw new Error(`Noto'g'ri social provider: ${provider}`);
            }

            if (!code) {
                throw new Error("OAuth code topilmadi.");
            }

            const response = await axios.post(
                `/users/auth/${provider}/`,
                { code },
                {
                    withCredentials: true,
                    headers: {
                        "Content-Type": "application/json",
                    },
                }
            );

            return response.data;
        } catch (error) {
            console.error(`${provider} login xatosi:`, {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
            });

            throw error;
        }
    },

    async userRegister({ username, email, password, password2 }) {
        try {
            const response = await axios.post(
                "/users/register/",
                {
                    username,
                    email,
                    password,
                    password2,
                },
                {
                    withCredentials: true,
                }
            );

            return response.data;
        } catch (error) {
            console.error("Register xatosi:", error.response?.data || error.message);
            throw error;
        }
    },

    async userLogout() {
        try {
            const response = await axios.post(
                "/users/logout/",
                {},
                {
                    withCredentials: true,
                }
            );

            return response.data;
        } catch (error) {
            console.error("Logout xatosi:", error.response?.data || error.message);
            throw error;
        }
    },

    async getUser() {
        try {
            const { data } = await axios.get("/users/user/", {
                withCredentials: true,
            });

            return data;
        } catch (error) {
            console.error("User ma'lumotlarini olish xatosi:", {
                status: error.response?.status,
                data: error.response?.data,
                message: getErrorMessage(error),
            });

            throw error;
        }
    },

    async getProfile(username = null) {
        try {
            if (username) {
                const { data } = await axios.get(`/users/${username}/profile/`, {
                    withCredentials: true,
                });

                return data;
            }

            const { data } = await axios.get("/users/user/", {
                withCredentials: true,
            });

            return data;
        } catch (error) {
            console.error("Profil ma'lumotlarini olish xatosi:", {
                status: error.response?.status,
                data: error.response?.data,
                message: getErrorMessage(error),
            });

            throw error;
        }
    },
};

export default AuthService;