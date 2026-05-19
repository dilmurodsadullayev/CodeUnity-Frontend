// src/components/NotificationDropdown.jsx

import React from "react";
import { useSelector, useDispatch } from "react-redux";
import { Link } from "react-router-dom";
import { motion, AnimatePresence } from "framer-motion";

import PlaceholderUserImage from "../assests/userImage.jpeg";
import { timeUntilDeadline } from "../utils/timeUntilDeadline";
import {
    markNotificationAsRead,
    markAllNotificationsAsRead,
} from "../middleware/notificationMiddleware";

import { BACKEND_URL } from "../services/config";

const dropdownVariants = {
    hidden: {
        opacity: 0,
        y: -12,
        scale: 0.96,
        filter: "blur(6px)",
    },
    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",
        transition: {
            duration: 0.22,
            ease: "easeOut",
        },
    },
    exit: {
        opacity: 0,
        y: -12,
        scale: 0.96,
        filter: "blur(6px)",
        transition: {
            duration: 0.16,
            ease: "easeIn",
        },
    },
};

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

const getSenderUsername = (sender) => {
    if (!sender) return "FSociety";
    if (typeof sender === "string") return sender;

    return (
        sender.username ||
        sender.full_name ||
        sender.first_name ||
        sender.email ||
        "FSociety"
    );
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

const formatDateTime = (value) => {
    if (!value) return "Hozirgina";

    const date = new Date(value);

    if (Number.isNaN(date.getTime())) {
        return "Hozirgina";
    }

    return `${date.toLocaleTimeString("uz-UZ", {
        hour: "2-digit",
        minute: "2-digit",
    })} • ${date.toLocaleDateString("uz-UZ")}`;
};

const getNotificationUrl = (notification) => {
    const contentType = getContentType(notification);
    const objectId = notification?.object_id;

    if (contentType === "problem" || contentType === "solution" || contentType === "star") {
        return objectId ? `/problem/${objectId}/detail` : "/problems";
    }

    if (contentType === "post") {
        const senderUsername = getSenderUsername(notification?.sender);
        const slug = notification?.post?.slug || notification?.slug;

        if (senderUsername && slug) {
            return `/${senderUsername}/post/${slug}/`;
        }

        return "/notifications";
    }

    if (contentType === "coin") {
        return "/fcoin-history";
    }

    if (contentType === "badge") {
        const senderUsername = notification?.recipient?.username || notification?.sender?.username;
        return senderUsername ? `/${senderUsername}/profile` : "/notifications";
    }

    return "/notifications";
};

const getNotificationMeta = (notification) => {
    const contentType = getContentType(notification);

    const map = {
        problem: {
            icon: "fa-solid fa-triangle-exclamation",
            label: "Problem",
            iconBox: "bg-red-500/15 text-red-300 border-red-400/25",
            glow: "from-red-500/20",
            pill: "bg-red-500/10 text-red-300 border-red-400/25",
        },
        solution: {
            icon: "fa-solid fa-circle-check",
            label: "Yechim",
            iconBox: "bg-emerald-500/15 text-emerald-300 border-emerald-400/25",
            glow: "from-emerald-500/20",
            pill: "bg-emerald-500/10 text-emerald-300 border-emerald-400/25",
        },
        coin: {
            icon: "fa-solid fa-coins",
            label: "FCoin",
            iconBox: "bg-yellow-500/15 text-yellow-300 border-yellow-400/25",
            glow: "from-yellow-500/20",
            pill: "bg-yellow-500/10 text-yellow-300 border-yellow-400/25",
        },
        post: {
            icon: "fa-solid fa-newspaper",
            label: "Post",
            iconBox: "bg-purple-500/15 text-purple-300 border-purple-400/25",
            glow: "from-purple-500/20",
            pill: "bg-purple-500/10 text-purple-300 border-purple-400/25",
        },
        task: {
            icon: "fa-solid fa-list-check",
            label: "Task",
            iconBox: "bg-blue-500/15 text-blue-300 border-blue-400/25",
            glow: "from-blue-500/20",
            pill: "bg-blue-500/10 text-blue-300 border-blue-400/25",
        },
        star: {
            icon: "fa-solid fa-star",
            label: "Star",
            iconBox: "bg-amber-500/15 text-amber-300 border-amber-400/25",
            glow: "from-amber-500/20",
            pill: "bg-amber-500/10 text-amber-300 border-amber-400/25",
        },
        badge: {
            icon: "fa-solid fa-award",
            label: "Badge",
            iconBox: "bg-orange-500/15 text-orange-300 border-orange-400/25",
            glow: "from-orange-500/20",
            pill: "bg-orange-500/10 text-orange-300 border-orange-400/25",
        },
        info: {
            icon: "fa-solid fa-circle-info",
            label: "Info",
            iconBox: "bg-indigo-500/15 text-indigo-300 border-indigo-400/25",
            glow: "from-indigo-500/20",
            pill: "bg-indigo-500/10 text-indigo-300 border-indigo-400/25",
        },
    };

    return map[contentType] || map.info;
};

const getNotificationText = (notification) => {
    if (notification?.message) {
        return notification.message;
    }

    const contentType = getContentType(notification);

    if (contentType === "coin") {
        return "Sizga FCoin mukofot berildi.";
    }

    if (contentType === "badge") {
        return "Siz yangi nishon qo‘lga kiritdingiz.";
    }

    if (contentType === "star") {
        return "Sizga yangi star berildi.";
    }

    if (contentType === "post") {
        return "Yangi post bo‘yicha bildirishnoma.";
    }

    if (contentType === "problem") {
        return "Yangi problem bo‘yicha bildirishnoma.";
    }

    return "Yangi bildirishnoma.";
};

const NotificationItem = ({ notification, onMarkRead, onClose }) => {
    const isUnread = !notification?.is_read;
    const meta = getNotificationMeta(notification);

    const sender = notification?.sender || {};
    const senderUsername = getSenderUsername(sender);
    const imageSrc = getAbsoluteImageUrl(sender?.image);

    const notificationUrl = getNotificationUrl(notification);
    const text = getNotificationText(notification);

    const coins =
        notification?.coins ||
        notification?.amount ||
        notification?.offered_coins ||
        notification?.problem?.offered_coins;

    const deadline =
        notification?.deadline ||
        notification?.problem?.deadline;

    const handleClick = () => {
        if (notification?.id) {
            onMarkRead(notification.id);
        }

        if (onClose) {
            onClose();
        }
    };

    return (
        <Link
            to={notificationUrl}
            onClick={handleClick}
            className={`group relative block overflow-hidden border-b border-gray-800/80 transition-all duration-300 last:border-b-0 ${
                isUnread
                    ? "bg-indigo-500/[0.08] hover:bg-indigo-500/[0.13]"
                    : "hover:bg-gray-800/70"
            }`}
        >
            <div className={`pointer-events-none absolute inset-0 bg-gradient-to-r ${meta.glow} via-transparent to-transparent opacity-0 transition-opacity duration-300 group-hover:opacity-100`} />

            <div className="relative z-10 flex gap-3 px-4 py-4">
                <div className="relative shrink-0">
                    <img
                        src={imageSrc}
                        alt={senderUsername}
                        className="h-11 w-11 rounded-2xl border border-gray-700 object-cover shadow-lg shadow-black/25"
                        onError={(e) => {
                            e.currentTarget.src = PlaceholderUserImage;
                        }}
                    />

                    <div className={`absolute -bottom-1 -right-1 flex h-7 w-7 items-center justify-center rounded-xl border backdrop-blur-md ${meta.iconBox}`}>
                        <i className={`${meta.icon} text-xs`}></i>
                    </div>
                </div>

                <div className="min-w-0 flex-1">
                    <div className="flex items-start justify-between gap-3">
                        <div className="min-w-0">
                            <div className="mb-1 flex flex-wrap items-center gap-2">
                                <span className={`rounded-full border px-2 py-0.5 text-[10px] font-black uppercase tracking-wider ${meta.pill}`}>
                                    {meta.label}
                                </span>

                                {isUnread && (
                                    <span className="rounded-full bg-indigo-500/20 px-2 py-0.5 text-[10px] font-black uppercase tracking-wider text-indigo-300">
                                        Yangi
                                    </span>
                                )}
                            </div>

                            <p className="line-clamp-2 text-sm font-bold leading-5 text-gray-100 group-hover:text-white">
                                {text}
                            </p>
                        </div>

                        {isUnread && (
                            <span className="mt-1 h-2.5 w-2.5 shrink-0 rounded-full bg-indigo-400 shadow-[0_0_14px_rgba(129,140,248,0.9)]" />
                        )}
                    </div>

                    <div className="mt-2 flex flex-wrap items-center gap-x-3 gap-y-1 text-[11px] font-semibold text-gray-500">
                        <span className="inline-flex items-center">
                            <i className="fa-solid fa-user mr-1.5 text-gray-600"></i>
                            @{senderUsername}
                        </span>

                        {coins && (
                            <span className="inline-flex items-center text-yellow-300">
                                <i className="fa-solid fa-coins mr-1.5"></i>
                                {coins} FCoin
                            </span>
                        )}

                        {deadline && (
                            <span className="inline-flex items-center text-red-300">
                                <i className="fa-solid fa-clock mr-1.5"></i>
                                {timeUntilDeadline(deadline)}
                            </span>
                        )}
                    </div>

                    <div className="mt-2 text-right text-[11px] font-bold text-gray-600">
                        {formatDateTime(notification?.created_at)}
                    </div>
                </div>
            </div>
        </Link>
    );
};

const EmptyState = ({ type }) => {
    const isReadState = type === "read";

    return (
        <div className="px-5 py-10 text-center">
            <div className="mx-auto mb-4 flex h-20 w-20 items-center justify-center rounded-full border border-gray-700 bg-gray-900/80 shadow-xl shadow-black/30">
                <i
                    className={`text-4xl ${
                        isReadState
                            ? "fa-solid fa-circle-check text-emerald-400/80"
                            : "fa-solid fa-bell-slash text-gray-600"
                    }`}
                ></i>
            </div>

            <h4 className="text-base font-black text-white">
                {isReadState
                    ? "Barcha bildirishnomalar o‘qilgan"
                    : "Hali bildirishnomalar mavjud emas"}
            </h4>

            <p className="mx-auto mt-2 max-w-xs text-xs font-semibold leading-6 text-gray-500">
                {isReadState
                    ? "Yangi xabarlar kelganda bu yerda yana ko‘rinadi."
                    : "Problem, post, coin yoki badge bo‘yicha xabarlar shu yerda chiqadi."}
            </p>
        </div>
    );
};

const NotificationDropdown = ({
    openNotifications,
    setOpenNotifications,
    notificationsRef,
}) => {
    const dispatch = useDispatch();

    const {
        notifications = [],
        totalUnreadCount = 0,
        wsConnected,
        wsError,
        loading,
    } = useSelector((state) => state.notifications || {});

    const safeNotifications = Array.isArray(notifications) ? notifications : [];

    const sortedNotifications = [...safeNotifications].sort((a, b) => {
        return new Date(b.created_at || 0) - new Date(a.created_at || 0);
    });

    const unreadNotifications = sortedNotifications.filter((item) => !item.is_read);

    const unreadCount =
        typeof totalUnreadCount === "number"
            ? totalUnreadCount
            : unreadNotifications.length;

    const dropdownItems =
        unreadNotifications.length > 0
            ? unreadNotifications.slice(0, 8)
            : sortedNotifications.slice(0, 8);

    const handleMarkOneAsRead = (notificationId) => {
        dispatch(markNotificationAsRead(notificationId));
    };

    const handleMarkAllAsRead = () => {
        dispatch(markAllNotificationsAsRead());
    };

    const closeDropdown = () => {
        setOpenNotifications(false);
    };

    return (
        <div className="relative" ref={notificationsRef}>
            <button
                type="button"
                onClick={() => setOpenNotifications(!openNotifications)}
                className="group relative flex h-11 w-11 items-center justify-center rounded-2xl border border-gray-700/70 bg-gray-900/70 text-white shadow-lg shadow-black/20 transition-all duration-300 hover:border-indigo-400/40 hover:bg-gray-800 focus:outline-none focus:ring-2 focus:ring-indigo-500/40"
                aria-label="Bildirishnomalar"
            >
                <span className="absolute inset-0 rounded-2xl bg-indigo-500/10 opacity-0 blur-xl transition-opacity group-hover:opacity-100"></span>

                <i className="fa-solid fa-bell relative z-10 text-lg"></i>

                {unreadCount > 0 && (
                    <span className="absolute -right-2 -top-2 z-20 flex min-h-6 min-w-6 items-center justify-center rounded-full border-2 border-gray-950 bg-red-600 px-1.5 text-[10px] font-black leading-none text-white shadow-lg shadow-red-600/30">
                        {unreadCount > 99 ? "99+" : unreadCount}
                    </span>
                )}

                {wsConnected && (
                    <span className="absolute bottom-1 right-1 h-2.5 w-2.5 rounded-full border border-gray-950 bg-emerald-400 shadow-[0_0_10px_rgba(52,211,153,0.8)]"></span>
                )}
            </button>

            <AnimatePresence>
                {openNotifications && (
                    <motion.div
                        className="absolute right-0 z-50 mt-3 w-[22rem] origin-top-right overflow-hidden rounded-3xl border border-gray-700/80 bg-gray-950/95 shadow-2xl shadow-black/50 backdrop-blur-xl sm:w-[28rem]"
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                    >
                        <div className="relative overflow-hidden border-b border-gray-800 bg-gray-900/80 px-5 py-4">
                            <div className="pointer-events-none absolute -right-12 -top-12 h-32 w-32 rounded-full bg-indigo-500/20 blur-3xl"></div>
                            <div className="pointer-events-none absolute -left-12 -bottom-12 h-32 w-32 rounded-full bg-purple-500/10 blur-3xl"></div>

                            <div className="relative z-10 flex items-start justify-between gap-4">
                                <div>
                                    <div className="flex items-center gap-2">
                                        <h3 className="text-lg font-black text-white">
                                            Bildirishnomalar
                                        </h3>

                                        {unreadCount > 0 && (
                                            <span className="rounded-full border border-indigo-400/30 bg-indigo-500/10 px-2.5 py-1 text-xs font-black text-indigo-300">
                                                {unreadCount}
                                            </span>
                                        )}
                                    </div>

                                    <p className="mt-1 text-xs font-semibold text-gray-500">
                                        {wsConnected
                                            ? "Real-time ulanish faol"
                                            : "Real-time ulanish kutilmoqda"}
                                    </p>

                                    {wsError && (
                                        <p className="mt-1 text-[11px] font-semibold text-red-300">
                                            {wsError}
                                        </p>
                                    )}
                                </div>

                                {unreadCount > 0 && (
                                    <button
                                        type="button"
                                        onClick={handleMarkAllAsRead}
                                        className="rounded-xl border border-indigo-400/25 bg-indigo-500/10 px-3 py-2 text-xs font-black text-indigo-300 transition hover:bg-indigo-500/20 hover:text-indigo-200"
                                    >
                                        <i className="fa-solid fa-check-double mr-1.5"></i>
                                        O‘qildi
                                    </button>
                                )}
                            </div>
                        </div>

                        <div className="max-h-[25rem] overflow-y-auto">
                            {loading ? (
                                <div className="space-y-3 px-4 py-5">
                                    {[1, 2, 3].map((item) => (
                                        <div
                                            key={item}
                                            className="flex animate-pulse gap-3 rounded-2xl border border-gray-800 bg-gray-900/60 p-4"
                                        >
                                            <div className="h-11 w-11 rounded-2xl bg-gray-800"></div>
                                            <div className="flex-1 space-y-2">
                                                <div className="h-3 w-24 rounded-full bg-gray-800"></div>
                                                <div className="h-4 w-full rounded-full bg-gray-800"></div>
                                                <div className="h-3 w-2/3 rounded-full bg-gray-800"></div>
                                            </div>
                                        </div>
                                    ))}
                                </div>
                            ) : safeNotifications.length === 0 ? (
                                <EmptyState />
                            ) : dropdownItems.length > 0 ? (
                                dropdownItems.map((notification) => (
                                    <NotificationItem
                                        key={notification.id}
                                        notification={notification}
                                        onMarkRead={handleMarkOneAsRead}
                                        onClose={closeDropdown}
                                    />
                                ))
                            ) : (
                                <EmptyState type="read" />
                            )}
                        </div>

                        {safeNotifications.length > 0 && (
                            <div className="border-t border-gray-800 bg-gray-900/80 p-3">
                                <Link
                                    to="/notifications"
                                    onClick={closeDropdown}
                                    className="flex items-center justify-center rounded-2xl border border-gray-700 bg-gray-950/70 px-4 py-3 text-sm font-black text-indigo-300 transition-all hover:border-indigo-400/40 hover:bg-indigo-500/10 hover:text-indigo-200"
                                >
                                    Ko‘proq ko‘rish
                                    <i className="fa-solid fa-arrow-right ml-2"></i>
                                </Link>
                            </div>
                        )}
                    </motion.div>
                )}
            </AnimatePresence>
        </div>
    );
};

export default NotificationDropdown;