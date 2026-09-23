// src/components/ui/AuthToast.jsx

import React from "react";

import toast, {
    Toaster,
} from "react-hot-toast";

import {
    AlertCircle,
    CheckCircle2,
    CircleAlert,
    Info,
    LoaderCircle,
    X,
} from "lucide-react";

import "./AuthToast.css";


// =========================================================
// DEFAULT DURATIONS
// =========================================================

const DEFAULT_DURATION = {
    success: 3600,
    error: 5000,
    warning: 4400,
    info: 4000,
    loading: Infinity,
};


// =========================================================
// TOAST CONFIG
// =========================================================

const TOAST_CONFIG = {
    success: {
        title: "Muvaffaqiyat",
        code: "SUCCESS",
        Icon: CheckCircle2,
    },

    error: {
        title: "Xatolik",
        code: "ERROR",
        Icon: AlertCircle,
    },

    warning: {
        title: "Diqqat",
        code: "WARNING",
        Icon: CircleAlert,
    },

    info: {
        title: "Ma’lumot",
        code: "INFO",
        Icon: Info,
    },

    loading: {
        title: "Jarayon",
        code: "PROCESS",
        Icon: LoaderCircle,
    },
};


// =========================================================
// NORMALIZE MESSAGE
// =========================================================

const normalizeMessage = (
    message
) => {

    if (
        message === null
        ||
        message === undefined
    ) {
        return "";
    }


    if (
        typeof message === "string"
    ) {
        return message;
    }


    if (
        typeof message === "number"
        ||
        typeof message === "boolean"
    ) {
        return String(
            message
        );
    }


    try {

        return JSON.stringify(
            message
        );

    } catch {

        return (
            "Xabarni ko‘rsatib bo‘lmadi."
        );
    }
};


// =========================================================
// TOAST CONTENT
// =========================================================

const SiteToastContent = ({
    t,
    type = "info",
    title,
    message,
    duration,
}) => {

    const config =
        TOAST_CONFIG[type]
        ||
        TOAST_CONFIG.info;


    const Icon =
        config.Icon;


    const isLoading =
        type === "loading";


    const hasProgress =
        !isLoading
        &&
        Number.isFinite(
            duration
        );


    const role =
        (
            type === "error"
            ||
            type === "warning"
        )
            ? "alert"
            : "status";


    return (

        <div
            role={role}
            aria-live={
                role === "alert"
                    ? "assertive"
                    : "polite"
            }
            className={`
                site-toast
                site-toast--${type}

                ${
                    t.visible
                        ? "site-toast--show"
                        : "site-toast--hide"
                }
            `}
            style={
                hasProgress
                    ? {
                        "--toast-duration":
                            `${duration}ms`,
                    }
                    : undefined
            }
        >

            {/* =============================================
                AMBIENT GLOW
            ============================================== */}

            <div
                className="
                    site-toast__glow
                "
            />


            {/* =============================================
                ICON
            ============================================== */}

            <div
                className="
                    site-toast__icon-wrap
                "
            >

                <div
                    className="
                        site-toast__icon
                    "
                >

                    <Icon
                        size={21}
                        strokeWidth={2.15}
                        className={
                            isLoading
                                ? "site-toast__spinner"
                                : ""
                        }
                    />

                </div>


                {!isLoading && (

                    <span
                        className="
                            site-toast__pulse
                        "
                    />

                )}

            </div>


            {/* =============================================
                CONTENT
            ============================================== */}

            <div
                className="
                    site-toast__content
                "
            >

                <div
                    className="
                        site-toast__meta
                    "
                >

                    <span>
                        fsociety::
                        {
                            config.code
                        }
                    </span>


                    <i />


                    <small>
                        now
                    </small>

                </div>


                <div
                    className="
                        site-toast__header
                    "
                >

                    <strong>
                        {
                            title
                            ||
                            config.title
                        }
                    </strong>


                    <button
                        type="button"
                        className="
                            site-toast__close
                        "
                        onClick={() =>
                            toast.dismiss(
                                t.id
                            )
                        }
                        aria-label="
                            Xabarni yopish
                        "
                    >

                        <X
                            size={16}
                            strokeWidth={2.2}
                        />

                    </button>

                </div>


                {message && (

                    <p>
                        {
                            normalizeMessage(
                                message
                            )
                        }
                    </p>

                )}

            </div>


            {/* =============================================
                PROGRESS
            ============================================== */}

            {hasProgress && (

                <span
                    className="
                        site-toast__progress
                    "
                >

                    <span />

                </span>

            )}

        </div>
    );
};


