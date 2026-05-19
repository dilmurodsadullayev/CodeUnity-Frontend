// src/components/notifications/NotificationCard.jsx

import React from "react";
import { Link } from "react-router-dom";
import { motion } from "framer-motion";

import PlaceholderUserImage from "../../assests/userImage.jpeg";
import { timeUntilDeadline } from "../../utils/timeUntilDeadline";
import timeAgo from "../../utils/timeAgo";
import { BACKEND_URL } from "../../services/config";

const VALID_CONTENT_TYPES = [
    "problem",
    "solution",
    "coin",
    "post",
    "task",
    "star",
    "info",
    "badge",
];

const itemVariants = {
    hidden: { opacity: 0, y: 18, scale: 0.98 },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        transition: { duration: 0.28, ease: "easeOut" },
    },
    exit: {
        opacity: 0,
        x: -20,
        scale: 0.98,
        transition: { duration: 0.18, ease: "easeIn" },
    },
};

const normalizeBaseUrl = (url) => {
    if (!url) return window.location.origin;
    return String(url).replace(/\/+$/, "");
};

const getAbsoluteImageUrl = (image) => {
    if (!image) return PlaceholderUserImage;

    if (typeof image === "string" && image.startsWith("http")) {
        return image;
    }

    const baseUrl = normalizeBaseUrl(BACKEND_URL);

    if (typeof image === "string" && image.startsWith("/")) {
        return `${baseUrl}${image}`;
    }

    return `${baseUrl}/${image}`;
};

const getContentType = (notification) => {
    const contentType =
        notification?.content_type ||
        notification?.notification_type ||
        notification?.category;

    if (VALID_CONTENT_TYPES.includes(contentType)) {
        return contentType;
    }

    if (VALID_CONTENT_TYPES.includes(notification?.type)) {
        return notification.type;
    }

    return "info";
};

const getSenderInfo = (notification) => {
    const sender = notification?.sender;

    if (!sender) {
        return {
            username: "FSociety",
            image: PlaceholderUserImage,
        };
    }

    if (typeof sender === "string") {
        return {
            username: sender,
            image: PlaceholderUserImage,
        };
    }

    return {
        username:
            sender.username ||
            sender.full_name ||
            sender.first_name ||
            sender.email ||
            "FSociety",
        image: getAbsoluteImageUrl(sender.image),
    };
};

const getNotificationMeta = (notification) => {
    const contentType = getContentType(notification);

    const meta = {
        problem: {
            label: "Problem",
            icon: "fa-solid fa-triangle-exclamation",
            iconBox: "bg-red-500/15 text-red-300 border-red-400/25",
            border: "border-red-500/35",
            glow: "from-red-500/20",
            pill: "bg-red-500/10 text-red-300 border-red-400/25",
            button: "text-red-300 hover:text-red-200",
        },
        solution: {
            label: "Yechim",
            icon: "fa-solid fa-circle-check",
            iconBox: "bg-emerald-500/15 text-emerald-300 border-emerald-400/25",
            border: "border-emerald-500/35",
            glow: "from-emerald-500/20",
            pill: "bg-emerald-500/10 text-emerald-300 border-emerald-400/25",
            button: "text-emerald-300 hover:text-emerald-200",
        },
        coin: {
            label: "FCoin",
            icon: "fa-solid fa-coins",
            iconBox: "bg-yellow-500/15 text-yellow-300 border-yellow-400/25",
            border: "border-yellow-500/35",
            glow: "from-yellow-500/20",
            pill: "bg-yellow-500/10 text-yellow-300 border-yellow-400/25",
            button: "text-yellow-300 hover:text-yellow-200",
        },
        post: {
            label: "Post",
            icon: "fa-solid fa-newspaper",
            iconBox: "bg-purple-500/15 text-purple-300 border-purple-400/25",
            border: "border-purple-500/35",
            glow: "from-purple-500/20",
            pill: "bg-purple-500/10 text-purple-300 border-purple-400/25",
            button: "text-purple-300 hover:text-purple-200",
        },
        task: {
            label: "Task",
            icon: "fa-solid fa-list-check",
            iconBox: "bg-blue-500/15 text-blue-300 border-blue-400/25",
            border: "border-blue-500/35",
            glow: "from-blue-500/20",
            pill: "bg-blue-500/10 text-blue-300 border-blue-400/25",
            button: "text-blue-300 hover:text-blue-200",
        },
        star: {
            label: "Star",
            icon: "fa-solid fa-star",
            iconBox: "bg-amber-500/15 text-amber-300 border-amber-400/25",
            border: "border-amber-500/35",
            glow: "from-amber-500/20",
            pill: "bg-amber-500/10 text-amber-300 border-amber-400/25",
            button: "text-amber-300 hover:text-amber-200",
        },
        badge: {
            label: "Badge",
            icon: "fa-solid fa-award",
            iconBox: "bg-orange-500/15 text-orange-300 border-orange-400/25",
            border: "border-orange-500/35",
            glow: "from-orange-500/20",
            pill: "bg-orange-500/10 text-orange-300 border-orange-400/25",
            button: "text-orange-300 hover:text-orange-200",
        },
        info: {
            label: "Info",
            icon: "fa-solid fa-circle-info",
            iconBox: "bg-indigo-500/15 text-indigo-300 border-indigo-400/25",
            border: "border-indigo-500/35",
            glow: "from-indigo-500/20",
            pill: "bg-indigo-500/10 text-indigo-300 border-indigo-400/25",
            button: "text-indigo-300 hover:text-indigo-200",
        },
    };

    return meta[contentType] || meta.info;
};

