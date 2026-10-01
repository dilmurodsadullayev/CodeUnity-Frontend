// src/components/problem-detail/ProblemDetailPriority.jsx

import React from "react";

import {
    Clock3,
    Coins,
    Hammer,
    Sparkles,
    Zap,
} from "lucide-react";

import CountdownTimer
    from "../../utils/countdowntimer";

import {
    getProblemDetailPriorityViewModel,
} from "./problemDetailHelpers";


// =========================================================
// PROBLEM DETAIL PRIORITY
// =========================================================

const ProblemDetailPriority = ({
    problemDetail,

    isSolved = false,

    onWork,
}) => {

    // =====================================================
    // CANONICAL PRIORITY VIEW MODEL
    // =====================================================

    const {
        isUrgent,

        offeredCoins,

        deadline,

        hasPriorityInformation,
    } = getProblemDetailPriorityViewModel(
        problemDetail
    );


    // =====================================================
    // CAN WORK
    // =====================================================

    const canWork =
        !isSolved
        &&
        typeof onWork ===
            "function";


    // =====================================================
    // NOTHING TO SHOW
    //
    // Solved problemda:
    //
    // urgent yo‘q
    // coin yo‘q
    // deadline yo‘q
    //
    // bo‘lsa bu sectionning o‘zi kerak emas.
    //
    // MUHIM:
    // unresolved oddiy problemda sectionni yashirmaymiz,
    // chunki "Men ishlayman!" actioni kerak.
    // =====================================================

    if (
        isSolved
        &&
        !hasPriorityInformation
    ) {

        return null;
    }


    // =====================================================
    // JSX
    // =====================================================

    return (

        <section
            aria-label="Muammo ustuvorligi va yechim harakatlari"

            className={`
                mb-8

                flex
                flex-col
                items-stretch
                justify-between
                gap-5

                rounded-3xl

                border

                p-5

                lg:flex-row
                lg:items-center

                ${
                    isUrgent

                        ? `
                            border-red-400/25

                            bg-red-500/[0.07]

                            shadow-xl
                            shadow-red-500/[0.04]
                        `

                        : hasPriorityInformation

                            ? `
                                border-white/10

                                bg-white/[0.035]
                            `

                            : `
                                border-cyan-400/[0.12]

                                bg-cyan-500/[0.035]
                            `
                }
            `}
        >

            {/* =============================================
                LEFT CONTENT
            ============================================== */}

            <div
                className="
                    min-w-0
                    flex-1
                "
            >

                {/* =========================================
                    PRIORITY INFORMATION
                ========================================== */}

                {hasPriorityInformation ? (

                    <>

                        {/* =================================
                            BADGES
                        ================================== */}

                        <div
                            className="
                                flex
                                flex-wrap
                                items-center
                                gap-3
                            "
                        >

                            {/* =============================
                                URGENT
                            ============================== */}

                            {isUrgent && (

                                <div
                                    className="
                                        inline-flex
                                        items-center
                                        gap-2

                                        rounded-full

                                        border
                                        border-red-400/30

                                        bg-red-500/10

                                        px-4
                                        py-2

                                        text-sm
                                        font-black
                                        text-red-300
                                    "
                                >

                                    <Zap
                                        size={15}
                                        aria-hidden="true"
                                    />

                                    Favqulodda muammo

                                </div>
                            )}


                            {/* =============================
                                FCOIN
                            ============================== */}

                            {offeredCoins > 0 && (

                                <div
                                    className="
                                        inline-flex
                                        items-center
                                        gap-2

                                        rounded-full

                                        border
                                        border-yellow-400/30

                                        bg-yellow-400/10

                                        px-4
                                        py-2

                                        text-sm
                                        font-black
                                        text-yellow-300
                                    "
                                >

                                    <Coins
                                        size={15}
                                        aria-hidden="true"
                                    />


                                    <span>

                                        Mukofot:{" "}

                                        {offeredCoins}

                                        {" "}FCoin

                                    </span>

                                </div>
                            )}

                        </div>


                        {/* =================================
                            DEADLINE
                        ================================== */}

                        {deadline && (

                            <div
                                className="
                                    mt-4

                                    w-fit
                                    max-w-full

                                    rounded-[22px]

                                    border
                                    border-indigo-400/20

                                    bg-indigo-500/[0.055]

                                    p-3.5

                                    shadow-lg
                                    shadow-indigo-500/[0.04]
                                "
                            >

                                <div
                                    className="
                                        mb-2.5

                                        flex
                                        items-center
                                        gap-2
                                    "
                                >

                                    <Clock3
                                        size={14}

                                        aria-hidden="true"

                                        className="
                                            shrink-0
                                            text-indigo-300
                                        "
                                    />


                                    <span
                                        className="
                                            text-[10px]
                                            font-black
                                            uppercase
                                            tracking-[0.14em]
                                            text-indigo-300/70
                                        "
                                    >
                                        Muddat
                                    </span>

                                </div>


                                <CountdownTimer
                                    targetDate={
                                        deadline
                                    }

                                    variant="cards"

                                    tone="emerald"

                                    size="sm"

                                    showLabel={
                                        false
                                    }

                                    showIcon={
                                        false
                                    }

                                    expiredText="Muammo muddati tugagan"
                                />


                                <div
                                    className="
                                        mt-2.5

                                        flex
                                        items-center
                                        gap-1.5

                                        text-[8px]
                                        font-semibold
                                        text-indigo-300/40
                                    "
                                >

                                    <Clock3
                                        size={10}

                                        aria-hidden="true"

                                        className="
                                            shrink-0
                                        "
                                    />

                                    Muammo muddati tugashigacha qolgan vaqt

                                </div>

                            </div>
                        )}

                    </>

                ) : (

                    // =====================================
                    // NORMAL PROBLEM
                    //
                    // Priority metadata bo‘lmasa ham
                    // work CTA yo‘qolmasligi kerak.
                    // =====================================

                    <div
                        className="
                            flex
                            items-start
                            gap-3
                        "
                    >

                        <div
                            className="
                                flex
                                h-10
                                w-10
                                shrink-0
                                items-center
                                justify-center

                                rounded-2xl

                                border
                                border-cyan-400/15

                                bg-cyan-500/[0.07]

                                text-cyan-300
                            "
                        >

                            <Sparkles
                                size={17}
                                aria-hidden="true"
                            />

                        </div>


                        <div
                            className="
                                min-w-0
                            "
                        >

                            <p
                                className="
                                    text-sm
                                    font-black
                                    text-white
                                "
                            >
                                Yechim topa olasizmi?
                            </p>


                            <p
                                className="
                                    mt-1

                                    max-w-xl

                                    text-xs
                                    font-medium
                                    leading-5
                                    text-gray-500
                                "
                            >
                                Muammoni tahlil qiling va o‘z yechimingizni
                                hamjamiyat bilan ulashing.
                            </p>

                        </div>

                    </div>
                )}

            </div>


            {/* =============================================
                WORK ACTION
            ============================================== */}

            {!isSolved && (

                <button
                    type="button"

                    onClick={
                        onWork
                    }

                    disabled={
                        !canWork
                    }

                    className="
                        inline-flex
                        min-h-[46px]
                        w-full
                        shrink-0
                        items-center
                        justify-center
                        gap-2

                        rounded-2xl

                        bg-gradient-to-r
                        from-cyan-500
                        to-indigo-600

                        px-6
                        py-3

                        text-sm
                        font-black
                        text-white

                        shadow-lg
                        shadow-cyan-500/20

                        transition-all
                        duration-200

                        hover:-translate-y-0.5
                        hover:shadow-cyan-500/40

                        active:translate-y-0
                        active:scale-[0.98]

                        disabled:cursor-not-allowed
                        disabled:opacity-40
                        disabled:hover:translate-y-0
                        disabled:hover:shadow-cyan-500/20

                        lg:w-auto
                    "
                >

                    <Hammer
                        size={16}
                        aria-hidden="true"
                    />

                    Men ishlayman!

                </button>
            )}

        </section>
    );
};


export default React.memo(
    ProblemDetailPriority
);