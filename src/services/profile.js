// src/services/profile.js

import axios from "./api";

// =========================================================
// HELPERS
// =========================================================

const normalizeUsername = (
    username
) => {
    const value =
        String(
            username
            ??
            ""
        ).trim();

    if (
        !value
    ) {
        throw new Error(
            "Username topilmadi."
        );
    }

    return encodeURIComponent(
        value
    );
};

// =========================================================
// ERROR
//
// Original axios errorni saqlaymiz.
//
// Muhim:
// EditProfileModal error.serverData yoki
// error.response.data orqali real DRF xatosini
// o‘qiy oladi.
// =========================================================

const prepareProfileError = (
    error,
    fallbackMessage
) => {
    if (
        !error
    ) {
        return new Error(
            fallbackMessage
        );
    }

    const serverData =
        error?.response?.data;

    if (
        serverData !==
        undefined
    ) {
        error.serverData =
            serverData;
    }

    if (
        !error.message
    ) {
        error.message =
            fallbackMessage;
    }

    return error;
};

// =========================================================
// PROFILE SERVICE
// =========================================================

const ProfileService = {
    // =====================================================
    // GET PROFILE
    // =====================================================

    async getProfile(
        username,
        {
            signal,
        } = {}
    ) {
        const normalizedUsername =
            normalizeUsername(
                username
            );

        try {
            const {
                data,
            } = await axios.get(
                `/users/${normalizedUsername}/profile/`,
                {
                    withCredentials:
                        true,

                    signal,
                }
            );

            return data;
        } catch (
            error
        ) {
            console.error(
                "Profilni olishda xato:",
                error?.response?.data
                ||
                error?.response
                ||
                error?.message
                ||
                error
            );

            throw prepareProfileError(
                error,
                "Profilni olishda xatolik yuz berdi."
            );
        }
    },

    // =====================================================
    // UPDATE PROFILE
    //
    // dataToSend:
    //
    // 1) oddiy object
    // 2) FormData
    //
    // FormData bo‘lsa Content-Type qo‘lda berilmaydi.
    // Axios boundary bilan o‘zi yaratadi.
    // =====================================================

    async updateProfile(
        username,
        dataToSend,
        {
            signal,
        } = {}
    ) {
        const normalizedUsername =
            normalizeUsername(
                username
            );

        if (
            !dataToSend
        ) {
            throw new Error(
                "Profil ma’lumotlari yuborilmadi."
            );
        }

        try {
            const {
                data,
            } = await axios.patch(
                `/users/${normalizedUsername}/profile/`,
                dataToSend,
                {
                    withCredentials:
                        true,

                    signal,
                }
            );

            return data;
        } catch (
            error
        ) {
            console.error(
                "Profilni yangilashda xato:",
                error?.response?.data
                ||
                error?.response
                ||
                error?.message
                ||
                error
            );

            throw prepareProfileError(
                error,
                "Profilni yangilashda xatolik yuz berdi."
            );
        }
    },

    // =====================================================
    // UPDATE COVER IMAGE
    //
    // Endpoint existing contract bo‘yicha saqlangan.
    // =====================================================

    async updateCoverImage(
        formData,
        {
            signal,
        } = {}
    ) {
        if (
            !formData
        ) {
            throw new Error(
                "Fon rasmi ma’lumotlari yuborilmadi."
            );
        }

        try {
            const {
                data,
            } = await axios.patch(
                "/users/profile/cover-image/update/",
                formData,
                {
                    withCredentials:
                        true,

                    signal,

                    // Content-Type YOZILMAYDI.
                    // FormData uchun axios o‘zi belgilaydi.
                }
            );

            return data;
        } catch (
            error
        ) {
            console.error(
                "Fon rasmini yangilashda xato:",
                error?.response?.data
                ||
                error?.response
                ||
                error?.message
                ||
                error
            );

            throw prepareProfileError(
                error,
                "Fon rasmini yangilashda xatolik yuz berdi."
            );
        }
    },
};

// =========================================================
// EXPORT
// =========================================================

export default ProfileService;