// src/components/feedback/FeedbackCard.jsx

import React from "react";

import {
    motion,
} from "framer-motion";

import {
    Clock3,
    Coins,
    Image as ImageIcon,
    Loader2,
    MessageSquareText,
    Pencil,
    ShieldCheck,
    Trash2,
} from "lucide-react";

import formatPrettyDate from "../../utils/formatPrettyDate";
import timeAgo from "../../utils/timeAgo";

import {
    getFeedbackTypeConfig,
} from "./feedbackConfig";

import {
    canModifyFeedback,
    getFeedbackRewardAmount,
    getFeedbackScreenshot,
    getFeedbackStatusConfig,
    getFeedbackUsername,
    isFeedbackRewarded,
} from "./feedbackHelpers";

// =========================================================
// TYPE BADGE
// =========================================================

const TypeBadge = ({
    type,
}) => {
    const config =
        getFeedbackTypeConfig(
            type
        );

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
                font-display
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.08em]
                ${config.activeClass}
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
}) => {
    const config =
        getFeedbackStatusConfig(
            status
        );

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
                font-display
                text-[9px]
                font-semibold
                uppercase
                tracking-[0.08em]
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

    isUpdating = false,
    isDeleting = false,

    actionsDisabled = false,
}) => {
    // =====================================================
    // DATA
    // =====================================================

    const screenshot =
        getFeedbackScreenshot(
            feedback
        );

    const username =
        getFeedbackUsername(
            feedback
        );

    const rewarded =
        isFeedbackRewarded(
            feedback
        );

    const rewardAmount =
        getFeedbackRewardAmount(
            feedback
        );

    const editable =
        canModifyFeedback(
            feedback
        );

    const isBusy =
        isUpdating
        ||
        isDeleting
        ||
        actionsDisabled;

    const hasActions =
        editable
        &&
        (
            typeof onEdit ===
                "function"
            ||
            typeof onDelete ===
                "function"
        );

    // =====================================================
    // DATE
    // =====================================================

    const createdAt =
        feedback?.created_at
        ||
        null;

    const relativeDate =
        createdAt
            ? timeAgo(
                createdAt
            )
            : "";

    const fullDate =
        createdAt
            ? formatPrettyDate(
                createdAt
            )
            : "";

    // =====================================================
    // TITLE
    // =====================================================

    const title =
        String(
            feedback?.title
            ||
            "Feedback"
        );

    // =====================================================
    // EDIT
    // =====================================================

    const handleEdit = () => {
        if (
            !editable
            ||
            isBusy
            ||
            typeof onEdit !==
                "function"
        ) {
            return;
        }

        onEdit(
            feedback
        );
    };

    // =====================================================
    // DELETE REQUEST
    //
    // Confirmation bu component ichida emas.
    // Parent Feedback.jsx universal
    // DeleteConfirmationModal ochadi.
    // =====================================================

    const handleDelete = () => {
        if (
            !editable
            ||
            isBusy
            ||
            typeof onDelete !==
                "function"
        ) {
            return;
        }

        onDelete(
            feedback
        );
    };

    // =====================================================
    // JSX
    // =====================================================

    return (
        <motion.article
            layout
            initial={{
                opacity: 0,
                y: 10,
            }}
            animate={{
                opacity: 1,
                y: 0,
            }}
            exit={{
                opacity: 0,
                y: -8,
                scale: 0.98,
            }}
            whileHover={{
                y: -2,
            }}
            transition={{
                duration: 0.22,
            }}
            className="
                group
                relative
                overflow-hidden
                rounded-[24px]
                border
                border-white/[0.06]
                bg-white/[0.022]
                font-sans
                shadow-[0_15px_50px_rgba(0,0,0,0.18)]
                transition-colors
                duration-200
                hover:border-white/[0.11]
                hover:bg-white/[0.035]
            "
        >
            {/* =========================================
                BACKGROUND GLOW
            ========================================== */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    -right-20
                    -top-20
                    h-44
                    w-44
                    rounded-full
                    bg-indigo-500/[0.045]
                    blur-[70px]
                    opacity-0
                    transition-opacity
                    duration-300
                    group-hover:opacity-100
                "
            />

            {/* =========================================
                PROCESS BAR
            ========================================== */}

            {(isUpdating || isDeleting) && (
                <div
                    className="
                        absolute
                        inset-x-0
                        top-0
                        z-20
                        h-[2px]
                        overflow-hidden
                        bg-white/[0.03]
                    "
                >
                    <motion.div
                        initial={{
                            x: "-100%",
                        }}
                        animate={{
                            x: "350%",
                        }}
                        transition={{
                            duration: 1,
                            repeat: Infinity,
                            ease: "linear",
                        }}
                        className="
                            h-full
                            w-1/3
                            bg-gradient-to-r
                            from-transparent
                            via-indigo-400
                            to-transparent
                        "
                    />
                </div>
            )}

            {/* =========================================
                CONTENT
            ========================================== */}

            <div
                className="
                    relative
                    z-10
                    p-5
                    sm:p-6
                "
            >
                {/* =====================================
                    HEADER
                ====================================== */}

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
                        {/* =============================
                            BADGES
                        ============================== */}

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
                            />

                            {showStatus && (
                                <StatusBadge
                                    status={
                                        feedback
                                            ?.status
                                    }
                                />
                            )}

                            {rewarded
                                &&
                                rewardAmount > 0
                                && (
                                    <span
                                        className="
                                            inline-flex
                                            items-center
                                            gap-1
                                            rounded-full
                                            border
                                            border-amber-400/15
                                            bg-amber-500/[0.06]
                                            px-2.5
                                            py-1
                                            font-display
                                            text-[9px]
                                            font-semibold
                                            uppercase
                                            tracking-[0.08em]
                                            text-amber-300
                                        "
                                    >
                                        <Coins
                                            size={11}
                                        />

                                        +{rewardAmount} FCoin
                                    </span>
                                )}
                        </div>

                        {/* =============================
                            TITLE
                        ============================== */}

                        <h3
                            className="
                                mt-3
                                break-words
                                font-display
                                text-base
                                font-semibold
                                tracking-tight
                                text-white
                                sm:text-lg
                            "
                        >
                            {title}
                        </h3>
                    </div>

                    {/* =============================
                        DATE
                    ============================== */}

                    {createdAt && (
                        <div
                            className="
                                shrink-0
                                text-left
                                sm:text-right
                            "
                        >
                            <div
                                title={
                                    fullDate
                                }
                                className="
                                    inline-flex
                                    items-center
                                    gap-1.5
                                    text-[10px]
                                    font-medium
                                    text-gray-500
                                "
                            >
                                <Clock3
                                    size={12}
                                    className="
                                        text-indigo-400/70
                                    "
                                />

                                {relativeDate}
                            </div>

                            {fullDate && (
                                <p
                                    className="
                                        mt-1
                                        text-[9px]
                                        font-medium
                                        text-gray-700
                                    "
                                >
                                    {fullDate}
                                </p>
                            )}
                        </div>
                    )}
                </div>

                {/* =====================================
                    MESSAGE
                ====================================== */}

                {feedback?.message && (
                    <p
                        className="
                            mt-4
                            whitespace-pre-wrap
                            break-words
                            text-sm
                            font-medium
                            leading-7
                            text-gray-400
                        "
                    >
                        {feedback.message}
                    </p>
                )}

                {/* =====================================
                    SCREENSHOT
                ====================================== */}

                {screenshot && (
                    <a
                        href={
                            screenshot
                        }
                        target="_blank"
                        rel="noopener noreferrer"
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
                                title
                            }
                            loading="lazy"
                            className="
                                max-h-[380px]
                                w-full
                                object-contain
                                transition-transform
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
                                font-display
                                text-[9px]
                                font-medium
                                uppercase
                                tracking-[0.08em]
                                text-gray-600
                                transition-colors
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

                {/* =====================================
                    ADMIN COMMENT
                ====================================== */}

                {feedback?.admin_comment && (
                    <div
                        className="
                            relative
                            mt-5
                            overflow-hidden
                            rounded-2xl
                            border
                            border-indigo-400/10
                            bg-indigo-500/[0.035]
                            p-4
                        "
                    >
                        <div
                            aria-hidden="true"
                            className="
                                pointer-events-none
                                absolute
                                -right-8
                                -top-8
                                h-20
                                w-20
                                rounded-full
                                bg-indigo-500/[0.08]
                                blur-2xl
                            "
                        />

                        <div
                            className="
                                relative
                                z-10
                            "
                        >
                            <div
                                className="
                                    flex
                                    items-center
                                    gap-2
                                    font-display
                                    text-[9px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.12em]
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
                                    text-xs
                                    font-medium
                                    leading-6
                                    text-gray-400
                                "
                            >
                                {
                                    feedback
                                        .admin_comment
                                }
                            </p>
                        </div>
                    </div>
                )}

                {/* =====================================
                    FOOTER
                ====================================== */}

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
                    <div
                        className="
                            flex
                            items-center
                            gap-2
                            text-[10px]
                            font-medium
                            text-gray-600
                        "
                    >
                        <MessageSquareText
                            size={13}
                        />

                        <span>
                            @{username}
                        </span>
                    </div>

                    {hasActions && (
                        <div
                            className="
                                flex
                                flex-wrap
                                items-center
                                gap-2
                            "
                        >
                            {typeof onEdit ===
                                "function"
                                && (
                                    <button
                                        type="button"
                                        onClick={
                                            handleEdit
                                        }
                                        disabled={
                                            isBusy
                                        }
                                        className="
                                            inline-flex
                                            items-center
                                            justify-center
                                            gap-1.5
                                            rounded-xl
                                            border
                                            border-cyan-400/15
                                            bg-cyan-500/[0.05]
                                            px-3
                                            py-2
                                            font-display
                                            text-[9px]
                                            font-semibold
                                            uppercase
                                            tracking-[0.05em]
                                            text-cyan-300
                                            transition-all
                                            hover:border-cyan-400/25
                                            hover:bg-cyan-500/[0.10]
                                            disabled:cursor-not-allowed
                                            disabled:opacity-40
                                        "
                                    >
                                        {isUpdating ? (
                                            <Loader2
                                                size={13}
                                                className="
                                                    animate-spin
                                                "
                                            />
                                        ) : (
                                            <Pencil
                                                size={13}
                                            />
                                        )}

                                        Tahrirlash
                                    </button>
                                )}

                            {typeof onDelete ===
                                "function"
                                && (
                                    <button
                                        type="button"
                                        onClick={
                                            handleDelete
                                        }
                                        disabled={
                                            isBusy
                                        }
                                        className="
                                            inline-flex
                                            items-center
                                            justify-center
                                            gap-1.5
                                            rounded-xl
                                            border
                                            border-red-400/15
                                            bg-red-500/[0.04]
                                            px-3
                                            py-2
                                            font-display
                                            text-[9px]
                                            font-semibold
                                            uppercase
                                            tracking-[0.05em]
                                            text-red-300
                                            transition-all
                                            hover:border-red-400/25
                                            hover:bg-red-500/[0.09]
                                            disabled:cursor-not-allowed
                                            disabled:opacity-40
                                        "
                                    >
                                        {isDeleting ? (
                                            <Loader2
                                                size={13}
                                                className="
                                                    animate-spin
                                                "
                                            />
                                        ) : (
                                            <Trash2
                                                size={13}
                                            />
                                        )}

                                        O‘chirish
                                    </button>
                                )}
                        </div>
                    )}
                </div>
            </div>
        </motion.article>
    );
};

// =========================================================
// EXPORT
// =========================================================

export default React.memo(
    FeedbackCard
);