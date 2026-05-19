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

    const firstKey = Object.keys(data)[0];

    if (firstKey && Array.isArray(data[firstKey]) && data[firstKey].length > 0) {
        return `${firstKey}: ${data[firstKey][0]}`;
    }

    return fallback;
};

const AuthService = {
    async userLogin({ username, password }) {
        try {
            const { data } = await axios.post("/users/login/", {
                username,
                password,
            });

            return data;
        } catch (error) {
            console.error("Login xatosi:", error.response?.data || error.message);
            throw new Error(getErrorMessage(error, "Login yoki parol noto‘g‘ri."));
        }
    },

    async userRegister({ username, email, password, password2 }) {
        try {
            const { data } = await axios.post("/users/register/", {
                username,
                email,
                password,
                password2,
            });

            return data;
        } catch (error) {
            console.error("Register xatosi:", error.response?.data || error.message);
            throw new Error(getErrorMessage(error, "Ro‘yxatdan o‘tishda xatolik."));
        }
    },

    async socialLogin(provider, code) {
        try {
            if (!provider || !["google", "github"].includes(provider)) {
                throw new Error(`Noto‘g‘ri social provider: ${provider}`);
            }

            if (!code) {
                throw new Error("OAuth code topilmadi.");
            }

            const { data } = await axios.post(`/users/auth/${provider}/`, {
                code,
            });

            return data;
        } catch (error) {
            console.error(`${provider} login xatosi:`, {
                status: error.response?.status,
                data: error.response?.data,
                message: error.message,
            });

            throw new Error(getErrorMessage(error, `${provider} orqali kirishda xatolik.`));
        }
    },

    async userLogout() {
        try {
            const { data } = await axios.post("/users/logout/", {});

            localStorage.removeItem("user");
            localStorage.removeItem("isLoggedIn");
            sessionStorage.clear();

            return data;
        } catch (error) {
            console.error("Logout xatosi:", error.response?.data || error.message);

            localStorage.removeItem("user");
            localStorage.removeItem("isLoggedIn");
            sessionStorage.clear();

            throw new Error(getErrorMessage(error, "Logout qilishda xatolik."));
        }
    },

    async refreshToken() {
        try {
            const { data } = await axios.post("/users/token/refresh/", {});
            return data;
        } catch (error) {
            console.error("Token refresh xatosi:", error.response?.data || error.message);
            throw new Error(getErrorMessage(error, "Token yangilashda xatolik."));
        }
    },

    async getUser() {
        try {
            const { data } = await axios.get("/users/user/");
            return data;
        } catch (error) {
            console.error("User ma'lumotlarini olish xatosi:", {
                status: error.response?.status,
                data: error.response?.data,
                message: getErrorMessage(error),
            });

            throw new Error(getErrorMessage(error, "User ma’lumotlarini olishda xatolik."));
        }
    },

    async getProfile(username = null) {
        try {
            if (username) {
                const { data } = await axios.get(`/users/${username}/profile/`);
                return data;
            }

            const { data } = await axios.get("/users/user/");
            return data;
        } catch (error) {
            console.error("Profil ma'lumotlarini olish xatosi:", {
                status: error.response?.status,
                data: error.response?.data,
                message: getErrorMessage(error),
            });

            throw new Error(getErrorMessage(error, "Profil ma’lumotlarini olishda xatolik."));
        }
    },
};

export default AuthService;