// =========================================================
// SHOW TOAST
// =========================================================

const showToast = (
    type,
    message,
    options = {}
) => {

    const normalizedType =
        TOAST_CONFIG[type]
            ? type
            : "info";


    const duration =
        options.duration
        ??
        DEFAULT_DURATION[
            normalizedType
        ];


    return toast.custom(
        (
            t
        ) => (

            <SiteToastContent
                t={t}
                type={
                    normalizedType
                }
                title={
                    options.title
                }
                message={
                    message
                }
                duration={
                    duration
                }
            />

        ),
        {
            id:
                options.id,

            duration,
        }
    );
};


// =========================================================
// GLOBAL SITE TOAST API
//
// Butun project shu objectdan foydalanadi.
//
// siteToast.success()
// siteToast.error()
// siteToast.warning()
// siteToast.info()
// siteToast.loading()
// =========================================================

export const siteToast = {

    // =====================================================
    // SUCCESS
    // =====================================================

    success(
        message,
        options = {}
    ) {

        return showToast(
            "success",
            message,
            options
        );
    },


    // =====================================================
    // ERROR
    // =====================================================

    error(
        message,
        options = {}
    ) {

        return showToast(
            "error",
            message,
            options
        );
    },


    // =====================================================
    // WARNING
    // =====================================================

    warning(
        message,
        options = {}
    ) {

        return showToast(
            "warning",
            message,
            options
        );
    },


    // =====================================================
    // INFO
    // =====================================================

    info(
        message,
        options = {}
    ) {

        return showToast(
            "info",
            message,
            options
        );
    },


    // =====================================================
    // LOADING
    // =====================================================

    loading(
        message = "Jarayon bajarilmoqda...",
        options = {}
    ) {

        return showToast(
            "loading",
            message,
            {
                ...options,

                duration:
                    options.duration
                    ??
                    Infinity,
            }
        );
    },


    // =====================================================
    // UPDATE EXISTING TOAST
    //
    // Loading -> success/error qilish uchun.
    //
    // siteToast.update(
    //     toastId,
    //     "success",
    //     "Tayyor!"
    // )
    // =====================================================

    update(
        id,
        type,
        message,
        options = {}
    ) {

        if (
            !id
        ) {

            return showToast(
                type,
                message,
                options
            );
        }


        return showToast(
            type,
            message,
            {
                ...options,
                id,
            }
        );
    },


    // =====================================================
    // DISMISS ONE
    // =====================================================

    dismiss(
        id
    ) {

        if (
            !id
        ) {
            return;
        }


        toast.dismiss(
            id
        );
    },


    // =====================================================
    // DISMISS ALL
    // =====================================================

    dismissAll() {

        toast.dismiss();
    },
};


// =========================================================
// BACKWARD COMPATIBILITY
//
// Login.jsx hozir:
//
// import { authToast } from "./ui/AuthToast";
//
// deb ishlatyapti.
//
// Shu sabab eski code buzilmaydi.
// Keyinchalik hammasini siteToastga o'tkazamiz.
// =========================================================

export const authToast =
    siteToast;


// =========================================================
// GLOBAL TOASTER
//
// App.js ichida FAQAT BIR MARTA render qilinadi.
// =========================================================

const AuthToast = () => {

    return (

        <Toaster
            position="
                top-right
            "
            reverseOrder={
                false
            }
            gutter={12}
            containerStyle={{
                top: 22,
                right: 22,

                zIndex:
                    2147483647,

                pointerEvents:
                    "none",
            }}
            toastOptions={{
                style: {
                    background:
                        "transparent",

                    boxShadow:
                        "none",

                    padding:
                        0,

                    margin:
                        0,

                    maxWidth:
                        "none",
                },
            }}
        />

    );
};


export default AuthToast;