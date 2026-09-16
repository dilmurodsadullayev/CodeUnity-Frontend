import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useSelector,
} from "react-redux";

import {
    useNavigate,
} from "react-router-dom";

import {
    motion,
} from "framer-motion";

import toast, {
    Toaster,
} from "react-hot-toast";

import {
    AlertCircle,
    Bug,
    CheckCircle2,
    Clock3,
    Coins,
    Gift,
    Loader2,
    MessageSquareText,
    Plus,
    RefreshCcw,
    ShieldCheck,
    Sparkles,
    XCircle,
} from "lucide-react";

import FeedbackService from "../services/feedback";

import FeedbackCreateModal from "./feedback/FeedbackCreateModal";

import FeedbackEditModal from "./feedback/FeedbackEditModal";

import FeedbackCard from "./feedback/FeedbackCard";

import DeleteConfirmationModal from "./DeleteConfirmationModal";


// =========================================================
// STATUS FILTERS
// =========================================================

const STATUS_FILTERS = [
    {
        value: "all",
        label: "Barchasi",
    },

    {
        value: "pending",
        label: "Pending",
    },

    {
        value: "approved",
        label: "Approved",
    },

    {
        value: "rejected",
        label: "Rejected",
    },
];


// =========================================================
// ERROR PARSER
// =========================================================

const getErrorMessage = (
    error
) => {
    const data =
        error?.response?.data;


    if (!data) {
        return (
            error?.message
            ||
            "Server bilan bog‘lanishda xatolik yuz berdi."
        );
    }


    if (
        typeof data ===
        "string"
    ) {
        return data;
    }


    if (
        data?.detail
    ) {
        return data.detail;
    }


    if (
        data?.message
    ) {
        return data.message;
    }


    if (
        data?.error
    ) {
        return data.error;
    }


    if (
        typeof data ===
        "object"
    ) {
        const firstKey =
            Object.keys(
                data
            )[0];


        if (firstKey) {
            const value =
                data[
                    firstKey
                ];


            if (
                Array.isArray(
                    value
                )
            ) {
                return (
                    value[0]
                    ||
                    "Xatolik yuz berdi."
                );
            }


            if (
                typeof value ===
                "string"
            ) {
                return value;
            }
        }
    }


    return (
        "Feedback bilan ishlashda "
        + "xatolik yuz berdi."
    );
};


// =========================================================
// STAT CARD
// =========================================================

