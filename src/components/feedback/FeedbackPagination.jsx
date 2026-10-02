import {
    useMemo,
} from "react";
import {
    ChevronLeft,
    ChevronRight,
    Loader2,
    MoreHorizontal,
} from "lucide-react";

// =========================================================
// HELPERS
// =========================================================

const normalizePositiveInteger = (
    value,
    fallback = 1
) => {
    const number =
        Number(value);

    if (
        !Number.isInteger(number)
        ||
        number <= 0
    ) {
        return fallback;
    }

    return number;
};

// =========================================================
// PAGE ITEMS
//
// Example:
//
// 1 2 3 4 5 ... 12
//
// 1 ... 4 5 6 ... 12
//
// 1 ... 8 9 10 11 12
// =========================================================

const getPaginationItems = (
    currentPage,
    totalPages
) => {
    if (
        totalPages <= 7
    ) {
        return Array.from(
            {
                length: totalPages,
            },
            (
                _,
                index
            ) => index + 1
        );
    }

    if (
        currentPage <= 4
    ) {
        return [
            1,
            2,
            3,
            4,
            5,
            "ellipsis-right",
            totalPages,
        ];
    }

    if (
        currentPage >=
        totalPages - 3
    ) {
        return [
            1,
            "ellipsis-left",
            totalPages - 4,
            totalPages - 3,
            totalPages - 2,
            totalPages - 1,
            totalPages,
        ];
    }

    return [
        1,
        "ellipsis-left",
        currentPage - 1,
        currentPage,
        currentPage + 1,
        "ellipsis-right",
        totalPages,
    ];
};

// =========================================================
// PAGE BUTTON
// =========================================================

const PageButton = ({
    page,
    active = false,
    disabled = false,
    onClick,
}) => {
    return (
        <button
            type="button"
            onClick={() => {
                onClick?.(page);
            }}
            disabled={
                disabled
            }
            aria-current={
                active
                    ? "page"
                    : undefined
            }
            aria-label={
                active
                    ? `${page}-sahifa, joriy sahifa`
                    : `${page}-sahifaga o‘tish`
            }
            className={`
                flex
                h-9
                min-w-9
                items-center
                justify-center
                rounded-xl
                border
                px-2.5
                font-display
                text-[10px]
                font-semibold
                transition-all

                disabled:cursor-not-allowed
                disabled:opacity-40

                ${
                    active
                        ? `
                            border-indigo-400/25
                            bg-indigo-500/[0.12]
                            text-indigo-300
                            shadow-lg
                            shadow-indigo-950/20
                        `
                        : `
                            border-white/[0.06]
                            bg-white/[0.025]
                            text-gray-500

                            hover:-translate-y-0.5
                            hover:border-white/[0.10]
                            hover:bg-white/[0.06]
                            hover:text-gray-200

                            active:translate-y-0
                        `
                }
            `}
        >
            {page}
        </button>
    );
};

// =========================================================
// ELLIPSIS
// =========================================================

const PaginationEllipsis = () => {
    return (
        <div
            aria-hidden="true"
            className="
                flex
                h-9
                min-w-8
                items-center
                justify-center
                text-gray-700
            "
        >
            <MoreHorizontal
                size={15}
            />
        </div>
    );
};

// =========================================================
// NAVIGATION BUTTON
// =========================================================

const NavigationButton = ({
    direction,
    disabled,
    isLoading = false,
    onClick,
}) => {
    const isPrevious =
        direction === "previous";

    const Icon =
        isPrevious
            ? ChevronLeft
            : ChevronRight;

    const label =
        isPrevious
            ? "Oldingi sahifa"
            : "Keyingi sahifa";

    return (
        <button
            type="button"
            onClick={
                onClick
            }
            disabled={
                disabled
            }
            aria-label={
                label
            }
            className="
                inline-flex
                h-9
                items-center
                justify-center
                gap-2
                rounded-xl
                border
                border-white/[0.06]
                bg-white/[0.025]
                px-3
                font-display
                text-[10px]
                font-semibold
                text-gray-500
                transition-all

                hover:-translate-y-0.5
                hover:border-indigo-400/15
                hover:bg-indigo-500/[0.06]
                hover:text-indigo-300

                active:translate-y-0

                disabled:cursor-not-allowed
                disabled:opacity-35
            "
        >
            {isLoading ? (
                <Loader2
                    size={14}
                    className="animate-spin"
                />
            ) : (
                <Icon
                    size={14}
                />
            )}

            <span
                className="
                    hidden
                    md:inline
                "
            >
                {label}
            </span>
        </button>
    );
};

