import React, {
    useCallback,
    useEffect,
    useMemo,
    useState,
} from "react";

import {
    useDispatch,
    useSelector,
} from "react-redux";

import {
    AnimatePresence,
    motion,
} from "framer-motion";

import {
    AlertTriangle,
    ChevronDown,
    History,
    Newspaper,
    RefreshCw,
} from "lucide-react";

import UpdateService from "../services/updates";

import {
    getUpdatesFailure,
    getUpdatesStart,
    getUpdatesSuccess,
    toggleUpdateLikeFailure,
    toggleUpdateLikeStart,
    toggleUpdateLikeSuccess,
} from "../features/updates/Updates";

import SiteUpdateCard from "./siteUpdates/SiteUpdateCard";


// =========================================================
// LOADING SKELETON
// =========================================================

const UpdatesSkeleton = () => {
    return (
        <div
            className="
                animate-pulse
                rounded-3xl
                border
                border-white/[0.06]
                bg-white/[0.02]
                p-5
                sm:p-6
            "
        >
            <div
                className="
                    flex
                    items-center
                    gap-4
                "
            >
                <div
                    className="
                        h-12
                        w-12
                        rounded-2xl
                        bg-white/[0.06]
                    "
                />

                <div
                    className="
                        min-w-0
                        flex-1
                    "
                >
                    <div
                        className="
                            h-3
                            w-28
                            rounded-full
                            bg-white/[0.06]
                        "
                    />

                    <div
                        className="
                            mt-3
                            h-5
                            w-2/3
                            rounded-lg
                            bg-white/[0.06]
                        "
                    />
                </div>
            </div>

            <div
                className="
                    mt-5
                    h-12
                    rounded-xl
                    bg-white/[0.035]
                "
            />
        </div>
    );
};


// =========================================================
// SITE UPDATES
// =========================================================

