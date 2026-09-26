// src/components/projects/ProjectsEmptyState.jsx

import React from "react";

import {
    Ghost,
    SearchX,
    X,
} from "lucide-react";


// =========================================================
// EMPTY STATE
// =========================================================

const ProjectsEmptyState = ({

    searchTerm = "",

    onClearSearch,

}) => {

    const hasSearch =
        Boolean(
            searchTerm
        );


    return (

        <div
            className="
                relative
                overflow-hidden
                rounded-[30px]
                border
                border-white/[0.055]
                bg-[#0b0f15]
                px-6
                py-20
                text-center
            "
        >

            <div
                className="
                    pointer-events-none
                    absolute
                    left-1/2
                    top-1/2
                    h-56
                    w-56
                    -translate-x-1/2
                    -translate-y-1/2
                    rounded-full
                    bg-indigo-500/[0.05]
                    blur-[80px]
                "
            />


            <div
                className="
                    relative
                    z-10
                "
            >

                <div
                    className="
                        mx-auto
                        grid
                        h-20
                        w-20
                        place-items-center
                        rounded-[24px]
                        border
                        border-white/[0.07]
                        bg-white/[0.025]
                        text-gray-700
                    "
                >

                    {hasSearch ? (

                        <SearchX
                            size={31}
                        />

                    ) : (

                        <Ghost
                            size={31}
                        />
                    )}

                </div>


                <p
                    className="
                        mt-5
                        font-mono
                        text-[9px]
                        font-black
                        uppercase
                        tracking-[0.16em]
                        text-gray-700
                    "
                >
                    result://404
                </p>


                <h2
                    className="
                        mt-2
                        text-2xl
                        font-black
                        text-white

                        sm:text-3xl
                    "
                >
                    {hasSearch

                        ? "Hech narsa topilmadi"

                        : "Hali project yo‘q"
                    }
                </h2>


                <p
                    className="
                        mx-auto
                        mt-3
                        max-w-lg
                        text-sm
                        font-medium
                        leading-7
                        text-gray-600
                    "
                >

                    {hasSearch ? (

                        <>
                            “
                            <span
                                className="
                                    font-black
                                    text-gray-400
                                "
                            >
                                {searchTerm}
                            </span>
                            ” bo‘yicha mos loyiha topilmadi.
                        </>

                    ) : (

                        <>
                            Platformada hozircha ko‘rsatiladigan loyiha
                            mavjud emas.
                        </>
                    )}

                </p>


                {hasSearch && (

                    <button
                        type="button"

                        onClick={
                            onClearSearch
                        }

                        className="
                            mt-6
                            inline-flex
                            items-center
                            gap-2
                            rounded-xl
                            border
                            border-indigo-400/20
                            bg-indigo-500/[0.07]
                            px-4
                            py-2.5
                            text-xs
                            font-black
                            text-indigo-300
                            transition

                            hover:bg-indigo-500/[0.13]
                        "
                    >

                        <X
                            size={14}
                        />

                        Qidiruvni tozalash

                    </button>
                )}

            </div>

        </div>
    );
};


export default ProjectsEmptyState;