// =========================================================
// FEEDBACK PAGINATION
// =========================================================

const FeedbackPagination = ({
    page = 1,
    totalPages = 1,
    count = 0,

    hasPrevious,
    hasNext,

    isLoading = false,

    onPageChange,

    label = "Feedback sahifalari",
}) => {
    // =====================================================
    // NORMALIZED VALUES
    // =====================================================

    const safeTotalPages =
        normalizePositiveInteger(
            totalPages,
            1
        );

    const safePage =
        Math.min(
            normalizePositiveInteger(
                page,
                1
            ),
            safeTotalPages
        );

    const safeCount =
        Math.max(
            0,
            Number(count) || 0
        );

    // =====================================================
    // PAGE ITEMS
    // =====================================================

    const paginationItems =
        useMemo(
            () => {
                return getPaginationItems(
                    safePage,
                    safeTotalPages
                );
            },
            [
                safePage,
                safeTotalPages,
            ]
        );

    // =====================================================
    // PREVIOUS / NEXT
    // =====================================================

    const canGoPrevious =
        typeof hasPrevious ===
        "boolean"
            ? hasPrevious
            : safePage > 1;

    const canGoNext =
        typeof hasNext ===
        "boolean"
            ? hasNext
            : safePage <
                safeTotalPages;

    // =====================================================
    // CHANGE PAGE
    // =====================================================

    const handlePageChange = (
        nextPage
    ) => {
        if (
            isLoading
            ||
            typeof onPageChange !==
                "function"
        ) {
            return;
        }

        const normalizedPage =
            normalizePositiveInteger(
                nextPage,
                safePage
            );

        if (
            normalizedPage ===
                safePage
            ||
            normalizedPage >
                safeTotalPages
        ) {
            return;
        }

        onPageChange(
            normalizedPage
        );
    };

    // =====================================================
    // HIDE WHEN NOT NEEDED
    // =====================================================

    if (
        safeTotalPages <= 1
    ) {
        return null;
    }

    // =====================================================
    // JSX
    // =====================================================

    return (
        <nav
            aria-label={
                label
            }
            className="
                mt-6
                rounded-2xl
                border
                border-white/[0.06]
                bg-white/[0.018]
                p-3
                sm:p-4
            "
        >
            <div
                className="
                    flex
                    flex-col
                    gap-3

                    sm:flex-row
                    sm:items-center
                    sm:justify-between
                "
            >
                {/* =============================
                    INFO
                ============================== */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        gap-4

                        sm:block
                    "
                >
                    <div>
                        <p
                            className="
                                font-display
                                text-[9px]
                                font-semibold
                                uppercase
                                tracking-[0.12em]
                                text-gray-600
                            "
                        >
                            Sahifa
                        </p>

                        <p
                            className="
                                mt-1
                                text-xs
                                font-medium
                                text-gray-400
                            "
                        >
                            <span
                                className="
                                    font-display
                                    font-semibold
                                    text-white
                                "
                            >
                                {safePage}
                            </span>

                            <span
                                className="
                                    mx-1.5
                                    text-gray-700
                                "
                            >
                                /
                            </span>

                            <span>
                                {safeTotalPages}
                            </span>
                        </p>
                    </div>

                    <div
                        className="
                            rounded-xl
                            border
                            border-white/[0.05]
                            bg-white/[0.025]
                            px-3
                            py-1.5

                            sm:mt-2
                            sm:inline-flex
                        "
                    >
                        <span
                            className="
                                font-display
                                text-[9px]
                                font-semibold
                                uppercase
                                tracking-[0.08em]
                                text-gray-600
                            "
                        >
                            Jami{" "}

                            <span
                                className="
                                    text-gray-400
                                "
                            >
                                {safeCount}
                            </span>
                        </span>
                    </div>
                </div>

                {/* =============================
                    MOBILE CONTROLS
                ============================== */}

                <div
                    className="
                        flex
                        items-center
                        justify-between
                        gap-2

                        sm:hidden
                    "
                >
                    <NavigationButton
                        direction="previous"
                        disabled={
                            isLoading
                            ||
                            !canGoPrevious
                        }
                        isLoading={
                            false
                        }
                        onClick={() => {
                            handlePageChange(
                                safePage - 1
                            );
                        }}
                    />

                    <div
                        className="
                            flex
                            min-w-24
                            items-center
                            justify-center
                            rounded-xl
                            border
                            border-indigo-400/10
                            bg-indigo-500/[0.05]
                            px-3
                            py-2
                            font-display
                            text-[10px]
                            font-semibold
                            text-indigo-300
                        "
                    >
                        {isLoading ? (
                            <Loader2
                                size={14}
                                className="
                                    animate-spin
                                "
                            />
                        ) : (
                            <>
                                {safePage}

                                <span
                                    className="
                                        mx-1.5
                                        text-gray-700
                                    "
                                >
                                    /
                                </span>

                                {
                                    safeTotalPages
                                }
                            </>
                        )}
                    </div>

                    <NavigationButton
                        direction="next"
                        disabled={
                            isLoading
                            ||
                            !canGoNext
                        }
                        isLoading={
                            false
                        }
                        onClick={() => {
                            handlePageChange(
                                safePage + 1
                            );
                        }}
                    />
                </div>

                {/* =============================
                    DESKTOP CONTROLS
                ============================== */}

                <div
                    className="
                        hidden
                        items-center
                        gap-2

                        sm:flex
                    "
                >
                    <NavigationButton
                        direction="previous"
                        disabled={
                            isLoading
                            ||
                            !canGoPrevious
                        }
                        onClick={() => {
                            handlePageChange(
                                safePage - 1
                            );
                        }}
                    />

                    <div
                        className="
                            flex
                            items-center
                            gap-1.5
                        "
                    >
                        {paginationItems.map(
                            (
                                item
                            ) => {
                                if (
                                    typeof item ===
                                    "string"
                                ) {
                                    return (
                                        <PaginationEllipsis
                                            key={
                                                item
                                            }
                                        />
                                    );
                                }

                                return (
                                    <PageButton
                                        key={
                                            item
                                        }
                                        page={
                                            item
                                        }
                                        active={
                                            item ===
                                            safePage
                                        }
                                        disabled={
                                            isLoading
                                        }
                                        onClick={
                                            handlePageChange
                                        }
                                    />
                                );
                            }
                        )}
                    </div>

                    <NavigationButton
                        direction="next"
                        disabled={
                            isLoading
                            ||
                            !canGoNext
                        }
                        onClick={() => {
                            handlePageChange(
                                safePage + 1
                            );
                        }}
                    />
                </div>
            </div>

            {/* =============================
                LOADING BAR
            ============================== */}

            <div
                className="
                    mt-3
                    h-px
                    overflow-hidden
                    rounded-full
                    bg-white/[0.04]
                "
            >
                <div
                    className={`
                        h-full
                        bg-gradient-to-r
                        from-indigo-500
                        via-cyan-400
                        to-indigo-500
                        transition-all
                        duration-300

                        ${
                            isLoading
                                ? `
                                    w-full
                                    animate-pulse
                                    opacity-80
                                `
                                : `
                                    w-0
                                    opacity-0
                                `
                        }
                    `}
                />
            </div>
        </nav>
    );
};

export default FeedbackPagination;