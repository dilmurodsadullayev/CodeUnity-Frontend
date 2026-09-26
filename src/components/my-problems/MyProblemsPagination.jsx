// src/components/my-problems/MyProblemsPagination.jsx

import React from "react";


const MyProblemsPagination = ({
    currentPage,

    totalPages,

    items,

    onPageChange,

    isLoading = false,
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
                mt-12

                flex
                flex-wrap
                items-center
                justify-center

                gap-2

                animate-fade-in-up
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
                    h-10
                    w-10

                    place-items-center

                    rounded-xl

                    border
                    border-white/10

                    bg-white/[0.025]

                    text-gray-500

                    transition-all

                    hover:border-purple-400/30

                    hover:bg-purple-500/[0.07]

                    hover:text-purple-300

                    disabled:cursor-not-allowed

                    disabled:opacity-30
                "
            >

                <i
                    className="
                        fas
                        fa-chevron-left
                    "
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
                                    h-10
                                    w-8

                                    place-items-center

                                    text-gray-700
                                "
                            >
                                ...
                            </span>
                        );
                    }


                    const active =
                        currentPage ===
                        item;


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
                                h-10
                                min-w-10

                                place-items-center

                                rounded-xl

                                border

                                px-3

                                text-sm
                                font-black

                                transition-all

                                ${
                                    active

                                        ? (
                                            "border-purple-400/40 "
                                            +
                                            "bg-purple-500/20 "
                                            +
                                            "text-purple-200 "
                                            +
                                            "shadow-lg "
                                            +
                                            "shadow-purple-500/10"
                                        )

                                        : (
                                            "border-white/10 "
                                            +
                                            "bg-white/[0.025] "
                                            +
                                            "text-gray-500 "
                                            +
                                            "hover:border-purple-400/30 "
                                            +
                                            "hover:text-purple-300"
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
                    h-10
                    w-10

                    place-items-center

                    rounded-xl

                    border
                    border-white/10

                    bg-white/[0.025]

                    text-gray-500

                    transition-all

                    hover:border-purple-400/30

                    hover:bg-purple-500/[0.07]

                    hover:text-purple-300

                    disabled:cursor-not-allowed

                    disabled:opacity-30
                "
            >

                <i
                    className="
                        fas
                        fa-chevron-right
                    "
                />

            </button>

        </div>
    );
};


export default MyProblemsPagination;