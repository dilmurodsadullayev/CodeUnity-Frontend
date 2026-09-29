// src/components/problems-page/ProblemsHeader.jsx

import React from "react";


// =========================================================
// PROBLEMS HEADER
// =========================================================

const ProblemsHeader = () => {

    return (

        <header
            className="
                relative
                mx-auto
                max-w-4xl
                text-center
            "
        >

            {/* =============================================
                AMBIENT GLOW
            ============================================== */}

            <div
                className="
                    pointer-events-none
                    absolute
                    left-1/2
                    top-0

                    h-48
                    w-[70%]

                    -translate-x-1/2

                    rounded-full

                    bg-gradient-to-r
                    from-cyan-500/[0.08]
                    via-indigo-500/[0.08]
                    to-purple-500/[0.08]

                    blur-[90px]
                "
            />


            <div
                className="
                    relative
                    z-10
                    animate-fade-in-up
                "
            >

                {/* =========================================
                    SYSTEM BADGE
                ========================================== */}

                <div
                    className="
                        mx-auto
                        mb-4

                        inline-flex
                        items-center
                        gap-2

                        rounded-full

                        border
                        border-cyan-400/15

                        bg-cyan-400/[0.06]

                        px-3
                        py-1.5

                        font-mono
                        text-[10px]
                        font-black
                        uppercase
                        tracking-[0.22em]
                        text-cyan-300

                        shadow-lg
                        shadow-cyan-950/10
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
                                opacity-30
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

                                shadow-[0_0_10px_rgba(52,211,153,0.8)]
                            "
                        />
                    </span>

                    fsociety://problems
                </div>


                {/* =========================================
                    TITLE
                ========================================== */}

                <h1
                    className="
                        text-4xl
                        font-black
                        leading-tight
                        tracking-tight
                        text-white

                        sm:text-5xl

                        lg:text-6xl
                    "
                >
                    Muammolar{" "}

                    <span
                        className="
                            bg-gradient-to-r
                            from-purple-400
                            via-indigo-400
                            to-cyan-400

                            bg-clip-text
                            text-transparent
                        "
                    >
                        Markazi
                    </span>
                </h1>


                {/* =========================================
                    DESCRIPTION
                ========================================== */}

                <p
                    className="
                        mx-auto
                        mt-4
                        max-w-2xl

                        text-sm
                        font-medium
                        leading-7
                        text-gray-500

                        sm:text-base

                        lg:text-lg
                    "
                >
                    Dasturchilar muammolarini ulashadi,
                    community yechim beradi va eng foydali
                    javoblar bilim bazasiga aylanadi.
                </p>


                {/* =========================================
                    MINI STATUS
                ========================================== */}

                <div
                    className="
                        mt-5

                        flex
                        flex-wrap
                        items-center
                        justify-center
                        gap-x-4
                        gap-y-2

                        font-mono
                        text-[9px]
                        font-black
                        uppercase
                        tracking-[0.16em]
                        text-gray-700
                    "
                >
                    <span
                        className="
                            inline-flex
                            items-center
                            gap-1.5
                        "
                    >
                        <span
                            className="
                                h-1
                                w-1
                                rounded-full
                                bg-cyan-400
                            "
                        />

                        Search
                    </span>


                    <span
                        className="
                            inline-flex
                            items-center
                            gap-1.5
                        "
                    >
                        <span
                            className="
                                h-1
                                w-1
                                rounded-full
                                bg-indigo-400
                            "
                        />

                        Filter
                    </span>


                    <span
                        className="
                            inline-flex
                            items-center
                            gap-1.5
                        "
                    >
                        <span
                            className="
                                h-1
                                w-1
                                rounded-full
                                bg-purple-400
                            "
                        />

                        Sort
                    </span>


                    <span
                        className="
                            inline-flex
                            items-center
                            gap-1.5
                        "
                    >
                        <span
                            className="
                                h-1
                                w-1
                                rounded-full
                                bg-emerald-400
                            "
                        />

                        Solve
                    </span>
                </div>
            </div>
        </header>
    );
};


export default React.memo(
    ProblemsHeader
);