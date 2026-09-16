import React from "react";

import {
    Link,
} from "react-router-dom";

import {
    motion,
} from "framer-motion";

import {
    Check,
    Clock3,
    Coins,
    UserRound,
} from "lucide-react";

import {
    timeUntilDeadline,
} from "../../utils/timeUntilDeadline";

import {
    formatNotificationDateTime,
    getNotificationCoins,
    getNotificationDeadline,
    getNotificationMeta,
    getNotificationText,
    getNotificationUrl,
    getSenderUsername,
} from "../../utils/notificationUtils";

import {
    getUserAvatarUrl,
    handleUserImageError,
} from "../../utils/imageUtils";


// =========================================================
// CARD ANIMATION
// =========================================================

const cardVariants = {
    hidden: {
        opacity: 0,
        y: 12,
        scale: 0.99,
    },

    visible: {
        opacity: 1,
        y: 0,
        scale: 1,

        transition: {
            duration: 0.25,
            ease: "easeOut",
        },
    },

    exit: {
        opacity: 0,
        y: -8,
        scale: 0.985,

        transition: {
            duration: 0.18,
        },
    },
};


// =========================================================
// NOTIFICATION CARD
// =========================================================

const NotificationCard = ({
    notification,
    currentUser,
    onMarkRead,
}) => {
    const isUnread =
        !notification?.is_read;


    const sender =
        notification?.sender ||
        {};


    const senderUsername =
        getSenderUsername(
            sender
        );


    const senderImage =
        getUserAvatarUrl(
            sender
        );


    const meta =
        getNotificationMeta(
            notification
        );


    const Icon =
        meta.Icon;


    const message =
        getNotificationText(
            notification
        );


    const url =
        getNotificationUrl(
            notification,
            currentUser?.username
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
    // MARK READ
    // =====================================================

    const handleMarkRead = (
        event
    ) => {
        event.preventDefault();
        event.stopPropagation();


        if (
            !notification?.id ||
            !isUnread
        ) {
            return;
        }


        onMarkRead?.(
            notification.id
        );
    };


    // =====================================================
    // OPEN
    // =====================================================

    const handleOpen =
        () => {
            if (
                notification?.id &&
                isUnread
            ) {
                onMarkRead?.(
                    notification.id
                );
            }
        };


    // =====================================================
    // JSX
    // =====================================================

    return (
        <motion.article
            layout

            variants={
                cardVariants
            }

            initial="hidden"

            animate="visible"

            exit="exit"

            className={`
                group
                relative
                overflow-hidden
                rounded-3xl
                border
                transition-all
                duration-300

                ${
                    isUnread
                        ? `
                            border-indigo-400/15
                            bg-indigo-500/[0.045]
                            shadow-[0_20px_60px_rgba(0,0,0,0.22)]
                        `
                        : `
                            border-white/[0.06]
                            bg-[#0d121a]/75
                        `
                }

                hover:border-indigo-400/20
                hover:bg-[#101620]
            `}
        >

            {/* =================================================
                LEFT INDICATOR
            ================================================== */}

            {isUnread && (

                <span
                    className="
                        absolute
                        bottom-5
                        left-0
                        top-5

                        w-[3px]

                        rounded-r-full

                        bg-indigo-400

                        shadow-[0_0_15px_rgba(129,140,248,0.65)]
                    "
                />

            )}


            {/* =================================================
                GLOW
            ================================================== */}

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
                    flex-col

                    gap-4

                    p-4

                    sm:flex-row
                    sm:items-start

                    sm:p-5
                "
            >

                {/* =================================================
                    AVATAR
                ================================================== */}

                <div
                    className="
                        relative

                        flex-shrink-0
                    "
                >

                    <img
                        src={
                            senderImage
                        }

                        alt={
                            senderUsername
                        }

                        onError={
                            handleUserImageError
                        }

                        className="
                            h-14
                            w-14

                            rounded-2xl

                            border
                            border-white/[0.08]

                            bg-[#161b22]

                            object-cover

                            shadow-lg
                            shadow-black/20
                        "
                    />


                    {/* TYPE ICON */}

                    <div
                        className={`
                            absolute

                            -bottom-1.5
                            -right-1.5

                            grid

                            h-8
                            w-8

                            place-items-center

                            rounded-xl

                            border

                            shadow-lg

                            backdrop-blur-xl

                            ${meta.iconBox}
                        `}
                    >

                        <Icon
                            size={14}
                            strokeWidth={2.2}
                        />

                    </div>

                </div>


                {/* =================================================
                    MAIN
                ================================================== */}

                <div
                    className="
                        min-w-0
                        flex-1
                    "
                >

                    <Link
                        to={
                            url
                        }

                        onClick={
                            handleOpen
                        }

                        className="
                            block
                        "
                    >

                        {/* =========================================
                            TOP
                        ========================================== */}

                        <div
                            className="
                                flex
                                items-start
                                justify-between
                                gap-4
                            "
                        >

                            <div
                                className="
                                    min-w-0
                                "
                            >

                                {/* BADGES */}

                                <div
                                    className="
                                        mb-2

                                        flex
                                        flex-wrap
                                        items-center
                                        gap-2
                                    "
                                >

                                    <span
                                        className={`
                                            rounded-full

                                            border

                                            px-2.5
                                            py-1

                                            font-mono

                                            text-[9px]
                                            font-bold
                                            uppercase
                                            tracking-[0.08em]

                                            ${meta.pill}
                                        `}
                                    >
                                        {
                                            meta.label
                                        }
                                    </span>


                                    {isUnread && (

                                        <span
                                            className="
                                                rounded-full

                                                border
                                                border-indigo-400/15

                                                bg-indigo-500/[0.08]

                                                px-2.5
                                                py-1

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
                                        text-[14px]
                                        font-semibold
                                        leading-6

                                        text-gray-300

                                        transition-colors

                                        group-hover:text-white

                                        sm:text-[15px]
                                    "
                                >
                                    {
                                        message
                                    }
                                </p>

                            </div>


                            {/* UNREAD DOT */}

                            {isUnread && (

                                <span
                                    className="
                                        mt-2

                                        h-2.5
                                        w-2.5

                                        flex-shrink-0

                                        rounded-full

                                        bg-indigo-400

                                        shadow-[0_0_12px_rgba(129,140,248,0.85)]
                                    "
                                />

                            )}

                        </div>


                        {/* =========================================
                            META
                        ========================================== */}

                        <div
                            className="
                                mt-3

                                flex
                                flex-wrap
                                items-center

                                gap-x-4
                                gap-y-2

                                text-[10px]
                                font-semibold

                                text-gray-600
                            "
                        >

                            {/* USER */}

                            <span
                                className="
                                    inline-flex
                                    items-center
                                    gap-1.5
                                "
                            >

                                <UserRound
                                    size={13}
                                    strokeWidth={2}
                                />

                                @
                                {
                                    senderUsername
                                }

                            </span>


                            {/* COINS */}

                            {coins !== null &&
                                coins !== undefined &&
                                Number(
                                    coins
                                ) > 0 && (

                                <span
                                    className="
                                        inline-flex
                                        items-center
                                        gap-1.5

                                        text-amber-300
                                    "
                                >

                                    <Coins
                                        size={13}
                                        strokeWidth={2}
                                    />

                                    {
                                        coins
                                    } FCoin

                                </span>

                            )}


                            {/* DEADLINE */}

                            {deadline && (

                                <span
                                    className="
                                        inline-flex
                                        items-center
                                        gap-1.5

                                        text-red-300
                                    "
                                >

                                    <Clock3
                                        size={13}
                                        strokeWidth={2}
                                    />

                                    {
                                        timeUntilDeadline(
                                            deadline
                                        )
                                    }

                                </span>

                            )}

                        </div>


                        {/* DATE */}

                        <p
                            className="
                                mt-3

                                font-mono

                                text-[9px]
                                font-medium

                                text-gray-700
                            "
                        >
                            {
                                formatNotificationDateTime(
                                    notification?.created_at
                                )
                            }
                        </p>

                    </Link>

                </div>


                {/* =================================================
                    MARK READ BUTTON
                ================================================== */}

                {isUnread && (

                    <button
                        type="button"

                        onClick={
                            handleMarkRead
                        }

                        title="O‘qildi deb belgilash"

                        className="
                            inline-flex
                            flex-shrink-0

                            items-center
                            justify-center
                            gap-1.5

                            self-start

                            rounded-xl

                            border
                            border-emerald-400/15

                            bg-emerald-500/[0.055]

                            px-3
                            py-2

                            text-[10px]
                            font-bold

                            text-emerald-300

                            transition-all
                            duration-200

                            hover:border-emerald-400/25
                            hover:bg-emerald-500/10
                            hover:text-emerald-200
                        "
                    >

                        <Check
                            size={14}
                            strokeWidth={2.3}
                        />

                        <span
                            className="
                                hidden
                                lg:inline
                            "
                        >
                            O‘qildi
                        </span>

                    </button>

                )}

            </div>

        </motion.article>
    );
};


export default NotificationCard;