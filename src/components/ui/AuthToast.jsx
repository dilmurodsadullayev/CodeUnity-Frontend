import React from "react";

import toast, {
    Toaster,
} from "react-hot-toast";

import {
    AlertCircle,
    CheckCircle2,
    CircleAlert,
    Info,
    X,
} from "lucide-react";

import "./AuthToast.css";


const TOAST_CONFIG = {
    success: {
        title: "Muvaffaqiyat",
        Icon: CheckCircle2,
    },

    error: {
        title: "Xatolik",
        Icon: AlertCircle,
    },

    warning: {
        title: "Diqqat",
        Icon: CircleAlert,
    },

    info: {
        title: "Ma’lumot",
        Icon: Info,
    },
};


const AuthToastContent = ({
    t,
    type,
    title,
    message,
    duration,
}) => {
    const config =
        TOAST_CONFIG[type] ||
        TOAST_CONFIG.info;

    const Icon =
        config.Icon;


    return (
        <div
            className={`
                auth-toast
                auth-toast--${type}
                ${
                    t.visible
                        ? "auth-toast--show"
                        : "auth-toast--hide"
                }
            `}
            style={{
                "--toast-duration":
                    `${duration}ms`,
            }}
        >

            <div className="auth-toast__icon-wrap">

                <div className="auth-toast__icon">

                    <Icon
                        size={21}
                        strokeWidth={2.2}
                    />

                </div>


                <span className="auth-toast__pulse" />

            </div>


            <div className="auth-toast__content">

                <div className="auth-toast__header">

                    <strong>
                        {
                            title ||
                            config.title
                        }
                    </strong>


                    <button
                        type="button"
                        className="auth-toast__close"
                        onClick={() =>
                            toast.dismiss(
                                t.id
                            )
                        }
                        aria-label="Xabarni yopish"
                    >
                        <X
                            size={16}
                            strokeWidth={2.2}
                        />
                    </button>

                </div>


                <p>
                    {message}
                </p>

            </div>


            <span className="auth-toast__progress">
                <span />
            </span>

        </div>
    );
};


const showToast = (
    type,
    message,
    options = {}
) => {
    const duration =
        options.duration ||
        4200;


    return toast.custom(
        (t) => (
            <AuthToastContent
                t={t}
                type={type}
                title={options.title}
                message={message}
                duration={duration}
            />
        ),
        {
            duration,
            id: options.id,
        }
    );
};


export const authToast = {

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


    dismiss(id) {
        toast.dismiss(id);
    },


    dismissAll() {
        toast.dismiss();
    },
};


const AuthToast = () => {
    return (
        <Toaster
            position="top-right"

            gutter={12}

            containerStyle={{
                top: 22,
                right: 22,
                zIndex: 2147483647,
                pointerEvents: "none",
            }}

            toastOptions={{
                style: {
                    background: "transparent",
                    boxShadow: "none",
                    padding: 0,
                    margin: 0,
                    maxWidth: "none",
                },
            }}
        />
    );
};


export default AuthToast;