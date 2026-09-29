// src/components/problems-page/ProblemsEmptyState.jsx

import React from "react";

import {
    Link,
} from "react-router-dom";

import {
    Plus,
    RotateCcw,
    Search,
    TerminalSquare,
} from "lucide-react";


// =========================================================
// PROBLEMS EMPTY STATE
// =========================================================

const ProblemsEmptyState = ({
    hasActiveFilters = false,
    onResetFilters,
    createHref = "/problem-create",
}) => {

    // =====================================================
    // FILTERED EMPTY STATE
    // =====================================================

    if (
        hasActiveFilters
    ) {

        return (

            <div
                className="
                    col-span-full

                    relative
                    overflow-hidden

                    rounded-[28px]

                    border
                    border-dashed
                    border-cyan-400/15

                    bg-[#090e18]/80

                    px-6
                    py-14

                    text-center

                    shadow-xl
                    shadow-black/10
                "
            >

                {/* =========================================
                    BACKGROUND GLOW
                ========================================== */}

                <div
                    className="
                        pointer-events-none

                        absolute
                        left-1/2
                        top-0

                        h-48
                        w-80

                        -translate-x-1/2
                        -translate-y-1/2

                        rounded-full

                        bg-cyan-500/[0.07]

                        blur-[80px]
                    "
                />


                {/* =========================================
                    ICON
                ========================================== */}

                <div
                    className="
                        relative

                        mx-auto

                        grid
                        h-16
                        w-16
                        place-items-center

                        rounded-[20px]

                        border
                        border-cyan-400/15

                        bg-cyan-500/[0.055]

                        text-cyan-300

                        shadow-lg
                        shadow-cyan-950/10
                    "
                >

                    <Search
                        size={26}
                    />

                </div>


                {/* =========================================
                    SYSTEM LABEL
                ========================================== */}

                <div
                    className="
                        relative

                        mt-5

                        inline-flex
                        items-center
                        gap-2

                        rounded-full

                        border
                        border-cyan-400/10

                        bg-cyan-500/[0.035]

                        px-3
                        py-1

                        font-mono
                        text-[9px]
                        font-black
                        uppercase
                        tracking-[0.18em]
                        text-cyan-400/60
                    "
                >

                    <span
                        className="
                            h-1.5
                            w-1.5

                            rounded-full

                            bg-cyan-400
                        "
                    />

                    query.empty

                </div>


                {/* =========================================
                    TITLE
                ========================================== */}

                <h3
                    className="
                        relative

                        mt-4

                        text-xl
                        font-black
                        tracking-tight
                        text-white

                        sm:text-2xl
                    "
                >
                    Mos muammo topilmadi
                </h3>


                {/* =========================================
                    DESCRIPTION
                ========================================== */}

                <p
                    className="
                        relative

                        mx-auto
                        mt-3
                        max-w-md

                        text-sm
                        font-medium
                        leading-6
                        text-gray-600
                    "
                >
                    Qidiruv yoki tanlangan filtrlar
                    bo‘yicha hech qanday muammo topilmadi.
                    Boshqa parametrlarni sinab ko‘ring.
                </p>


                {/* =========================================
                    RESET
                ========================================== */}

                <button
                    type="button"

                    onClick={
                        onResetFilters
                    }

                    className="
                        relative

                        mt-6

                        inline-flex
                        min-h-[44px]
                        items-center
                        justify-center
                        gap-2

                        rounded-xl

                        border
                        border-cyan-400/20

                        bg-cyan-400/[0.07]

                        px-5
                        py-2.5

                        text-xs
                        font-black
                        text-cyan-300

                        transition-all
                        duration-200

                        hover:border-cyan-400/30
                        hover:bg-cyan-400/[0.12]

                        active:scale-[0.97]
                    "
                >

                    <RotateCcw
                        size={14}
                    />

                    Filtrlarni tozalash

                </button>

            </div>
        );
    }


    // =====================================================
    // TRUE EMPTY DATABASE STATE
    // =====================================================

    return (

        <div
            className="
                col-span-full

                relative
                overflow-hidden

                rounded-[28px]

                border
                border-dashed
                border-white/[0.10]

                bg-[#090e18]/80

                px-6
                py-14

                text-center

                shadow-xl
                shadow-black/10
            "
        >

            {/* =============================================
                BACKGROUND
            ============================================== */}

            <div
                className="
                    pointer-events-none

                    absolute
                    left-1/2
                    top-0

                    h-48
                    w-80

                    -translate-x-1/2
                    -translate-y-1/2

                    rounded-full

                    bg-indigo-500/[0.08]

                    blur-[85px]
                "
            />


            {/* =============================================
                ICON
            ============================================== */}

            <div
                className="
                    relative

                    mx-auto

                    grid
                    h-16
                    w-16
                    place-items-center

                    rounded-[20px]

                    border
                    border-indigo-400/15

                    bg-indigo-500/[0.06]

                    text-indigo-300

                    shadow-lg
                    shadow-indigo-950/10
                "
            >

                <TerminalSquare
                    size={27}
                />

            </div>


            {/* =============================================
                SYSTEM LABEL
            ============================================== */}

            <div
                className="
                    relative

                    mt-5

                    inline-flex
                    items-center
                    gap-2

                    rounded-full

                    border
                    border-indigo-400/10

                    bg-indigo-500/[0.035]

                    px-3
                    py-1

                    font-mono
                    text-[9px]
                    font-black
                    uppercase
                    tracking-[0.18em]
                    text-indigo-400/60
                "
            >

                <span
                    className="
                        h-1.5
                        w-1.5

                        rounded-full

                        bg-indigo-400
                    "
                />

                registry.empty

            </div>


            {/* =============================================
                TITLE
            ============================================== */}

            <h3
                className="
                    relative

                    mt-4

                    text-xl
                    font-black
                    tracking-tight
                    text-white

                    sm:text-2xl
                "
            >
                Hozircha muammolar mavjud emas
            </h3>


            {/* =============================================
                DESCRIPTION
            ============================================== */}

            <p
                className="
                    relative

                    mx-auto
                    mt-3
                    max-w-lg

                    text-sm
                    font-medium
                    leading-6
                    text-gray-600
                "
            >
                Community hali birorta muammo joylamagan.
                Birinchi muammoni siz ulashing va
                F.Society bilim bazasini boshlang.
            </p>


            {/* =============================================
                CREATE
            ============================================== */}

            <Link
                to={
                    createHref
                }

                className="
                    relative

                    mt-6

                    inline-flex
                    min-h-[44px]
                    items-center
                    justify-center
                    gap-2

                    rounded-xl

                    border
                    border-indigo-400/25

                    bg-gradient-to-r
                    from-indigo-600
                    to-purple-600

                    px-5
                    py-2.5

                    text-xs
                    font-black
                    text-white

                    shadow-lg
                    shadow-indigo-950/20

                    transition-all
                    duration-200

                    hover:-translate-y-0.5
                    hover:from-indigo-500
                    hover:to-purple-500

                    active:translate-y-0
                    active:scale-[0.97]
                "
            >

                <Plus
                    size={15}
                />

                Birinchi muammoni yarating

            </Link>

        </div>
    );
};


export default React.memo(
    ProblemsEmptyState
);