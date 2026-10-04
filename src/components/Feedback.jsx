// src/components/Feedback.jsx

import React, {
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    AnimatePresence,
    motion,
} from "framer-motion";

import {
    AlertCircle,
    Bug,
    CheckCircle2,
    Clock3,
    Coins,
    Gift,
    MessageSquareText,
    Plus,
    RefreshCcw,
    ShieldCheck,
    Sparkles,
    Wrench,
    XCircle,
} from "lucide-react";

import DeleteConfirmationModal from "./DeleteConfirmationModal";

import FeedbackCard from "./feedback/FeedbackCard";
import FeedbackCreateModal from "./feedback/FeedbackCreateModal";
import FeedbackEditModal from "./feedback/FeedbackEditModal";
import FeedbackPagination from "./feedback/FeedbackPagination";

import FeedbackSkeleton, {
    FeedbackListSkeleton,
} from "./feedback/FeedbackSkeleton";

import useFeedbackPage from "./feedback/useFeedbackPage";

import {
    getFeedbackStatusFilterLabel,
} from "./feedback/feedbackHelpers";


// =========================================================
// STAT CARD
// =========================================================

const StatCard = ({
    title,
    value,
    Icon,
    description,
    isLoading = false,
}) => {
    return (
        <motion.div
            whileHover={
                isLoading
                    ? undefined
                    : {
                        y: -3,
                    }
            }
            transition={{
                duration: 0.2,
            }}
            className="
                relative
                overflow-hidden
                rounded-2xl
                border
                border-white/[0.06]
                bg-white/[0.025]
                p-5
                transition-colors
                hover:border-indigo-400/15
                hover:bg-white/[0.035]
            "
        >
            {/* BACKGROUND GLOW */}

            <div
                aria-hidden="true"
                className="
                    pointer-events-none
                    absolute
                    -right-10
                    -top-10
                    h-28
                    w-28
                    rounded-full
                    bg-indigo-500/[0.07]
                    blur-3xl
                "
            />

            <div
                className="
                    relative
                    flex
                    items-start
                    justify-between
                    gap-4
                "
            >
                <div
                    className="
                        min-w-0
                        flex-1
                    "
                >
                    {isLoading ? (
                        <>
                            <div
                                className="
                                    h-2.5
                                    w-16
                                    animate-pulse
                                    rounded-full
                                    bg-white/[0.055]
                                "
                            />

                            <div
                                className="
                                    mt-3
                                    h-8
                                    w-14
                                    animate-pulse
                                    rounded-lg
                                    bg-white/[0.055]
                                "
                            />

                            <div
                                className="
                                    mt-2
                                    h-2.5
                                    w-24
                                    animate-pulse
                                    rounded-full
                                    bg-white/[0.055]
                                "
                            />
                        </>
                    ) : (
                        <>
                            <p
                                className="
                                    font-display
                                    text-[9px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.14em]
                                    text-gray-600
                                "
                            >
                                {title}
                            </p>

                            <h3
                                className="
                                    mt-2
                                    font-display
                                    text-2xl
                                    font-bold
                                    tracking-tight
                                    text-white
                                "
                            >
                                {value}
                            </h3>

                            <p
                                className="
                                    mt-1
                                    text-[10px]
                                    font-medium
                                    leading-5
                                    text-gray-600
                                "
                            >
                                {description}
                            </p>
                        </>
                    )}
                </div>

                {isLoading ? (
                    <div
                        className="
                            h-10
                            w-10
                            shrink-0
                            animate-pulse
                            rounded-xl
                            bg-white/[0.055]
                        "
                    />
                ) : (
                    <div
                        className="
                            grid
                            h-10
                            w-10
                            shrink-0
                            place-items-center
                            rounded-xl
                            border
                            border-indigo-400/10
                            bg-indigo-500/[0.06]
                            text-indigo-300
                        "
                    >
                        <Icon
                            size={18}
                        />
                    </div>
                )}
            </div>
        </motion.div>
    );
};


// =========================================================
// EMPTY STATE
// =========================================================

