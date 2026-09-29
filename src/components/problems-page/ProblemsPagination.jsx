// src/components/problems-page/ProblemsPagination.jsx

import React, {
    useMemo,
} from "react";

import {
    ChevronLeft,
    ChevronRight,
} from "lucide-react";


// =========================================================
// CONFIG
// =========================================================

const DOTS =
    "dots";


// =========================================================
// POSITIVE INTEGER
// =========================================================

const getPositiveInteger = (
    value,
    fallback = 1
) => {

    const parsed =
        Number.parseInt(
            String(
                value ?? ""
            ),
            10
        );


    if (
        !Number.isInteger(
            parsed
        )
        ||
        parsed < 1
    ) {
        return fallback;
    }


    return parsed;
};


// =========================================================
// RANGE
// =========================================================

const createRange = (
    start,
    end
) => {

    if (
        end < start
    ) {
        return [];
    }


    return Array.from(
        {
            length:
                end - start + 1,
        },
        (
            _,
            index
        ) =>
            start + index
    );
};


// =========================================================
// BUILD PAGINATION ITEMS
//
// Misollar:
//
// totalPages = 5
// 1 2 3 4 5
//
// totalPages = 20, current = 1
// 1 2 3 4 5 ... 20
//
// totalPages = 20, current = 10
// 1 ... 9 10 11 ... 20
//
// totalPages = 20, current = 20
// 1 ... 16 17 18 19 20
//
// Muhim:
// totalPages 10 000 bo‘lsa ham
// 10 000 ta element yaratmaymiz.
// =========================================================

const buildPaginationItems = (
    currentPage,
    totalPages
) => {

    // =====================================================
    // NOTHING
    // =====================================================

    if (
        totalPages <= 1
    ) {
        return [];
    }


    // =====================================================
    // SMALL LIST
    //
    // 1 2 3 4 5 6 7
    // =====================================================

    if (
        totalPages <= 7
    ) {

        return createRange(
            1,
            totalPages
        );
    }


    // =====================================================
    // START
    //
    // current: 1, 2, 3, 4
    //
    // 1 2 3 4 5 ... 20
    // =====================================================

    if (
        currentPage <= 4
    ) {

        return [
            ...createRange(
                1,
                5
            ),

            DOTS,

            totalPages,
        ];
    }


    // =====================================================
    // END
    //
    // current: 17, 18, 19, 20
    //
    // 1 ... 16 17 18 19 20
    // =====================================================

    if (
        currentPage >=
        totalPages - 3
    ) {

        return [
            1,

            DOTS,

            ...createRange(
                totalPages - 4,
                totalPages
            ),
        ];
    }


    // =====================================================
    // MIDDLE
    //
    // current: 10
    //
    // 1 ... 9 10 11 ... 20
    // =====================================================

    return [
        1,

        DOTS,

        currentPage - 1,
        currentPage,
        currentPage + 1,

        DOTS,

        totalPages,
    ];
};


// =========================================================
// PROBLEMS PAGINATION
// =========================================================