const getNotificationText = (notification) => {
    if (notification?.message) return notification.message;

    const contentType = getContentType(notification);

    if (contentType === "coin") return "Sizga FCoin mukofot berildi.";
    if (contentType === "badge") return "Siz yangi nishon qo‘lga kiritdingiz.";
    if (contentType === "star") return "Sizga yangi star berildi.";
    if (contentType === "post") return "Yangi post bo‘yicha bildirishnoma.";
    if (contentType === "problem") return "Yangi problem bo‘yicha bildirishnoma.";
    if (contentType === "solution") return "Yechim bo‘yicha yangi bildirishnoma.";

    return "Yangi bildirishnoma.";
};

const getNotificationUrl = (notification, currentUser) => {
    const contentType = getContentType(notification);
    const objectId = notification?.object_id;

    if (
        contentType === "problem" ||
        contentType === "solution" ||
        contentType === "star"
    ) {
        return objectId ? `/problem/${objectId}/detail` : "/problems";
    }

    if (contentType === "post") {
        const senderUsername =
            notification?.sender?.username ||
            notification?.username ||
            currentUser?.username;

        const slug = notification?.post?.slug || notification?.slug;

        if (senderUsername && slug) {
            return `/${senderUsername}/post/${slug}/`;
        }

        return "/notifications";
    }

    if (contentType === "coin") return "/fcoin-history";

    if (contentType === "badge") {
        const username =
            currentUser?.username ||
            notification?.recipient?.username ||
            notification?.sender?.username;

        return username ? `/${username}/profile` : "/notifications";
    }

    return "/notifications";
};

const getExtraData = (notification) => {
    const coins =
        notification?.coins ||
        notification?.amount ||
        notification?.offered_coins ||
        notification?.problem?.offered_coins;

    const deadline = notification?.deadline || notification?.problem?.deadline;

    return { coins, deadline };
};