const EmptyState = ({
    title,
    description,
}) => {
    return (
        <div
            className="
                rounded-3xl
                border
                border-dashed
                border-white/[0.08]
                bg-white/[0.015]
                px-6
                py-16
                text-center
            "
        >
            <div
                className="
                    mx-auto
                    grid
                    h-14
                    w-14
                    place-items-center
                    rounded-2xl
                    border
                    border-white/[0.06]
                    bg-white/[0.025]
                    text-gray-600
                "
            >
                <MessageSquareText
                    size={24}
                />
            </div>

            <h3
                className="
                    mt-4
                    font-display
                    text-sm
                    font-semibold
                    text-gray-300
                "
            >
                {title}
            </h3>

            <p
                className="
                    mx-auto
                    mt-2
                    max-w-md
                    text-xs
                    font-medium
                    leading-6
                    text-gray-600
                "
            >
                {description}
            </p>
        </div>
    );
};


// =========================================================
// FEEDBACK PAGE
// =========================================================

const Feedback = () => {
    const {
        // Auth
        isLoggedIn,

        // Public
        publicFeedbacks,
        publicCount,
        publicPagination,
        isPublicLoading,
        handlePublicPageChange,

        // My
        myFeedbacks,
        myPagination,
        isMyLoading,
        handleMyPageChange,

        // Stats
        stats,

        // Filter
        activeStatus,
        statusFilters,
        setActiveStatus,

        // Create
        isCreateModalOpen,
        handleOpenCreate,
        handleCloseCreate,
        handleCreated,

        // Edit
        editingFeedback,
        isEditModalOpen,
        isUpdating,
        updatingId,
        handleOpenEdit,
        handleCloseEdit,
        handleUpdateFeedback,

        // Delete
        isDeleting,
        deletingId,
        handleDeleteFeedback,

        // Request
        isRefreshing,
        isInitialLoading,
        isMyInitialLoading,
        isStatsInitialLoading,
        error,
        handleRefresh,
    } = useFeedbackPage();

    // =====================================================
    // DELETE TARGET
    // =====================================================

    const [
        deleteTarget,
        setDeleteTarget,
    ] = useState(
        null
    );

    const isDeleteModalOpen =
        Boolean(
            deleteTarget
        );

    // =====================================================
    // LOGOUT SAFETY
    // =====================================================

    useEffect(
        () => {
            if (
                !isLoggedIn
            ) {
                setDeleteTarget(
                    null
                );
            }
        },
        [
            isLoggedIn,
        ]
    );

    // =====================================================
    // DELETE TITLE
    // =====================================================

    const deleteTargetTitle =
        useMemo(
            () => {
                const title =
                    String(
                        deleteTarget?.title
                        ||
                        ""
                    ).trim();

                return (
                    title
                    ||
                    "Feedback"
                );
            },
            [
                deleteTarget,
            ]
        );

    // =====================================================
    // OPEN DELETE MODAL
    // =====================================================

    const handleOpenDeleteModal = (
        feedback
    ) => {
        if (
            !feedback
            ||
            isDeleting
            ||
            isUpdating
        ) {
            return;
        }

        setDeleteTarget(
            feedback
        );
    };

    // =====================================================
    // CLOSE DELETE MODAL
    // =====================================================

    const handleCloseDeleteModal =
        () => {
            if (
                isDeleting
            ) {
                return;
            }

            setDeleteTarget(
                null
            );
        };

    // =====================================================
    // CONFIRM DELETE
    // =====================================================

    const handleConfirmDelete =
        async () => {
            if (
                !deleteTarget
                ||
                isDeleting
                ||
                isUpdating
            ) {
                return;
            }

            const success =
                await handleDeleteFeedback(
                    deleteTarget
                );

            if (
                success
            ) {
                setDeleteTarget(
                    null
                );
            }
        };

    // =====================================================
    // STATS
    // =====================================================

    const statCards =
        useMemo(
            () => [
                {
                    title:
                        "Jami",

                    value:
                        stats?.total
                        ??
                        0,

                    Icon:
                        MessageSquareText,

                    description:
                        "Yuborgan feedbacklaringiz",
                },

                {
                    title:
                        "Kutilmoqda",

                    value:
                        stats?.pending
                        ??
                        0,

                    Icon:
                        Clock3,

                    description:
                        "Admin ko‘rib chiqishini kutmoqda",
                },

                {
                    title:
                        "Ishlanmoqda",

                    value:
                        stats?.in_progress
                        ??
                        0,

                    Icon:
                        Wrench,

                    description:
                        "Admin ishlashga olgan",
                },

                {
                    title:
                        "Tasdiqlangan",

                    value:
                        stats?.approved
                        ??
                        0,

                    Icon:
                        CheckCircle2,

                    description:
                        "Tasdiqlangan feedbacklar",
                },

                {
                    title:
                        "Rad etilgan",

                    value:
                        stats?.rejected
                        ??
                        0,

                    Icon:
                        XCircle,

                    description:
                        "Rad etilgan feedbacklar",
                },

                {
                    title:
                        "Earned FCoin",

                    value:
                        stats?.earned_fcoin
                        ??
                        0,

                    Icon:
                        Coins,

                    description:
                        "Feedback orqali topilgan",
                },

                {
                    title:
                        "Approved Bugs",

                    value:
                        stats?.approved_bugs
                        ??
                        0,

                    Icon:
                        Bug,

                    description:
                        "Tasdiqlangan bug reportlar",
                },
            ],
            [
                stats,
            ]
        );

    // =====================================================
    // ACTIVE STATUS LABEL
    // =====================================================

    const activeStatusLabel =
        useMemo(
            () => {
                return getFeedbackStatusFilterLabel(
                    activeStatus
                );
            },
            [
                activeStatus,
            ]
        );

    // =====================================================
    // INITIAL SKELETON
    // =====================================================

    if (
        isInitialLoading
    ) {
        return (
            <FeedbackSkeleton
                showPrivate={
                    isLoggedIn
                }
            />
        );
    }

    // =====================================================
    // PAGE
    // =====================================================

    return (
        <>
            <main
                aria-busy={
                    isRefreshing
                }
                className="
                    relative
                    min-h-screen
                    overflow-hidden
                    bg-[#06080d]
                    pb-24
                    font-sans
                "
            >
                {/* =========================================
                    BACKGROUND
                ========================================== */}

                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none
                        absolute
                        left-1/2
                        top-0
                        h-[500px]
                        w-[700px]
                        -translate-x-1/2
                        rounded-full
                        bg-indigo-600/[0.08]
                        blur-[140px]
                    "
                />

                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none
                        absolute
                        -right-40
                        top-[500px]
                        h-[400px]
                        w-[400px]
                        rounded-full
                        bg-cyan-500/[0.05]
                        blur-[130px]
                    "
                />

                <div
                    aria-hidden="true"
                    className="
                        pointer-events-none
                        absolute
                        inset-0
                        opacity-[0.014]
                        [background-image:linear-gradient(rgba(255,255,255,0.8)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.8)_1px,transparent_1px)]
                        [background-size:56px_56px]
                    "
                />

                {/* =========================================
                    CONTENT
                ========================================== */}

                <div
                    className="
                        relative
                        z-10
                        mx-auto
                        w-full
                        max-w-7xl
                        px-4
                        py-10
                        sm:px-6
                        lg:px-8
                    "
                >
                    {/* =====================================
                        HERO
                    ====================================== */}

                    <section
                        className="
                            relative
                            overflow-hidden
                            rounded-[32px]
                            border
                            border-white/[0.06]
                            bg-white/[0.02]
                            px-6
                            py-8
                            sm:px-8
                            sm:py-10
                        "
                    >
                        <div
                            aria-hidden="true"
                            className="
                                pointer-events-none
                                absolute
                                -right-20
                                -top-20
                                h-60
                                w-60
                                rounded-full
                                bg-indigo-500/[0.06]
                                blur-[90px]
                            "
                        />

                        <div
                            className="
                                relative
                                z-10
                                flex
                                flex-col
                                gap-8
                                lg:flex-row
                                lg:items-center
                                lg:justify-between
                            "
                        >
                            <div
                                className="
                                    max-w-3xl
                                "
                            >
                                <div
                                    className="
                                        inline-flex
                                        items-center
                                        gap-2
                                        rounded-full
                                        border
                                        border-indigo-400/15
                                        bg-indigo-500/[0.05]
                                        px-3
                                        py-1.5
                                        font-display
                                        text-[9px]
                                        font-semibold
                                        uppercase
                                        tracking-[0.14em]
                                        text-indigo-300
                                    "
                                >
                                    <Sparkles
                                        size={12}
                                    />

                                    Community Feedback
                                </div>

                                <h1
                                    className="
                                        mt-5
                                        font-display
                                        text-3xl
                                        font-bold
                                        tracking-[-0.03em]
                                        text-white
                                        sm:text-4xl
                                        lg:text-5xl
                                    "
                                >
                                    F.Society’ni{" "}

                                    <span
                                        className="
                                            bg-gradient-to-r
                                            from-indigo-400
                                            via-cyan-300
                                            to-indigo-400
                                            bg-clip-text
                                            text-transparent
                                        "
                                    >
                                        birga yaxshilaymiz.
                                    </span>
                                </h1>

                                <p
                                    className="
                                        mt-4
                                        max-w-2xl
                                        text-sm
                                        font-medium
                                        leading-7
                                        text-gray-500
                                    "
                                >
                                    Bug topdingizmi, yangi feature
                                    g‘oyangiz bormi yoki platforma
                                    haqida fikringizni aytmoqchimisiz?
                                    Feedback yuboring. Admin uni
                                    ko‘rib chiqadi, ishlashga oladi
                                    va foydali feedbacklar uchun
                                    FCoin mukofoti berilishi mumkin.
                                </p>
                            </div>

                            {/* BUTTONS */}

                            <div
                                className="
                                    flex
                                    flex-wrap
                                    gap-3
                                "
                            >
                                <button
                                    type="button"
                                    onClick={
                                        handleRefresh
                                    }
                                    disabled={
                                        isRefreshing
                                    }
                                    className="
                                        inline-flex
                                        min-w-[120px]
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        border
                                        border-white/[0.07]
                                        bg-white/[0.025]
                                        px-4
                                        py-3
                                        font-display
                                        text-xs
                                        font-semibold
                                        text-gray-400
                                        transition-all
                                        hover:-translate-y-0.5
                                        hover:bg-white/[0.06]
                                        hover:text-white
                                        active:translate-y-0
                                        disabled:cursor-wait
                                        disabled:opacity-60
                                    "
                                >
                                    <RefreshCcw
                                        size={16}
                                    />

                                    {isRefreshing
                                        ? "Yangilanmoqda..."
                                        : "Yangilash"}
                                </button>

                                <button
                                    type="button"
                                    onClick={
                                        handleOpenCreate
                                    }
                                    className="
                                        inline-flex
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        border
                                        border-indigo-400/20
                                        bg-indigo-600
                                        px-5
                                        py-3
                                        font-display
                                        text-xs
                                        font-semibold
                                        text-white
                                        shadow-lg
                                        shadow-indigo-950/30
                                        transition-all
                                        hover:-translate-y-0.5
                                        hover:bg-indigo-500
                                        active:translate-y-0
                                        active:scale-[0.98]
                                    "
                                >
                                    <Plus
                                        size={17}
                                    />

                                    Feedback yuborish
                                </button>
                            </div>
                        </div>
                    </section>

                    {/* =====================================
                        ERROR
                    ====================================== */}

                    <AnimatePresence>
                        {error && (
                            <motion.div
                                initial={{
                                    opacity: 0,
                                    y: -6,
                                }}
                                animate={{
                                    opacity: 1,
                                    y: 0,
                                }}
                                exit={{
                                    opacity: 0,
                                    y: -6,
                                }}
                                role="alert"
                                className="
                                    mt-6
                                    flex
                                    items-start
                                    gap-3
                                    rounded-2xl
                                    border
                                    border-red-400/15
                                    bg-red-500/[0.05]
                                    px-4
                                    py-3
                                    text-xs
                                    font-medium
                                    leading-5
                                    text-red-300
                                "
                            >
                                <AlertCircle
                                    size={17}
                                    className="
                                        mt-0.5
                                        shrink-0
                                    "
                                />

                                <span>
                                    {error}
                                </span>
                            </motion.div>
                        )}
                    </AnimatePresence>

                    {/* =====================================
                        MY STATS
                    ====================================== */}

                    {isLoggedIn && (
                        <section
                            className="
                                mt-8
                            "
                        >
                            <div
                                className="
                                    mb-4
                                    flex
                                    items-center
                                    justify-between
                                    gap-3
                                "
                            >
                                <div>
                                    <h2
                                        className="
                                            font-display
                                            text-lg
                                            font-semibold
                                            text-white
                                        "
                                    >
                                        Mening statistikam
                                    </h2>

                                    <p
                                        className="
                                            mt-1
                                            text-xs
                                            font-medium
                                            text-gray-600
                                        "
                                    >
                                        Feedback faoliyatingiz,
                                        moderatsiya jarayoni va
                                        FCoin natijalari.
                                    </p>
                                </div>

                                <Gift
                                    size={20}
                                    className="
                                        text-amber-300
                                    "
                                />
                            </div>

                            <div
                                className="
                                    grid
                                    grid-cols-2
                                    gap-3
                                    md:grid-cols-3
                                    xl:grid-cols-7
                                "
                            >
                                {statCards.map(
                                    (
                                        card
                                    ) => (
                                        <StatCard
                                            key={
                                                card.title
                                            }
                                            {...card}
                                            isLoading={
                                                isStatsInitialLoading
                                            }
                                        />
                                    )
                                )}
                            </div>
                        </section>
                    )}

                    {/* =====================================
                        MY FEEDBACKS
                    ====================================== */}

                    {isLoggedIn && (
                        <section
                            className="
                                mt-12
                            "
                        >
                            <div
                                className="
                                    flex
                                    flex-col
                                    gap-4
                                    sm:flex-row
                                    sm:items-end
                                    sm:justify-between
                                "
                            >
                                <div>
                                    <h2
                                        className="
                                            font-display
                                            text-xl
                                            font-semibold
                                            text-white
                                        "
                                    >
                                        Mening feedbacklarim
                                    </h2>

                                    <p
                                        className="
                                            mt-1
                                            max-w-xl
                                            text-xs
                                            font-medium
                                            leading-5
                                            text-gray-600
                                        "
                                    >
                                        Faqat{" "}
                                        <span
                                            className="
                                                text-amber-300/80
                                            "
                                        >
                                            Kutilmoqda
                                        </span>{" "}
                                        holatidagi feedbackni
                                        tahrirlash yoki o‘chirish mumkin.
                                        Admin ishlashni boshlagach
                                        feedback bloklanadi.
                                    </p>
                                </div>

                                {/* FILTERS */}

                                <div
                                    className="
                                        flex
                                        flex-wrap
                                        gap-2
                                    "
                                >
                                    {statusFilters.map(
                                        (
                                            item
                                        ) => {
                                            const active =
                                                activeStatus ===
                                                item.value;

                                            const activeClass =
                                                item.value ===
                                                "in_progress"
                                                    ? (
                                                        "border-blue-400/25 "
                                                        +
                                                        "bg-blue-500/[0.10] "
                                                        +
                                                        "text-blue-300"
                                                    )
                                                    : item.value ===
                                                    "approved"
                                                        ? (
                                                            "border-emerald-400/25 "
                                                            +
                                                            "bg-emerald-500/[0.10] "
                                                            +
                                                            "text-emerald-300"
                                                        )
                                                        : item.value ===
                                                        "rejected"
                                                            ? (
                                                                "border-red-400/25 "
                                                                +
                                                                "bg-red-500/[0.10] "
                                                                +
                                                                "text-red-300"
                                                            )
                                                            : item.value ===
                                                            "pending"
                                                                ? (
                                                                    "border-amber-400/25 "
                                                                    +
                                                                    "bg-amber-500/[0.10] "
                                                                    +
                                                                    "text-amber-300"
                                                                )
                                                                : (
                                                                    "border-indigo-400/25 "
                                                                    +
                                                                    "bg-indigo-500/[0.10] "
                                                                    +
                                                                    "text-indigo-300"
                                                                );

                                            return (
                                                <button
                                                    key={
                                                        item.value
                                                    }
                                                    type="button"
                                                    onClick={() => {
                                                        setActiveStatus(
                                                            item.value
                                                        );
                                                    }}
                                                    disabled={
                                                        isMyLoading
                                                    }
                                                    aria-pressed={
                                                        active
                                                    }
                                                    className={`
                                                        rounded-xl
                                                        border
                                                        px-3
                                                        py-2
                                                        font-display
                                                        text-[9px]
                                                        font-semibold
                                                        uppercase
                                                        tracking-[0.08em]
                                                        transition-all
                                                        disabled:cursor-not-allowed
                                                        disabled:opacity-50

                                                        ${
                                                            active
                                                                ? activeClass
                                                                : (
                                                                    "border-white/[0.06] "
                                                                    +
                                                                    "bg-white/[0.02] "
                                                                    +
                                                                    "text-gray-600 "
                                                                    +
                                                                    "hover:bg-white/[0.05] "
                                                                    +
                                                                    "hover:text-gray-300"
                                                                )
                                                        }
                                                    `}
                                                >
                                                    {item.label}
                                                </button>
                                            );
                                        }
                                    )}
                                </div>
                            </div>

                            {/* ACTIVE FILTER */}

                            {activeStatus !==
                                "all"
                                && (
                                    <div
                                        className="
                                            mt-4
                                            inline-flex
                                            items-center
                                            gap-2
                                            rounded-xl
                                            border
                                            border-white/[0.06]
                                            bg-white/[0.02]
                                            px-3
                                            py-2
                                            text-[10px]
                                            font-medium
                                            text-gray-500
                                        "
                                    >
                                        <span>
                                            Filter:
                                        </span>

                                        <span
                                            className="
                                                font-display
                                                font-semibold
                                                text-gray-300
                                            "
                                        >
                                            {activeStatusLabel}
                                        </span>
                                    </div>
                                )}

                            {/* LIST */}

                            <div
                                className="
                                    mt-5
                                "
                            >
                                {isMyInitialLoading ? (
                                    <FeedbackListSkeleton
                                        count={4}
                                    />
                                ) : myFeedbacks.length > 0 ? (
                                    <motion.div
                                        layout
                                        className="
                                            grid
                                            grid-cols-1
                                            gap-4
                                            lg:grid-cols-2
                                        "
                                    >
                                        <AnimatePresence
                                            mode="popLayout"
                                        >
                                            {myFeedbacks.map(
                                                (
                                                    feedback
                                                ) => {
                                                    const feedbackId =
                                                        Number(
                                                            feedback?.id
                                                        );

                                                    const cardUpdating =
                                                        isUpdating
                                                        &&
                                                        Number(
                                                            updatingId
                                                        )
                                                        ===
                                                        feedbackId;

                                                    const cardDeleting =
                                                        isDeleting
                                                        &&
                                                        Number(
                                                            deletingId
                                                        )
                                                        ===
                                                        feedbackId;

                                                    const actionsDisabled =
                                                        (
                                                            isUpdating
                                                            ||
                                                            isDeleting
                                                        )
                                                        &&
                                                        !cardUpdating
                                                        &&
                                                        !cardDeleting;

                                                    return (
                                                        <FeedbackCard
                                                            key={
                                                                feedback.id
                                                            }
                                                            feedback={
                                                                feedback
                                                            }
                                                            onEdit={
                                                                handleOpenEdit
                                                            }
                                                            onDelete={
                                                                handleOpenDeleteModal
                                                            }
                                                            isUpdating={
                                                                cardUpdating
                                                            }
                                                            isDeleting={
                                                                cardDeleting
                                                            }
                                                            actionsDisabled={
                                                                actionsDisabled
                                                            }
                                                        />
                                                    );
                                                }
                                            )}
                                        </AnimatePresence>
                                    </motion.div>
                                ) : (
                                    <EmptyState
                                        title="Feedback topilmadi"
                                        description={
                                            activeStatus ===
                                            "all"
                                                ? (
                                                    "Siz hali feedback yubormagansiz."
                                                )
                                                : (
                                                    `${activeStatusLabel} holatidagi feedback hozircha yo‘q.`
                                                )
                                        }
                                    />
                                )}
                            </div>

                            {/* MY PAGINATION */}

                            {!isMyInitialLoading && (
                                <FeedbackPagination
                                    page={
                                        myPagination.page
                                    }
                                    totalPages={
                                        myPagination.totalPages
                                    }
                                    count={
                                        myPagination.count
                                    }
                                    hasPrevious={
                                        myPagination.hasPrevious
                                    }
                                    hasNext={
                                        myPagination.hasNext
                                    }
                                    isLoading={
                                        isMyLoading
                                    }
                                    onPageChange={
                                        handleMyPageChange
                                    }
                                    label="Mening feedbacklarim sahifalari"
                                />
                            )}
                        </section>
                    )}

                    {/* =====================================
                        COMMUNITY
                    ====================================== */}

                    <section
                        className="
                            mt-14
                        "
                    >
                        <div
                            className="
                                flex
                                items-end
                                justify-between
                                gap-4
                            "
                        >
                            <div>
                                <div
                                    className="
                                        flex
                                        items-center
                                        gap-2
                                    "
                                >
                                    <ShieldCheck
                                        size={18}
                                        className="
                                            text-emerald-300
                                        "
                                    />

                                    <h2
                                        className="
                                            font-display
                                            text-xl
                                            font-semibold
                                            text-white
                                        "
                                    >
                                        Tasdiqlangan feedbacklar
                                    </h2>
                                </div>

                                <p
                                    className="
                                        mt-1
                                        text-xs
                                        font-medium
                                        text-gray-600
                                    "
                                >
                                    Admin tomonidan tasdiqlangan
                                    hamjamiyat feedbacklari.
                                </p>
                            </div>

                            <span
                                className="
                                    shrink-0
                                    rounded-full
                                    border
                                    border-white/[0.06]
                                    bg-white/[0.02]
                                    px-3
                                    py-1.5
                                    font-display
                                    text-[9px]
                                    font-semibold
                                    uppercase
                                    tracking-[0.08em]
                                    text-gray-500
                                "
                            >
                                {
                                    publicCount
                                    ??
                                    publicFeedbacks.length
                                }{" "}
                                ta
                            </span>
                        </div>

                        {/* PUBLIC LIST */}

                        <div
                            className="
                                mt-5
                            "
                        >
                            {publicFeedbacks.length > 0 ? (
                                <div
                                    className="
                                        grid
                                        grid-cols-1
                                        gap-4
                                        lg:grid-cols-2
                                    "
                                >
                                    {publicFeedbacks.map(
                                        (
                                            feedback
                                        ) => (
                                            <FeedbackCard
                                                key={
                                                    feedback.id
                                                }
                                                feedback={
                                                    feedback
                                                }
                                                showStatus={
                                                    false
                                                }
                                            />
                                        )
                                    )}
                                </div>
                            ) : (
                                <EmptyState
                                    title="Hozircha tasdiqlangan feedback yo‘q"
                                    description={
                                        "Birinchi foydali feedbackni siz yuborishingiz mumkin."
                                    }
                                />
                            )}
                        </div>

                        {/* PUBLIC PAGINATION */}

                        <FeedbackPagination
                            page={
                                publicPagination.page
                            }
                            totalPages={
                                publicPagination.totalPages
                            }
                            count={
                                publicPagination.count
                            }
                            hasPrevious={
                                publicPagination.hasPrevious
                            }
                            hasNext={
                                publicPagination.hasNext
                            }
                            isLoading={
                                isPublicLoading
                            }
                            onPageChange={
                                handlePublicPageChange
                            }
                            label="Tasdiqlangan feedbacklar sahifalari"
                        />
                    </section>
                </div>
            </main>

            {/* =============================================
                CREATE MODAL
            ============================================== */}

            <FeedbackCreateModal
                isOpen={
                    isCreateModalOpen
                }
                onClose={
                    handleCloseCreate
                }
                onCreated={
                    handleCreated
                }
            />

            {/* =============================================
                EDIT MODAL
            ============================================== */}

            <FeedbackEditModal
                isOpen={
                    isEditModalOpen
                }
                feedback={
                    editingFeedback
                }
                isSubmitting={
                    isUpdating
                }
                onClose={
                    handleCloseEdit
                }
                onSubmit={
                    handleUpdateFeedback
                }
            />

            {/* =============================================
                DELETE CONFIRMATION
            ============================================== */}

            {isLoggedIn && (
                <DeleteConfirmationModal
                    isOpen={
                        isDeleteModalOpen
                    }
                    onClose={
                        handleCloseDeleteModal
                    }
                    onConfirm={
                        handleConfirmDelete
                    }
                    itemTitle={
                        deleteTargetTitle
                    }
                    isProcessing={
                        isDeleting
                    }
                />
            )}
        </>
    );
};


// =========================================================
// EXPORT
// =========================================================

export default Feedback;