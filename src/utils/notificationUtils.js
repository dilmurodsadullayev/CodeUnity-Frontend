import {
    AlertTriangle,
    Award,
    Bell,
    CheckCheck,
    CheckCircle2,
    Clock3,
    Coins,
    Info,
    Layers,
    ListChecks,
    Newspaper,
    Star,
} from "lucide-react";

import {
    BACKEND_URL,
} from "../services/config";

import PlaceholderUserImage from "../assests/userImage.jpeg";


// =========================================================
// VALID TYPES
// =========================================================

export const VALID_NOTIFICATION_TYPES = [
    "problem",
    "solution",
    "coin",
    "post",
    "task",
    "star",
    "badge",
    "info",
];


// =========================================================
// FILTERS
// =========================================================

export const NOTIFICATION_FILTERS = [
    {
        key: "all",
        label: "Hammasi",
        Icon: Layers,
    },

    {
        key: "unread",
        label: "O‘qilmagan",
        Icon: Bell,
    },

    {
        key: "read",
        label: "O‘qilgan",
        Icon: CheckCheck,
    },
];


// =========================================================
// NORMALIZE BASE URL
// =========================================================

export const normalizeBaseUrl = (
    url
) => {
    if (!url) {
        return (
            typeof window !== "undefined"
                ? window.location.origin
                : ""
        );
    }


    return String(
        url
    ).replace(
        /\/+$/,
        ""
    );
};


// =========================================================
// ABSOLUTE IMAGE URL
// =========================================================

export const getAbsoluteImageUrl = (
    image,
    fallback = PlaceholderUserImage
) => {
    if (!image) {
        return fallback;
    }


    const value =
        String(
            image
        ).trim();


    if (!value) {
        return fallback;
    }


    // =====================================================
    // ABSOLUTE HTTP URL
    // =====================================================

    if (
        /^https?:\/\//i.test(
            value
        )
    ) {
        return value;
    }


    // =====================================================
    // BROWSER GENERATED URL
    // =====================================================

    if (
        value.startsWith(
            "blob:"
        ) ||
        value.startsWith(
            "data:"
        )
    ) {
        return value;
    }


    // =====================================================
    // BACKEND MEDIA URL
    // =====================================================

    const baseUrl =
        normalizeBaseUrl(
            BACKEND_URL
        );


    const path =
        value.startsWith("/")
            ? value
            : `/${value}`;


    return (
        `${baseUrl}${path}`
    );
};


// =========================================================
// SENDER USERNAME
// =========================================================

export const getSenderUsername = (
    sender
) => {
    if (!sender) {
        return "FSociety";
    }


    if (
        typeof sender ===
        "string"
    ) {
        return sender;
    }


    return (
        sender.username ||
        sender.full_name ||
        sender.first_name ||
        sender.email ||
        "FSociety"
    );
};


// =========================================================
// NOTIFICATION TYPE
// =========================================================

export const getNotificationType = (
    notification
) => {
    if (!notification) {
        return "info";
    }


    const candidates = [
        notification.content_type,
        notification.notification_type,
        notification.category,
        notification.type,
    ];


    const foundType =
        candidates.find(
            (type) =>
                VALID_NOTIFICATION_TYPES.includes(
                    type
                )
        );


    return (
        foundType ||
        "info"
    );
};


// =========================================================
// NOTIFICATION META
// =========================================================

