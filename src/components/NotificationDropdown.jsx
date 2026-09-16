import React from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    Link,
} from "react-router-dom";

import {
    AnimatePresence,
    motion,
} from "framer-motion";

import {
    ArrowRight,
    Bell,
    BellOff,
    CheckCheck,
    CheckCircle2,
    Coins,
    UserRound,
    Wifi,
    WifiOff,
} from "lucide-react";

import PlaceholderUserImage from "../assests/userImage.jpeg";

import {
    timeUntilDeadline,
} from "../utils/timeUntilDeadline";

import {
    markAllNotificationsAsRead,
    markNotificationAsRead,
} from "../middleware/notificationMiddleware";

import {
    formatNotificationDateTime,
    getAbsoluteImageUrl,
    getNotificationCoins,
    getNotificationDeadline,
    getNotificationMeta,
    getNotificationText,
    getNotificationUrl,
    getSenderUsername,
    sortNotificationsByNewest,
} from "../utils/notificationUtils";


// =========================================================
// ANIMATION
// =========================================================

const dropdownVariants = {
    hidden: {
        opacity: 0,
        y: -10,
        scale: 0.97,
        filter: "blur(5px)",
    },

    visible: {
        opacity: 1,
        y: 0,
        scale: 1,
        filter: "blur(0px)",

        transition: {
            duration: 0.2,
            ease: "easeOut",
        },
    },

    exit: {
        opacity: 0,
        y: -8,
        scale: 0.97,
        filter: "blur(5px)",

        transition: {
            duration: 0.15,
            ease: "easeIn",
        },
    },
};


// =========================================================
// NOTIFICATION ITEM
// =========================================================

