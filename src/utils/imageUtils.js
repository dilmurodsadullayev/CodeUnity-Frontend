import DefaultUserImage from "../assests/userImage.jpeg";

import {
    BACKEND_URL,
} from "../services/config";


// =========================================================
// BASE URL
// =========================================================

const getBackendBaseUrl = () => {
    const url =
        BACKEND_URL ||
        process.env.REACT_APP_BACKEND_URL ||
        "http://localhost:8000";


    return String(
        url
    ).replace(
        /\/+$/,
        ""
    );
};


// =========================================================
// MEDIA URL
// =========================================================

export const getMediaUrl = (
    value,
    fallback = DefaultUserImage
) => {
    if (!value) {
        return fallback;
    }


    const image =
        String(
            value
        ).trim();


    if (!image) {
        return fallback;
    }


    // =============================================
    // DATA / BLOB
    // =============================================

    if (
        image.startsWith("data:") ||
        image.startsWith("blob:")
    ) {
        return image;
    }


    // =============================================
    // ABSOLUTE URL
    // =============================================

    if (
        /^https?:\/\//i.test(
            image
        )
    ) {
        return image;
    }


    // =============================================
    // //example.com/image.jpg
    // =============================================

    if (
        image.startsWith("//")
    ) {
        const protocol =
            typeof window !==
                "undefined"
                ? window.location.protocol
                : "https:";


        return (
            `${protocol}${image}`
        );
    }


    // =============================================
    // RELATIVE MEDIA URL
    // =============================================

    const baseUrl =
        getBackendBaseUrl();


    const path =
        image.startsWith("/")
            ? image
            : `/${image}`;


    return (
        `${baseUrl}${path}`
    );
};


// =========================================================
// USER AVATAR
// =========================================================

export const getUserAvatarUrl = (
    user,
    fallback = DefaultUserImage
) => {
    if (
        !user ||
        typeof user !==
            "object"
    ) {
        return fallback;
    }


    const image =
        user.image ||
        user.avatar ||
        user.image_url ||
        user.profile_image ||
        user.profile_photo ||
        user.photo ||
        null;


    return getMediaUrl(
        image,
        fallback
    );
};


// =========================================================
// IMAGE ERROR
// =========================================================

export const handleUserImageError = (
    event,
    fallback = DefaultUserImage
) => {
    if (
        !event?.currentTarget
    ) {
        return;
    }


    const image =
        event.currentTarget;


    /*
     * fallbackning o'zi xato bersa
     * infinite onError loop bo'lmasligi uchun.
     */
    image.onerror =
        null;


    image.src =
        fallback;
};


export {
    DefaultUserImage,
};