export const getNotificationMeta = (
    notification
) => {
    const type =
        getNotificationType(
            notification
        );


    const metaMap = {

        // =================================================
        // PROBLEM
        // =================================================

        problem: {
            type: "problem",

            label: "Problem",

            Icon: AlertTriangle,

            iconBox:
                "border-red-400/20 bg-red-500/10 text-red-300",

            pill:
                "border-red-400/20 bg-red-500/[0.07] text-red-300",

            glow:
                "from-red-500/[0.10]",

            dot:
                "bg-red-400",
        },


        // =================================================
        // SOLUTION
        // =================================================

        solution: {
            type: "solution",

            label: "Yechim",

            Icon: CheckCircle2,

            iconBox:
                "border-emerald-400/20 bg-emerald-500/10 text-emerald-300",

            pill:
                "border-emerald-400/20 bg-emerald-500/[0.07] text-emerald-300",

            glow:
                "from-emerald-500/[0.10]",

            dot:
                "bg-emerald-400",
        },


        // =================================================
        // COIN
        // =================================================

        coin: {
            type: "coin",

            label: "FCoin",

            Icon: Coins,

            iconBox:
                "border-amber-400/20 bg-amber-500/10 text-amber-300",

            pill:
                "border-amber-400/20 bg-amber-500/[0.07] text-amber-300",

            glow:
                "from-amber-500/[0.10]",

            dot:
                "bg-amber-400",
        },


        // =================================================
        // POST
        // =================================================

        post: {
            type: "post",

            label: "Post",

            Icon: Newspaper,

            iconBox:
                "border-violet-400/20 bg-violet-500/10 text-violet-300",

            pill:
                "border-violet-400/20 bg-violet-500/[0.07] text-violet-300",

            glow:
                "from-violet-500/[0.10]",

            dot:
                "bg-violet-400",
        },


        // =================================================
        // TASK
        // =================================================

        task: {
            type: "task",

            label: "Task",

            Icon: ListChecks,

            iconBox:
                "border-blue-400/20 bg-blue-500/10 text-blue-300",

            pill:
                "border-blue-400/20 bg-blue-500/[0.07] text-blue-300",

            glow:
                "from-blue-500/[0.10]",

            dot:
                "bg-blue-400",
        },


        // =================================================
        // STAR
        // =================================================

        star: {
            type: "star",

            label: "Star",

            Icon: Star,

            iconBox:
                "border-yellow-400/20 bg-yellow-500/10 text-yellow-300",

            pill:
                "border-yellow-400/20 bg-yellow-500/[0.07] text-yellow-300",

            glow:
                "from-yellow-500/[0.10]",

            dot:
                "bg-yellow-400",
        },


        // =================================================
        // BADGE
        // =================================================

        badge: {
            type: "badge",

            label: "Badge",

            Icon: Award,

            iconBox:
                "border-orange-400/20 bg-orange-500/10 text-orange-300",

            pill:
                "border-orange-400/20 bg-orange-500/[0.07] text-orange-300",

            glow:
                "from-orange-500/[0.10]",

            dot:
                "bg-orange-400",
        },


        // =================================================
        // INFO
        // =================================================

        info: {
            type: "info",

            label: "Info",

            Icon: Info,

            iconBox:
                "border-indigo-400/20 bg-indigo-500/10 text-indigo-300",

            pill:
                "border-indigo-400/20 bg-indigo-500/[0.07] text-indigo-300",

            glow:
                "from-indigo-500/[0.10]",

            dot:
                "bg-indigo-400",
        },
    };


    return (
        metaMap[type] ||
        metaMap.info
    );
};


// =========================================================
// NOTIFICATION TEXT
// =========================================================

export const getNotificationText = (
    notification
) => {
    if (!notification) {
        return "Yangi bildirishnoma.";
    }


    if (
        notification.message
    ) {
        return (
            notification.message
        );
    }


    const type =
        getNotificationType(
            notification
        );


    switch (
        type
    ) {

        case "problem":
            return (
                "Problem bo‘yicha yangi bildirishnoma."
            );


        case "solution":
            return (
                "Yechim bo‘yicha yangi bildirishnoma."
            );


        case "coin":
            return (
                "Sizga FCoin mukofoti berildi."
            );


        case "post":
            return (
                "Post bo‘yicha yangi bildirishnoma."
            );


        case "task":
            return (
                "Task bo‘yicha yangi bildirishnoma."
            );


        case "star":
            return (
                "Sizga yangi star berildi."
            );


        case "badge":
            return (
                "Siz yangi badge qo‘lga kiritdingiz."
            );


        default:
            return (
                "Yangi bildirishnoma."
            );
    }
};


// =========================================================
// OBJECT ID
// =========================================================

export const getNotificationObjectId = (
    notification
) => {
    return (
        notification?.object_id ??
        notification?.problem?.id ??
        notification?.post?.id ??
        null
    );
};


// =========================================================
// COINS
// =========================================================

export const getNotificationCoins = (
    notification
) => {
    return (
        notification?.coins ??
        notification?.amount ??
        notification?.offered_coins ??
        notification?.problem?.offered_coins ??
        null
    );
};


// =========================================================
// DEADLINE
// =========================================================

export const getNotificationDeadline = (
    notification
) => {
    return (
        notification?.deadline ||
        notification?.problem?.deadline ||
        null
    );
};


// =========================================================
// NOTIFICATION URL
// =========================================================

