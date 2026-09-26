// src/components/my-problems/MyProblemsHeader.jsx

import React from "react";

import {
    Link,
} from "react-router-dom";


const MyProblemsHeader = ({
    totalCount = 0,
}) => {

    return (

        <header
            className="
                mb-10

                text-center

                animate-fade-in-up
            "
        >

            {/* LABEL */}

            <div
                className="
                    mb-4

                    inline-flex
                    items-center

                    gap-2

                    rounded-full

                    border
                    border-purple-400/20

                    bg-purple-500/[0.07]

                    px-3
                    py-1.5

                    text-[10px]
                    font-black

                    uppercase
                    tracking-[0.16em]

                    text-purple-300
                "
            >

                <i
                    className="
                        fas
                        fa-user-shield
                    "
                />

                Personal archive


                <span
                    className="
                        rounded-full

                        bg-black/20

                        px-2
                        py-0.5

                        text-[9px]
                    "
                >
                    {totalCount}
                </span>

            </div>


            {/* TITLE */}

            <h1
                className="
                    text-4xl
                    font-black

                    leading-tight

                    text-white

                    sm:text-5xl

                    lg:text-6xl
                "
            >

                <span
                    className="
                        bg-gradient-to-r
                        from-purple-400
                        to-pink-500

                        bg-clip-text

                        text-transparent
                    "
                >
                    Mening
                </span>

                {" "}Muammolarim

            </h1>


            {/* DESCRIPTION */}

            <p
                className="
                    mx-auto
                    mt-4

                    max-w-3xl

                    text-sm
                    leading-7

                    text-gray-500

                    sm:text-base
                "
            >
                Texnik dunyoga qo‘shgan savollaringiz,
                ularning holati va community bergan
                yechimlarni shu yerdan boshqaring.
            </p>


            {/* ACTIONS */}

            <div
                className="
                    mt-6

                    flex
                    flex-wrap
                    items-center
                    justify-center

                    gap-3
                "
            >

                <Link
                    to="/problem-create"

                    className="
                        inline-flex
                        items-center
                        justify-center

                        gap-2

                        rounded-xl

                        border
                        border-pink-400/20

                        bg-pink-500/90

                        px-5
                        py-3

                        text-sm
                        font-black

                        text-white

                        shadow-lg
                        shadow-pink-500/10

                        transition-all
                        duration-200

                        hover:-translate-y-0.5

                        hover:bg-pink-500
                    "
                >

                    <i
                        className="
                            fas
                            fa-plus-circle
                        "
                    />

                    Yangi muammo

                </Link>


                <Link
                    to="/problems"

                    className="
                        inline-flex
                        items-center
                        justify-center

                        gap-2

                        rounded-xl

                        border
                        border-white/10

                        bg-white/[0.035]

                        px-5
                        py-3

                        text-sm
                        font-black

                        text-gray-300

                        transition-all
                        duration-200

                        hover:border-purple-400/30

                        hover:bg-purple-500/[0.06]

                        hover:text-purple-300
                    "
                >

                    <i
                        className="
                            fas
                            fa-globe
                        "
                    />

                    Barcha muammolar

                </Link>

            </div>

        </header>
    );
};


export default MyProblemsHeader;