const ProblemsPagination = ({
    currentPage = 1,
    totalPages = 1,
    count = 0,

    onPageChange,

    disabled = false,
}) => {

    // =====================================================
    // SAFE TOTAL PAGES
    // =====================================================

    const safeTotalPages =
        getPositiveInteger(
            totalPages,
            1
        );


    // =====================================================
    // SAFE CURRENT PAGE
    // =====================================================

    const requestedPage =
        getPositiveInteger(
            currentPage,
            1
        );


    const safeCurrentPage =
        Math.min(
            requestedPage,
            safeTotalPages
        );


    // =====================================================
    // SAFE COUNT
    // =====================================================

    const safeCount =
        Math.max(
            0,
            Number(
                count
            )
            ||
            0
        );


    // =====================================================
    // ITEMS
    // =====================================================

    const items =
        useMemo(
            () => {

                return buildPaginationItems(
                    safeCurrentPage,
                    safeTotalPages
                );

            },
            [
                safeCurrentPage,
                safeTotalPages,
            ]
        );


    // =====================================================
    // PAGE CHANGE
    // =====================================================

    const handlePageChange =
        (
            page
        ) => {

            if (
                disabled
            ) {
                return;
            }


            const targetPage =
                getPositiveInteger(
                    page,
                    safeCurrentPage
                );


            if (
                targetPage < 1
                ||
                targetPage >
                    safeTotalPages
                ||
                targetPage ===
                    safeCurrentPage
            ) {
                return;
            }


            onPageChange?.(
                targetPage
            );
        };


    // =====================================================
    // NO RECORDS
    // =====================================================

    if (
        safeCount <= 0
    ) {
        return null;
    }


    // =====================================================
    // JSX
    // =====================================================

    return (

        <div>

            {/* =============================================
                PAGINATION
            ============================================== */}

            {safeTotalPages > 1 && (

                <nav
                    aria-label="Muammolar sahifalari"

                    className="
                        mt-14

                        flex
                        flex-wrap
                        items-center
                        justify-center
                        gap-2
                    "
                >

                    {/* =====================================
                        PREVIOUS
                    ====================================== */}

                    <button
                        type="button"

                        onClick={() => {

                            handlePageChange(
                                safeCurrentPage - 1
                            );
                        }}

                        disabled={
                            disabled
                            ||
                            safeCurrentPage <= 1
                        }

                        aria-label="Oldingi sahifa"

                        className="
                            grid
                            h-10
                            w-10
                            place-items-center

                            rounded-xl

                            border
                            border-white/[0.08]

                            bg-[#0b1018]

                            text-gray-400

                            transition-all
                            duration-200

                            hover:border-cyan-400/20
                            hover:bg-cyan-500/[0.04]
                            hover:text-cyan-300

                            active:scale-[0.95]

                            disabled:cursor-not-allowed
                            disabled:opacity-30
                        "
                    >

                        <ChevronLeft
                            size={17}
                        />

                    </button>


                    {/* =====================================
                        ITEMS
                    ====================================== */}

                    {items.map(
                        (
                            item,
                            index
                        ) => {

                            // =================================
                            // DOTS
                            // =================================

                            if (
                                item === DOTS
                            ) {

                                return (

                                    <span
                                        key={
                                            `pagination-dots-${index}`
                                        }

                                        aria-hidden="true"

                                        className="
                                            inline-flex
                                            h-10
                                            min-w-8
                                            select-none
                                            items-center
                                            justify-center

                                            px-1

                                            font-mono
                                            text-sm
                                            font-black
                                            tracking-[0.12em]
                                            text-gray-600
                                        "
                                    >
                                        ...
                                    </span>
                                );
                            }


                            // =================================
                            // PAGE
                            // =================================

                            const isCurrent =
                                item ===
                                safeCurrentPage;


                            return (

                                <button
                                    key={
                                        `pagination-page-${item}`
                                    }

                                    type="button"

                                    onClick={() => {

                                        handlePageChange(
                                            item
                                        );
                                    }}

                                    disabled={
                                        disabled
                                    }

                                    aria-label={
                                        isCurrent
                                            ? `${item}-sahifa, joriy sahifa`
                                            : `${item}-sahifaga o‘tish`
                                    }

                                    aria-current={
                                        isCurrent
                                            ? "page"
                                            : undefined
                                    }

                                    className={`
                                        relative

                                        h-10
                                        min-w-10

                                        rounded-xl

                                        border

                                        px-3

                                        text-xs
                                        font-black

                                        transition-all
                                        duration-200

                                        active:scale-[0.95]

                                        disabled:cursor-not-allowed
                                        disabled:opacity-50

                                        ${
                                            isCurrent

                                                ? `
                                                    border-cyan-400/30

                                                    bg-cyan-400/10

                                                    text-cyan-300

                                                    shadow-lg
                                                    shadow-cyan-500/[0.06]
                                                `

                                                : `
                                                    border-white/[0.08]

                                                    bg-[#0b1018]

                                                    text-gray-500

                                                    hover:border-white/[0.15]
                                                    hover:bg-white/[0.025]
                                                    hover:text-white
                                                `
                                        }
                                    `}
                                >

                                    {item}


                                    {/* CURRENT DOT */}

                                    {isCurrent && (

                                        <span
                                            aria-hidden="true"

                                            className="
                                                absolute
                                                -bottom-1
                                                left-1/2

                                                h-1
                                                w-1

                                                -translate-x-1/2

                                                rounded-full

                                                bg-cyan-400

                                                shadow-[0_0_7px_rgba(34,211,238,0.9)]
                                            "
                                        />
                                    )}

                                </button>
                            );
                        }
                    )}


                    {/* =====================================
                        NEXT
                    ====================================== */}

                    <button
                        type="button"

                        onClick={() => {

                            handlePageChange(
                                safeCurrentPage + 1
                            );
                        }}

                        disabled={
                            disabled
                            ||
                            safeCurrentPage >=
                                safeTotalPages
                        }

                        aria-label="Keyingi sahifa"

                        className="
                            grid
                            h-10
                            w-10
                            place-items-center

                            rounded-xl

                            border
                            border-white/[0.08]

                            bg-[#0b1018]

                            text-gray-400

                            transition-all
                            duration-200

                            hover:border-cyan-400/20
                            hover:bg-cyan-500/[0.04]
                            hover:text-cyan-300

                            active:scale-[0.95]

                            disabled:cursor-not-allowed
                            disabled:opacity-30
                        "
                    >

                        <ChevronRight
                            size={17}
                        />

                    </button>

                </nav>
            )}


            {/* =============================================
                PAGE INFO
            ============================================== */}

            <p
                className={`
                    text-center

                    font-mono
                    text-[10px]
                    font-bold
                    uppercase
                    tracking-[0.16em]
                    text-gray-800

                    ${
                        safeTotalPages > 1
                            ? "mt-5"
                            : "mt-8"
                    }
                `}
            >
                page {safeCurrentPage}
                {" / "}
                {safeTotalPages}
                {" · "}
                {safeCount} records
            </p>

        </div>
    );
};


export default React.memo(
    ProblemsPagination
);