const NotificationCard = ({ notification, currentUser, onMarkRead }) => {
    const isUnread = !notification?.is_read;
    const meta = getNotificationMeta(notification);
    const sender = getSenderInfo(notification);
    const text = getNotificationText(notification);
    const link = getNotificationUrl(notification, currentUser);
    const { coins, deadline } = getExtraData(notification);

    const createdDate = notification?.created_at
        ? new Date(notification.created_at)
        : null;

    const safeDate =
        createdDate && !Number.isNaN(createdDate.getTime())
            ? createdDate.toLocaleDateString("uz-UZ")
            : "Bugun";

    const handleMarkRead = (event) => {
        event.preventDefault();
        event.stopPropagation();

        if (notification?.id) {
            onMarkRead(notification.id);
        }
    };

    const handleLinkClick = () => {
        if (notification?.id && isUnread) {
            onMarkRead(notification.id);
        }
    };

    return (
        <motion.article
            layout
            variants={itemVariants}
            initial="hidden"
            animate="visible"
            exit="exit"
            className={`group relative overflow-hidden rounded-3xl border ${
                isUnread ? meta.border : "border-gray-800"
            } bg-gray-900/70 shadow-2xl shadow-black/20 backdrop-blur-xl transition-all duration-300 hover:-translate-y-1 hover:bg-gray-900`}
        >
            <div
                className={`pointer-events-none absolute inset-0 bg-gradient-to-r ${meta.glow} via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100`}
            />

            {isUnread && (
                <div className="absolute right-4 top-4 z-20 flex items-center gap-2 rounded-full border border-indigo-400/25 bg-indigo-500/10 px-3 py-1 text-[10px] font-black uppercase tracking-wider text-indigo-300">
                    <span className="h-2 w-2 rounded-full bg-indigo-400 shadow-[0_0_14px_rgba(129,140,248,0.9)]"></span>
                    Yangi
                </div>
            )}

            <Link
                to={link}
                onClick={handleLinkClick}
                className="relative z-10 block p-4 sm:p-5"
            >
                <div className="flex flex-col gap-4 sm:flex-row sm:items-start">
                    <div className="relative shrink-0">
                        <img
                            src={sender.image}
                            alt={sender.username}
                            onError={(e) => {
                                e.currentTarget.src = PlaceholderUserImage;
                            }}
                            className="h-14 w-14 rounded-2xl border border-gray-700 object-cover shadow-xl shadow-black/25"
                        />

                        <div
                            className={`absolute -bottom-2 -right-2 flex h-8 w-8 items-center justify-center rounded-2xl border backdrop-blur-md ${meta.iconBox}`}
                        >
                            <i className={`${meta.icon} text-sm`}></i>
                        </div>
                    </div>

                    <div className="min-w-0 flex-1">
                        <div className="mb-2 flex flex-wrap items-center gap-2">
                            <span
                                className={`rounded-full border px-2.5 py-1 text-[10px] font-black uppercase tracking-wider ${meta.pill}`}
                            >
                                {meta.label}
                            </span>

                            <span className="rounded-full border border-gray-700 bg-gray-950/70 px-2.5 py-1 text-[10px] font-black uppercase tracking-wider text-gray-400">
                                @{sender.username}
                            </span>
                        </div>

                        <h3 className="text-base font-black leading-6 text-white sm:text-lg">
                            {text}
                        </h3>

                        <div className="mt-3 flex flex-wrap items-center gap-x-4 gap-y-2 text-xs font-bold text-gray-500">
                            {coins && (
                                <span className="inline-flex items-center rounded-full border border-yellow-400/20 bg-yellow-500/10 px-3 py-1 text-yellow-300">
                                    <i className="fa-solid fa-coins mr-1.5"></i>
                                    {coins} FCoin
                                </span>
                            )}

                            {deadline && (
                                <span className="inline-flex items-center rounded-full border border-red-400/20 bg-red-500/10 px-3 py-1 text-red-300">
                                    <i className="fa-solid fa-clock mr-1.5"></i>
                                    {timeUntilDeadline(deadline)}
                                </span>
                            )}

                            <span className="inline-flex items-center">
                                <i className="fa-solid fa-calendar-days mr-1.5 text-gray-600"></i>
                                {timeAgo(notification?.created_at)}
                            </span>
                        </div>
                    </div>

                    <div className="flex shrink-0 items-center justify-between gap-3 sm:flex-col sm:items-end">
                        {!isUnread ? (
                            <span className="rounded-full border border-emerald-400/20 bg-emerald-500/10 px-3 py-1 text-xs font-black text-emerald-300">
                                <i className="fa-solid fa-check mr-1.5"></i>
                                O‘qilgan
                            </span>
                        ) : (
                            <button
                                type="button"
                                onClick={handleMarkRead}
                                className={`rounded-full border border-gray-700 bg-gray-950/80 px-3 py-2 text-xs font-black transition hover:border-gray-600 ${meta.button}`}
                            >
                                <i className="fa-solid fa-check mr-1.5"></i>
                                O‘qildi
                            </button>
                        )}

                        <span className="text-[11px] font-bold text-gray-600">
                            {safeDate}
                        </span>
                    </div>
                </div>
            </Link>
        </motion.article>
    );
};

export default NotificationCard;