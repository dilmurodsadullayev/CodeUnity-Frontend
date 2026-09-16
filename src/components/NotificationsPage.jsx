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
    useDispatch,
    useSelector,
} from "react-redux";

import {
    AlertTriangle,
    CheckCheck,
    Loader2,
    Wifi,
    WifiOff,
} from "lucide-react";

import {
    markAllNotificationsAsRead,
    markNotificationAsRead,
} from "../middleware/notificationMiddleware";

import NotificationCard from "./notifications/NotificationCard";

import NotificationPagination, {
    NotificationEmptyState,
    NotificationLoadingState,
} from "./notifications/NotificationPagination";

import {
    filterNotifications,
    getNotificationCounts,
    NOTIFICATION_FILTERS,
} from "../utils/notificationUtils";


// =========================================================
// NOTIFICATIONS PAGE
// =========================================================

const NotificationsPage = () => {
    const dispatch =
        useDispatch();


    // =====================================================
    // REDUX
    // =====================================================

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


    const {
        user: currentUser,
    } = useSelector(
        (state) =>
            state.auth ||
            {}
    );


    // =====================================================
    // STATE
    // =====================================================

    const [
        filter,
        setFilter,
    ] = useState(
        "all"
    );


    const [
        currentPage,
        setCurrentPage,
    ] = useState(
        1
    );


    const [
        perPage,
        setPerPage,
    ] = useState(
        10
    );


    // =====================================================
    // SAFE NOTIFICATIONS
    // =====================================================

    const safeNotifications =
        Array.isArray(
            notifications
        )
            ? notifications
            : [];


    // =====================================================
    // COUNTS
    // =====================================================

    const {
        total: totalCount,
        unread: unreadCount,
        read: readCount,
    } = useMemo(
        () =>
            getNotificationCounts(
                safeNotifications,
                totalUnreadCount
            ),
        [
            safeNotifications,
            totalUnreadCount,
        ]
    );


    // =====================================================
    // FILTERED
    // =====================================================

    const filteredNotifications =
        useMemo(
            () =>
                filterNotifications(
                    safeNotifications,
                    filter
                ),
            [
                safeNotifications,
                filter,
            ]
        );


    // =====================================================
    // PAGINATION
    // =====================================================

    const totalFiltered =
        filteredNotifications.length;


    const totalPages =
        Math.max(
            1,
            Math.ceil(
                totalFiltered /
                perPage
            )
        );


    const startIndex =
        (
            currentPage -
            1
        ) *
        perPage;


    const endIndex =
        startIndex +
        perPage;


    const paginatedNotifications =
        useMemo(
            () => {
                return filteredNotifications
                    .slice(
                        startIndex,
                        endIndex
                    );
            },
            [
                filteredNotifications,
                startIndex,
                endIndex,
            ]
        );


    const startItem =
        totalFiltered ===
        0
            ? 0
            : startIndex + 1;


    const endItem =
        Math.min(
            endIndex,
            totalFiltered
        );


    // =====================================================
    // LOADING STATES
    // =====================================================

    const isInitialLoading =
        loading &&
        safeNotifications.length ===
        0;


    const isSoftLoading =
        loading &&
        safeNotifications.length >
        0;


    // =====================================================
    // RESET PAGE
    // =====================================================

    useEffect(
        () => {
            setCurrentPage(
                1
            );
        },
        [
            filter,
            perPage,
        ]
    );


    // =====================================================
    // PAGE SAFETY
    // =====================================================

    useEffect(
        () => {
            if (
                currentPage >
                totalPages
            ) {
                setCurrentPage(
                    totalPages
                );
            }
        },
        [
            currentPage,
            totalPages,
        ]
    );


    // =====================================================
    // MARK ONE
    // =====================================================

    const markNotificationAsReadAction =
        (
            id
        ) => {
            dispatch(
                markNotificationAsRead(
                    id
                )
            );
        };


    // =====================================================
    // MARK ALL
    // =====================================================

    const markAllAsReadAction =
        () => {
            dispatch(
                markAllNotificationsAsRead()
            );
        };


    // =====================================================
    // PAGE CHANGE
    // =====================================================

    const handlePageChange =
        (
            page
        ) => {
            const nextPage =
                Math.min(
                    Math.max(
                        page,
                        1
                    ),
                    totalPages
                );


            setCurrentPage(
                nextPage
            );


            window.scrollTo({
                top: 0,

                behavior:
                    "smooth",
            });
        };


    // =====================================================
    // PER PAGE
    // =====================================================

    const handlePerPageChange =
        (
            value
        ) => {
            setPerPage(
                value
            );


            setCurrentPage(
                1
            );
        };


    // =====================================================
    // FILTER
    // =====================================================

    const handleFilterChange =
        (
            value
        ) => {
            setFilter(
                value
            );


            setCurrentPage(
                1
            );
        };


    // =====================================================
    // FILTER COUNT
    // =====================================================

    const getFilterCount =
        (
            key
        ) => {
            switch (
                key
            ) {
                case "unread":
                    return unreadCount;

                case "read":
                    return readCount;

                default:
                    return totalCount;
            }
        };


    // =====================================================
    // JSX
    // =====================================================

    return (
        <main
            className="
                relative
                min-h-screen
                overflow-hidden
                bg-[#05070a]
                px-4
                py-10
                text-white
                sm:px-6
                lg:px-8
            "
        >

            {/* =================================================
                BACKGROUND GRID
            ================================================== */}

            <div
                className="
                    pointer-events-none
                    absolute
                    inset-0

                    bg-[linear-gradient(rgba(99,102,241,0.055)_1px,transparent_1px),linear-gradient(90deg,rgba(99,102,241,0.055)_1px,transparent_1px)]

                    bg-[size:48px_48px]

                    [mask-image:radial-gradient(circle_at_top,black_0%,transparent_75%)]
                "
            />


            {/* INDIGO GLOW */}

            <div
                className="
                    pointer-events-none
                    absolute
                    left-1/2
                    top-24

                    h-[420px]
                    w-[420px]

                    -translate-x-1/2

                    rounded-full

                    bg-indigo-600/15

                    blur-[130px]
                "
            />


            {/* AMBER GLOW */}

            <div
                className="
                    pointer-events-none
                    absolute
                    -right-40
                    top-1/3

                    h-[360px]
                    w-[360px]

                    rounded-full

                    bg-amber-500/[0.07]

                    blur-[120px]
                "
            />


            {/* PURPLE GLOW */}

            <div
                className="
                    pointer-events-none
                    absolute
                    -left-40
                    bottom-20

                    h-[360px]
                    w-[360px]

                    rounded-full

                    bg-purple-500/[0.08]

                    blur-[120px]
                "
            />


            {/* =================================================
                CONTENT
            ================================================== */}

            <div
                className="
                    relative
                    z-10

                    mx-auto

                    max-w-5xl
                "
            >

                {/* =================================================
                    HEADER
                ================================================== */}

                <motion.header
                    initial={{
                        opacity: 0,
                        y: -18,
                    }}

                    animate={{
                        opacity: 1,
                        y: 0,
                    }}

                    transition={{
                        duration: 0.45,
                    }}

                    className="
                        mb-8
                        text-center
                    "
                >

                    {/* BADGE */}

                    <div
                        className="
                            mb-5

                            inline-flex
                            items-center
                            gap-2

                            rounded-full

                            border
                            border-indigo-400/20

                            bg-indigo-500/[0.07]

                            px-4
                            py-2

                            font-mono

                            text-[10px]
                            font-bold
                            uppercase
                            tracking-[0.20em]

                            text-indigo-300

                            shadow-lg
                            shadow-indigo-500/[0.05]
                        "
                    >

                        <span
                            className="
                                h-2
                                w-2

                                rounded-full

                                bg-indigo-400

                                shadow-[0_0_12px_rgba(129,140,248,0.9)]
                            "
                        />

                        Notification Center

                    </div>


                    {/* TITLE */}

                    <h1
                        className="
                            text-4xl
                            font-bold
                            tracking-[-0.045em]

                            sm:text-5xl
                            lg:text-6xl
                        "
                    >
                        Bildirishnomalar{" "}

                        <span
                            className="
                                bg-gradient-to-r
                                from-indigo-300
                                via-purple-400
                                to-cyan-300

                                bg-clip-text

                                text-transparent
                            "
                        >
                            Markazi
                        </span>

                    </h1>


                    {/* DESCRIPTION */}

                    <p
                        className="
                            mx-auto
                            mt-4

                            max-w-2xl

                            text-sm
                            font-medium
                            leading-7

                            text-gray-500

                            sm:text-base
                        "
                    >
                        FCoin mukofotlari, problem,
                        post, badge va boshqa muhim
                        xabarlar shu yerda jamlanadi.
                    </p>

                </motion.header>


                {/* =================================================
                    STATS
                ================================================== */}

                <motion.section
                    initial={{
                        opacity: 0,
                        y: 18,
                    }}

                    animate={{
                        opacity: 1,
                        y: 0,
                    }}

                    transition={{
                        delay: 0.12,
                        duration: 0.42,
                    }}

                    className="
                        mb-8

                        grid
                        gap-4

                        md:grid-cols-3
                    "
                >

                    {/* TOTAL */}

                    <div
                        className="
                            relative

                            overflow-hidden

                            rounded-3xl

                            border
                            border-white/[0.06]

                            bg-[#0d121a]/80

                            p-5

                            shadow-2xl
                            shadow-black/20

                            backdrop-blur-xl
                        "
                    >

                        <div
                            className="
                                pointer-events-none
                                absolute
                                -right-8
                                -top-8

                                h-24
                                w-24

                                rounded-full

                                bg-white/[0.025]

                                blur-2xl
                            "
                        />


                        <p
                            className="
                                font-mono

                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[0.16em]

                                text-gray-600
                            "
                        >
                            Jami
                        </p>


                        <h3
                            className="
                                mt-2

                                text-4xl
                                font-bold
                                tracking-tight

                                text-white
                            "
                        >
                            {totalCount}
                        </h3>


                        <p
                            className="
                                mt-1

                                text-xs
                                font-medium

                                text-gray-600
                            "
                        >
                            barcha xabarlar
                        </p>

                    </div>


                    {/* UNREAD */}

                    <div
                        className="
                            relative

                            overflow-hidden

                            rounded-3xl

                            border
                            border-indigo-400/15

                            bg-indigo-500/[0.055]

                            p-5

                            shadow-2xl
                            shadow-black/20

                            backdrop-blur-xl
                        "
                    >

                        <div
                            className="
                                pointer-events-none
                                absolute
                                -right-8
                                -top-8

                                h-24
                                w-24

                                rounded-full

                                bg-indigo-500/15

                                blur-2xl
                            "
                        />


                        <p
                            className="
                                font-mono

                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[0.16em]

                                text-indigo-400
                            "
                        >
                            Yangi
                        </p>


                        <h3
                            className="
                                mt-2

                                text-4xl
                                font-bold
                                tracking-tight

                                text-indigo-200
                            "
                        >
                            {unreadCount}
                        </h3>


                        <p
                            className="
                                mt-1

                                text-xs
                                font-medium

                                text-indigo-400/60
                            "
                        >
                            o‘qilmagan xabarlar
                        </p>

                    </div>


                    {/* READ */}

                    <div
                        className="
                            relative

                            overflow-hidden

                            rounded-3xl

                            border
                            border-emerald-400/15

                            bg-emerald-500/[0.045]

                            p-5

                            shadow-2xl
                            shadow-black/20

                            backdrop-blur-xl
                        "
                    >

                        <div
                            className="
                                pointer-events-none
                                absolute
                                -right-8
                                -top-8

                                h-24
                                w-24

                                rounded-full

                                bg-emerald-500/10

                                blur-2xl
                            "
                        />


                        <p
                            className="
                                font-mono

                                text-[10px]
                                font-bold
                                uppercase
                                tracking-[0.16em]

                                text-emerald-400
                            "
                        >
                            O‘qilgan
                        </p>


                        <h3
                            className="
                                mt-2

                                text-4xl
                                font-bold
                                tracking-tight

                                text-emerald-200
                            "
                        >
                            {readCount}
                        </h3>


                        <p
                            className="
                                mt-1

                                text-xs
                                font-medium

                                text-emerald-400/60
                            "
                        >
                            ko‘rib chiqilgan
                        </p>

                    </div>

                </motion.section>


                {/* =================================================
                    TOOLBAR
                ================================================== */}

                <motion.section
                    initial={{
                        opacity: 0,
                        y: 18,
                    }}

                    animate={{
                        opacity: 1,
                        y: 0,
                    }}

                    transition={{
                        delay: 0.18,
                        duration: 0.42,
                    }}

                    className="
                        mb-8

                        rounded-3xl

                        border
                        border-white/[0.06]

                        bg-[#0d121a]/80

                        p-4

                        shadow-2xl
                        shadow-black/20

                        backdrop-blur-xl
                    "
                >

                    <div
                        className="
                            flex
                            flex-col
                            gap-4

                            lg:flex-row
                            lg:items-center
                            lg:justify-between
                        "
                    >

                        {/* =========================================
                            FILTERS
                        ========================================== */}

                        <div
                            className="
                                grid
                                grid-cols-3
                                gap-1.5

                                rounded-2xl

                                border
                                border-white/[0.06]

                                bg-black/20

                                p-1.5
                            "
                        >

                            {NOTIFICATION_FILTERS.map(
                                (
                                    item
                                ) => {
                                    const isActive =
                                        filter ===
                                        item.key;


                                    const Icon =
                                        item.Icon;


                                    const count =
                                        getFilterCount(
                                            item.key
                                        );


                                    return (
                                        <button
                                            key={
                                                item.key
                                            }

                                            type="button"

                                            onClick={() =>
                                                handleFilterChange(
                                                    item.key
                                                )
                                            }

                                            className={`
                                                flex
                                                items-center
                                                justify-center
                                                gap-1.5

                                                rounded-xl

                                                px-3
                                                py-2.5

                                                text-[11px]
                                                font-bold

                                                transition-all
                                                duration-200

                                                sm:text-xs

                                                ${
                                                    isActive
                                                        ? `
                                                            bg-indigo-600
                                                            text-white
                                                            shadow-lg
                                                            shadow-indigo-600/20
                                                        `
                                                        : `
                                                            text-gray-500
                                                            hover:bg-white/[0.04]
                                                            hover:text-gray-200
                                                        `
                                                }
                                            `}
                                        >

                                            <Icon
                                                size={14}
                                                strokeWidth={2}
                                            />


                                            <span
                                                className="
                                                    hidden
                                                    sm:inline
                                                "
                                            >
                                                {
                                                    item.label
                                                }
                                            </span>


                                            <span
                                                className="
                                                    font-mono
                                                    text-[9px]
                                                    opacity-60
                                                "
                                            >
                                                ({count})
                                            </span>

                                        </button>
                                    );
                                }
                            )}

                        </div>


                        {/* =========================================
                            RIGHT ACTIONS
                        ========================================== */}

                        <div
                            className="
                                flex
                                flex-col
                                gap-2

                                sm:flex-row
                                sm:items-center
                            "
                        >

                            {/* CONNECTION */}

                            <div
                                className={`
                                    inline-flex
                                    items-center
                                    gap-2

                                    rounded-xl

                                    border

                                    px-3
                                    py-2.5

                                    font-mono

                                    text-[9px]
                                    font-bold
                                    uppercase
                                    tracking-[0.08em]

                                    ${
                                        wsConnected
                                            ? `
                                                border-emerald-400/15
                                                bg-emerald-500/[0.055]
                                                text-emerald-300
                                            `
                                            : `
                                                border-red-400/15
                                                bg-red-500/[0.055]
                                                text-red-300
                                            `
                                    }
                                `}
                            >

                                {wsConnected ? (

                                    <Wifi
                                        size={14}
                                        strokeWidth={2}
                                    />

                                ) : (

                                    <WifiOff
                                        size={14}
                                        strokeWidth={2}
                                    />

                                )}


                                {
                                    wsConnected
                                        ? "Real-time faol"
                                        : "Ulanish kutilmoqda"
                                }

                            </div>


                            {/* MARK ALL */}

                            {unreadCount > 0 && (

                                <button
                                    type="button"

                                    onClick={
                                        markAllAsReadAction
                                    }

                                    className="
                                        inline-flex
                                        items-center
                                        justify-center
                                        gap-2

                                        rounded-xl

                                        border
                                        border-purple-400/15

                                        bg-purple-500/[0.055]

                                        px-3
                                        py-2.5

                                        text-[10px]
                                        font-bold

                                        text-purple-300

                                        transition-all
                                        duration-200

                                        hover:border-purple-400/25
                                        hover:bg-purple-500/10
                                        hover:text-purple-200
                                    "
                                >

                                    <CheckCheck
                                        size={15}
                                        strokeWidth={2}
                                    />

                                    Hammasi o‘qildi

                                </button>

                            )}

                        </div>

                    </div>


                    {/* =========================================
                        WEBSOCKET ERROR
                    ========================================== */}

                    {wsError && (

                        <div
                            className="
                                mt-3

                                flex
                                items-start
                                gap-2

                                rounded-xl

                                border
                                border-red-400/15

                                bg-red-500/[0.055]

                                px-4
                                py-3

                                text-xs
                                font-semibold
                                leading-5

                                text-red-300
                            "
                        >

                            <AlertTriangle
                                size={15}
                                strokeWidth={2}
                                className="
                                    mt-0.5
                                    flex-shrink-0
                                "
                            />


                            <span>
                                {String(wsError)}
                            </span>

                        </div>

                    )}

                </motion.section>


                {/* =================================================
                    NOTIFICATIONS
                ================================================== */}

                <motion.section
                    layout

                    className="
                        space-y-4
                    "
                >

                    {isInitialLoading ? (

                        <NotificationLoadingState
                            count={
                                perPage
                            }
                        />

                    ) : (

                        <>

                            {/* =====================================
                                SOFT LOADING
                            ====================================== */}

                            {isSoftLoading && (

                                <div
                                    className="
                                        mb-4

                                        flex
                                        items-center
                                        gap-2

                                        rounded-xl

                                        border
                                        border-indigo-400/15

                                        bg-indigo-500/[0.055]

                                        px-4
                                        py-3

                                        text-xs
                                        font-semibold

                                        text-indigo-300
                                    "
                                >

                                    <Loader2
                                        size={15}
                                        strokeWidth={2}
                                        className="
                                            animate-spin
                                        "
                                    />

                                    Bildirishnomalar
                                    yangilanmoqda...

                                </div>

                            )}


                            {/* =====================================
                                CARDS
                            ====================================== */}

                            <AnimatePresence
                                mode="popLayout"
                            >

                                {paginatedNotifications.length >
                                0 ? (

                                    paginatedNotifications.map(
                                        (
                                            notification
                                        ) => (

                                            <NotificationCard
                                                key={
                                                    notification.id
                                                }

                                                notification={
                                                    notification
                                                }

                                                currentUser={
                                                    currentUser
                                                }

                                                onMarkRead={
                                                    markNotificationAsReadAction
                                                }
                                            />

                                        )
                                    )

                                ) : (

                                    <NotificationEmptyState
                                        key="empty"

                                        filter={
                                            filter
                                        }

                                        onShowAll={() =>
                                            handleFilterChange(
                                                "all"
                                            )
                                        }
                                    />

                                )}

                            </AnimatePresence>


                            {/* =====================================
                                PAGINATION
                            ====================================== */}

                            <NotificationPagination
                                currentPage={
                                    currentPage
                                }

                                totalPages={
                                    totalPages
                                }

                                totalItems={
                                    totalFiltered
                                }

                                perPage={
                                    perPage
                                }

                                startItem={
                                    startItem
                                }

                                endItem={
                                    endItem
                                }

                                onPageChange={
                                    handlePageChange
                                }

                                onPerPageChange={
                                    handlePerPageChange
                                }
                            />

                        </>

                    )}

                </motion.section>

            </div>

        </main>
    );
};


export default NotificationsPage;