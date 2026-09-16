import React from "react";

import {
    motion,
} from "framer-motion";

import {
    Bug,
    CheckCircle2,
    Clock3,
    Coins,
    Image as ImageIcon,
    Lightbulb,
    MessageSquareText,
    Pencil,
    ShieldCheck,
    Sparkles,
    Trash2,
    XCircle,
} from "lucide-react";


// =========================================================
// TYPE CONFIG
// =========================================================

const TYPE_CONFIG = {
    bug: {
        label: "Bug",
        Icon: Bug,
        className:
            "border-red-400/20 bg-red-500/[0.07] text-red-300",
    },

    suggestion: {
        label: "Taklif",
        Icon: Lightbulb,
        className:
            "border-amber-400/20 bg-amber-500/[0.07] text-amber-300",
    },

    praise: {
        label: "Maqtov",
        Icon: Sparkles,
        className:
            "border-emerald-400/20 bg-emerald-500/[0.07] text-emerald-300",
    },

    other: {
        label: "Boshqa",
        Icon: MessageSquareText,
        className:
            "border-indigo-400/20 bg-indigo-500/[0.07] text-indigo-300",
    },
};


// =========================================================
// STATUS CONFIG
// =========================================================

const STATUS_CONFIG = {
    pending: {
        label: "Pending",
        Icon: Clock3,
        className:
            "border-amber-400/20 bg-amber-500/[0.07] text-amber-300",
    },

    approved: {
        label: "Approved",
        Icon: CheckCircle2,
        className:
            "border-emerald-400/20 bg-emerald-500/[0.07] text-emerald-300",
    },

    rejected: {
        label: "Rejected",
        Icon: XCircle,
        className:
            "border-red-400/20 bg-red-500/[0.07] text-red-300",
    },
};


// =========================================================
// FORMAT DATE
// =========================================================

const formatDate = (
    value
) => {
    if (!value) {
        return "—";
    }

    try {
        return new Intl.DateTimeFormat(
            "uz-UZ",
            {
                year: "numeric",
                month: "short",
                day: "2-digit",
                hour: "2-digit",
                minute: "2-digit",
            }
        ).format(
            new Date(value)
        );
    } catch {
        return value;
    }
};


// =========================================================
// TYPE BADGE
// =========================================================

const TypeBadge = ({
    type,
    display,
}) => {
    const config =
        TYPE_CONFIG[type]
        || {
            label:
                display
                || type
                || "Boshqa",

            Icon:
                MessageSquareText,

            className:
                "border-gray-400/15 bg-gray-500/[0.06] text-gray-400",
        };


    const Icon =
        config.Icon;


    return (
        <span
            className={`
                inline-flex
                items-center
                gap-1.5
                rounded-full
                border
                px-2.5
                py-1
                text-[10px]
                font-bold
                ${config.className}
            `}
        >
            <Icon
                size={11}
            />

            {config.label}
        </span>
    );
};


// =========================================================
// STATUS BADGE
// =========================================================

const StatusBadge = ({
    status,
    display,
}) => {
    const config =
        STATUS_CONFIG[status]
        || {
            label:
                display
                || status
                || "Unknown",

            Icon:
                MessageSquareText,

            className:
                "border-gray-400/15 bg-gray-500/[0.06] text-gray-400",
        };


    const Icon =
        config.Icon;


    return (
        <span
            className={`
                inline-flex
                items-center
                gap-1.5
                rounded-full
                border
                px-2.5
                py-1
                text-[10px]
                font-bold
                ${config.className}
            `}
        >
            <Icon
                size={11}
            />

            {config.label}
        </span>
    );
};


// =========================================================
// FEEDBACK CARD
// =========================================================

