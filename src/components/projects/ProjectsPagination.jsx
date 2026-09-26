// src/components/projects/ProjectsPagination.jsx

import React from "react";

import {
    ChevronLeft,
    ChevronRight,
} from "lucide-react";


const ProjectsPagination = ({
    currentPage,

    totalPages,

    items,

    isLoading,

    onPageChange,
}) => {

    if (
        totalPages <=
        1
    ) {

        return null;
    }


    return (

        <div
            className="
                mt-8

                flex
                flex-col
                items-center
                justify-between

                gap-4

                rounded-2xl

                border
                border-white/[0.06]

                bg-[#0d1117]

                px-4
                py-3

                sm:flex-row
            "
        >

            <p
                className="
                    font-mono

                    text-[8px]
                    font-bold

                    uppercase
                    tracking-[0.12em]

                    text-gray-700
                "
            >
                page://

                <span
                    className="
                        ml-1

                        text-gray-400
                    "
                >
                    {currentPage}
                </span>

                <span
                    className="
                        mx-1
                    "
                >
                    /
                </span>

                {totalPages}
            </p>


            <div
                className="
                    flex
                    items-center

                    gap-1
                "
            >

                {/* PREVIOUS */}

                <button
                    type="button"

                    disabled={
                        currentPage <=
                        1
                        ||
                        isLoading
                    }

                    onClick={
                        () => {

                            onPageChange(
                                currentPage -
                                1
                            );
                        }
                    }

                    className="
                        grid
                        h-8
                        w-8
                        place-items-center

                        rounded-lg

                        border
                        border-white/[0.06]

                        text-gray-500

                        transition-all

                        hover:border-cyan-400/20
                        hover:bg-cyan-500/[0.04]
                        hover:text-cyan-300

                        disabled:cursor-not-allowed
                        disabled:opacity-25
                    "
                >

                    <ChevronLeft
                        size={13}
                    />

                </button>


                {/* PAGES */}

                {items.map(
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
                                        h-8
                                        w-7
                                        place-items-center

                                        text-[10px]

                                        text-gray-700
                                    "
                                >
                                    ...
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

                                disabled={
                                    isLoading
                                }

                                onClick={
                                    () => {

                                        onPageChange(
                                            item
                                        );
                                    }
                                }

                                className={`
                                    grid
                                    h-8
                                    min-w-8
                                    place-items-center

                                    rounded-lg

                                    border

                                    px-2

                                    font-mono

                                    text-[9px]
                                    font-black

                                    transition-all

                                    ${
                                        active

                                            ? (
                                                "border-cyan-400/25 "
                                                +
                                                "bg-cyan-500/[0.08] "
                                                +
                                                "text-cyan-300"
                                            )

                                            : (
                                                "border-white/[0.06] "
                                                +
                                                "text-gray-600 "
                                                +
                                                "hover:border-white/[0.12] "
                                                +
                                                "hover:text-gray-300"
                                            )
                                    }

                                    disabled:cursor-not-allowed
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

                    disabled={
                        currentPage >=
                        totalPages
                        ||
                        isLoading
                    }

                    onClick={
                        () => {

                            onPageChange(
                                currentPage +
                                1
                            );
                        }
                    }

                    className="
                        grid
                        h-8
                        w-8
                        place-items-center

                        rounded-lg

                        border
                        border-white/[0.06]

                        text-gray-500

                        transition-all

                        hover:border-cyan-400/20
                        hover:bg-cyan-500/[0.04]
                        hover:text-cyan-300

                        disabled:cursor-not-allowed
                        disabled:opacity-25
                    "
                >

                    <ChevronRight
                        size={13}
                    />

                </button>

            </div>

        </div>
    );
};


export default ProjectsPagination;