const StatCard = ({
    title,
    value,
    Icon,
    description,
}) => {
    return (
        <motion.div
            whileHover={{
                y: -3,
            }}
            transition={{
                duration: 0.18,
            }}
            className="
                relative
                overflow-hidden
                rounded-2xl
                border
                border-white/[0.06]
                bg-white/[0.025]
                p-5
                transition
                hover:border-indigo-400/15
                hover:bg-white/[0.035]
            "
        >

            <div
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

                <div>

                    <p
                        className="
                            text-[10px]
                            font-bold
                            uppercase
                            tracking-[0.16em]
                            text-gray-600
                        "
                    >
                        {title}
                    </p>


                    <h3
                        className="
                            mt-2
                            text-2xl
                            font-black
                            text-white
                        "
                    >
                        {value}
                    </h3>


                    <p
                        className="
                            mt-1
                            text-[10px]
                            leading-5
                            text-gray-600
                        "
                    >
                        {description}
                    </p>

                </div>


                <div
                    className="
                        grid
                        h-10
                        w-10
                        flex-shrink-0
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
                    text-sm
                    font-black
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

    const navigate =
        useNavigate();


    // =====================================================
    // AUTH
    // =====================================================

    const {
        isLoggedIn,
    } = useSelector(
        (
            state
        ) =>
            state.auth
    );


    // =====================================================
    // DATA
    // =====================================================

    const [
        publicFeedbacks,
        setPublicFeedbacks,
    ] = useState([]);


    const [
        myFeedbacks,
        setMyFeedbacks,
    ] = useState([]);


    const [
        stats,
        setStats,
    ] = useState({
        total: 0,
        pending: 0,
        approved: 0,
        rejected: 0,
        earned_fcoin: 0,
        approved_bugs: 0,
    });


    // =====================================================
    // FILTER
    // =====================================================

    const [
        activeStatus,
        setActiveStatus,
    ] = useState(
        "all"
    );


    // =====================================================
    // MODALS
    // =====================================================

    const [
        isCreateModalOpen,
        setIsCreateModalOpen,
    ] = useState(
        false
    );


    const [
        editingFeedback,
        setEditingFeedback,
    ] = useState(
        null
    );


    const [
        deletingFeedback,
        setDeletingFeedback,
    ] = useState(
        null
    );


    // =====================================================
    // LOADING
    // =====================================================

    const [
        isLoading,
        setIsLoading,
    ] = useState(
        true
    );


    const [
        isRefreshing,
        setIsRefreshing,
    ] = useState(
        false
    );


    const [
        isDeleting,
        setIsDeleting,
    ] = useState(
        false
    );


    // =====================================================
    // PAGE ERROR
    // =====================================================

    const [
        error,
        setError,
    ] = useState("");


    // =====================================================
    // FILTERED MY FEEDBACKS
    // =====================================================

    const filteredMyFeedbacks =
        useMemo(
            () => {

                if (
                    activeStatus ===
                    "all"
                ) {
                    return (
                        myFeedbacks
                    );
                }


                return (
                    myFeedbacks.filter(
                        (
                            feedback
                        ) =>
                            feedback.status ===
                            activeStatus
                    )
                );

            },
            [
                activeStatus,
                myFeedbacks,
            ]
        );


    // =====================================================
    // LOAD PUBLIC
    // =====================================================

    const loadPublicFeedbacks =
        useCallback(
            async () => {

                const data =
                    await FeedbackService
                        .getFeedbacks();


                setPublicFeedbacks(
                    Array.isArray(
                        data
                    )
                        ? data
                        : []
                );

            },
            []
        );


    // =====================================================
    // LOAD MY FEEDBACKS
    // =====================================================

    const loadMyFeedbacks =
        useCallback(
            async () => {

                if (
                    !isLoggedIn
                ) {

                    setMyFeedbacks(
                        []
                    );

                    return;
                }


                const data =
                    await FeedbackService
                        .getMyFeedbacks();


                setMyFeedbacks(
                    Array.isArray(
                        data
                    )
                        ? data
                        : []
                );

            },
            [
                isLoggedIn,
            ]
        );


    // =====================================================
    // LOAD STATS
    // =====================================================

    const loadStats =
        useCallback(
            async () => {

                if (
                    !isLoggedIn
                ) {

                    setStats({
                        total: 0,
                        pending: 0,
                        approved: 0,
                        rejected: 0,
                        earned_fcoin: 0,
                        approved_bugs: 0,
                    });

                    return;
                }


                const data =
                    await FeedbackService
                        .getMyFeedbackStats();


                setStats({
                    total:
                        data?.total
                        ?? 0,

                    pending:
                        data?.pending
                        ?? 0,

                    approved:
                        data?.approved
                        ?? 0,

                    rejected:
                        data?.rejected
                        ?? 0,

                    earned_fcoin:
                        data?.earned_fcoin
                        ?? 0,

                    approved_bugs:
                        data?.approved_bugs
                        ?? 0,
                });

            },
            [
                isLoggedIn,
            ]
        );


    // =====================================================
    // LOAD ALL
    // =====================================================

    const loadAllData =
        useCallback(
            async () => {

                await Promise.all([
                    loadPublicFeedbacks(),
                    loadMyFeedbacks(),
                    loadStats(),
                ]);

            },
            [
                loadPublicFeedbacks,
                loadMyFeedbacks,
                loadStats,
            ]
        );


    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(
        () => {

            let mounted =
                true;


            const load =
                async () => {

                    setIsLoading(
                        true
                    );

                    setError("");


                    try {

                        await loadAllData();

                    } catch (
                        requestError
                    ) {

                        if (
                            mounted
                        ) {

                            setError(
                                getErrorMessage(
                                    requestError
                                )
                            );

                        }

                    } finally {

                        if (
                            mounted
                        ) {

                            setIsLoading(
                                false
                            );

                        }
                    }
                };


            load();


            return () => {

                mounted =
                    false;

            };

        },
        [
            loadAllData,
        ]
    );


    // =====================================================
    // REFRESH
    // =====================================================

    const handleRefresh =
        async () => {

            if (
                isRefreshing
            ) {
                return;
            }


            const toastId =
                toast.loading(
                    "Feedbacklar yangilanmoqda..."
                );


            setIsRefreshing(
                true
            );

            setError("");


            try {

                await loadAllData();


                toast.success(
                    "Feedback ma’lumotlari yangilandi.",
                    {
                        id:
                            toastId,
                    }
                );

            } catch (
                requestError
            ) {

                const message =
                    getErrorMessage(
                        requestError
                    );


                setError(
                    message
                );


                toast.error(
                    message,
                    {
                        id:
                            toastId,

                        duration:
                            5000,
                    }
                );

            } finally {

                setIsRefreshing(
                    false
                );

            }
        };


    // =====================================================
    // OPEN CREATE
    // =====================================================

    const handleOpenCreate =
        () => {

            if (
                !isLoggedIn
            ) {

                toast.error(
                    "Feedback yuborish uchun avval tizimga kiring."
                );


                navigate(
                    "/login"
                );

                return;
            }


            setIsCreateModalOpen(
                true
            );
        };


    // =====================================================
    // CREATED
    // =====================================================

    const handleCreated =
        async (
            createdFeedback
        ) => {

            setActiveStatus(
                "all"
            );


            setIsCreateModalOpen(
                false
            );


            if (
                createdFeedback?.id
            ) {

                setMyFeedbacks(
                    (
                        current
                    ) => [
                        createdFeedback,
                        ...current.filter(
                            (
                                item
                            ) =>
                                item.id !==
                                createdFeedback.id
                        ),
                    ]
                );

            }


            try {

                await Promise.all([
                    loadMyFeedbacks(),
                    loadStats(),
                    loadPublicFeedbacks(),
                ]);

            } catch (
                requestError
            ) {

                console.error(
                    "Feedback create refresh error:",
                    requestError
                );

            }
        };


    // =====================================================
    // EDIT OPEN
    // =====================================================

    const handleEdit =
        (
            feedback
        ) => {

            if (
                !feedback
                    ?.can_user_modify
            ) {

                toast.error(
                    "Faqat pending feedbackni tahrirlash mumkin."
                );

                return;
            }


            setEditingFeedback(
                feedback
            );
        };


    // =====================================================
    // UPDATED
    // =====================================================

    const handleUpdated =
        async (
            updatedFeedback
        ) => {

            setEditingFeedback(
                null
            );


            if (
                updatedFeedback?.id
            ) {

                setMyFeedbacks(
                    (
                        current
                    ) =>
                        current.map(
                            (
                                item
                            ) =>
                                item.id ===
                                updatedFeedback.id

                                    ? updatedFeedback

                                    : item
                        )
                );

            }


            try {

                await Promise.all([
                    loadMyFeedbacks(),
                    loadStats(),
                    loadPublicFeedbacks(),
                ]);

            } catch (
                requestError
            ) {

                console.error(
                    "Feedback update refresh error:",
                    requestError
                );

            }
        };


    // =====================================================
    // DELETE OPEN
    // =====================================================

    const handleDelete =
        (
            feedback
        ) => {

            if (
                !feedback
                    ?.can_user_modify
            ) {

                toast.error(
                    "Faqat pending feedbackni o‘chirish mumkin."
                );

                return;
            }


            setDeletingFeedback(
                feedback
            );
        };


    // =====================================================
    // DELETE CLOSE
    // =====================================================

    const handleDeleteClose =
        () => {

            if (
                isDeleting
            ) {
                return;
            }


            setDeletingFeedback(
                null
            );
        };


    // =====================================================
    // DELETE CONFIRM
    // =====================================================

    const handleDeleteConfirm =
        async () => {

            if (
                !deletingFeedback?.id
                ||
                isDeleting
            ) {
                return;
            }


            const feedbackId =
                deletingFeedback.id;


            const feedbackTitle =
                deletingFeedback.title
                || "Feedback";


            const toastId =
                toast.loading(
                    "Feedback o‘chirilmoqda..."
                );


            setIsDeleting(
                true
            );

            setError("");


            try {

                await FeedbackService
                    .deleteFeedback(
                        feedbackId
                    );


                setMyFeedbacks(
                    (
                        current
                    ) =>
                        current.filter(
                            (
                                feedback
                            ) =>
                                feedback.id !==
                                feedbackId
                        )
                );


                setDeletingFeedback(
                    null
                );


                toast.success(
                    `"${feedbackTitle}" muvaffaqiyatli o‘chirildi.`,
                    {
                        id:
                            toastId,

                        duration:
                            3500,
                    }
                );


                try {

                    await Promise.all([
                        loadStats(),
                        loadPublicFeedbacks(),
                    ]);

                } catch (
                    refreshError
                ) {

                    console.error(
                        "Delete refresh error:",
                        refreshError
                    );

                }

            } catch (
                requestError
            ) {

                const message =
                    getErrorMessage(
                        requestError
                    );


                setError(
                    message
                );


                toast.error(
                    message,
                    {
                        id:
                            toastId,

                        duration:
                            5000,
                    }
                );

            } finally {

                setIsDeleting(
                    false
                );

            }
        };


    // =====================================================
    // STAT CARDS
    // =====================================================

    const statCards =
        useMemo(
            () => [
                {
                    title:
                        "Jami",

                    value:
                        stats.total,

                    Icon:
                        MessageSquareText,

                    description:
                        "Yuborgan feedbacklaringiz",
                },

                {
                    title:
                        "Pending",

                    value:
                        stats.pending,

                    Icon:
                        Clock3,

                    description:
                        "Admin tekshiruvini kutmoqda",
                },

                {
                    title:
                        "Approved",

                    value:
                        stats.approved,

                    Icon:
                        CheckCircle2,

                    description:
                        "Tasdiqlangan feedbacklar",
                },

                {
                    title:
                        "Rejected",

                    value:
                        stats.rejected,

                    Icon:
                        XCircle,

                    description:
                        "Rad etilgan feedbacklar",
                },

                {
                    title:
                        "Earned FCoin",

                    value:
                        stats.earned_fcoin,

                    Icon:
                        Coins,

                    description:
                        "Feedback orqali topilgan",
                },

                {
                    title:
                        "Approved Bugs",

                    value:
                        stats.approved_bugs,

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
    // LOADING
    // =====================================================

    if (
        isLoading
    ) {
        return (
            <>
                <Toaster
                    position="top-right"
                    containerStyle={{
                        zIndex:
                            2147483647,

                        top:
                            24,

                        right:
                            24,
                    }}
                    toastOptions={{
                        duration:
                            4000,

                        style: {
                            background:
                                "#161b22",

                            color:
                                "#f0f6fc",

                            border:
                                "1px solid #30363d",

                            borderRadius:
                                "14px",

                            padding:
                                "14px 16px",

                            fontSize:
                                "13px",

                            fontWeight:
                                "600",

                            boxShadow:
                                "0 20px 60px rgba(0, 0, 0, 0.55)",

                            maxWidth:
                                "420px",
                        },

                        success: {
                            iconTheme: {
                                primary:
                                    "#22c55e",

                                secondary:
                                    "#161b22",
                            },
                        },

                        error: {
                            iconTheme: {
                                primary:
                                    "#ef4444",

                                secondary:
                                    "#161b22",
                            },
                        },

                        loading: {
                            iconTheme: {
                                primary:
                                    "#818cf8",

                                secondary:
                                    "#161b22",
                            },
                        },
                    }}
                />


                <div
                    className="
                        flex
                        min-h-[70vh]
                        items-center
                        justify-center
                    "
                >

                    <div
                        className="
                            text-center
                        "
                    >

                        <Loader2
                            size={34}
                            className="
                                mx-auto
                                animate-spin
                                text-indigo-400
                            "
                        />


                        <p
                            className="
                                mt-3
                                text-xs
                                font-semibold
                                text-gray-600
                            "
                        >
                            Feedbacklar yuklanmoqda...
                        </p>

                    </div>

                </div>
            </>
        );
    }


    // =====================================================
    // JSX
    // =====================================================

    return (
        <>

            {/* =============================================
                TOAST
            ============================================== */}

            <Toaster
                position="top-right"
                containerStyle={{
                    zIndex:
                        2147483647,

                    top:
                        24,

                    right:
                        24,
                }}
                toastOptions={{
                    duration:
                        4000,

                    style: {
                        background:
                            "#161b22",

                        color:
                            "#f0f6fc",

                        border:
                            "1px solid #30363d",

                        borderRadius:
                            "14px",

                        padding:
                            "14px 16px",

                        fontSize:
                            "13px",

                        fontWeight:
                            "600",

                        boxShadow:
                            "0 20px 60px rgba(0, 0, 0, 0.55)",

                        maxWidth:
                            "420px",
                    },

                    success: {
                        iconTheme: {
                            primary:
                                "#22c55e",

                            secondary:
                                "#161b22",
                        },
                    },

                    error: {
                        iconTheme: {
                            primary:
                                "#ef4444",

                            secondary:
                                "#161b22",
                        },
                    },

                    loading: {
                        iconTheme: {
                            primary:
                                "#818cf8",

                            secondary:
                                "#161b22",
                        },
                    },
                }}
            />


            <main
                className="
                    relative
                    min-h-screen
                    overflow-hidden
                    bg-[#06080d]
                    pb-24
                "
            >

                {/* =========================================
                    BACKGROUND
                ========================================== */}

                <div
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


                {/* =========================================
                    CONTAINER
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
                            className="
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
                                        text-[10px]
                                        font-black
                                        uppercase
                                        tracking-[0.15em]
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
                                        text-3xl
                                        font-black
                                        tracking-tight
                                        text-white
                                        sm:text-4xl
                                        lg:text-5xl
                                    "
                                >

                                    F.Society’ni
                                    {" "}

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
                                        leading-7
                                        text-gray-500
                                    "
                                >
                                    Bug topdingizmi,
                                    yangi feature g‘oyangiz
                                    bormi yoki platforma
                                    haqida fikringizni
                                    aytmoqchimisiz?
                                    Feedback yuboring.
                                    Admin tasdiqlagan foydali
                                    feedbacklar uchun FCoin
                                    mukofoti beriladi.
                                </p>

                            </div>


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
                                        items-center
                                        justify-center
                                        gap-2
                                        rounded-xl
                                        border
                                        border-white/[0.07]
                                        bg-white/[0.025]
                                        px-4
                                        py-3
                                        text-xs
                                        font-bold
                                        text-gray-400
                                        transition
                                        hover:bg-white/[0.06]
                                        hover:text-white
                                        disabled:cursor-not-allowed
                                        disabled:opacity-50
                                    "
                                >

                                    <RefreshCcw
                                        size={16}
                                        className={
                                            isRefreshing
                                                ? "animate-spin"
                                                : ""
                                        }
                                    />

                                    Yangilash

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
                                        bg-indigo-600
                                        px-5
                                        py-3
                                        text-xs
                                        font-black
                                        text-white
                                        shadow-lg
                                        shadow-indigo-950/30
                                        transition
                                        hover:bg-indigo-500
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

                    {error && (

                        <div
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
                                text-red-300
                            "
                        >

                            <AlertCircle
                                size={17}
                                className="
                                    mt-0.5
                                    flex-shrink-0
                                "
                            />

                            <div
                                className="
                                    flex-1
                                "
                            >
                                {error}
                            </div>

                        </div>

                    )}


                    {/* =====================================
                        STATS
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
                                "
                            >

                                <div>

                                    <h2
                                        className="
                                            text-lg
                                            font-black
                                            text-white
                                        "
                                    >
                                        Mening statistikam
                                    </h2>


                                    <p
                                        className="
                                            mt-1
                                            text-xs
                                            text-gray-600
                                        "
                                    >
                                        Feedback faoliyatingiz
                                        va FCoin natijalari.
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
                                    xl:grid-cols-6
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
                                            text-xl
                                            font-black
                                            text-white
                                        "
                                    >
                                        Mening feedbacklarim
                                    </h2>


                                    <p
                                        className="
                                            mt-1
                                            text-xs
                                            text-gray-600
                                        "
                                    >
                                        Yuborgan feedbacklaringiz
                                        holatini kuzating.
                                    </p>

                                </div>


                                <div
                                    className="
                                        flex
                                        flex-wrap
                                        gap-2
                                    "
                                >

                                    {STATUS_FILTERS.map(
                                        (
                                            item
                                        ) => {

                                            const active =
                                                activeStatus ===
                                                item.value;


                                            return (
                                                <button
                                                    key={
                                                        item.value
                                                    }
                                                    type="button"
                                                    onClick={
                                                        () =>
                                                            setActiveStatus(
                                                                item.value
                                                            )
                                                    }
                                                    className={`
                                                        rounded-xl
                                                        border
                                                        px-3
                                                        py-2
                                                        text-[10px]
                                                        font-bold
                                                        transition

                                                        ${
                                                            active
                                                                ? `
                                                                    border-indigo-400/25
                                                                    bg-indigo-500/[0.10]
                                                                    text-indigo-300
                                                                `
                                                                : `
                                                                    border-white/[0.06]
                                                                    bg-white/[0.02]
                                                                    text-gray-600
                                                                    hover:bg-white/[0.05]
                                                                    hover:text-gray-300
                                                                `
                                                        }
                                                    `}
                                                >
                                                    {
                                                        item.label
                                                    }
                                                </button>
                                            );
                                        }
                                    )}

                                </div>

                            </div>


                            <div
                                className="
                                    mt-5
                                    grid
                                    grid-cols-1
                                    gap-4
                                    lg:grid-cols-2
                                "
                            >

                                {filteredMyFeedbacks.length ? (

                                    filteredMyFeedbacks.map(
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
                                                onEdit={
                                                    handleEdit
                                                }
                                                onDelete={
                                                    handleDelete
                                                }
                                            />

                                        )
                                    )

                                ) : (

                                    <div
                                        className="
                                            lg:col-span-2
                                        "
                                    >

                                        <EmptyState
                                            title="Feedback topilmadi"
                                            description={
                                                activeStatus ===
                                                "all"
                                                    ? (
                                                        "Siz hali feedback "
                                                        + "yubormagansiz."
                                                    )
                                                    : (
                                                        `Hozircha ${activeStatus} `
                                                        + "holatidagi feedback yo‘q."
                                                    )
                                            }
                                        />

                                    </div>

                                )}

                            </div>

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
                                            text-xl
                                            font-black
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
                                        text-gray-600
                                    "
                                >
                                    Admin tomonidan
                                    tasdiqlangan hamjamiyat
                                    feedbacklari.
                                </p>

                            </div>


                            <span
                                className="
                                    rounded-full
                                    border
                                    border-white/[0.06]
                                    bg-white/[0.02]
                                    px-3
                                    py-1.5
                                    text-[10px]
                                    font-bold
                                    text-gray-500
                                "
                            >
                                {
                                    publicFeedbacks.length
                                }
                                {" "}
                                ta
                            </span>

                        </div>


                        <div
                            className="
                                mt-5
                                grid
                                grid-cols-1
                                gap-4
                                lg:grid-cols-2
                            "
                        >

                            {publicFeedbacks.length ? (

                                publicFeedbacks.map(
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
                                )

                            ) : (

                                <div
                                    className="
                                        lg:col-span-2
                                    "
                                >

                                    <EmptyState
                                        title="Hozircha tasdiqlangan feedback yo‘q"
                                        description={
                                            "Birinchi foydali feedbackni "
                                            + "siz yuborishingiz mumkin."
                                        }
                                    />

                                </div>

                            )}

                        </div>

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
                    () =>
                        setIsCreateModalOpen(
                            false
                        )
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
                    Boolean(
                        editingFeedback
                    )
                }
                feedback={
                    editingFeedback
                }
                onClose={
                    () =>
                        setEditingFeedback(
                            null
                        )
                }
                onUpdated={
                    handleUpdated
                }
            />


            {/* =============================================
                DELETE MODAL
            ============================================== */}

            <DeleteConfirmationModal
                isOpen={
                    Boolean(
                        deletingFeedback
                    )
                }
                onClose={
                    handleDeleteClose
                }
                onConfirm={
                    handleDeleteConfirm
                }
                itemTitle={
                    deletingFeedback
                        ?.title
                    ||
                    "ushbu feedbackni"
                }
            />

        </>
    );
};


export default Feedback;