const NotificationItem = ({
    notification,
    onMarkRead,
    onClose,
}) => {
    const isUnread =
        !notification?.is_read;


    const meta =
        getNotificationMeta(
            notification
        );


    const Icon =
        meta.Icon;


    const sender =
        notification?.sender ||
        {};


    const senderUsername =
        getSenderUsername(
            sender
        );


    const imageSrc =
        getAbsoluteImageUrl(
            sender?.image
        );


    const notificationUrl =
        getNotificationUrl(
            notification
        );


    const text =
        getNotificationText(
            notification
        );


    const coins =
        getNotificationCoins(
            notification
        );


    const deadline =
        getNotificationDeadline(
            notification
        );


    // =====================================================
    // CLICK
    // =====================================================

    const handleClick =
        () => {
            if (
                notification?.id &&
                isUnread
            ) {
                onMarkRead(
                    notification.id
                );
            }


            onClose?.();
        };


    // =====================================================
    // IMAGE ERROR
    // =====================================================

    const handleImageError = (
        event
    ) => {
        event.currentTarget.onerror =
            null;


        event.currentTarget.src =
            PlaceholderUserImage;
    };


    return (
        <Link
            to={notificationUrl}
            onClick={handleClick}
            className={`
                group
                relative
                block
                overflow-hidden
                border-b
                border-white/[0.05]
                transition-all
                duration-200
                last:border-b-0

                ${
                    isUnread
                        ? "bg-indigo-500/[0.055] hover:bg-indigo-500/[0.09]"
                        : "bg-transparent hover:bg-white/[0.025]"
                }
            `}
        >
            {/* GLOW */}

            <div
                className={`
                    pointer-events-none
                    absolute
                    inset-0
                    bg-gradient-to-r
                    ${meta.glow}
                    via-transparent
                    to-transparent
                    opacity-0
                    transition-opacity
                    duration-300
                    group-hover:opacity-100
                `}
            />


            <div
                className="
                    relative
                    z-10
                    flex
                    gap-3
                    px-4
                    py-4
                "
            >
                {/* AVATAR */}

                <div
                    className="
                        relative
                        flex-shrink-0
                    "
                >
                    <img
                        src={imageSrc}
                        alt={senderUsername}
                        onError={handleImageError}
                        className="
                            h-11
                            w-11
                            rounded-xl
                            border
                            border-white/[0.08]
                            bg-[#161b22]
                            object-cover
                        "
                    />


                    {/* TYPE ICON */}

                    <div
                        className={`
                            absolute
                            -bottom-1
                            -right-1
                            grid
                            h-7
                            w-7
                            place-items-center
                            rounded-lg
                            border
                            backdrop-blur-md
                            ${meta.iconBox}
                        `}
                    >
                        <Icon
                            size={13}
                            strokeWidth={2.2}
                        />
                    </div>
                </div>


                {/* CONTENT */}

                <div
                    className="
                        min-w-0
                        flex-1
                    "
                >
                    <div
                        className="
                            flex
                            items-start
                            justify-between
                            gap-3
                        "
                    >
                        <div className="min-w-0">
                            {/* TAGS */}

                            <div
                                className="
                                    mb-1.5
                                    flex
                                    flex-wrap
                                    items-center
                                    gap-1.5
                                "
                            >
                                <span
                                    className={`
                                        rounded-full
                                        border
                                        px-2
                                        py-0.5
                                        font-mono
                                        text-[9px]
                                        font-bold
                                        uppercase
                                        tracking-[0.08em]
                                        ${meta.pill}
                                    `}
                                >
                                    {meta.label}
                                </span>


                                {isUnread && (
                                    <span
                                        className="
                                            rounded-full
                                            border
                                            border-indigo-400/15
                                            bg-indigo-500/[0.08]
                                            px-2
                                            py-0.5
                                            font-mono
                                            text-[9px]
                                            font-bold
                                            uppercase
                                            tracking-[0.08em]
                                            text-indigo-300
                                        "
                                    >
                                        Yangi
                                    </span>
                                )}
                            </div>


                            {/* MESSAGE */}

                            <p
                                className="
                                    line-clamp-2
                                    text-[13px]
                                    font-semibold
                                    leading-5
                                    text-gray-300
                                    transition-colors
                                    group-hover:text-white
                                "
                            >
                                {text}
                            </p>
                        </div>


                        {/* UNREAD DOT */}

                        {isUnread && (
                            <span
                                className="
                                    mt-1.5
                                    h-2
                                    w-2
                                    flex-shrink-0
                                    rounded-full
                                    bg-indigo-400
                                    shadow-[0_0_10px_rgba(129,140,248,0.8)]
                                "
                            />
                        )}
                    </div>


                    {/* META */}

                    <div
                        className="
                            mt-2
                            flex
                            flex-wrap
                            items-center
                            gap-x-3
                            gap-y-1
                            text-[10px]
                            font-semibold
                            text-gray-600
                        "
                    >
                        <span
                            className="
                                inline-flex
                                items-center
                                gap-1
                            "
                        >
                            <UserRound
                                size={12}
                                strokeWidth={2}
                            />

                            @{senderUsername}
                        </span>


                        {coins !== undefined &&
                            coins !== null &&
                            Number(coins) > 0 && (
                                <span
                                    className="
                                        inline-flex
                                        items-center
                                        gap-1
                                        text-amber-300
                                    "
                                >
                                    <Coins
                                        size={12}
                                        strokeWidth={2}
                                    />

                                    {coins} FCoin
                                </span>
                            )}


                        {deadline && (
                            <span
                                className="
                                    inline-flex
                                    items-center
                                    gap-1
                                    text-red-300
                                "
                            >
                                <span
                                    className="
                                        h-1.5
                                        w-1.5
                                        rounded-full
                                        bg-red-400
                                    "
                                />

                                {timeUntilDeadline(
                                    deadline
                                )}
                            </span>
                        )}
                    </div>


                    {/* TIME */}

                    <div
                        className="
                            mt-2
                            text-right
                            font-mono
                            text-[9px]
                            font-medium
                            text-gray-700
                        "
                    >
                        {formatNotificationDateTime(
                            notification?.created_at
                        )}
                    </div>
                </div>
            </div>
        </Link>
    );
};


// =========================================================
// EMPTY STATE
// =========================================================

const EmptyState = ({
    type,
}) => {
    const isReadState =
        type === "read";


    const EmptyIcon =
        isReadState
            ? CheckCircle2
            : BellOff;


    return (
        <div
            className="
                px-5
                py-12
                text-center
            "
        >
            <div
                className={`
                    mx-auto
                    mb-4
                    grid
                    h-16
                    w-16
                    place-items-center
                    rounded-2xl
                    border

                    ${
                        isReadState
                            ? "border-emerald-400/15 bg-emerald-500/[0.06] text-emerald-400"
                            : "border-white/[0.06] bg-white/[0.025] text-gray-700"
                    }
                `}
            >
                <EmptyIcon
                    size={28}
                    strokeWidth={1.8}
                />
            </div>


            <h4
                className="
                    text-[14px]
                    font-bold
                    text-white
                "
            >
                {isReadState
                    ? "Barcha bildirishnomalar o‘qilgan"
                    : "Hali bildirishnomalar mavjud emas"}
            </h4>


            <p
                className="
                    mx-auto
                    mt-2
                    max-w-xs
                    text-[11px]
                    font-medium
                    leading-5
                    text-gray-600
                "
            >
                {isReadState
                    ? "Yangi xabarlar kelganda bu yerda yana ko‘rinadi."
                    : "Problem, post, FCoin yoki badge bo‘yicha xabarlar shu yerda chiqadi."}
            </p>
        </div>
    );
};


// =========================================================
// LOADING STATE
// =========================================================

const NotificationSkeleton = () => {
    return (
        <div
            className="
                space-y-2
                p-3
            "
        >
            {[1, 2, 3].map(
                (item) => (
                    <div
                        key={item}
                        className="
                            flex
                            animate-pulse
                            gap-3
                            rounded-2xl
                            border
                            border-white/[0.05]
                            bg-white/[0.02]
                            p-3
                        "
                    >
                        <div
                            className="
                                h-11
                                w-11
                                flex-shrink-0
                                rounded-xl
                                bg-white/[0.05]
                            "
                        />


                        <div
                            className="
                                flex-1
                                space-y-2
                                pt-1
                            "
                        >
                            <div
                                className="
                                    h-2.5
                                    w-20
                                    rounded-full
                                    bg-white/[0.05]
                                "
                            />

                            <div
                                className="
                                    h-3.5
                                    w-full
                                    rounded-full
                                    bg-white/[0.06]
                                "
                            />

                            <div
                                className="
                                    h-2.5
                                    w-2/3
                                    rounded-full
                                    bg-white/[0.04]
                                "
                            />
                        </div>
                    </div>
                )
            )}
        </div>
    );
};


// =========================================================
// NOTIFICATION DROPDOWN
// =========================================================

const NotificationDropdown = ({
    openNotifications,
    setOpenNotifications,
    notificationsRef,
}) => {
    const dispatch =
        useDispatch();


    const {
        notifications = [],
        totalUnreadCount = 0,
        wsConnected = false,
        wsError = null,
        loading = false,
    } = useSelector(
        (state) =>
            state.notifications ||
            {}
    );


    // =====================================================
    // DATA
    // =====================================================

    const safeNotifications =
        Array.isArray(
            notifications
        )
            ? notifications
            : [];


    const sortedNotifications =
        sortNotificationsByNewest(
            safeNotifications
        );


    const unreadNotifications =
        sortedNotifications.filter(
            (item) =>
                !item?.is_read
        );


    const unreadCount =
        typeof totalUnreadCount === "number"
            ? totalUnreadCount
            : unreadNotifications.length;


    // Unread notificationlar ustun.
    // Unread qolmasa oxirgi notificationlarni ko'rsatamiz.

    const dropdownItems =
        unreadNotifications.length > 0
            ? unreadNotifications.slice(
                0,
                8
            )
            : sortedNotifications.slice(
                0,
                8
            );


    // =====================================================
    // ACTIONS
    // =====================================================

    const handleMarkOneAsRead = (
        notificationId
    ) => {
        dispatch(
            markNotificationAsRead(
                notificationId
            )
        );
    };


    const handleMarkAllAsRead =
        () => {
            dispatch(
                markAllNotificationsAsRead()
            );
        };


    const closeDropdown =
        () => {
            setOpenNotifications(
                false
            );
        };


    const toggleDropdown =
        () => {
            setOpenNotifications(
                (previous) =>
                    !previous
            );
        };


    return (
        <div
            ref={notificationsRef}
            className="relative"
        >
            {/* BELL BUTTON */}

            <button
                type="button"
                onClick={toggleDropdown}
                aria-label="Bildirishnomalar"
                aria-expanded={openNotifications}
                className={`
                    group
                    relative
                    grid
                    h-10
                    w-10
                    place-items-center
                    rounded-xl
                    border
                    outline-none
                    transition-all
                    duration-200

                    ${
                        openNotifications
                            ? "border-indigo-400/25 bg-indigo-500/10 text-indigo-300"
                            : "border-white/[0.07] bg-white/[0.035] text-gray-400 hover:border-indigo-400/25 hover:bg-indigo-500/[0.06] hover:text-indigo-300"
                    }
                `}
            >
                <span
                    className="
                        pointer-events-none
                        absolute
                        inset-0
                        rounded-xl
                        bg-indigo-500/10
                        opacity-0
                        blur-xl
                        transition-opacity
                        group-hover:opacity-100
                    "
                />


                <Bell
                    size={18}
                    strokeWidth={2}
                    className="
                        relative
                        z-10
                    "
                />


                {unreadCount > 0 && (
                    <span
                        className="
                            absolute
                            -right-2
                            -top-2
                            z-20
                            flex
                            min-h-5
                            min-w-5
                            items-center
                            justify-center
                            rounded-full
                            border-2
                            border-[#080c12]
                            bg-red-500
                            px-1
                            font-mono
                            text-[8px]
                            font-bold
                            leading-none
                            text-white
                            shadow-[0_0_12px_rgba(239,68,68,0.35)]
                        "
                    >
                        {unreadCount > 99
                            ? "99+"
                            : unreadCount}
                    </span>
                )}


                {wsConnected && (
                    <span
                        className="
                            absolute
                            bottom-[3px]
                            right-[3px]
                            h-2
                            w-2
                            rounded-full
                            border
                            border-[#080c12]
                            bg-emerald-400
                            shadow-[0_0_8px_rgba(52,211,153,0.8)]
                        "
                    />
                )}
            </button>


            {/* DROPDOWN */}

            <AnimatePresence>
                {openNotifications && (
                    <motion.div
                        variants={dropdownVariants}
                        initial="hidden"
                        animate="visible"
                        exit="exit"
                        className="
                            absolute
                            right-0
                            z-[70]
                            mt-3
                            w-[calc(100vw-2rem)]
                            max-w-[430px]
                            origin-top-right
                            overflow-hidden
                            rounded-2xl
                            border
                            border-white/[0.07]
                            bg-[#0d121a]/[0.98]
                            shadow-[0_30px_90px_rgba(0,0,0,0.60)]
                            backdrop-blur-2xl
                        "
                    >
                        {/* HEADER */}

                        <div
                            className="
                                relative
                                overflow-hidden
                                border-b
                                border-white/[0.06]
                                bg-white/[0.02]
                                px-4
                                py-4
                            "
                        >
                            <div
                                className="
                                    pointer-events-none
                                    absolute
                                    -right-14
                                    -top-14
                                    h-32
                                    w-32
                                    rounded-full
                                    bg-indigo-500/10
                                    blur-3xl
                                "
                            />


                            <div
                                className="
                                    relative
                                    z-10
                                    flex
                                    items-start
                                    justify-between
                                    gap-3
                                "
                            >
                                <div className="min-w-0">
                                    <div
                                        className="
                                            flex
                                            items-center
                                            gap-2
                                        "
                                    >
                                        <Bell
                                            size={17}
                                            className="text-indigo-400"
                                        />


                                        <h3
                                            className="
                                                text-[15px]
                                                font-bold
                                                text-white
                                            "
                                        >
                                            Bildirishnomalar
                                        </h3>


                                        {unreadCount > 0 && (
                                            <span
                                                className="
                                                    rounded-full
                                                    border
                                                    border-indigo-400/15
                                                    bg-indigo-500/[0.07]
                                                    px-2
                                                    py-0.5
                                                    font-mono
                                                    text-[9px]
                                                    font-bold
                                                    text-indigo-300
                                                "
                                            >
                                                {unreadCount}
                                            </span>
                                        )}
                                    </div>


                                    {/* CONNECTION */}

                                    <div
                                        className="
                                            mt-2
                                            flex
                                            items-center
                                            gap-1.5
                                        "
                                    >
                                        {wsConnected ? (
                                            <Wifi
                                                size={12}
                                                className="text-emerald-400"
                                            />
                                        ) : (
                                            <WifiOff
                                                size={12}
                                                className="text-gray-600"
                                            />
                                        )}


                                        <p
                                            className={`
                                                font-mono
                                                text-[9px]
                                                font-semibold
                                                uppercase
                                                tracking-[0.08em]

                                                ${
                                                    wsConnected
                                                        ? "text-emerald-400/70"
                                                        : "text-gray-600"
                                                }
                                            `}
                                        >
                                            {wsConnected
                                                ? "Real-time online"
                                                : "Connecting..."}
                                        </p>
                                    </div>


                                    {wsError && (
                                        <p
                                            className="
                                                mt-1.5
                                                max-w-[240px]
                                                truncate
                                                text-[10px]
                                                font-medium
                                                text-red-300
                                            "
                                            title={String(
                                                wsError
                                            )}
                                        >
                                            {String(
                                                wsError
                                            )}
                                        </p>
                                    )}
                                </div>


                                {/* MARK ALL */}

                                {unreadCount > 0 && (
                                    <button
                                        type="button"
                                        onClick={handleMarkAllAsRead}
                                        className="
                                            flex
                                            flex-shrink-0
                                            items-center
                                            gap-1.5
                                            rounded-xl
                                            border
                                            border-indigo-400/15
                                            bg-indigo-500/[0.06]
                                            px-2.5
                                            py-2
                                            text-[10px]
                                            font-bold
                                            text-indigo-300
                                            transition-all
                                            hover:border-indigo-400/25
                                            hover:bg-indigo-500/10
                                            hover:text-indigo-200
                                        "
                                    >
                                        <CheckCheck
                                            size={14}
                                            strokeWidth={2}
                                        />

                                        <span
                                            className="
                                                hidden
                                                sm:inline
                                            "
                                        >
                                            O‘qildi
                                        </span>
                                    </button>
                                )}
                            </div>
                        </div>


                        {/* BODY */}

                        <div
                            className="
                                max-h-[410px]
                                overflow-y-auto
                            "
                        >
                            {loading ? (
                                <NotificationSkeleton />
                            ) : safeNotifications.length === 0 ? (
                                <EmptyState />
                            ) : dropdownItems.length > 0 ? (
                                dropdownItems.map(
                                    (notification) => (
                                        <NotificationItem
                                            key={notification.id}
                                            notification={notification}
                                            onMarkRead={handleMarkOneAsRead}
                                            onClose={closeDropdown}
                                        />
                                    )
                                )
                            ) : (
                                <EmptyState
                                    type="read"
                                />
                            )}
                        </div>


                        {/* FOOTER */}

                        {safeNotifications.length > 0 && (
                            <div
                                className="
                                    border-t
                                    border-white/[0.06]
                                    bg-black/10
                                    p-3
                                "
                            >
                                <Link
                                    to="/notifications"
                                    onClick={closeDropdown}
                                    className="
                                        group
                                        flex
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        border
                                        border-white/[0.06]
                                        bg-white/[0.025]
                                        px-4
                                        py-3
                                        text-[11px]
                                        font-bold
                                        text-gray-400
                                        transition-all
                                        hover:border-indigo-400/20
                                        hover:bg-indigo-500/[0.06]
                                        hover:text-indigo-300
                                    "
                                >
                                    Barcha bildirishnomalar


                                    <ArrowRight
                                        size={14}
                                        className="
                                            transition-transform
                                            duration-200
                                            group-hover:translate-x-1
                                        "
                                    />
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
