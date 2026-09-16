// src/services/auth.js

import axios from "./api";


/**
 * Backenddan kelgan xatolikdan foydalanuvchiga
 * tushunarli asosiy xabarni ajratib beradi.
 */
const getErrorMessage = (
    error,
    fallback = "Kutilmagan xatolik yuz berdi."
) => {
    const data = error?.response?.data;

    // Backendgacha umuman yetib bormagan bo'lsa
    if (!data) {
        if (
            error?.code === "ERR_NETWORK" ||
            error?.message === "Network Error"
        ) {
            return (
                "Server bilan bog‘lanib bo‘lmadi. " +
                "Backend ishlayotganini tekshiring."
            );
        }

        return error?.message || fallback;
    }


    // Backend plain text qaytarsa
    if (typeof data === "string") {
        return data;
    }


    // Bizning backenddagi asosiy format
    if (data.detail) {
        return data.detail;
    }


    if (data.msg) {
        return data.msg;
    }


    if (data.error) {
        return data.error;
    }


    // DRF non_field_errors
    if (
        Array.isArray(data.non_field_errors) &&
        data.non_field_errors.length > 0
    ) {
        return String(
            data.non_field_errors[0]
        );
    }


    // Yangi RegisterView:
    //
    // {
    //     errors: {
    //         username: ["..."]
    //     }
    // }
    if (
        data.errors &&
        typeof data.errors === "object"
    ) {
        const firstField =
            Object.keys(data.errors)[0];

        const firstFieldErrors =
            data.errors[firstField];

        if (
            firstField &&
            Array.isArray(firstFieldErrors) &&
            firstFieldErrors.length > 0
        ) {
            return String(
                firstFieldErrors[0]
            );
        }
    }


    // Oddiy DRF serializer format:
    //
    // {
    //     username: ["..."],
    //     password: ["..."]
    // }
    const firstKey = Object.keys(data)[0];

    if (firstKey) {
        const firstValue = data[firstKey];

        if (
            Array.isArray(firstValue) &&
            firstValue.length > 0
        ) {
            return String(
                firstValue[0]
            );
        }


        if (typeof firstValue === "string") {
            return firstValue;
        }
    }


    return fallback;
};


/**
 * Axios errorni frontend uchun foydaliroq
 * Error objectga aylantiradi.
 *
 * Shunda componentda:
 *
 * error.message
 * error.status
 * error.serverData
 * error.fieldErrors
 *
 * ishlatish mumkin.
 */
const createServiceError = (
    error,
    fallback
) => {
    const serviceError = new Error(
        getErrorMessage(
            error,
            fallback
        )
    );


    serviceError.status =
        error?.response?.status || null;


    serviceError.serverData =
        error?.response?.data || null;


    serviceError.fieldErrors =
        error?.response?.data?.errors || null;


    serviceError.originalError = error;


    return serviceError;
};


const AuthService = {

    // =========================================================
    // LOGIN
    // =========================================================

    async userLogin({
        username,
        password,
    }) {
        try {
            const { data } =
                await axios.post(
                    "/users/login/",
                    {
                        username,
                        password,
                    }
                );


            return data;

        } catch (error) {
            console.error(
                "Login xatosi:",
                error.response?.data ||
                error.message
            );


            throw createServiceError(
                error,
                "Login qilishda xatolik yuz berdi."
            );
        }
    },


    // =========================================================
    // REGISTER
    // =========================================================

    async userRegister({
        username,
        email,
        password,
        password2,
    }) {
        try {
            const { data } =
                await axios.post(
                    "/users/register/",
                    {
                        username,
                        email,
                        password,
                        password2,
                    }
                );


            return data;

        } catch (error) {
            console.error(
                "Register xatosi:",
                error.response?.data ||
                error.message
            );


            throw createServiceError(
                error,
                "Ro‘yxatdan o‘tishda xatolik yuz berdi."
            );
        }
    },


    // =========================================================
    // SOCIAL LOGIN
    // =========================================================

    async socialLogin(
        provider,
        code
    ) {
        try {
            if (
                !provider ||
                ![
                    "google",
                    "github",
                ].includes(provider)
            ) {
                throw new Error(
                    `Noto‘g‘ri social provider: ${provider}`
                );
            }


            if (!code) {
                throw new Error(
                    "OAuth code topilmadi."
                );
            }


            const { data } =
                await axios.post(
                    `/users/auth/${provider}/`,
                    {
                        code,
                    }
                );


            return data;

        } catch (error) {
            console.error(
                `${provider} login xatosi:`,
                {
                    status:
                        error.response?.status,

                    data:
                        error.response?.data,

                    message:
                        error.message,
                }
            );


            // Bu xato axios'dan emas,
            // yuqoridagi validationdan chiqqan bo'lishi mumkin.
            if (!error?.response) {
                throw error;
            }


            throw createServiceError(
                error,
                `${provider} orqali kirishda xatolik.`
            );
        }
    },


    // =========================================================
    // LOGOUT
    // =========================================================

    async userLogout() {
        try {
            const { data } =
                await axios.post(
                    "/users/logout/",
                    {}
                );


            localStorage.removeItem(
                "user"
            );

            localStorage.removeItem(
                "isLoggedIn"
            );

            sessionStorage.clear();


            return data;

        } catch (error) {
            console.error(
                "Logout xatosi:",
                error.response?.data ||
                error.message
            );


            // Backendga request muvaffaqiyatsiz bo'lsa ham,
            // frontenddagi auth ma'lumotlarini tozalaymiz.
            localStorage.removeItem(
                "user"
            );

            localStorage.removeItem(
                "isLoggedIn"
            );

            sessionStorage.clear();


            throw createServiceError(
                error,
                "Logout qilishda xatolik yuz berdi."
            );
        }
    },


    // =========================================================
    // TOKEN REFRESH
    // =========================================================

    async refreshToken() {
        try {
            const { data } =
                await axios.post(
                    "/users/token/refresh/",
                    {}
                );


            return data;

        } catch (error) {
            console.error(
                "Token refresh xatosi:",
                error.response?.data ||
                error.message
            );


            throw createServiceError(
                error,
                "Tokenni yangilashda xatolik yuz berdi."
            );
        }
    },


    // =========================================================
    // CURRENT USER
    // =========================================================

    async getUser() {
        try {
            const { data } =
                await axios.get(
                    "/users/user/"
                );


            return data;

        } catch (error) {
            console.error(
                "User ma'lumotlarini olish xatosi:",
                {
                    status:
                        error.response?.status,

                    data:
                        error.response?.data,

                    message:
                        getErrorMessage(error),
                }
            );


            throw createServiceError(
                error,
                "User ma’lumotlarini olishda xatolik yuz berdi."
            );
        }
    },


    // =========================================================
    // PROFILE
    // =========================================================

    async getProfile(
        username = null
    ) {
        try {
            if (username) {
                const { data } =
                    await axios.get(
                        `/users/${encodeURIComponent(
                            username
                        )}/profile/`
                    );


                return data;
            }


            const { data } =
                await axios.get(
                    "/users/user/"
                );


            return data;

        } catch (error) {
            console.error(
                "Profil ma'lumotlarini olish xatosi:",
                {
                    status:
                        error.response?.status,

                    data:
                        error.response?.data,

                    message:
                        getErrorMessage(error),
                }
            );


            throw createServiceError(
                error,
                "Profil ma’lumotlarini olishda xatolik yuz berdi."
            );
        }
    },

};


export default AuthService;