export const getNotificationUrl = (
    notification,
    currentUsername = null
) => {
    const type =
        getNotificationType(
            notification
        );


    const objectId =
        getNotificationObjectId(
            notification
        );


    // =====================================================
    // PROBLEM
    // =====================================================

    if (
        type === "problem"
    ) {
        return objectId
            ? `/problem/${objectId}/detail`
            : "/problems";
    }


    // =====================================================
    // SOLUTION
    // =====================================================

    if (
        type === "solution"
    ) {
        return objectId
            ? `/problem/${objectId}/detail`
            : "/problems";
    }


    // =====================================================
    // STAR
    // =====================================================

    if (
        type === "star"
    ) {
        return objectId
            ? `/problem/${objectId}/detail`
            : "/notifications";
    }


    // =====================================================
    // COIN
    // =====================================================

    if (
        type === "coin"
    ) {
        return "/fcoin-history";
    }


    // =====================================================
    // POST
    // =====================================================

    if (
        type === "post"
    ) {
        const username =
            notification?.sender?.username ||
            notification?.username ||
            currentUsername;


        const slug =
            notification?.post?.slug ||
            notification?.slug;


        if (
            username &&
            slug
        ) {
            return (
                `/${username}/post/${slug}/`
            );
        }


        return "/notifications";
    }


    // =====================================================
    // BADGE
    // =====================================================

    if (
        type === "badge"
    ) {
        const username =
            notification?.recipient?.username ||
            currentUsername ||
            notification?.sender?.username;


        if (
            username
        ) {
            return (
                `/${username}/profile`
            );
        }


        return "/notifications";
    }


    // =====================================================
    // TASK / INFO
    // =====================================================

    return "/notifications";
};


// =========================================================
// FORMAT DATE
// =========================================================

export const formatNotificationDateTime = (
    value
) => {
    if (!value) {
        return "Hozirgina";
    }


    const date =
        new Date(
            value
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "Hozirgina";
    }


    const time =
        date.toLocaleTimeString(
            "uz-UZ",
            {
                hour: "2-digit",
                minute: "2-digit",
            }
        );


    const day =
        date.toLocaleDateString(
            "uz-UZ",
            {
                day: "2-digit",
                month: "2-digit",
                year: "numeric",
            }
        );


    return `${time} • ${day}`;
};


// =========================================================
// SHORT TIME
// =========================================================

export const formatNotificationShortTime = (
    value
) => {
    if (!value) {
        return "Hozirgina";
    }


    const date =
        new Date(
            value
        );


    if (
        Number.isNaN(
            date.getTime()
        )
    ) {
        return "Hozirgina";
    }


    const now =
        new Date();


    const difference =
        now.getTime() -
        date.getTime();


    const seconds =
        Math.floor(
            difference /
            1000
        );


    if (
        seconds <
        60
    ) {
        return "Hozirgina";
    }


    const minutes =
        Math.floor(
            seconds /
            60
        );


    if (
        minutes <
        60
    ) {
        return `${minutes} daqiqa oldin`;
    }


    const hours =
        Math.floor(
            minutes /
            60
        );


    if (
        hours <
        24
    ) {
        return `${hours} soat oldin`;
    }


    const days =
        Math.floor(
            hours /
            24
        );


    if (
        days === 1
    ) {
        return "Kecha";
    }


    if (
        days <
        7
    ) {
        return `${days} kun oldin`;
    }


    return formatNotificationDateTime(
        value
    );
};


// =========================================================
// SORT
// =========================================================

export const sortNotificationsByNewest = (
    notifications
) => {
    if (
        !Array.isArray(
            notifications
        )
    ) {
        return [];
    }


    return [
        ...notifications,
    ].sort(
        (
            a,
            b
        ) => {
            return (
                new Date(
                    b?.created_at ||
                    0
                ) -
                new Date(
                    a?.created_at ||
                    0
                )
            );
        }
    );
};


// =========================================================
// FILTER
// =========================================================

export const filterNotifications = (
    notifications,
    filter = "all"
) => {
    const sorted =
        sortNotificationsByNewest(
            notifications
        );


    if (
        filter === "unread"
    ) {
        return sorted.filter(
            (notification) =>
                !notification?.is_read
        );
    }


    if (
        filter === "read"
    ) {
        return sorted.filter(
            (notification) =>
                Boolean(
                    notification?.is_read
                )
        );
    }


    return sorted;
};


// =========================================================
// COUNTS
// =========================================================

export const getNotificationCounts = (
    notifications,
    totalUnreadCount
) => {
    const safeNotifications =
        Array.isArray(
            notifications
        )
            ? notifications
            : [];


    const localUnread =
        safeNotifications.filter(
            (item) =>
                !item?.is_read
        ).length;


    const unread =
        typeof totalUnreadCount ===
        "number"
            ? totalUnreadCount
            : localUnread;


    const total =
        safeNotifications.length;


    const read =
        Math.max(
            total - unread,
            0
        );


    return {
        total,
        unread,
        read,
    };
};


// =========================================================
// DEADLINE ICON HELPER
// =========================================================

export const NotificationDeadlineIcon =
    Clock3;