const SiteUpdates = () => {
    const dispatch =
        useDispatch();

    // =====================================================
    // LOCAL STATE
    // =====================================================

    const [
        dropdownOpen,
        setDropdownOpen,
    ] = useState(false);

    const [
        openedUpdateId,
        setOpenedUpdateId,
    ] = useState(null);

    // =====================================================
    // AUTH
    // =====================================================

    const {
        isLoggedIn,
    } = useSelector(
        (state) =>
            state.auth
    );

    // =====================================================
    // UPDATES REDUX
    // =====================================================

    const {
        updates = [],
        count = 0,
        isLoading = false,
        error = null,
        likingUpdateIds = [],
        likeError = null,
    } = useSelector(
        (state) =>
            state.updates ||
            {}
    );

    // =====================================================
    // SAFE DATA
    // =====================================================

    const safeUpdates =
        useMemo(
            () =>
                Array.isArray(
                    updates
                )
                    ? updates
                    : [],
            [
                updates,
            ]
        );

    const featuredUpdate =
        safeUpdates[0] ||
        null;

    const dropdownUpdates =
        safeUpdates.slice(
            1
        );

    // =====================================================
    // FETCH
    // =====================================================

    const fetchUpdates =
        useCallback(
            async () => {
                dispatch(
                    getUpdatesStart()
                );

                try {
                    const response =
                        await UpdateService
                            .getUpdates(
                                5
                            );

                    dispatch(
                        getUpdatesSuccess(
                            response
                        )
                    );
                } catch (
                    fetchError
                ) {
                    const message =
                        fetchError
                            ?.response
                            ?.data
                            ?.detail ||

                        fetchError
                            ?.response
                            ?.data
                            ?.error ||

                        fetchError
                            ?.message ||

                        (
                            "Saytdagi yangiliklarni "
                            + "yuklab bo‘lmadi."
                        );

                    dispatch(
                        getUpdatesFailure(
                            message
                        )
                    );
                }
            },
            [
                dispatch,
            ]
        );

    // =====================================================
    // INITIAL LOAD
    // =====================================================

    useEffect(
        () => {
            fetchUpdates();
        },
        [
            fetchUpdates,
        ]
    );

    // =====================================================
    // LIKE
    // =====================================================

    const handleLike =
        async (
            updateId
        ) => {
            if (
                !isLoggedIn
            ) {
                dispatch(
                    toggleUpdateLikeFailure({
                        id:
                            updateId,

                        error:
                            (
                                "Like bosish uchun "
                                + "tizimga kirishingiz kerak."
                            ),
                    })
                );

                return;
            }

            if (
                likingUpdateIds.includes(
                    updateId
                )
            ) {
                return;
            }

            dispatch(
                toggleUpdateLikeStart(
                    updateId
                )
            );

            try {
                const response =
                    await UpdateService
                        .toggleLike(
                            updateId
                        );

                dispatch(
                    toggleUpdateLikeSuccess(
                        response
                    )
                );
            } catch (
                requestError
            ) {
                const message =
                    requestError
                        ?.response
                        ?.data
                        ?.detail ||

                    requestError
                        ?.response
                        ?.data
                        ?.error ||

                    requestError
                        ?.message ||

                    (
                        "Like yuborishda "
                        + "xatolik yuz berdi."
                    );

                dispatch(
                    toggleUpdateLikeFailure({
                        id:
                            updateId,

                        error:
                            message,
                    })
                );
            }
        };

    // =====================================================
    // ACCORDION
    // =====================================================

    const toggleUpdate =
        (
            updateId
        ) => {
            setOpenedUpdateId(
                (
                    current
                ) =>
                    current ===
                    updateId
                        ? null
                        : updateId
            );
        };

    // =====================================================
    // DROPDOWN
    // =====================================================

    const toggleDropdown =
        () => {
            setDropdownOpen(
                (
                    current
                ) => {
                    const next =
                        !current;

                    if (!next) {
                        setOpenedUpdateId(
                            null
                        );
                    }

                    return next;
                }
            );
        };

    // =====================================================
    // JSX
    // =====================================================

    return (
        <section
            className="
                relative
                overflow-hidden
                border-y
                border-white/[0.05]
                bg-[#090d14]
                px-4
                py-16
                sm:px-6
                lg:py-20
            "
        >
            {/* =============================================
                GRID BACKGROUND
            ============================================== */}

            <div
                className="
                    pointer-events-none
                    absolute
                    inset-0
                    opacity-[0.02]
                    [background-image:linear-gradient(rgba(255,255,255,0.35)_1px,transparent_1px),linear-gradient(90deg,rgba(255,255,255,0.35)_1px,transparent_1px)]
                    [background-size:34px_34px]
                "
            />

            {/* =============================================
                BACKGROUND GLOW
            ============================================== */}

            <div
                className="
                    pointer-events-none
                    absolute
                    left-1/2
                    top-0
                    h-[300px]
                    w-[600px]
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    bg-indigo-500/[0.07]
                    blur-[110px]
                "
            />

            <div
                className="
                    relative
                    z-10
                    mx-auto
                    w-full
                    max-w-6xl
                "
            >
                {/* =========================================
                    HEADER
                ========================================== */}

                <div
                    className="
                        flex
                        flex-col
                        gap-5
                        lg:flex-row
                        lg:items-end
                        lg:justify-between
                    "
                >
                    <div
                        className="
                            max-w-2xl
                        "
                    >
                        <div
                            className="
                                inline-flex
                                items-center
                                gap-2
                                rounded-full
                                border
                                border-indigo-400/20
                                bg-indigo-400/[0.06]
                                px-3
                                py-1.5
                                font-mono
                                text-[9px]
                                font-bold
                                uppercase
                                tracking-[0.18em]
                                text-indigo-300
                            "
                        >
                            <History
                                size={13}
                                strokeWidth={2}
                            />

                            fsociety://changelog
                        </div>

                        <h2
                            className="
                                mt-4
                                text-3xl
                                font-black
                                tracking-tight
                                text-white
                                sm:text-4xl
                            "
                        >
                            Saytda{" "}

                            <span
                                className="
                                    bg-gradient-to-r
                                    from-cyan-300
                                    via-indigo-300
                                    to-fuchsia-300
                                    bg-clip-text
                                    text-transparent
                                "
                            >
                                nimalar o‘zgardi?
                            </span>
                        </h2>

                        <p
                            className="
                                mt-3
                                max-w-xl
                                text-sm
                                leading-6
                                text-gray-500
                            "
                        >
                            Yangi imkoniyatlar,
                            tuzatilgan xatolar,
                            xavfsizlik yangilanishlari
                            va platformadagi muhim
                            o‘zgarishlar.
                        </p>
                    </div>

                    {/* =====================================
                        STATUS
                    ====================================== */}

                    <div
                        className="
                            flex
                            w-fit
                            items-center
                            gap-3
                            rounded-2xl
                            border
                            border-emerald-400/10
                            bg-emerald-400/[0.03]
                            px-4
                            py-3
                        "
                    >
                        <span
                            className="
                                relative
                                flex
                                h-2
                                w-2
                            "
                        >
                            <span
                                className="
                                    absolute
                                    inline-flex
                                    h-full
                                    w-full
                                    animate-ping
                                    rounded-full
                                    bg-emerald-400
                                    opacity-50
                                "
                            />

                            <span
                                className="
                                    relative
                                    inline-flex
                                    h-2
                                    w-2
                                    rounded-full
                                    bg-emerald-400
                                "
                            />
                        </span>

                        <div>
                            <p
                                className="
                                    font-mono
                                    text-[8px]
                                    font-bold
                                    uppercase
                                    tracking-[0.15em]
                                    text-emerald-300
                                "
                            >
                                System status
                            </p>

                            <p
                                className="
                                    mt-0.5
                                    text-[10px]
                                    text-gray-600
                                "
                            >
                                Changelog live
                            </p>
                        </div>
                    </div>
                </div>

                {/* =========================================
                    LIKE ERROR
                ========================================== */}

                <AnimatePresence>
                    {likeError && (
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
                            className="
                                mt-5
                                flex
                                items-center
                                gap-2
                                rounded-xl
                                border
                                border-red-400/15
                                bg-red-500/[0.055]
                                px-4
                                py-3
                                text-xs
                                font-semibold
                                text-red-300
                            "
                        >
                            <AlertTriangle
                                size={14}
                                strokeWidth={2}
                            />

                            {
                                likeError
                            }
                        </motion.div>
                    )}
                </AnimatePresence>

                {/* =========================================
                    CONTENT
                ========================================== */}

                <div
                    className="
                        mt-9
                    "
                >
                    {isLoading ? (
                        <UpdatesSkeleton />
                    ) : error ? (
                        <div
                            className="
                                rounded-3xl
                                border
                                border-red-400/15
                                bg-red-500/[0.045]
                                p-8
                                text-center
                            "
                        >
                            <AlertTriangle
                                size={24}
                                className="
                                    mx-auto
                                    text-red-300
                                "
                            />

                            <h3
                                className="
                                    mt-4
                                    font-bold
                                    text-white
                                "
                            >
                                Yangiliklar yuklanmadi
                            </h3>

                            <p
                                className="
                                    mt-2
                                    text-sm
                                    text-gray-500
                                "
                            >
                                {
                                    error
                                }
                            </p>

                            <button
                                type="button"
                                onClick={
                                    fetchUpdates
                                }
                                className="
                                    mt-5
                                    inline-flex
                                    cursor-pointer
                                    items-center
                                    gap-2
                                    rounded-xl
                                    border
                                    border-red-400/20
                                    bg-red-500/[0.07]
                                    px-4
                                    py-2.5
                                    text-xs
                                    font-bold
                                    text-red-300
                                    transition-all
                                    duration-200
                                    hover:bg-red-500/[0.12]
                                "
                            >
                                <RefreshCw
                                    size={14}
                                />

                                Qayta urinish
                            </button>
                        </div>
                    ) : featuredUpdate ? (
                        <>
                            {/* =============================
                                FEATURED / LATEST CARD
                            ============================== */}

                            <SiteUpdateCard
                                variant="featured"
                                update={
                                    featuredUpdate
                                }
                                likeLoading={
                                    likingUpdateIds
                                        .includes(
                                            featuredUpdate.id
                                        )
                                }
                                onLike={
                                    handleLike
                                }
                            />

                            {/* =============================
                                DROPDOWN
                            ============================== */}

                            {dropdownUpdates.length > 0 && (
                                <div
                                    className="
                                        mt-4
                                        overflow-hidden
                                        rounded-2xl
                                        border
                                        border-white/[0.06]
                                        bg-[#0c1118]
                                    "
                                >
                                    <button
                                        type="button"
                                        onClick={
                                            toggleDropdown
                                        }
                                        className="
                                            group/dropdown
                                            flex
                                            w-full
                                            cursor-pointer
                                            items-center
                                            justify-between
                                            gap-4
                                            px-5
                                            py-4
                                            text-left
                                            transition-all
                                            duration-200
                                            hover:bg-white/[0.02]
                                        "
                                    >
                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-3
                                            "
                                        >
                                            <Newspaper
                                                size={17}
                                                strokeWidth={2}
                                                className="
                                                    text-indigo-300
                                                "
                                            />

                                            <div>
                                                <p
                                                    className="
                                                        text-[13px]
                                                        font-bold
                                                        text-gray-300
                                                    "
                                                >
                                                    Oxirgi yangiliklar
                                                </p>

                                                <p
                                                    className="
                                                        mt-0.5
                                                        text-[9px]
                                                        font-medium
                                                        uppercase
                                                        tracking-[0.12em]
                                                        text-gray-700
                                                    "
                                                >
                                                    Jami{" "}
                                                    {
                                                        count
                                                    }{" "}
                                                    ta update
                                                </p>
                                            </div>
                                        </div>

                                        <div
                                            className="
                                                flex
                                                items-center
                                                gap-3
                                            "
                                        >
                                            <span
                                                className="
                                                    hidden
                                                    text-[10px]
                                                    font-medium
                                                    text-gray-600
                                                    sm:block
                                                "
                                            >
                                                {
                                                    dropdownOpen
                                                        ? "Yopish"
                                                        : "Ko‘rsatish"
                                                }
                                            </span>

                                            <div
                                                className="
                                                    grid
                                                    h-8
                                                    w-8
                                                    place-items-center
                                                    rounded-lg
                                                    border
                                                    border-white/[0.06]
                                                    bg-white/[0.025]
                                                "
                                            >
                                                <ChevronDown
                                                    size={16}
                                                    className={`
                                                        text-gray-500
                                                        transition-transform
                                                        duration-300
                                                        ${dropdownOpen
                                                            ? "rotate-180 text-indigo-300"
                                                            : ""
                                                        }
                                                    `}
                                                />
                                            </div>
                                        </div>
                                    </button>

                                    {/* =========================
                                        DROPDOWN BODY
                                    ========================== */}

                                    <AnimatePresence
                                        initial={false}
                                    >
                                        {dropdownOpen && (
                                            <motion.div
                                                initial={{
                                                    height: 0,
                                                    opacity: 0,
                                                }}
                                                animate={{
                                                    height: "auto",
                                                    opacity: 1,
                                                }}
                                                exit={{
                                                    height: 0,
                                                    opacity: 0,
                                                }}
                                                transition={{
                                                    duration: 0.3,
                                                    ease: [
                                                        0.16,
                                                        1,
                                                        0.3,
                                                        1,
                                                    ],
                                                }}
                                                className="
                                                    overflow-hidden
                                                "
                                            >
                                                <div
                                                    className="
                                                        border-t
                                                        border-white/[0.05]
                                                    "
                                                >
                                                    {dropdownUpdates.map(
                                                        (
                                                            update
                                                        ) => (
                                                            <SiteUpdateCard
                                                                key={
                                                                    update.id
                                                                }
                                                                variant="compact"
                                                                update={
                                                                    update
                                                                }
                                                                opened={
                                                                    openedUpdateId ===
                                                                    update.id
                                                                }
                                                                onToggle={() =>
                                                                    toggleUpdate(
                                                                        update.id
                                                                    )
                                                                }
                                                                likeLoading={
                                                                    likingUpdateIds
                                                                        .includes(
                                                                            update.id
                                                                        )
                                                                }
                                                                onLike={
                                                                    handleLike
                                                                }
                                                            />
                                                        )
                                                    )}
                                                </div>
                                            </motion.div>
                                        )}
                                    </AnimatePresence>
                                </div>
                            )}

                            {/* =============================
                                TOTAL INFO
                            ============================== */}

                            {count >
                                safeUpdates.length && (
                                <div
                                    className="
                                        mt-4
                                        flex
                                        flex-wrap
                                        items-center
                                        justify-center
                                        gap-1.5
                                        text-center
                                        text-[10px]
                                        font-medium
                                        text-gray-700
                                    "
                                >
                                    <History
                                        size={12}
                                    />

                                    <span>
                                        Homepage’da oxirgi{" "}
                                        {
                                            safeUpdates.length
                                        }{" "}
                                        ta yangilik ko‘rsatildi.
                                    </span>

                                    <span>
                                        Jami{" "}
                                        {
                                            count
                                        }{" "}
                                        ta mavjud.
                                    </span>
                                </div>
                            )}
                        </>
                    ) : (
                        <div
                            className="
                                rounded-3xl
                                border
                                border-dashed
                                border-white/[0.08]
                                bg-white/[0.02]
                                p-9
                                text-center
                            "
                        >
                            <Newspaper
                                size={24}
                                className="
                                    mx-auto
                                    text-indigo-300
                                "
                            />

                            <h3
                                className="
                                    mt-4
                                    text-lg
                                    font-black
                                    text-white
                                "
                            >
                                Hozircha yangilik yo‘q
                            </h3>

                            <p
                                className="
                                    mt-2
                                    text-sm
                                    text-gray-500
                                "
                            >
                                Admin paneldan
                                changelog qo‘shilganda
                                shu yerda avtomatik
                                ko‘rinadi.
                            </p>
                        </div>
                    )}
                </div>
            </div>
        </section>
    );
};


export default SiteUpdates;