const FeedbackCard = ({
    feedback,
    showStatus = true,
    onEdit,
    onDelete,
}) => {

    // =====================================================
    // DATA
    // =====================================================

    const screenshot =
        feedback?.screenshot_url
        || feedback?.screenshot
        || null;


    const username =
        feedback
            ?.user
            ?.username
        || "user";


    const canModify =
        Boolean(
            feedback
                ?.can_user_modify
        );


    const showActions =
        canModify
        &&
        (
            Boolean(onEdit)
            ||
            Boolean(onDelete)
        );


    // =====================================================
    // JSX
    // =====================================================

    return (
        <motion.article
            initial={{
                opacity: 0,
                y: 10,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            whileHover={{
                y: -2,
            }}
            transition={{
                duration: 0.2,
            }}
            className="
                group
                relative
                overflow-hidden
                rounded-2xl
                border
                border-white/[0.06]
                bg-white/[0.022]
                transition-all
                duration-200
                hover:border-white/[0.10]
                hover:bg-white/[0.03]
                hover:shadow-2xl
                hover:shadow-black/10
            "
        >

            {/* =============================================
                GLOW
            ============================================== */}

            <div
                className="
                    pointer-events-none
                    absolute
                    -right-20
                    -top-20
                    h-40
                    w-40
                    rounded-full
                    bg-indigo-500/[0.04]
                    blur-[70px]
                    transition
                    group-hover:bg-indigo-500/[0.07]
                "
            />


            {/* =============================================
                CONTENT
            ============================================== */}

            <div
                className="
                    relative
                    z-10
                    p-5
                    sm:p-6
                "
            >

                {/* =========================================
                    HEADER
                ========================================== */}

                <div
                    className="
                        flex
                        flex-col
                        gap-3
                        sm:flex-row
                        sm:items-start
                        sm:justify-between
                    "
                >

                    <div
                        className="
                            min-w-0
                            flex-1
                        "
                    >

                        {/* BADGES */}

                        <div
                            className="
                                flex
                                flex-wrap
                                items-center
                                gap-2
                            "
                        >

                            <TypeBadge
                                type={
                                    feedback
                                        ?.feedback_type
                                }
                                display={
                                    feedback
                                        ?.feedback_type_display
                                }
                            />


                            {showStatus && (
                                <StatusBadge
                                    status={
                                        feedback
                                            ?.status
                                    }
                                    display={
                                        feedback
                                            ?.status_display
                                    }
                                />
                            )}


                            {feedback?.is_rewarded && (

                                <span
                                    className="
                                        inline-flex
                                        items-center
                                        gap-1.5
                                        rounded-full
                                        border
                                        border-amber-400/15
                                        bg-amber-500/[0.06]
                                        px-2.5
                                        py-1
                                        text-[10px]
                                        font-bold
                                        text-amber-300
                                    "
                                >

                                    <Coins
                                        size={11}
                                    />

                                    +
                                    {
                                        feedback
                                            ?.reward_amount
                                        || 0
                                    }
                                    {" "}
                                    FCoin

                                </span>

                            )}

                        </div>


                        {/* TITLE */}

                        <h3
                            className="
                                mt-3
                                break-words
                                text-base
                                font-black
                                tracking-tight
                                text-white
                                sm:text-lg
                            "
                        >
                            {
                                feedback
                                    ?.title
                                || "Feedback"
                            }
                        </h3>

                    </div>


                    {/* DATE */}

                    <time
                        className="
                            flex-shrink-0
                            text-[10px]
                            font-medium
                            text-gray-600
                        "
                    >
                        {
                            formatDate(
                                feedback
                                    ?.created_at
                            )
                        }
                    </time>

                </div>


                {/* =========================================
                    MESSAGE
                ========================================== */}

                <p
                    className="
                        mt-4
                        whitespace-pre-wrap
                        break-words
                        text-sm
                        leading-7
                        text-gray-400
                    "
                >
                    {
                        feedback
                            ?.message
                    }
                </p>


                {/* =========================================
                    SCREENSHOT
                ========================================== */}

                {screenshot && (

                    <a
                        href={
                            screenshot
                        }
                        target="_blank"
                        rel="noreferrer"
                        className="
                            group/image
                            mt-5
                            block
                            overflow-hidden
                            rounded-2xl
                            border
                            border-white/[0.06]
                            bg-black/20
                            transition
                            hover:border-indigo-400/20
                        "
                    >

                        <img
                            src={
                                screenshot
                            }
                            alt={
                                feedback
                                    ?.title
                                || "Feedback screenshot"
                            }
                            loading="lazy"
                            className="
                                max-h-[380px]
                                w-full
                                object-contain
                                transition
                                duration-300
                                group-hover/image:scale-[1.01]
                            "
                        />


                        <div
                            className="
                                flex
                                items-center
                                gap-2
                                border-t
                                border-white/[0.05]
                                px-4
                                py-2.5
                                text-[10px]
                                font-semibold
                                text-gray-600
                                transition
                                group-hover/image:text-indigo-300
                            "
                        >

                            <ImageIcon
                                size={13}
                            />

                            Skrinshotni to‘liq ko‘rish

                        </div>

                    </a>

                )}


                {/* =========================================
                    ADMIN COMMENT
                ========================================== */}

                {feedback?.admin_comment && (

                    <div
                        className="
                            mt-5
                            rounded-2xl
                            border
                            border-indigo-400/10
                            bg-indigo-500/[0.035]
                            p-4
                        "
                    >

                        <div
                            className="
                                flex
                                items-center
                                gap-2
                                text-[10px]
                                font-black
                                uppercase
                                tracking-[0.13em]
                                text-indigo-300
                            "
                        >

                            <ShieldCheck
                                size={14}
                            />

                            Admin javobi

                        </div>


                        <p
                            className="
                                mt-2
                                whitespace-pre-wrap
                                break-words
                                text-xs
                                leading-6
                                text-gray-400
                            "
                        >
                            {
                                feedback
                                    ?.admin_comment
                            }
                        </p>


                        {feedback
                            ?.reviewed_by
                            ?.username && (

                            <div
                                className="
                                    mt-3
                                    text-[9px]
                                    font-semibold
                                    text-gray-600
                                "
                            >
                                Ko‘rib chiqdi:
                                {" "}
                                @
                                {
                                    feedback
                                        .reviewed_by
                                        .username
                                }
                            </div>

                        )}

                    </div>

                )}


                {/* =========================================
                    FOOTER
                ========================================== */}

                <div
                    className="
                        mt-5
                        flex
                        flex-col
                        gap-3
                        border-t
                        border-white/[0.05]
                        pt-4
                        sm:flex-row
                        sm:items-center
                        sm:justify-between
                    "
                >

                    {/* USER */}

                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            text-[10px]
                            text-gray-600
                        "
                    >

                        <MessageSquareText
                            size={13}
                        />

                        <span>
                            @
                            {
                                username
                            }
                        </span>

                    </div>


                    {/* ACTIONS */}

                    {showActions && (

                        <div
                            className="
                                flex
                                flex-wrap
                                items-center
                                gap-2
                            "
                        >

                            {onEdit && (

                                <button
                                    type="button"
                                    onClick={() =>
                                        onEdit(
                                            feedback
                                        )
                                    }
                                    className="
                                        inline-flex
                                        items-center
                                        gap-1.5
                                        rounded-lg
                                        border
                                        border-indigo-400/15
                                        bg-indigo-500/[0.05]
                                        px-3
                                        py-2
                                        text-[10px]
                                        font-bold
                                        text-indigo-300
                                        transition
                                        hover:border-indigo-400/30
                                        hover:bg-indigo-500/[0.10]
                                    "
                                >

                                    <Pencil
                                        size={12}
                                    />

                                    Tahrirlash

                                </button>

                            )}


                            {onDelete && (

                                <button
                                    type="button"
                                    onClick={() =>
                                        onDelete(
                                            feedback
                                        )
                                    }
                                    className="
                                        inline-flex
                                        items-center
                                        gap-1.5
                                        rounded-lg
                                        border
                                        border-red-400/15
                                        bg-red-500/[0.05]
                                        px-3
                                        py-2
                                        text-[10px]
                                        font-bold
                                        text-red-300
                                        transition
                                        hover:border-red-400/30
                                        hover:bg-red-500/[0.10]
                                    "
                                >

                                    <Trash2
                                        size={12}
                                    />

                                    O‘chirish

                                </button>

                            )}

                        </div>

                    )}


                    {!showActions && canModify && (

                        <span
                            className="
                                rounded-full
                                border
                                border-cyan-400/10
                                bg-cyan-500/[0.04]
                                px-2.5
                                py-1
                                text-[9px]
                                font-bold
                                text-cyan-400
                            "
                        >
                            Tahrirlash mumkin
                        </span>

                    )}

                </div>

            </div>

        </motion.article>
    );
};


export default FeedbackCard;