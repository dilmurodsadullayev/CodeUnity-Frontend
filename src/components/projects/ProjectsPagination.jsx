// src/components/projects/ProjectsPagination.jsx

import React, {
    useMemo,
} from "react";

import {
    ChevronLeft,
    ChevronRight,
} from "lucide-react";


// =========================================================
// PAGINATION ITEMS
// =========================================================

const getPaginationItems = (
    currentPage,
    totalPages
) => {

    if (
        totalPages <=
        7
    ) {

        return Array.from(
            {
                length:
                    totalPages,
            },
            (
                _,
                index
            ) =>
            index +
            1
        );
    }


    const items = [
        1,
    ];


    if (
        currentPage >
        4
    ) {

        items.push(
            "ellipsis-left"
        );
    }


    const startPage =
        Math.max(
            2,
            currentPage -
            1
        );


    const endPage =
        Math.min(
            totalPages -
            1,
            currentPage +
            1
        );


    for (
        let page = startPage;
        page <= endPage;
        page += 1
    ) {

        items.push(
            page
        );
    }


    if (
        currentPage <
        totalPages -
        3
    ) {

        items.push(
            "ellipsis-right"
        );
    }


    items.push(
        totalPages
    );


    return items;
};


// =========================================================
// PROJECTS PAGINATION
// =========================================================

const ProjectsPagination = ({

    currentPage,

    totalPages,

    count,

    rangeStart,

    rangeEnd,

    hasPrevious,

    hasNext,

    isLoading,

    hasError,

    onPageChange,

}) => {

    const pageItems =
        useMemo(
            () => {

                return getPaginationItems(
                    currentPage,
                    totalPages
                );

            },
            [
                currentPage,
                totalPages,
            ]
        );


    if (
        isLoading
        ||
        hasError
        ||
        totalPages <=
        1
    ) {

        return null;
    }


    return (

        <div
            className="
                mt-12
                flex
                flex-col
                items-center
                gap-4
            "
        >

            {/* =================================================
                PAGINATION PANEL
            ================================================== */}

            <div
                className="
                    flex
                    flex-wrap
                    items-center
                    justify-center
                    gap-1.5
                    rounded-2xl
                    border
                    border-white/[0.06]
                    bg-[#0b0f15]/90
                    p-2
                    shadow-[0_18px_50px_rgba(0,0,0,0.25)]
                    backdrop-blur-xl
                "
            >

                {/* PREVIOUS */}

                <button
                    type="button"

                    onClick={
                        () =>
                        onPageChange(
                            currentPage -
                            1
                        )
                    }

                    disabled={
                        !hasPrevious
                        ||
                        currentPage <=
                        1
                    }

                    className="
                        inline-flex
                        h-10
                        items-center
                        justify-center
                        gap-1.5
                        rounded-xl
                        border
                        border-transparent
                        px-3
                        text-xs
                        font-black
                        text-gray-500
                        transition

                        hover:border-white/[0.07]
                        hover:bg-white/[0.04]
                        hover:text-white

                        disabled:cursor-not-allowed
                        disabled:opacity-25
                    "
                >

                    <ChevronLeft
                        size={16}
                    />

                    <span
                        className="
                            hidden

                            sm:inline
                        "
                    >
                        Oldingi
                    </span>

                </button>


                {/* PAGES */}

                {pageItems.map(
                    (
                        item
                    ) => {

                        if (
                            typeof item !==
                            "number"
                        ) {

                            return (

                                <span
                                    key={
                                        item
                                    }

                                    className="
                                        grid
                                        h-10
                                        w-8
                                        place-items-center
                                        font-mono
                                        text-xs
                                        font-black
                                        text-gray-700
                                    "
                                >
                                    …
                                </span>
                            );
                        }


                        const active =
                            item ===
                            currentPage;


                        return (

                            <button
                                key={
                                    item
                                }

                                type="button"

                                onClick={
                                    () =>
                                    onPageChange(
                                        item
                                    )
                                }

                                aria-current={
                                    active

                                        ? "page"

                                        : undefined
                                }

                                className={`
                                    grid
                                    h-10
                                    min-w-10
                                    place-items-center
                                    rounded-xl
                                    border
                                    px-3
                                    font-mono
                                    text-xs
                                    font-black
                                    transition-all

                                    ${
                                        active

                                            ? (
                                                "border-indigo-400/30 "
                                                +
                                                "bg-indigo-600 "
                                                +
                                                "text-white "
                                                +
                                                "shadow-lg "
                                                +
                                                "shadow-indigo-600/20"
                                            )

                                            : (
                                                "border-transparent "
                                                +
                                                "text-gray-500 "
                                                +
                                                "hover:border-white/[0.07] "
                                                +
                                                "hover:bg-white/[0.04] "
                                                +
                                                "hover:text-white"
                                            )
                                    }
                                `}
                            >
                                {item}
                            </button>
                        );
                    }
                )}


                {/* NEXT */}

                <button
                    type="button"

                    onClick={
                        () =>
                        onPageChange(
                            currentPage +
                            1
                        )
                    }

                    disabled={
                        !hasNext
                        ||
                        currentPage >=
                        totalPages
                    }

                    className="
                        inline-flex
                        h-10
                        items-center
                        justify-center
                        gap-1.5
                        rounded-xl
                        border
                        border-transparent
                        px-3
                        text-xs
                        font-black
                        text-gray-500
                        transition

                        hover:border-white/[0.07]
                        hover:bg-white/[0.04]
                        hover:text-white

                        disabled:cursor-not-allowed
                        disabled:opacity-25
                    "
                >

                    <span
                        className="
                            hidden

                            sm:inline
                        "
                    >
                        Keyingi
                    </span>


                    <ChevronRight
                        size={16}
                    />

                </button>

            </div>


            {/* INFO */}

            <p
                className="
                    font-mono
                    text-[9px]
                    font-semibold
                    text-gray-700
                "
            >
                showing {rangeStart}–{rangeEnd} / {count}
            </p>

        </div>
    );
};


export default ProjectsPagination;