import UserImage from "../../../assests/userImage.jpeg";
import { BACKEND_URL } from "../../../services/config";

export const getCommentErrorMessage = (error, fallback = "Xatolik yuz berdi.") => {
    const data = error?.response?.data;

    if (typeof data === "string" && data.trim()) {
        return data;
    }

    if (data?.detail) {
        return data.detail;
    }

    if (data?.message) {
        return data.message;
    }

    if (data?.error) {
        return data.error;
    }

    if (data && typeof data === "object") {
        const firstValue = Object.values(data)[0];

        if (Array.isArray(firstValue) && firstValue[0]) {
            return String(firstValue[0]);
        }

        if (typeof firstValue === "string" && firstValue.trim()) {
            return firstValue;
        }
    }

    if (error?.message) {
        return error.message;
    }

    return fallback;
};

export const getCommentUserName = (user) => {
    const fullName = `${user?.first_name || ""} ${user?.last_name || ""}`.trim();
    return fullName || user?.username || "Anonim foydalanuvchi";
};

export const getCommentAvatarUrl = (user) => {
    const image = user?.image;

    if (!image) {
        return UserImage;
    }

    const value = String(image).trim();

    if (!value) {
        return UserImage;
    }

    if (
        /^https?:\/\//i.test(value) ||
        value.startsWith("blob:") ||
        value.startsWith("data:")
    ) {
        return value;
    }

    const baseUrl = String(
        BACKEND_URL ||
        (typeof window !== "undefined" ? window.location.origin : "")
    ).replace(/\/+$/, "");

    const path = value.startsWith("/") ? value : `/${value}`;

    return `${baseUrl}${path}`;
};

export const handleCommentAvatarError = (event) => {
    if (!event?.currentTarget) {
        return;
    }

    event.currentTarget.onerror = null;
    event.currentTarget.src = UserImage;
};

export const normalizeLikesCount = (comment) => {
    const value = comment?.likes_count ?? comment?.likes ?? 0;
    const number = Number(value);

    return Number.isFinite(number) ? Math.max(0, number) : 0;
};