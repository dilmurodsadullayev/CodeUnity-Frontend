// src/components/fcoin-history/FCoinHistoryPagination.jsx

import React from "react";

import {
    motion,
} from "framer-motion";

import {
    ChevronLeft,
    ChevronRight,
    MoreHorizontal,
} from "lucide-react";


// =========================================================
// PAGE BUTTON
// =========================================================

const PageButton = ({
    page,
    currentPage,

    disabled = false,

    onClick,
}) => {
    const isActive =
        Number(
            page
        )
        ===
        Number(
            currentPage
        );


    const handleClick = () => {
        if (
            disabled
            ||
            isActive
            ||
            typeof onClick !==
                "function"
        ) {
            return;
        }


        onClick(
            page
        );
    };


    return (
        <motion.button
            type="button"
            whileHover={
                disabled
                ||
                isActive
                    ? undefined
                    : {
                        y: -2,
                    }
            }
            whileTap={
                disabled
                ||
                isActive
                    ? undefined
                    : {
                        scale: 0.96,
                    }
            }
            onClick={
                handleClick
            }
            disabled={
                disabled
            }
            aria-current={
                isActive
                    ? "page"
                    : undefined
            }
            aria-label={
                `${page}-sahifa`
            }
            className={`
                flex
                h-10
                min-w-10

                items-center
                justify-center

                rounded-xl

                border

                px-3

                font-mono

                text-xs
                font-black

                transition-all
                duration-200

                ${
                    isActive
                        ? (
                            "border-indigo-400/30 "
                            +
                            "bg-indigo-500/15 "
                            +
                            "text-indigo-200 "
                            +
                            "shadow-[0_0_24px_rgba(99,102,241,0.10)]"
                        )
                        : (
                            "border-white/[0.06] "
                            +
                            "bg-white/[0.025] "
                            +
                            "text-gray-500 "
                            +
                            "hover:border-white/[0.12] "
                            +
                            "hover:bg-white/[0.05] "
                            +
                            "hover:text-white"
                        )
                }

                disabled:cursor-not-allowed
                disabled:opacity-40
            `}
        >
            {
                page
            }
        </motion.button>
    );
};


// =========================================================
// ELLIPSIS
// =========================================================

const Ellipsis = () => {
    return (
        <div
            aria-hidden="true"
            className="
                flex
                h-10
                w-8

                items-center
                justify-center

                text-gray-700
            "
        >
            <MoreHorizontal
                size={17}
            />
        </div>
    );
};


// =========================================================
// NAV BUTTON
// =========================================================

const NavigationButton = ({
    direction,

    disabled = false,

    onClick,
}) => {
    const isPrevious =
        direction ===
        "previous";


    const Icon =
        isPrevious
            ? ChevronLeft
            : ChevronRight;


    const label =
        isPrevious
            ? "Oldingi"
            : "Keyingi";


    return (
        <motion.button
            type="button"
            whileHover={
                disabled
                    ? undefined
                    : {
                        y: -2,
                    }
            }
            whileTap={
                disabled
                    ? undefined
                    : {
                        scale: 0.97,
                    }
            }
            onClick={
                onClick
            }
            disabled={
                disabled
            }
            className="
                inline-flex
                h-10

                items-center
                justify-center

                gap-1.5

                rounded-xl

                border
                border-white/[0.07]

                bg-white/[0.025]

                px-3

                text-xs
                font-black

                text-gray-400

                transition-all
                duration-200

                hover:border-indigo-400/20
                hover:bg-indigo-500/[0.07]
                hover:text-indigo-200

                active:scale-[0.98]

                disabled:cursor-not-allowed
                disabled:opacity-35

                sm:px-4
            "
        >
            {
                isPrevious
                &&
                (
                    <Icon
                        size={15}
                    />
                )
            }


            <span
                className="
                    hidden
                    sm:inline
                "
            >
                {
                    label
                }
            </span>


            {
                !isPrevious
                &&
                (
                    <Icon
                        size={15}
                    />
                )
            }
        </motion.button>
    );
};


// =========================================================
// PAGINATION
// =========================================================

