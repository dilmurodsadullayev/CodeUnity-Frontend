// src/components/my-problems/MyProblemsEmptyState.jsx

import React from "react";

import {
    Link,
} from "react-router-dom";


const MyProblemsEmptyState = ({
    searchTerm = "",
    onClearSearch,
}) => {

    const hasSearch =
        Boolean(
            searchTerm.trim()
        );


    return (

        <div
            className="
                col-span-full

                rounded-3xl

                border
                border-dashed
                border-purple-400/20

                bg-[#0d1117]

                px-6
                py-14

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
                    border-purple-400/20

                    bg-purple-500/[0.07]

                    text-xl

                    text-purple-300
                "
            >

                <i
                    className={
                        hasSearch
                            ? "fas fa-magnifying-glass"
                            : "fas fa-box-open"
                    }
                />

            </div>


            <h3
                className="
                    mt-4

                    text-lg
                    font-black

                    text-gray-200
                "
            >
                {
                    hasSearch

                        ? "Qidiruv bo‘yicha muammo topilmadi"

                        : "Hali muammo joylamagansiz"
                }
            </h3>


            <p
                className="
                    mx-auto
                    mt-2

                    max-w-md

                    text-sm
                    leading-6

                    text-gray-500
                "
            >
                {
                    hasSearch

                        ? (
                            `"${searchTerm}" so‘roviga mos `
                            +
                            "muammo topilmadi."
                        )

                        : (
                            "Birinchi muammoingizni community "
                            +
                            "bilan ulashing va yechimlarni kuzating."
                        )
                }
            </p>


            {hasSearch ? (

                <button
                    type="button"

                    onClick={
                        onClearSearch
                    }

                    className="
                        mt-5

                        inline-flex
                        items-center

                        gap-2

                        rounded-xl

                        border
                        border-purple-400/20

                        bg-purple-500/[0.07]

                        px-4
                        py-2.5

                        text-xs
                        font-black

                        text-purple-300

                        transition-all

                        hover:bg-purple-500/[0.12]
                    "
                >

                    <i
                        className="
                            fas
                            fa-rotate-left
                        "
                    />

                    Qidiruvni tozalash

                </button>

            ) : (

                <Link
                    to="/problem-create"

                    className="
                        mt-5

                        inline-flex
                        items-center

                        gap-2

                        rounded-xl

                        border
                        border-pink-400/20

                        bg-pink-500/[0.09]

                        px-4
                        py-2.5

                        text-xs
                        font-black

                        text-pink-300

                        transition-all

                        hover:bg-pink-500/[0.15]
                    "
                >

                    <i
                        className="
                            fas
                            fa-pencil
                        "
                    />

                    Birinchi muammoni qo‘shish

                </Link>

            )}

        </div>
    );
};


export default MyProblemsEmptyState;