const FCoinHistoryPagination = ({
    currentPage = 1,

    totalPages = 0,

    paginationPages = [],

    canGoPrevious = false,
    canGoNext = false,

    isLoading = false,

    onPageChange,
    onPrevious,
    onNext,
}) => {
    const safeCurrentPage =
        Math.max(
            1,
            Number(
                currentPage
            )
            ||
            1
        );


    const safeTotalPages =
        Math.max(
            0,
            Number(
                totalPages
            )
            ||
            0
        );


    const pages =
        Array.isArray(
            paginationPages
        )
            ? paginationPages
            : [];


    // =====================================================
    // NO PAGINATION
    // =====================================================

    if (
        safeTotalPages <= 1
    ) {
        return null;
    }


    return (
        <nav
            aria-label="FCoin pagination"
            className="
                mt-6

                rounded-[24px]

                border
                border-white/[0.06]

                bg-[#0d1117]/80

                p-3

                shadow-[0_15px_50px_rgba(0,0,0,0.22)]

                backdrop-blur-xl
            "
        >
            <div
                className="
                    flex
                    items-center
                    justify-between

                    gap-3
                "
            >
                {/* =========================================
                    PREVIOUS
                ========================================== */}

                <NavigationButton
                    direction="previous"
                    disabled={
                        !canGoPrevious
                        ||
                        isLoading
                    }
                    onClick={
                        onPrevious
                    }
                />


                {/* =========================================
                    DESKTOP PAGE NUMBERS
                ========================================== */}

                <div
                    className="
                        hidden
                        items-center

                        gap-1.5

                        md:flex
                    "
                >
                    {
                        pages.map(
                            (
                                page,
                                index
                            ) => {
                                if (
                                    typeof page ===
                                    "string"
                                ) {
                                    return (
                                        <Ellipsis
                                            key={
                                                `${page}-${index}`
                                            }
                                        />
                                    );
                                }


                                return (
                                    <PageButton
                                        key={
                                            page
                                        }
                                        page={
                                            page
                                        }
                                        currentPage={
                                            safeCurrentPage
                                        }
                                        disabled={
                                            isLoading
                                        }
                                        onClick={
                                            onPageChange
                                        }
                                    />
                                );
                            }
                        )
                    }
                </div>


                {/* =========================================
                    MOBILE CURRENT PAGE
                ========================================== */}

                <div
                    className="
                        flex
                        min-w-0
                        flex-1

                        items-center
                        justify-center

                        md:hidden
                    "
                >
                    <div
                        className="
                            rounded-xl

                            border
                            border-indigo-400/[0.15]

                            bg-indigo-500/[0.06]

                            px-4
                            py-2

                            text-center
                        "
                    >
                        <p
                            className="
                                font-mono

                                text-[8px]
                                font-black

                                uppercase

                                tracking-[0.14em]

                                text-gray-600
                            "
                        >
                            Page
                        </p>


                        <p
                            className="
                                mt-0.5

                                text-xs
                                font-black

                                text-indigo-200
                            "
                        >
                            {
                                safeCurrentPage
                            }

                            {" / "}

                            {
                                safeTotalPages
                            }
                        </p>
                    </div>
                </div>


                {/* =========================================
                    NEXT
                ========================================== */}

                <NavigationButton
                    direction="next"
                    disabled={
                        !canGoNext
                        ||
                        isLoading
                    }
                    onClick={
                        onNext
                    }
                />
            </div>


            {/* =============================================
                MOBILE PROGRESS BAR
            ============================================== */}

            <div
                className="
                    mt-3

                    h-1

                    overflow-hidden

                    rounded-full

                    bg-white/[0.03]

                    md:hidden
                "
            >
                <motion.div
                    animate={{
                        width:
                            `${
                                (
                                    safeCurrentPage
                                    /
                                    safeTotalPages
                                )
                                *
                                100
                            }%`,
                    }}
                    transition={{
                        duration:
                            0.25,

                        ease:
                            "easeOut",
                    }}
                    className="
                        h-full

                        rounded-full

                        bg-gradient-to-r
                        from-indigo-500
                        to-cyan-400
                    "
                />
            </div>
        </nav>
    );
};


// =========================================================
// EXPORT
// =========================================================

export default React.memo(
    FCoinHistoryPagination
);